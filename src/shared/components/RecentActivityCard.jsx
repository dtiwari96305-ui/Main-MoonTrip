import React from 'react';
import { useDemoData } from '../../demo/context/DemoContext';
import { openQuoteDetail } from '../../utils/quoteNav';
import { openBookingDetail } from '../../utils/bookingNav';
import { openCustomerProfile } from '../../utils/customerNav';

const ICONS = {
  quotes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
    </svg>
  ),
  bookings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <polyline points="9 16 11 18 15 14"/>
    </svg>
  ),
  customers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

const BADGE_STYLE = {
  draft:     { background: '#f1f5f9', color: '#64748b' },
  sent:      { background: '#dbeafe', color: '#2563eb' },
  converted: { background: '#f3e8ff', color: '#7c3aed' },
  confirmed: { background: '#dcfce7', color: '#16a34a' },
  rejected:  { background: '#fee2e2', color: '#dc2626' },
  cancelled: { background: '#fee2e2', color: '#dc2626' },
  completed: { background: '#dcfce7', color: '#16a34a' },
};

const ICON_CLASS = {
  quotes_draft:     'ai-blue',
  quotes_sent:      'ai-blue',
  quotes_converted: 'ai-purple',
  quotes_rejected:  'ai-orange',
  bookings:         'ai-green',
  customers:        'ai-orange',
};

const timeAgo = (isoStr) => {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const RecentActivityCard = () => {
  const { activities, customers, quotes, bookings } = useDemoData();

  const enrich = (item) => {
    if (item.type === 'quotes') {
      const q = quotes.find(q => q.uuid === item.referenceId);
      return {
        label: q ? (q.quoteNumber || q.id) : (item.title || '—'),
        badge: q ? q.status : null,
        customer: q ? q.customerName : '',
        amount: q ? q.amount : '',
        iconClass: ICON_CLASS[`quotes_${q?.status}`] || 'ai-blue',
        onClick: () => { if (item.referenceId) openQuoteDetail(item.referenceId, 'dashboard'); },
      };
    }
    if (item.type === 'bookings') {
      const b = bookings.find(b => b.uuid === item.referenceId);
      return {
        label: b ? (b.bookingNumber || b.id) : (item.title || '—'),
        badge: b ? b.status : 'confirmed',
        customer: b ? b.customerName : '',
        amount: b ? b.amount : '',
        iconClass: 'ai-green',
        onClick: () => { if (item.referenceId) openBookingDetail(item.referenceId, 'dashboard'); },
      };
    }
    if (item.type === 'customers') {
      const c = customers.find(c => c.id === item.referenceId);
      return {
        label: c ? c.name : (item.title || '—'),
        badge: null,
        customer: c ? (c.phone || c.email || '') : '',
        amount: '',
        iconClass: 'ai-orange',
        onClick: () => { if (item.referenceId) openCustomerProfile(item.referenceId, 'dashboard'); },
      };
    }
    return { label: item.title || '—', badge: null, customer: '', amount: '', iconClass: 'ai-blue', onClick: () => {} };
  };

  return (
    <div className="recent-activity-card">
      <div className="activity-header">
        <h3 className="activity-title">Recent Activity</h3>
        <p className="activity-subtitle">Latest quotes and bookings</p>
      </div>
      <div className="activity-list" id="recentActivityList">
        {activities.map((item, i) => {
          const { label, badge, customer, amount, iconClass, onClick } = enrich(item);
          const bs = badge ? (BADGE_STYLE[badge] || BADGE_STYLE.draft) : null;
          return (
            <div key={i} className="activity-item" onClick={onClick}>
              <div className={`activity-icon-wrap ${iconClass}`}>
                {ICONS[item.type] || ICONS.quotes}
              </div>

              {/* Middle — ref + badge + customer */}
              <div className="activity-details">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span className="activity-ref">{label}</span>
                  {bs && (
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 600,
                      padding: '2px 7px', borderRadius: 4,
                      background: bs.background, color: bs.color,
                      textTransform: 'capitalize',
                    }}>
                      {badge.charAt(0).toUpperCase() + badge.slice(1)}
                    </span>
                  )}
                </div>
                {customer && (
                  <div className="activity-customer">{customer}</div>
                )}
              </div>

              {/* Right — amount + time */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {amount && (
                  <div className="activity-amount" style={{ marginBottom: 3 }}>{amount}</div>
                )}
                <div className="activity-date">{timeAgo(item.createdAt)}</div>
              </div>

              <div className="activity-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
