import { useState, useRef } from 'react';
import './Step3.css';

const uploads = [
  {
    id: 'rcFront',
    label: 'Upload RC Front',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
        <path d="M6 15h4"/>
      </svg>
    ),
    color: 'purple',
    accept: 'image/*,application/pdf',
  },
  {
    id: 'rcBack',
    label: 'Upload RC Back',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
        <path d="M14 15h4"/>
      </svg>
    ),
    color: 'blue',
    accept: 'image/*,application/pdf',
  },
  {
    id: 'vehicleFront',
    label: 'Upload Vehicle Front',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/>
        <circle cx="7.5" cy="17.5" r="2.5"/>
        <circle cx="17.5" cy="17.5" r="2.5"/>
      </svg>
    ),
    color: 'amber',
    accept: 'image/*',
  },
  {
    id: 'vehicleSide',
    label: 'Upload Vehicle Side',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 3h15l3 4H1V3z"/>
        <path d="M1 7v8h18V7"/>
        <circle cx="5" cy="18" r="2"/>
        <circle cx="15" cy="18" r="2"/>
      </svg>
    ),
    color: 'green',
    accept: 'image/*',
  },
  {
    id: 'tagImage',
    label: 'Upload Tag Image',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    color: 'pink',
    accept: 'image/*',
  },
];

function UploadCard({ item, file, preview, onFile }) {
  const ref = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onFile(item.id, f);
  };

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) onFile(item.id, f);
  };

  return (
    <div
      className={`upload-card upload-card--${item.color} ${file ? 'uploaded' : ''}`}
      onClick={() => ref.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input ref={ref} type="file" accept={item.accept} style={{ display: 'none' }} onChange={handleChange} />

      {preview ? (
        <div className="card-preview-wrap">
          <img src={preview} alt={item.label} className="card-preview-img" />
          <div className="card-preview-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Change</span>
          </div>
        </div>
      ) : file && file.type === 'application/pdf' ? (
        <div className="card-pdf-wrap">
          <span className="card-pdf-emoji">📄</span>
          <span className="card-pdf-name">{file.name}</span>
          <span className="card-pdf-badge">PDF</span>
        </div>
      ) : (
        <div className="card-placeholder">
          <div className={`card-icon card-icon--${item.color}`}>{item.icon}</div>
          <p className="card-label">{item.label}</p>
          <p className="card-hint">Click or drag &amp; drop</p>
        </div>
      )}

      {file && (
        <div className="card-done-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      )}
    </div>
  );
}

function Step3({ formData, onSubmit, onBack }) {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFile = (id, file) => {
    setFiles(prev => ({ ...prev, [id]: file }));
    setErrors(prev => ({ ...prev, [id]: '' }));
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews(prev => ({ ...prev, [id]: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const e = {};
    uploads.forEach(u => {
      if (!files[u.id]) e[u.id] = 'Required';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setSubmitting(true);
    
    try {
      const dbData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'panFile') {
          dbData.append(key, formData[key]);
        }
      });
      
      if (formData.panFile) dbData.append('panFile', formData.panFile);
      Object.keys(files).forEach(key => {
        if (files[key]) dbData.append(key, files[key]);
      });

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        body: dbData
      });

      if (res.ok) {
        setSubmitting(false);
        setSuccess(true);
        setTimeout(() => {
          onSubmit();
        }, 2200);
      } else {
        throw new Error('Upload failed');
      }
    } catch(err) {
      console.error(err);
      setSubmitting(false);
      alert('Failed to submit application. Please check console.');
    }
  };

  if (success) {
    return (
      <div className="form-page">
        <div className="success-screen">
          <div className="success-icon-wrap">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="success-title">Application Submitted! 🎉</h2>
          <p className="success-sub">Your SBI FASTag registration has been submitted successfully. You will be redirected to the dashboard.</p>
          <div className="success-details">
            <span>Vehicle: <strong>{formData?.vehicleNumber}</strong></span>
            <span>Owner: <strong>{formData?.ownerName || formData?.panName}</strong></span>
          </div>
          <div className="success-loader">
            <div className="success-loader-bar" />
          </div>
        </div>
      </div>
    );
  }

  const uploadedCount = Object.keys(files).length;

  return (
    <div className="form-page">
      <div className="form-page-header">
        <div className="step-breadcrumb">
          <span className="step-pill done">Step 1 ✓</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="step-pill done">Step 2 ✓</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="step-pill active">Step 3</span>
        </div>
        <h1 className="form-page-title">Upload Documents</h1>
        <p className="form-page-sub">Upload RC, vehicle photos and tag image to complete your application</p>
      </div>

      <div className="form-container">
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: '100%' }} />
        </div>

        {/* Upload progress indicator */}
        <div className="upload-progress-row">
          <div className="upload-progress-track">
            <div
              className="upload-progress-fill"
              style={{ width: `${(uploadedCount / uploads.length) * 100}%` }}
            />
          </div>
          <span className="upload-progress-label">{uploadedCount} / {uploads.length} uploaded</span>
        </div>

        <section className="form-section animate-fadeInUp">
          <div className="section-header">
            <div className="section-icon purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <h2 className="section-title">Document Uploads</h2>
              <p className="section-sub">All 5 documents are required to proceed</p>
            </div>
          </div>

          {/* 2×2 grid + 1 full-width card */}
          <div className="upload-cards-grid">
            {uploads.slice(0, 4).map(item => (
              <div key={item.id}>
                <UploadCard
                  item={item}
                  file={files[item.id]}
                  preview={previews[item.id]}
                  onFile={handleFile}
                />
                {errors[item.id] && <span className="field-error" style={{ padding: '4px 0 0 4px', display: 'block' }}>{errors[item.id]}</span>}
              </div>
            ))}
          </div>

          {/* Tag Image – full width */}
          <div className="upload-card-full" style={{ marginTop: 16 }}>
            <UploadCard
              item={uploads[4]}
              file={files[uploads[4].id]}
              preview={previews[uploads[4].id]}
              onFile={handleFile}
            />
            {errors[uploads[4].id] && <span className="field-error" style={{ padding: '4px 0 0 4px', display: 'block' }}>{errors[uploads[4].id]}</span>}
          </div>
        </section>

        <div className="form-actions">
          <button className="btn-back" onClick={onBack} disabled={submitting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <button className="btn-submit" onClick={handleNext} disabled={submitting}>
            {submitting ? (
              <><div className="spinner" /> Submitting...</>
            ) : (
              <>
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step3;
