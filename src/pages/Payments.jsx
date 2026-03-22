import React, { useState, useRef, useEffect } from 'react';
import { InfoBtn } from '../shared/components/InfoBtn';
import { RecordPaymentModal } from '../shared/components/RecordPaymentModal';
import { PaymentDetailModal } from '../shared/components/PaymentDetailModal';
import { openBilling } from '../utils/billingNav';
import { ExportDropdown } from '../shared/components/ExportDropdown';
import { useDemoPopup } from '../context/DemoContext';
import { demoCustomers } from '../shared/data/demoData';
import { getDemoPaymentById } from '../shared/data/demoData';

const PAYMENTS_COLUMNS = [
  { header: 'Payment #',  key: 'id' },
  { header: 'Customer',   key: 'customerName' },
  { header: 'Method',     key: 'modeLabel' },
  { header: 'Amount (₹)', key: 'amount' },
  { header: 'Type',       key: 'againstType' },
  { header: 'Date',       key: 'date' },
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
  <span className={`th-search-btn ${active ? 'active' : ''}`} onClick={onClick}>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: active ? 1 : 0.4 }}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  </span>
);

export const Payments = () => {
  const triggerDemoPopup = useDemoPopup();
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('payments_activeTab') || 'all');
  const [activeStat, setActiveStat] = useState(() => sessionStorage.getItem('payments_activeStat') || 'totalReceived');
  const [customerFilter, setCustomerFilter] = useState('All Customers');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [paymentDetailId, setPaymentDetailId] = useState(null);

  // Search
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  // Persist tab changes
  useEffect(() => {
    sessionStorage.setItem('payments_activeTab', activeTab);
    sessionStorage.setItem('payments_activeStat', activeStat);
  }, [activeTab, activeStat]);

  const stats = [
    { id: 'totalReceived', label: 'Total Received', value: '₹5,57,832', icon: 'green', type: 'all' },
    { id: 'transactions', label: 'Transactions', value: '5', icon: 'blue', type: 'all' },
    { id: 'pending', label: 'Pending Payments', value: '₹2,34,900', icon: 'orange', type: 'pending' },
    { id: 'advance', label: 'Advance Balance', value: '₹25,000', icon: 'purple', type: 'advance', info: 'advance' },
  ];

  const customers = ['All Customers', 'Priya Mehta'];

  // Data Arrays
  const allPaymentsData = [
    { id: 'REC-0001', against: 'WL-B-0001', customerName: 'Vikram Iyer', amount: '₹2,35,000', modeType: 'bank', modeLabel: 'Bank Transfer', ref: 'NEFT/2026/03/HDFC123456', remarks: '50% advance — GlobalTech...', date: '10 Mar 2026', againstType: 'normal' },
    { id: 'REC-0002', against: 'WL-B-0002', customerName: 'Rahul Sharma', amount: '₹1,40,952', modeType: 'upi', modeLabel: 'Upi', ref: 'UPI/326598741258', remarks: 'Full payment — Bali honeym...', date: '06 Mar 2026', againstType: 'normal' },
    { id: 'REC-0003', against: 'WL-B-0003', customerName: 'Rajesh Patel', amount: '₹80,000', modeType: 'bank', modeLabel: 'Bank Transfer', ref: 'IMPS/2026/SBIN789012', remarks: 'Advance — Kashmir family trip', date: '01 Mar 2026', againstType: 'normal' },
    { id: 'REC-0004', against: 'WL-B-0003', customerName: 'Rajesh Patel', amount: '₹76,880', modeType: 'cheque', modeLabel: 'Cheque', ref: '—', remarks: 'Balance payment — Kashmir', date: '08 Mar 2026', againstType: 'normal' },
    { id: 'REC-0005', against: 'Advance', customerName: 'Priya Mehta', amount: '₹25,000', modeType: 'upi', modeLabel: 'Upi', ref: 'UPI/326541239876', remarks: 'Advance deposit — Rajastha...', date: '07 Mar 2026', againstType: 'advance' }
  ];

  const pendingPaymentsData = [
    { against: 'WL-B-0001', customerName: 'Vikram Iyer', total: '₹4,69,900', paid: '₹2,35,000', pending: '₹2,34,900', date: '10 Mar 2026' }
  ];

  const filteredAllPayments = allPaymentsData.filter(p => !customerSearch || p.customerName.toLowerCase().includes(customerSearch.toLowerCase()));
  const filteredPendingPayments = pendingPaymentsData.filter(p => !customerSearch || p.customerName.toLowerCase().includes(customerSearch.toLowerCase()));

  const toggleStat = (stat) => {
    setActiveTab(stat.type);
    setActiveStat(stat.id);
  };

  return (
    <div className="page-view fade-in">
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <h1 className="page-title">Payments</h1>
            <p className="page-subtitle">5 payments recorded</p>
          </div>
          <div className="dash-header-right">
            <ExportDropdown
              data={filteredAllPayments}
              columns={PAYMENTS_COLUMNS}
              sectionName="Payments"
            />
            <button className="new-quote-btn" onClick={() => setRecordPaymentOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Record Payment
            </button>
            <div style={{ position: 'relative' }}>
              <button className={`icon-btn log-btn ${isLogsOpen ? 'active' : ''}`} onClick={() => setIsLogsOpen(!isLogsOpen)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </button>
              {isLogsOpen && <LogsPopup onClose={() => setIsLogsOpen(false)} />}
            </div>
            <div className="header-user" style={{ cursor: 'pointer' }} onClick={() => openBilling()}>
              <div className="header-user-avatar">DA</div>
              <div className="header-user-info">
                <span className="header-user-name">Demo Admin</span>
                <span className="header-user-role"><span className="role-dot"></span> Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="payment-stats" style={{ marginTop: 0, marginBottom: 24 }}>
        {stats.map(stat => (
          <div 
            key={stat.id}
            className={`pstat-card ${activeStat === stat.id ? 'pstat-active' : ''} pstat-clickable`}
            onClick={() => toggleStat(stat)}
          >
            <div className={`pstat-icon pstat-icon-${stat.icon}`}>
              {stat.icon === 'green' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              {stat.icon === 'blue' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
              {(stat.icon === 'orange' || stat.icon === 'purple') && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
            </div>
            <div className="pstat-content">
              <span className="pstat-value">{stat.value}</span>
              <span className="pstat-label">
                {stat.label} {stat.info && <InfoBtn infoKey={stat.info} />}
              </span>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'advance' && (
        <div className="customers-filter-wrap" style={{ marginBottom: 20 }}>
          <div 
            className={`customers-dropdown ${isCustomerDropdownOpen ? 'open' : ''}`}
            onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <span>{customerFilter}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', transform: isCustomerDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
            
            {isCustomerDropdownOpen && (
              <div className="date-filter-dropdown" style={{ display: 'block', opacity: 1, visibility: 'visible', top: 'calc(100% + 4px)', left: 0, width: '100%', minWidth: 200 }}>
                {customers.map(c => (
                  <div 
                    key={c} 
                    className={`date-filter-option ${customerFilter === c ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomerFilter(c);
                      setIsCustomerDropdownOpen(false);
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'all' && (
        <div className="data-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>PAYMENT</th>
                <th>AGAINST</th>
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
                <th>AMOUNT</th>
                <th>MODE <InfoBtn infoKey="mode" /></th>
                <th>REFERENCE</th>
                <th>REMARKS</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllPayments.map(p => (
                <tr key={p.id}>
                  <td className="pay-id"><span className="pay-id-link" onClick={() => setPaymentDetailId(p.id)}>{p.id}</span></td>
                  <td className="pay-against">
                    {p.againstType === 'normal' ? p.against : <span className="type-badge type-corporate" style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}>Advance</span>}
                  </td>
                  <td className="qt-customer-name">{p.customerName}</td>
                  <td className="qt-amount">{p.amount}</td>
                  <td><span className={`mode-badge mode-${p.modeType}`}>{p.modeLabel}</span></td>
                  <td className="pay-ref">{p.ref}</td>
                  <td className="pay-remarks">{p.remarks}</td>
                  <td className="qt-date">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'pending' && (
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
                <th>TOTAL AMOUNT</th>
                <th>PAID</th>
                <th>PENDING <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4}}><polyline points="6 9 12 15 18 9"/></svg></th>
                <th>STATUS</th>
                <th>DATE <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4}}><polyline points="6 9 12 15 18 9"/></svg></th>
              </tr>
            </thead>
            <tbody>
              {filteredPendingPayments.map((p, idx) => (
                <tr key={idx}>
                  <td className="pay-against" style={{ color: '#f6ad55', fontWeight: 600 }}>{p.against}</td>
                  <td className="qt-customer-name">{p.customerName}</td>
                  <td className="qt-amount">{p.total}</td>
                  <td className="qt-amount" style={{ color: '#48bb78' }}>{p.paid}</td>
                  <td className="qt-amount" style={{ color: '#f6ad55' }}>{p.pending}</td>
                  <td><span className="status-badge status-partial">Partial</span></td>
                  <td className="qt-date">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'advance' && (
        <div className="data-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>PAYMENT #</th>
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
                <th>DESCRIPTION</th>
                <th>REMARKS</th>
                <th>CREDIT (₹) <InfoBtn infoKey="credit" /></th>
                <th>DEBIT (₹) <InfoBtn infoKey="debit" /></th>
              </tr>
            </thead>
            <tbody>
              {(customerFilter === 'All Customers' || customerFilter === 'Priya Mehta') && 
               (!customerSearch || 'Priya Mehta'.toLowerCase().includes(customerSearch.toLowerCase())) && (
                <tr>
                  <td className="qt-date">07 Mar 2026</td>
                  <td className="pay-id"><span className="pay-id-link" onClick={() => setPaymentDetailId('REC-0005')}>REC-0005</span></td>
                  <td className="qt-customer-name">Priya Mehta</td>
                  <td style={{ color: '#48bb78', fontWeight: 500 }}>Advance Deposit (upi)</td>
                  <td className="pay-remarks">Advance deposit — Rajastha...</td>
                  <td className="qt-amount" style={{ color: '#48bb78' }}>₹25,000</td>
                  <td className="qt-amount" style={{ color: '#f6ad55' }}>—</td>
                </tr>
              )}
              <tr className="table-total-row">
                <td colSpan="5" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Total</td>
                <td className="qt-amount" style={{ color: '#48bb78', fontWeight: 700 }}>₹25,000</td>
                <td className="qt-amount" style={{ color: '#f6ad55', fontWeight: 700 }}>₹0</td>
              </tr>
              <tr className="table-balance-row">
                <td colSpan="6" style={{ textAlign: 'right', fontWeight: 500, color: '#718096' }}>Balance</td>
                <td className="qt-amount" style={{ color: '#667eea', fontWeight: 800, fontSize: '1.1rem' }}>₹25,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <RecordPaymentModal
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        customers={demoCustomers}
        onSave={triggerDemoPopup}
      />

      {paymentDetailId && (
        <PaymentDetailModal
          paymentId={paymentDetailId}
          onClose={() => setPaymentDetailId(null)}
          getPaymentById={getDemoPaymentById}
          onSave={triggerDemoPopup}
        />
      )}
    </div>
  );
};
