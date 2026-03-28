import React from 'react';
import { Header } from '../../components/Header';

const ReportCard = ({ title, description, iconBg, icon, view, onViewChange }) => (
  <div
    onClick={() => onViewChange(view)}
    style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14,
      padding: '20px 24px', cursor: 'pointer', transition: 'all 0.15s',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
  >
    <div style={{
      width: 52, height: 52, borderRadius: 14, background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{description}</div>
    </div>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" style={{ flexShrink: 0 }}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  </div>
);

export const ReportsLanding = ({ onViewChange, mode = 'demo' }) => (
  <div className="page-content">
    <Header title="Reports" subtitle="Financial reports powered by double-entry journals" mode={mode} showNewQuote={false} />

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <ReportCard
        title="Trial Balance"
        description="All ledgers with debit/credit totals"
        iconBg="#f3e8ff"
        view="accounts-trial"
        onViewChange={onViewChange}
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>}
      />
      <ReportCard
        title="Profit & Loss"
        description="Income vs expenses for a period"
        iconBg="#dcfce7"
        view="accounts-pl"
        onViewChange={onViewChange}
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
      />
      <ReportCard
        title="Balance Sheet"
        description="Assets, liabilities & equity"
        iconBg="#dbeafe"
        view="accounts-balance"
        onViewChange={onViewChange}
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
      />
      <ReportCard
        title="Outstanding Receivables"
        description="Customer-wise ageing analysis"
        iconBg="#d1fae5"
        view="accounts"
        onViewChange={onViewChange}
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><polyline points="7 17 17 7"/><polyline points="7 7 17 7 17 17"/></svg>}
      />
      <ReportCard
        title="Outstanding Payables"
        description="Vendor-wise ageing analysis"
        iconBg="#ffedd5"
        view="accounts"
        onViewChange={onViewChange}
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><polyline points="17 7 7 17"/><polyline points="17 17 7 17 7 7"/></svg>}
      />
    </div>
  </div>
);
