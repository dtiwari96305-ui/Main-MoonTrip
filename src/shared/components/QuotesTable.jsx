import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { jsPDF } from 'jspdf';
import { openCustomerProfile } from '../../utils/customerNav';
import { openQuoteDetail } from '../../utils/quoteNav';

const FunnelIcon = ({ active, onClick }) => (
  <span className={`th-search-btn ${active ? 'active' : ''}`} onClick={onClick}>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: active ? 1 : 0.4 }}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  </span>
);

const SortIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4, marginLeft: 4 }}>
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);

/* ── Delete Confirmation Modal ── */
const DeleteConfirmModal = ({ isOpen, quoteId, isConverted, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  const message = isConverted
    ? `This quote has been converted to a booking. Deleting it will not remove the linked booking. Proceed?`
    : `Are you sure you want to delete ${quoteId}? This action cannot be undone.`;
  const content = (
    <>
      <div className="pdm-overlay pdm-overlay-visible" onClick={onCancel} />
      <div className="pdm-modal pdm-modal-visible" style={{ maxWidth: 380, padding: 28, textAlign: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary, #1e293b)' }}>Delete Quote</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary, #64748b)', lineHeight: 1.5 }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onCancel} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: 'var(--text-primary, #1e293b)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Delete</button>
        </div>
      </div>
    </>
  );
  return ReactDOM.createPortal(content, document.body);
};

/* ── PDF Generator ── */
const fmtINR = (n) => {
  const num = parseFloat(String(n || '0').replace(/[₹,]/g, '')) || 0;
  return '₹' + Math.round(num).toLocaleString('en-IN');
};

function generateQuotePDF(q, detail, companyName) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const W = 210;
  const marginL = 16, marginR = 16;
  const contentW = W - marginL - marginR;
  let y = 16;

  const addLine = (label, value, bold) => {
    if (y > 270) { doc.addPage(); y = 16; }
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(label, marginL, y);
    doc.setTextColor(30);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(String(value || '—'), marginL + 55, y);
    y += 6;
  };

  const addSection = (title) => {
    if (y > 260) { doc.addPage(); y = 16; }
    y += 4;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40);
    doc.text(title, marginL, y);
    y += 2;
    doc.setDrawColor(200);
    doc.line(marginL, y, marginL + contentW, y);
    y += 6;
  };

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30);
  doc.text(companyName || 'Wanderlust Travels', marginL, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text('Travel Agency & Tour Operator', marginL, y);
  y += 10;

  // Quote number + status
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30);
  doc.text(`Quote: ${q.id}`, marginL, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const statusText = (q.status || 'draft').charAt(0).toUpperCase() + (q.status || 'draft').slice(1);
  doc.setTextColor(100);
  doc.text(`Status: ${statusText}`, marginL + 100, y);
  y += 10;

  // Customer
  addSection('Customer Details');
  addLine('Name', q.customerName);
  addLine('Phone', q.customerPhone || '—');
  if (q.raw?.real_customers?.email) addLine('Email', q.raw.real_customers.email);
  if (q.raw?.customer_email) addLine('Email', q.raw.customer_email);

  // Trip Details
  addSection('Trip Details');
  addLine('Destination', q.destName);
  addLine('Type', (q.destType || 'domestic').charAt(0).toUpperCase() + (q.destType || 'domestic').slice(1));
  if (q.tripDate) addLine('Trip Date', q.tripDate);
  if (q.raw?.return_date) addLine('Return Date', new Date(q.raw.return_date).toLocaleDateString('en-IN'));
  if (q.raw?.number_of_travelers) addLine('Travelers', q.raw.number_of_travelers);
  if (q.raw?.pax) addLine('Travelers', q.raw.pax);

  // Services (from itinerary/detail if available)
  const itin = detail || q.raw?.itinerary;
  if (itin?.services && typeof itin.services === 'object') {
    const activeServices = Object.entries(itin.services).filter(([, v]) => v);
    if (activeServices.length > 0) {
      addSection('Services');
      const details = itin.serviceDetails || {};
      activeServices.forEach(([key]) => {
        const d = details[key] || {};
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        const cost = d.cost || d.vendorCost || d.amount || '';
        addLine(label, cost ? fmtINR(cost) : 'Included');
      });
    }
  }

  // Financial Summary
  addSection('Financial Summary');
  addLine('Total Amount', q.amount, true);
  addLine('Profit', q.profit);
  if (q.raw?.gst_amount) addLine('GST', fmtINR(q.raw.gst_amount));
  if (q.raw?.tcs_amount) addLine('TCS', fmtINR(q.raw.tcs_amount));
  if (q.raw?.total_payable) addLine('Total Payable', fmtINR(q.raw.total_payable), true);

  // Inclusions / Exclusions
  if (itin?.inclusions) {
    addSection('Inclusions');
    const lines = String(itin.inclusions).split('\n').filter(Boolean);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50);
    lines.forEach(l => {
      if (y > 270) { doc.addPage(); y = 16; }
      doc.text(`• ${l.trim()}`, marginL + 2, y);
      y += 5;
    });
  }
  if (itin?.exclusions) {
    addSection('Exclusions');
    const lines = String(itin.exclusions).split('\n').filter(Boolean);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50);
    lines.forEach(l => {
      if (y > 270) { doc.addPage(); y = 16; }
      doc.text(`• ${l.trim()}`, marginL + 2, y);
      y += 5;
    });
  }

  // Itinerary days
  if (itin?.days && Array.isArray(itin.days) && itin.days.length > 0) {
    addSection('Itinerary');
    itin.days.forEach((day, i) => {
      if (y > 265) { doc.addPage(); y = 16; }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40);
      doc.text(`Day ${i + 1}: ${day.title || day.heading || ''}`, marginL, y);
      y += 5;
      if (day.description || day.details) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(80);
        const desc = String(day.description || day.details || '');
        const wrapped = doc.splitTextToSize(desc, contentW - 4);
        wrapped.forEach(line => {
          if (y > 275) { doc.addPage(); y = 16; }
          doc.text(line, marginL + 2, y);
          y += 4.5;
        });
      }
      y += 3;
    });
  }

  // Footer
  y += 6;
  if (y > 265) { doc.addPage(); y = 16; }
  doc.setDrawColor(200);
  doc.line(marginL, y, marginL + contentW, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140);
  doc.text(`Created: ${q.createdDate} ${q.createdTime || ''}`, marginL, y);
  y += 4;
  doc.text(`${companyName || 'Wanderlust Travels'} — Generated on ${new Date().toLocaleDateString('en-IN')}`, marginL, y);

  // Download
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '');
  doc.save(`Quote-${q.id}-${dateStr}.pdf`);
}

