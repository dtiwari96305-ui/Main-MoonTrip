import React, { useState, useEffect } from 'react';
import { useDemoData } from '../context/DemoContext';
import { LogPopup } from '../../shared/components/LogPopup';
import { openBookingDetail } from '../../utils/bookingNav';
import { openQuoteDetail } from '../../utils/quoteNav';

export const useDemoUnreadLogCount = () => {
  const { activities } = useDemoData();
  try {
    const readIds = JSON.parse(sessionStorage.getItem('demo_logs_read') || '[]');
    return Math.max(0, activities.length - readIds.length);
  } catch { return 0; }
};

export const DemoLogsPopup = ({ onClose }) => {
  const { activities } = useDemoData();
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('demo_logs_read') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    sessionStorage.setItem('demo_logs_read', JSON.stringify(readIds));
  }, [readIds]);

  const handleMarkAllRead = () => {
    setReadIds(activities.map((_, i) => i));
  };

  const handleEntryClick = (idx, activity) => {
    if (!readIds.includes(idx)) {
      setReadIds(prev => [...prev, idx]);
    }
    onClose();
    
    // Navigate based on IDs found in the message
    const msg = activity.message || '';
    const bMatch = msg.match(/(WL-B-\d+)/);
    const qMatch = msg.match(/(WL-Q-\d+)/);
    
    if (bMatch && activity.type === 'booking' && activity.action !== 'deleted') {
      openBookingDetail(bMatch[1]);
    } else if (qMatch && activity.type === 'quote' && activity.action !== 'deleted') {
      openQuoteDetail(qMatch[1]);
    }
  };

  return (
    <LogPopup
      activities={activities}
      readIds={readIds}
      onMarkAllRead={handleMarkAllRead}
      onEntryClick={handleEntryClick}
      onClose={onClose}
    />
  );
};
