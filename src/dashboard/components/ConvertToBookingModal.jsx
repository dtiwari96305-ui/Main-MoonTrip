import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const parseAmount = (str) => {
  if (!str) return 0;
  return parseInt(String(str).replace(/[₹,\s]/g, ''), 10) || 0;
};

const fmtINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export const ConvertToBookingModal = ({ quote, quoteDetail, settings, customers, onAccept, onDecline }) => {
  const [editMode, setEditMode] = useState(false);

  // Editable fields — pre-fill from quote / customers list
  const existingCustomer = customers?.find(c => c.name === quote.customerName);
  const [customerName, setCustomerName] = useState(quote.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(quote.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(existingCustomer?.email || '');
  const [customerPan, setCustomerPan] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');

  // Company info from settings
  const companyName    = settings?.companyName    || 'Wanderlust Travels';
  const companyGstin   = settings?.gstin          || '';
  const companyAddress = settings?.address        || '301, Trade Center, BKC, Mumbai';
  const companyPhone   = settings?.phone          || '+91 98765 43210';
  const companyEmail   = settings?.email          || 'demo@touridoo.in';

  // Trip details from quoteDetail (if available)
  const duration      = quoteDetail?.duration         || quoteDetail?.numNights ? `${quoteDetail.numNights} Nights` : '';
  const travelers     = quoteDetail?.numTravelers      || quote.pax || 1;
  const placeOfSupply = quoteDetail?.placeOfSupply     || (quote.destType === 'domestic' ? 'India' : '—');

  // Amounts
  const travelCost  = parseAmount(quote.amount);
  const SERVICE_FEE = 200;
  const cgst        = Math.round(SERVICE_FEE * 0.09); // 18
  const sgst        = Math.round(SERVICE_FEE * 0.09); // 18
  const invoiceValue = travelCost + SERVICE_FEE + cgst + sgst;

  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleAccept = () => {
    onAccept({
      customerName,
      customerPhone,
      customerEmail,
      customerPan,
      customerGstin,
      travelCost,
      serviceFee: SERVICE_FEE,
      cgst,
      sgst,
      invoiceValue,
      travelers,
      duration,
      placeOfSupply,
    });
  };

  return ReactDOM.createPortal(
    <div className="ctb-backdrop" onClick={onDecline}>
      <div className="ctb-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ctb-header">
          <div className="ctb-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div className="ctb-header-text">
            <div className="ctb-header-title">Tax Invoice</div>
            <div className="ctb-header-sub">{quote.id}</div>
          </div>
          <div className="ctb-header-actions">
            <button
              className={`ctb-icon-btn${editMode ? ' active' : ''}`}
              onClick={() => setEditMode(v => !v)}
              title="Edit customer details"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="ctb-icon-btn" onClick={onDecline}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="ctb-body">
          {/* Company Info */}
          <div className="ctb-company-block">
            <div className="ctb-company-name">{companyName}</div>
            <div className="ctb-company-detail">
              {companyGstin && <>GSTIN: {companyGstin}<br/></>}
              {companyAddress}<br/>
              {companyPhone}{companyEmail ? ` | ${companyEmail}` : ''}
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="ctb-invoice-meta">
            <div>
              <div className="ctb-meta-label">Invoice No.</div>
              <div className="ctb-meta-value">{quote.id}</div>
            </div>
            <div>
              <div className="ctb-meta-label">Date</div>
              <div className="ctb-meta-value">{today}</div>
            </div>
          </div>

          {/* Bill To */}
          <div className="ctb-section">
            <div className="ctb-section-label">Bill To</div>
            <div className="ctb-bill-box">
              {editMode ? (
                <>
                  <div className="ctb-edit-label">Customer Name</div>
                  <input className="ctb-edit-input" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name" />
                  <div className="ctb-edit-label">Phone</div>
                  <input className="ctb-edit-input" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Phone number" />
                  <div className="ctb-edit-label">Email</div>
                  <input className="ctb-edit-input" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="Email address" />
                  <div className="ctb-edit-label">PAN</div>
                  <input className="ctb-edit-input" value={customerPan} onChange={e => setCustomerPan(e.target.value)} placeholder="PAN number" />
                  <div className="ctb-edit-label">GSTIN</div>
                  <input className="ctb-edit-input" value={customerGstin} onChange={e => setCustomerGstin(e.target.value)} placeholder="GSTIN (optional)" />
                </>
              ) : (
                <>
                  <div className="ctb-bill-name">{customerName}</div>
                  <div className="ctb-bill-row">Phone: {customerPhone}</div>
                  {customerEmail && <div className="ctb-bill-row">Email: {customerEmail}</div>}
                  <div className="ctb-edit-block">
                    <div className="ctb-edit-label">PAN</div>
                    <input className="ctb-edit-input" value={customerPan} onChange={e => setCustomerPan(e.target.value)} placeholder="Enter PAN" />
                    <div className="ctb-edit-label">GSTIN</div>
                    <input className="ctb-edit-input" value={customerGstin} onChange={e => setCustomerGstin(e.target.value)} placeholder="Enter GSTIN (optional)" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Trip Details */}
          <div className="ctb-section">
            <div className="ctb-section-label">Trip Details</div>
            <div className="ctb-trip-grid">
              <div>
                <div className="ctb-trip-item-label">Destination</div>
                <div className="ctb-trip-item-value">{quote.destName}</div>
              </div>
              <div>
                <div className="ctb-trip-item-label">Type</div>
                <div className="ctb-trip-item-value">{quote.destType}</div>
              </div>
              {duration && (
                <div>
                  <div className="ctb-trip-item-label">Duration</div>
                  <div className="ctb-trip-item-value">{duration}</div>
                </div>
              )}
              <div>
                <div className="ctb-trip-item-label">Travelers</div>
                <div className="ctb-trip-item-value">{travelers} Pax</div>
              </div>
              <div>
                <div className="ctb-trip-item-label">Place of Supply</div>
                <div className="ctb-trip-item-value">{placeOfSupply}</div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="ctb-section">
            <div className="ctb-section-label">Services</div>
            <div className="ctb-services-row">
              <span>Total Reimbursement</span>
              <span>{fmtINR(travelCost)}</span>
            </div>
          </div>

          {/* Tax Summary */}
          <div className="ctb-section">
            <div className="ctb-section-label">Tax Summary</div>
            <div className="ctb-tax-box">
              <div className="ctb-tax-row">
                <span className="ctb-tax-label">Cost of Travel (Reimbursement) <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>
                <span className="ctb-tax-value">{fmtINR(travelCost)}</span>
              </div>
              <div className="ctb-tax-row">
                <span className="ctb-tax-label">
                  <strong>Processing / Service Charge</strong>
                  <span className="ctb-tax-sac"> SAC: 998551</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </span>
                <span className="ctb-tax-value"><strong>{fmtINR(SERVICE_FEE)}</strong></span>
              </div>
              <div className="ctb-tax-row">
                <span className="ctb-tax-label">CGST @9% (on service charge)</span>
                <span className="ctb-tax-value">{fmtINR(cgst)}</span>
              </div>
              <div className="ctb-tax-row">
                <span className="ctb-tax-label">SGST @9% (on service charge)</span>
                <span className="ctb-tax-value">{fmtINR(sgst)}</span>
              </div>
              <div className="ctb-invoice-value-row">
                <span className="ctb-invoice-value-label">Invoice Value</span>
                <span className="ctb-invoice-value-num">{fmtINR(invoiceValue)}</span>
              </div>
            </div>
            <div className="ctb-total-payable-row">
              <span className="ctb-total-payable-label">Total Payable</span>
              <span className="ctb-total-payable-value">{fmtINR(invoiceValue)}</span>
            </div>
          </div>

          <div className="ctb-footer-note">
            Under Pure Agent model, GST is applicable only on the processing/service charge. Travel costs are reimbursements collected on behalf of the customer.
          </div>
        </div>

        {/* Action buttons */}
        <div className="ctb-actions">
          <button className="ctb-btn-convert" onClick={handleAccept}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Accept &amp; Convert
          </button>
          <button className="ctb-btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
          <button className="ctb-btn-outline ctb-btn-decline" onClick={onDecline}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Decline
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
