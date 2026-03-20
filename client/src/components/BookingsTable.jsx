import React, { useState } from 'react';

const DemoModal = ({ onClose }) => (
  <div className="demo-modal-overlay" onClick={onClose}>
    <div className="demo-modal" onClick={e => e.stopPropagation()}>
      <div className="demo-modal-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <h3>Action Restricted</h3>
      <p>This is a demo account. Changes cannot be made.</p>
      <button className="demo-modal-btn" onClick={onClose}>OK</button>
    </div>
  </div>
);

const FunnelIcon = ({ active, onClick }) => (
  <span className={`th-search-btn ${active ? 'active' : ''}`} onClick={onClick}>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: active ? 1 : 0.4 }}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  </span>
);

const SortIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4, marginLeft:4}}>
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);

export const BookingsTable = ({ bookings }) => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  
  // Inline filters
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showDestSearch, setShowDestSearch] = useState(false);
  const [destSearch, setDestSearch] = useState('');

  const filteredBookings = bookings.filter(b => {
    const matchesCustomer = !customerSearch || b.customerName.toLowerCase().includes(customerSearch.toLowerCase());
    const matchesDest = !destSearch || b.destination.toLowerCase().includes(destSearch.toLowerCase());
    return matchesCustomer && matchesDest;
  });

  const handleStatusClick = (e, bId, status) => {
    e.stopPropagation();
    if (status === 'confirmed' || status === 'completed') {
      setActiveDropdownId(activeDropdownId === bId ? null : bId);
    }
  };

  const handleAction = (e) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    setShowDemoModal(true);
  };

  return (
    <>
      <div className="data-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>BOOKING #</th>
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
              <th>TOTAL <SortIcon /></th>
              <th>PROFIT</th>
              <th>PAYMENT</th>
              <th>REMAINING <SortIcon /></th>
              <th>STATUS</th>
              <th>DATE <SortIcon /></th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => {
              const actsAsDropdown = b.status === 'confirmed' || b.status === 'completed';
              return (
                <tr key={b.id} data-status={b.status} className="animate-row">
                  <td><span className="qt-id">{b.id}</span></td>
                  <td><span className="qt-customer-name">{b.customerName}</span></td>
                  <td>
                    <span className="bk-destination">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#94a3b8',flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {b.destination}
                    </span>
                  </td>
                  <td><span className="qt-amount">{b.amount}</span></td>
                  <td><span className="qt-profit">{b.profit}</span></td>
                  <td className="bk-payment">
                    <div className="payment-info">
                      <span className={`payment-badge payment-${b.paymentStatus}`}>{b.paymentStatus === 'paid' ? 'Paid' : 'Partial'}</span>
                      <span className="payment-text">{b.paymentText}</span>
                    </div>
                    <div className="payment-bar">
                      <div className="payment-bar-fill" style={{ 
                        width: b.paymentStatus === 'paid' ? '100%' : '50%', 
                        background: b.paymentStatus === 'paid' ? '#22c55e' : '#f59e0b' 
                      }}></div>
                    </div>
                  </td>
                  <td><span className="qt-amount">{b.remaining}</span></td>
                  <td style={{ position: 'relative' }}>
                    <div className="status-dropdown-wrapper">
                      <span 
                        className={`status-pill status-${b.status} ${actsAsDropdown ? 'status-interactive' : ''}`}
                        onClick={(e) => handleStatusClick(e, b.id, b.status)}
                        style={{ cursor: actsAsDropdown ? 'pointer' : 'default' }}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        {actsAsDropdown && (
                          <svg className="status-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginLeft:3}}><polyline points="6 9 12 15 18 9"/></svg>
                        )}
                      </span>
                      {activeDropdownId === b.id && b.status === 'confirmed' && (
                        <div className="status-dropdown">
                          <div className="status-drop-item status-drop-approve" onClick={handleAction}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Mark Completed
                          </div>
                          <div className="status-drop-item status-drop-reject" onClick={handleAction}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            Cancel
                          </div>
                        </div>
                      )}
                      {activeDropdownId === b.id && b.status === 'completed' && (
                        <div className="status-dropdown">
                          <div className="status-drop-item status-drop-reopen" onClick={handleAction}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
                            Reopen
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td><span className="qt-date">{b.date}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}
    </>
  );
};
