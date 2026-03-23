import React, { useState, useRef, useEffect, useMemo } from 'react';
import { DemoLogButton } from '../demo/components/DemoLogButton';
import { openBilling } from '../utils/billingNav';
import { openDesigner } from '../utils/designerNav';
import { useDemoPopup, useDemoData } from '../context/DemoContext';
import { InfoBtn } from '../shared/components/InfoBtn';
import { calculate, extractGstinState } from '../shared/utils/calculationEngine';

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
const CALC_SUBTITLES = {
  'pure-agent':     'Pure Agent – GST @18% on margin only',
  'principal-18':   'Principal – GST @18% on full value',
  'principal-5':    'Principal Package – GST @5% on total (No ITC)',
  'principal-pass': 'Principal Pass-through – GST @18% + ITC',
};

const fmtCalc = (n) => '₹' + (n === 0 ? '0' : Math.round(n).toLocaleString('en-IN'));

const LiveCalculation = ({ mode, onModeChange, calc }) => {
  const c = calc;
  const gstPct = Math.round(c.gstRate * 100);
  const halfPct = Math.round(c.gstRate * 50);

  const GstSubRows = () => {
    if (c.noGst) return <div className="cq-calc-row cq-calc-subrow"><span>No GST applicable</span><span>₹0</span></div>;
    if (c.gstType === 'cgst-sgst') return (
      <>
        <div className="cq-calc-row cq-calc-subrow"><span>CGST @{halfPct}%</span><span>{fmtCalc(c.cgst)}</span></div>
        <div className="cq-calc-row cq-calc-subrow"><span>SGST @{halfPct}%</span><span>{fmtCalc(c.sgst)}</span></div>
      </>
    );
    return <div className="cq-calc-row cq-calc-subrow"><span>IGST @{gstPct}%</span><span>{fmtCalc(c.igst)}</span></div>;
  };

  const WarningBox = () => (
    c.isNoMargin ? (
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
        <p className="cq-calc-subtitle">{CALC_SUBTITLES[c.billingModel] || CALC_SUBTITLES['pure-agent']}</p>
      </div>

      {mode === 'agent' && (
        <>
          <div className="cq-calc-rows">
            <div className="cq-calc-row"><span>Cost of Services</span><span>{fmtCalc(c.costOfServices)}</span></div>
            <div className="cq-calc-row"><span>Hidden Markup</span><span>{fmtCalc(c.margin)}</span></div>
            {c.isPureAgent ? (
              <>
                <div className="cq-calc-row"><span>Cost of Travel (shown to customer)</span><span>{fmtCalc(c.costOfTravel)}</span></div>
                <div className="cq-calc-row"><span>Processing Charge (excl GST)</span><span>{fmtCalc(c.processingCharge)}</span></div>
                <div className="cq-calc-row"><span>GST @{gstPct}% (on processing charge)</span><span>{fmtCalc(c.gstAmount)}</span></div>
              </>
            ) : (
              <>
                <div className="cq-calc-row"><span>Package Price</span><span>{fmtCalc(c.packagePrice)}</span></div>
                <div className="cq-calc-row"><span>GST @{gstPct}% (on full value)</span><span>{fmtCalc(c.gstAmount)}</span></div>
              </>
            )}
            <GstSubRows />
            <div className="cq-calc-row cq-calc-bold"><span>Invoice Value</span><span>{fmtCalc(c.invoiceValue)}</span></div>
            <div className="cq-calc-row"><span>TCS @5% {c.tcsApplicable ? '' : '(N/A)'}</span><span>{fmtCalc(c.tcs)}</span></div>
            <div className="cq-calc-row cq-calc-bold"><span>Total Payable</span><span>{fmtCalc(c.totalPayable)}</span></div>
          </div>
          <WarningBox />
          <div className="cq-calc-profit">
            <div className="cq-profit-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              Your Profit
            </div>
            <div className="cq-calc-row" style={{ marginTop: 6 }}><span>Margin</span><span>{fmtCalc(c.margin)}</span></div>
            <div className="cq-calc-row"><span>Commission</span><span>{fmtCalc(c.commission)}</span></div>
            <div className="cq-calc-row cq-calc-bold">
              <span>Total Profit</span>
              <span className="cq-profit-value">{fmtCalc(c.totalProfit)}</span>
            </div>
          </div>
        </>
      )}

      {mode === 'customer' && (
        <>
          <div className="cq-calc-rows">
            {c.isPureAgent ? (
              <>
                <div className="cq-calc-row"><span>Cost of Travel</span><span>{fmtCalc(c.costOfTravel)}</span></div>
                <div className="cq-calc-row"><span>Processing Charge</span><span>{fmtCalc(c.processingCharge)}</span></div>
                <div className="cq-calc-row"><span>GST on Processing</span><span>{fmtCalc(c.gstAmount)}</span></div>
              </>
            ) : (
              <>
                <div className="cq-calc-row"><span>Package Price</span><span>{fmtCalc(c.packagePrice)}</span></div>
                <div className="cq-calc-row"><span>GST @{gstPct}%</span><span>{fmtCalc(c.gstAmount)}</span></div>
              </>
            )}
            <GstSubRows />
            <div className="cq-calc-row cq-calc-bold"><span>Invoice Value</span><span>{fmtCalc(c.invoiceValue)}</span></div>
            <div className="cq-calc-row"><span>TCS @5% {c.tcsApplicable ? '' : '(N/A)'}</span><span>{fmtCalc(c.tcs)}</span></div>
            <div className="cq-calc-row cq-calc-bold"><span>Total Payable</span><span>{fmtCalc(c.totalPayable)}</span></div>
          </div>
          {c.noGst && !c.isNoMargin && (
            <div className="cq-calc-warning" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>No GST applicable for international supply.</span>
            </div>
          )}
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
          <InfoBtn infoKey="cq_dest_type" />
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
          <InfoBtn infoKey="cq_tcs_banner" />
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
            <InfoBtn infoKey="cq_state_of_travel" />
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

// ─── Step 3 helpers ──────────────────────────────────────────────────────────
const CQ_CURRENCIES = [
  { code:'INR', label:'₹ INR' }, { code:'USD', label:'$ USD' },
  { code:'EUR', label:'€ EUR' }, { code:'GBP', label:'£ GBP' },
  { code:'AED', label:'إ.د AED'}, { code:'SAR', label:'ریال SAR'},
  { code:'SGD', label:'S$ SGD' }, { code:'THB', label:'฿ THB' },
  { code:'AUD', label:'A$ AUD' }, { code:'CAD', label:'C$ CAD' },
  { code:'JPY', label:'¥ JPY'  }, { code:'CHF', label:'CHF'   },
];
const SVC_HAS_TOGGLE = k => !['landPackage','fooding'].includes(k);
const SVC_HAS_INFO   = k => !['landPackage','fooding','flightExtras'].includes(k);
const SVC_IS_ITEMS   = k => ['flight','flightExtras','train','bus','hotel','activities','cabTransport','admission','other'].includes(k);
const uid = () => Date.now() + Math.random();
const mkLeg   = () => ({ id:uid(), from:'',to:'',airline:'',flightNo:'',depDate:'',depHH:'',depMM:'',arrDate:'',arrHH:'',arrMM:'',cost:'',showBd:false,baseFare:'',taxes:'',otherCharges:'',vendor:'' });
const mkExtra = () => ({ id:uid(), type:'Seat',link:'None (standalone)',description:'',cost:'',vendor:'' });
const mkTrain = () => ({ id:uid(), fromStation:'',toStation:'',trainNo:'',trainName:'',class:'',date:'',depHH:'',depMM:'',arrHH:'',arrMM:'',pnr:'',cost:'',vendor:'' });
const mkBus   = () => ({ id:uid(), fromCity:'',toCity:'',operator:'',busType:'',seatType:'',date:'',boardingPoint:'',droppingPoint:'',depHH:'',depMM:'',arrHH:'',arrMM:'',ticketNo:'',cost:'',vendor:'' });
const mkHotel = () => ({ id:uid(), city:'',hotelName:'',starRating:'4 Star',roomType:'Double',checkInDate:'',checkInHH:'',checkInMM:'',checkOutDate:'',checkOutHH:'',checkOutMM:'',mealPlan:'CP – Breakfast',cost:'',showBd:false,baseFare:'',taxes:'',otherCharges:'',vendor:'' });
const mkActiv = () => ({ id:uid(), activityName:'',location:'',date:'',duration:'Half Day',inclusions:'',cost:'',vendor:'' });
const mkXfer  = () => ({ id:uid(), vehicle:'Sedan',dateFrom:'',dateTo:'',pickup:'',drop:'',cost:'',vendor:'' });
const mkAdm   = () => ({ id:uid(), name:'',location:'',date:'',tickets:'',notes:'',cost:'',vendor:'' });
const mkOther = () => ({ id:uid(), type:'Forex',description:'',cost:'',vendor:'' });
const mkDet   = () => ({ mode:'simple', currency:'INR', cost:'', margin:'', vendor:'', items:[], showVendorAdj:false, vendorAdj:{ commission:'',tds:'',vendorFee:'',feeGst:'' }, visaType:'Tourist', visaCountry:'', visaCost:'', visaVendor:'' });
const sumItems = items => items.reduce((s,it)=>s+(parseFloat(it.cost)||0),0);
const fmtRs    = n => '₹' + (parseFloat(n)||0).toLocaleString('en-IN');

// Mini sub-components for Step 3
const CQTrashBtn = ({ onClick }) => (
  <button type="button" className="cq-item-del" onClick={onClick} title="Remove">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  </button>
);
const CQArrow = () => (
  <span className="cq-route-arrow">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  </span>
);
const CQDate = ({ value, onChange, placeholder }) => (
  <input type="date" className="cq-date-input" value={value||''} onChange={e=>onChange(e.target.value)} title={placeholder||'Select date'} />
);
const CQTime = ({ hh, mm, onHH, onMM }) => (
  <span className="cq-time-wrap">
    <input type="text" className="cq-time-in" placeholder="HH" maxLength={2} value={hh||''} onChange={e=>onHH(e.target.value)} />
    <span className="cq-colon">:</span>
    <input type="text" className="cq-time-in" placeholder="MM" maxLength={2} value={mm||''} onChange={e=>onMM(e.target.value)} />
  </span>
);
const CQTimeHelper = () => <p className="cq-time-help">Time is in 24-hour format (HH:mm)</p>;
const CQCurSelect = ({ value, onChange }) => (
  <select className="cq-cur-sel" value={value||'INR'} onChange={e=>onChange(e.target.value)}>
    {CQ_CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}
  </select>
);
const CQYellowBanner = ({ currency }) => (
  <div className="cq-yellow-banner">
    {currency==='INR' ? 'All item costs in INR' : `Base currency: INR`}
  </div>
);
const CQServiceFooter = ({ total, margin, onMargin }) => (
  <div className="cq-svc-footer">
    <div className="cq-svc-total-row">
      <span className="cq-svc-total-lbl">Total (auto-summed)</span>
      <span className="cq-svc-total-val">{fmtRs(total)}</span>
    </div>
    <div className="cq-svc-margin-row">
      <span className="cq-svc-margin-lbl">Margin <InfoBtn infoKey="cq_svc_margin" variant="light" /></span>
      <span className="cq-svc-rs">₹</span>
      <input type="number" className="cq-svc-margin-in" placeholder="0" value={margin||''} onChange={e=>onMargin(e.target.value)} />
    </div>
  </div>
);
const CQVendorAdj = ({ show, adj, onToggle, onAdj }) => (
  <div className="cq-vendor-adj-wrap">
    <button type="button" className="cq-adj-btn" onClick={onToggle}>
      Vendor Invoice Adjustments <span>{show ? '▲ Hide' : '▼ Show'}</span>
    </button>
    {show && (
      <div className="cq-adj-body">
        {[['commission','Commission','I earn (Less)'],['tds','TDS','Receivable'],['vendorFee','Vendor Fee','Processing (Add)'],['feeGst','Fee GST','CGST+SGST (Add)']].map(([k,lbl,help])=>(
          <div key={k} className="cq-adj-row">
            <label className="cq-adj-lbl">{lbl}</label>
            <input type="number" className="cq-adj-in" placeholder="0" value={adj[k]||''} onChange={e=>onAdj({ ...adj, [k]:e.target.value })} />
            <span className="cq-adj-help">{help}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);
const CQSimpleForm = ({ det, onU }) => (
  <div className="cq-simple-form">
    <div className="cq-simple-row">
      <CQCurSelect value={det.currency} onChange={v=>onU({ currency:v })} />
      <input type="number" className="cq-svc-in" placeholder="Cost" value={det.cost||''} onChange={e=>onU({ cost:e.target.value })} />
      <span className="cq-svc-rs">₹</span>
      <input type="number" className="cq-svc-in" placeholder="Margin" value={det.margin||''} onChange={e=>onU({ margin:e.target.value })} />
      <input type="text" className="cq-svc-vendor" placeholder="Vendor name" value={det.vendor||''} onChange={e=>onU({ vendor:e.target.value })} />
    </div>
    <p className="cq-svc-note">Entered in {det.currency||'INR'}</p>
  </div>
);
const CQCostBreakdown = ({ item, onItem }) => (
  <>
    <div className="cq-bd-row">
      <label className="cq-field-lbl">Cost</label>
      <button type="button" className="cq-bd-btn" onClick={()=>onItem({ showBd: !item.showBd })}>
        {item.showBd ? 'Hide' : 'Breakdown'}
      </button>
    </div>
    <input type="number" className="cq-text-in" placeholder="0" value={item.cost||''} onChange={e=>onItem({ cost:e.target.value })} />
    {item.showBd && (
      <div className="cq-bd-fields">
        {[['baseFare','Base Fare'],['taxes','Taxes'],['otherCharges','Other Charges']].map(([fk,fl])=>(
          <div key={fk} className="cq-bd-item">
            <label className="cq-field-lbl-sm">{fl}</label>
            <input type="number" className="cq-text-in" placeholder="0" value={item[fk]||''} onChange={e=>onItem({ [fk]:e.target.value })} />
          </div>
        ))}
      </div>
    )}
  </>
);

// ─── Step 3: Services ─────────────────────────────────────────────────────────
const Step3Services = ({ data, onChange }) => {
  const selected   = data.services       || {};
  const details    = data.serviceDetails || {};
  const todayFx    = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const selectedKeys = SERVICE_LIST.filter(s => selected[s.key]).map(s => s.key);
  const pkgDetected  = selectedKeys.length >= 2;

  const toggleService = (key) => {
    const next = { ...selected, [key]: !selected[key] };
    if (!next[key]) {
      const nd = { ...details }; delete nd[key];
      const nc = { ...(data.serviceCosts || {}) }; delete nc[key];
      onChange({ services: next, serviceDetails: nd, serviceCosts: nc });
    } else {
      const nd = details[key] ? details : { ...details, [key]: mkDet() };
      onChange({ services: next, serviceDetails: nd });
    }
  };

  const updDet = (key, patch) => {
    const cur = details[key] || mkDet();
    const upd = { ...cur, ...patch };
    const nd  = { ...details, [key]: upd };
    let totalCost = 0;
    if (!SVC_IS_ITEMS(key) || upd.mode === 'simple') {
      totalCost = parseFloat(upd.cost) || 0;
    } else if (key === 'visa') {
      totalCost = parseFloat(upd.visaCost) || 0;
    } else {
      totalCost = sumItems(upd.items || []);
    }
    const nc = { ...(data.serviceCosts || {}), [key]: String(totalCost||'') };
    onChange({ serviceDetails: nd, serviceCosts: nc });
  };

  const updItem = (key, idx, patch) => {
    const det = details[key] || mkDet();
    const items = [...(det.items || [])];
    items[idx] = { ...items[idx], ...patch };
    updDet(key, { items });
  };

  const addItem = (key, factory) => {
    const det = details[key] || mkDet();
    updDet(key, { items: [...(det.items || []), factory()] });
  };

  const delItem = (key, idx) => {
    const det = details[key] || mkDet();
    const items = (det.items || []).filter((_,i) => i !== idx);
    updDet(key, { items });
  };

  const getFlightLegs = () => {
    const fDet = details['flight'];
    if (!fDet || !fDet.items) return [];
    return fDet.items.map((leg, i) => {
      const label = `Leg ${i+1}${leg.from||leg.to ? ` (${leg.from||'?'} → ${leg.to||'?'})` : ''}`;
      return label;
    });
  };

  const renderServiceBody = (key, det) => {
    const isSimple = det.mode === 'simple';

    if (key === 'landPackage' || key === 'fooding') {
      return <CQSimpleForm det={det} onU={p=>updDet(key,p)} />;
    }

    if (isSimple) {
      return <CQSimpleForm det={det} onU={p=>updDet(key,p)} />;
    }

    // FLIGHT
    if (key === 'flight') {
      const legs = det.items || [];
      const total = sumItems(legs);
      return (
        <div className="cq-detailed-body">
          <CQYellowBanner currency={det.currency} />
          {legs.map((leg, idx) => (
            <div key={leg.id||idx} className="cq-item-card">
              <div className="cq-item-hdr">
                <span className="cq-item-lbl">Leg {idx+1}</span>
                <CQTrashBtn onClick={()=>delItem(key,idx)} />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Route</label>
                <div className="cq-route-row">
                  <input type="text" className="cq-text-in" placeholder="From" value={leg.from||''} onChange={e=>updItem(key,idx,{from:e.target.value})} />
                  <CQArrow />
                  <input type="text" className="cq-text-in" placeholder="To" value={leg.to||''} onChange={e=>updItem(key,idx,{to:e.target.value})} />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Airline</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. Air India" value={leg.airline||''} onChange={e=>updItem(key,idx,{airline:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Flight No.</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. AI 101" value={leg.flightNo||''} onChange={e=>updItem(key,idx,{flightNo:e.target.value})} />
                </div>
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Departure</label>
                <div className="cq-dep-row">
                  <CQDate value={leg.depDate} onChange={v=>updItem(key,idx,{depDate:v})} placeholder="Date" />
                  <CQTime hh={leg.depHH} mm={leg.depMM} onHH={v=>updItem(key,idx,{depHH:v})} onMM={v=>updItem(key,idx,{depMM:v})} />
                </div>
                <CQTimeHelper />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Arrival</label>
                <div className="cq-dep-row">
                  <CQDate value={leg.arrDate} onChange={v=>updItem(key,idx,{arrDate:v})} placeholder="Date" />
                  <CQTime hh={leg.arrHH} mm={leg.arrMM} onHH={v=>updItem(key,idx,{arrHH:v})} onMM={v=>updItem(key,idx,{arrMM:v})} />
                </div>
                <CQTimeHelper />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Passengers</label>
                <div className="cq-pass-hint">Add traveler names in Trip Details to select passengers here</div>
              </div>
              <div className="cq-field-g">
                <CQCostBreakdown item={leg} onItem={p=>updItem(key,idx,p)} />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Vendor</label>
                <input type="text" className="cq-text-in" placeholder="Vendor name" value={leg.vendor||''} onChange={e=>updItem(key,idx,{vendor:e.target.value})} />
              </div>
            </div>
          ))}
          <div className="cq-add-btns">
            <button type="button" className="cq-add-btn-orange" onClick={()=>addItem(key,mkLeg)}>+ Add Flight Leg</button>
            <button type="button" className="cq-add-btn-purple">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              Import PNR
            </button>
          </div>
          <CQVendorAdj show={det.showVendorAdj} adj={det.vendorAdj||{}} onToggle={()=>updDet(key,{showVendorAdj:!det.showVendorAdj})} onAdj={v=>updDet(key,{vendorAdj:v})} />
          <CQServiceFooter total={total} margin={det.margin} onMargin={v=>updDet(key,{margin:v})} />
        </div>
      );
    }

    // FLIGHT EXTRAS
    if (key === 'flightExtras') {
      const extras = det.items || [];
      const total  = sumItems(extras);
      const flightOpts = ['None (standalone)', ...getFlightLegs()];
      const typeOpts   = ['Seat','Meals','Baggage','Priority Boarding','Lounge','Other'];
      return (
        <div className="cq-detailed-body">
          {extras.map((ex, idx) => (
            <div key={ex.id||idx} className="cq-item-card">
              <div className="cq-item-hdr">
                <span className="cq-item-lbl">Extra {idx+1}</span>
                <CQTrashBtn onClick={()=>delItem(key,idx)} />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Type</label>
                  <select className="cq-sel" value={ex.type||'Seat'} onChange={e=>updItem(key,idx,{type:e.target.value})}>
                    {typeOpts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Link to Flight</label>
                  <select className="cq-sel" value={ex.link||'None (standalone)'} onChange={e=>updItem(key,idx,{link:e.target.value})}>
                    {flightOpts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Description</label>
                <input type="text" className="cq-text-in" placeholder="e.g. Extra 15kg checked baggage, Window seat 12A..." value={ex.description||''} onChange={e=>updItem(key,idx,{description:e.target.value})} />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Cost</label>
                  <input type="number" className="cq-text-in" placeholder="0" value={ex.cost||''} onChange={e=>updItem(key,idx,{cost:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Vendor</label>
                  <input type="text" className="cq-text-in" placeholder="Vendor name" value={ex.vendor||''} onChange={e=>updItem(key,idx,{vendor:e.target.value})} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="cq-add-btn-orange" onClick={()=>addItem(key,mkExtra)}>+ Add Flight Extra</button>
          <CQServiceFooter total={total} margin={det.margin} onMargin={v=>updDet(key,{margin:v})} />
        </div>
      );
    }

    // TRAIN
    if (key === 'train') {
      const journeys = det.items || [];
      const total    = sumItems(journeys);
      const classOpts = ['1A – First AC','2A – Second AC','3A – Third AC','3E – Third AC Economy','SL – Sleeper','CC – AC Chair Car','EC – Exec. Chair Car','2S – Second Sitting'];
      return (
        <div className="cq-detailed-body">
          <CQYellowBanner currency={det.currency} />
          {journeys.map((j, idx) => (
            <div key={j.id||idx} className="cq-item-card">
              <div className="cq-item-hdr">
                <span className="cq-item-lbl">Journey {idx+1}</span>
                <CQTrashBtn onClick={()=>delItem(key,idx)} />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Route</label>
                <div className="cq-route-row">
                  <input type="text" className="cq-text-in" placeholder="From station" value={j.fromStation||''} onChange={e=>updItem(key,idx,{fromStation:e.target.value})} />
                  <CQArrow />
                  <input type="text" className="cq-text-in" placeholder="To station" value={j.toStation||''} onChange={e=>updItem(key,idx,{toStation:e.target.value})} />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Train No.</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. 12301" value={j.trainNo||''} onChange={e=>updItem(key,idx,{trainNo:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Train Name</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. Rajdhani Express" value={j.trainName||''} onChange={e=>updItem(key,idx,{trainName:e.target.value})} />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Class</label>
                  <select className="cq-sel" value={j.class||''} onChange={e=>updItem(key,idx,{class:e.target.value})}>
                    <option value="">Select class</option>
                    {classOpts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Date</label>
                  <CQDate value={j.date} onChange={v=>updItem(key,idx,{date:v})} placeholder="Select date" />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Dep. Time</label>
                  <CQTime hh={j.depHH} mm={j.depMM} onHH={v=>updItem(key,idx,{depHH:v})} onMM={v=>updItem(key,idx,{depMM:v})} />
                  <CQTimeHelper />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Arr. Time</label>
                  <CQTime hh={j.arrHH} mm={j.arrMM} onHH={v=>updItem(key,idx,{arrHH:v})} onMM={v=>updItem(key,idx,{arrMM:v})} />
                  <CQTimeHelper />
                </div>
              </div>
              <div className="cq-grid-3">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">PNR</label>
                  <input type="text" className="cq-text-in" placeholder="10 digits" value={j.pnr||''} onChange={e=>updItem(key,idx,{pnr:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Cost</label>
                  <input type="number" className="cq-text-in" placeholder="0" value={j.cost||''} onChange={e=>updItem(key,idx,{cost:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Vendor</label>
                  <input type="text" className="cq-text-in" placeholder="IRCTC / Agent" value={j.vendor||''} onChange={e=>updItem(key,idx,{vendor:e.target.value})} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="cq-add-btn-orange" onClick={()=>addItem(key,mkTrain)}>+ Add Train Journey</button>
          <CQServiceFooter total={total} margin={det.margin} onMargin={v=>updDet(key,{margin:v})} />
        </div>
      );
    }

    // BUS
    if (key === 'bus') {
      const journeys = det.items || [];
      const total    = sumItems(journeys);
      const busTypes  = ['Volvo AC Sleeper','Volvo AC Semi-Sleeper','AC Sleeper','AC Seater','Non-AC Sleeper','Bharat Benz AC','Scania AC Multi-Axle','Electric AC','Mini Bus','Deluxe / Super Deluxe'];
      const seatTypes = ['Sleeper','Semi-Sleeper','Seater','Seater (Push Back)'];
      return (
        <div className="cq-detailed-body">
          <CQYellowBanner currency={det.currency} />
          {journeys.map((j, idx) => (
            <div key={j.id||idx} className="cq-item-card">
              <div className="cq-item-hdr">
                <span className="cq-item-lbl">Journey {idx+1}</span>
                <CQTrashBtn onClick={()=>delItem(key,idx)} />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Route</label>
                <div className="cq-route-row">
                  <input type="text" className="cq-text-in" placeholder="From city" value={j.fromCity||''} onChange={e=>updItem(key,idx,{fromCity:e.target.value})} />
                  <CQArrow />
                  <input type="text" className="cq-text-in" placeholder="To city" value={j.toCity||''} onChange={e=>updItem(key,idx,{toCity:e.target.value})} />
                </div>
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Operator / Travels</label>
                <input type="text" className="cq-text-in" placeholder="e.g. VRL Travels" value={j.operator||''} onChange={e=>updItem(key,idx,{operator:e.target.value})} />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Bus Type</label>
                  <select className="cq-sel" value={j.busType||''} onChange={e=>updItem(key,idx,{busType:e.target.value})}>
                    <option value="">Select bus type</option>
                    {busTypes.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Seat Type</label>
                  <select className="cq-sel" value={j.seatType||''} onChange={e=>updItem(key,idx,{seatType:e.target.value})}>
                    <option value="">Select seat type</option>
                    {seatTypes.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Date</label>
                <CQDate value={j.date} onChange={v=>updItem(key,idx,{date:v})} placeholder="Select date" />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Boarding Point</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. Majestic Bus Stand" value={j.boardingPoint||''} onChange={e=>updItem(key,idx,{boardingPoint:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Dropping Point</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. Swargate" value={j.droppingPoint||''} onChange={e=>updItem(key,idx,{droppingPoint:e.target.value})} />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Dep. Time</label>
                  <CQTime hh={j.depHH} mm={j.depMM} onHH={v=>updItem(key,idx,{depHH:v})} onMM={v=>updItem(key,idx,{depMM:v})} />
                  <CQTimeHelper />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Arr. Time</label>
                  <CQTime hh={j.arrHH} mm={j.arrMM} onHH={v=>updItem(key,idx,{arrHH:v})} onMM={v=>updItem(key,idx,{arrMM:v})} />
                  <CQTimeHelper />
                </div>
              </div>
              <div className="cq-grid-3">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Ticket No.</label>
                  <input type="text" className="cq-text-in" placeholder="Ticket / PNR" value={j.ticketNo||''} onChange={e=>updItem(key,idx,{ticketNo:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Cost</label>
                  <input type="number" className="cq-text-in" placeholder="0" value={j.cost||''} onChange={e=>updItem(key,idx,{cost:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Vendor</label>
                  <input type="text" className="cq-text-in" placeholder="RedBus / AbhiBus / Agent" value={j.vendor||''} onChange={e=>updItem(key,idx,{vendor:e.target.value})} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="cq-add-btn-orange" onClick={()=>addItem(key,mkBus)}>+ Add Bus Journey</button>
          <CQServiceFooter total={total} margin={det.margin} onMargin={v=>updDet(key,{margin:v})} />
        </div>
      );
    }

    // HOTEL
    if (key === 'hotel') {
      const hotels = det.items || [];
      const total  = sumItems(hotels);
      const starOpts = ['3 Star','4 Star','5 Star','5 Star Deluxe'];
      const roomOpts = ['Single','Double','Twin','Triple','Suite'];
      const mealOpts = ['EP – No Meals','CP – Breakfast','MAP – Breakfast + Dinner','AP – All Meals'];
      return (
        <div className="cq-detailed-body">
          <CQYellowBanner currency={det.currency} />
          {hotels.map((h, idx) => (
            <div key={h.id||idx} className="cq-item-card">
              <div className="cq-item-hdr">
                <span className="cq-item-lbl">Hotel {idx+1}</span>
                <CQTrashBtn onClick={()=>delItem(key,idx)} />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">City</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. Mumbai" value={h.city||''} onChange={e=>updItem(key,idx,{city:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Hotel Name</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. Taj Palace" value={h.hotelName||''} onChange={e=>updItem(key,idx,{hotelName:e.target.value})} />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Star Rating</label>
                  <select className="cq-sel" value={h.starRating||'4 Star'} onChange={e=>updItem(key,idx,{starRating:e.target.value})}>
                    {starOpts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Room Type</label>
                  <select className="cq-sel" value={h.roomType||'Double'} onChange={e=>updItem(key,idx,{roomType:e.target.value})}>
                    {roomOpts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Check-in</label>
                <div className="cq-dep-row">
                  <CQDate value={h.checkInDate} onChange={v=>updItem(key,idx,{checkInDate:v})} placeholder="Check-in date" />
                  <CQTime hh={h.checkInHH} mm={h.checkInMM} onHH={v=>updItem(key,idx,{checkInHH:v})} onMM={v=>updItem(key,idx,{checkInMM:v})} />
                </div>
                <CQTimeHelper />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Check-out</label>
                <div className="cq-dep-row">
                  <CQDate value={h.checkOutDate} onChange={v=>updItem(key,idx,{checkOutDate:v})} placeholder="Check-out date" />
                  <CQTime hh={h.checkOutHH} mm={h.checkOutMM} onHH={v=>updItem(key,idx,{checkOutHH:v})} onMM={v=>updItem(key,idx,{checkOutMM:v})} />
                </div>
                <CQTimeHelper />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Meal Plan</label>
                <select className="cq-sel" value={h.mealPlan||'CP – Breakfast'} onChange={e=>updItem(key,idx,{mealPlan:e.target.value})}>
                  {mealOpts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="cq-field-g">
                <CQCostBreakdown item={h} onItem={p=>updItem(key,idx,p)} />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Vendor</label>
                <input type="text" className="cq-text-in" placeholder="Vendor name" value={h.vendor||''} onChange={e=>updItem(key,idx,{vendor:e.target.value})} />
              </div>
            </div>
          ))}
          <button type="button" className="cq-add-btn-orange" onClick={()=>addItem(key,mkHotel)}>+ Add Hotel</button>
          <CQVendorAdj show={det.showVendorAdj} adj={det.vendorAdj||{}} onToggle={()=>updDet(key,{showVendorAdj:!det.showVendorAdj})} onAdj={v=>updDet(key,{vendorAdj:v})} />
          <CQServiceFooter total={total} margin={det.margin} onMargin={v=>updDet(key,{margin:v})} />
        </div>
      );
    }

    // VISA
    if (key === 'visa') {
      const visaTypes = ['Tourist','Business','Transit','E-Visa','On Arrival','Not Required'];
      return (
        <div className="cq-detailed-body">
          <CQYellowBanner currency={det.currency} />
          <div className="cq-grid-2">
            <div className="cq-field-g">
              <label className="cq-field-lbl">Visa Type</label>
              <select className="cq-sel" value={det.visaType||'Tourist'} onChange={e=>updDet(key,{visaType:e.target.value})}>
                {visaTypes.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="cq-field-g">
              <label className="cq-field-lbl">Country</label>
              <input type="text" className="cq-text-in" placeholder="Country" value={det.visaCountry||''} onChange={e=>updDet(key,{visaCountry:e.target.value})} />
            </div>
          </div>
          <div className="cq-grid-2">
            <div className="cq-field-g">
              <label className="cq-field-lbl">Cost</label>
              <input type="number" className="cq-text-in" placeholder="0" value={det.visaCost||''} onChange={e=>updDet(key,{visaCost:e.target.value, cost:e.target.value})} />
            </div>
            <div className="cq-field-g">
              <label className="cq-field-lbl">Vendor</label>
              <input type="text" className="cq-text-in" placeholder="Vendor name" value={det.visaVendor||''} onChange={e=>updDet(key,{visaVendor:e.target.value})} />
            </div>
          </div>
        </div>
      );
    }

    // ACTIVITIES
    if (key === 'activities') {
      const acts  = det.items || [];
      const total = sumItems(acts);
      const durOpts = ['2 hrs','3 hrs','4 hrs','Half Day','Full Day','Multi-day'];
      return (
        <div className="cq-detailed-body">
          <CQYellowBanner currency={det.currency} />
          {acts.map((a, idx) => (
            <div key={a.id||idx} className="cq-item-card">
              <div className="cq-item-hdr">
                <span className="cq-item-lbl">Activity {idx+1}</span>
                <CQTrashBtn onClick={()=>delItem(key,idx)} />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Activity Name</label>
                  <input type="text" className="cq-text-in" placeholder="Activity name" value={a.activityName||''} onChange={e=>updItem(key,idx,{activityName:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Location</label>
                  <input type="text" className="cq-text-in" placeholder="Location" value={a.location||''} onChange={e=>updItem(key,idx,{location:e.target.value})} />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Date</label>
                  <CQDate value={a.date} onChange={v=>updItem(key,idx,{date:v})} placeholder="Date" />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Duration</label>
                  <select className="cq-sel" value={a.duration||'Half Day'} onChange={e=>updItem(key,idx,{duration:e.target.value})}>
                    {durOpts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Inclusions</label>
                <textarea className="cq-textarea" placeholder="Inclusions (pickup, guide, tickets...)" rows={2} value={a.inclusions||''} onChange={e=>updItem(key,idx,{inclusions:e.target.value})} />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Cost</label>
                  <input type="number" className="cq-text-in" placeholder="Cost" value={a.cost||''} onChange={e=>updItem(key,idx,{cost:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Vendor</label>
                  <input type="text" className="cq-text-in" placeholder="Vendor name" value={a.vendor||''} onChange={e=>updItem(key,idx,{vendor:e.target.value})} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="cq-add-btn-orange" onClick={()=>addItem(key,mkActiv)}>+ Add Activity</button>
          <CQServiceFooter total={total} margin={det.margin} onMargin={v=>updDet(key,{margin:v})} />
        </div>
      );
    }

    // CAB / TRANSPORT
    if (key === 'cabTransport') {
      const xfers  = det.items || [];
      const total  = sumItems(xfers);
      const vehOpts = ['Sedan','SUV','Tempo Traveller','Mini Bus','Coach','Ferry','Speedboat'];
      return (
        <div className="cq-detailed-body">
          <CQYellowBanner currency={det.currency} />
          {xfers.map((x, idx) => (
            <div key={x.id||idx} className="cq-item-card">
              <div className="cq-item-hdr">
                <span className="cq-item-lbl">Transfer {idx+1}</span>
                <CQTrashBtn onClick={()=>delItem(key,idx)} />
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Vehicle</label>
                <select className="cq-sel" value={x.vehicle||'Sedan'} onChange={e=>updItem(key,idx,{vehicle:e.target.value})}>
                  {vehOpts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Date From</label>
                  <CQDate value={x.dateFrom} onChange={v=>updItem(key,idx,{dateFrom:v})} placeholder="From" />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Date To</label>
                  <CQDate value={x.dateTo} onChange={v=>updItem(key,idx,{dateTo:v})} placeholder="To" />
                </div>
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Route</label>
                <div className="cq-route-row">
                  <input type="text" className="cq-text-in" placeholder="Pickup" value={x.pickup||''} onChange={e=>updItem(key,idx,{pickup:e.target.value})} />
                  <CQArrow />
                  <input type="text" className="cq-text-in" placeholder="Drop" value={x.drop||''} onChange={e=>updItem(key,idx,{drop:e.target.value})} />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Cost</label>
                  <input type="number" className="cq-text-in" placeholder="0" value={x.cost||''} onChange={e=>updItem(key,idx,{cost:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Vendor</label>
                  <input type="text" className="cq-text-in" placeholder="Vendor name" value={x.vendor||''} onChange={e=>updItem(key,idx,{vendor:e.target.value})} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="cq-add-btn-orange" onClick={()=>addItem(key,mkXfer)}>+ Add Transfer</button>
          <CQServiceFooter total={total} margin={det.margin} onMargin={v=>updDet(key,{margin:v})} />
        </div>
      );
    }

    // ADMISSION / ENTRY
    if (key === 'admission') {
      const adms  = det.items || [];
      const total = sumItems(adms);
      return (
        <div className="cq-detailed-body">
          <CQYellowBanner currency={det.currency} />
          {adms.map((a, idx) => (
            <div key={a.id||idx} className="cq-item-card">
              <div className="cq-item-hdr">
                <span className="cq-item-lbl">Entry {idx+1}</span>
                <CQTrashBtn onClick={()=>delItem(key,idx)} />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Name / Attraction</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. Disneyland" value={a.name||''} onChange={e=>updItem(key,idx,{name:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Location</label>
                  <input type="text" className="cq-text-in" placeholder="e.g. Paris" value={a.location||''} onChange={e=>updItem(key,idx,{location:e.target.value})} />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Date</label>
                  <CQDate value={a.date} onChange={v=>updItem(key,idx,{date:v})} placeholder="Select date" />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">No. of Tickets</label>
                  <input type="number" className="cq-text-in" placeholder="0" value={a.tickets||''} onChange={e=>updItem(key,idx,{tickets:e.target.value})} />
                </div>
              </div>
              <div className="cq-field-g">
                <label className="cq-field-lbl">Notes</label>
                <textarea className="cq-textarea" placeholder="Timings, inclusions, special access..." rows={2} value={a.notes||''} onChange={e=>updItem(key,idx,{notes:e.target.value})} />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Cost</label>
                  <input type="number" className="cq-text-in" placeholder="0" value={a.cost||''} onChange={e=>updItem(key,idx,{cost:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Vendor</label>
                  <input type="text" className="cq-text-in" placeholder="Vendor name" value={a.vendor||''} onChange={e=>updItem(key,idx,{vendor:e.target.value})} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="cq-add-btn-orange" onClick={()=>addItem(key,mkAdm)}>+ Add Entry / Admission</button>
          <CQServiceFooter total={total} margin={det.margin} onMargin={v=>updDet(key,{margin:v})} />
        </div>
      );
    }

    // TRAVEL INSURANCE
    if (key === 'insurance') {
      return <CQSimpleForm det={det} onU={p=>updDet(key,p)} />;
    }

    // OTHER
    if (key === 'other') {
      const items = det.items || [];
      const total = sumItems(items);
      const typeOpts = ['Forex','Meet & Greet','Porter & Tips','Guide','Sim/WiFi','Cruise','Train Tickets','Entry Permits','Miscellaneous'];
      return (
        <div className="cq-detailed-body">
          <CQYellowBanner currency={det.currency} />
          {items.map((it, idx) => (
            <div key={it.id||idx} className="cq-item-card">
              <div className="cq-item-hdr">
                <span className="cq-item-lbl">Item {idx+1}</span>
                <CQTrashBtn onClick={()=>delItem(key,idx)} />
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Type</label>
                  <select className="cq-sel" value={it.type||'Forex'} onChange={e=>updItem(key,idx,{type:e.target.value})}>
                    {typeOpts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Description</label>
                  <input type="text" className="cq-text-in" placeholder="Description" value={it.description||''} onChange={e=>updItem(key,idx,{description:e.target.value})} />
                </div>
              </div>
              <div className="cq-grid-2">
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Cost</label>
                  <input type="number" className="cq-text-in" placeholder="Cost" value={it.cost||''} onChange={e=>updItem(key,idx,{cost:e.target.value})} />
                </div>
                <div className="cq-field-g">
                  <label className="cq-field-lbl">Vendor</label>
                  <input type="text" className="cq-text-in" placeholder="Vendor name" value={it.vendor||''} onChange={e=>updItem(key,idx,{vendor:e.target.value})} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="cq-add-btn-orange" onClick={()=>addItem(key,mkOther)}>+ Add Item</button>
          <CQServiceFooter total={total} margin={det.margin} onMargin={v=>updDet(key,{margin:v})} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">Select Services</h3>
          <p className="cq-section-subtitle">Choose the services and enter their costs</p>
        </div>
      </div>

      {/* Service selector grid */}
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

      {/* Cost details area */}
      {selectedKeys.length > 0 && (
        <>
          <div className="cq-cost-section-header">
            <div className="cq-cost-divider-line" />
            <span className="cq-cost-divider-text">COST DETAILS</span>
            <div className="cq-cost-divider-line" />
          </div>
          <p className="cq-fx-ref">FX reference: Frankfurter (ECB daily) • Updated {todayFx}</p>

          {selectedKeys.map(key => {
            const svc = SERVICE_LIST.find(s => s.key === key);
            const det = details[key] || mkDet();
            const hasToggle = SVC_HAS_TOGGLE(key);
            const hasInfo   = SVC_HAS_INFO(key);
            const isFlightExtras = key === 'flightExtras';

            return (
              <div key={key} className="cq-cost-block">
                <div className="cq-cost-block-header">
                  <div className="cq-cost-svc-icon">{svc.icon}</div>
                  <span className="cq-cost-svc-name">{svc.label}</span>
                  {hasInfo && <InfoBtn infoKey="cq_svc_toggle" variant="light" />}
                  <div className="cq-hdr-cur">
                    <CQCurSelect value={det.currency} onChange={v=>updDet(key,{currency:v})} />
                  </div>
                  {hasToggle && (
                    <div className="cq-cost-mode-toggle">
                      <button type="button" className={`cq-cost-mode-btn${det.mode!=='detailed'?' cq-cost-mode-active':''}`} onClick={()=>updDet(key,{mode:'simple'})}>Simple</button>
                      <button type="button" className={`cq-cost-mode-btn${det.mode==='detailed'?' cq-cost-mode-active':''}`} onClick={()=>{
                        const needsItem = SVC_IS_ITEMS(key) && !['visa','insurance'].includes(key);
                        const factory = { flight:mkLeg, flightExtras:mkExtra, train:mkTrain, bus:mkBus, hotel:mkHotel, activities:mkActiv, cabTransport:mkXfer, admission:mkAdm, other:mkOther }[key];
                        const items = (det.items||[]).length===0 && needsItem && factory ? [factory()] : (det.items||[]);
                        updDet(key, { mode:'detailed', items });
                      }}>Detailed</button>
                    </div>
                  )}
                </div>

                {isFlightExtras
                  ? renderServiceBody(key, { ...det, mode:'detailed' })
                  : renderServiceBody(key, det)
                }
              </div>
            );
          })}

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
  { key: 'pure-agent',      label: 'Pure Agent (GST @18% on margin only)',             infoKey: 'cq_bm_pure_agent' },
  { key: 'principal-18',    label: 'Principal (GST @18% on full value)',                infoKey: 'cq_bm_principal_18' },
  { key: 'principal-5',     label: 'Principal (GST @5% on total, No ITC)',              infoKey: 'cq_bm_principal_5' },
  { key: 'principal-pass',  label: 'Principal Pass-through (GST @18% on full, ITC available)', infoKey: 'cq_bm_principal_pass' },
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

const Step4Pricing = ({ data, onChange, calc }) => {
  const billingModel   = data.billingModel   || 'pure-agent';
  const placeOfSupply  = data.placeOfSupply  || '';
  const pricingMode    = data.pricingMode    || 'total-quote';
  const dpcDisplay     = data.dpcDisplay     || 'exclusive';
  const isPureAgent    = billingModel === 'pure-agent';

  const setField = (key, val, extra = {}) => onChange({ [key]: val, ...extra });

  const gstBadgeLabel = calc ? (
    calc.noGst ? 'No GST applicable' :
    calc.gstType === 'cgst-sgst' ? `CGST + SGST (${Math.round(calc.gstRate * 100)}%)` :
    `IGST (${Math.round(calc.gstRate * 100)}%)`
  ) : '';

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
        Billing Model <InfoBtn infoKey="cq_billing_model" />
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
            <InfoBtn infoKey={bm.infoKey} />
          </button>
        ))}
      </div>

      {/* ── Place of Supply ── */}
      <div className="cq-p4-section-label" style={{ marginTop: 22 }}>
        Place of Supply <InfoBtn infoKey="cq_place_of_supply" />
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
        <span className="cq-gst-badge">{gstBadgeLabel}</span>
      )}

      {/* ── Pricing Mode toggle ── */}
      <div className="cq-p4-section-label" style={{ marginTop: 22 }}>
        How do you want to set pricing? <InfoBtn infoKey="cq_pricing_mode" />
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
            Total Quote Amount (incl. GST + TCS) <InfoBtn infoKey="cq_total_quote" />
          </div>
          <input
            type="number"
            className="cq-p4-input"
            placeholder="Enter total amount customer will pay"
            value={data.totalQuoteAmount || ''}
            onChange={e => setField('totalQuoteAmount', e.target.value)}
          />
          {calc && (parseFloat(data.totalQuoteAmount) || 0) > 0 && (
            <p className="cq-p4-hint" style={{ color: '#059669', fontWeight: 500 }}>
              Calculated margin: ₹{Math.round(calc.margin).toLocaleString('en-IN')}
              {calc.margin < 0 && <span style={{ color: '#dc2626' }}> (negative)</span>}
            </p>
          )}
        </>
      )}

      {/* ── Set Margin mode ── */}
      {pricingMode === 'set-margin' && (
        <>
          <div className="cq-p4-section-label" style={{ marginTop: 20 }}>
            Total Margin Amount (₹) <InfoBtn infoKey="cq_total_margin" />
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
        Commission Earned (from vendors) <InfoBtn infoKey="cq_commission" />
      </div>
      <input
        type="number"
        className="cq-p4-input"
        placeholder="Optional vendor commission"
        value={data.vendorCommission || ''}
        onChange={e => setField('vendorCommission', e.target.value)}
      />
      <p className="cq-p4-hint">Commission is tracked separately and added to total profit</p>

      {/* ── Display Processing Charge card — Pure Agent only ── */}
      {isPureAgent && (
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
            >Inclusive of GST <InfoBtn infoKey="cq_dpc_inclusive" /></button>
            <button
              type="button"
              className={`cq-dpc-btn${dpcDisplay === 'exclusive' ? ' cq-dpc-btn-active' : ''}`}
              onClick={() => setField('dpcDisplay', 'exclusive')}
            >
              Exclusive of GST
              <InfoBtn infoKey="cq_dpc_exclusive" />
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
      )}

      {/* TCS info note */}
      {calc && calc.tcsApplicable && (
        <div className="cq-calc-warning" style={{ background: '#eff6ff', borderColor: '#bfdbfe', marginTop: 16 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>TCS @5% applies (international + 2+ services). TCS is adjustable against customer's income tax.</span>
        </div>
      )}
    </div>
  );
};

// ─── Step 5: Review ───────────────────────────────────────────────────────────
const Step5Review = ({ data, onChange, editMode, isPrefilled, prefilledCustomer, calc }) => {
  const activeServices = SERVICE_LIST.filter(s => (data.services || {})[s.key]);
  const totalPayable = calc ? calc.totalPayable : 0;

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
  email: 'demo@touridoo.in',
};
const fmtDate6 = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const todayStr = () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const DEFAULT_PMT  = '25% advance on confirmation · 75% balance 7 days before travel';
const DEFAULT_CANC = '≥ 30 days: Nil · 16–29 days: 25% · 8–15 days: 50% · 0–7 days: 100%';

const Step6Itinerary = ({ data, onChange, editMode, onOpenDesigner }) => {
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
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.5"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
          </div>
          <h3 className="cq-it-designed-title">Using Design Itinerary Builder</h3>
          <p className="cq-it-designed-desc">This quote uses the design itinerary builder with custom templates, images, and rich formatting.</p>
          <button type="button" className="cq-it-open-designer" onClick={onOpenDesigner || openDemo}>
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

// ─── Logs Popup ──────────────────────────────────────────────────────────────


// ─── Main CreateQuote Component ───────────────────────────────────────────────
export const CreateQuote = ({ onViewChange, prefilledCustomer, editQuote }) => {
  const editMode    = Boolean(editQuote);
  const isPrefilled = Boolean(prefilledCustomer) && !editMode;
  const firstStep   = editMode ? (editQuote._startStep || 1) : isPrefilled ? 2 : 1;

  const { addQuote, updateQuoteFromForm } = useDemoData();
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

  // Compute costOfServices and totalServiceMargin
  const costOfServices = useMemo(() => {
    const sc = formData.serviceCosts || {};
    return Object.values(sc).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  }, [formData.serviceCosts]);

  const totalServiceMargin = useMemo(() => {
    const details = formData.serviceDetails || {};
    return Object.values(details).reduce((s, d) => s + (parseFloat(d?.margin) || 0), 0);
  }, [formData.serviceDetails]);

  const serviceCount = useMemo(() => {
    return Object.values(formData.services || {}).filter(Boolean).length;
  }, [formData.services]);

  // Full calculation via shared engine
  const calcResult = useMemo(() => calculate({
    costOfServices,
    billingModel: formData.billingModel || 'pure-agent',
    pricingMode: formData.pricingMode || 'set-margin',
    totalQuoteAmount: formData.totalQuoteAmount,
    marginAmount: formData.marginAmount || formData.hiddenMarkup,
    totalServiceMargin,
    vendorCommission: formData.vendorCommission,
    placeOfSupply: formData.placeOfSupply,
    businessStateCode: '',
    destType: formData.destType || 'domestic',
    serviceCount,
    dpcDisplay: formData.dpcDisplay,
    displayProcessingCharge: formData.displayProcessingCharge,
  }), [costOfServices, totalServiceMargin, serviceCount,
    formData.billingModel, formData.pricingMode, formData.totalQuoteAmount,
    formData.marginAmount, formData.hiddenMarkup, formData.vendorCommission,
    formData.placeOfSupply, formData.destType, formData.dpcDisplay,
    formData.displayProcessingCharge]);

  const handleBack = () => {
    if (currentStep > firstStep) {
      setCurrentStep(s => s - 1);
    } else if (editMode) {
      onViewChange && onViewChange(editQuote._fromView || 'quote-detail');
    } else if (isPrefilled) {
      onViewChange && onViewChange('customer-profile');
    } else {
      onViewChange && onViewChange('quotes');
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(s => s + 1);
    } else {
      let qId;
      if (editMode) {
        qId = formData._editQuoteId || 'WL-Q-0001';
        updateQuoteFromForm(qId, formData, calcResult);
      } else {
        const result = addQuote(formData, calcResult);
        qId = result.id;
      }
      openDesigner(qId, formData, 'create-quote');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Customer data={formData} onChange={updateFormData} />;
      case 2: return <Step2Trip data={formData} onChange={updateFormData} />;
      case 3: return <Step3Services data={formData} onChange={updateFormData} />;
      case 4: return <Step4Pricing data={formData} onChange={updateFormData} calc={calcResult} />;
      case 5: return <Step5Review data={formData} onChange={updateFormData} editMode={editMode} isPrefilled={isPrefilled} prefilledCustomer={prefilledCustomer} calc={calcResult} />;
      case 6: return <Step6Itinerary data={formData} onChange={updateFormData} editMode={editMode} onOpenDesigner={() => {
        let qId;
        if (editMode) {
          qId = formData._editQuoteId || 'WL-Q-0001';
          updateQuoteFromForm(qId, formData, calcResult);
        } else {
          const result = addQuote(formData, calcResult);
          qId = result.id;
        }
        openDesigner(qId, formData, 'create-quote');
      }} />;
      default: return null;
    }
  };

  const fromQuotes = editMode && editQuote._fromView === 'quotes';
  const backLabel = editMode
    ? (fromQuotes
        ? `Quotes / ${editQuote._editQuoteId || ''} / Edit Quote`
        : '← Back to Quote')
    : isPrefilled
      ? `← ${prefilledCustomer.name} / New Quote`
      : 'Back to Quotes';

  const backTarget = editMode
    ? () => onViewChange && onViewChange(editQuote._fromView || 'quote-detail')
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
            <DemoLogButton />
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
      <div className="cq-upload-zone" onClick={triggerDemoPopup}>
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
                  {editMode ? 'Update Quote & Open Designer' : 'Save Quote & Open Designer'}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
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
          <LiveCalculation mode={calcMode} onModeChange={setCalcMode} calc={calcResult} />
        </div>
      </div>

    </div>
  );
};

export default CreateQuote;
