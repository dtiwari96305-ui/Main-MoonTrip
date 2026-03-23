import React, { useState, useEffect } from 'react';
import { RealHeader as Header } from '../components/RealHeader';
import { BookingsTable } from '../../shared/components/BookingsTable';
import { TableSkeleton } from '../../shared/components/PageSkeleton';
import { ExportDropdown } from '../../shared/components/ExportDropdown';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { CancelBookingModal } from '../components/CancelBookingModal';
import { useData } from '../context/DataContext';

const BOOKINGS_COLUMNS = [
  { header: 'Booking #',   key: 'id' },
  { header: 'Customer',    key: 'customerName' },
  { header: 'Destination', key: 'destination' },
  { header: 'Date',        key: 'date' },
  { header: 'Total (₹)',   key: 'amount' },
  { header: 'Status',      key: 'status' },
];

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export const RealBookings = () => {
  const { bookings, customers, invoices, updateBooking, deleteBooking, updateInvoice, deleteInvoice } = useData();
  const [activeFilter, setActiveFilter] = useState(() => sessionStorage.getItem('real_bookings_activeFilter') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('real_bookings_activeFilter', activeFilter);
  }, [activeFilter]);

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = activeFilter === 'all' || b.status === activeFilter;
    const matchesSearch = searchQuery === '' ||
      (b.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.destination || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCancelNote = ({ invoice }) => {
    updateBooking(cancelTarget.id, { status: 'cancelled' });
    if (invoice) updateInvoice(invoice.id, { status: 'Cancelled' });
    setCancelTarget(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleVoid = ({ invoice }) => {
    updateBooking(cancelTarget.id, { status: 'cancelled' });
    if (invoice) deleteInvoice(invoice.id);
    setCancelTarget(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleAction = (actionType, bookingId) => {
    if (actionType === 'cancel') {
      const booking = bookings.find(b => b.id === bookingId);
      setCancelTarget(booking || { id: bookingId });
      return;
    } else if (actionType === 'complete') {
      updateBooking(bookingId, { status: 'completed' });
    } else if (actionType === 'reopen') {
      updateBooking(bookingId, { status: 'confirmed' });
    } else if (actionType === 'delete') {
      setDeleteTarget(bookingId);
      return;
    }
    setRefreshKey(prev => prev + 1);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteBooking(deleteTarget);
      setDeleteTarget(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div id="view-bookings" className="fade-in">
      <Header title="Bookings" subtitle={`${filteredBookings.length} total booking${filteredBookings.length !== 1 ? 's' : ''}`} showNewQuote={false} />

      <div className="page-search-bar">
        <div className="search-input-wrap" style={{flex: 1, maxWidth: '100%'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by booking number or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="page-search-bar" style={{marginTop: 12, marginBottom: 20}}>
        <div className="filter-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className="icon-btn refresh-btn" title="Refresh" onClick={handleRefresh}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <ExportDropdown
          data={filteredBookings}
          columns={BOOKINGS_COLUMNS}
          sectionName="Bookings"
        />
      </div>

      {isRefreshing ? (
        <TableSkeleton rows={3} cols={9} />
      ) : filteredBookings.length > 0 ? (
        <BookingsTable key={refreshKey} bookings={filteredBookings} customers={customers} onAction={handleAction} />
      ) : activeFilter === 'cancelled' ? (
        <div className="data-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>BOOKING #</th>
                <th>CUSTOMER</th>
                <th>DESTINATION</th>
                <th>TOTAL <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4,marginLeft:4}}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></th>
                <th>PROFIT</th>
                <th>PAYMENT</th>
                <th>REMAINING <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4,marginLeft:4}}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></th>
                <th>STATUS</th>
                <th>DATE <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4,marginLeft:4}}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div className="empty-state-card" style={{borderTop:'none',boxShadow:'none'}}>
            <div className="empty-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h3 className="empty-state-title">No cancelled bookings</h3>
            <p className="empty-state-desc">Cancelled bookings will appear here.</p>
          </div>
        </div>
      ) : activeFilter === 'completed' ? (
        <div className="data-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>BOOKING #</th>
                <th>CUSTOMER</th>
                <th>DESTINATION</th>
                <th>TOTAL <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4,marginLeft:4}}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></th>
                <th>PROFIT</th>
                <th>PAYMENT</th>
                <th>REMAINING <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4,marginLeft:4}}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></th>
                <th>STATUS</th>
                <th>DATE <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4,marginLeft:4}}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div className="empty-state-card" style={{borderTop:'none',boxShadow:'none'}}>
            <div className="empty-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="empty-state-title">No completed bookings</h3>
            <p className="empty-state-desc">Completed bookings will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <h3 className="empty-state-title">No bookings found</h3>
          <p className="empty-state-desc">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Confirm Delete"
        message={`Are you sure you want to delete booking ${deleteTarget}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {cancelTarget && (
        <CancelBookingModal
          booking={cancelTarget}
          invoices={invoices}
          onClose={() => setCancelTarget(null)}
          onCancelNote={handleCancelNote}
          onVoid={handleVoid}
        />
      )}
    </div>
  );
};