export const QuotesTable = ({ quotes, customers = [], quoteDetailData = {}, buildEditFormData, onAction, companyName }) => {
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null); // { quoteId, isConverted }

  // Inline filters
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showDestSearch, setShowDestSearch] = useState(false);
  const [destSearch, setDestSearch] = useState('');

  const filteredQuotes = quotes.filter(q => {
    const matchesCustomer = !customerSearch || q.customerName.toLowerCase().includes(customerSearch.toLowerCase());
    const matchesDest = !destSearch || q.destName.toLowerCase().includes(destSearch.toLowerCase());
    return matchesCustomer && matchesDest;
  });

  // Close status dropdown on outside click
  useEffect(() => {
    if (!activeDropdownId) return;
    const handler = () => setActiveDropdownId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [activeDropdownId]);

  const handleStatusClick = (e, qId, status) => {
    e.stopPropagation();
    const interactive = status === 'sent' || status === 'draft' || status === 'approved' || status === 'rejected';
    if (interactive) {
      setActiveDropdownId(activeDropdownId === qId ? null : qId);
    }
  };

  const handleAction = (e, actionType, quoteId) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    if (onAction) onAction(actionType, quoteId);
  };

  const handleDownload = (e, q) => {
    e.stopPropagation();
    const detail = quoteDetailData[q.id];
    generateQuotePDF(q, detail, companyName);
  };

  const handleDeleteClick = (e, q) => {
    e.stopPropagation();
    setDeleteModal({ quoteId: q.id, isConverted: q.status === 'converted' });
  };

  const confirmDelete = () => {
    if (deleteModal && onAction) {
      onAction('delete', deleteModal.quoteId);
    }
    setDeleteModal(null);
  };

  return (
    <>
      <div className="data-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>QUOTE #</th>
              <th className="th-with-search">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  CUSTOMER <FunnelIcon active={showCustomerSearch} onClick={(e) => { e.stopPropagation(); setShowCustomerSearch(!showCustomerSearch); }} />
                </div>
                {showCustomerSearch && (
                  <div className="table-inline-search">
                    <input
                      type="text" className="inline-search-input" placeholder="Search name..." autoFocus
                      value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
                    />
                  </div>
                )}
              </th>
              <th className="th-with-search">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  DESTINATION <FunnelIcon active={showDestSearch} onClick={(e) => { e.stopPropagation(); setShowDestSearch(!showDestSearch); }} />
                </div>
                {showDestSearch && (
                  <div className="table-inline-search">
                    <input
                      type="text" className="inline-search-input" placeholder="Search dest..." autoFocus
                      value={destSearch} onChange={e => setDestSearch(e.target.value)}
                    />
                  </div>
                )}
              </th>
              <th>AMOUNT <SortIcon /></th>
              <th>PROFIT <SortIcon /></th>
              <th>STATUS</th>
              <th>TRIP DATE <SortIcon /></th>
              <th>CREATED <SortIcon /></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map((q) => {
              const actsAsDropdown = q.status === 'sent' || q.status === 'draft' || q.status === 'approved' || q.status === 'rejected';
              return (
                <tr key={q.id} data-status={q.status} className="animate-row">
                  <td><span className="qt-id cp-name-link" onClick={() => openQuoteDetail(q.id, 'quotes')}>{q.id}</span></td>
                  <td className="qt-customer">
                    <div>
                      <span className="qt-customer-name cp-name-link" onClick={() => { const c = customers.find(x => x.name === q.customerName); if (c) openCustomerProfile(c.id, 'quotes'); }}>{q.customerName}</span>
                      <span className="qt-customer-phone">{q.customerPhone}</span>
                    </div>
                  </td>
                  <td className="qt-destination">
                    <div>
                      <span className="qt-dest-name">{q.destName}</span>
                      <span className="qt-dest-type">{q.destType}</span>
                    </div>
                  </td>
                  <td><span className="qt-amount">{q.amount}</span></td>
                  <td><span className="qt-profit">{q.profit}</span></td>
                  <td style={{ position: 'relative' }}>
                    <div className="status-dropdown-wrapper">
                      <span
                        className={`status-pill status-${q.status} ${actsAsDropdown ? 'status-interactive' : ''}`}
                        onClick={(e) => handleStatusClick(e, q.id, q.status)}
                        style={{ cursor: actsAsDropdown ? 'pointer' : 'default' }}
                      >
                        {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                        {actsAsDropdown && (
                          <svg className="status-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginLeft:3}}><polyline points="6 9 12 15 18 9"/></svg>
                        )}
                      </span>
                      {activeDropdownId === q.id && (
                        <div className="status-dropdown">
                          {(q.status === 'draft' || q.status === 'sent') && (<>
                            <div className="status-drop-item status-drop-approve" onClick={(e) => handleAction(e, 'approve', q.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                              Approve
                            </div>
                            <div className="status-drop-item status-drop-reject" onClick={(e) => handleAction(e, 'reject', q.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              Reject
                            </div>
                          </>)}
                          {q.status === 'approved' && (<>
                            <div className="status-drop-item status-drop-back-sent" onClick={(e) => handleAction(e, 'back-to-sent', q.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                              Back to Sent
                            </div>
                            <div className="status-drop-item status-drop-reject" onClick={(e) => handleAction(e, 'reject', q.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              Reject
                            </div>
                            <div className="status-drop-item status-drop-convert" onClick={(e) => handleAction(e, 'convert', q.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              Convert to Booking
                            </div>
                          </>)}
                          {q.status === 'rejected' && (
                            <div className="status-drop-item status-drop-reopen" onClick={(e) => handleAction(e, 'reopen', q.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
                              Reopen as Draft
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td><span className="qt-date">{q.tripDate}</span></td>
                  <td><span className="qt-created">{q.createdDate}<br/>{q.createdTime}</span></td>
                  <td>
                    <div className="qt-row-actions">
                      <button className="qt-action-btn qt-download-btn" title="Download PDF" onClick={(e) => handleDownload(e, q)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </button>
                      <button className="qt-action-btn qt-delete-btn" title="Delete Quote" onClick={(e) => handleDeleteClick(e, q)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteModal}
        quoteId={deleteModal?.quoteId}
        isConverted={deleteModal?.isConverted}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal(null)}
      />
    </>
  );
};
