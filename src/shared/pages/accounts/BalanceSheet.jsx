import React, { useMemo } from 'react';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const parseAmt = (s) => {
  if (typeof s === 'number') return s;
  return Number(String(s || '0').replace(/[₹,\s]/g, '')) || 0;
};

const BSRow = ({ label, amount, indent, bold, color }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', padding: '8px 16px',
    paddingLeft: indent ? 32 : 16,
    background: bold ? '#f9fafb' : 'transparent',
    borderTop: bold ? '1px solid #e5e7eb' : undefined,
  }}>
    <span style={{ fontSize: 14, fontWeight: bold ? 700 : 400 }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: bold ? 700 : 500, color: color || 'var(--text-primary)' }}>{fmt(amount)}</span>
  </div>
);

const BSSection = ({ title, color, rows, total, totalLabel }) => (
  <div className="form-section" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '12px 16px', background: color + '15', borderBottom: '1px solid #e5e7eb' }}>
      <span style={{ fontWeight: 700, fontSize: 13, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
    </div>
    {rows.map((r, i) => <BSRow key={i} {...r} />)}
    <BSRow label={totalLabel} amount={total} bold />
  </div>
);

export const BalanceSheet = ({ invoices = [], vendorBills = [], payments = [], vendorPayments = [], bankAccounts = [], generalEntries = [], onViewChange, mode = 'demo' }) => {
  const totalBankBalance = bankAccounts.reduce((s, b) => s + Number(b.currentBalance || 0), 0);

  const totalReceivable = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + parseAmt(i.amount), 0);
  const totalPayable = vendorBills.filter(b => b.status !== 'paid').reduce((s, b) => s + Number(b.netPayable || 0), 0);

  const cashInHand = generalEntries.filter(e => e.category === 'income').reduce((s, e) => s + e.amount, 0)
    - generalEntries.filter(e => e.category === 'expense').reduce((s, e) => s + e.amount, 0);

  const totalPaymentsReceived = payments.reduce((s, p) => s + parseAmt(p.amount), 0);

  // Assets
  const totalCurrentAssets = totalBankBalance + totalReceivable + Math.max(cashInHand, 0);
  const totalAssets = totalCurrentAssets;

  // Liabilities
  const totalCurrentLiab = totalPayable;
  const totalLiab = totalCurrentLiab;

  // Equity (plug)
  const equity = totalAssets - totalLiab;

  return (
    <div className="page-content">
      <button className="back-btn" onClick={() => onViewChange('accounts-reports')}>← Back to Reports</button>

      <Header title="Balance Sheet" subtitle="Assets, liabilities, and equity as of today" mode={mode} showNewQuote={false} />

      <div className="stat-cards" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Assets', amount: totalAssets, color: '#3b82f6' },
          { label: 'Total Liabilities', amount: totalLiab, color: '#ef4444' },
          { label: 'Net Equity', amount: equity, color: '#16a34a' },
        ].map(c => (
          <div key={c.label} className="stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{fmt(c.amount)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Assets */}
        <div>
          <BSSection
            title="Assets"
            color="#3b82f6"
            total={totalAssets}
            totalLabel="Total Assets"
            rows={[
              { label: 'Bank Balances', amount: totalBankBalance, indent: true },
              { label: 'Accounts Receivable', amount: totalReceivable, indent: true },
              { label: 'Cash / Other', amount: Math.max(cashInHand, 0), indent: true },
            ]}
          />
        </div>

        {/* Liabilities + Equity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <BSSection
            title="Liabilities"
            color="#ef4444"
            total={totalLiab}
            totalLabel="Total Liabilities"
            rows={[
              { label: 'Accounts Payable (Vendors)', amount: totalPayable, indent: true },
            ]}
          />
          <BSSection
            title="Equity"
            color="#16a34a"
            total={equity}
            totalLabel="Total Equity"
            rows={[
              { label: 'Retained Earnings / Capital', amount: equity, indent: true },
            ]}
          />
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>Liabilities + Equity</span>
            <span style={{ fontWeight: 700, color: Math.abs(totalLiab + equity - totalAssets) < 1 ? '#16a34a' : '#ef4444' }}>
              {fmt(totalLiab + equity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
