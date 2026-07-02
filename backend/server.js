require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'fastag_db',
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function initDB() {
  try {
    pool = mysql.createPool(dbConfig);

    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'fastag_db'}\``);
    await pool.query(`USE \`${process.env.DB_NAME || 'fastag_db'}\``);

    // Images stored as LONGTEXT (base64 data URI)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mobile VARCHAR(20),
        pan VARCHAR(20),
        panName VARCHAR(100),
        dob VARCHAR(20),
        vehicleType VARCHAR(50),
        vehicleNumber VARCHAR(50),
        chassisNumber VARCHAR(100),
        engineNumber VARCHAR(100),
        ownerName VARCHAR(100),
        fuelType VARCHAR(50),
        stateOfRegistration VARCHAR(100),
        pincode VARCHAR(10),
        panFile LONGTEXT,
        rcFront LONGTEXT,
        rcBack LONGTEXT,
        vehicleFront LONGTEXT,
        vehicleSide LONGTEXT,
        tagImage LONGTEXT,
        city VARCHAR(100),
        color VARCHAR(50),
        vehicleDescriptor VARCHAR(100),
        barcode VARCHAR(100),
        isCommercial VARCHAR(10),
        vcCode VARCHAR(10),
        vcType VARCHAR(100),
        status VARCHAR(20) DEFAULT 'Pending',
        submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);

    // Force alter in case they were created as VARCHAR(255) previously
    try {
      await pool.query('ALTER TABLE applications MODIFY panFile LONGTEXT, MODIFY rcFront LONGTEXT, MODIFY rcBack LONGTEXT, MODIFY vehicleFront LONGTEXT, MODIFY vehicleSide LONGTEXT, MODIFY tagImage LONGTEXT;');
    } catch(e) {
      console.log('Alter table skipped or failed (might already be longtext)');
    }

    console.log('TiDB connected and table ready.');
  } catch (err) {
    console.error('DB Init Error:', err.message);
  }
}

initDB();

// Use memory storage — no files saved to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file
});

const fileFields = [
  { name: 'panFile', maxCount: 1 },
  { name: 'rcFront', maxCount: 1 },
  { name: 'rcBack', maxCount: 1 },
  { name: 'vehicleFront', maxCount: 1 },
  { name: 'vehicleSide', maxCount: 1 },
  { name: 'tagImage', maxCount: 1 }
];

// Helper: convert buffer to base64 data URI
function toBase64(file) {
  if (!file) return null;
  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
}

// ─── COUNT ───────────────────────────────────────────────────────────────────
app.get('/api/applications/count', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'DB not ready' });
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM applications');
    res.json({ total: rows[0].total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET ALL (paginated, without image blobs for speed) ───────────────────────
app.get('/api/applications', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'DB not ready' });
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    // Exclude heavy image columns from list view
    const [rows] = await pool.query(
      `SELECT id, mobile, pan, panName, dob, vehicleType, vehicleNumber,
              chassisNumber, engineNumber, ownerName, fuelType,
              stateOfRegistration, pincode, city, color, vehicleDescriptor,
              barcode, isCommercial, vcCode, vcType, status, submittedAt
       FROM applications ORDER BY submittedAt DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET SINGLE (with images) ─────────────────────────────────────────────────
app.get('/api/applications/:id', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'DB not ready' });
    const [rows] = await pool.query('SELECT * FROM applications WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── CREATE ───────────────────────────────────────────────────────────────────
app.post('/api/applications', upload.fields(fileFields), async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'DB not ready' });

    const b = req.body;
    const f = req.files || {};

    const base64Files = {
      panFile:      toBase64(f['panFile']?.[0]),
      rcFront:      toBase64(f['rcFront']?.[0]),
      rcBack:       toBase64(f['rcBack']?.[0]),
      vehicleFront: toBase64(f['vehicleFront']?.[0]),
      vehicleSide:  toBase64(f['vehicleSide']?.[0]),
      tagImage:     toBase64(f['tagImage']?.[0]),
    };

    const chassis = b.chassisNumber || (b.chassisP1 ? `${b.chassisP1}-${b.chassisP2}-${b.chassisP3}` : '');

    const q = `
      INSERT INTO applications (
        mobile, pan, panName, dob, vehicleType, vehicleNumber, vcType,
        chassisNumber, engineNumber, ownerName, fuelType, stateOfRegistration, pincode,
        panFile, rcFront, rcBack, vehicleFront, vehicleSide, tagImage,
        city, color, vehicleDescriptor, barcode, isCommercial, vcCode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      b.mobile, b.pan, b.panName, b.dob,
      b.vehicleType, b.vehicleNumber, b.vcType,
      chassis, b.engineNumber, b.ownerName,
      b.fuelType, b.stateOfRegistration, b.pincode,
      base64Files.panFile, base64Files.rcFront, base64Files.rcBack,
      base64Files.vehicleFront, base64Files.vehicleSide, base64Files.tagImage,
      b.city || '', b.color || '', b.vehicleDescriptor || '',
      b.barcode || '', b.isCommercial || '', b.vcCode || ''
    ];

    const [result] = await pool.query(q, values);
    res.json({ message: 'Saved!', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Save failed' });
  }
});

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'DB not ready' });
    const { id } = req.params;
    const { status } = req.body;
    await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ─── DELETE ───────────────────────────────────────────────────────────────────
app.delete('/api/applications/:id', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'DB not ready' });
    const { id } = req.params;
    await pool.query('DELETE FROM applications WHERE id = ?', [id]);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

app.listen(PORT, () => console.log(`Backend running on port: ${PORT}`));
