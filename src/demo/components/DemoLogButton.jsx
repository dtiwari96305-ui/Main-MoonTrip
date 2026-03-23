import React, { useState } from 'react';
import { DemoLogsPopup, useDemoUnreadLogCount } from './DemoLogsPopup';

export const DemoLogButton = () => {
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const unreadCount = useDemoUnreadLogCount();

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`icon-btn log-btn ${isLogsOpen ? 'active' : ''}`}
        id="logBtnMain"
        onClick={() => setIsLogsOpen(!isLogsOpen)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -5, right: -5,
            background: '#ef4444', color: '#ffffff',
            fontSize: '10px', fontWeight: 'bold',
            width: '18px', height: '18px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {unreadCount >= 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isLogsOpen && <DemoLogsPopup onClose={() => setIsLogsOpen(false)} />}
    </div>
  );
};
