import React, { useState, useMemo, useRef } from 'react';
import { AddVendorModal } from '../../components/vendor/AddVendorModal';
import { ServiceTypeToggle, ServiceDetailForm, SERVICE_TYPE_LABELS } from '../../components/vendor/ServiceDetailsForm';
import { AdjustmentsSection } from '../../components/vendor/AdjustmentsSection';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const EMPTY_FORM = {
  vendorId: '',
  bookingId: '',
  serviceType: 'flight',
  serviceDate: '',
  invoiceNumber: '',
  invoiceDate: '',
  serviceDetails: {},
  grossAmount: '',
  commissionAmount: '',
  tdsReceivable: '',
  processingFee: '',
  vendorGstCgst: '',
  vendorGstSgst: '',
  roundOff: '',
  netPayable: 0,
  notes: '',
};

/* ── Light-mode dropdown style overrides ── */
const LD_PANEL = { background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' };
const LD_SEARCH = { background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#111827' };

export const CreateVendorBill = ({ vendors, bookings, addVendor, addVendorBill, prefilledVendorId, onBack, onSuccess }) => {
  const [form, setForm] = useState({ ...EMPTY_FORM, vendorId: prefilledVendorId || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [vendorSearch, setVendorSearch] = useState('');
  const [showVendorDrop, setShowVendorDrop] = useState(false);
  const [bookingSearch, setBookingSearch] = useState('');
  const [showBookingDrop, setShowBookingDrop] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const netPayable = useMemo(() => {
    const g = Number(form.grossAmount) || 0;
    const c = Number(form.commissionAmount) || 0;
    const t = Number(form.tdsReceivable) || 0;
    const pf = Number(form.processingFee) || 0;
    const cgst = Number(form.vendorGstCgst) || 0;
    const sgst = Number(form.vendorGstSgst) || 0;
    const ro = Number(form.roundOff) || 0;
    return g - c - t + pf + cgst + sgst + ro;
  }, [form]);

  const selectedVendor = vendors.find(v => v.id === form.vendorId);
  const selectedBooking = bookings.find(b => b.uuid === form.bookingId || b.id === form.bookingId);

  const filteredVendors = useMemo(() => {
    const q = vendorSearch.toLowerCase();
    return vendors.filter(v => v.name.toLowerCase().includes(q));
  }, [vendors, vendorSearch]);

  const filteredBookings = useMemo(() => {
    const q = bookingSearch.toLowerCase();
    return bookings.filter(b =>
      (b.id || '').toLowerCase().includes(q) ||
      (b.customerName || '').toLowerCase().includes(q) ||
      (b.destination || '').toLowerCase().includes(q)
    );
  }, [bookings, bookingSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vendorId) { setError('Please select a vendor.'); return; }
    if (!form.grossAmount || Number(form.grossAmount) <= 0) { setError('Gross amount must be greater than 0.'); return; }
    setSaving(true);
    setError('');
    try {
      await addVendorBill({ ...form, netPayable });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create bill.');
      setSaving(false);
    }
  };

  const serviceLabel = SERVICE_TYPE_LABELS[form.serviceType] || 'Service';

  return (
    <div className="page-content cvb-form">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <div className="page-header" style={{ marginTop: 16 }}>
        <div>
          <h1 className="page-title">New Vendor Bill</h1>
          <p className="page-subtitle">Record a service bill from a vendor</p>
        </div>
      </div>

      {error && <div className="form-error-banner" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Section 1: BOOKING & VENDOR ── */}
          <div className="form-section">
            <div className="form-section-title">Booking &amp; Vendor</div>

            {/* Booking — full width */}
            <div className="form-group" style={{ position: 'relative', marginBottom: 16 }}>
              <label className="form-label">Booking</label>
              <div
                className="form-input"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => { setShowBookingDrop(d => !d); setBookingSearch(''); setShowVendorDrop(false); }}
              >
                <span style={{ color: selectedBooking ? 'var(--text-primary)' : '#9ca3af' }}>
                  {selectedBooking ? `${selectedBooking.id} — ${selectedBooking.customerName}` : 'Select booking…'}
                </span>
                {form.bookingId
                  ? <button type="button" style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); set('bookingId', ''); }}>✕</button>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                }
              </div>
              {showBookingDrop && (
                <div className="dropdown-panel" style={LD_PANEL}>
                  <input
                    className="dropdown-search"
                    style={LD_SEARCH}
                    placeholder="Search bookings…"
                    value={bookingSearch}
                    onChange={e => setBookingSearch(e.target.value)}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                  />
                  <div className="dropdown-list">
                    {filteredBookings.map(b => (
                      <div key={b.uuid || b.id} className="dropdown-item" style={{ color: '#374151' }} onClick={() => { set('bookingId', b.uuid || b.id); setShowBookingDrop(false); }}>
                        <div style={{ fontWeight: 500 }}>{b.id}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{b.customerName} · {b.destination}</div>
                      </div>
                    ))}
                    {filteredBookings.length === 0 && <div style={{ padding: '10px 14px', color: '#6b7280', fontSize: 13 }}>No bookings found.</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Vendor — full width */}
            <div className="form-group" style={{ position: 'relative', marginBottom: 16 }}>
              <label className="form-label">Vendor *</label>
              <div
                className="form-input"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => { setShowVendorDrop(d => !d); setVendorSearch(''); setShowBookingDrop(false); }}
              >
                <span style={{ color: selectedVendor ? 'var(--text-primary)' : '#9ca3af' }}>
                  {selectedVendor ? selectedVendor.name : 'Select vendor…'}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              {showVendorDrop && (
                <div className="dropdown-panel" style={LD_PANEL}>
                  <input
                    className="dropdown-search"
                    style={LD_SEARCH}
                    placeholder="Search vendors…"
                    value={vendorSearch}
                    onChange={e => setVendorSearch(e.target.value)}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                  />
                  <div className="dropdown-list">
                    {filteredVendors.map(v => (
                      <div key={v.id} className="dropdown-item" style={{ color: '#374151' }} onClick={() => { set('vendorId', v.id); setShowVendorDrop(false); }}>
                        <div style={{ fontWeight: 500 }}>{v.name}</div>
                        {v.contactPerson && <div style={{ fontSize: 12, color: '#6b7280' }}>{v.contactPerson}</div>}
                      </div>
                    ))}
                    <div
                      className="dropdown-item dropdown-add"
                      onClick={() => { setShowVendorDrop(false); setShowAddVendor(true); }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add new vendor…
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Service Type */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Service Type</label>
              <ServiceTypeToggle value={form.serviceType} onChange={v => { set('serviceType', v); set('serviceDetails', {}); }} />
            </div>
          </div>

          {/* ── Section 2: INVOICE DETAILS ── */}
          <div className="form-section">
            <div className="form-section-title">Invoice Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Invoice / Bill #</label>
                <input
                  className="form-input"
                  value={form.invoiceNumber}
                  onChange={e => set('invoiceNumber', e.target.value)}
                  placeholder="INV-001"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Invoice Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.invoiceDate || form.serviceDate}
                  onChange={e => { set('invoiceDate', e.target.value); set('serviceDate', e.target.value); }}
                />
              </div>
            </div>

            {/* File upload */}
            <div>
              <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Attachment</label>
              <div
                className="cvb-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                  {attachmentFile ? attachmentFile.name : 'Click to upload invoice PDF or image'}
                </span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>PDF, JPG, PNG up to 10 MB</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={e => setAttachmentFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* ── Section 3: SERVICE DETAILS (dynamic heading) ── */}
          <div className="form-section">
            <div className="form-section-title">{serviceLabel} Details</div>
            <ServiceDetailForm
              serviceType={form.serviceType}
              data={form.serviceDetails}
              onChange={v => set('serviceDetails', v)}
            />
          </div>

          {/* ── Section 4: ADJUSTMENTS ── */}
          <div className="form-section">
            <div className="form-section-title">Adjustments</div>
            <AdjustmentsSection
              form={form}
              onChange={(updated) => setForm(f => ({ ...f, ...updated }))}
            />
          </div>

          {/* ── Section 5: NOTES ── */}
          <div className="form-section">
            <div className="form-section-title">Notes</div>
            <textarea
              className="form-input"
              style={{ minHeight: 100, resize: 'vertical' }}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Internal notes about this bill…"
            />
          </div>

          {/* ── Actions ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingBottom: 32 }}>
            <button type="button" className="btn-secondary" onClick={onBack}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {saving ? 'Saving…' : `Save Vendor Bill · ${fmt(netPayable)}`}
            </button>
          </div>
        </div>
      </form>

      {showAddVendor && (
        <AddVendorModal
          onSave={addVendor}
          onClose={(result) => {
            setShowAddVendor(false);
            if (result) set('vendorId', result.id);
          }}
        />
      )}
    </div>
  );
};
