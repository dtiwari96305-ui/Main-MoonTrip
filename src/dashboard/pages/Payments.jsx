import React, { useState, useEffect, useMemo } from 'react';
import { InfoBtn } from '../../shared/components/InfoBtn';
import { RecordPaymentModal } from '../../shared/components/RecordPaymentModal';
import { PaymentDetailModal } from '../../shared/components/PaymentDetailModal';
import { ExportDropdown } from '../../shared/components/ExportDropdown';
import { RealHeader as Header } from '../components/RealHeader';
import { useData } from '../context/DataContext';

const PAYMENTS_COLUMNS = [
  { header: 'Payment #',  key: 'id' },
  { header: 'Customer',   key: 'customerName' },
  { header: 'Method',     key: 'modeLabel' },
  { header: 'Amount (₹)', key: 'amount' },
  { header: 'Type',       key: 'againstType' },
  { header: 'Date',       key: 'date' },
];

const FunnelIcon = ({ active, onClick }) => (
  <span className={`th-search-btn ${active ? 'active' : ''}`} onClick={onClick}>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: active ? 1 : 0.4 }}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  </span>
);

function parseAmt(str) {
  if (typeof str === 'number') return str;
  return parseInt((str || '0').replace(/[₹,\s]/g, ''), 10) || 0;
}

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}

