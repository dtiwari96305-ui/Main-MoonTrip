import React from 'react';

const defaultStats = [
  { label: 'Total Customers', value: 6, iconClass: 'cstat-icon-orange',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: 'Individual', value: 4, iconClass: 'cstat-icon-red',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Corporate', value: 2, iconClass: 'cstat-icon-purple',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
];

export const CustomerStats = ({ stats = defaultStats }) => {
  return (
    <div className="customer-stats">
      {stats.map((s, i) => (
        <div key={i} className="cstat-card">
          <div className={`cstat-icon ${s.iconClass}`}>{s.icon}</div>
          <div className="cstat-content">
            <span className="cstat-value">{s.value}</span>
            <span className="cstat-label">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
