import { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { blockNonNumericKeys } from '../../utils/inputHelpers';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

const ModeIcon = ({ mode }) => {
  if (mode === 'cash') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>
  );
  if (mode === 'upi') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
  );
  if (mode === 'bank_transfer') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2L2 7h20L12 2z"/></svg>
  );
  if (mode === 'cheque') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  );
  return null;
};

export const VendorPaymentModal = ({ bill, vendor, vendors = [], vendorBills = [], onSave, onClose, mode = 'demo' }) => {
  const [selectedVendorId, setSelectedVendorId] = useState(vendor?.id || bill?.vendorId || '');
  const [selectedBillId, setSelectedBillId] = useState(bill?.id || '');
  const [form, setForm] = useState({
    amount: bill ? String(bill.netPayable) : '',
    paymentMode: 'bank_transfer',
    paymentDate: new Date().toISOString().slice(0, 10),
    reference: '',
    bankName: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [demoNotice, setDemoNotice] = useState(false);
  const [vendorSearch, setVendorSearch] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Determine if we need vendor/bill selectors
  const needsVendorSelect = !vendor && !bill;
  const resolvedVendor = vendor || vendors.find(v => v.id === selectedVendorId);

  // Bills for the selected vendor (only unpaid/partial)
  const availableBills = useMemo(() => {
    if (!selectedVendorId) return [];
    return vendorBills.filter(b => b.vendorId === selectedVendorId && b.status !== 'paid');
  }, [vendorBills, selectedVendorId]);

  const resolvedBill = bill || vendorBills.find(b => b.id === selectedBillId);

  const filteredVendors = useMemo(() => {
    if (!vendorSearch) return vendors;
    const q = vendorSearch.toLowerCase();
    return vendors.filter(v => v.name.toLowerCase().includes(q));
  }, [vendors, vendorSearch]);

  const handleSave = async (e) => {
    e.preventDefault();
    const vendorId = vendor?.id || bill?.vendorId || selectedVendorId;
    if (!vendorId) { setError('Please select a vendor.'); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError('Enter a valid amount.'); return; }
    if (mode === 'demo') { setDemoNotice(true); return; }
    setSaving(true);
    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
        vendorId,
        billId: bill?.id || selectedBillId || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record payment.');
      setSaving(false);
    }
  };

  const content = (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 480 }}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h2 className="modal-title">Record Vendor Payment</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Demo notice */}
        {demoNotice && (
          <div className="modal-demo-notice">
            This is a demo account. Changes cannot be made.
          </div>
        )}

        {/* Body */}
        <div className="modal-body">
          {/* Bill info — show when bill is pre-selected */}
          {bill && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
              padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#374151',
            }}>
              Bill <strong style={{ color: '#111827' }}>{bill.billNumber}</strong>
              {' · '}{vendor?.name || bill.vendorName}
              {' · '}Net Payable: <strong style={{ color: '#16a34a' }}>{fmt(bill.netPayable)}</strong>
            </div>
          )}

          {error && !demoNotice && (
            <div className="form-error-banner" style={{ marginBottom: 14 }}>{error}</div>
          )}

          <form id="vendor-payment-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Vendor selector — only when no vendor/bill pre-selected */}
            {needsVendorSelect && (
              <div className="rp-field">
                <label className="rp-field-label">VENDOR <span className="rp-required">*</span></label>
                <input
                  className="rp-input"
                  placeholder="Search vendor..."
                  value={selectedVendorId ? (resolvedVendor?.name || '') : vendorSearch}
                  onChange={e => { setVendorSearch(e.target.value); setSelectedVendorId(''); setSelectedBillId(''); }}
                  onFocus={() => setVendorSearch('')}
                />
                {vendorSearch && !selectedVendorId && (
                  <div style={{
                    position: 'absolute', zIndex: 20, left: 0, right: 0, marginTop: 2,
                    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto',
                  }}>
                    {filteredVendors.length === 0 ? (
                      <div style={{ padding: 12, color: '#9ca3af', fontSize: 13 }}>No vendors found</div>
                    ) : filteredVendors.map(v => (
                      <div
                        key={v.id}
                        style={{ padding: '8px 14px', cursor: 'pointer', fontSize: 13, color: '#374151' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        onClick={() => { setSelectedVendorId(v.id); setVendorSearch(''); setSelectedBillId(''); }}
                      >
                        <div style={{ fontWeight: 500 }}>{v.name}</div>
                        {v.city && <div style={{ fontSize: 11, color: '#9ca3af' }}>{v.city}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bill selector — when vendor is selected but no bill pre-selected */}
            {needsVendorSelect && selectedVendorId && availableBills.length > 0 && (
              <div className="rp-field">
                <label className="rp-field-label">AGAINST BILL (optional)</label>
                <select
                  className="rp-input"
                  value={selectedBillId}
                  onChange={e => {
                    setSelectedBillId(e.target.value);
                    if (e.target.value) {
                      const b = vendorBills.find(b => b.id === e.target.value);
                      if (b) set('amount', String(b.netPayable - (b.amountPaid || 0)));
                    }
                  }}
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="">General payment (no bill)</option>
                  {availableBills.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.billNumber} — {b.serviceType} — Remaining: {fmt(b.netPayable - (b.amountPaid || 0))}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Outstanding helper */}
            {resolvedBill && !bill && (
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8,
                padding: '8px 12px', marginBottom: 8, fontSize: 12, color: '#1e40af',
              }}>
                Outstanding: <strong>{fmt(resolvedBill.netPayable - (resolvedBill.amountPaid || 0))}</strong>
              </div>
            )}

            <div className="rp-field">
              <label className="rp-field-label">PAYMENT AMOUNT <span className="rp-required">*</span></label>
              <div className="rp-amount-wrap">
                <span className="rp-amount-prefix">₹</span>
                <input
                  type="number" className="rp-amount-input" placeholder="0"
                  min="1" value={form.amount}
                  onChange={e => set('amount', e.target.value)}
                  onKeyDown={blockNonNumericKeys}
                  autoFocus={!needsVendorSelect}
                />
              </div>
            </div>

            <div className="rp-field">
              <label className="rp-field-label">
                MODE <span className="rp-required">*</span>
              </label>
              <div className="rp-mode-select-wrap">
                <ModeIcon mode={form.paymentMode} />
                <select className="rp-mode-select" value={form.paymentMode} onChange={e => set('paymentMode', e.target.value)}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                </select>
                <svg className="rp-select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div className="rp-row-2">
              <div className="rp-field">
                <label className="rp-field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  DATE
                </label>
                <input type="date" className="rp-input" value={form.paymentDate} onChange={e => set('paymentDate', e.target.value)} />
              </div>
              <div className="rp-field">
                <label className="rp-field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                  REFERENCE / UTR
                </label>
                <input type="text" className="rp-input" placeholder="NEFT/UTR/Cheque No." value={form.reference} onChange={e => set('reference', e.target.value)} />
              </div>
            </div>

            {form.paymentMode === 'bank_transfer' && (
              <div className="rp-field">
                <label className="rp-field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2L2 7h20L12 2z"/></svg>
                  BANK NAME
                </label>
                <input type="text" className="rp-input" placeholder="e.g. HDFC Bank" value={form.bankName} onChange={e => set('bankName', e.target.value)} />
              </div>
            )}

            <div className="rp-field">
              <label className="rp-field-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                NOTES
              </label>
              <textarea className="rp-input rp-textarea" placeholder="Any additional notes..." rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="rp-cancel-btn" type="button" onClick={onClose}>Cancel</button>
          <button className="rp-record-btn" type="submit" form="vendor-payment-form" disabled={saving}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {saving ? 'Saving…' : 'Record Payment'}
          </button>
        </div>

      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};
