import { useMemo } from 'react';
import { useDemoData } from '../../demo/context/DemoContext';
import { openQuoteDetail } from '../../utils/quoteNav';
import { openBookingDetail } from '../../utils/bookingNav';

const QuoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
  </svg>
);

const BookingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <polyline points="9 16 11 18 15 14"/>
  </svg>
);

const BADGE = {
  draft:     { bg: '#f3f4f6', color: '#6b7280' },
  sent:      { bg: '#dbeafe', color: '#2563eb' },
  approved:  { bg: '#dcfce7', color: '#16a34a' },
  converted: { bg: '#f3e8ff', color: '#9333ea' },
  rejected:  { bg: '#fee2e2', color: '#dc2626' },
  confirmed: { bg: '#dcfce7', color: '#16a34a' },
  completed: { bg: '#dcfce7', color: '#16a34a' },
  cancelled: { bg: '#fee2e2', color: '#dc2626' },
};

const timeAgo = (isoStr) => {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs  < 24) return `${hrs}h ago`;
  if (days < 7)  return `${days}d ago`;
  return new Date(isoStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const RecentActivityCard = () => {
  const { quotes, bookings } = useDemoData();

  const items = useMemo(() => {
    const all = [];

    quotes.forEach(q => all.push({
      key: q.uuid || q.id,
      type: 'quotes',
      refLabel: q.quoteNumber || q.id,
      badge: q.status,
      customer: q.customerName || '',
      amount: q.amount || '',
      ts: q.raw?.created_at || '',
      iconClass: 'ai-blue',
      onClick: () => openQuoteDetail(q.uuid, 'dashboard'),
    }));

    bookings.forEach(b => all.push({
      key: b.uuid || b.id,
      type: 'bookings',
      refLabel: b.bookingNumber || b.id,
      badge: null,
      customer: b.customerName || '',
      amount: b.amount || '',
      ts: b.raw?.created_at || '',
      iconClass: 'ai-green',
      onClick: () => openBookingDetail(b.uuid, 'dashboard'),
    }));

    return all
      .sort((a, b) => (b.ts ? new Date(b.ts).getTime() : 0) - (a.ts ? new Date(a.ts).getTime() : 0))
      .slice(0, 10);
  }, [quotes, bookings]);

  return (
    <div className="recent-activity-card">
      <div className="activity-header">
        <h3 className="activity-title">Recent Activity</h3>
        <p className="activity-subtitle">Latest quotes and bookings</p>
      </div>

      <div className="activity-list">
        {items.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
            No recent activity yet
          </div>
        ) : items.map(item => {
          const bs = item.badge ? (BADGE[item.badge] || BADGE.draft) : null;
          return (
            <div key={item.key} className="activity-item" onClick={item.onClick}>
              {/* Icon */}
              <div className={`activity-icon-wrap ${item.iconClass}`}>
                {item.type === 'bookings' ? <BookingIcon /> : <QuoteIcon />}
              </div>

              {/* Middle: ref + badge / customer */}
              <div className="activity-details">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
                  <span className="activity-ref">{item.refLabel}</span>
                  {bs && (
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      padding: '2px 8px', borderRadius: 20,
                      background: bs.bg, color: bs.color,
                      textTransform: 'capitalize', flexShrink: 0,
                    }}>
                      {item.badge.charAt(0).toUpperCase() + item.badge.slice(1)}
                    </span>
                  )}
                </div>
                {item.customer && (
                  <div className="activity-customer" style={{ marginTop: 2 }}>{item.customer}</div>
                )}
              </div>

              {/* Right: amount / time */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {item.amount && (
                  <div className="activity-amount">{item.amount}</div>
                )}
                <div className="activity-date" style={{ marginTop: 2 }}>{timeAgo(item.ts)}</div>
              </div>

              {/* Chevron */}
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
