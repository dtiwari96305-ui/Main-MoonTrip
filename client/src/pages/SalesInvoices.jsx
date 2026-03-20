import React, { useState, useEffect, useRef } from 'react';
import { InfoBtn } from '../components/InfoBtn';
import { TableSkeleton } from '../components/PageSkeleton';
import { ExportDropdown } from '../components/ExportDropdown';

const INVOICES_COLUMNS = [
  { header: 'Invoice #',   key: 'id' },
  { header: 'Type',        key: 'type' },
  { header: 'Amount',      key: 'amount' },
  { header: 'Customer',    key: 'customer' },
  { header: 'Destination', key: 'destination' },
  { header: 'Status',      key: 'status' },
  { header: 'Date',        key: 'date' },
];

const LogsPopup = ({ onClose }) => {
  const popupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="logs-popup-container" ref={popupRef}>
      <div className="logs-popup-header"><h3>Logs</h3></div>
      <div className="logs-popup-body">
        <div className="logs-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.2, marginBottom: 12 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <p>No logs yet</p>
        </div>
      </div>
    </div>
  );
};

const FunnelIcon = ({ active, onClick }) => (
  <span 
    className={`funnel-icon ${active ? 'active' : ''}`} 
    onClick={onClick} 
    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginLeft: 4 }}
  >
    <svg width="10" height="10" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{ opacity: active ? 1 : 0.4 }}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  </span>
);

export const SalesInvoices = () => {
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('salesinvoices_activeTab') || 'active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Customer funnel search state
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  // Persist tab changes
  useEffect(() => {
    sessionStorage.setItem('salesinvoices_activeTab', activeTab);
  }, [activeTab]);

  const invoices = [
    { id: 'WL-B-0002', type: 'Primary', amount: '₹1,34,240', customer: 'Rahul Sharma', destination: 'Bali, Indonesia', status: 'Active', date: '05 Mar 2026' },
    { id: 'WL-B-0001', type: 'Primary', amount: '₹4,69,900', customer: 'Vikram Iyer', destination: 'Goa', status: 'Active', date: '10 Mar 2026' },
    { id: 'WL-B-0003', type: 'Primary', amount: '₹1,56,880', customer: 'Rajesh Patel', destination: 'Srinagar - Gulmarg - Pahalgam', status: 'Active', date: '01 Mar 2026' },
  ];

  useEffect(() => {
    let result = invoices;
    
    if (activeTab === 'active') {
      result = result.filter(inv => inv.status === 'Active');
    } else if (activeTab === 'cancelled') {
       result = [];
    } else if (activeTab === 'ext') {
       result = [];
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(inv => 
        inv.id.toLowerCase().includes(q) || 
        inv.customer.toLowerCase().includes(q) || 
        inv.destination.toLowerCase().includes(q)
      );
    }

    // Customer funnel filter
    if (customerSearch) {
      result = result.filter(inv => inv.customer.toLowerCase().includes(customerSearch.toLowerCase()));
    }

    setFilteredInvoices(result);
  }, [activeTab, searchQuery, customerSearch]);

  const handleRefresh = () => {
    setSearchQuery('');
    setCustomerSearch('');
    setShowCustomerSearch(false);
    setActiveTab('active');
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="page-view fade-in">
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <h1 className="page-title">Sales Invoices</h1>
            <p className="page-subtitle">{filteredInvoices.length} invoices</p>
          </div>
          <div className="dash-header-right">
            <div style={{ position: 'relative' }}>
              <button className={`icon-btn log-btn ${isLogsOpen ? 'active' : ''}`} onClick={() => setIsLogsOpen(!isLogsOpen)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </button>
              {isLogsOpen && <LogsPopup onClose={() => setIsLogsOpen(false)} />}
            </div>
            <div className="header-user">
              <div className="header-user-avatar">DA</div>
              <div className="header-user-info">
                <span className="header-user-name">Demo Admin</span>
                <span className="header-user-role"><span className="role-dot"></span> Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-search-bar" style={{ marginBottom: 20 }}>
        <div className="search-input-wrap" style={{ maxWidth: '100%' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            placeholder="Search by booking number, customer or destination..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="page-search-bar" style={{ marginBottom: 20, gap: 12 }}>
        <div className="filter-tabs">
          {['all', 'active', 'cancelled', 'ext'].map(tab => (
            <button 
              key={tab}
              className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <InfoBtn infoKey="ext_info" />
        <button className="icon-btn refresh-btn" onClick={handleRefresh}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <ExportDropdown
          data={filteredInvoices}
          columns={INVOICES_COLUMNS}
          sectionName="SalesInvoice"
          fileBase="SalesInvoice_Export"
        />
      </div>

      {isRefreshing ? (
        <TableSkeleton rows={3} cols={7} />
      ) : (filteredInvoices.length > 0 || activeTab === 'cancelled' || activeTab === 'ext') ? (
        <div className="data-table-card" key={refreshKey}>
          <table className="data-table">
            <thead>
              <tr>
                <th>INVOICE #</th>
                <th>TYPE</th>
                <th>AMOUNT <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></th>
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
                <th>DESTINATION</th>
                <th>STATUS <InfoBtn infoKey="status_info" /></th>
                <th>DATE <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? filteredInvoices.map(inv => (
                <tr key={inv.id} className="animate-row">
                  <td className="qt-id">{inv.id}</td>
                  <td><span className="type-badge type-primary">{inv.type}</span></td>
                  <td className="qt-amount">{inv.amount}</td>
                  <td className="qt-customer-name">{inv.customer}</td>
                  <td className="bk-destination">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#94a3b8', flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {inv.destination}
                  </td>
                  <td><span className="status-pill status-active">{inv.status}</span></td>
                  <td className="qt-date">{inv.date}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div className="empty-icon-wrap" style={{ margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                    <h3 className="empty-state-title">No invoices found</h3>
                    <p className="empty-state-desc">Try adjusting your search or filters to find what you're looking for.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <h3 className="empty-state-title">No invoices found</h3>
          <p className="empty-state-desc">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};
