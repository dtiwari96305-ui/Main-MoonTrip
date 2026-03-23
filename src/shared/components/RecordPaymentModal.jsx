import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { InfoBtn } from './InfoBtn';

// Pending bookings per customer (partial / unpaid only)
const pendingBookings = {
  'Vikram Iyer': [
    { id: 'WL-B-0001', destination: 'Goa', remaining: '₹2,34,900' },
  ],
};


// ─── Mode option icons ─────────────────────────────────────────────────────
const ModeIcon = ({ mode }) => {
  if (mode === 'cash') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>
  );
  if (mode === 'upi') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
  );
  if (mode === 'bank') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2L2 7h20L12 2z"/></svg>
  );
  if (mode === 'cheque') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  );
  if (mode === 'card') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  );
  return null;
};

// ─── Main Component ────────────────────────────────────────────────────────
export const RecordPaymentModal = ({ isOpen, onClose, preselectedCustomer = null, customers = [], onSave }) => {
  const [step, setStep] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form fields
  const [amount, setAmount] = useState('');
  const [allocateTo, setAllocateTo] = useState('advance');
  const [mode, setMode] = useState('bank');
  const [date, setDate] = useState('');
  const [reference, setReference] = useState('');
  const [bankName, setBankName] = useState('');
  const [notes, setNotes] = useState('');

  const searchRef = useRef(null);

  // Today's date as default
  useEffect(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setDate(`${y}-${m}-${d}`);
  }, []);

  // On open — initialise state
  useEffect(() => {
    if (!isOpen) return;
    if (preselectedCustomer) {
      setSelectedCustomer(preselectedCustomer);
      setStep('form');
    } else {
      setStep('search');
      setSearchQuery('');
      setSelectedCustomer(null);
    }
    setAmount('');
    setAllocateTo('advance');
    setMode('bank');
    setReference('');
    setBankName('');
    setNotes('');
  }, [isOpen, preselectedCustomer]);

  // Auto-focus search input
  useEffect(() => {
    if (isOpen && step === 'search') {
      const t = setTimeout(() => searchRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen, step]);

  const handleClose = () => {
    onClose();
  };

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const handleSelectCustomer = (c) => {
    setSelectedCustomer(c);
    setStep('form');
    setAmount('');
    setAllocateTo('advance');
    setMode('bank');
    setReference('');
    setBankName('');
    setNotes('');
  };

  const myBookings = selectedCustomer ? (pendingBookings[selectedCustomer.name] || []) : [];

  const modeOptions = [
    { value: 'cash',   label: 'Cash' },
    { value: 'upi',    label: 'UPI' },
    { value: 'bank',   label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'card',   label: 'Card' },
  ];

  const refPlaceholder = mode === 'cheque' ? 'Cheque No.' : mode === 'card' ? 'Txn ID' : 'UTR / Txn ID';

  if (!isOpen) return null;

  const content = (
    <>
      {/* Overlay */}
      <div className="rp-overlay" onClick={handleClose} />

      {/* Modal */}
      <div className="rp-modal">

        {/* ── Header ── */}
        <div className="rp-header">
          <div className="rp-header-left">
            <div className="rp-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <span className="rp-header-title">Record Payment</span>
          </div>
          <button className="rp-close-btn" onClick={handleClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="rp-body">

          {/* ───── STEP 1: Customer Search ───── */}
          {step === 'search' && (
            <div className="rp-search-step">
              <label className="rp-field-label">SELECT CUSTOMER <span className="rp-required">*</span></label>
              <div className="rp-search-wrap">
                <svg className="rp-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  className="rp-search-input"
                  placeholder="Search by name, phone, or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Results */}
              <div className="rp-results">
                {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                  <div key={c.id} className="rp-result-row" onClick={() => handleSelectCustomer(c)}>
                    <div className="rp-result-avatar" style={{ background: c.gradient }}>{c.initials}</div>
                    <div className="rp-result-info">
                      <span className="rp-result-name">{c.name}</span>
                      <span className="rp-result-code">{c.id}</span>
                    </div>
                    <div className="rp-result-contact">
                      <span className="rp-result-phone">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {c.phone}
                      </span>
                      <span className="rp-result-email">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        {c.email}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="rp-no-results">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.25, marginBottom: 8 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <p>No customers found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ───── STEP 2: Payment Form ───── */}
          {step === 'form' && selectedCustomer && (
            <div className="rp-form-step">

              {/* Selected customer */}
              <div className="rp-customer-box">
                <div className="rp-cust-left">
                  <div className="rp-cust-avatar" style={{ background: selectedCustomer.gradient }}>{selectedCustomer.initials}</div>
                  <div className="rp-cust-info">
                    <span className="rp-cust-name">{selectedCustomer.name}</span>
                    <span className="rp-cust-phone">{selectedCustomer.phone}</span>
                  </div>
                </div>
                {!preselectedCustomer && (
                  <button className="rp-change-btn" onClick={() => { setStep('search'); setSearchQuery(''); }}>
                    Change
                  </button>
                )}
              </div>

              {/* Payment Amount */}
              <div className="rp-field">
                <label className="rp-field-label">PAYMENT AMOUNT <span className="rp-required">*</span></label>
                <div className="rp-amount-wrap">
                  <span className="rp-amount-prefix">₹</span>
                  <input
                    type="number"
                    className="rp-amount-input"
                    placeholder="0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Allocate Payment */}
              <div className="rp-field">
                <div className="rp-allocate-header">
                  <span className="rp-field-label" style={{ marginBottom: 0 }}>
                    ALLOCATE PAYMENT
                    <InfoBtn infoKey="rp_allocate" />
                  </span>
                  {amount && <span className="rp-fully-allocated">Fully Allocated</span>}
                </div>

                {/* Booking rows */}
                {myBookings.length > 0 ? myBookings.map(b => (
                  <div
                    key={b.id}
                    className={`rp-alloc-row rp-alloc-booking${allocateTo === b.id ? ' rp-alloc-selected' : ''}`}
                    onClick={() => setAllocateTo(b.id)}
                  >
                    <div className="rp-alloc-check">
                      <div className={`rp-radio${allocateTo === b.id ? ' rp-radio-on' : ''}`} />
                    </div>
                    <div className="rp-alloc-info">
                      <span className="rp-alloc-id">{b.id}</span>
                      <span className="rp-alloc-dest">{b.destination}</span>
                    </div>
                    <span className="rp-alloc-amount">{b.remaining}</span>
                  </div>
                )) : (
                  <div className="rp-no-trip">There is no trip</div>
                )}

                {/* Advance option */}
                <div
                  className={`rp-alloc-row rp-alloc-advance${allocateTo === 'advance' ? ' rp-alloc-adv-selected' : ''}`}
                  onClick={() => setAllocateTo('advance')}
                >
                  <div className="rp-adv-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <div className="rp-adv-info">
                    <span className="rp-adv-title">Advance Payment</span>
                    <span className="rp-adv-sub">
                      Will be saved as customer advance balance
                      <InfoBtn infoKey="rp_advance_balance" />
                    </span>
                  </div>
                  {amount && <span className="rp-adv-amount">₹{Number(amount).toLocaleString('en-IN')}</span>}
                </div>
              </div>

              {/* Mode */}
              <div className="rp-field">
                <label className="rp-field-label">
                  MODE <span className="rp-required">*</span>
                  <InfoBtn infoKey="rp_mode" />
                </label>
                <div className="rp-mode-select-wrap">
                  <ModeIcon mode={mode} />
                  <select className="rp-mode-select" value={mode} onChange={e => setMode(e.target.value)}>
                    {modeOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <svg className="rp-select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              {/* Date + Reference */}
              <div className="rp-row-2">
                <div className="rp-field">
                  <label className="rp-field-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    DATE
                  </label>
                  <input type="date" className="rp-input" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="rp-field">
                  <label className="rp-field-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                    REFERENCE
                    <InfoBtn infoKey="rp_reference" />
                  </label>
                  <input type="text" className="rp-input" placeholder={refPlaceholder} value={reference} onChange={e => setReference(e.target.value)} />
                </div>
              </div>

              {/* Bank Name — only for bank transfer */}
              {mode === 'bank' && (
                <div className="rp-field">
                  <label className="rp-field-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2L2 7h20L12 2z"/></svg>
                    BANK NAME
                  </label>
                  <input type="text" className="rp-input" placeholder="e.g. HDFC Bank" value={bankName} onChange={e => setBankName(e.target.value)} />
                </div>
              )}

              {/* Notes */}
              <div className="rp-field">
                <label className="rp-field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  NOTES
                </label>
                <textarea
                  className="rp-input rp-textarea"
                  placeholder="Any additional notes..."
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

            </div>
          )}
        </div>

        {/* ── Footer (form step only) ── */}
        {step === 'form' && (
          <div className="rp-footer">
            <button className="rp-record-btn" onClick={() => onSave && onSave({ amount: parseInt(amount, 10) || 0, allocateTo, mode, date, reference, bankName, notes })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Record Payment
            </button>
            <button className="rp-cancel-btn" onClick={handleClose}>Cancel</button>
          </div>
        )}
      </div>

    </>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default RecordPaymentModal;
