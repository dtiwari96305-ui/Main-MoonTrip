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

function parseDate(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function startOfDay(d) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export const RealLiveTrips = () => {
  const { bookings } = useData();
  const [activeFilter, setActiveFilter] = useState(() => sessionStorage.getItem('real_livetrips_activeFilter') || 'live');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    sessionStorage.setItem('real_livetrips_activeFilter', activeFilter);
  }, [activeFilter]);

  const today = startOfDay(new Date());
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Live: departure_date <= today AND (return_date >= today OR no return_date and departure_date == today)
  // Only confirmed/ongoing bookings (not cancelled/completed)
  const liveTrips = bookings.filter(b => {
    if (b.status === 'cancelled' || b.status === 'completed') return false;
    const dep = parseDate(b.departureDateRaw);
    if (!dep) return false;
    const depDay = startOfDay(dep);
    const ret = parseDate(b.returnDateRaw);
    if (ret) {
      const retDay = startOfDay(ret);
      return depDay <= today && retDay >= today;
    }
    // No return date: consider live if departure is today
    return depDay.getTime() === today.getTime();
  });

  // Upcoming: departure_date is after today and within next 7 days
  const upcomingTrips = bookings.filter(b => {
    if (b.status === 'cancelled' || b.status === 'completed') return false;
    const dep = parseDate(b.departureDateRaw);
    if (!dep) return false;
    const depDay = startOfDay(dep);
    return depDay > today && depDay <= sevenDaysLater;
  });

  const activeTrips = activeFilter === 'live' ? liveTrips : upcomingTrips;

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

  const getDaysLabel = (b) => {
    const dep = parseDate(b.departureDateRaw);
    if (!dep) return '';
    const depDay = startOfDay(dep);
    const diffMs = depDay.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return '';
  };

  const getStatusBadge = (b) => {
    if (activeFilter === 'live') {
      return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#dcfce7', color: '#16a34a' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', animation: 'pulse 2s infinite' }}></span>
        Live
      </span>;
    }
    const label = getDaysLabel(b);
    return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#dbeafe', color: '#2563eb' }}>
      {label}
    </span>;
  };

  return (
    <div id="view-livetrips" className="fade-in">
      <Header title="Live Trips" subtitle={`${filteredTrips.length} ${activeFilter === 'live' ? 'active' : 'upcoming'} trip${filteredTrips.length !== 1 ? 's' : ''}`} showNewQuote={false} />

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
              {tab.id === 'live' && liveTrips.length > 0 && (
                <span style={{ marginLeft: 6, fontSize: '0.7rem', background: '#16a34a', color: '#fff', borderRadius: 10, padding: '1px 7px', fontWeight: 700 }}>{liveTrips.length}</span>
              )}
              {tab.id === 'upcoming' && upcomingTrips.length > 0 && (
                <span style={{ marginLeft: 6, fontSize: '0.7rem', background: '#2563eb', color: '#fff', borderRadius: 10, padding: '1px 7px', fontWeight: 700 }}>{upcomingTrips.length}</span>
              )}
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
        <TableSkeleton rows={3} cols={7} />
      ) : (
        <div className="data-table-card" key={refreshKey}>
          <table className="data-table">
            <thead>
              <tr>
                <th>BOOKING#</th>
                <th>CUSTOMER</th>
                <th>DESTINATION</th>
                <th>PAX</th>
                <th>TOTAL</th>
                <th>TRAVEL DATE</th>
                <th>RETURN DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length > 0 ? filteredTrips.map(trip => (
                <tr key={trip.id} className="animate-row" style={{ cursor: 'pointer' }} onClick={() => openBookingDetail(trip.id, 'livetrips')}>
                  <td><span className="qt-id cp-name-link">{trip.id}</span></td>
                  <td><span className="qt-customer-name">{trip.customerName}</span></td>
                  <td>
                    <span className="bk-destination">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#94a3b8',flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {trip.destination || '—'}
                    </span>
                  </td>
                  <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{trip.pax || '—'}</span></td>
                  <td><span className="qt-amount">{trip.amount}</span></td>
                  <td><span className="qt-date">{trip.travelDate || '—'}</span></td>
                  <td><span className="qt-date">{trip.returnDate || '—'}</span></td>
                  <td>{getStatusBadge(trip)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{ padding: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', padding: '60px 20px', minHeight: 300 }}>
                      <svg style={{ display: 'block', color: '#94a3b8', opacity: 0.6, marginBottom: 16, width: 64, height: 64 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.3.4-2.7 1.4l-.3.7 7.4 3.7-4.4 4.1-3-.7c-.6-.2-1.2 0-1.5.5L.2 17.1l3 1.9 1.9 3 1.1-.6c.5-.3.7-.9.5-1.5l-.7-3 4.1-4.4 3.7 7.4.7-.3c1-.4 1.7-1.6 1.4-2.7z"/>
                      </svg>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                        {activeFilter === 'live' ? 'No active trips right now' : 'No upcoming trips in 7 days'}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {activeFilter === 'live'
                          ? 'Bookings with travel dates covering today will automatically appear here'
                          : 'Bookings with travel dates in the next 7 days will show here'}
                      </p>
                    </div>
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
