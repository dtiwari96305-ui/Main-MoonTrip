import React, { useState, useMemo } from 'react';
import { Header } from '../../components/Header';

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

export const HiddenMarkup = ({ bookings = [], invoices = [], onViewChange, mode = 'demo' }) => {
  const [activeTab, setActiveTab] = useState('provisional');
  const [search, setSearch] = useState('');

  const allMarkup = useMemo(() =>
    bookings.filter(b => parseAmt(b.profit) > 0).map(b => ({
      id: b.id,
      bookingNumber: b.bookingNumber || b.id,
      customer: b.customerName,
      destination: b.destination,
      travelDate: b.tripDate || b.date,
      markup: parseAmt(b.profit),
      consumed: 0,
      isFinal: b.status === 'confirmed' || b.status === 'completed',
    })), [bookings]);

  const provisional = allMarkup.filter(e => !e.isFinal);
  const final = allMarkup.filter(e => e.isFinal);
  const markupInvoices = invoices.filter(i => i.type === 'markup' || i.source === 'markup');

  const totalAccumulated = allMarkup.reduce((s, e) => s + e.markup, 0);
  const totalConsumed = allMarkup.reduce((s, e) => s + e.consumed, 0);
  const availableBalance = totalAccumulated - totalConsumed;

  const activeRows = activeTab === 'provisional' ? provisional : activeTab === 'final' ? final : [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return activeRows.filter(e =>
      !q || (e.bookingNumber || '').toLowerCase().includes(q) || (e.customer || '').toLowerCase().includes(q)
    );
  }, [activeRows, search]);

  const tabs = [
    { id: 'provisional', label: 'Provisional', count: provisional.length },
    { id: 'final', label: 'Final', count: final.length },
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
      <Header title="Hidden Markup" subtitle="Accumulated hidden markup from Pure Agent bookings" mode={mode} showNewQuote={false} />

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

      {(activeTab === 'provisional' || activeTab === 'final') && (
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
              <div style={{ fontWeight: 600 }}>No {activeTab} markup entries</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                {activeTab === 'provisional' ? 'Provisional markup appears from non-confirmed bookings.' : 'Final markup appears from confirmed bookings.'}
              </div>
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
    </div>
  );
};
