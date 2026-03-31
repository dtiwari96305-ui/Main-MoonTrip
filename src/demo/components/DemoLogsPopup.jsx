import React from 'react';
import { useDemoData } from '../context/DemoContext';
import { LogPopup } from '../../shared/components/LogPopup';

export const useDemoUnreadLogCount = () => {
  const { activities } = useDemoData();
  return activities.filter(a => !a.is_read).length;
};

export const DemoLogsPopup = ({ onClose }) => {
  const { activities, markAllActivitiesRead } = useDemoData();

  // Build readIds array (indices of activities that are read) — LogPopup uses index-based tracking
  const readIds = activities.reduce((acc, a, i) => {
    if (a.is_read) acc.push(i);
    return acc;
  }, []);

  const handleMarkAllRead = () => {
    markAllActivitiesRead();
  };

  const handleEntryClick = (idx, activity) => {
    onClose();
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
