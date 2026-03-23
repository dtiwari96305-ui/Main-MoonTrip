import React, { useState, useRef, useEffect } from 'react';
import { DemoLogButton } from '../../demo/components/DemoLogButton';
import { openBilling } from '../../utils/billingNav';



export const Header = ({ title, subtitle, showDateFilter = false, onNewQuote, buttonLabel = 'New Quote', showNewQuote = true, children }) => {
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Last 30 days');
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

  const dateOptions = ['Last 30 days', 'Last 60 days', 'Last 90 days', 'All time'];

  return (
    <div className="page-header-strip">
      <div className="dash-header">
        <div className="dash-header-left">
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <div className="dash-header-right">
          {showDateFilter && (
            <div className={`date-filter-wrapper ${isDateFilterOpen ? 'open' : ''}`} ref={dateFilterRef}>
              <div
                className="date-filter"
                onClick={(e) => { e.stopPropagation(); setIsDateFilterOpen(!isDateFilterOpen); }}
              >
                <span>{selectedDate}</span>
                <svg className="date-filter-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
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
            </div>
          )}
          
          {children}

          {!children && showNewQuote && (
            <button className="new-quote-btn" id="newQuoteBtn" onClick={onNewQuote}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {buttonLabel}
            </button>
          )}
          <DemoLogButton />
          <div className="header-user" style={{ cursor: 'pointer' }} onClick={() => openBilling()}>
            <div className="header-user-avatar">DA</div>
            <div className="header-user-info">
              <span className="header-user-name">Demo Admin</span>
              <span className="header-user-role"><span className="role-dot"></span> Pro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
