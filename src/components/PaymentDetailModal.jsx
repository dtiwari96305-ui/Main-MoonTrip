import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { jsPDF } from 'jspdf';
import { getPaymentById } from '../data/paymentsData';
import { useDemoPopup } from '../context/DemoContext';


// ─── Mode Icon Map ─────────────────────────────────────────────────────────────
const ModeIcon = ({ modeType, size = 22 }) => {
  if (modeType === 'upi') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
  if (modeType === 'bank') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
  if (modeType === 'cheque') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
  // cash / default
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
};

// ─── Download PDF ──────────────────────────────────────────────────────────────
const downloadPDF = (payment) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Header bar
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Moontrip', 14, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Travel & Tourism Agency', 14, 19);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', 196, 12, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.id, 196, 19, { align: 'right' });

  // Payment info section
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.amount, 14, 44);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 140);
  doc.text('AMOUNT RECEIVED', 14, 50);

  // Details table
  const rows = [
    ['Payment ID', payment.id],
    ['Customer', payment.customerName],
    ['Date', payment.date],
    ['Mode', payment.modeLabel],
    ['Reference', payment.ref || '—'],
    ['Against', payment.against || '—'],
    ['Type', payment.badge || '—'],
  ];
  if (payment.bankName) rows.push(['Bank', payment.bankName]);
  if (payment.remarks) rows.push(['Remarks', payment.remarks]);

  let y = 60;
  doc.setDrawColor(230, 230, 240);
  rows.forEach(([label, value], i) => {
    const bg = i % 2 === 0 ? [248, 249, 252] : [255, 255, 255];
    doc.setFillColor(...bg);
    doc.rect(14, y - 5, 182, 8, 'F');
    doc.setTextColor(130, 130, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label.toUpperCase(), 18, y);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), 100, y);
    y += 9;
  });

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 190);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated receipt. No signature required.', 14, 280);
  doc.text('Moontrip Travel Agency · demo@moontrip.in · +91 98765 43210', 14, 285);

  // Generate filename
  const dateStr = payment.date.replace(/\s/g, '').replace(/,/g, '');
  const cleanDate = payment.date.split(' ').join('');
  doc.save(`Payment_${payment.id}_${cleanDate}.pdf`);
};

