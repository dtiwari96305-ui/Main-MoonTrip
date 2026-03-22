import React, { useState, useEffect, useRef } from 'react';
import { openCustomerProfile } from '../../utils/customerNav';
import { openQuoteDetail } from '../../utils/quoteNav';
import { openEditQuote } from '../../utils/editQuoteNav';
import { openDesigner } from '../../utils/designerNav';

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

export const QuotesTable = ({ quotes, customers = [], quoteDetailData = {}, buildEditFormData, onAction }) => {
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [activeItinId, setActiveItinId] = useState(null);
  const itinRef = useRef(null);

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

  // Close itinerary dropdown on outside click
  useEffect(() => {
    if (!activeItinId) return;
    const handler = (e) => {
      if (itinRef.current && !itinRef.current.contains(e.target)) {
        setActiveItinId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [activeItinId]);

  const handleStatusClick = (e, qId, status) => {
    e.stopPropagation();
    setActiveItinId(null);
    if (status === 'sent' || status === 'draft') {
      setActiveDropdownId(activeDropdownId === qId ? null : qId);
    }
  };

  const handleAction = (e, actionType, quoteId) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    if (onAction) onAction(actionType, quoteId);
  };

  const handleItinClick = (e, qId) => {
    e.stopPropagation();
    setActiveDropdownId(null);
    setActiveItinId(activeItinId === qId ? null : qId);
  };

  const handleSimpleItinerary = (e, q) => {
    e.stopPropagation();
    setActiveItinId(null);
    const detail = quoteDetailData[q.id];
    if (!detail || !buildEditFormData) return;
    const formData = buildEditFormData(detail, q.id, {
      _startStep: 6,
      _fromView: 'quotes',
    });
    openEditQuote(formData);
  };

  const handleDesignItinerary = (e, q) => {
    e.stopPropagation();
    setActiveItinId(null);
    const detail = quoteDetailData[q.id];
    if (!detail || !buildEditFormData) return;
    const formData = buildEditFormData(detail, q.id);
    openDesigner(q.id, formData, 'quotes');
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
              const actsAsDropdown = q.status === 'sent' || q.status === 'draft';
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
                          <div className="status-drop-item status-drop-approve" onClick={(e) => handleAction(e, 'approve', q.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Approve
                          </div>
                          <div className="status-drop-item status-drop-reject" onClick={(e) => handleAction(e, 'reject', q.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            Reject
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td><span className="qt-date">{q.tripDate}</span></td>
                  <td><span className="qt-created">{q.createdDate}<br/>{q.createdTime}</span></td>
                  <td style={{ position: 'relative' }}>
                    <div
                      className="qt-itin-wrap"
                      ref={activeItinId === q.id ? itinRef : null}
                    >
                      <button
                        className={`qt-itin-btn${activeItinId === q.id ? ' qt-itin-btn-open' : ''}`}
                        onClick={(e) => handleItinClick(e, q.id)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        Itinerary
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 2 }}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      {activeItinId === q.id && (
                        <div className="qt-itin-dropdown">
                          <button className="qt-itin-drop-item" onClick={(e) => handleSimpleItinerary(e, q)}>
                            <span className="qt-itin-drop-icon qt-itin-simple-icon">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <line x1="10" y1="9" x2="8" y2="9"/>
                              </svg>
                            </span>
                            <span className="qt-itin-drop-text">
                              <span className="qt-itin-drop-label">Simple Itinerary</span>
                              <span className="qt-itin-drop-sub">Edit quote at Step 6</span>
                            </span>
                          </button>
                          <button className="qt-itin-drop-item" onClick={(e) => handleDesignItinerary(e, q)}>
                            <span className="qt-itin-drop-icon qt-itin-design-icon">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                              </svg>
                            </span>
                            <span className="qt-itin-drop-text">
                              <span className="qt-itin-drop-label">Design Itinerary</span>
                              <span className="qt-itin-drop-sub">Open Design Builder</span>
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
