import React from 'react';
import { InfoBtn } from './InfoBtn';

export const FinancialSummaryCard = () => {
  return (
    <div className="financial-summary-card">
      <div className="fs-header">
        <h3 className="fs-title">Financial Summary</h3>
        <p className="fs-subtitle" style={{fontSize:'0.9rem',color:'var(--text-muted)',marginTop:'4px'}}>All-time business overview</p>
      </div>
      <div className="fs-items">
        <div className="fs-item">
          <div className="fs-icon-wrap fs-icon-orange">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="fs-info">
            <span className="fs-label">Total Revenue <InfoBtn infoKey="revenue" /></span>
            <span className="fs-value">₹7,67,732</span>
          </div>
        </div>
        <div className="fs-item">
          <div className="fs-icon-wrap fs-icon-blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div className="fs-info">
            <span className="fs-label">Total Profit <InfoBtn infoKey="profit" /></span>
            <span className="fs-value">₹89,000</span>
          </div>
        </div>
        <div className="fs-item">
          <div className="fs-icon-wrap fs-icon-yellow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className="fs-info">
            <span className="fs-label">Pending Payments <InfoBtn infoKey="pending" /></span>
            <span className="fs-value">₹2,34,900</span>
          </div>
        </div>
        <div className="fs-item">
          <div className="fs-icon-wrap fs-icon-purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          </div>
          <div className="fs-info">
            <span className="fs-label">Quote Conversion <InfoBtn infoKey="conversion" /></span>
            <span className="fs-value">60.0%</span>
            <span className="fs-sub">3 of 5 quotes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
