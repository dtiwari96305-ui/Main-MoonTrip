import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../../shared/components/PageSkeleton';
import { ExportDropdown } from '../../shared/components/ExportDropdown';
import { RealHeader as Header } from '../components/RealHeader';
import { InvoiceDetailModal } from '../components/InvoiceDetailModal';
import { useData } from '../context/DataContext';

const INVOICES_COLUMNS = [
  { header: 'Invoice #',   key: 'id' },
  { header: 'Customer',    key: 'customerName' },
  { header: 'Booking Ref', key: 'bookingId' },
  { header: 'Amount (₹)',  key: 'amount' },
  { header: 'Status',      key: 'status' },
  { header: 'Date',        key: 'date' },
];

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

export const RealSalesInvoices = () => {
  const { invoices, settings } = useData();
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('real_salesinvoices_activeTab') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('real_salesinvoices_activeTab', activeTab);
  }, [activeTab]);

  // Filter invoices from stored collection
  let filteredInvoices = [...invoices];

  if (activeTab !== 'all') {
    filteredInvoices = filteredInvoices.filter(inv =>
      (inv.status || '').toLowerCase() === activeTab.toLowerCase()
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredInvoices = filteredInvoices.filter(inv =>
      (inv.id || '').toLowerCase().includes(q) ||
      (inv.customerName || '').toLowerCase().includes(q) ||
      (inv.destination || '').toLowerCase().includes(q) ||
      (inv.bookingId || '').toLowerCase().includes(q)
    );
  }

  if (customerSearch) {
    filteredInvoices = filteredInvoices.filter(inv =>
      (inv.customerName || '').toLowerCase().includes(customerSearch.toLowerCase())
    );
  }

  const handleRefresh = () => {
    setSearchQuery('');
    setCustomerSearch('');
    setShowCustomerSearch(false);
    setActiveTab('all');
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="page-view fade-in">
      <Header
        title="Sales Invoices"
        subtitle={`${filteredInvoices.length} invoice${filteredInvoices.length !== 1 ? 's' : ''}`}
        showNewQuote={false}
      />

      <div className="page-search-bar" style={{ marginBottom: 20 }}>
        <div className="search-input-wrap" style={{ maxWidth: '100%' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search by invoice number, customer or booking..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="page-search-bar" style={{ marginBottom: 20, gap: 12 }}>
        <div className="filter-tabs">
          {[
            { id: 'all',    label: 'All' },
            { id: 'unpaid', label: 'Unpaid' },
            { id: 'paid',   label: 'Paid' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className="icon-btn refresh-btn" onClick={handleRefresh}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <ExportDropdown
          data={filteredInvoices}
          columns={INVOICES_COLUMNS}
          sectionName="SalesInvoices"
        />
      </div>

      {isRefreshing ? (
        <TableSkeleton rows={3} cols={6} />
      ) : filteredInvoices.length > 0 ? (
        <div className="data-table-card" key={refreshKey}>
          <table className="data-table">
            <thead>
              <tr>
                <th>INVOICE #</th>
                <th>
                  AMOUNT&nbsp;
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                </th>
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
                <th>BOOKING REF</th>
                <th>STATUS</th>
                <th>
                  DATE&nbsp;
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="animate-row">
                  <td>
                    <span className="inv-id-link" onClick={() => setSelectedInvoice(inv)}>
                      {inv.id}
                    </span>
                  </td>
                  <td className="qt-amount">{inv.amount}</td>
                  <td className="qt-customer-name">{inv.customerName}</td>
                  <td className="bk-destination">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#94a3b8', flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {inv.destination}
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem' }}>{inv.bookingId}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${inv.status === 'Paid' ? 'status-completed' : 'status-sent'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="qt-date">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h3 className="empty-state-title">No invoices yet</h3>
          <p className="empty-state-desc">
            Invoices are created automatically when you convert an approved quote to a booking.
          </p>
        </div>
      )}

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          settings={settings}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
