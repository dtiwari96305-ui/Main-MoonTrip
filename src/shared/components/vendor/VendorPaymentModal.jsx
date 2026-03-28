import React, { useState } from 'react';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const VendorPaymentModal = ({ bill, vendor, onSave, onClose }) => {
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

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) { setError('Enter a valid amount.'); return; }
    setSaving(true);
    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
        vendorId: vendor?.id || bill?.vendorId,
        billId: bill?.id || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record payment.');
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h2 className="modal-title">Record Vendor Payment</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {bill && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#9ca3af' }}>
            Bill <strong style={{ color: '#e8eaed' }}>{bill.billNumber}</strong>
            {' · '}{vendor?.name || bill.vendorName}
            {' · '}Net Payable: <strong style={{ color: '#4ade80' }}>{fmt(bill.netPayable)}</strong>
          </div>
        )}

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input className="form-input" type="number" min="1" value={form.amount} onChange={e => set('amount', e.target.value)} autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Date *</label>
              <input className="form-input" type="date" value={form.paymentDate} onChange={e => set('paymentDate', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Payment Mode</label>
            <select className="form-input" value={form.paymentMode} onChange={e => set('paymentMode', e.target.value)}>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Reference / UTR</label>
              <input className="form-input" value={form.reference} onChange={e => set('reference', e.target.value)} placeholder="NEFT/UTR/Cheque No." />
            </div>
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input className="form-input" value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="HDFC Bank" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <input className="form-input" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional" />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
