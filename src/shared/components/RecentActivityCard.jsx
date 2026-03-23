import React from 'react';
import { useDemoData } from '../../demo/context/DemoContext';
const icons = {
  quotes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  bookings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
};

export const RecentActivityCard = () => {
  const { activities, customers } = useDemoData();
  return (
    <div className="recent-activity-card">
      <div className="activity-header">
        <h3 className="activity-title">Recent Activity</h3>
        <p className="activity-subtitle">Latest quotes and bookings</p>
      </div>
      <div className="activity-list" id="recentActivityList">
        {activities.map((item, i) => (
          <div key={i} className="activity-item" data-view={item.type}>
            <div className={`activity-icon-wrap ${item.colorClass}`}>
              {icons[item.type]}
            </div>
            <div className="activity-details">
              <div className="activity-top-row">
                <span className="activity-ref cp-name-link" onClick={() => item.type === 'quotes' ? openQuoteDetail(item.id, 'dashboard') : openBookingDetail(item.id, 'dashboard')}>{item.id}</span>
                <span className="activity-amount">{item.amount}</span>
              </div>
              <div className="activity-bottom-row">
                <span className={`activity-badge ${item.status}`}>{item.statusLabel}</span>
                <span className="activity-date">{item.date}</span>
              </div>
              <span className="activity-customer cp-name-link" onClick={() => { const c = customers.find(x => x.name === item.customer); if (c) openCustomerProfile(c.id, 'dashboard'); }}>{item.customer}</span>
            </div>
            <div className="activity-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
