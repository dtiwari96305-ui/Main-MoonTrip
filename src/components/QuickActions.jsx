import React from 'react';

export const QuickActions = ({ onViewChange }) => {
  const actions = [
    {
      label: 'Create Quote', desc: 'Start a new travel quotation', iconClass: 'qa-icon-orange',
      view: 'create-quote',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    },
    {
      label: 'Add Customer', desc: 'Register a new customer', iconClass: 'qa-icon-blue',
      view: 'customers',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>
    },
    {
      label: 'View Bookings', desc: 'Track active bookings', iconClass: 'qa-icon-green',
      view: 'bookings',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    },
  ];

  return (
    <div className="quick-actions">
      {actions.map((a, i) => (
        <div 
          key={i} 
          className="quick-action-card" 
          onClick={() => onViewChange && onViewChange(a.view)}
          style={{ cursor: 'pointer' }}
        >
          <div className={`qa-icon-wrap ${a.iconClass}`}>{a.icon}</div>
          <div className="qa-text">
            <span className="qa-title">{a.label}</span>
            <span className="qa-desc">{a.desc}</span>
          </div>
          <div className="qa-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      ))}
    </div>
  );
};
