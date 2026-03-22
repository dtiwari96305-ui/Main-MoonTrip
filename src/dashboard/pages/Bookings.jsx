import React, { useState } from 'react';
import { Header } from '../../shared/components/Header';
import { BookingsTable } from '../../shared/components/BookingsTable';
import { TableSkeleton } from '../../shared/components/PageSkeleton';
import { ExportDropdown } from '../../shared/components/ExportDropdown';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useData } from '../context/DataContext';

const BOOKINGS_COLUMNS = [
  { header: 'Booking #',    key: 'id' },
  { header: 'Customer',     key: 'customerName' },
  { header: 'Destination',  key: 'destination' },
  { header: 'Travel Date',  key: 'travelDate' },
  { header: 'Amount (₹)',   key: 'amount' },
  { header: 'Status',       key: 'status' },
];

export const RealBookings = () => {
  const { bookings, customers, updateBooking, deleteBooking } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAction = (actionType, bookingId) => {
    if (actionType === 'cancel') {
      updateBooking(bookingId, { status: 'cancelled' });
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
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div id="view-bookings" className="fade-in">
      <Header
        title="Bookings"
        subtitle={`${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`}
      />

      <div className="page-search-bar" style={{ marginBottom: 20 }}>
        <div className="search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="icon-btn refresh-btn" title="Refresh" onClick={handleRefresh}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <ExportDropdown
          data={bookings}
          columns={BOOKINGS_COLUMNS}
          sectionName="Bookings"
        />
      </div>

      {isRefreshing ? (
        <TableSkeleton rows={5} cols={6} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Bookings will appear here when quotes are converted."
        />
      ) : (
        <BookingsTable
          key={refreshKey}
          bookings={bookings}
          customers={customers}
          onAction={handleAction}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Confirm Delete"
        message={`Are you sure you want to delete booking ${deleteTarget}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