export const RealPayments = () => {
  const { payments, bookings, customers, addPayment, updatePayment, deletePayment, getPaymentById } = useData();
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('real_payments_activeTab') || 'all');
  const [activeStat, setActiveStat] = useState(() => sessionStorage.getItem('real_payments_activeStat') || 'totalReceived');
  const [customerFilter, setCustomerFilter] = useState('All Customers');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [paymentDetailId, setPaymentDetailId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  useEffect(() => {
    sessionStorage.setItem('real_payments_activeTab', activeTab);
    sessionStorage.setItem('real_payments_activeStat', activeStat);
  }, [activeTab, activeStat]);

  // Computed stats from real data
  const totalReceived = useMemo(() => payments.reduce((sum, p) => sum + parseAmt(p.amount), 0), [payments]);
  const transactionCount = payments.length;
  const pendingPayments = useMemo(() => {
    const bookingTotal = bookings.reduce((s, b) => s + parseAmt(b.amount), 0);
    return Math.max(0, bookingTotal - totalReceived);
  }, [bookings, totalReceived]);
  const advanceBalance = useMemo(() => {
    return payments
      .filter(p => p.againstType === 'advance' || p.badge === 'Advance' || (p.against || '').toLowerCase() === 'advance')
      .reduce((sum, p) => sum + parseAmt(p.amount), 0);
  }, [payments]);

  const stats = [
    { id: 'totalReceived', label: 'Total Received', value: fmtINR(totalReceived), icon: 'green', type: 'all' },
    { id: 'transactions', label: 'Transactions', value: String(transactionCount), icon: 'blue', type: 'all' },
    { id: 'pending', label: 'Pending Payments', value: fmtINR(pendingPayments), icon: 'orange', type: 'pending' },
    { id: 'advance', label: 'Advance Balance', value: fmtINR(advanceBalance), icon: 'purple', type: 'advance', info: 'advance' },
  ];

  // Unique customer names for dropdown
  const customerNames = useMemo(() => {
    const names = new Set(payments.map(p => p.customerName).filter(Boolean));
    return ['All Customers', ...Array.from(names)];
  }, [payments]);

  // Data for All tab
  const allPaymentsData = payments.map(p => ({
    ...p,
    againstType: p.againstType || (p.badge === 'Advance' ? 'advance' : 'normal'),
    against: p.against || p.bookingRef || '—',
  }));

  // Data for Pending tab
  const pendingPaymentsData = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'cancelled')
      .map(b => {
        const bookingAmt = parseAmt(b.amount);
        const paidForBooking = payments
          .filter(p => p.against === b.id || p.bookingRef === b.id)
          .reduce((s, p) => s + parseAmt(p.amount), 0);
        const pending = Math.max(0, bookingAmt - paidForBooking);
        if (pending <= 0) return null;
        return {
          against: b.id,
          customerName: b.customerName,
          total: b.amount || fmtINR(bookingAmt),
          paid: fmtINR(paidForBooking),
          pending: fmtINR(pending),
          date: b.createdDate || b.date || '',
        };
      })
      .filter(Boolean);
  }, [bookings, payments]);

  // Data for Advance tab
  const advancePaymentsData = useMemo(() => {
    return payments.filter(p =>
      p.againstType === 'advance' || p.badge === 'Advance' || (p.against || '').toLowerCase() === 'advance'
    );
  }, [payments]);

  // Apply customer search filter
  const filteredAllPayments = allPaymentsData.filter(p => !customerSearch || (p.customerName || '').toLowerCase().includes(customerSearch.toLowerCase()));
  const filteredPendingPayments = pendingPaymentsData.filter(p => !customerSearch || (p.customerName || '').toLowerCase().includes(customerSearch.toLowerCase()));
  const filteredAdvancePayments = advancePaymentsData.filter(p => {
    const matchesCustomerFilter = customerFilter === 'All Customers' || p.customerName === customerFilter;
    const matchesSearch = !customerSearch || (p.customerName || '').toLowerCase().includes(customerSearch.toLowerCase());
    return matchesCustomerFilter && matchesSearch;
  });

  const advanceTotalCredit = filteredAdvancePayments.reduce((s, p) => s + parseAmt(p.amount), 0);

  const toggleStat = (stat) => {
    setActiveTab(stat.type);
    setActiveStat(stat.id);
  };

  const handleSavePayment = (formData) => {
    addPayment(formData);
    setRecordPaymentOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const handlePaymentAction = (action, paymentId, data) => {
    if (action === 'save' && data) {
      updatePayment(paymentId, data);
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div className="page-view fade-in">
      <Header title="Payments" subtitle={`${payments.length} payment${payments.length !== 1 ? 's' : ''} recorded`} showNewQuote={false}>
        <ExportDropdown
          data={filteredAllPayments}
          columns={PAYMENTS_COLUMNS}
          sectionName="Payments"
        />
        <button className="new-quote-btn" onClick={() => setRecordPaymentOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Record Payment
        </button>
      </Header>

      {/* ── 4 Stat Cards ── */}
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

      {/* ── Advance Customer Dropdown ── */}
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
                {customerNames.map(c => (
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

      {/* ── All Payments Table ── */}
      {activeTab === 'all' && (
        <div className="data-table-card" key={refreshKey}>
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
              {filteredAllPayments.length > 0 ? filteredAllPayments.map(p => (
                <tr key={p.id}>
                  <td className="pay-id"><span className="pay-id-link" onClick={() => setPaymentDetailId(p.id)}>{p.id}</span></td>
                  <td className="pay-against">
                    {(p.againstType === 'advance' || p.badge === 'Advance')
                      ? <span className="type-badge type-corporate" style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}>Advance</span>
                      : (p.against || '—')}
                  </td>
                  <td className="qt-customer-name">{p.customerName}</td>
                  <td className="qt-amount">{p.amount}</td>
                  <td><span className={`mode-badge mode-${p.modeType}`}>{p.modeLabel}</span></td>
                  <td className="pay-ref">{p.ref || p.reference || '—'}</td>
                  <td className="pay-remarks">{p.remarks || '—'}</td>
                  <td className="qt-date">{p.date}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div className="empty-icon-wrap" style={{ margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <h3 className="empty-state-title">No payments recorded</h3>
                    <p className="empty-state-desc">Record your first payment to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pending Payments Table ── */}
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
              {filteredPendingPayments.length > 0 ? filteredPendingPayments.map((p, idx) => (
                <tr key={idx}>
                  <td className="pay-against" style={{ color: '#f6ad55', fontWeight: 600 }}>{p.against}</td>
                  <td className="qt-customer-name">{p.customerName}</td>
                  <td className="qt-amount">{p.total}</td>
                  <td className="qt-amount" style={{ color: '#48bb78' }}>{p.paid}</td>
                  <td className="qt-amount" style={{ color: '#f6ad55' }}>{p.pending}</td>
                  <td><span className="status-badge status-partial">Partial</span></td>
                  <td className="qt-date">{p.date}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div className="empty-icon-wrap" style={{ margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <h3 className="empty-state-title">No pending payments</h3>
                    <p className="empty-state-desc">All bookings are fully paid.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Advance Table ── */}
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
              {filteredAdvancePayments.length > 0 ? (
                <>
                  {filteredAdvancePayments.map(p => (
                    <tr key={p.id}>
                      <td className="qt-date">{p.date}</td>
                      <td className="pay-id"><span className="pay-id-link" onClick={() => setPaymentDetailId(p.id)}>{p.id}</span></td>
                      <td className="qt-customer-name">{p.customerName}</td>
                      <td style={{ color: '#48bb78', fontWeight: 500 }}>Advance Deposit ({p.modeType || p.modeLabel || 'other'})</td>
                      <td className="pay-remarks">{p.remarks || '—'}</td>
                      <td className="qt-amount" style={{ color: '#48bb78' }}>{p.amount}</td>
                      <td className="qt-amount" style={{ color: '#f6ad55' }}>—</td>
                    </tr>
                  ))}
                  <tr className="table-total-row">
                    <td colSpan="5" style={{ fontWeight: 600, textTransform: 'uppercase' }}>Total</td>
                    <td className="qt-amount" style={{ color: '#48bb78', fontWeight: 700 }}>{fmtINR(advanceTotalCredit)}</td>
                    <td className="qt-amount" style={{ color: '#f6ad55', fontWeight: 700 }}>₹0</td>
                  </tr>
                  <tr className="table-balance-row">
                    <td colSpan="6" style={{ textAlign: 'right', fontWeight: 500, color: '#718096' }}>Balance</td>
                    <td className="qt-amount" style={{ color: '#667eea', fontWeight: 800, fontSize: '1.1rem' }}>{fmtINR(advanceTotalCredit)}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div className="empty-icon-wrap" style={{ margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <h3 className="empty-state-title">No advance payments</h3>
                    <p className="empty-state-desc">Advance deposits will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <RecordPaymentModal
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        customers={customers}
        bookings={bookings}
        onSave={handleSavePayment}
      />

      {paymentDetailId && (
        <PaymentDetailModal
          paymentId={paymentDetailId}
          onClose={() => setPaymentDetailId(null)}
          getPaymentById={getPaymentById}
          onSave={handlePaymentAction}
        />
      )}
    </div>
  );
};
