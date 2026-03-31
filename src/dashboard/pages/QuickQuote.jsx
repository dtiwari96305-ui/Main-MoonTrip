import React, { useState, useMemo, useRef, useEffect } from 'react';
import { RealHeader as Header } from '../components/RealHeader';
import { calculate } from '../../shared/utils/calculationEngine';
import { useData } from '../context/DataContext';

const BILLING_MODELS = [
  { key: 'pure-agent',   label: 'Pure Agent (GST @18% on margin only)' },
  { key: 'principal-18', label: 'Principal - Tourist (GST @18% on full)' },
  { key: 'principal-5',  label: 'Principal - Tour Operator (GST @5% on full)' },
  { key: 'passthrough',  label: 'Principal Pass-through (No GST)' },
];

const BILLING_SUBTITLES = {
  'pure-agent':   'Pure Agent - GST @18% on margin only',
  'principal-18': 'Principal - GST @18% on full value',
  'principal-5':  'Principal - GST @5% on full value',
  'passthrough':  'Principal - Pass-through (No GST)',
};

const SERVICES = [
  { key: 'flight',    label: 'Flight',           icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg> },
  { key: 'hotel',     label: 'Hotel',            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { key: 'land',      label: 'Land Package',     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg> },
  { key: 'visa',      label: 'Visa',             icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { key: 'cab',       label: 'Cab / Transport',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { key: 'insurance', label: 'Travel Insurance', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { key: 'other',     label: 'Other',            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> },
];

const fmt = (n) => '₹' + (n === 0 ? '0' : Math.round(n).toLocaleString('en-IN'));
const pct = (profit, total) => total > 0 ? ((profit / total) * 100).toFixed(1) : '0.0';

const PricingRow = ({ label, value, bold }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: bold ? 600 : 400, color: bold ? '#f8fafc' : '#cbd5e1' }}>
    <span>{label}</span><span>{value}</span>
  </div>
);

const ToggleBtn = ({ active, onClick, children }) => (
  <button
    type="button" onClick={onClick}
    style={{ padding: '8px 20px', borderRadius: 20, border: 'none', background: active ? '#f97316' : '#f3f4f6', color: active ? '#fff' : '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
  >
    {children}
  </button>
);

const SectionCard = ({ num, title, children }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '24px', marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <span style={{ width: 26, height: 26, borderRadius: 8, background: '#fff1ee', color: '#f97316', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{title}</span>
    </div>
    {children}
  </div>
);

export const RealQuickQuote = ({ onViewChange }) => {
  const { customers = [], createQuote } = useData();

  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const customerRef = useRef(null);

  const [destType, setDestType] = useState('domestic');
  const [destination, setDestination] = useState('');
  const [pax, setPax] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [duration, setDuration] = useState('');

  const [services, setServices] = useState({});

  const [billingModel, setBillingModel] = useState('pure-agent');
  const [pricingMode, setPricingMode] = useState('total-quote');
  const [totalQuoteAmount, setTotalQuoteAmount] = useState('');
  const [marginAmount, setMarginAmount] = useState('');
  const [vendorCommission, setVendorCommission] = useState('');
  const [displayProcessingCharge, setDisplayProcessingCharge] = useState('');
  const [dpcDisplay, setDpcDisplay] = useState('exclusive');

  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customerRef.current && !customerRef.current.contains(e.target)) setShowCustomerDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(c =>
    customerSearch === '' ? true :
      (c.name || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.phone && c.phone.includes(customerSearch))
  );

  const serviceCount = Object.values(services).filter(Boolean).length;

  const calc = useMemo(() => calculate({
    costOfServices: 0,
    billingModel,
    pricingMode: pricingMode === 'total-quote' ? 'total-quote' : 'set-margin',
    totalQuoteAmount: pricingMode === 'total-quote' ? totalQuoteAmount : '',
    marginAmount: pricingMode === 'margin' ? marginAmount : '',
    totalServiceMargin: 0,
    vendorCommission,
    placeOfSupply: '',
    businessStateCode: '',
    destType,
    serviceCount,
    dpcDisplay,
    displayProcessingCharge,
  }), [billingModel, pricingMode, totalQuoteAmount, marginAmount, vendorCommission, destType, serviceCount, dpcDisplay, displayProcessingCharge]);

  const isPureAgent = billingModel === 'pure-agent';

  const handleSave = async () => {
    setSaving(true);
    try {
      if (createQuote) {
        await createQuote({
          quoteType: 'quick',
          customerId: selectedCustomer?.id,
          customerName: selectedCustomer?.name || '',
          destType, destination, pax, travelDate, returnDate, duration,
          services, billingModel, pricingMode,
          totalQuoteAmount: parseFloat(totalQuoteAmount) || 0,
          marginAmount: parseFloat(marginAmount) || 0,
          vendorCommission: parseFloat(vendorCommission) || 0,
          displayProcessingCharge: parseFloat(displayProcessingCharge) || 0,
          dpcDisplay, notes, internalNotes,
          amount: calc.totalPayable || 0,
          profit: calc.totalProfit || 0,
          status: 'draft',
        });
      }
      onViewChange && onViewChange('quotes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content">
      <Header title="Quick Quote" subtitle="Create a simple quote in 60 seconds" showNewQuote={false}>
        <button
          className="btn-secondary"
          onClick={() => onViewChange && onViewChange('quotes')}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>
      </Header>

      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* 1. Customer */}
        <SectionCard num="1" title="Customer">
          <div style={{ position: 'relative' }} ref={customerRef}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', background: '#fff', gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              {selectedCustomer ? (
                <span style={{ flex: 1, fontSize: 14, color: '#111827' }}>{selectedCustomer.name} — {selectedCustomer.phone}</span>
              ) : (
                <input
                  type="text"
                  placeholder="Search customer by name or phone..."
                  value={customerSearch}
                  onChange={e => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#374151', background: 'transparent' }}
                />
              )}
              {selectedCustomer && (
                <button onClick={() => { setSelectedCustomer(null); setCustomerSearch(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            {showCustomerDropdown && !selectedCustomer && filteredCustomers.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: 220, overflowY: 'auto' }}>
                {filteredCustomers.map(c => (
                  <div
                    key={c.id}
                    onClick={() => { setSelectedCustomer(c); setShowCustomerDropdown(false); setCustomerSearch(''); }}
                    style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#374151', flexShrink: 0 }}>
                      {(c.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{c.id} · {c.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* 2. Trip Details */}
        <SectionCard num="2" title="Trip Details">
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#374151', marginBottom: 8, fontWeight: 500 }}>Destination Type</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ToggleBtn active={destType === 'domestic'} onClick={() => setDestType('domestic')}>Domestic</ToggleBtn>
              <ToggleBtn active={destType === 'international'} onClick={() => setDestType('international')}>International</ToggleBtn>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Destination</label>
              <input className="form-input" placeholder="e.g. Goa, Thailand" value={destination} onChange={e => setDestination(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>No. of Pax</label>
              <input className="form-input" placeholder="e.g. 4" type="number" value={pax} onChange={e => setPax(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Travel Date</label>
              <input className="form-input" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Return Date</label>
              <input className="form-input" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Duration</label>
              <input className="form-input" placeholder="e.g. 3N/4D" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
          </div>
        </SectionCard>

        {/* 3. Services */}
        <SectionCard num="3" title="Services">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SERVICES.map((svc, i) => (
              <label
                key={svc.key}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', borderBottom: i < SERVICES.length - 1 ? '1px solid #f3f4f6' : 'none', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={!!services[svc.key]}
                  onChange={e => setServices(prev => ({ ...prev, [svc.key]: e.target.checked }))}
                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#f97316' }}
                />
                <span style={{ color: '#6b7280' }}>{svc.icon}</span>
                <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{svc.label}</span>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* 4. Billing & Pricing */}
        <SectionCard num="4" title="Billing &amp; Pricing">
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Billing Model</label>
            <select className="form-input" value={billingModel} onChange={e => setBillingModel(e.target.value)}>
              {BILLING_MODELS.map(bm => <option key={bm.key} value={bm.key}>{bm.label}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 8 }}>Input Mode</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ToggleBtn active={pricingMode === 'total-quote'} onClick={() => setPricingMode('total-quote')}>Total Quote</ToggleBtn>
              <ToggleBtn active={pricingMode === 'margin'} onClick={() => setPricingMode('margin')}>Margin</ToggleBtn>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            <div>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                {pricingMode === 'total-quote' ? 'Total Quote Amount' : 'Margin Amount'}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 14 }}>₹</span>
                <input
                  className="form-input" type="number" placeholder="0" style={{ paddingLeft: 28 }}
                  value={pricingMode === 'total-quote' ? totalQuoteAmount : marginAmount}
                  onChange={e => pricingMode === 'total-quote' ? setTotalQuoteAmount(e.target.value) : setMarginAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Commission Earned</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 14 }}>₹</span>
                <input
                  className="form-input" type="number" placeholder="0" style={{ paddingLeft: 28 }}
                  value={vendorCommission} onChange={e => setVendorCommission(e.target.value)}
                />
              </div>
            </div>
          </div>

          {isPureAgent && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Processing Charge (as shown in invoice)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 14 }}>₹</span>
                  <input
                    className="form-input" type="number" placeholder="0" style={{ paddingLeft: 28 }}
                    value={displayProcessingCharge} onChange={e => setDisplayProcessingCharge(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Charge Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <ToggleBtn active={dpcDisplay === 'inclusive'} onClick={() => setDpcDisplay('inclusive')}>Incl GST</ToggleBtn>
                  <ToggleBtn active={dpcDisplay === 'exclusive'} onClick={() => setDpcDisplay('exclusive')}>Excl GST</ToggleBtn>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Live Pricing Summary */}
        <div style={{ background: '#0f172a', borderRadius: 14, padding: '24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Live Pricing Summary</span>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>{BILLING_SUBTITLES[billingModel]}</div>

          {isPureAgent ? (
            <>
              <PricingRow label="Cost of Travel" value={fmt(calc.costOfTravel || 0)} />
              <PricingRow label="Processing Charge (excl GST)" value={fmt(calc.processingCharge || 0)} />
            </>
          ) : (
            <>
              <PricingRow label="Package Price" value={fmt(calc.packagePrice || 0)} />
              <PricingRow label={`GST @${Math.round((calc.gstRate || 0.18) * 100)}%`} value={fmt(calc.gstAmount || 0)} />
            </>
          )}
          <PricingRow label="Invoice Value" value={fmt(calc.invoiceValue || 0)} bold />
          <PricingRow label="TOTAL PAYABLE" value={fmt(calc.totalPayable || 0)} bold />

          <div style={{ borderTop: '1px solid #1e293b', margin: '16px 0' }} />
          <div style={{ fontSize: 12, color: '#f97316', fontWeight: 600, marginBottom: 10 }}>Profit Breakdown</div>
          <PricingRow label="Hidden Markup" value={fmt(calc.margin || 0)} />
          {isPureAgent && <PricingRow label="Processing Charge (excl GST)" value={fmt(calc.processingCharge || 0)} />}
          <PricingRow label="Commission" value={fmt(calc.commission || 0)} />
          <PricingRow label={`Total Profit (${pct(calc.totalProfit || 0, calc.totalPayable || 0)}%)`} value={fmt(calc.totalProfit || 0)} bold />

          {calc.isNoMargin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(254,243,199,0.12)', border: '1px solid rgba(253,224,71,0.25)', borderRadius: 8, padding: '10px 12px', marginTop: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span style={{ fontSize: 12, color: '#fcd34d' }}>Pure Agent with no/negative margin — No GST applicable.</span>
            </div>
          )}
        </div>

        {/* 5. Notes */}
        <SectionCard num="5" title="Notes">
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Notes (visible to customer)</label>
            <textarea className="form-input" rows={3} placeholder="Any notes for the customer..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#374151', fontWeight: 500, display: 'block', marginBottom: 6 }}>Internal Notes (staff only)</label>
            <textarea className="form-input" rows={3} placeholder="Internal notes..." value={internalNotes} onChange={e => setInternalNotes(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
        </SectionCard>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingBottom: 40 }}>
          <button className="btn-secondary" onClick={() => onViewChange && onViewChange('quotes')}>Cancel</button>
          <button className="new-quote-btn" disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save & Convert to Booking'}
          </button>
          <button className="new-quote-btn" style={{ background: '#16a34a' }} disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
