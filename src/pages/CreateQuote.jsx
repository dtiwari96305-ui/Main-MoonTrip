import React, { useState, useRef } from 'react';
import { openBilling } from '../utils/billingNav';
import { useDemoPopup } from '../context/DemoContext';

const STEPS = [
  { id: 1, label: 'Customer' },
  { id: 2, label: 'Trip' },
  { id: 3, label: 'Services' },
  { id: 4, label: 'Pricing' },
  { id: 5, label: 'Review' },
  { id: 6, label: 'Itinerary' },
];

const SERVICE_LIST = [
  { key: 'flight',       label: 'Flight',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> },
  { key: 'flightExtras', label: 'Flight Extras',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  { key: 'train',        label: 'Train',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="2" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 2v9"/><path d="M8 18l-2 4"/><path d="M16 18l2 4"/></svg> },
  { key: 'bus',          label: 'Bus',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 6h8M3 6h18v13H3z"/><path d="M3 10h18"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M5 19H3v-2"/><path d="M19 19h2v-2"/></svg> },
  { key: 'hotel',        label: 'Hotel',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/></svg> },
  { key: 'landPackage',  label: 'Land Package',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6l4-2 4 2 4-2 4 2"/><path d="M3 12l4-2 4 2 4-2 4 2"/><path d="M3 18l4-2 4 2 4-2 4 2"/></svg> },
  { key: 'visa',         label: 'Visa',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { key: 'activities',   label: 'Activities',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
  { key: 'cabTransport', label: 'Cab / Transport',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg> },
  { key: 'fooding',      label: 'Fooding',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/><circle cx="12" cy="12" r="9"/></svg> },
  { key: 'admission',    label: 'Admission / Entry',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/></svg> },
  { key: 'insurance',    label: 'Travel Insurance',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { key: 'other',        label: 'Other',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
];


// ─── Live Calculation Panel ───────────────────────────────────────────────────
const LiveCalculation = ({ mode, onModeChange, pricing }) => {
  const costOfServices = parseFloat(pricing.costOfServices) || 0;
  const hiddenMarkup   = parseFloat(pricing.hiddenMarkup)   || 0;
  const costOfTravel   = costOfServices + hiddenMarkup;
  const processingCharge = parseFloat(pricing.processingCharge) || 0;
  const isNoMargin = hiddenMarkup <= 0;
  const gstAmount  = isNoMargin ? 0 : processingCharge * 0.18;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const invoiceValue  = costOfTravel + processingCharge + gstAmount;
  const tcs           = 0;
  const totalPayable  = invoiceValue + tcs;
  const profit        = hiddenMarkup + processingCharge;

  const fmt = (n) => '₹' + (n === 0 ? '0' : Math.round(n).toLocaleString('en-IN'));

  const WarningBox = () => (
    isNoMargin ? (
      <div className="cq-calc-warning">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>Pure Agent with no/negative margin — No GST applicable.</span>
      </div>
    ) : null
  );

  return (
    <div className="cq-live-calc">
      {/* Header — same for both modes */}
      <div className="cq-calc-header">
        <div className="cq-calc-title-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <span className="cq-calc-title">Live Calculation</span>
          <div className="cq-calc-toggle">
            <button className={`cq-toggle-btn ${mode === 'agent' ? 'active' : ''}`} onClick={() => onModeChange('agent')}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              Agent
            </button>
            <button className={`cq-toggle-btn ${mode === 'customer' ? 'active' : ''}`} onClick={() => onModeChange('customer')}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              Customer
            </button>
          </div>
        </div>
        <p className="cq-calc-subtitle">Pure Agent – GST @18% on margin only</p>
      </div>

      {/* ── Agent view ── */}
      {mode === 'agent' && (
        <>
          <div className="cq-calc-rows">
            <div className="cq-calc-row"><span>Cost of Services</span><span>{fmt(costOfServices)}</span></div>
            <div className="cq-calc-row"><span>Hidden Markup</span><span>{fmt(hiddenMarkup)}</span></div>
            <div className="cq-calc-row"><span>Cost of Travel (shown to customer)</span><span>{fmt(costOfTravel)}</span></div>
            <div className="cq-calc-row"><span>Processing Charge (excl GST)</span><span>{fmt(processingCharge)}</span></div>
            <div className="cq-calc-row"><span>GST @18% (on processing charge)</span><span>{fmt(gstAmount)}</span></div>
            <div className="cq-calc-row cq-calc-subrow"><span>IGST @18%</span><span>{fmt(gstAmount)}</span></div>
            <div className="cq-calc-row cq-calc-bold"><span>Invoice Value</span><span>{fmt(invoiceValue)}</span></div>
            <div className="cq-calc-row"><span>TCS @5% (N/A)</span><span>{fmt(tcs)}</span></div>
            <div className="cq-calc-row cq-calc-bold"><span>Total Payable</span><span>{fmt(totalPayable)}</span></div>
          </div>
          <WarningBox />
          <div className="cq-calc-profit">
            <div className="cq-profit-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              Your Profit
            </div>
            <div className="cq-calc-row cq-calc-bold" style={{ marginTop: 6 }}>
              <span>Total Profit</span>
              <span className="cq-profit-value">{fmt(profit)}</span>
            </div>
          </div>
        </>
      )}

      {/* ── Customer view (what the customer sees on their invoice) ── */}
      {mode === 'customer' && (
        <>
          <div className="cq-calc-rows">
            <div className="cq-calc-row"><span>Cost of Travel</span><span>{fmt(costOfTravel)}</span></div>
            <div className="cq-calc-row"><span>Processing Charge</span><span>{fmt(processingCharge)}</span></div>
            <div className="cq-calc-row"><span>GST on Processing</span><span>{fmt(gstAmount)}</span></div>
            <div className="cq-calc-row cq-calc-bold"><span>Invoice Value</span><span>{fmt(invoiceValue)}</span></div>
            <div className="cq-calc-row"><span>TCS @5% (N/A)</span><span>{fmt(tcs)}</span></div>
            <div className="cq-calc-row cq-calc-bold"><span>Total Payable</span><span>{fmt(totalPayable)}</span></div>
          </div>
          <WarningBox />
        </>
      )}
    </div>
  );
};

// ─── Step 1: Customer ─────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: 'IN', dial: '+91' }, { code: 'US', dial: '+1' }, { code: 'GB', dial: '+44' },
  { code: 'AE', dial: '+971' }, { code: 'SG', dial: '+65' }, { code: 'AU', dial: '+61' },
  { code: 'CA', dial: '+1' }, { code: 'DE', dial: '+49' }, { code: 'FR', dial: '+33' },
];

const Step1Customer = ({ data, onChange }) => {
  // Default mode is 'new' — shows the new customer form (matches reference image)
  const [mode, setMode] = useState('new');
  const [countryCode, setCountryCode] = useState('IN');
  const selectedDial = COUNTRY_CODES.find(c => c.code === countryCode)?.dial || '+91';

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">Customer Details</h3>
          <p className="cq-section-subtitle">
            {mode === 'new' ? 'Enter new customer details' : 'Search existing customer or add a new one'}
          </p>
        </div>

        {mode === 'new' ? (
          /* "← Search Existing" — outlined orange button */
          <button className="cq-search-existing-btn" onClick={() => setMode('search')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Search Existing
          </button>
        ) : (
          /* "+ Add New" — plain accent text button */
          <button className="cq-add-new-btn" onClick={() => setMode('new')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>
            </svg>
            Add New
          </button>
        )}
      </div>

      {/* ── Search mode ── */}
      {mode === 'search' && (
        <div className="cq-search-field">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={data.customerSearch || ''}
            onChange={e => onChange({ customerSearch: e.target.value })}
          />
        </div>
      )}

      {/* ── New customer form (matches reference image exactly) ── */}
      {mode === 'new' && (
        <div className="cq-new-customer-card">
          {/* Row 1: Full Name + Phone */}
          <div className="cq-form-grid-2">
            <div className="cq-field-group">
              <label>Full Name <span className="cq-required">*</span></label>
              <input
                type="text"
                placeholder="Customer name"
                value={data.newCustomerName || ''}
                onChange={e => onChange({ newCustomerName: e.target.value })}
              />
            </div>
            <div className="cq-field-group">
              <label>Phone <span className="cq-required">*</span></label>
              <div className="cq-phone-row">
                <select
                  className="cq-phone-code"
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code + c.dial} value={c.code}>{c.code} {c.dial}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  className="cq-phone-number"
                  placeholder="9876543210"
                  value={data.newCustomerPhone || ''}
                  onChange={e => onChange({ newCustomerPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email */}
          <div className="cq-field-group" style={{ marginTop: 16 }}>
            <label>Email <span className="cq-optional-label">(optional)</span></label>
            <input
              type="email"
              placeholder="customer@email.com"
              value={data.newCustomerEmail || ''}
              onChange={e => onChange({ newCustomerEmail: e.target.value })}
            />
          </div>

          {/* Row 3: Tax Identification */}
          <div style={{ marginTop: 16 }}>
            <p className="cq-tax-label">
              Tax Identification <span className="cq-optional-label">(optional)</span>
            </p>
            <div className="cq-form-grid-2" style={{ marginTop: 10 }}>
              <div className="cq-field-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  style={{ textTransform: 'uppercase' }}
                  value={data.newCustomerPAN || ''}
                  onChange={e => onChange({ newCustomerPAN: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="cq-field-group">
                <label>Customer GSTIN</label>
                <input
                  type="text"
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                  style={{ textTransform: 'uppercase' }}
                  value={data.newCustomerGSTIN || ''}
                  onChange={e => onChange({ newCustomerGSTIN: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          </div>

          {/* Create & Select Customer button */}
          <button className="cq-create-customer-btn" onClick={() => {}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>
            </svg>
            Create &amp; Select Customer
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Step 2 data constants ─────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar',
  'Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka',
  'Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
  'Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
];
const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Australia','Austria','Bahrain','Bangladesh','Belgium',
  'Bhutan','Brazil','Cambodia','Canada','China','Croatia','Czech Republic','Denmark',
  'Egypt','Ethiopia','Fiji','Finland','France','Georgia','Germany','Greece','Hong Kong',
  'Hungary','Iceland','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan',
  'Kazakhstan','Kenya','Kuwait','Laos','Lebanon','Luxembourg','Malaysia','Maldives',
  'Mauritius','Mexico','Morocco','Myanmar','Nepal','Netherlands','New Zealand','Norway',
  'Oman','Pakistan','Philippines','Poland','Portugal','Qatar','Romania','Russia',
  'Saudi Arabia','Singapore','South Africa','South Korea','Spain','Sri Lanka','Sweden',
  'Switzerland','Taiwan','Tanzania','Thailand','Tunisia','Turkey','UAE','Uganda',
  'Ukraine','United Kingdom','United States','Vietnam','Zimbabwe',
];

// ─── Step 2: Trip ─────────────────────────────────────────────────────────────
const Step2Trip = ({ data, onChange }) => {
  const [travOpen, setTravOpen] = useState(false);
  const destType = data.destType || 'domestic';
  const adults   = parseInt(data.adults)   || 1;
  const children = parseInt(data.children) || 0;
  const infants  = parseInt(data.infants)  || 0;
  const total    = adults + children + infants;

  const adjust = (field, delta, min = 0) => {
    const cur = parseInt(data[field]) || (field === 'adults' ? 1 : 0);
    onChange({ [field]: String(Math.max(min, cur + delta)) });
  };

  const travLabel = `${total} Traveller${total !== 1 ? 's' : ''}`;
  const paxParts  = [
    adults   > 0 ? `${adults} Adult${adults !== 1 ? 's' : ''}`       : null,
    children > 0 ? `${children} Child${children !== 1 ? 'ren' : ''}` : null,
    infants  > 0 ? `${infants} Infant${infants !== 1 ? 's' : ''}`    : null,
  ].filter(Boolean);
  const paxLabel = paxParts.join(', ');

  const travelerDetails = data.travelerDetails || [];
  const updateTraveler  = (idx, field, val) => {
    const arr = [...(data.travelerDetails || [])];
    if (!arr[idx]) arr[idx] = { name: '', passportId: '' };
    arr[idx] = { ...arr[idx], [field]: val };
    onChange({ travelerDetails: arr });
  };
  const getType = (i) => {
    if (i < adults)            return 'Adult';
    if (i < adults + children) return 'Child';
    return 'Infant';
  };

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">Trip Details</h3>
          <p className="cq-section-subtitle">Enter the travel destination and dates</p>
        </div>
      </div>

      {/* Destination Type toggle */}
      <div className="cq-field-group">
        <label>
          Destination Type
          <span className="cq-info-icon" title="Choose domestic (within India) or international">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
        </label>
        <div className="cq-dest-toggle">
          <button
            type="button"
            className={`cq-dest-opt${destType === 'domestic' ? ' cq-dest-opt-active' : ''}`}
            onClick={() => onChange({ destType: 'domestic', country: '', state: '' })}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Domestic
          </button>
          <button
            type="button"
            className={`cq-dest-opt${destType === 'international' ? ' cq-dest-opt-active' : ''}`}
            onClick={() => onChange({ destType: 'international', country: '', state: '' })}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            International
          </button>
        </div>
      </div>

      {/* TCS warning — international only */}
      {destType === 'international' && (
        <div className="cq-tcs-banner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>TCS @5% will be applied for international packages (2+ services)</span>
          <span className="cq-info-icon" style={{ marginLeft: 4 }} title="TCS applies per Income Tax rules for overseas tours"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>
        </div>
      )}

      {/* Country of Travel — international */}
      {destType === 'international' && (
        <div className="cq-field-group">
          <label>Country of Travel</label>
          <div className="cq-select-wrap">
            <select value={data.country || ''} onChange={e => onChange({ country: e.target.value })}>
              <option value="">Select country...</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <svg className="cq-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      )}

      {/* State of Travel — domestic */}
      {destType === 'domestic' && (
        <div className="cq-field-group">
          <label>
            State of Travel
            <span className="cq-info-icon" title="The primary state you are travelling to"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>
          </label>
          <div className="cq-select-wrap">
            <select value={data.state || ''} onChange={e => onChange({ state: e.target.value })}>
              <option value="">Select state...</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg className="cq-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      )}

      {/* Place of Travel */}
      <div className="cq-field-group">
        <label>Place of Travel</label>
        <input
          type="text"
          placeholder={destType === 'international' ? 'e.g., Bali, Paris' : 'e.g., Jaipur, Manali'}
          value={data.placeOfTravel || ''}
          onChange={e => onChange({ placeOfTravel: e.target.value })}
        />
      </div>

      {/* Travel Dates — split card */}
      <div className="cq-field-group">
        <label>Travel Dates</label>
        <div className="cq-date-split">
          <div className="cq-date-half">
            <span className="cq-date-sub-label">DEPARTURE</span>
            <input
              type="date"
              className="cq-date-input"
              value={data.departureDate || ''}
              onChange={e => onChange({ departureDate: e.target.value })}
            />
          </div>
          <div className="cq-date-sep" />
          <div className="cq-date-half">
            <span className="cq-date-sub-label">RETURN</span>
            <input
              type="date"
              className="cq-date-input"
              value={data.returnDate || ''}
              onChange={e => onChange({ returnDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Travellers — expandable */}
      <div className="cq-field-group">
        <label>Travellers</label>
        <div className="cq-travellers-wrap">
          <button type="button" className="cq-travellers-row" onClick={() => setTravOpen(o => !o)}>
            <div className="cq-trav-summary">
              <span className="cq-trav-count">{travLabel}</span>
              <span className="cq-trav-dot">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span className="cq-trav-pax">{paxLabel}</span>
            </div>
            <svg className={`cq-trav-chevron${travOpen ? ' cq-trav-chevron-open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          {travOpen && (
            <div className="cq-trav-expand">
              {[['adults','Adults','12+ years',1],['children','Children','2–11 years',0],['infants','Infants','Under 2 years',0]].map(([field,label,sub,minV]) => (
                <div key={field} className="cq-trav-counter-row">
                  <div>
                    <div className="cq-trav-type-label">{label}</div>
                    <div className="cq-trav-type-sub">{sub}</div>
                  </div>
                  <div className="cq-trav-counter">
                    <button type="button" onClick={() => adjust(field, -1, minV)}>−</button>
                    <span>{field === 'adults' ? adults : field === 'children' ? children : infants}</span>
                    <button type="button" onClick={() => adjust(field, 1)}>+</button>
                  </div>
                </div>
              ))}
              <button type="button" className="cq-trav-done" onClick={() => setTravOpen(false)}>Done</button>
            </div>
          )}
        </div>
      </div>

      {/* Traveler Details */}
      <div className="cq-traveler-details-section">
        <div className="cq-traveler-details-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          Traveler Details
        </div>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="cq-traveler-row">
            <span className={`cq-trav-badge cq-trav-badge-${getType(i).toLowerCase()}`}>{getType(i)}</span>
            <input type="text" placeholder="Full name" value={(travelerDetails[i] || {}).name || ''} onChange={e => updateTraveler(i, 'name', e.target.value)} />
            <input type="text" placeholder="Passport / ID No." value={(travelerDetails[i] || {}).passportId || ''} onChange={e => updateTraveler(i, 'passportId', e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Step 3: Services ─────────────────────────────────────────────────────────
const CURRENCIES = ['INR','USD','EUR','AED','SGD','AUD','GBP'];

const Step3Services = ({ data, onChange }) => {
  const selected   = data.services       || {};
  const details    = data.serviceDetails || {};
  const todayStr   = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const selectedKeys = SERVICE_LIST.filter(s => selected[s.key]).map(s => s.key);
  const pkgDetected  = selectedKeys.length >= 2;

  const toggleService = (key) => {
    const next = { ...selected, [key]: !selected[key] };
    // if deselecting, remove from details & costs
    if (!next[key]) {
      const nd = { ...details }; delete nd[key];
      const nc = { ...(data.serviceCosts || {}) }; delete nc[key];
      onChange({ services: next, serviceDetails: nd, serviceCosts: nc });
    } else {
      if (!details[key]) {
        onChange({ services: next, serviceDetails: { ...details, [key]: { cost: '', margin: '', vendor: '', currency: 'INR', mode: 'simple' } } });
      } else {
        onChange({ services: next });
      }
    }
  };

  const updateDetail = (key, field, val) => {
    const nd = { ...details, [key]: { ...(details[key] || { cost: '', margin: '', vendor: '', currency: 'INR', mode: 'simple' }), [field]: val } };
    const patch = { serviceDetails: nd };
    // keep serviceCosts in sync for Step4
    if (field === 'cost') patch.serviceCosts = { ...(data.serviceCosts || {}), [key]: val };
    onChange(patch);
  };

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">Select Services</h3>
          <p className="cq-section-subtitle">Choose the services and enter their costs</p>
        </div>
      </div>

      {/* ── Service grid ── */}
      <div className="cq-s3-grid">
        {SERVICE_LIST.map(svc => {
          const isOn = !!selected[svc.key];
          return (
            <button key={svc.key} type="button" className={`cq-s3-card${isOn ? ' cq-s3-card-on' : ''}`} onClick={() => toggleService(svc.key)}>
              {isOn && (
                <span className="cq-s3-check">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              )}
              <div className={`cq-s3-icon${isOn ? ' cq-s3-icon-on' : ''}`}>{svc.icon}</div>
              <span className="cq-s3-label">{svc.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Cost Details ── */}
      {selectedKeys.length > 0 && (
        <>
          <div className="cq-cost-section-header">
            <div className="cq-cost-divider-line" />
            <span className="cq-cost-divider-text">COST DETAILS</span>
            <div className="cq-cost-divider-line" />
          </div>
          <p className="cq-fx-ref">FX reference: Frankfurter (ECB daily) • Updated {todayStr}</p>

          {selectedKeys.map(key => {
            const svc = SERVICE_LIST.find(s => s.key === key);
            const det = details[key] || { cost: '', margin: '', vendor: '', currency: 'INR', mode: 'simple' };
            return (
              <div key={key} className="cq-cost-block">
                {/* Header row */}
                <div className="cq-cost-block-header">
                  <div className="cq-cost-svc-icon">{svc.icon}</div>
                  <span className="cq-cost-svc-name">{svc.label}</span>
                  <button type="button" className="cq-cost-info-btn" title="Help">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </button>
                  <div className="cq-cost-mode-toggle">
                    <button type="button" className={`cq-cost-mode-btn${det.mode !== 'detailed' ? ' cq-cost-mode-active' : ''}`} onClick={() => updateDetail(key, 'mode', 'simple')}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                      Simple
                    </button>
                    <button type="button" className={`cq-cost-mode-btn${det.mode === 'detailed' ? ' cq-cost-mode-active' : ''}`} onClick={() => updateDetail(key, 'mode', 'detailed')}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                      Detailed
                    </button>
                  </div>
                </div>

                {/* Input row */}
                <div className="cq-cost-input-row">
                  <div className="cq-currency-wrap">
                    <span className="cq-currency-rupee">₹</span>
                    <select value={det.currency || 'INR'} onChange={e => updateDetail(key, 'currency', e.target.value)} className="cq-currency-select">
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, color:'var(--text-muted)' }}><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <input type="number" placeholder="Cost" className="cq-cost-input" value={det.cost} onChange={e => updateDetail(key, 'cost', e.target.value)} />
                  <span className="cq-cost-sep-rupee">₹</span>
                  <input type="number" placeholder="Margin" className="cq-cost-input" value={det.margin} onChange={e => updateDetail(key, 'margin', e.target.value)} />
                  <input type="text" placeholder="Vendor name" className="cq-vendor-input" value={det.vendor} onChange={e => updateDetail(key, 'vendor', e.target.value)} />
                </div>
                <p className="cq-cost-note">Entered in {det.currency || 'INR'}</p>
              </div>
            );
          })}

          {/* Package detected banner */}
          {pkgDetected && (
            <div className="cq-pkg-banner">
              <strong>Package detected:</strong>&nbsp;{selectedKeys.length}+ services selected. This qualifies as a package for GST/TCS purposes.
              <span className="cq-info-icon" style={{ marginLeft: 6 }} title="2+ services = tour package under GST rules">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Step 4: Pricing ──────────────────────────────────────────────────────────
const BILLING_MODELS = [
  { key: 'pure-agent',      label: 'Pure Agent (GST @18% on margin only)',             tip: 'You act as a pure agent — GST charged only on your margin/fee, not the full package value.' },
  { key: 'principal-18',    label: 'Principal (GST @18% on full value)',                tip: 'You are the principal supplier — GST @18% charged on the full tour package value.' },
  { key: 'principal-5',     label: 'Principal (GST @5% on total, No ITC)',              tip: 'Flat 5% GST on total value with no Input Tax Credit available.' },
  { key: 'principal-pass',  label: 'Principal Pass-through (GST @18% on full, ITC available)', tip: 'GST @18% on full value, ITC can be claimed on input services.' },
];

const PLACE_OF_SUPPLY_LIST = [
  'Andaman & Nicobar Islands (35)','Andhra Pradesh (37)','Arunachal Pradesh (12)',
  'Assam (18)','Bihar (10)','Chandigarh (04)','Chhattisgarh (22)',
  'Dadra & NH / Daman & Diu (26)','Delhi (07)','Goa (30)','Gujarat (24)',
  'Haryana (06)','Himachal Pradesh (02)','Jammu & Kashmir (01)','Jharkhand (20)',
  'Karnataka (29)','Kerala (32)','Ladakh (38)','Lakshadweep (31)',
  'Madhya Pradesh (23)','Maharashtra (27)','Manipur (14)','Meghalaya (17)',
  'Mizoram (15)','Nagaland (13)','Odisha (21)','Puducherry (34)','Punjab (03)',
  'Rajasthan (08)','Sikkim (11)','Tamil Nadu (33)','Telangana (36)','Tripura (16)',
  'Uttar Pradesh (09)','Uttarakhand (05)','West Bengal (19)',
];

const InfoIcon = ({ tip }) => (
  <span className="cq-info-icon" title={tip}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  </span>
);

const Step4Pricing = ({ data, onChange }) => {
  const billingModel   = data.billingModel   || 'pure-agent';
  const placeOfSupply  = data.placeOfSupply  || '';
  const pricingMode    = data.pricingMode    || 'total-quote';
  const dpcDisplay     = data.dpcDisplay     || 'exclusive';

  const setField = (key, val, extra = {}) => onChange({ [key]: val, ...extra });

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">Pricing &amp; Billing</h3>
          <p className="cq-section-subtitle">Configure billing model and set your margin</p>
        </div>
      </div>

      {/* ── Billing Model ── */}
      <div className="cq-p4-section-label">
        Billing Model <InfoIcon tip="Choose how GST is applied to this quote" />
      </div>
      <div className="cq-billing-model-group">
        {BILLING_MODELS.map(bm => (
          <button
            key={bm.key}
            type="button"
            className={`cq-billing-model-card${billingModel === bm.key ? ' cq-bm-active' : ''}`}
            onClick={() => setField('billingModel', bm.key)}
          >
            <span className={`cq-bm-radio${billingModel === bm.key ? ' cq-bm-radio-on' : ''}`}>
              {billingModel === bm.key && <span className="cq-bm-radio-dot" />}
            </span>
            <span className="cq-bm-label">{bm.label}</span>
            <InfoIcon tip={bm.tip} />
          </button>
        ))}
      </div>

      {/* ── Place of Supply ── */}
      <div className="cq-p4-section-label" style={{ marginTop: 22 }}>
        Place of Supply <InfoIcon tip="The state where the service is supplied/consumed. Determines IGST/CGST/SGST applicability." />
      </div>
      <div className="cq-select-wrap" style={{ marginTop: 6 }}>
        <select
          value={placeOfSupply}
          onChange={e => setField('placeOfSupply', e.target.value)}
        >
          <option value="">Select state...</option>
          {PLACE_OF_SUPPLY_LIST.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <svg className="cq-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      {placeOfSupply && (
        <span className="cq-gst-badge">IGST (18%)</span>
      )}

      {/* ── Pricing Mode toggle ── */}
      <div className="cq-p4-section-label" style={{ marginTop: 22 }}>
        How do you want to set pricing? <InfoIcon tip="Choose whether to enter the total quote price and back-calculate margin, or set margin directly." />
      </div>
      <div className="cq-pricing-mode-toggle">
        <button
          type="button"
          className={`cq-pricing-mode-btn${pricingMode === 'total-quote' ? ' cq-pm-active' : ''}`}
          onClick={() => setField('pricingMode', 'total-quote')}
        >
          Total Quote → Calculate Margin
        </button>
        <button
          type="button"
          className={`cq-pricing-mode-btn${pricingMode === 'set-margin' ? ' cq-pm-active' : ''}`}
          onClick={() => setField('pricingMode', 'set-margin')}
        >
          Set Margin → Calculate Total
        </button>
      </div>

      {/* ── Total Quote mode ── */}
      {pricingMode === 'total-quote' && (
        <>
          <div className="cq-p4-section-label" style={{ marginTop: 20 }}>
            Total Quote Amount (incl. GST + TCS) <InfoIcon tip="The total amount the customer will pay, inclusive of all taxes." />
          </div>
          <input
            type="number"
            className="cq-p4-input"
            placeholder="Enter total amount customer will pay"
            value={data.totalQuoteAmount || ''}
            onChange={e => setField('totalQuoteAmount', e.target.value)}
          />
        </>
      )}

      {/* ── Set Margin mode ── */}
      {pricingMode === 'set-margin' && (
        <>
          <div className="cq-p4-section-label" style={{ marginTop: 20 }}>
            Total Margin Amount (₹) <InfoIcon tip="Your total margin. Per-service margins from Step 3 are summed automatically; enter here to override." />
          </div>
          <input
            type="number"
            className="cq-p4-input"
            placeholder="Enter your desired margin (or set per-service)"
            value={data.marginAmount || ''}
            onChange={e => setField('marginAmount', e.target.value, { hiddenMarkup: e.target.value })}
          />
          <p className="cq-p4-hint">Per-service margins are set in the Services step. Edit here to override.</p>
        </>
      )}

      {/* ── Commission Earned ── */}
      <div className="cq-p4-section-label" style={{ marginTop: 20 }}>
        Commission Earned (from vendors) <InfoIcon tip="Any commission received from vendors. Tracked separately and added to profit." />
      </div>
      <input
        type="number"
        className="cq-p4-input"
        placeholder="Optional vendor commission"
        value={data.vendorCommission || ''}
        onChange={e => setField('vendorCommission', e.target.value)}
      />
      <p className="cq-p4-hint">Commission is tracked separately and added to total profit</p>

      {/* ── Display Processing Charge card ── */}
      <div className="cq-dpc-card">
        <div className="cq-dpc-header">
          <span className="cq-dpc-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          <span className="cq-dpc-title">Display Processing Charge (Customer Quote)</span>
        </div>
        <p className="cq-dpc-desc">Customize the processing charge shown to the customer. This doesn't affect actual billing — only the customer-facing display.</p>
        <div className="cq-dpc-toggle">
          <button
            type="button"
            className={`cq-dpc-btn${dpcDisplay === 'inclusive' ? ' cq-dpc-btn-active' : ''}`}
            onClick={() => setField('dpcDisplay', 'inclusive')}
          >Inclusive of GST</button>
          <button
            type="button"
            className={`cq-dpc-btn${dpcDisplay === 'exclusive' ? ' cq-dpc-btn-active' : ''}`}
            onClick={() => setField('dpcDisplay', 'exclusive')}
          >
            Exclusive of GST
            <InfoIcon tip="Processing charge shown to customer excludes GST amount" />
          </button>
        </div>
        <input
          type="number"
          className="cq-p4-input"
          style={{ marginTop: 10 }}
          placeholder="Display processing charge amount"
          value={data.displayProcessingCharge || ''}
          onChange={e => setField('displayProcessingCharge', e.target.value, { processingCharge: e.target.value })}
        />
      </div>
    </div>
  );
};

// ─── Step 5: Review ───────────────────────────────────────────────────────────
const Step5Review = ({ data, onChange, editMode, isPrefilled, prefilledCustomer }) => {
  const activeServices = SERVICE_LIST.filter(s => (data.services || {})[s.key]);
  const serviceCosts = data.serviceCosts || {};
  const totalPayable = parseFloat(data.totalQuoteAmount) || (
    Object.values(serviceCosts).reduce((s, v) => s + (parseFloat(v) || 0), 0) +
    (parseFloat(data.hiddenMarkup) || 0) +
    (parseFloat(data.processingCharge) || 0)
  );

  const customerName = (isPrefilled && prefilledCustomer?.name) ||
    data.customerSearch || data.newCustomerName || '—';
  const destLabel = data.destination
    ? `${data.destination} (${data.destType === 'domestic' ? 'Domestic' : 'International'})`
    : `— (${data.destType === 'domestic' ? 'Domestic' : data.destType || '—'})`;

  const inclusions  = data.inclusions  || [];
  const exclusions  = data.exclusions  || [];

  const addItem = (key, list) => onChange({ [key]: [...list, ''] });
  const updateItem = (key, list, idx, val) =>
    onChange({ [key]: list.map((x, i) => i === idx ? val : x) });
  const removeItem = (key, list, idx) =>
    onChange({ [key]: list.filter((_, i) => i !== idx) });

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">{editMode ? 'Review & Update' : 'Review Quote'}</h3>
          <p className="cq-section-subtitle">
            {editMode ? 'Review the quote details before updating' : 'Review all details before generating the quote'}
          </p>
        </div>
      </div>

      {/* ── 2×2 Summary Grid ── */}
      <div className="cq-rv-grid">
        <div className="cq-rv-cell">
          <span className="cq-rv-label">CUSTOMER</span>
          <span className="cq-rv-value">{customerName}</span>
        </div>
        <div className="cq-rv-cell">
          <span className="cq-rv-label">DESTINATION</span>
          <span className="cq-rv-value">{destLabel}</span>
        </div>
        <div className="cq-rv-cell">
          <span className="cq-rv-label">SERVICES</span>
          <span className="cq-rv-value">{activeServices.length} selected</span>
        </div>
        <div className="cq-rv-cell cq-rv-cell-total">
          <span className="cq-rv-label cq-rv-label-total">TOTAL PAYABLE</span>
          <span className="cq-rv-value-total">₹{totalPayable.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* ── Inclusions ── */}
      <div className="cq-rv-list-section">
        <h4 className="cq-rv-list-title">Inclusions</h4>
        {inclusions.map((item, idx) => (
          <div key={idx} className="cq-rv-list-item-row">
            <input
              type="text"
              className="cq-rv-list-input"
              placeholder="e.g. Airport transfers included"
              value={item}
              onChange={e => updateItem('inclusions', inclusions, idx, e.target.value)}
            />
            <button type="button" className="cq-rv-remove-btn" onClick={() => removeItem('inclusions', inclusions, idx)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
        <button type="button" className="cq-rv-add-btn" onClick={() => addItem('inclusions', inclusions)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Inclusion
        </button>
        <p className="cq-rv-list-hint">List what is included in the quoted price (visible to customer)</p>
      </div>

      {/* ── Exclusions ── */}
      <div className="cq-rv-list-section">
        <h4 className="cq-rv-list-title">Exclusions</h4>
        {exclusions.map((item, idx) => (
          <div key={idx} className="cq-rv-list-item-row">
            <input
              type="text"
              className="cq-rv-list-input"
              placeholder="e.g. Personal expenses not included"
              value={item}
              onChange={e => updateItem('exclusions', exclusions, idx, e.target.value)}
            />
            <button type="button" className="cq-rv-remove-btn" onClick={() => removeItem('exclusions', exclusions, idx)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
        <button type="button" className="cq-rv-add-btn" onClick={() => addItem('exclusions', exclusions)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Exclusion
        </button>
        <p className="cq-rv-list-hint">List what is not included in the quoted price (visible to customer)</p>
      </div>

      {/* ── Customer Notes ── */}
      <div className="cq-field-group" style={{ marginTop: 20 }}>
        <label>Notes (visible to customer)</label>
        <textarea
          rows="4"
          placeholder="Any notes for the customer..."
          value={data.customerNotes || ''}
          onChange={e => onChange({ customerNotes: e.target.value })}
        />
      </div>

      {/* ── Internal Notes ── */}
      <div className="cq-field-group" style={{ marginTop: 16 }}>
        <label>Internal Notes (private)</label>
        <textarea
          rows="4"
          placeholder="Internal notes for your team..."
          value={data.internalNotes || ''}
          onChange={e => onChange({ internalNotes: e.target.value })}
        />
      </div>
    </div>
  );
};

// ─── Step 6: Itinerary ────────────────────────────────────────────────────────
const IT_CO = {
  name:  'WANDERLUST TRAVELS',
  tag:   'Crafting Memories, One Journey at a Time',
  ref:   '+919876543210',
  gstin: 'GSTIN 27AABCW1234F1ZP',
  email: 'demo@moontrip.in',
};
const fmtDate6 = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const todayStr = () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const DEFAULT_PMT  = '25% advance on confirmation · 75% balance 7 days before travel';
const DEFAULT_CANC = '≥ 30 days: Nil · 16–29 days: 25% · 8–15 days: 50% · 0–7 days: 100%';

const Step6Itinerary = ({ data, onChange, editMode }) => {
  const openDemo    = useDemoPopup();
  const mode        = data.itMode  || 'simple';
  const view        = data.itView  || 'agent';
  const tab         = data.itTab   || 'itinerary';
  const days        = data.itDays  || [{ title: '', highlight: '', date: '', activities: [''], hotel: '', meals: '' }];
  const costItems   = data.itCost  || [{ label: 'Hotels', amount: '' }];
  const inclusions  = data.inclusions  || [];
  const exclusions  = data.exclusions  || [];

  const custName = data.customerSearch || data.newCustomerName || '—';
  const paxStr   = [
    data.adults   && `${data.adults} Adult${+data.adults !== 1 ? 's' : ''}`,
    data.children && `${data.children} Child${+data.children !== 1 ? 'ren' : ''}`,
    data.infants  && `${data.infants} Infant${+data.infants !== 1 ? 's' : ''}`,
  ].filter(Boolean).join(', ') || '1 Adult';

  const subTotal = costItems.reduce((s, x) => s + (parseFloat(x.amount) || 0), 0);
  const gstAmt   = Math.round(subTotal * 0.05);
  const totalPay = subTotal + gstAmt;

  const filledFields = [
    custName !== '—', days[0]?.title, days[0]?.activities?.[0],
    costItems.some(x => x.amount), data.paymentTerms,
  ].filter(Boolean).length;
  const pct = Math.round((filledFields / 5) * 100);

  // Day helpers
  const dSet    = (i, k, v)    => onChange({ itDays: days.map((d, j) => j === i ? { ...d, [k]: v } : d) });
  const dActAdd = (i)          => onChange({ itDays: days.map((d, j) => j === i ? { ...d, activities: [...(d.activities || []), ''] } : d) });
  const dActRem = (i, ai)      => onChange({ itDays: days.map((d, j) => j === i ? { ...d, activities: d.activities.filter((_, k) => k !== ai) } : d) });
  const dActSet = (i, ai, v)   => onChange({ itDays: days.map((d, j) => j === i ? { ...d, activities: d.activities.map((a, k) => k === ai ? v : a) } : d) });
  const dayAdd  = ()           => onChange({ itDays: [...days, { title: '', highlight: '', date: '', activities: [''], hotel: '', meals: '' }] });
  const dayRem  = (i)          => onChange({ itDays: days.filter((_, j) => j !== i) });

  // Cost helpers
  const cSet = (i, k, v) => onChange({ itCost: costItems.map((x, j) => j === i ? { ...x, [k]: v } : x) });
  const cRem = (i)        => onChange({ itCost: costItems.filter((_, j) => j !== i) });
  const cAdd = ()         => onChange({ itCost: [...costItems, { label: '', amount: '' }] });

  // Incl/Excl helpers
  const inclAdd = ()       => onChange({ inclusions: [...inclusions, ''] });
  const exclAdd = ()       => onChange({ exclusions: [...exclusions, ''] });
  const inclSet = (i, v)   => onChange({ inclusions: inclusions.map((x, j) => j === i ? v : x) });
  const exclSet = (i, v)   => onChange({ exclusions: exclusions.map((x, j) => j === i ? v : x) });
  const inclRem = (i)      => onChange({ inclusions: inclusions.filter((_, j) => j !== i) });
  const exclRem = (i)      => onChange({ exclusions: exclusions.filter((_, j) => j !== i) });

  const renderDoc = (isAgent) => (
    <div className="cq-it-doc">
      {/* ── Banner ── */}
      <div className="cq-it-doc-banner">
        <div>
          <div className="cq-it-co-name">{IT_CO.name}</div>
          <div className="cq-it-co-tag">{IT_CO.tag}</div>
        </div>
        <div className="cq-it-co-ref">
          <span>Ref</span><span>{IT_CO.ref}</span><span>{IT_CO.gstin}</span>
        </div>
      </div>

      {/* ── Travel Itinerary meta ── */}
      <div className="cq-it-meta-wrap">
        <div className="cq-it-main-title">Travel Itinerary</div>
        <div className="cq-it-meta-row">
          {[
            { lbl: 'DURATION',   key: 'quoteDuration', ph: 'Duration' },
            { lbl: 'TIER',       key: 'quoteTier',     ph: 'Premium' },
            { lbl: 'ROUTE',      key: 'quoteRoute',    ph: 'Route' },
          ].map(({ lbl, key, ph }) => (
            <div key={key} className="cq-it-meta-cell">
              <span className="cq-it-meta-lbl">{lbl}</span>
              {isAgent
                ? <input className="cq-it-meta-input" placeholder={ph} value={data[key] || ''} onChange={e => onChange({ [key]: e.target.value })} />
                : <span className="cq-it-meta-val">{data[key] || '—'}</span>}
            </div>
          ))}
          <div className="cq-it-meta-cell">
            <span className="cq-it-meta-lbl">PASSENGERS</span>
            <span className="cq-it-meta-val">{paxStr}</span>
          </div>
        </div>

        <div className="cq-it-bottom-row">
          <div className="cq-it-cust-cell">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {isAgent
              ? <input className="cq-it-cust-input" value={custName} readOnly />
              : <span className="cq-it-cust-name">{custName}</span>}
          </div>
          <div className="cq-it-dates-grid">
            <span className="cq-it-date-lbl">Trip Start</span>
            {isAgent ? <input type="date" className="cq-it-date-input" value={data.tripStart || data.departureDate || ''} onChange={e => onChange({ tripStart: e.target.value })} /> : <span className="cq-it-date-val">{fmtDate6(data.tripStart || data.departureDate)}</span>}
            <span className="cq-it-date-lbl">Trip End</span>
            {isAgent ? <input type="date" className="cq-it-date-input" value={data.tripEnd || data.returnDate || ''} onChange={e => onChange({ tripEnd: e.target.value })} /> : <span className="cq-it-date-val">{fmtDate6(data.tripEnd || data.returnDate)}</span>}
            <span className="cq-it-date-lbl">Issued</span>
            <span className="cq-it-date-val">{todayStr()}</span>
            <span className="cq-it-date-lbl">Valid Until</span>
            {isAgent ? <input type="date" className="cq-it-date-input" value={data.quoteValidUntil || ''} onChange={e => onChange({ quoteValidUntil: e.target.value })} /> : <span className="cq-it-date-val">{fmtDate6(data.quoteValidUntil)}</span>}
          </div>
        </div>
      </div>

      {/* ── AI Auto-Polish (agent only) ── */}
      {isAgent && (
        <div className="cq-it-ai-card">
          <div className="cq-it-ai-left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>
            <div>
              <div className="cq-it-ai-title">AI Auto-Polish</div>
              <div className="cq-it-ai-sub">Fixes typos, formats dates, capitalizes text</div>
            </div>
          </div>
          <button className="cq-it-ai-btn" onClick={openDemo}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>
            Polish with AI
          </button>
        </div>
      )}

      {/* ── Day-by-Day Itinerary ── */}
      <div className="cq-it-section-lbl">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.4-8 13-8 13S4 15.4 4 10a8 8 0 0 1 8-8z"/></svg>
        DAY-BY-DAY ITINERARY
      </div>
      {isAgent ? (
        <>
          {days.map((day, idx) => (
            <div key={idx} className="cq-it-day-card">
              <div className="cq-it-day-top-row">
                <div className="cq-it-day-circle">{String(idx + 1).padStart(2, '0')}</div>
                <input className="cq-it-day-title-input" placeholder="Day title (required)" value={day.title} onChange={e => dSet(idx, 'title', e.target.value)} />
                <button className="cq-it-remove-btn" onClick={() => dayRem(idx)}>Remove</button>
              </div>
              <div className="cq-it-day-row">
                <button type="button" className="cq-it-date-chip">Date</button>
                <input className="cq-it-highlight-input" placeholder="Highlights / theme line (required)" value={day.highlight} onChange={e => dSet(idx, 'highlight', e.target.value)} />
              </div>
              {(day.activities || ['']).map((act, ai) => (
                <div key={ai} className="cq-it-act-row">
                  <span className="cq-it-bullet">•</span>
                  <input className="cq-it-act-input" placeholder="Describe activity..." value={act} onChange={e => dActSet(idx, ai, e.target.value)} />
                  <button type="button" className="cq-it-act-rem" onClick={() => dActRem(idx, ai)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
              <button type="button" className="cq-it-add-act" onClick={() => dActAdd(idx)}>+ Add activity</button>
              <div className="cq-it-hotel-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                <input className="cq-it-hotel-input" placeholder="Hotel / accommodation" value={day.hotel} onChange={e => dSet(idx, 'hotel', e.target.value)} />
              </div>
              <div className="cq-it-hotel-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                <input className="cq-it-hotel-input" placeholder="Meals included" value={day.meals} onChange={e => dSet(idx, 'meals', e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button" className="cq-it-add-day-btn" onClick={dayAdd}>+ Add Day</button>
        </>
      ) : (
        days.map((day, idx) => (
          <div key={idx} className="cq-it-day-preview-row">
            <div className="cq-it-day-circle-sm">{String(idx + 1).padStart(2, '0')}</div>
            <div>
              <div className="cq-it-day-preview-title">{day.title || '—'}</div>
              <div className="cq-it-day-preview-hl">{day.highlight}</div>
              {(day.activities || []).filter(Boolean).map((a, ai) => <div key={ai} className="cq-it-day-preview-act">• {a}</div>)}
            </div>
          </div>
        ))
      )}

      {/* ── Inclusions & Exclusions ── */}
      <div className="cq-it-section-lbl" style={{ marginTop: 20 }}>INCLUSIONS &amp; EXCLUSIONS</div>
      <div className="cq-it-incl-excl-grid">
        <div className="cq-it-incl-col">
          {isAgent && inclusions.map((x, i) => (
            <div key={i} className="cq-it-incl-row">
              <input className="cq-it-incl-input" value={x} placeholder="Inclusion" onChange={e => inclSet(i, e.target.value)} />
              <button type="button" className="cq-rv-remove-btn" onClick={() => inclRem(i)}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
          {!isAgent && inclusions.filter(Boolean).map((x, i) => <div key={i} className="cq-it-incl-item">✓ {x}</div>)}
          {isAgent && <button type="button" className="cq-it-add-chip" onClick={inclAdd}>+ Add</button>}
        </div>
        <div className="cq-it-excl-col">
          {isAgent && exclusions.map((x, i) => (
            <div key={i} className="cq-it-incl-row">
              <input className="cq-it-incl-input" value={x} placeholder="Exclusion" onChange={e => exclSet(i, e.target.value)} />
              <button type="button" className="cq-rv-remove-btn" onClick={() => exclRem(i)}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
          {!isAgent && exclusions.filter(Boolean).map((x, i) => <div key={i} className="cq-it-excl-item">✗ {x}</div>)}
          {isAgent && <button type="button" className="cq-it-add-chip cq-it-add-chip-excl" onClick={exclAdd}>+ Add</button>}
        </div>
      </div>

      {/* ── Cost Summary ── */}
      <div className="cq-it-section-lbl" style={{ marginTop: 20 }}>COST SUMMARY</div>
      {isAgent ? (
        <>
          {costItems.map((item, i) => (
            <div key={i} className="cq-it-cost-row">
              <input className="cq-it-cost-label" placeholder="Item label" value={item.label} onChange={e => cSet(i, 'label', e.target.value)} />
              <span className="cq-it-cost-rupee">₹</span>
              <input type="number" className="cq-it-cost-amt" placeholder="0" value={item.amount} onChange={e => cSet(i, 'amount', e.target.value)} />
              <button type="button" className="cq-it-act-rem" style={{ marginLeft: 6 }} onClick={() => cRem(i)}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
          <button type="button" className="cq-it-add-lineitem" onClick={cAdd}>+ Add line item</button>
        </>
      ) : (
        costItems.filter(x => x.label).map((item, i) => (
          <div key={i} className="cq-it-cost-preview-row">
            <span>{item.label}</span><span>₹{(parseFloat(item.amount) || 0).toLocaleString('en-IN')}</span>
          </div>
        ))
      )}
      <div className="cq-it-cost-totals">
        <div className="cq-it-subtotal-row"><span>Sub-total</span><span>₹{subTotal.toLocaleString('en-IN')}</span></div>
        <div className="cq-it-subtotal-row"><span>GST @ 5%</span><span>₹{gstAmt.toLocaleString('en-IN')}</span></div>
        <div className="cq-it-total-bar"><span>Total Payable</span><span>₹ {totalPay.toLocaleString('en-IN')}</span></div>
      </div>

      {/* ── Payment Terms / Cancellation ── */}
      <div className="cq-it-terms-grid">
        <div>
          <div className="cq-it-terms-lbl">PAYMENT TERMS</div>
          {isAgent
            ? <textarea className="cq-it-terms-ta" rows="2" value={data.paymentTerms || DEFAULT_PMT} onChange={e => onChange({ paymentTerms: e.target.value })} />
            : <p className="cq-it-terms-text">{data.paymentTerms || DEFAULT_PMT}</p>}
        </div>
        <div>
          <div className="cq-it-terms-lbl">CANCELLATION</div>
          {isAgent
            ? <textarea className="cq-it-terms-ta" rows="2" value={data.cancellationPolicy || DEFAULT_CANC} onChange={e => onChange({ cancellationPolicy: e.target.value })} />
            : <p className="cq-it-terms-text">{data.cancellationPolicy || DEFAULT_CANC}</p>}
        </div>
      </div>

      {/* ── Notes ── */}
      {isAgent ? (
        <textarea className="cq-it-notes-ta" rows="2" placeholder="Additional notes (e.g. Hotel category guaranteed; specific property subject to availability.)" value={data.quoteFooterNotes || ''} onChange={e => onChange({ quoteFooterNotes: e.target.value })} />
      ) : (
        data.quoteFooterNotes && <p className="cq-it-notes-text">{data.quoteFooterNotes}</p>
      )}
      <p className="cq-it-thankyou">Thank you for choosing Wanderlust Travels.<br />We look forward to crafting an extraordinary journey for you.</p>

      {/* ── Footer bar ── */}
      <div className="cq-it-footer-bar">
        <span>{IT_CO.ref} · {IT_CO.email} · {IT_CO.gstin}</span>
        <span>{IT_CO.name}</span>
      </div>
    </div>
  );

  return (
    <div className="cq-step-content cq-step-6-wrap">
      {/* ── Mode toggle ── */}
      <div className="cq-it-mode-wrap">
        <div className="cq-it-mode-toggle">
          <button type="button" className={`cq-it-mode-btn${mode === 'simple' ? ' cq-it-mode-active' : ''}`} onClick={() => onChange({ itMode: 'simple' })}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Simple
          </button>
          <button type="button" className={`cq-it-mode-btn${mode === 'designed' ? ' cq-it-mode-active' : ''}`} onClick={() => onChange({ itMode: 'designed' })}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
            Designed
          </button>
        </div>
      </div>

      {/* ── Designed placeholder ── */}
      {mode === 'designed' && (
        <div className="cq-it-designed-card">
          <div className="cq-it-designed-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F47D5B" strokeWidth="1.5"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
          </div>
          <h3 className="cq-it-designed-title">Using Design Itinerary Builder</h3>
          <p className="cq-it-designed-desc">This quote uses the design itinerary builder with custom templates, images, and rich formatting.</p>
          <button type="button" className="cq-it-open-designer" onClick={openDemo}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Open Design Editor
          </button>
        </div>
      )}

      {/* ── Simple / Agent view ── */}
      {mode === 'simple' && view === 'agent' && (
        <>
          <div className="cq-it-top-bar">
            <div className="cq-it-top-bar-left">
              <strong>{IT_CO.name}</strong>
              <span>Draft — Agent View</span>
            </div>
            <div className="cq-it-top-bar-right">
              <button type="button" className="cq-it-preview-btn" onClick={() => onChange({ itView: 'preview' })}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview
              </button>
              <button type="button" className="cq-it-pdf-btn" onClick={openDemo}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                PDF
              </button>
            </div>
          </div>
          <div className="cq-it-progress-bar-wrap">
            <span className="cq-it-prog-label">Quote completion</span>
            <div className="cq-it-prog-track"><div className="cq-it-prog-fill" style={{ width: pct + '%' }} /></div>
            <span className="cq-it-prog-pct">{pct}%</span>
          </div>
          <div className="cq-it-tabs-row">
            <button type="button" className={`cq-it-tab${tab === 'itinerary' ? ' cq-it-tab-active' : ''}`} onClick={() => onChange({ itTab: 'itinerary' })}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.4-8 13-8 13S4 15.4 4 10a8 8 0 0 1 8-8z"/></svg>
              Itinerary
            </button>
            <button type="button" className={`cq-it-tab${tab === 'analysis' ? ' cq-it-tab-active' : ''}`} onClick={() => onChange({ itTab: 'analysis' })}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Analysis
            </button>
          </div>
          {tab === 'itinerary' && renderDoc(true)}
          {tab === 'analysis'  && <div className="cq-it-analysis-ph">Analysis view coming soon.</div>}
        </>
      )}

      {/* ── Simple / Preview view ── */}
      {mode === 'simple' && view === 'preview' && (
        <>
          <div className="cq-it-top-bar">
            <div className="cq-it-top-bar-left">
              <strong>{IT_CO.name}</strong>
              <span>Preview — Client View</span>
            </div>
            <div className="cq-it-top-bar-right">
              <button type="button" className="cq-it-edit-btn" onClick={openDemo}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button type="button" className="cq-it-pdf-btn" onClick={openDemo}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                PDF
              </button>
            </div>
          </div>
          <div className="cq-it-preview-banner">
            <div className="cq-it-preview-banner-left">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <div>
                <strong className="cq-it-preview-mode-title">Preview Mode</strong>
                <span className="cq-it-preview-mode-sub">This is what the customer will see</span>
              </div>
            </div>
            <button type="button" className="cq-it-back-edit-btn" onClick={() => onChange({ itView: 'agent' })}>
              ‹ Back to Edit
            </button>
          </div>
          {renderDoc(false)}
        </>
      )}
    </div>
  );
};

// ─── Pre-filled Customer Banner ───────────────────────────────────────────────
const PrefilledCustomerBanner = ({ customer }) => (
  <div className="cq-prefill-banner">
    <div className="cq-prefill-avatar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      </svg>
    </div>
    <div className="cq-prefill-info">
      <span className="cq-prefill-name">{customer.name}</span>
      <div className="cq-prefill-meta">
        <span>{customer.id}</span>
        <span className="cq-prefill-sep">·</span>
        <span>{customer.phone}</span>
        {customer.email && <><span className="cq-prefill-sep">·</span><span>{customer.email}</span></>}
      </div>
    </div>
    <div className="cq-prefill-lock-badge">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      Customer locked
    </div>
  </div>
);

// ─── Main CreateQuote Component ───────────────────────────────────────────────
export const CreateQuote = ({ onViewChange, prefilledCustomer, editQuote }) => {
  const editMode    = Boolean(editQuote);
  const isPrefilled = Boolean(prefilledCustomer) && !editMode;
  const firstStep   = isPrefilled ? 2 : 1;

  const triggerDemoPopup = useDemoPopup();
  const [currentStep, setCurrentStep] = useState(firstStep);
  const [calcMode, setCalcMode] = useState('agent');
  const [formData, setFormData] = useState(() => {
    const base = { services: {}, serviceCosts: {}, destType: 'domestic', gstMode: 'pure-agent', tcsMode: 'na', adults: '1', children: '0', infants: '0' };
    if (editMode) {
      return { ...base, ...editQuote };
    }
    if (isPrefilled) {
      return {
        ...base,
        newCustomerName:  prefilledCustomer.name  || '',
        newCustomerPhone: (prefilledCustomer.phone || '').replace(/^\+\d+\s*/, ''),
        newCustomerEmail: prefilledCustomer.email || '',
      };
    }
    return { ...base, customerSearch: '' };
  });
  const fileInputRef = useRef(null);

  const updateFormData = (patch) => setFormData(prev => ({ ...prev, ...patch }));

  const handleBack = () => {
    if (currentStep > firstStep) {
      setCurrentStep(s => s - 1);
    } else if (editMode) {
      onViewChange && onViewChange('quote-detail');
    } else if (isPrefilled) {
      onViewChange && onViewChange('customer-profile');
    } else {
      onViewChange && onViewChange('quotes');
    }
  };

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(s => s + 1);
    else triggerDemoPopup();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Customer data={formData} onChange={updateFormData} />;
      case 2: return <Step2Trip data={formData} onChange={updateFormData} />;
      case 3: return <Step3Services data={formData} onChange={updateFormData} />;
      case 4: return <Step4Pricing data={formData} onChange={updateFormData} />;
      case 5: return <Step5Review data={formData} onChange={updateFormData} editMode={editMode} isPrefilled={isPrefilled} prefilledCustomer={prefilledCustomer} />;
      case 6: return <Step6Itinerary data={formData} onChange={updateFormData} editMode={editMode} />;
      default: return null;
    }
  };

  const backLabel = editMode
    ? '← Back to Quote'
    : isPrefilled
      ? `← ${prefilledCustomer.name} / New Quote`
      : 'Back to Quotes';

  const backTarget = editMode
    ? () => onViewChange && onViewChange('quote-detail')
    : isPrefilled
      ? () => onViewChange && onViewChange('customer-profile')
      : () => onViewChange && onViewChange('quotes');

  return (
    <div id="view-create-quote" className="fade-in">

      {/* ── Custom Header ── */}
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <button className="cq-back-btn" onClick={backTarget}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              {backLabel}
            </button>
            <h1 className="page-title" style={{ marginTop: 6 }}>{editMode ? 'Edit Quote' : 'Create Quote'}</h1>
            <p className="page-subtitle">{editMode ? 'Edit all quote details across steps' : 'Build a new travel quotation'}</p>
          </div>
          <div className="dash-header-right">
            <div className="header-user" style={{ cursor: 'pointer' }} onClick={() => openBilling()}>
              <div className="header-user-avatar">DA</div>
              <div className="header-user-info">
                <span className="header-user-name">Demo Admin</span>
                <span className="header-user-role"><span className="role-dot"></span> Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Upload Vendor Quote ── */}
      <div className="cq-upload-zone" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
        <p className="cq-upload-label">Upload Vendor Quote</p>
        <p className="cq-upload-hint">PDF, Image, or Excel — drag &amp; drop or click to browse</p>
        <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls" style={{ display: 'none' }} onChange={triggerDemoPopup} />
      </div>

      {/* ── Step Progress Bar ── */}
      <div className="cq-stepper">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className={`cq-step ${currentStep === step.id ? 'active' : ''} ${(currentStep > step.id || (isPrefilled && step.id === 1)) ? 'completed' : ''}`}>
              <div className="cq-step-circle">
                {currentStep > step.id ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : step.id}
              </div>
              <span className="cq-step-label">{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`cq-step-line ${(currentStep > step.id || (isPrefilled && step.id === 1)) ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Two-panel layout ── */}
      <div className="cq-main-layout">

        {/* Form area */}
        <div className="cq-form-area">
          {isPrefilled && <PrefilledCustomerBanner customer={prefilledCustomer} />}
          <div className="cq-form-card">
            {renderStep()}
          </div>

          {/* Previous / Next navigation */}
          <div className="cq-nav-buttons">
            <button className="cq-prev-btn" onClick={handleBack}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            <button className="cq-next-btn" onClick={handleNext}>
              {currentStep === 6 ? (
                <>
                  {editMode ? 'Update Quote' : 'Save Quote'}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                  </svg>
                </>
              ) : (
                <>
                  Next
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Calculation sidebar */}
        <div className="cq-sidebar">
          <LiveCalculation mode={calcMode} onModeChange={setCalcMode} pricing={formData} />
        </div>
      </div>

    </div>
  );
};

export default CreateQuote;
