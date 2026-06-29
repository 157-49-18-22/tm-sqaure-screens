import { useState, useMemo } from 'react';
import { State, City } from 'country-state-city';
import './Step2.css';

const vehicleDescriptors = [
  'PETROL', 'DIESEL/HYBRID', 'ETHANOL', 'PETROL/METHANOL', 'METHANOL', 'PETROL/ETHANOL',
  'LNG', 'OTHER', 'DUEL DIESEL/BIO CNG', 'DUEL DIESEL/CNG', 'DUEL DIESEL/LNG', 'DIESEL',
  'DI-METHYL ETHER', 'FUEL CELL HYDROGEN', 'PURE EV', 'STRONG HYBRID EV', 'PLUG-IN HYBRID EV',
  'NOT APPLICABLE', 'PETROL/CNG', 'ELECTRIC(BOV)', 'PETROL/LPG', 'CNG ONLY', 'LPG ONLY', 'SOLAR', 'PETROL/HYBRID'
];



function InputField({ icon, label, type = 'text', value, onChange, placeholder, maxLength }) {
  return (
    <div className="input-group">
      <div className="input-icon">{icon}</div>
      <div className="input-wrap">
        <input type={type} value={value} onChange={onChange} placeholder=" "
          maxLength={maxLength} className="form-input" id={label} />
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
          {options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
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

function Step2({ formData, onNext, onBack }) {
  const [form, setForm] = useState({
    pincode: '',
    vehicleNumber: formData?.vehicleNumber || '',
    chassisNumber: '',
    engineNumber: '',
    ownerName: '',
    stateOfRegistrationIso: '',
    stateOfRegistration: '',
    city: '',
    color: '',
    vehicleDescriptor: '',
    barcode: '',
    vcCode: '',
  });
  const [errors, setErrors] = useState({});

  const indiaStates = useMemo(() => State.getStatesOfCountry('IN'), []);
  const currentCities = useMemo(() => {
    if (!form.stateOfRegistrationIso) return [];
    return City.getCitiesOfState('IN', form.stateOfRegistrationIso);
  }, [form.stateOfRegistrationIso]);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleStateChange = (e) => {
    const selectedStateCode = e.target.value;
    const selectedStateName = indiaStates.find(s => s.isoCode === selectedStateCode)?.name || '';
    setForm(prev => ({
      ...prev,
      stateOfRegistrationIso: selectedStateCode,
      stateOfRegistration: selectedStateName,
      city: '' // reset city when state changes
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.pincode || form.pincode.length !== 6) e.pincode = 'Enter valid 6-digit pincode';
    if (!form.vehicleNumber) e.vehicleNumber = 'Vehicle number is required';
    if (!form.chassisNumber) e.chassisNumber = 'Chassis number is required';
    if (!form.engineNumber) e.engineNumber = 'Engine number is required';
    if (!form.ownerName) e.ownerName = 'Owner name is required';
    if (!form.stateOfRegistration) e.stateOfRegistration = 'State is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(form); };

  const PinIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>);
  const CarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>);
  const HashIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>);
  const EngineIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>);
  const UserIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
  const FuelIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V8l9-6 9 6v14H3z"/><path d="M9 22V12h6v10"/></svg>);
  const MapIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>);
  const ListIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>);

  return (
    <div className="form-page">
      <div className="form-page-header">
        <div className="step-breadcrumb">
          <span className="step-pill done">Step 1 ✓</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="step-pill active">Step 2</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="step-pill">Step 3</span>
        </div>
        <h1 className="form-page-title">SBI FASTag Registration 2</h1>
        <p className="form-page-sub">Description &amp; registration details</p>
      </div>

      <div className="form-container">
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: '66%' }} />
        </div>

        {formData?.vehicleNumber && (
          <div className="carry-over-chip">
            <CarIcon />
            <strong>{formData.vehicleNumber}</strong>
            <span>·</span>
            <span>{formData.panName}</span>
            <span>·</span>
            <span>{formData.vcType}</span>
          </div>
        )}

        <section className="form-section animate-fadeInUp">
          <div className="section-header">
            <div className="section-icon green"><ListIcon /></div>
            <div>
              <h2 className="section-title">Description Details</h2>
              <p className="section-sub">Additional vehicle &amp; registration information</p>
            </div>
          </div>

          <div className="fields-grid fields-2col">
            <div className="field-wrapper">
              <InputField icon={<PinIcon />} label="pincode" placeholder="Pincode" type="tel" value={form.pincode} onChange={set('pincode')} maxLength={6} />
              {errors.pincode && <span className="field-error">{errors.pincode}</span>}
            </div>
            <div className="field-wrapper">
              <InputField icon={<CarIcon />} label="vehicleNumber2" placeholder="Vehicle Number" value={form.vehicleNumber} onChange={set('vehicleNumber')} maxLength={15} />
              {errors.vehicleNumber && <span className="field-error">{errors.vehicleNumber}</span>}
            </div>
            <div className="field-wrapper">
              <div className="input-group">
                <div className="input-icon"><MapIcon /></div>
                <div className="input-wrap select-wrap">
                  <select value={form.stateOfRegistrationIso} onChange={handleStateChange} className={`form-select ${form.stateOfRegistrationIso ? 'has-value' : ''}`} id="stateOfRegistration">
                    <option value="">State of Registration</option>
                    {indiaStates.map(st => <option key={st.isoCode} value={st.isoCode}>{st.name}</option>)}
                  </select>
                  <div className="select-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>
                </div>
              </div>
              {errors.stateOfRegistration && <span className="field-error">{errors.stateOfRegistration}</span>}
            </div>
            <div className="field-wrapper">
              <div className="input-group">
                <div className="input-icon"><MapIcon /></div>
                <div className="input-wrap select-wrap">
                  <select value={form.city} onChange={set('city')} className={`form-select ${form.city ? 'has-value' : ''}`} id="city">
                    <option value="">City</option>
                    {currentCities.map(cty => <option key={cty.name} value={cty.name}>{cty.name}</option>)}
                  </select>
                  <div className="select-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <InputField icon={<HashIcon />} label="chassisNumber" placeholder="Chassis Number" value={form.chassisNumber} onChange={set('chassisNumber')} maxLength={25} />
              {errors.chassisNumber && <span className="field-error">{errors.chassisNumber}</span>}
            </div>
            <div className="field-wrapper">
              <InputField icon={<EngineIcon />} label="engineNumber" placeholder="Engine Number" value={form.engineNumber} onChange={set('engineNumber')} maxLength={25} />
              {errors.engineNumber && <span className="field-error">{errors.engineNumber}</span>}
            </div>
            <div className="field-wrapper">
              <InputField icon={<UserIcon />} label="ownerName" placeholder="Owner Name" value={form.ownerName} onChange={set('ownerName')} />
              {errors.ownerName && <span className="field-error">{errors.ownerName}</span>}
            </div>
            <div className="field-wrapper">
              <SelectField icon={<HashIcon />} label="color" value={form.color} onChange={set('color')} options={['White', 'Black', 'Silver', 'Grey', 'Red', 'Blue', 'Brown', 'Yellow', 'Green', 'Other']} placeholder="Color" />
            </div>
            <div className="field-wrapper">
              <SelectField icon={<ListIcon />} label="vehicleDescriptor" value={form.vehicleDescriptor} onChange={set('vehicleDescriptor')} options={vehicleDescriptors} placeholder="Vehicle Descriptor" />
            </div>
            <div className="field-wrapper">
              <InputField icon={<HashIcon />} label="barcode" placeholder="Barcode (any number/text)" value={form.barcode} onChange={set('barcode')} maxLength={50} />
            </div>
            <div className="field-wrapper">
              <div className="input-group">
                <div className="input-icon"><CarIcon /></div>
                <div className="input-wrap">
                  <div 
                    className={`vc4-static-label ${form.vcCode === 'VC-4' ? 'active' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, vcCode: prev.vcCode === 'VC-4' ? '' : 'VC-4' }))}
                    title="Click to select"
                  >
                    VC4 — Car, Jeep, Van
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button className="btn-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <button className="btn-next" onClick={handleNext}>
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step2;
