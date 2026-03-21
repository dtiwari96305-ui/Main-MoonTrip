import React, { useState } from 'react';
import { openBilling } from '../utils/billingNav';
import { useDemoPopup } from '../context/DemoContext';

// ─── Stat Card ────────────────────────────────────────────────────────────────
const AcctStatCard = ({ amount, label, iconBg, icon, isActive }) => (
  <div className={`acct-stat-card ${isActive ? 'acct-stat-active' : ''}`}>
    <div className="acct-stat-icon" style={{ background: iconBg }}>{icon}</div>
    <div className="acct-stat-body">
      <p className={`acct-stat-amount ${isActive ? 'acct-stat-amount-green' : ''}`}>{amount}</p>
      <p className="acct-stat-label">{label}</p>
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon, title, desc }) => (
  <div className="acct-empty-state">
    <div className="acct-empty-icon">{icon}</div>
    <h3 className="acct-empty-title">{title}</h3>
    <p className="acct-empty-desc">{desc}</p>
  </div>
);

// ─── Main Accounts Component ──────────────────────────────────────────────────
export const Accounts = () => {
  const triggerDemoPopup = useDemoPopup();
  const [activeTab, setActiveTab] = useState('adjustments');

  const tabs = [
    { id: 'markup',      label: 'Markup Entries', count: 0 },
    { id: 'invoices',    label: 'Invoices',        count: 0 },
    { id: 'adjustments', label: 'Adjustments',     count: 0 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'markup':
        return (
          <EmptyState
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            }
            title="No markup entries yet"
            desc="Hidden markup from quotes will appear here"
          />
        );
      case 'invoices':
        return (
          <EmptyState
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <circle cx="12" cy="12" r="2"/>
                <path d="M6 12h.01M18 12h.01"/>
              </svg>
            }
            title="No invoices yet"
            desc="Invoices converted from hidden markup entries will appear here"
          />
        );
      case 'adjustments':
      default:
        return (
          <EmptyState
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
                <line x1="5" y1="5" x2="19" y2="5"/>
              </svg>
            }
            title="No adjustments made"
            desc="Adjust hidden markup against customer outstanding balances"
          />
        );
    }
  };

  return (
    <div id="view-accounts" className="fade-in">

      {/* ── Header ── */}
      <div className="page-header-strip">
        <div className="dash-header">
          <div className="dash-header-left">
            <h1 className="page-title">Accounts</h1>
            <p className="page-subtitle">Hidden Markup Memorandum</p>
          </div>
          <div className="dash-header-right">
            {/* Convert to Invoice */}
            <button className="acct-convert-btn" onClick={triggerDemoPopup}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Convert to Invoice
            </button>

            {/* Adjust Against Payment */}
            <button className="acct-adjust-btn" onClick={triggerDemoPopup}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
                <line x1="5" y1="5" x2="19" y2="5"/>
              </svg>
              Adjust Against Payment
            </button>

            {/* Document icon button */}
            <button className="icon-btn" onClick={triggerDemoPopup} title="Export">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </button>

            {/* User avatar */}
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

      {/* ── 3 Stat Cards ── */}
      <div className="acct-stat-row">
        <AcctStatCard
          amount="₹0"
          label="Total Accumulated"
          iconBg="linear-gradient(135deg, #22c55e, #16a34a)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          }
        />
        <AcctStatCard
          amount="₹0"
          label="Total Consumed"
          iconBg="linear-gradient(135deg, #f59e0b, #d97706)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          }
        />
        <AcctStatCard
          amount="₹0"
          label="Available Balance"
          iconBg="linear-gradient(135deg, #22c55e, #16a34a)"
          isActive={true}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="2" y="3" width="20" height="18" rx="2"/>
              <line x1="8" y1="9" x2="16" y2="9"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="12" y2="17"/>
            </svg>
          }
        />
      </div>

      {/* ── Tab Bar ── */}
      <div className="acct-tab-bar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`acct-tab ${activeTab === tab.id ? 'acct-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="acct-tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="acct-tab-content">
        {renderTabContent()}
      </div>

    </div>
  );
};

export default Accounts;