// ─── Main Component ────────────────────────────────────────────────────────────
export const PaymentDetailModal = ({ paymentId, onClose }) => {
  const triggerDemoPopup = useDemoPopup();
  const [isVisible, setIsVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const payment = getPaymentById(paymentId);

  // Edit form state (pre-filled from payment)
  const [editAmount, setEditAmount] = useState('');
  const [editMode, setEditMode] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editRef, setEditRef] = useState('');
  const [editBank, setEditBank] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    if (paymentId) {
      setIsVisible(true);
      setIsEditMode(false);
      if (payment) {
        setEditAmount(payment.amount.replace('₹', '').replace(/,/g, ''));
        setEditMode(payment.modeType);
        setEditDate(payment.date);
        setEditRef(payment.ref === '—' ? '' : (payment.ref || ''));
        setEditBank(payment.bankName || '');
        setEditNotes(payment.remarks || '');
      }
    }
  }, [paymentId]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  if (!paymentId) return null;
  if (!payment) return null;

  const badgeColor = payment.badge === 'Advance' ? 'advance' : payment.badge === 'Full' ? 'full' : 'balance';

  const iconBgMap = {
    bank: 'linear-gradient(135deg, #667eea, #764ba2)',
    upi: 'linear-gradient(135deg, #48bb78, #38a169)',
    cheque: 'linear-gradient(135deg, #f6ad55, #ed8936)',
    cash: 'linear-gradient(135deg, #4fd1c5, #38b2ac)',
  };
  const iconBg = iconBgMap[payment.modeType] || iconBgMap.bank;

  const content = (
    <>
      <div
        className={`pdm-overlay${isVisible ? ' pdm-overlay-visible' : ''}`}
        onClick={handleClose}
      />
      <div className={`pdm-modal${isVisible ? ' pdm-modal-visible' : ''}${isEditMode ? ' pdm-modal-edit' : ''}`}>

        {/* ── Close Button ── */}
        <button className="pdm-close-btn" onClick={handleClose} title="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isEditMode ? (
          /* ── Default View ── */
          <div className="pdm-default-view">

            {/* Icon + Payment ID header */}
            <div className="pdm-hero">
              <div className="pdm-icon-wrap" style={{ background: iconBg }}>
                <ModeIcon modeType={payment.modeType} size={26} />
              </div>
              <div className="pdm-hero-text">
                <span className="pdm-payment-id">{payment.id}</span>
                <span className="pdm-payment-sub">
                  {payment.againstType === 'advance' ? 'Advance Payment' : `Against ${payment.against}`}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="pdm-amount-row">
              <span className="pdm-amount">{payment.amount}</span>
              <span className={`pdm-badge pdm-badge-${badgeColor}`}>{payment.badge}</span>
            </div>

            {/* Detail rows */}
            <div className="pdm-details">
              <div className="pdm-detail-row">
                <span className="pdm-detail-label">Customer</span>
                <span className="pdm-detail-value pdm-customer">{payment.customerName}</span>
              </div>
              <div className="pdm-detail-row">
                <span className="pdm-detail-label">Date</span>
                <span className="pdm-detail-value">{payment.date}</span>
              </div>
              <div className="pdm-detail-row">
                <span className="pdm-detail-label">Mode</span>
                <span className={`mode-badge mode-${payment.modeType}`}>{payment.modeLabel}</span>
              </div>
              {payment.ref && payment.ref !== '—' && (
                <div className="pdm-detail-row">
                  <span className="pdm-detail-label">Reference</span>
                  <span className="pdm-detail-value pdm-ref">{payment.ref}</span>
                </div>
              )}
              {payment.bankName && (
                <div className="pdm-detail-row">
                  <span className="pdm-detail-label">Bank</span>
                  <span className="pdm-detail-value">{payment.bankName}</span>
                </div>
              )}
              {payment.remarks && (
                <div className="pdm-detail-row">
                  <span className="pdm-detail-label">Remarks</span>
                  <span className="pdm-detail-value pdm-remarks">{payment.remarks}</span>
                </div>
              )}
              <div className="pdm-detail-row">
                <span className="pdm-detail-label">Created</span>
                <span className="pdm-detail-value">{payment.createdDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pdm-actions">
              <button className="pdm-action-btn pdm-btn-download" onClick={() => downloadPDF(payment)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </button>
              <button className="pdm-action-btn pdm-btn-edit" onClick={() => setIsEditMode(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                Edit
              </button>
              <button className="pdm-action-btn pdm-btn-share" onClick={triggerDemoPopup}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
            </div>
          </div>
        ) : (
          /* ── Edit View ── */
          <div className="pdm-edit-view">
            <div className="pdm-edit-header">
              <div className="pdm-edit-title-row">
                <span className="pdm-edit-id">{payment.id}</span>
                <span className="pdm-edit-sub">Edit Payment</span>
              </div>
            </div>

            <div className="pdm-edit-body">
              <div className="pdm-edit-field">
                <label className="pdm-edit-label">Amount (₹)</label>
                <input
                  className="pdm-edit-input"
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="pdm-edit-field">
                <label className="pdm-edit-label">Payment Mode</label>
                <select
                  className="pdm-edit-select"
                  value={editMode}
                  onChange={e => setEditMode(e.target.value)}
                >
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div className="pdm-edit-field">
                <label className="pdm-edit-label">Date</label>
                <input
                  className="pdm-edit-input"
                  type="text"
                  value={editDate}
                  onChange={e => setEditDate(e.target.value)}
                  placeholder="e.g. 10 Mar 2026"
                />
              </div>

              <div className="pdm-edit-field">
                <label className="pdm-edit-label">Reference</label>
                <input
                  className="pdm-edit-input"
                  type="text"
                  value={editRef}
                  onChange={e => setEditRef(e.target.value)}
                  placeholder="Transaction reference / UTR"
                />
              </div>

              {(editMode === 'bank' || editMode === 'cheque') && (
                <div className="pdm-edit-field">
                  <label className="pdm-edit-label">Bank Name</label>
                  <input
                    className="pdm-edit-input"
                    type="text"
                    value={editBank}
                    onChange={e => setEditBank(e.target.value)}
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
              )}

              <div className="pdm-edit-field">
                <label className="pdm-edit-label">Notes / Remarks</label>
                <textarea
                  className="pdm-edit-textarea"
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Add remarks or notes..."
                  rows={3}
                />
              </div>
            </div>

            <div className="pdm-edit-footer">
              <button className="pdm-cancel-btn" onClick={() => setIsEditMode(false)}>
                Cancel
              </button>
              <button className="pdm-save-btn" onClick={triggerDemoPopup}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

    </>
  );

  return ReactDOM.createPortal(content, document.body);
};
