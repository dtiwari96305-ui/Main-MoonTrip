import React from 'react';
import { Header } from '../../shared/components/Header';
import { useData } from '../context/DataContext';
import { EmptyState } from '../components/EmptyState';
import { openBookingDetail } from '../../utils/bookingNav';

export const RealLiveTrips = () => {
  const { bookings } = useData();
  const liveTrips = bookings.filter(b => b.status === 'ongoing' || b.status === 'live');

  return (
    <div id="view-livetrips" className="fade-in">
      <Header title="Live Trips" subtitle={`${liveTrips.length} active trip${liveTrips.length !== 1 ? 's' : ''}`} />

      {liveTrips.length === 0 ? (
        <EmptyState
          title="No live trips"
          description="Active trips will appear here when bookings are marked as ongoing."
        />
      ) : (
        <div className="data-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>BOOKING #</th>
                <th>CUSTOMER</th>
                <th>DESTINATION</th>
                <th>TRAVEL DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {liveTrips.map(trip => (
                <tr key={trip.id} className="animate-row">
                  <td><span className="qt-id cp-name-link" onClick={() => openBookingDetail(trip.id, 'live-trips')}>{trip.id}</span></td>
                  <td><span className="qt-customer-name">{trip.customerName}</span></td>
                  <td>
                    <span className="bk-destination">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#94a3b8',flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {trip.destination}
                    </span>
                  </td>
                  <td><span className="qt-date">{trip.travelDate}</span></td>
                  <td><span className="qt-amount">{trip.amount}</span></td>
                  <td><span className="status-pill status-approved">Live</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
