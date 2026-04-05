import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Header } from '../../components/Header';
import { blockNonNumericKeys } from '../../utils/inputHelpers';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const parseAmt = (s) => {
  if (typeof s === 'number') return s;
  return Number(String(s || '0').replace(/[₹,\s]/g, '')) || 0;
};

const StatCard = ({ icon, iconBg, label, amount }) => (
  <div style={{
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14,
    padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12, background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{amount}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

const ConvertToInvoiceModal = ({ availableBalance, onClose, onSubmit }) => {
  const [form, setForm] = useState({ amount: '', billedTo: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(Number(form.amount))) return;
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: 18, padding: '32px 32px 28px', width: 440, maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Convert to Invoice</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Available Balance card */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 700, fontSize: 16 }}>₹</div>
          <div>
            <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 500, marginBottom: 2 }}>Available Balance</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>{fmt(availableBalance)}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Invoice Amount (incl. GST)</label>
            <input
              type="number" min="0" step="0.01"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              onKeyDown={blockNonNumericKeys}
              placeholder="Enter amount"
              style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#111827', outline: 'none', fontFamily: 'inherit' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Billed To</label>
            <input
              type="text"
              value={form.billedTo}
              onChange={e => setForm(f => ({ ...f, billedTo: e.target.value }))}
              placeholder="Customer or company name"
              style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#111827', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Optional notes"
              rows={3}
              style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#111827', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: 10, background: '#f9fafb', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 10, background: '#16a34a', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Creating…' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export const AccountsOverview = ({ bookings = [], invoices = [], onViewChange, createInvoice, mode = 'demo' }) => {
  const [activeTab, setActiveTab] = useState('markup');
  const [search, setSearch] = useState('');
  const [showConvertModal, setShowConvertModal] = useState(false);

  const markupEntries = useMemo(() =>
    bookings.filter(b => parseAmt(b.profit) > 0).map(b => ({
      id: b.id,
      bookingNumber: b.bookingNumber || b.id,
      customer: b.customerName,
      destination: b.destination,
      travelDate: b.tripDate || b.date,
      markup: parseAmt(b.profit),
      consumed: 0,
    })), [bookings]);

  const totalAccumulated = markupEntries.reduce((s, e) => s + e.markup, 0);
  const totalConsumed = markupEntries.reduce((s, e) => s + e.consumed, 0);
  const availableBalance = totalAccumulated - totalConsumed;

  const markupInvoices = invoices.filter(i => i.type === 'markup' || i.source === 'markup');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return markupEntries.filter(e =>
      !q || (e.bookingNumber || '').toLowerCase().includes(q) || (e.customer || '').toLowerCase().includes(q)
    );
  }, [markupEntries, search]);

  const tabs = [
    { id: 'markup', label: 'Markup Entries', count: markupEntries.length },
    { id: 'invoices', label: 'Invoices', count: markupInvoices.length },
    { id: 'adjustments', label: 'Adjustments', count: 0 },
  ];

  const fmtDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div className="page-content">
      <Header title="Accounts" subtitle="Hidden Markup Memorandum" mode={mode} showNewQuote={false}>
        <button className="btn-accounts-primary" onClick={() => setShowConvertModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
          Convert to Invoice
        </button>
        <button className="btn-secondary">Adjust Against Payment</button>
      </Header>

      <div className="stat-cards" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard
          iconBg="#dcfce7"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
          label="Total Accumulated"
          amount={fmt(totalAccumulated)}
        />
        <StatCard
          iconBg="#fef9c3"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>}
          label="Total Consumed"
          amount={fmt(totalConsumed)}
        />
        <StatCard
          iconBg="#dcfce7"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
          label="Available Balance"
          amount={fmt(availableBalance)}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 400,
            color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === tab.id ? '2px solid var(--text-primary)' : '2px solid transparent',
            marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {tab.label}
            <span style={{
              fontSize: 12, fontWeight: 600,
              background: activeTab === tab.id ? 'var(--text-primary)' : '#e5e7eb',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              borderRadius: 10, padding: '1px 7px',
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {activeTab === 'markup' && (
        <>
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by booking # or customer..."
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px 10px 40px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'var(--font)' }} />
          </div>

          {filtered.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div style={{ fontWeight: 600 }}>No markup entries</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Markup appears when bookings include a profit margin.</div>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>BOOKING #</th><th>CUSTOMER</th><th>DESTINATION</th><th>TRAVEL DATE</th>
                    <th style={{ textAlign: 'right' }}>MARKUP</th>
                    <th style={{ textAlign: 'right' }}>CONSUMED</th>
                    <th style={{ textAlign: 'right' }}>REMAINING</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id}>
                      <td style={{ color: 'var(--accent)', fontWeight: 500, cursor: 'pointer' }}>{e.bookingNumber}</td>
                      <td>{e.customer}</td>
                      <td>{e.destination || '—'}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{fmtDate(e.travelDate)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(e.markup)}</td>
                      <td style={{ textAlign: 'right', color: '#f59e0b', fontWeight: 600 }}>{fmt(e.consumed)}</td>
                      <td style={{ textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>{fmt(e.markup - e.consumed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'invoices' && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 600 }}>No markup invoices yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Convert markup entries to invoices to see them here.</div>
        </div>
      )}

      {activeTab === 'adjustments' && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 600 }}>No adjustments yet</div>
        </div>
      )}

      {showConvertModal && (
        <ConvertToInvoiceModal
          availableBalance={availableBalance}
          onClose={() => setShowConvertModal(false)}
          onSubmit={async (form) => {
            if (createInvoice) await createInvoice({ ...form, type: 'markup' });
            setActiveTab('invoices');
          }}
        />
      )}
    </div>
  );
};
