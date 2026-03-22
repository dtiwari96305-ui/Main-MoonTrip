import React, { useState, useEffect } from 'react';
import { RealHeader as Header } from '../components/RealHeader';
import { TableSkeleton } from '../../shared/components/PageSkeleton';
import { ExportDropdown } from '../../shared/components/ExportDropdown';
import { useData } from '../context/DataContext';
import { openBookingDetail } from '../../utils/bookingNav';

const LIVETRIPS_COLUMNS = [
  { header: 'Booking #',   key: 'id' },
  { header: 'Customer',    key: 'customerName' },
  { header: 'Destination', key: 'destination' },
  { header: 'Total',       key: 'amount' },
  { header: 'From',        key: 'travelDate' },
  { header: 'To',          key: 'returnDate' },
];

const tabs = [
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming (7 Days)' },
];

export const RealLiveTrips = () => {
  const { bookings } = useData();
  const [activeFilter, setActiveFilter] = useState(() => sessionStorage.getItem('real_livetrips_activeFilter') || 'live');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    sessionStorage.setItem('real_livetrips_activeFilter', activeFilter);
  }, [activeFilter]);

  // Filter trips based on status
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const liveTrips = bookings.filter(b => b.status === 'ongoing' || b.status === 'live' || b.status === 'confirmed');
  const upcomingTrips = bookings.filter(b => {
    if (b.status === 'cancelled' || b.status === 'completed') return false;
    if (!b.travelDate) return false;
    try {
      const travelDate = new Date(b.travelDate.replace(/(\d{2})\s(\w{3})\s(\d{4})/, '$2 $1, $3'));
      return travelDate > now && travelDate <= sevenDaysLater;
    } catch { return false; }
  });

  const activeTrips = activeFilter === 'live'
    ? liveTrips.filter(b => b.status === 'ongoing' || b.status === 'live')
    : upcomingTrips;

  const filteredTrips = activeTrips.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (b.id || '').toLowerCase().includes(q) ||
      (b.customerName || '').toLowerCase().includes(q) ||
      (b.destination || '').toLowerCase().includes(q);
  });

  const handleRefresh = () => {
    setSearchQuery('');
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div id="view-livetrips" className="fade-in">
      <Header title="Live Trips" subtitle={`${filteredTrips.length} active trip${filteredTrips.length !== 1 ? 's' : ''}`} showNewQuote={false} />

      <div className="page-search-bar" style={{ marginBottom: 16 }}>
        <div className="search-input-wrap" style={{ flex: 1, maxWidth: '100%' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by booking number, customer, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="page-search-bar" style={{ marginBottom: 20, gap: 12 }}>
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
          data={filteredTrips}
          columns={LIVETRIPS_COLUMNS}
          sectionName="LiveTrips"
        />
      </div>

      {isRefreshing ? (
        <TableSkeleton rows={3} cols={6} />
      ) : (
        <div className="data-table-card" key={refreshKey}>
          <table className="data-table">
            <thead>
              <tr>
                <th>BOOKING#</th>
                <th>CUSTOMERS</th>
                <th>DESTINATION</th>
                <th>TOTAL</th>
                <th>FROM</th>
                <th>TO</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length > 0 ? filteredTrips.map(trip => (
                <tr key={trip.id} className="animate-row" style={{ cursor: 'pointer' }} onClick={() => openBookingDetail(trip.id, 'live-trips')}>
                  <td><span className="qt-id cp-name-link">{trip.id}</span></td>
                  <td><span className="qt-customer-name">{trip.customerName}</span></td>
                  <td>
                    <span className="bk-destination">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#94a3b8',flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {trip.destination}
                    </span>
                  </td>
                  <td><span className="qt-amount">{trip.amount}</span></td>
                  <td><span className="qt-date">{trip.travelDate || '—'}</span></td>
                  <td><span className="qt-date">{trip.returnDate || '—'}</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <svg style={{ color: '#94a3b8', marginBottom: 12 }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.3.4-2.7 1.4l-.3.7 7.4 3.7-4.4 4.1-3-.7c-.6-.2-1.2 0-1.5.5L.2 17.1l3 1.9 1.9 3 1.1-.6c.5-.3.7-.9.5-1.5l-.7-3 4.1-4.4 3.7 7.4.7-.3c1-.4 1.7-1.6 1.4-2.7z"/>
                    </svg>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                      {activeFilter === 'live' ? 'No active trips today' : 'No upcoming trips'}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {activeFilter === 'live' ? 'There are no trips happening right now' : 'No trips scheduled for the next 7 days'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
