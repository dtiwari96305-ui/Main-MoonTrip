import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { InfoBtn } from '../../shared/components/InfoBtn';

const WarnIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const ModalHeader = ({ title, subtitle, showBack, onBack, onClose }) => (
  <div className="cbm-header">
    {showBack ? (
      <button type="button" className="cbm-nav-btn" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
    ) : <div style={{ width: 32 }} />}
    <div className="cbm-hdr-icon"><WarnIcon size={16} /></div>
    <div className="cbm-hdr-text">
      <div className="cbm-hdr-title">{title}</div>
      {subtitle && <div className="cbm-hdr-sub">{subtitle}</div>}
    </div>
    <button type="button" className="cbm-nav-btn" onClick={onClose}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
);

export const CancelBookingModal = ({ booking, invoices, onClose, onCancelNote, onVoid }) => {
  const [view, setView] = useState('init');
  const [voidExpanded, setVoidExpanded] = useState(false);
  const [reason, setReason] = useState('');
  const [refundPF, setRefundPF] = useState(true);
  const [actualCharges, setActualCharges] = useState('');
  const [custCharges, setCustCharges] = useState('');
  const [handlingFee, setHandlingFee] = useState(false);

  if (!booking) return null;

  const parseRs = (s) => Math.round(parseFloat((s || '0').replace(/[₹,\s]/g, '')) || 0);
  const fmtRs = (n) => '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN');

  const invoice = (invoices || []).find(inv => inv.bookingId === booking.id);
  const totalAmt   = parseRs(booking.amount);
  const remaining  = parseRs(booking.remaining);
  const amtPaid    = totalAmt - remaining;
  const invoiceNo  = invoice?.id || booking.id;
  const travelCost = invoice?.travelCost || 0;
  const serviceFee = invoice?.serviceFee || 0;
  const gst        = (invoice?.cgst || 0) + (invoice?.sgst || 0);
  const destLabel  = `${booking.destination} (${booking.destType === 'international' ? 'International' : 'Domestic'})`;

  const custChargesNum  = parseFloat(custCharges)  || 0;
  const actualChargesNum = parseFloat(actualCharges) || 0;
  const grossCN       = totalAmt - custChargesNum;
  const netReceivable = grossCN;
  const stillOwed     = Math.max(0, custChargesNum - amtPaid);
  const netProfit     = custChargesNum - actualChargesNum;

  // ─── VIEW: Init ───────────────────────────────────────────────
  if (view === 'init') return ReactDOM.createPortal(
    <>
      <div className="cbm-overlay" onClick={onClose} />
      <div className="cbm-modal">
        <ModalHeader title="Cancel Booking" subtitle={invoiceNo} onClose={onClose} />
        <div className="cbm-body">
          <div className="cbm-info-card">
            <div className="cbm-info-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{destLabel}</span>
            </div>
            <div className="cbm-info-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{booking.customerName}</span>
            </div>
            <div className="cbm-divider" />
            <div className="cbm-line-item"><span>Cost of Travel</span><span>{fmtRs(travelCost)}</span></div>
            <div className="cbm-line-item"><span>Processing Fee</span><span>{fmtRs(serviceFee)}</span></div>
            <div className="cbm-line-item"><span>GST</span><span>{fmtRs(gst)}</span></div>
            <div className="cbm-divider" />
            <div className="cbm-line-item cbm-line-total"><span>TOTAL</span><span>{fmtRs(totalAmt)}</span></div>
          </div>
          <div className="cbm-paid-row">
            <span className="cbm-paid-label">AMOUNT PAID</span>
            <span className="cbm-paid-value">{fmtRs(amtPaid)}</span>
          </div>
          <div className="cbm-reason-wrap">
            <label className="cbm-reason-lbl">CANCELLATION REASON <span className="cbm-optional">(OPTIONAL)</span></label>
            <textarea
              className="cbm-reason-ta"
              placeholder="e.g., Customer requested cancellation, change of plans..."
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
        </div>
        <div className="cbm-footer">
          <button type="button" className="cbm-btn-ghost" onClick={onClose}>Keep Booking</button>
          <button type="button" className="cbm-btn-orange" onClick={() => setView('choose')}>
            Proceed Cancellation <ArrowRight />
          </button>
        </div>
      </div>
    </>,
    document.body
  );

  // ─── VIEW: Choose Action ──────────────────────────────────────
  if (view === 'choose') return ReactDOM.createPortal(
    <>
      <div className="cbm-overlay" onClick={onClose} />
      <div className="cbm-modal">
        <ModalHeader title="Choose Action" subtitle="How would you like to cancel?" showBack onBack={() => { setView('init'); setVoidExpanded(false); }} onClose={onClose} />
        <div className="cbm-body">
          {/* Void Invoice card */}
          <div
            className={`cbm-option-card${voidExpanded ? ' cbm-option-void-open' : ''}`}
            onClick={() => !voidExpanded && setVoidExpanded(true)}
            style={{ cursor: voidExpanded ? 'default' : 'pointer' }}
          >
            <div className="cbm-option-row">
              <div className="cbm-opt-icon cbm-opt-icon-red">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              </div>
              <div className="cbm-opt-text">
                <div className="cbm-opt-title">Void Invoice</div>
                <div className="cbm-opt-desc">Cancel and permanently delete this invoice from your records</div>
              </div>
              <div className="cbm-opt-arrow">
                {voidExpanded
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                }
              </div>
            </div>
            {voidExpanded && (
              <div className="cbm-void-warn-box" onClick={e => e.stopPropagation()}>
                <div className="cbm-void-warn-hdr">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  BEFORE YOU VOID
                </div>
                <ul className="cbm-void-bullets">
                  <li>The processing fee of <strong>{fmtRs(serviceFee)}</strong> will be permanently deleted — no Credit Note, no recovery from customer</li>
                  <li>Any cancellation charges you incurred will not be recoverable from the customer</li>
                  <li>You cannot charge a cancellation handling fee</li>
                  <li><strong>This action cannot be undone</strong></li>
                </ul>
                <div className="cbm-void-warn-btns">
                  <button type="button" className="cbm-btn-outline" onClick={() => setVoidExpanded(false)}>Go Back</button>
                  <button type="button" className="cbm-btn-red" onClick={() => setView('void')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    Proceed to Void
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Issue Cancellation Note card */}
          <div className="cbm-option-card" style={{ cursor: 'pointer' }} onClick={() => setView('details')}>
            <div className="cbm-option-row">
              <div className="cbm-opt-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <div className="cbm-opt-text">
                <div className="cbm-opt-title">Issue Cancellation Note</div>
                <div className="cbm-opt-desc">Keep the invoice, issue a Cancellation Note to the customer</div>
              </div>
              <div className="cbm-opt-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          </div>
        </div>
        <div className="cbm-footer cbm-footer-center">
          <button type="button" className="cbm-btn-ghost" onClick={onClose}>Keep Booking</button>
        </div>
      </div>
    </>,
    document.body
  );

  // ─── VIEW: Cancellation Details ───────────────────────────────
  if (view === 'details') return ReactDOM.createPortal(
    <>
      <div className="cbm-overlay" onClick={onClose} />
      <div className="cbm-modal">
        <ModalHeader title="Cancellation Details" subtitle="Enter cancellation details" showBack onBack={() => setView('choose')} onClose={onClose} />
        <div className="cbm-body cbm-body-scroll">
          {/* Section 1 */}
          <div className="cbm-section">
            <div className="cbm-sec-hdr">
              <span className="cbm-sec-num">1</span>
              <span className="cbm-sec-title">ORIGINAL PROCESSING FEE</span>
            </div>
            <div className="cbm-field-lbl">REFUND PROCESSING FEE?</div>
            <div className="cbm-toggle-pair">
              <button type="button" className={`cbm-tog-btn${refundPF ? ' cbm-tog-yes' : ''}`} onClick={() => setRefundPF(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Yes, Refund
              </button>
              <button type="button" className={`cbm-tog-btn${!refundPF ? ' cbm-tog-no' : ''}`} onClick={() => setRefundPF(false)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                No, Keep
              </button>
            </div>
            <div className={`cbm-pf-card${refundPF ? ' cbm-pf-green' : ' cbm-pf-grey'}`}>
              <div className="cbm-pf-label">PROCESSING FEE FROM ORIGINAL BOOKING</div>
              <div className="cbm-pf-amt">{fmtRs(serviceFee)}</div>
              <div className="cbm-pf-note">{refundPF ? 'Will be refunded via a separate Credit Note' : 'Will be retained as your non-refundable revenue'}</div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="cbm-section">
            <div className="cbm-sec-hdr">
              <span className="cbm-sec-num">2</span>
              <span className="cbm-sec-title">CANCELLATION CHARGES</span>
            </div>
            <div className="cbm-field-lbl">
              ACTUAL CANCELLATION CHARGES (YOU INCURRED) <InfoBtn infoKey="cbm_actual_charges" />
            </div>
            <div className="cbm-rs-wrap">
              <span className="cbm-rs-sym">₹</span>
              <input type="number" className="cbm-rs-in" placeholder="0" value={actualCharges} onChange={e => setActualCharges(e.target.value)} />
            </div>
            <div className="cbm-helper-pill">internal only — never shown to customer</div>
            <div className="cbm-field-lbl" style={{ marginTop: 16 }}>
              CUSTOMER CANCELLATION CHARGE <InfoBtn infoKey="cbm_customer_charges" />
            </div>
            <div className="cbm-rs-wrap">
              <span className="cbm-rs-sym">₹</span>
              <input type="number" className="cbm-rs-in" placeholder="0" value={custCharges} onChange={e => setCustCharges(e.target.value)} />
            </div>
            <div className="cbm-helper-text">to be shown to customer as non-refundable charges that you had to incur</div>
          </div>

          {/* Section 3 */}
          <div className="cbm-section">
            <div className="cbm-sec-hdr">
              <span className="cbm-sec-num">3</span>
              <span className="cbm-sec-title">HANDLING FEE <InfoBtn infoKey="cbm_handling_fee" /></span>
            </div>
            <div className="cbm-field-lbl">CHARGE HANDLING FEE?</div>
            <div className="cbm-toggle-pair">
              <button type="button" className={`cbm-tog-btn${handlingFee ? ' cbm-tog-yes' : ''}`} onClick={() => setHandlingFee(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Yes
              </button>
              <button type="button" className={`cbm-tog-btn${!handlingFee ? ' cbm-tog-no' : ''}`} onClick={() => setHandlingFee(false)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                No
              </button>
            </div>
          </div>
        </div>
        <div className="cbm-footer">
          <button type="button" className="cbm-btn-ghost" onClick={onClose}>Keep Booking</button>
          <button type="button" className="cbm-btn-orange" onClick={() => setView('preview')}>
            Preview Cancellation Note <ArrowRight />
          </button>
        </div>
      </div>
    </>,
    document.body
  );

  // ─── VIEW: Cancellation Note Preview ─────────────────────────
  if (view === 'preview') return ReactDOM.createPortal(
    <>
      <div className="cbm-overlay" onClick={onClose} />
      <div className="cbm-modal">
        <ModalHeader title="Cancellation Note Preview" subtitle="Review before confirming" showBack onBack={() => setView('details')} onClose={onClose} />
        <div className="cbm-body cbm-body-scroll">
          {/* Preview card */}
          <div className="cbm-preview-card">
            <div className="cbm-preview-hdr">CANCELLATION NOTE PREVIEW</div>
            <div className="cbm-preview-row"><span>Original Invoice Amount</span><span>{fmtRs(totalAmt)}</span></div>
            <div className="cbm-preview-row cbm-preview-neg"><span>Less: Non-refundable charges</span><span>-{fmtRs(custChargesNum)}</span></div>
            <div className="cbm-preview-row"><span>Gross Cancellation Note</span><span>{fmtRs(grossCN)}</span></div>
            <div className="cbm-preview-row cbm-preview-bold"><span>Net Receivable (CN)</span><span>{fmtRs(netReceivable)}</span></div>
            <div className="cbm-divider" />
            <div className="cbm-preview-row"><span>Amount Paid by Customer</span><span>{fmtRs(amtPaid)}</span></div>
            {stillOwed > 0 && (
              <div className="cbm-preview-row cbm-preview-owed"><span>Amount Still Owed</span><span>{fmtRs(stillOwed)}</span></div>
            )}
          </div>

          {/* Still owes warning */}
          {stillOwed > 0 && (
            <div className="cbm-owes-card">
              <div className="cbm-owes-hdr">
                <WarnIcon size={14} />
                Customer still owes {fmtRs(stillOwed)}
              </div>
              <div className="cbm-owes-desc">
                The customer has only paid {fmtRs(amtPaid)} of the {fmtRs(totalAmt)} invoice. After cancellation charges of {fmtRs(custChargesNum)}, they still owe {fmtRs(stillOwed)}. This will be shown as pending on the booking.
              </div>
            </div>
          )}

          {/* Agent P&L */}
          <div className="cbm-agent-card">
            <div className="cbm-agent-hdr">
              <span>AGENT PROFIT / LOSS BREAKDOWN</span>
              <span className="cbm-agent-badge">not shown to customer</span>
            </div>
            <div className="cbm-preview-row cbm-preview-bold" style={{ paddingTop: 12 }}>
              <span>Net Profit / Loss</span>
              <span>{fmtRs(netProfit)}</span>
            </div>
          </div>

          {/* Documents */}
          <div className="cbm-docs-card">
            <div className="cbm-docs-hdr">DOCUMENTS GENERATED</div>
            <div className="cbm-docs-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Cancellation Note (BK series)
            </div>
            {refundPF && (
              <div className="cbm-docs-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Processing Fee Credit Note (CN series)
              </div>
            )}
          </div>
        </div>
        <div className="cbm-footer">
          <button type="button" className="cbm-btn-ghost" onClick={onClose}>Keep Booking</button>
          <button type="button" className="cbm-btn-orange" onClick={() => onCancelNote({ reason, refundPF, actualCharges, custCharges, handlingFee, invoice })}>
            <WarnIcon size={14} />
            Confirm Cancellation
          </button>
        </div>
      </div>
    </>,
    document.body
  );

  // ─── VIEW: Confirm Void ───────────────────────────────────────
  if (view === 'void') return ReactDOM.createPortal(
    <>
      <div className="cbm-overlay" onClick={onClose} />
      <div className="cbm-modal">
        <ModalHeader title="Confirm Void" subtitle="This will void the invoice" showBack onBack={() => setView('choose')} onClose={onClose} />
        <div className="cbm-body">
          <div className="cbm-void-confirm-card">
            <div className="cbm-void-doc-wrap">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="12" x2="15" y2="18"/><line x1="15" y1="12" x2="9" y2="18"/>
              </svg>
            </div>
            <div className="cbm-void-ctitle">Void Invoice</div>
            <div className="cbm-void-cinv">Invoice <strong>{invoiceNo}</strong> will be voided.</div>
            <div className="cbm-void-cnote">No cancellation note will be generated. No document numbers consumed. The booking will be marked as cancelled.</div>
          </div>
        </div>
        <div className="cbm-footer">
          <button type="button" className="cbm-btn-ghost" onClick={onClose}>Keep Booking</button>
          <button type="button" className="cbm-btn-red" onClick={() => onVoid({ reason, invoice })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            Void Invoice
          </button>
        </div>
      </div>
    </>,
    document.body
  );

  return null;
};
