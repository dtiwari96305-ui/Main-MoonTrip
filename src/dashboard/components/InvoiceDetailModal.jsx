import React from 'react';
import ReactDOM from 'react-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const downloadInvoicePdf = (invoice, settings) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const companyName    = settings?.companyName || 'Wanderlust Travels';
  const companyGstin   = settings?.gstin       || '';
  const companyAddress = settings?.address     || '301, Trade Center, BKC, Mumbai';
  const companyPhone   = settings?.phone       || '+91 98765 43210';
  const companyEmail   = settings?.email       || 'demo@touridoo.in';

  // Header background
  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, 210, 32, 'F');

  // Company name (white)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 14, 13);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  if (companyGstin) doc.text(`GSTIN: ${companyGstin}`, 14, 20);
  doc.text(companyAddress, 14, 26);

  // Invoice label (right side)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 196, 13, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${invoice.id}`, 196, 20, { align: 'right' });
  doc.text(`Date: ${invoice.date || invoice.createdDate}`, 196, 26, { align: 'right' });

  let y = 42;

  // Bill To
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', 14, y);
  y += 5;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(invoice.customerName || '—', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (invoice.customerPhone) { doc.text(`Phone: ${invoice.customerPhone}`, 14, y); y += 5; }
  if (invoice.customerEmail) { doc.text(`Email: ${invoice.customerEmail}`, 14, y); y += 5; }
  if (invoice.customerPan)   { doc.text(`PAN: ${invoice.customerPan}`, 14, y); y += 5; }
  if (invoice.customerGstin) { doc.text(`GSTIN: ${invoice.customerGstin}`, 14, y); y += 5; }
  y += 4;

  // Trip Details
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TRIP DETAILS', 14, y);
  y += 5;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Destination: ${invoice.destination || '—'}   Type: ${invoice.destType || '—'}   Travelers: ${invoice.travelers || 1} Pax`, 14, y);
  y += 5;
  if (invoice.duration) { doc.text(`Duration: ${invoice.duration}`, 14, y); y += 5; }
  if (invoice.travelDate) { doc.text(`Travel Date: ${invoice.travelDate}`, 14, y); y += 5; }
  y += 4;

  // Services table
  autoTable(doc, {
    startY: y,
    head: [['SERVICES', 'AMOUNT']],
    body: [
      ['Total Reimbursement (Cost of Travel)', fmtINR(invoice.travelCost)],
      ['Processing / Service Charge (SAC: 998551)', fmtINR(invoice.serviceFee)],
      ['CGST @9% (on service charge)', fmtINR(invoice.cgst)],
      ['SGST @9% (on service charge)', fmtINR(invoice.sgst)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
    margin: { left: 14, right: 14 },
  });

  y = doc.lastAutoTable.finalY + 6;

  // Invoice Value & Total
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Value', 16, y + 5.5);
  doc.text(fmtINR(invoice.invoiceValue), 196, y + 5.5, { align: 'right' });
  y += 12;

  doc.setFillColor(245, 243, 255);
  doc.rect(14, y, 182, 10, 'F');
  doc.setTextColor(124, 58, 237);
  doc.setFontSize(12);
  doc.text('Total Payable', 16, y + 7);
  doc.text(fmtINR(invoice.invoiceValue), 196, y + 7, { align: 'right' });
  y += 16;

  // Status badge
  const statusColor = invoice.status === 'Paid' ? [22, 163, 74] : [202, 138, 4];
  doc.setFillColor(...statusColor);
  doc.roundedRect(14, y, 24, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(invoice.status || 'Unpaid', 26, y + 5, { align: 'center' });
  y += 16;

  // Footer note
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Under Pure Agent model, GST is applicable only on the processing/service charge.', 14, y);
  doc.text('Travel costs are reimbursements collected on behalf of the customer.', 14, y + 4);
  y += 12;
  doc.text(`${companyName} · ${companyPhone} · ${companyEmail}`, 14, y);

  const safeCustomer = (invoice.customerName || 'Invoice').replace(/\s+/g, '_');
  const safeDate     = new Date().toISOString().slice(0, 10);
  doc.save(`Invoice-${invoice.id}-${safeCustomer}-${safeDate}.pdf`);
};

export const InvoiceDetailModal = ({ invoice, settings, onClose }) => {
  if (!invoice) return null;

  return ReactDOM.createPortal(
    <div className="ctb-backdrop" onClick={onClose}>
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
            <div className="ctb-header-sub">{invoice.id}</div>
          </div>
          <div className="ctb-header-actions">
            <span className={`ctb-status-badge ${invoice.status === 'Paid' ? 'ctb-status-paid' : 'ctb-status-unpaid'}`}>
              {invoice.status || 'Unpaid'}
            </span>
            <button className="ctb-icon-btn" onClick={onClose}>
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
            <div className="ctb-company-name">{settings?.companyName || 'Wanderlust Travels'}</div>
            <div className="ctb-company-detail">
              {settings?.gstin && <>GSTIN: {settings.gstin}<br/></>}
              {settings?.address || '301, Trade Center, BKC, Mumbai'}<br/>
              {settings?.phone || '+91 98765 43210'}{settings?.email ? ` | ${settings.email}` : ''}
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="ctb-invoice-meta">
            <div>
              <div className="ctb-meta-label">Invoice No.</div>
              <div className="ctb-meta-value">{invoice.id}</div>
            </div>
            <div>
              <div className="ctb-meta-label">Date</div>
              <div className="ctb-meta-value">{invoice.date || invoice.createdDate}</div>
            </div>
          </div>

          {/* Bill To */}
          <div className="ctb-section">
            <div className="ctb-section-label">Bill To</div>
            <div className="ctb-bill-box">
              <div className="ctb-bill-name">{invoice.customerName}</div>
              {invoice.customerPhone && <div className="ctb-bill-row">Phone: {invoice.customerPhone}</div>}
              {invoice.customerEmail && <div className="ctb-bill-row">Email: {invoice.customerEmail}</div>}
              {invoice.customerPan   && <div className="ctb-bill-row">PAN: {invoice.customerPan}</div>}
              {invoice.customerGstin && <div className="ctb-bill-row">GSTIN: {invoice.customerGstin}</div>}
            </div>
          </div>

          {/* Trip Details */}
          <div className="ctb-section">
            <div className="ctb-section-label">Trip Details</div>
            <div className="ctb-trip-grid">
              <div>
                <div className="ctb-trip-item-label">Destination</div>
                <div className="ctb-trip-item-value">{invoice.destination}</div>
              </div>
              <div>
                <div className="ctb-trip-item-label">Type</div>
                <div className="ctb-trip-item-value">{invoice.destType}</div>
              </div>
              {invoice.duration && (
                <div>
                  <div className="ctb-trip-item-label">Duration</div>
                  <div className="ctb-trip-item-value">{invoice.duration}</div>
                </div>
              )}
              <div>
                <div className="ctb-trip-item-label">Travelers</div>
                <div className="ctb-trip-item-value">{invoice.travelers} Pax</div>
              </div>
              {invoice.placeOfSupply && (
                <div>
                  <div className="ctb-trip-item-label">Place of Supply</div>
                  <div className="ctb-trip-item-value">{invoice.placeOfSupply}</div>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="ctb-section">
            <div className="ctb-section-label">Services</div>
            <div className="ctb-services-row">
              <span>Total Reimbursement</span>
              <span>{fmtINR(invoice.travelCost)}</span>
            </div>
          </div>

          {/* Tax Summary */}
          <div className="ctb-section">
            <div className="ctb-section-label">Tax Summary</div>
            <div className="ctb-tax-box">
              <div className="ctb-tax-row">
                <span className="ctb-tax-label">Cost of Travel (Reimbursement)</span>
                <span className="ctb-tax-value">{fmtINR(invoice.travelCost)}</span>
              </div>
              <div className="ctb-tax-row">
                <span className="ctb-tax-label">
                  <strong>Processing / Service Charge</strong>
                  <span className="ctb-tax-sac"> SAC: 998551</span>
                </span>
                <span className="ctb-tax-value"><strong>{fmtINR(invoice.serviceFee)}</strong></span>
              </div>
              <div className="ctb-tax-row">
                <span className="ctb-tax-label">CGST @9% (on service charge)</span>
                <span className="ctb-tax-value">{fmtINR(invoice.cgst)}</span>
              </div>
              <div className="ctb-tax-row">
                <span className="ctb-tax-label">SGST @9% (on service charge)</span>
                <span className="ctb-tax-value">{fmtINR(invoice.sgst)}</span>
              </div>
              <div className="ctb-invoice-value-row">
                <span className="ctb-invoice-value-label">Invoice Value</span>
                <span className="ctb-invoice-value-num">{fmtINR(invoice.invoiceValue)}</span>
              </div>
            </div>
            <div className="ctb-total-payable-row">
              <span className="ctb-total-payable-label">Total Payable</span>
              <span className="ctb-total-payable-value">{fmtINR(invoice.invoiceValue)}</span>
            </div>
          </div>

          {invoice.bookingRef && (
            <div className="ctb-section">
              <div className="ctb-section-label">Booking Reference</div>
              <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>{invoice.bookingRef || invoice.bookingId}</div>
            </div>
          )}

          <div className="ctb-footer-note">
            Under Pure Agent model, GST is applicable only on the processing/service charge. Travel costs are reimbursements collected on behalf of the customer.
          </div>
        </div>

        {/* Actions — only Download PDF */}
        <div className="ctb-actions">
          <button className="ctb-btn-download" onClick={() => downloadInvoicePdf(invoice, settings)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
