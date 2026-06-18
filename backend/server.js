const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'gullygang123!',
};

let pool;

async function initDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('CREATE DATABASE IF NOT EXISTS fastag_db');
    await connection.query('USE fastag_db');
    
    pool = mysql.createPool({
      ...dbConfig,
      database: 'fastag_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mobile VARCHAR(20),
        pan VARCHAR(20),
        panName VARCHAR(100),
        dob VARCHAR(20),
        vehicleType VARCHAR(50),
        vehicleNumber VARCHAR(50),
        vcType VARCHAR(50),
        chassisNumber VARCHAR(100),
        engineNumber VARCHAR(100),
        ownerName VARCHAR(100),
        fuelType VARCHAR(50),
        stateOfRegistration VARCHAR(100),
        pincode VARCHAR(10),
        panFile VARCHAR(255),
        rcFront VARCHAR(255),
        rcBack VARCHAR(255),
        vehicleFront VARCHAR(255),
        vehicleSide VARCHAR(255),
        tagImage VARCHAR(255),
        submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);

    try {
      await pool.query('ALTER TABLE applications ADD COLUMN status VARCHAR(20) DEFAULT "Pending"');
    } catch (e) {
      // Ignore if column already exists
    }

    console.log('Database connected and table ready.');
  } catch (err) {
    console.error('DB Init Error:', err.message);
  }
}

initDB();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const fileFields = [
  { name: 'panFile', maxCount: 1 },
  { name: 'rcFront', maxCount: 1 },
  { name: 'rcBack', maxCount: 1 },
  { name: 'vehicleFront', maxCount: 1 },
  { name: 'vehicleSide', maxCount: 1 },
  { name: 'tagImage', maxCount: 1 }
];

app.get('/api/applications', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'DB not ready' });
    const [rows] = await pool.query('SELECT * FROM applications ORDER BY submittedAt DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/applications', upload.fields(fileFields), async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ error: 'DB not ready' });

    let bodyData = req.body;

    const filePaths = {
      panFile: req.files['panFile'] ? req.files['panFile'][0].filename : null,
      rcFront: req.files['rcFront'] ? req.files['rcFront'][0].filename : null,
      rcBack: req.files['rcBack'] ? req.files['rcBack'][0].filename : null,
      vehicleFront: req.files['vehicleFront'] ? req.files['vehicleFront'][0].filename : null,
      vehicleSide: req.files['vehicleSide'] ? req.files['vehicleSide'][0].filename : null,
      tagImage: req.files['tagImage'] ? req.files['tagImage'][0].filename : null,
    };

    const q = `
      INSERT INTO applications (
        mobile, pan, panName, dob, vehicleType, vehicleNumber, vcType,
        chassisNumber, engineNumber, ownerName, fuelType, stateOfRegistration, pincode,
        panFile, rcFront, rcBack, vehicleFront, vehicleSide, tagImage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // To handle chassis parts gracefully if they somehow came joined or separate
    let chassis = bodyData.chassisNumber || (bodyData.chassisP1 ? `${bodyData.chassisP1}-${bodyData.chassisP2}-${bodyData.chassisP3}` : '');

    const values = [
      bodyData.mobile, bodyData.pan, bodyData.panName, bodyData.dob, bodyData.vehicleType, bodyData.vehicleNumber, bodyData.vcType,
      chassis, bodyData.engineNumber, bodyData.ownerName, bodyData.fuelType, bodyData.stateOfRegistration, bodyData.pincode,
      filePaths.panFile, filePaths.rcFront, filePaths.rcBack, filePaths.vehicleFront, filePaths.vehicleSide, filePaths.tagImage
    ];

    const [result] = await pool.query(q, values);
    res.json({ message: 'Saved!', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Save failed' });
  }
});

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

app.listen(PORT, () => console.log(`Backend parsing data properly on : ${PORT}`));
