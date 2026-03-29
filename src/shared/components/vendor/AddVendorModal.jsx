import { useState } from 'react';
import ReactDOM from 'react-dom';

export const AddVendorModal = ({ onSave, onClose, mode = 'demo' }) => {
  const [form, setForm] = useState({
    name: '', vendorCode: '', city: '', contactPerson: '', phone: '', email: '',
    gstNumber: '', panNumber: '', bankName: '', bankAccount: '', ifscCode: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [demoNotice, setDemoNotice] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Vendor name is required.'); return; }
    if (mode === 'demo') { setDemoNotice(true); return; }
    setSaving(true);
    try {
      const result = await onSave(form);
      onClose(result);
    } catch (err) {
      setError(err.message || 'Failed to save vendor.');
      setSaving(false);
    }
  };

  const content = (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose(null)}>
      <div className="modal-box" style={{ maxWidth: 520 }}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <h2 className="modal-title">Add New Vendor</h2>
          </div>
          <button className="modal-close-btn" onClick={() => onClose(null)}>
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
          {error && !demoNotice && (
            <div className="form-error-banner" style={{ marginBottom: 14 }}>{error}</div>
          )}

          <form id="add-vendor-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="rp-row-2">
              <div className="rp-field">
                <label className="rp-field-label">VENDOR NAME <span className="rp-required">*</span></label>
                <input className="rp-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. IndiGo Airlines" autoFocus />
              </div>
              <div className="rp-field">
                <label className="rp-field-label">VENDOR CODE</label>
                <input className="rp-input" value={form.vendorCode} onChange={e => set('vendorCode', e.target.value)} placeholder="e.g. VND-0001" />
              </div>
            </div>

            <div className="rp-row-2">
              <div className="rp-field">
                <label className="rp-field-label">CITY</label>
                <input className="rp-input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Mumbai" />
              </div>
              <div className="rp-field">
                <label className="rp-field-label">CONTACT PERSON</label>
                <input className="rp-input" value={form.contactPerson} onChange={e => set('contactPerson', e.target.value)} placeholder="Name" />
              </div>
            </div>

            <div className="rp-row-2">
              <div className="rp-field">
                <label className="rp-field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  PHONE
                </label>
                <input className="rp-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98800 00000" />
              </div>
              <div className="rp-field">
                <label className="rp-field-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  EMAIL
                </label>
                <input className="rp-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="vendor@example.com" />
              </div>
            </div>

            <div className="rp-row-2">
              <div className="rp-field">
                <label className="rp-field-label">GST NUMBER</label>
                <input className="rp-input" value={form.gstNumber} onChange={e => set('gstNumber', e.target.value)} placeholder="27AABCD1234E1Z5" />
              </div>
              <div className="rp-field">
                <label className="rp-field-label">PAN NUMBER</label>
                <input className="rp-input" value={form.panNumber} onChange={e => set('panNumber', e.target.value)} placeholder="AABCD1234E" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 0 }}>
              <div className="rp-field">
                <label className="rp-field-label">BANK NAME</label>
                <input className="rp-input" value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="HDFC Bank" />
              </div>
              <div className="rp-field">
                <label className="rp-field-label">ACCOUNT NUMBER</label>
                <input className="rp-input" value={form.bankAccount} onChange={e => set('bankAccount', e.target.value)} placeholder="50200012345678" />
              </div>
              <div className="rp-field">
                <label className="rp-field-label">IFSC CODE</label>
                <input className="rp-input" value={form.ifscCode} onChange={e => set('ifscCode', e.target.value)} placeholder="HDFC0000001" />
              </div>
            </div>

            <div className="rp-field">
              <label className="rp-field-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                NOTES
              </label>
              <textarea className="rp-input rp-textarea" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes about this vendor" />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="rp-cancel-btn" type="button" onClick={() => onClose(null)}>Cancel</button>
          <button className="rp-record-btn" type="submit" form="add-vendor-form" disabled={saving}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {saving ? 'Saving…' : 'Add Vendor'}
          </button>
        </div>

      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};
