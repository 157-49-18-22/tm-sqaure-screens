import { useState, useEffect } from 'react';
import './Dashboard.css';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
    <div className="stat-bg-icon">{icon}</div>
  </div>
);

function ApplicationModal({ app, onClose, onRefresh }) {
  if (!app) return null;

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const backendUrl = `${API_BASE}/uploads/`;
  const images = [
    { label: 'PAN Card', file: app.panFile },
    { label: 'RC Front', file: app.rcFront },
    { label: 'RC Back', file: app.rcBack },
    { label: 'Vehicle Front', file: app.vehicleFront },
    { label: 'Vehicle Side', file: app.vehicleSide },
    { label: 'Tag Image', file: app.tagImage },
  ];

  const handleUpdateStatus = async (newStatus) => {
    try {
      await fetch(`${API_BASE}/api/applications/${app.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      onRefresh();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fadeInUp" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{app.panName || app.ownerName}</h2>
            <p className="modal-subtitle">Application Details &bull; {new Date(app.submittedAt).toLocaleString()}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="modal-section-title">Personal Details</div>
          <div className="modal-grid">
            <div className="modal-field">
              <span>Name (as on PAN)</span>
              <strong>{app.panName || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Mobile Number</span>
              <strong>{app.mobile || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>PAN Number</span>
              <strong>{app.pan || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Date of Birth</span>
              <strong>{app.dob || '—'}</strong>
            </div>
          </div>

          <div className="modal-section-title">Vehicle Details</div>
          <div className="modal-grid">
            <div className="modal-field">
              <span>Vehicle No.</span>
              <strong className="text-highlight">{app.vehicleNumber || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>VC Type</span>
              <strong>{app.vcType || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Vehicle Type</span>
              <strong>{app.vehicleType || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Owner Name</span>
              <strong>{app.ownerName || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Fuel Type</span>
              <strong>{app.fuelType || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Chassis No.</span>
              <strong>{app.chassisNumber || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Engine No.</span>
              <strong>{app.engineNumber || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>State</span>
              <strong>{app.stateOfRegistration || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>City</span>
              <strong>{app.city || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Pincode</span>
              <strong>{app.pincode || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Color</span>
              <strong>{app.color || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Vehicle Descriptor</span>
              <strong>{app.vehicleDescriptor || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Barcode</span>
              <strong>{app.barcode || '—'}</strong>
            </div>
            <div className="modal-field">
              <span>Vehicle Class</span>
              <strong>{app.isCommercial || '—'}</strong>
            </div>
          </div>

          <div className="modal-section-title">Uploaded Documents</div>
          <div className="modal-images-grid">
            {images.map((img, i) => (
              <div key={i} className="modal-image-card">
                <span className="modal-image-label">{img.label}</span>
                {img.file ? (
                  img.file.endsWith('.pdf') ? (
                    <div className="modal-pdf-box">
                       <div>📄</div>
                       <a href={backendUrl + img.file} target="_blank" rel="noreferrer">Open PDF</a>
                    </div>
                  ) : (
                    <a href={backendUrl + img.file} target="_blank" rel="noreferrer">
                      <img src={backendUrl + img.file} alt={img.label} className="modal-doc-img" />
                    </a>
                  )
                ) : (
                   <div className="modal-no-doc">No Document</div>
                )}
              </div>
            ))}
          </div>

          {(!app.status || app.status === 'Pending') && (
            <div className="modal-actions-wrapper">
              <button className="btn-modal-reject" onClick={() => handleUpdateStatus('Rejected')}>Reject Application</button>
              <button className="btn-modal-accept" onClick={() => handleUpdateStatus('Accepted')}>Accept Application</button>
            </div>
          )}
          {app.status && app.status !== 'Pending' && (
            <div className={`modal-status-banner banner-${app.status.toLowerCase()}`}>
              Status: <strong>{app.status}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onNewForm }) {
  const [submissions, setSubmissions] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  const loadData = () => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_BASE}/api/applications`)
      .then(res => res.json())
      .then(data => setSubmissions(data))
      .catch(console.error);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      await fetch(`${API_BASE}/api/applications/${id}`, { method: 'DELETE' });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const total = submissions.length;
  const today = submissions.filter(s => {
    const d = new Date(s.submittedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">SBI FASTag Registration Overview</p>
        </div>
        <button className="btn-new-fastag" onClick={onNewForm}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          New FASTag
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label="Total Registrations"
          value={total}
          color="purple"
        />
        <StatCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          label="Today's Applications"
          value={today}
          color="blue"
        />
        <StatCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          label="Pending Review"
          value={total}
          color="amber"
        />
        <StatCard
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          label="Completed"
          value={0}
          color="green"
        />
      </div>

      <div className="dashboard-table-card">
        <div className="table-card-header">
          <h2 className="table-card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            Recent Applications
          </h2>
          <span className="table-count">{total} total</span>
        </div>

        {submissions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <p className="empty-title">No applications yet</p>
            <p className="empty-sub">Submit your first SBI FASTag application to see it here</p>
            <button className="btn-new-fastag" onClick={onNewForm}>Start New Application</button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Vehicle No.</th>
                  <th>VC Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <tr key={s.id}>
                    <td className="td-index">{i + 1}</td>
                    <td className="td-name">
                      <div className="td-avatar">{(s.panName || s.ownerName || 'N')[0]?.toUpperCase()}</div>
                      {s.panName || s.ownerName || '—'}
                    </td>
                    <td>{s.mobile || '—'}</td>
                    <td className="td-vehicle">{s.vehicleNumber || '—'}</td>
                    <td>{s.vcType || '—'}</td>
                    <td>
                      <span className={`badge-status badge-${(s.status || 'Pending').toLowerCase()}`}>
                        {s.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button className="btn-view" onClick={() => setSelectedApp(s)}>View Details</button>
                        <button className="btn-delete" onClick={() => handleDelete(s.id)}
                          title="Delete">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} onRefresh={loadData} />
    </div>
  );
}

export default Dashboard;
