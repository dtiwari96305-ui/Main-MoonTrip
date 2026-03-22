import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';

const iconConfigs = {
  'customer-add':    { bg: 'rgba(249, 115, 22, 0.12)', color: '#f97316', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg> },
  'customer-edit':   { bg: 'rgba(249, 115, 22, 0.12)', color: '#f97316', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  'customer-delete': { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  'payment-add':     { bg: 'rgba(100, 116, 139, 0.12)', color: '#64748b', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  'payment-edit':    { bg: 'rgba(100, 116, 139, 0.12)', color: '#64748b', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  'payment-delete':  { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> },
  'quote-add':       { bg: 'rgba(20, 184, 166, 0.12)', color: '#14b8a6', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  'quote-edit':      { bg: 'rgba(20, 184, 166, 0.12)', color: '#14b8a6', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  'quote-status':    { bg: 'rgba(20, 184, 166, 0.12)', color: '#14b8a6', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  'quote-delete':    { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  'booking-add':     { bg: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  'booking-edit':    { bg: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  'booking-complete':{ bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  'booking-cancel':  { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  'booking-delete':  { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> },
};

const defaultIcon = { bg: 'rgba(100, 116, 139, 0.12)', color: '#64748b', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> };

function getTitle(activity) {
  const { type, action } = activity;
  if (type === 'customer' && action === 'added') return 'New Customer Added';
  if (type === 'customer' && action === 'updated') return 'Customer Updated';
  if (type === 'customer' && action === 'deleted') return 'Customer Deleted';
  if (type === 'payment' && action === 'recorded') return 'Payment Recorded';
  if (type === 'payment' && action === 'updated') return 'Payment Updated';
  if (type === 'payment' && action === 'deleted') return 'Payment Deleted';
  if (type === 'quote' && action === 'created') return 'Quote Created';
  if (type === 'quote' && action === 'updated') return 'Quote Updated';
  if (type === 'quote' && action === 'status-changed') return 'Quote Status Changed';
  if (type === 'quote' && action === 'deleted') return 'Quote Deleted';
  if (type === 'booking' && action === 'created') return 'Booking Created';
  if (type === 'booking' && action === 'updated') return 'Booking Updated';
  if (type === 'booking' && action === 'completed') return 'Booking Completed';
  if (type === 'booking' && action === 'cancelled') return 'Booking Cancelled';
  if (type === 'booking' && action === 'deleted') return 'Booking Deleted';
  return 'Activity';
}

function timeAgo(timestamp) {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export const RealLogsPopup = ({ onClose }) => {
  const { activities } = useData();
  const popupRef = useRef(null);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('real_logs_read') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    localStorage.setItem('real_logs_read', JSON.stringify(readIds));
  }, [readIds]);

  const markAllRead = () => {
    const allIds = activities.map((_, i) => i);
    setReadIds(allIds);
  };

  const unreadCount = activities.length - readIds.length;

  return (
    <div className="logs-popup-container" ref={popupRef} style={{ maxHeight: 420, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="logs-popup-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Logs</h3>
        {activities.length > 0 && unreadCount > 0 && (
          <span
            onClick={markAllRead}
            style={{ fontSize: '0.8rem', color: 'var(--accent, #667eea)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            Mark all read
          </span>
        )}
      </div>
      <div className="logs-popup-body" style={{ overflowY: 'auto', flex: 1 }}>
        {activities.length === 0 ? (
          <div className="logs-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.2, marginBottom: 12 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <p>No logs yet</p>
          </div>
        ) : (
          activities.map((activity, idx) => {
            const config = iconConfigs[activity.icon] || defaultIcon;
            const isRead = readIds.includes(idx);
            const title = getTitle(activity);

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 16px',
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  opacity: isRead ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
                onClick={() => {
                  if (!isRead) setReadIds(prev => [...prev, idx]);
                }}
              >
                {/* Icon Box */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: config.bg,
                  color: config.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {config.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{title}</span>
                    {!isRead && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }}></span>
                    )}
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary, #64748b)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activity.message}
                  </p>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {timeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export const useUnreadLogCount = () => {
  const { activities } = useData();
  try {
    const readIds = JSON.parse(localStorage.getItem('real_logs_read') || '[]');
    return Math.max(0, activities.length - readIds.length);
  } catch { return 0; }
};
