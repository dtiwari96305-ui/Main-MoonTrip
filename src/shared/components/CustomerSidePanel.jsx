import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];


const InfoIcon = ({ title }) => (
  <span className="sp-info-icon" title={title}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  </span>
);

// Parse phone number - strip country code prefix like "+91 " or "+91"
function parsePhoneNumber(raw) {
  if (!raw) return '';
  return raw.replace(/^\+\d{1,3}\s*/, '').replace(/\s/g, '');
}

export const CustomerSidePanel = ({ isOpen, mode, customer, profileExt, onClose, onSave }) => {

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  const [customerType, setCustomerType] = useState('Individual');
  const [panNumber, setPanNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  // Pre-fill or reset when panel opens
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && customer) {
      setFullName(customer.name || '');
      setPhone(parsePhoneNumber(customer.phone));
      setEmail(customer.email || '');
      setCustomerType(customer.type || 'Individual');

      if (profileExt) {
        setCity(profileExt.city || customer.location || '');
        setState(profileExt.state || '');
        setCountry(profileExt.country || 'India');
        setTags(Array.isArray(profileExt.tags) ? profileExt.tags.join(', ') : (profileExt.tags || ''));
        setPanNumber(profileExt.pan || '');
        setGstin(profileExt.gstin || '');
        setCompanyName(profileExt.company || '');
      } else {
        setCity(customer.location || '');
        setState('');
        setCountry('India');
        setTags('');
        setPanNumber('');
        setGstin('');
        setCompanyName('');
      }
      // Fields not stored
      setAltPhone('');
      setDob('');
      setAddress('');
      setPincode('');
      setPassportNumber('');
      setPassportExpiry('');
      setNotes('');
    } else {
      // Add mode — clear everything
      setFullName('');
      setPhone('');
      setAltPhone('');
      setEmail('');
      setDob('');
      setAddress('');
      setCity('');
      setState('');
      setPincode('');
      setCountry('India');
      setCustomerType('Individual');
      setPanNumber('');
      setGstin('');
      setCompanyName('');
      setPassportNumber('');
      setPassportExpiry('');
      setTags('');
      setNotes('');
    }
  }, [isOpen, mode, customer, profileExt]);

  const handleSave = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        fullName, phone, altPhone, email, dob, address,
        city, state, pincode, country, customerType,
        panNumber, gstin, companyName, passportNumber, passportExpiry,
        tags, notes,
      });
    }
  };

  const panelContent = (
    <>
      {/* Dim overlay — visual backdrop only, pointer-events: none so background stays scrollable */}
      <div className={`sp-overlay${isOpen ? ' sp-overlay-visible' : ''}`} />

      {/* Transparent click-capture layer — closes panel when clicking outside, only shown when open */}
      {isOpen && <div className="sp-click-overlay" onClick={onClose} />}

      {/* Slide-in panel */}
      <div className={`sp-panel${isOpen ? ' sp-panel-open' : ''}`}>

        {/* ── Header ── */}
        <div className="sp-header">
          <div>
            <h2 className="sp-title">{mode === 'edit' ? 'Edit Customer' : 'Add Customer'}</h2>
            <p className="sp-subtitle">Fill in the customer details below</p>
          </div>
          <button className="sp-close-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="sp-body">
          <form onSubmit={handleSave}>

            {/* ───── Personal Information ───── */}
            <div className="sp-section">
              <h3 className="sp-section-title">Personal Information</h3>

              {/* Full Name */}
              <div className="sp-field">
                <label className="sp-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Full Name <span className="sp-required">*</span>
                </label>
                <input
                  type="text"
                  className="sp-input"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>

              {/* Phone row — 2 columns */}
              <div className="sp-row-2">
                <div className="sp-field">
                  <label className="sp-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Phone <span className="sp-required">*</span>
                  </label>
                  <div className="sp-phone-wrap">
                    <div className="sp-cc-box">
                      <span>IN +91</span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    <input
                      type="tel"
                      className="sp-phone-num"
                      placeholder="9876543210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sp-field">
                  <label className="sp-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Alternate Phone
                  </label>
                  <div className="sp-phone-wrap">
                    <div className="sp-cc-box">
                      <span>IN +91</span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    <input
                      type="tel"
                      className="sp-phone-num"
                      placeholder="9876543210"
                      value={altPhone}
                      onChange={e => setAltPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="sp-field">
                <label className="sp-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  className="sp-input"
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* Date of Birth */}
              <div className="sp-field">
                <label className="sp-label">Date of Birth</label>
                <input
                  type="date"
                  className="sp-input sp-date-input"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                />
              </div>
            </div>

            {/* ───── Address ───── */}
            <div className="sp-section">
              <h3 className="sp-section-title">Address</h3>

              <div className="sp-field">
                <label className="sp-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Address
                </label>
                <input
                  type="text"
                  className="sp-input"
                  placeholder="123 Main Street"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              {/* City / State / Pincode — 3 columns */}
              <div className="sp-row-3">
                <div className="sp-field">
                  <label className="sp-label">City</label>
                  <input
                    type="text"
                    className="sp-input"
                    placeholder="Mumbai"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </div>
                <div className="sp-field">
                  <label className="sp-label">State <span className="sp-required">*</span></label>
                  <div className="sp-select-wrap">
                    <select
                      className="sp-input sp-select"
                      value={state}
                      onChange={e => setState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <svg className="sp-select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
                <div className="sp-field">
                  <label className="sp-label">Pincode</label>
                  <input
                    type="text"
                    className="sp-input"
                    placeholder="400001"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Country */}
              <div className="sp-field">
                <label className="sp-label">Country</label>
                <input
                  type="text"
                  className="sp-input"
                  placeholder="India"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                />
              </div>
            </div>

            {/* ───── Business & Identity ───── */}
            <div className="sp-section">
              <h3 className="sp-section-title">Business &amp; Identity</h3>

              {/* Customer Type */}
              <div className="sp-field">
                <label className="sp-label">
                  Customer Type <InfoIcon title="Individual for personal travelers, Corporate for business accounts" />
                </label>
                <div className="sp-select-wrap">
                  <select
                    className="sp-input sp-select"
                    value={customerType}
                    onChange={e => setCustomerType(e.target.value)}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                  <svg className="sp-select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* PAN + GSTIN — 2 columns */}
              <div className="sp-row-2">
                <div className="sp-field">
                  <label className="sp-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="16" rx="2"/>
                      <path d="M8 10h8M8 14h5"/>
                    </svg>
                    PAN Number <InfoIcon title="Permanent Account Number (10 characters)" />
                  </label>
                  <input
                    type="text"
                    className="sp-input"
                    placeholder="ABCDE1234F"
                    value={panNumber}
                    onChange={e => setPanNumber(e.target.value.toUpperCase())}
                    maxLength={10}
                  />
                </div>
                <div className="sp-field">
                  <label className="sp-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    GSTIN <InfoIcon title="GST Identification Number (15 characters)" />
                  </label>
                  <input
                    type="text"
                    className="sp-input"
                    placeholder="22AAAAA0000A1Z5"
                    value={gstin}
                    onChange={e => setGstin(e.target.value.toUpperCase())}
                    maxLength={15}
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="sp-field">
                <label className="sp-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/>
                  </svg>
                  Company Name
                </label>
                <input
                  type="text"
                  className="sp-input"
                  placeholder="Acme Corp"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              </div>

              {/* Passport Number + Expiry — 2 columns */}
              <div className="sp-row-2">
                <div className="sp-field">
                  <label className="sp-label">Passport Number</label>
                  <input
                    type="text"
                    className="sp-input"
                    placeholder="A1234567"
                    value={passportNumber}
                    onChange={e => setPassportNumber(e.target.value.toUpperCase())}
                    maxLength={9}
                  />
                </div>
                <div className="sp-field">
                  <label className="sp-label">Passport Expiry</label>
                  <input
                    type="date"
                    className="sp-input sp-date-input"
                    value={passportExpiry}
                    onChange={e => setPassportExpiry(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ───── Additional ───── */}
            <div className="sp-section sp-section-last">
              <h3 className="sp-section-title">Additional</h3>

              <div className="sp-field">
                <label className="sp-label">
                  Tags <InfoIcon title="Comma-separated labels, e.g. VIP, Frequent Traveler" />
                </label>
                <input
                  type="text"
                  className="sp-input"
                  placeholder="VIP, Frequent Traveler"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>

              <div className="sp-field">
                <label className="sp-label">Notes</label>
                <textarea
                  className="sp-input sp-textarea"
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

          </form>
        </div>

        {/* ── Footer ── */}
        <div className="sp-footer">
          <button className="sp-save-btn" onClick={handleSave}>
            {mode === 'edit' ? 'Save Changes' : 'Add Customer'}
          </button>
          <button className="sp-cancel-btn" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

    </>
  );

  // Portal to document.body so the panel is never inside a CSS transform
  // stacking context (main-content has transform:translateY(0) from its
  // fadeIn animation, which breaks position:fixed containment)
  return ReactDOM.createPortal(panelContent, document.body);
};

export default CustomerSidePanel;
