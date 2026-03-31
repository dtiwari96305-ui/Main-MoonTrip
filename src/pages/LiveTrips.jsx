import React, { useState, useEffect } from 'react';
import { Header } from '../shared/components/Header';
import { TableSkeleton } from '../shared/components/PageSkeleton';
import { useDemoData } from '../context/DemoContext';
import { openBookingDetail } from '../utils/bookingNav';
import { openCustomerProfile } from '../utils/customerNav';

const tabs = [
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming (7 Days)' }
];

export const LiveTrips = () => {
  const { bookings, customers } = useDemoData();
  const [activeFilter, setActiveFilter] = useState(() => sessionStorage.getItem('livetrips_activeFilter') || 'live');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const displayedBookings = bookings.filter(b => {
    // Demo simplified logic: 'live' shows in_progress, 'upcoming' shows confirmed
    const matchesTab = activeFilter === 'live' ? b.status === 'in_progress' : b.status === 'confirmed';
    const matchesSearch = !searchQuery || 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Persist filter changes
  useEffect(() => {
    sessionStorage.setItem('livetrips_activeFilter', activeFilter);
  }, [activeFilter]);

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
      <Header title="Live Trips" subtitle="0 active trips" showNewQuote={false} />

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
              {displayedBookings.length > 0 ? displayedBookings.map(b => (
                <tr key={b.id} className="animate-row">
                  <td><span className="qt-id cp-name-link" onClick={() => openBookingDetail(b.id, 'livetrips')}>{b.id}</span></td>
                  <td><span className="qt-customer-name cp-name-link" onClick={() => { const c = customers.find(x => x.name === b.customerName); if (c) openCustomerProfile(c.id, 'livetrips'); }}>{b.customerName}</span></td>
                  <td>
                    <span className="bk-destination">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#94a3b8',flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {b.destination}
                    </span>
                  </td>
                  <td><span className="qt-amount">{b.amount}</span></td>
                  <td><span className="qt-date">{b.date}</span></td>
                  <td><span className="qt-date">{b.date}</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ padding: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', padding: '60px 20px', minHeight: 300 }}>
                      <svg style={{ display: 'block', color: '#94a3b8', opacity: 0.6, marginBottom: 16, width: 64, height: 64 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.3.4-2.7 1.4l-.3.7 7.4 3.7-4.4 4.1-3-.7c-.6-.2-1.2 0-1.5.5L.2 17.1l3 1.9 1.9 3 1.1-.6c.5-.3.7-.9.5-1.5l-.7-3 4.1-4.4 3.7 7.4.7-.3c1-.4 1.7-1.6 1.4-2.7z"/>
                      </svg>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                        {activeFilter === 'live' ? 'No active trips' : 'No upcoming trips'}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {activeFilter === 'live' ? 'There are no trips currently in progress based on your filter' : 'No upcoming trips match your search'}
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
