import React, { useState, useRef } from 'react';

const STEPS = [
  { id: 1, label: 'Customer' },
  { id: 2, label: 'Trip' },
  { id: 3, label: 'Services' },
  { id: 4, label: 'Pricing' },
  { id: 5, label: 'Review' },
  { id: 6, label: 'Itinerary' },
];

const SERVICE_LIST = [
  {
    key: 'flight', label: 'Flight',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.5 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.41 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  },
  {
    key: 'hotel', label: 'Hotel / Stay',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
  {
    key: 'transport', label: 'Transport',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
  },
  {
    key: 'meals', label: 'Meals',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
  },
  {
    key: 'activities', label: 'Activities / Sightseeing',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  },
  {
    key: 'visa', label: 'Visa Assistance',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  },
  {
    key: 'insurance', label: 'Travel Insurance',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  },
  {
    key: 'train', label: 'Train',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 2v9"/><path d="M8 18l-2 4"/><path d="M16 18l2 4"/></svg>
  },
];

// ─── Demo Modal ───────────────────────────────────────────────────────────────
const DemoModal = ({ onClose }) => (
  <div className="demo-modal-overlay" onClick={onClose}>
    <div className="demo-modal" onClick={e => e.stopPropagation()}>
      <div className="demo-modal-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h3>Demo Account</h3>
      <p>This is a demo account. Changes cannot be made.</p>
      <button className="demo-modal-btn" onClick={onClose}>OK, Got it</button>
    </div>
  </div>
);

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
            <div className="cq-calc-row cq-calc-subrow"><span>CGST @9%</span><span>{fmt(cgst)}</span></div>
            <div className="cq-calc-row cq-calc-subrow"><span>SGST @9%</span><span>{fmt(sgst)}</span></div>
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

// ─── Step 2: Trip ─────────────────────────────────────────────────────────────
const Step2Trip = ({ data, onChange }) => (
  <div className="cq-step-content">
    <div className="cq-section-header">
      <div>
        <h3 className="cq-section-title">Trip Details</h3>
        <p className="cq-section-subtitle">Provide destination and travel information</p>
      </div>
    </div>

    <div className="cq-form-grid-2">
      <div className="cq-field-group cq-span-2">
        <label>Trip Name / Reference</label>
        <input type="text" placeholder="e.g. Bali Honeymoon Package" value={data.tripName || ''} onChange={e => onChange({ tripName: e.target.value })} />
      </div>
      <div className="cq-field-group cq-span-2">
        <label>Destination(s) <span className="cq-required">*</span></label>
        <input type="text" placeholder="e.g. Bali, Indonesia" value={data.destination || ''} onChange={e => onChange({ destination: e.target.value })} />
      </div>
      <div className="cq-field-group">
        <label>Destination Type <span className="cq-required">*</span></label>
        <select value={data.destType || 'domestic'} onChange={e => onChange({ destType: e.target.value })}>
          <option value="domestic">Domestic</option>
          <option value="international">International</option>
        </select>
      </div>
      <div className="cq-field-group">
        <label>No. of Nights</label>
        <input type="number" min="1" placeholder="e.g. 5" value={data.nights || ''} onChange={e => onChange({ nights: e.target.value })} />
      </div>
      <div className="cq-field-group">
        <label>Departure Date <span className="cq-required">*</span></label>
        <input type="date" value={data.departureDate || ''} onChange={e => onChange({ departureDate: e.target.value })} />
      </div>
      <div className="cq-field-group">
        <label>Return Date <span className="cq-required">*</span></label>
        <input type="date" value={data.returnDate || ''} onChange={e => onChange({ returnDate: e.target.value })} />
      </div>
    </div>

    <div className="cq-pax-section">
      <h4 className="cq-sub-section-title">Passengers</h4>
      <div className="cq-form-grid-3">
        <div className="cq-field-group">
          <label>Adults <span className="cq-required">*</span></label>
          <input type="number" min="1" placeholder="2" value={data.adults || ''} onChange={e => onChange({ adults: e.target.value })} />
        </div>
        <div className="cq-field-group">
          <label>Children (2–11 yrs)</label>
          <input type="number" min="0" placeholder="0" value={data.children || ''} onChange={e => onChange({ children: e.target.value })} />
        </div>
        <div className="cq-field-group">
          <label>Infants (&lt;2 yrs)</label>
          <input type="number" min="0" placeholder="0" value={data.infants || ''} onChange={e => onChange({ infants: e.target.value })} />
        </div>
      </div>
    </div>
  </div>
);

// ─── Step 3: Services ─────────────────────────────────────────────────────────
const Step3Services = ({ data, onChange }) => {
  const selectedServices = data.services || {};

  const toggleService = (key) => {
    onChange({ services: { ...selectedServices, [key]: !selectedServices[key] } });
  };

  const updateCost = (key, val) => {
    onChange({ serviceCosts: { ...(data.serviceCosts || {}), [key]: val } });
  };

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">Services Included</h3>
          <p className="cq-section-subtitle">Select the services to include in this quote</p>
        </div>
      </div>
      <div className="cq-services-grid">
        {SERVICE_LIST.map(svc => (
          <div key={svc.key} className={`cq-service-card ${selectedServices[svc.key] ? 'active' : ''}`}>
            <div className="cq-service-toggle-row" onClick={() => toggleService(svc.key)}>
              <div className="cq-service-icon">{svc.icon}</div>
              <span className="cq-service-label">{svc.label}</span>
              <div className={`cq-toggle-switch ${selectedServices[svc.key] ? 'on' : ''}`}>
                <div className="cq-toggle-knob" />
              </div>
            </div>
            {selectedServices[svc.key] && (
              <div className="cq-service-cost-row">
                <label>Cost (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={(data.serviceCosts || {})[svc.key] || ''}
                  onChange={e => updateCost(svc.key, e.target.value)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Step 4: Pricing ──────────────────────────────────────────────────────────
const Step4Pricing = ({ data, onChange }) => {
  const serviceCosts = data.serviceCosts || {};
  const totalServiceCost = Object.values(serviceCosts).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">Pricing & GST</h3>
          <p className="cq-section-subtitle">Configure the pricing and tax structure</p>
        </div>
      </div>
      <div className="cq-form-grid-2">
        <div className="cq-field-group">
          <label>Cost of Services (₹)</label>
          <input
            type="number"
            placeholder="e.g. 120000"
            value={data.costOfServices !== undefined ? data.costOfServices : (totalServiceCost || '')}
            onChange={e => onChange({ costOfServices: e.target.value })}
          />
          {totalServiceCost > 0 && (
            <span className="cq-field-hint">Services total: ₹{totalServiceCost.toLocaleString('en-IN')}</span>
          )}
        </div>
        <div className="cq-field-group">
          <label>Hidden Markup (₹)</label>
          <input type="number" min="0" placeholder="0" value={data.hiddenMarkup || ''} onChange={e => onChange({ hiddenMarkup: e.target.value })} />
          <span className="cq-field-hint">Not shown to the customer</span>
        </div>
        <div className="cq-field-group">
          <label>Processing Charge (₹, excl. GST)</label>
          <input type="number" min="0" placeholder="0" value={data.processingCharge || ''} onChange={e => onChange({ processingCharge: e.target.value })} />
        </div>
        <div className="cq-field-group">
          <label>GST Mode</label>
          <select value={data.gstMode || 'pure-agent'} onChange={e => onChange({ gstMode: e.target.value })}>
            <option value="pure-agent">Pure Agent – GST @18% on margin only</option>
            <option value="principal">Principal to Principal – GST @5% on full value</option>
          </select>
        </div>
        <div className="cq-field-group">
          <label>TCS Applicability</label>
          <select value={data.tcsMode || 'na'} onChange={e => onChange({ tcsMode: e.target.value })}>
            <option value="na">N/A</option>
            <option value="5">TCS @5% (International)</option>
            <option value="domestic">TCS @1% (Domestic &gt;₹7L)</option>
          </select>
        </div>
        <div className="cq-field-group">
          <label>Payment Due Date</label>
          <input type="date" value={data.paymentDueDate || ''} onChange={e => onChange({ paymentDueDate: e.target.value })} />
        </div>
      </div>

      <div className="cq-pricing-note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>The Live Calculation panel on the right updates in real time as you fill in the pricing details.</span>
      </div>
    </div>
  );
};

// ─── Step 5: Review ───────────────────────────────────────────────────────────
const Step5Review = ({ data, isPrefilled, prefilledCustomer }) => {
  const serviceCosts = data.serviceCosts || {};
  const activeServices = SERVICE_LIST.filter(s => (data.services || {})[s.key]);

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">Review Quote</h3>
          <p className="cq-section-subtitle">Review all details before generating the quote</p>
        </div>
      </div>
      <div className="cq-review-grid">
        <div className="cq-review-card">
          <h4 className="cq-review-card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            Customer
          </h4>
          {isPrefilled && prefilledCustomer && (
            <div className="cq-review-row"><span>Customer ID</span><span>{prefilledCustomer.id}</span></div>
          )}
          <div className="cq-review-row"><span>Name</span><span>{(isPrefilled && prefilledCustomer?.name) || data.customerSearch || data.newCustomerName || '—'}</span></div>
          <div className="cq-review-row"><span>Phone</span><span>{(isPrefilled && prefilledCustomer?.phone) || data.newCustomerPhone || '—'}</span></div>
          <div className="cq-review-row"><span>Email</span><span>{(isPrefilled && prefilledCustomer?.email) || data.newCustomerEmail || '—'}</span></div>
        </div>

        <div className="cq-review-card">
          <h4 className="cq-review-card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.4-8 13-8 13S4 15.4 4 10a8 8 0 0 1 8-8z"/></svg>
            Trip
          </h4>
          <div className="cq-review-row"><span>Destination</span><span>{data.destination || '—'}</span></div>
          <div className="cq-review-row"><span>Type</span><span style={{ textTransform: 'capitalize' }}>{data.destType || '—'}</span></div>
          <div className="cq-review-row"><span>Dates</span><span>{data.departureDate && data.returnDate ? `${data.departureDate} → ${data.returnDate}` : '—'}</span></div>
          <div className="cq-review-row">
            <span>Pax</span>
            <span>
              {[data.adults && `${data.adults} Adults`, data.children && `${data.children} Children`, data.infants && `${data.infants} Infants`].filter(Boolean).join(', ') || '—'}
            </span>
          </div>
        </div>

        <div className="cq-review-card">
          <h4 className="cq-review-card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Services
          </h4>
          {activeServices.length > 0 ? activeServices.map(svc => (
            <div key={svc.key} className="cq-review-row">
              <span>{svc.label}</span>
              <span>{serviceCosts[svc.key] ? `₹${parseFloat(serviceCosts[svc.key]).toLocaleString('en-IN')}` : 'Included'}</span>
            </div>
          )) : <div className="cq-review-empty">No services selected</div>}
        </div>

        <div className="cq-review-card">
          <h4 className="cq-review-card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Pricing
          </h4>
          <div className="cq-review-row"><span>Cost of Services</span><span>₹{(parseFloat(data.costOfServices) || 0).toLocaleString('en-IN')}</span></div>
          <div className="cq-review-row"><span>Hidden Markup</span><span>₹{(parseFloat(data.hiddenMarkup) || 0).toLocaleString('en-IN')}</span></div>
          <div className="cq-review-row"><span>Processing Charge</span><span>₹{(parseFloat(data.processingCharge) || 0).toLocaleString('en-IN')}</span></div>
          <div className="cq-review-row"><span>GST Mode</span><span>{data.gstMode === 'principal' ? 'Principal to Principal' : 'Pure Agent'}</span></div>
        </div>
      </div>
    </div>
  );
};

// ─── Step 6: Itinerary ────────────────────────────────────────────────────────
const Step6Itinerary = ({ data, onChange }) => {
  const days = data.itineraryDays || [{ title: '', description: '' }];

  const updateDay = (idx, field, val) => {
    onChange({ itineraryDays: days.map((d, i) => i === idx ? { ...d, [field]: val } : d) });
  };

  const addDay = () => onChange({ itineraryDays: [...days, { title: '', description: '' }] });
  const removeDay = (idx) => onChange({ itineraryDays: days.filter((_, i) => i !== idx) });

  return (
    <div className="cq-step-content">
      <div className="cq-section-header">
        <div>
          <h3 className="cq-section-title">Day-wise Itinerary</h3>
          <p className="cq-section-subtitle">Build the day-by-day trip plan (optional)</p>
        </div>
      </div>

      {days.map((day, idx) => (
        <div key={idx} className="cq-itinerary-day">
          <div className="cq-itin-day-header">
            <div className="cq-itin-day-badge">Day {idx + 1}</div>
            {days.length > 1 && (
              <button className="cq-itin-remove-btn" onClick={() => removeDay(idx)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          <div className="cq-field-group" style={{ marginBottom: 12 }}>
            <label>Day Title</label>
            <input type="text" placeholder="e.g. Arrival in Bali & Seminyak Beach" value={day.title} onChange={e => updateDay(idx, 'title', e.target.value)} />
          </div>
          <div className="cq-field-group">
            <label>Activities & Description</label>
            <textarea rows="3" placeholder="Describe the day's activities, transfers, meals included..." value={day.description} onChange={e => updateDay(idx, 'description', e.target.value)} />
          </div>
        </div>
      ))}

      <button className="cq-add-day-btn" onClick={addDay}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Day
      </button>

      <div className="cq-field-group" style={{ marginTop: 24 }}>
        <label>Additional Notes / Terms</label>
        <textarea rows="4" placeholder="Inclusions, exclusions, cancellation policy, special notes..." value={data.notes || ''} onChange={e => onChange({ notes: e.target.value })} />
      </div>
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
export const CreateQuote = ({ onViewChange, prefilledCustomer }) => {
  const isPrefilled = Boolean(prefilledCustomer);
  const firstStep   = isPrefilled ? 2 : 1;

  const [currentStep, setCurrentStep] = useState(firstStep);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [calcMode, setCalcMode] = useState('agent');
  const [formData, setFormData] = useState(() => {
    const base = { services: {}, serviceCosts: {}, destType: 'domestic', gstMode: 'pure-agent', tcsMode: 'na' };
    if (prefilledCustomer) {
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
    } else if (isPrefilled) {
      onViewChange && onViewChange('customer-profile');
    } else {
      onViewChange && onViewChange('quotes');
    }
  };

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(s => s + 1);
    else setShowDemoModal(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Customer data={formData} onChange={updateFormData} />;
      case 2: return <Step2Trip data={formData} onChange={updateFormData} />;
      case 3: return <Step3Services data={formData} onChange={updateFormData} />;
      case 4: return <Step4Pricing data={formData} onChange={updateFormData} />;
      case 5: return <Step5Review data={formData} isPrefilled={isPrefilled} prefilledCustomer={prefilledCustomer} />;
      case 6: return <Step6Itinerary data={formData} onChange={updateFormData} />;
      default: return null;
    }
  };

  const backLabel = isPrefilled
    ? `← ${prefilledCustomer.name} / New Quote`
    : 'Back to Quotes';

  const backTarget = isPrefilled
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
            <h1 className="page-title" style={{ marginTop: 6 }}>Create Quote</h1>
            <p className="page-subtitle">Build a new travel quotation</p>
          </div>
          <div className="dash-header-right">
            <div className="header-user">
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
        <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls" style={{ display: 'none' }} onChange={() => setShowDemoModal(true)} />
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
                  Save Quote
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

      {showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}
    </div>
  );
};

export default CreateQuote;
