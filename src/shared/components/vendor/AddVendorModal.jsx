import React, { useState } from 'react';

export const AddVendorModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    name: '', vendorCode: '', city: '', contactPerson: '', phone: '', email: '',
    gstNumber: '', panNumber: '', bankName: '', bankAccount: '', ifscCode: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Vendor name is required.'); return; }
    setSaving(true);
    try {
      const result = await onSave(form);
      onClose(result);
    } catch (err) {
      setError(err.message || 'Failed to save vendor.');
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose(null)}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Vendor</h2>
          <button className="modal-close-btn" onClick={() => onClose(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Vendor Name *</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. IndiGo Airlines" autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Vendor Code</label>
              <input className="form-input" value={form.vendorCode} onChange={e => set('vendorCode', e.target.value)} placeholder="e.g. VND-0001" />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Mumbai" />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input className="form-input" value={form.contactPerson} onChange={e => set('contactPerson', e.target.value)} placeholder="Name" />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98800 00000" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="vendor@example.com" />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input className="form-input" value={form.gstNumber} onChange={e => set('gstNumber', e.target.value)} placeholder="27AABCD1234E1Z5" />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input className="form-input" value={form.panNumber} onChange={e => set('panNumber', e.target.value)} placeholder="AABCD1234E" />
            </div>
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input className="form-input" value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="HDFC Bank" />
            </div>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input className="form-input" value={form.bankAccount} onChange={e => set('bankAccount', e.target.value)} placeholder="50200012345678" />
            </div>
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input className="form-input" value={form.ifscCode} onChange={e => set('ifscCode', e.target.value)} placeholder="HDFC0000001" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes about this vendor" />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => onClose(null)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
