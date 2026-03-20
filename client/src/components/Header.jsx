import React, { useState, useRef, useEffect } from 'react';

const LogsPopup = ({ onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="logs-popup-container" ref={popupRef}>
      <div className="logs-popup-header">
        <h3>Logs</h3>
      </div>
      <div className="logs-popup-body">
        <div className="logs-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.2, marginBottom: 12 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <p>No logs yet</p>
        </div>
      </div>
    </div>
  );
};

export const Header = ({ title, subtitle, showDateFilter = false, onNewQuote, children }) => {
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Last 30 days');
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const dateFilterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target)) {
        setIsDateFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dateOptions = ['Last 30 days', 'Last 60 days', 'Last 90 days', 'Last 1 year', 'All time'];

  return (
    <div className="page-header-strip">
      <div className="dash-header">
        <div className="dash-header-left">
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <div className="dash-header-right">
          {showDateFilter && (
            <div className="date-filter-wrapper" ref={dateFilterRef}>
              <div 
                className={`date-filter ${isDateFilterOpen ? 'open' : ''}`} 
                onClick={(e) => { e.stopPropagation(); setIsDateFilterOpen(!isDateFilterOpen); }}
              >
                <span>{selectedDate}</span>
                <svg className="date-filter-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              {isDateFilterOpen && (
                <div className="date-filter-dropdown">
                  {dateOptions.map(option => (
                    <div 
                      key={option} 
                      className={`date-filter-option ${selectedDate === option ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedDate(option);
                        setIsDateFilterOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {children}

          {!children && (
            <>
              <button className="new-quote-btn" id="newQuoteBtn" onClick={onNewQuote}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Quote
              </button>
              <div style={{ position: 'relative' }}>
                <button 
                  className={`icon-btn log-btn ${isLogsOpen ? 'active' : ''}`} 
                  id="logBtnMain"
                  onClick={() => setIsLogsOpen(!isLogsOpen)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </button>
                {isLogsOpen && <LogsPopup onClose={() => setIsLogsOpen(false)} />}
              </div>
              <div className="header-user">
                <div className="header-user-avatar">DA</div>
                <div className="header-user-info">
                  <span className="header-user-name">Demo Admin</span>
                  <span className="header-user-role"><span className="role-dot"></span> Pro</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
