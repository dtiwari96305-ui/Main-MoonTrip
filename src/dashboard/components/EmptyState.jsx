import React from 'react';

export const EmptyState = ({
  icon,
  title = 'No data yet',
  description = 'Get started by adding your first entry.',
  actionLabel,
  onAction,
}) => (
  <div className="empty-state-card">
    <div className="empty-icon-wrap">
      {icon || (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      )}
    </div>
    <h3 className="empty-state-title">{title}</h3>
    <p className="empty-state-desc">{description}</p>
    {actionLabel && onAction && (
      <button
        className="btn-primary"
        onClick={onAction}
        style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--accent, #667eea)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);
