import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDemoPopup } from '../context/DemoContext';

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

const COUNTRY_CODES = [
  { code: 'IN', dial: '+91',  name: 'India' },
  { code: 'US', dial: '+1',   name: 'United States' },
  { code: 'GB', dial: '+44',  name: 'United Kingdom' },
  { code: 'AE', dial: '+971', name: 'UAE' },
  { code: 'SG', dial: '+65',  name: 'Singapore' },
  { code: 'AU', dial: '+61',  name: 'Australia' },
  { code: 'CA', dial: '+1',   name: 'Canada' },
  { code: 'DE', dial: '+49',  name: 'Germany' },
  { code: 'FR', dial: '+33',  name: 'France' },
  { code: 'JP', dial: '+81',  name: 'Japan' },
  { code: 'NZ', dial: '+64',  name: 'New Zealand' },
  { code: 'ZA', dial: '+27',  name: 'South Africa' },
];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// ─── CountryCodeDropdown ──────────────────────────────────────────────────────
const CountryCodeDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div style={{ position: 'relative', flexShrink: 0 }} ref={wrapRef}>
      <button
        type="button"
        className="cc-select-trigger"
        onClick={() => setOpen(v => !v)}
      >
        <span>{selected.code}</span>
        <span className="cc-dial-text">{selected.dial}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="cc-dropdown-menu">
          {COUNTRY_CODES.map(c => (
            <div
              key={c.code + c.dial}
              className={`cc-menu-item ${c.code === value ? 'cc-selected' : ''}`}
              onClick={() => { onChange(c.code); setOpen(false); }}
            >
              <span className="cc-item-abbrev">{c.code}</span>
              <span className="cc-item-dial">{c.dial}</span>
              <span className="cc-item-name">{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── StateDropdown ────────────────────────────────────────────────────────────
const StateDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef = useRef(null);
  const filtered = INDIAN_STATES.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="sd-field-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`sd-field-trigger ${open ? 'sd-open' : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        {value
          ? <span className="sd-field-value">{value}</span>
          : <span className="sd-field-placeholder">Select State</span>
        }
        <svg className="sd-field-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="sd-field-dropdown">
          <div className="sd-search-row">
            <svg className="sd-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="sd-search-box"
              type="text"
              placeholder="Search states..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="sd-items-list">
            {filtered.length > 0 ? filtered.map(s => (
              <div
                key={s}
                className={`sd-item ${s === value ? 'sd-item-selected' : ''}`}
                onClick={() => { onChange(s); setOpen(false); setSearch(''); }}
              >
                {s}
              </div>
            )) : (
              <div className="sd-no-results">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CalendarPicker ───────────────────────────────────────────────────────────
const CalendarPicker = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() =>
    value ? new Date(value + 'T00:00:00') : new Date()
  );
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();
  const selDate = value ? new Date(value + 'T00:00:00') : null;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) days.push({ d: daysInPrev - i, curr: false });
  for (let d = 1; d <= daysInMonth; d++) days.push({ d, curr: true });
  while (days.length % 7 !== 0) days.push({ d: days.length - firstDay - daysInMonth + 1, curr: false });

  const isToday = (cell) =>
    cell.curr &&
    cell.d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (cell) =>
    cell.curr && selDate &&
    cell.d === selDate.getDate() &&
    month === selDate.getMonth() &&
    year === selDate.getFullYear();

  const handleDay = (cell) => {
    if (!cell.curr) return;
    const s = `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.d).padStart(2, '0')}`;
    onChange(s);
    setOpen(false);
  };

  const displayValue = selDate
    ? selDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const toggle = () => {
    if (value) setViewDate(new Date(value + 'T00:00:00'));
    setOpen(v => !v);
  };

  return (
    <div className="cal-field-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`cal-field-trigger ${open ? 'cal-open' : ''}`}
        onClick={toggle}
      >
        <svg className="cal-field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className={`cal-field-text ${!displayValue ? 'cal-field-placeholder' : ''}`}>
          {displayValue || placeholder || 'Select date'}
        </span>
      </button>
      {open && (
        <div className="cal-field-popup">
          <div className="cal-popup-header">
            <button
              type="button"
              className="cal-popup-nav"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span className="cal-popup-month">{MONTH_NAMES[month]} {year}</span>
            <button
              type="button"
              className="cal-popup-nav"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
          <div className="cal-popup-weekdays">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <span key={d} className="cal-popup-wday">{d}</span>
            ))}
          </div>
          <div className="cal-popup-grid">
            {days.map((cell, i) => (
              <button
                key={i}
                type="button"
                className={[
                  'cal-popup-day',
                  !cell.curr ? 'cal-day-other' : '',
                  isToday(cell) ? 'cal-day-now' : '',
                  isSelected(cell) ? 'cal-day-sel' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => handleDay(cell)}
              >
                {cell.d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── InfoIcon ─────────────────────────────────────────────────────────────────
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

export const CustomerSidePanel = ({ isOpen, mode, customer, profileExt, onClose }) => {
  const triggerDemoPopup = useDemoPopup();

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCC, setPhoneCC] = useState('IN');
  const [altPhone, setAltPhone] = useState('');
  const [altPhoneCC, setAltPhoneCC] = useState('IN');
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
      setPhoneCC('IN');
      setAltPhone('');
      setAltPhoneCC('IN');
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
    triggerDemoPopup();
  };

  const panelContent = (
    <>
      {/* Dim overlay */}
      <div className={`sp-overlay${isOpen ? ' sp-overlay-visible' : ''}`} />

      {/* Click-capture layer */}
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
                    <CountryCodeDropdown value={phoneCC} onChange={setPhoneCC} />
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
                    <CountryCodeDropdown value={altPhoneCC} onChange={setAltPhoneCC} />
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
                <CalendarPicker
                  value={dob}
                  onChange={setDob}
                  placeholder="Select date of birth"
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
                  <StateDropdown value={state} onChange={setState} />
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
                  <CalendarPicker
                    value={passportExpiry}
                    onChange={setPassportExpiry}
                    placeholder="Select expiry date"
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

  return ReactDOM.createPortal(panelContent, document.body);
};
