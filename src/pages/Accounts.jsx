import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
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
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [billedTo, setBilledTo] = useState('');
  const [notes, setNotes] = useState('');

  const availableBalance = 0;
  const parsedAmount = parseFloat(invoiceAmount) || 0;
  const exceeds = parsedAmount > availableBalance && invoiceAmount !== '';
  const gstRate = 0.18;
  const basicAmount = parsedAmount > 0 ? Math.round(parsedAmount / (1 + gstRate)) : 0;
  const cgst = parsedAmount > 0 ? Math.round((parsedAmount - basicAmount) / 2) : 0;
  const sgst = cgst;

  const tabs = [
    { id: 'markup',      label: 'Markup Entries', count: 0 },
    { id: 'invoices',    label: 'Invoices',        count: 0 },
    { id: 'adjustments', label: 'Adjustments',     count: 0 },
  ];

  const SortIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:0.4,marginLeft:4}}>
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'markup':
        return (
          <div className="data-table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>BOOKING #</th>
                  <th>CUSTOMER</th>
                  <th>DESTINATION</th>
                  <th>TRAVEL DATE <SortIcon /></th>
                  <th>MARKUP <SortIcon /></th>
                  <th>CONSUMED <SortIcon /></th>
                  <th>REMAINING <SortIcon /></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            <div className="empty-state-card" style={{borderTop:'none',boxShadow:'none'}}>
              <div className="empty-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3 className="empty-state-title">No markup entries</h3>
              <p className="empty-state-desc">Hidden markup from quotes will appear here.</p>
            </div>
          </div>
        );
      case 'invoices':
        return (
          <div className="data-table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>INVOICE #</th>
                  <th>DATE <SortIcon /></th>
                  <th>BILLED TO</th>
                  <th>BASIC <SortIcon /></th>
                  <th>GST <SortIcon /></th>
                  <th>TOTAL <SortIcon /></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            <div className="empty-state-card" style={{borderTop:'none',boxShadow:'none'}}>
              <div className="empty-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <path d="M6 12h.01M18 12h.01"/>
                </svg>
              </div>
              <h3 className="empty-state-title">No invoices</h3>
              <p className="empty-state-desc">Invoices converted from hidden markup entries will appear here.</p>
            </div>
          </div>
        );
      case 'adjustments':
      default:
        return (
          <div className="data-table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>BOOKING #</th>
                  <th>CUSTOMER</th>
                  <th>DATE <SortIcon /></th>
                  <th>AMOUNT <SortIcon /></th>
                  <th>NOTES</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            <div className="empty-state-card" style={{borderTop:'none',boxShadow:'none'}}>
              <div className="empty-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19 12 12 19 5 12"/>
                  <line x1="5" y1="5" x2="19" y2="5"/>
                </svg>
              </div>
              <h3 className="empty-state-title">No adjustments</h3>
              <p className="empty-state-desc">Adjust hidden markup against customer outstanding balances.</p>
            </div>
          </div>
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
            <button className="acct-convert-btn" onClick={() => setShowConvertModal(true)}>
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

      {/* ── Convert to Invoice Modal ── */}
      {showConvertModal && ReactDOM.createPortal(
        <div className="cti-overlay">
          <div className="cti-modal">
            {/* Header */}
            <div className="cti-header">
              <span className="cti-title">Convert to Invoice</span>
              <button className="cti-close" onClick={() => setShowConvertModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Available Balance */}
            <div className="cti-balance-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <div>
                <div className="cti-balance-label">Available Balance</div>
                <div className="cti-balance-val">₹{availableBalance.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Invoice Amount */}
            <div className="cti-field">
              <label className="cti-label">Invoice Amount (incl. GST)</label>
              <input
                className={`cti-input${exceeds ? ' cti-input-error' : ''}`}
                type="number"
                placeholder="Enter amount"
                value={invoiceAmount}
                onChange={e => setInvoiceAmount(e.target.value)}
                autoFocus
              />
              {exceeds && <span className="cti-error-text">Exceeds available balance</span>}
            </div>

            {/* Breakdown */}
            {parsedAmount > 0 && (
              <div className="cti-breakdown">
                <div className="cti-breakdown-row">
                  <span>Basic Amount</span><span>₹{basicAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="cti-breakdown-row">
                  <span>CGST @9%</span><span>₹{cgst.toLocaleString('en-IN')}</span>
                </div>
                <div className="cti-breakdown-row">
                  <span>SGST @9%</span><span>₹{sgst.toLocaleString('en-IN')}</span>
                </div>
                <div className="cti-breakdown-row cti-breakdown-total">
                  <span>Invoice Total</span><span>₹{parsedAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            {/* Billed To */}
            <div className="cti-field">
              <label className="cti-label">Billed To</label>
              <input
                className="cti-input"
                type="text"
                placeholder="Customer or company name"
                value={billedTo}
                onChange={e => setBilledTo(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="cti-field">
              <label className="cti-label">Notes (optional)</label>
              <textarea
                className="cti-input cti-textarea"
                placeholder="Optional notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="cti-actions">
              <button className="cti-cancel-btn" onClick={() => setShowConvertModal(false)}>Cancel</button>
              <button className="cti-create-btn" onClick={triggerDemoPopup}>Create Invoice</button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default Accounts;
