import { useState, useRef } from 'react';
import './Step1.css';

const vehicleTypes = ['New Vehicle', 'Old Vehicle'];
const vcTypes = ['VC-1', 'VC-2', 'VC-3', 'VC-4', 'VC-5', 'VC-6', 'VC-7', 'VC-8', 'VC-9', 'VC-12', 'VC-15', 'VC-16', 'VC-20'];

function InputField({ icon, label, type = 'text', value, onChange, placeholder, maxLength }) {
  return (
    <div className="input-group">
      <div className="input-icon">{icon}</div>
      <div className="input-wrap">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          maxLength={maxLength}
          className="form-input"
          id={label}
        />
        <label className="floating-label" htmlFor={label}>{placeholder}</label>
      </div>
    </div>
  );
}

function SelectField({ icon, label, value, onChange, options, placeholder }) {
  return (
    <div className="input-group">
      <div className="input-icon">{icon}</div>
      <div className="input-wrap select-wrap">
        <select value={value} onChange={onChange} className={`form-select ${value ? 'has-value' : ''}`} id={label}>
          <option value="">{placeholder}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="select-arrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Step1({ onNext, onBack }) {
  const [form, setForm] = useState({
    mobile: '', pan: '', panName: '', dob: '',
    vehicleType: '', vehicleNumber: '',
    chassisNumber: '',
  });
  const [panFile, setPanFile] = useState(null);
  const [panPreview, setPanPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleFile = (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
      setErrors(prev => ({ ...prev, pan: 'Only JPG, PNG or PDF allowed' }));
      return;
    }
    setPanFile(file);
    setErrors(prev => ({ ...prev, pan: '' }));
    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => setPanPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPanPreview('pdf');
    }
  };

  const validate = () => {
    const e = {};
    if (!form.mobile || form.mobile.length !== 10) e.mobile = 'Enter valid 10-digit mobile';
    if (!form.pan || form.pan.length !== 10) e.pan_field = 'PAN must be 10 characters';
    if (!form.panName) e.panName = 'Name is required';
    if (!form.dob) e.dob = 'Date of birth is required';
    if (!form.vehicleNumber) e.vehicleNumber = 'Vehicle number is required';
    if (!panFile) e.panFile = 'PAN card upload is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext({ ...form, panFile });
  };

  const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 8.81 19.79 19.79 0 0 1 1 .18 2 2 0 0 1 2.27 0h2.72a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.91 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 14.2v2.72z"/>
    </svg>
  );
  const CardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  );
  const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
  const CalIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
  const CarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  );
  const TagIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
  const HashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
    </svg>
  );
  const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  return (
    <div className="form-page">
      {/* Page Header */}
      <div className="form-page-header">
        <div className="step-breadcrumb">
          <span className="step-pill active">Step 1</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="step-pill">Step 2</span>
        </div>
        <h1 className="form-page-title">SBI FASTag Registration</h1>
        <p className="form-page-sub">Fill in customer &amp; vehicle details to proceed</p>
      </div>

      <div className="form-container">
        {/* Progress */}
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: '50%' }} />
        </div>

        {/* ── SECTION 1 : Customer Details ── */}
        <section className="form-section animate-fadeInUp">
          <div className="section-header">
            <div className="section-icon purple">
              <UserIcon />
            </div>
            <div>
              <h2 className="section-title">Customer Details</h2>
              <p className="section-sub">Personal &amp; identification information</p>
            </div>
          </div>

          <div className="fields-grid fields-2col">
            <div className="field-wrapper">
              <InputField icon={<PhoneIcon />} label="mobile" placeholder="Mobile Number" type="tel" value={form.mobile} onChange={set('mobile')} maxLength={10} />
              {errors.mobile && <span className="field-error">{errors.mobile}</span>}
            </div>
            <div className="field-wrapper">
              <InputField icon={<CardIcon />} label="pan" placeholder="PAN Number (e.g. ABCDE1234F)" value={form.pan} onChange={(e) => setForm(p => ({ ...p, pan: e.target.value.toUpperCase() }))} maxLength={10} />
              {errors.pan_field && <span className="field-error">{errors.pan_field}</span>}
            </div>
            <div className="field-wrapper">
              <InputField icon={<UserIcon />} label="panName" placeholder="Name as on PAN" value={form.panName} onChange={set('panName')} />
              {errors.panName && <span className="field-error">{errors.panName}</span>}
            </div>
            <div className="field-wrapper">
              <InputField icon={<CalIcon />} label="dob" placeholder="Date of Birth" type="date" value={form.dob} onChange={set('dob')} />
              {errors.dob && <span className="field-error">{errors.dob}</span>}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── SECTION 2 : Vehicle Details ── */}
        <section className="form-section animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="section-header">
            <div className="section-icon blue">
              <CarIcon />
            </div>
            <div>
              <h2 className="section-title">Vehicle Details</h2>
              <p className="section-sub">Vehicle registration information</p>
            </div>
          </div>

          <div className="fields-grid fields-2col">
            <div className="field-wrapper">
              <SelectField icon={<CarIcon />} label="vehicleType" value={form.vehicleType} onChange={set('vehicleType')} options={vehicleTypes} placeholder="New Vehicle ?" />
            </div>
            <div className="field-wrapper">
              <InputField icon={<CarIcon />} label="vehicleNumber" placeholder="Vehicle Number (e.g. MH01AB1234)" value={form.vehicleNumber} onChange={(e) => setForm(p => ({ ...p, vehicleNumber: e.target.value.toUpperCase() }))} maxLength={15} />
              {errors.vehicleNumber && <span className="field-error">{errors.vehicleNumber}</span>}
            </div>
            <div className="field-wrapper">
              <div className="input-group" style={{ position: 'relative' }}>
                <div className="input-icon"><HashIcon /></div>
                <div className="input-wrap">
                  <input
                    className="form-input"
                    type="text"
                    placeholder=" "
                    id="chassisNumber"
                    value={form.chassisNumber}
                    onChange={(e) => setForm(p => ({ ...p, chassisNumber: e.target.value.toUpperCase() }))}
                    maxLength={30}
                    style={{ paddingRight: '40px' }}
                  />
                  <label className="floating-label" htmlFor="chassisNumber">Chassis / Engine Number</label>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (form.chassisNumber) {
                        navigator.clipboard.writeText(form.chassisNumber);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Copy"
                  >
                    {copied ? (
                      <>
                        <CheckIcon />
                        <span style={{ fontSize: '10px', color: '#22c55e' }}>Copied!</span>
                      </>
                    ) : (
                      <CopyIcon />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── SECTION 3 : Upload PAN Card ── */}
        <section className="form-section animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <div className="section-icon amber">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <h2 className="section-title">Upload PAN Card</h2>
              <p className="section-sub">Upload a clear image or PDF of your PAN card</p>
            </div>
          </div>

          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''} ${panFile ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {panPreview && panPreview !== 'pdf' ? (
              <div className="preview-wrap">
                <img src={panPreview} alt="PAN Card Preview" className="pan-preview-img" />
                <div className="preview-overlay">
                  <p>Click to change</p>
                </div>
              </div>
            ) : panPreview === 'pdf' ? (
              <div className="pdf-preview">
                <div className="pdf-icon">📄</div>
                <p className="pdf-name">{panFile?.name}</p>
                <span className="pdf-badge">PDF</span>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon-wrap">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="upload-title">Drag &amp; drop or <span>browse files</span></p>
                <p className="upload-sub">Supports JPG, PNG and PDF — max 5MB</p>
              </div>
            )}
          </div>
          {errors.pan && <span className="field-error">{errors.pan}</span>}
          {errors.panFile && <span className="field-error">{errors.panFile}</span>}
        </section>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <button className="btn-next" onClick={handleNext}>
            Next Step
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step1;
