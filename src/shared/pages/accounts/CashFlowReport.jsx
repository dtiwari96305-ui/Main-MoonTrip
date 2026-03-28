import React, { useState, useMemo } from 'react';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const parseAmt = (s) => {
  if (typeof s === 'number') return s;
  return Number(String(s || '0').replace(/[₹,\s]/g, '')) || 0;
};

const Section = ({ title, color, children, total, totalLabel }) => (
  <div className="form-section" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
    <div style={{ padding: '12px 16px', background: color + '15', borderBottom: '1px solid #e5e7eb' }}>
      <span style={{ fontWeight: 700, fontSize: 13, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
    </div>
    {children}
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 16px', background: '#f9fafb', borderTop: '2px solid #e5e7eb' }}>
      <span style={{ fontWeight: 700, fontSize: 14 }}>{totalLabel}</span>
      <span style={{ fontWeight: 700, fontSize: 14, color: total >= 0 ? '#16a34a' : '#ef4444' }}>{total >= 0 ? '+' : ''}{fmt(total)}</span>
    </div>
  </div>
);

const Row = ({ label, amount, indent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', paddingLeft: indent ? 32 : 16 }}>
    <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{fmt(amount)}</span>
  </div>
);

export const CashFlowReport = ({ payments = [], vendorPayments = [], generalEntries = [], bankAccounts = [], onViewChange, mode = 'demo' }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filter = (arr, df = 'date') => {
    if (!fromDate && !toDate) return arr;
    return arr.filter(i => {
      const d = (i[df] || i.paymentDate || i.date || '');
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    });
  };

  const fp = filter(payments, 'date');
  const fvp = filter(vendorPayments, 'paymentDate');
  const fe = filter(generalEntries, 'date');

  const cashReceived = fp.reduce((s, p) => s + parseAmt(p.amount), 0);
  const vendorPaid = fvp.reduce((s, p) => s + Number(p.amount || 0), 0);
  const opExpenses = fe.filter(e => e.category === 'expense').reduce((s, e) => s + e.amount, 0);
  const otherIncome = fe.filter(e => e.category === 'income').reduce((s, e) => s + e.amount, 0);

  const operatingCF = cashReceived + otherIncome - vendorPaid - opExpenses;
  const investingCF = 0;
  const financingCF = 0;
  const netCF = operatingCF + investingCF + financingCF;

  const totalBankBalance = bankAccounts.reduce((s, b) => s + Number(b.currentBalance || 0), 0);

  return (
    <div className="page-content">
      <button className="back-btn" onClick={() => onViewChange('accounts-reports')}>← Back to Reports</button>

      <Header title="Cash Flow Statement" subtitle="Operating, investing, and financing activities" mode={mode} showNewQuote={false}>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="form-input" style={{ width: 150, fontSize: 13 }} />
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>to</span>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="form-input" style={{ width: 150, fontSize: 13 }} />
      </Header>

      <div className="stat-cards" style={{ marginBottom: 28 }}>
        {[
          { label: 'Operating CF', amount: operatingCF, color: '#3b82f6' },
          { label: 'Net Cash Flow', amount: netCF, color: netCF >= 0 ? '#16a34a' : '#ef4444' },
          { label: 'Bank Balances', amount: totalBankBalance, color: '#8b5cf6' },
        ].map(c => (
          <div key={c.label} className="stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{fmt(c.amount)}</div>
          </div>
        ))}
      </div>

      <Section title="Operating Activities" color="#3b82f6" total={operatingCF} totalLabel="Net Cash from Operations">
        <Row label="Customer Payments Received" amount={cashReceived} indent />
        <Row label="Other Income Received" amount={otherIncome} indent />
        <Row label="Vendor Payments Made" amount={-vendorPaid} indent />
        <Row label="Operating Expenses Paid" amount={-opExpenses} indent />
      </Section>

      <Section title="Investing Activities" color="#8b5cf6" total={investingCF} totalLabel="Net Cash from Investing">
        <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
          No investing activities recorded.
        </div>
      </Section>

      <Section title="Financing Activities" color="#f59e0b" total={financingCF} totalLabel="Net Cash from Financing">
        <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
          No financing activities recorded.
        </div>
      </Section>

      <div style={{ background: netCF >= 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${netCF >= 0 ? '#bbf7d0' : '#fecaca'}`, borderRadius: 10, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Net Change in Cash</span>
        <span style={{ fontWeight: 700, fontSize: 20, color: netCF >= 0 ? '#16a34a' : '#ef4444' }}>
          {netCF >= 0 ? '+' : ''}{fmt(netCF)}
        </span>
      </div>
    </div>
  );
};
