import React from 'react';

const activities = [
  { id: 'WL-Q-0001', type: 'quotes', amount: '₹1,40,952', status: 'converted', statusLabel: 'Converted', date: '09 Mar 2026', customer: 'Rahul Sharma', colorClass: 'ai-purple' },
  { id: 'WL-Q-0002', type: 'quotes', amount: '₹1,10,520', status: 'sent', statusLabel: 'Sent', date: '09 Mar 2026', customer: 'Priya Mehta', colorClass: 'ai-blue' },
  { id: 'WL-Q-0003', type: 'quotes', amount: '₹4,69,900', status: 'converted', statusLabel: 'Converted', date: '09 Mar 2026', customer: 'Vikram Iyer', colorClass: 'ai-purple' },
  { id: 'WL-Q-0004', type: 'quotes', amount: '₹2,34,900', status: 'draft', statusLabel: 'Draft', date: '08 Mar 2026', customer: 'Ankit Verma', colorClass: 'ai-orange' },
  { id: 'WL-B-0089', type: 'bookings', amount: '₹1,56,880', status: 'converted', statusLabel: 'Completed', date: '07 Mar 2026', customer: 'Rajesh Patel', colorClass: 'ai-green' },
  { id: 'WL-Q-0005', type: 'quotes', amount: '₹85,000', status: 'sent', statusLabel: 'Sent', date: '06 Mar 2026', customer: 'Sneha Kapoor', colorClass: 'ai-blue' },
  { id: 'WL-B-0088', type: 'bookings', amount: '₹6,10,852', status: 'converted', statusLabel: 'Active', date: '05 Mar 2026', customer: 'Rahul Sharma', colorClass: 'ai-green' },
];

const icons = {
  quotes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  bookings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
};

export const RecentActivityCard = () => {
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
                <span className="activity-ref">{item.id}</span>
                <span className="activity-amount">{item.amount}</span>
              </div>
              <div className="activity-bottom-row">
                <span className={`activity-badge ${item.status}`}>{item.statusLabel}</span>
                <span className="activity-date">{item.date}</span>
              </div>
              <span className="activity-customer">{item.customer}</span>
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
