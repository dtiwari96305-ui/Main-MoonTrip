import React, { useRef, useEffect } from 'react';

// Mapping exact visual styling for every activity type
const getIconConfig = (activity) => {
  const { type, action } = activity;
  const isType = (t) => type === t;
  const isAct = (a) => action === a;

  // New Customer Added
  if (isType('customer') && (isAct('added') || isAct('updated') || isAct('deleted'))) {
    return {
      bg: '#ffedd5', color: '#f97316',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 11h-6"/><path d="M20 8v6"/></svg>
    };
  }

  // Quote Converted
  if (isType('quote') && isAct('converted')) {
    return {
      bg: '#dcfce7', color: '#16a34a',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    };
  }

  // Quote Created / Updated
  if (isType('quote') && (isAct('created') || isAct('updated') || isAct('status-changed') || isAct('deleted'))) {
    return {
      bg: '#dbeafe', color: '#3b82f6',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    };
  }

  // Booking Cancellation
  if (isType('booking') && isAct('cancelled')) {
    return {
      bg: '#fee2e2', color: '#dc2626',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    };
  }

  // Booking Status Changed
  if (isType('booking') && (isAct('updated') || isAct('completed') || isAct('deleted'))) {
    return {
      bg: '#ede9fe', color: '#7c3aed',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    };
  }

  // Booking Created
  if (isType('booking') && isAct('created')) {
    return {
      bg: '#dcfce7', color: '#16a34a',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    };
  }

  // Payment Recorded / Advance Payment Recorded / Updated
  if (isType('payment')) {
    return {
      bg: '#dcfce7', color: '#16a34a',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    };
  }

  // Default
  return {
    bg: '#f1f5f9', color: '#64748b',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  };
};

const getTitle = (activity) => {
  const { type, action } = activity;
  if (type === 'customer' && action === 'added') return 'New Customer Added';
  if (type === 'customer' && action === 'updated') return 'Customer Updated';
  if (type === 'customer' && action === 'deleted') return 'Customer Deleted';
  if (type === 'quote' && action === 'created') return 'Quote Created';
  if (type === 'quote' && action === 'updated') return 'Quote Updated';
  if (type === 'quote' && action === 'status-changed') return 'Quote Updated';
  if (type === 'quote' && action === 'converted') return 'Quote Converted to Booking';
  if (type === 'booking' && action === 'created') return 'Booking Created';
  if (type === 'booking' && action === 'updated') return 'Booking Updated';
  if (type === 'booking' && action === 'completed') return 'Booking Completed';
  if (type === 'booking' && action === 'cancelled') return 'Booking Cancelled';
  if (type === 'payment' && action === 'recorded') return 'Payment Recorded';
  if (type === 'payment' && action === 'advance-recorded') return 'Advance Payment Recorded';
  return 'Activity';
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const ctxDate = new Date(timestamp);
  const nowCtx = new Date(now);
  
  // Checking "Yesterday"
  const isYesterday = (
    nowCtx.getDate() - ctxDate.getDate() === 1 && 
    nowCtx.getMonth() === ctxDate.getMonth() && 
    nowCtx.getFullYear() === ctxDate.getFullYear()
  );
  if (isYesterday) return 'Yesterday';

  const dateOptions = { day: 'numeric', month: 'short' };
  return ctxDate.toLocaleDateString('en-GB', dateOptions);
};

export const LogPopup = ({ activities, readIds, onMarkAllRead, onEntryClick, onClose }) => {
  const popupRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Allow button clicks to toggle without triggering immediate close re-renders if required
      if (document.getElementById('logBtnMain') && document.getElementById('logBtnMain').contains(e.target)) return;
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    // use a slight delay so that it ignores the initial mousedown that might have opened it
    const t = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 10);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const hasUnread = activities.some((_, i) => !readIds.includes(i));

  return (
    <>
      <style>{`
        .univ-log-popup {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          width: 380px;
          max-height: 480px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
          z-index: 9999;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .univ-log-header {
          height: 52px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f3f4f6;
          flex-shrink: 0;
        }
        .univ-log-header h3 {
          margin: 0;
          color: #111827;
          font-size: 16px;
          font-weight: 700;
        }
        .univ-log-mark-read {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #16a34a;
          font-size: 13px;
          cursor: pointer;
        }
        .univ-log-list {
          overflow-y: auto;
          overflow-x: hidden;
          max-height: 428px;
        }
        .univ-log-list::-webkit-scrollbar {
          width: 6px;
        }
        .univ-log-list::-webkit-scrollbar-track {
          background: #transparent; 
        }
        .univ-log-list::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 4px;
        }
        .univ-log-entry {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          width: 100%;
          border-bottom: 1px solid #f9fafb;
          cursor: pointer;
          transition: background 150ms ease;
          box-sizing: border-box;
        }
        .univ-log-entry:last-child {
          border-bottom: none;
        }
        .univ-log-entry:hover {
          background: #f9fafb;
        }
        .univ-log-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .univ-log-content {
          flex: 1;
          min-width: 0;
        }
        .univ-log-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .univ-log-title {
          color: #111827;
          font-size: 14px;
          font-weight: 600;
        }
        .univ-log-unread-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          flex-shrink: 0;
        }
        .univ-log-desc {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.4;
          word-break: break-word;
          margin-top: 2px;
          margin-bottom: 2px;
        }
        .univ-log-time {
          color: #9ca3af;
          font-size: 12px;
          margin-top: 2px;
        }
        .univ-log-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          color: #9ca3af;
        }
      `}</style>

      <div className="univ-log-popup" ref={popupRef}>
        <div className="univ-log-header">
          <h3>Logs</h3>
          {hasUnread && (
            <div className="univ-log-mark-read" onClick={(e) => { e.stopPropagation(); onMarkAllRead(); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Mark all read
            </div>
          )}
        </div>
        
        <div className="univ-log-list">
          {activities.length === 0 ? (
            <div className="univ-log-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: 12 }}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>No activity yet</span>
            </div>
          ) : (
            activities.map((activity, idx) => {
              const isUnread = !readIds.includes(idx);
              const config = getIconConfig(activity);
              
              return (
                <div key={idx} className="univ-log-entry" onClick={() => onEntryClick(idx, activity)}>
                  <div className="univ-log-icon" style={{ backgroundColor: config.bg, color: config.color }}>
                    {config.icon}
                  </div>
                  <div className="univ-log-content">
                    <div className="univ-log-title-row">
                      <span className="univ-log-title">{getTitle(activity)}</span>
                      {isUnread && <span className="univ-log-unread-dot" />}
                    </div>
                    <div className="univ-log-desc">
                      {activity.message}
                    </div>
                    <div className="univ-log-time">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
