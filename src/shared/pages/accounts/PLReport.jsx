import React, { useState, useMemo } from 'react';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const parseAmt = (s) => {
  if (typeof s === 'number') return s;
  return Number(String(s || '0').replace(/[₹,\s]/g, '')) || 0;
};

const Row = ({ label, amount, bold, indent, color, borderTop }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '9px 16px', paddingLeft: indent ? 32 : 16,
    borderTop: borderTop ? '2px solid #e5e7eb' : undefined,
    background: bold ? '#f9fafb' : 'transparent',
  }}>
    <span style={{ fontSize: 14, fontWeight: bold ? 700 : 400, color: 'var(--text-primary)' }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: bold ? 700 : 500, color: color || 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(amount)}</span>
  </div>
);

export const PLReport = ({ invoices = [], vendorBills = [], generalEntries = [], onViewChange, mode = 'demo' }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filterByDate = (arr, dateField = 'date') => {
    if (!fromDate && !toDate) return arr;
    return arr.filter(item => {
      const d = item[dateField] || '';
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    });
  };

  const filteredInvoices = filterByDate(invoices, 'date');
  const filteredBills = filterByDate(vendorBills, 'serviceDate');
  const filteredEntries = filterByDate(generalEntries, 'date');

  const revenue = filteredInvoices.reduce((s, i) => s + parseAmt(i.amount), 0);
  const cogs = filteredBills.reduce((s, b) => s + Number(b.netPayable || 0), 0);
  const grossProfit = revenue - cogs;
  const grossPct = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : '0';

  const opExpenses = filteredEntries.filter(e => e.category === 'expense').reduce((s, e) => s + e.amount, 0);
  const otherIncome = filteredEntries.filter(e => e.category === 'income').reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - opExpenses + otherIncome;

  return (
    <div className="page-content">
      <button className="back-btn" onClick={() => onViewChange('accounts-reports')}>← Back to Reports</button>

      <Header title="Profit & Loss Statement" subtitle="Revenue, costs, and net income" mode={mode} showNewQuote={false}>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
          className="form-input" style={{ width: 150, fontSize: 13 }} />
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>to</span>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
          className="form-input" style={{ width: 150, fontSize: 13 }} />
      </Header>

      {/* Summary Cards */}
      <div className="stat-cards" style={{ marginBottom: 28 }}>
        {[
          { label: 'Revenue', amount: revenue, color: '#3b82f6' },
          { label: 'Gross Profit', amount: grossProfit, color: '#16a34a' },
          { label: 'Net Profit', amount: netProfit, color: netProfit >= 0 ? '#16a34a' : '#ef4444' },
        ].map(c => (
          <div key={c.label} className="stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{fmt(c.amount)}</div>
          </div>
        ))}
      </div>

      <div className="form-section" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Revenue */}
        <div style={{ padding: '12px 16px', background: '#eff6ff', borderBottom: '1px solid #e5e7eb' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</span>
        </div>
        <Row label="Sales Invoice Revenue" amount={revenue} indent />
        <Row label="Other Income" amount={otherIncome} indent />
        <Row label="Total Revenue" amount={revenue + otherIncome} bold borderTop />

        {/* Cost of Services */}
        <div style={{ padding: '12px 16px', background: '#fef2f2', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cost of Services</span>
        </div>
        <Row label="Vendor Payments (COGS)" amount={cogs} indent />
        <Row label="Total COGS" amount={cogs} bold borderTop />

        {/* Gross Profit */}
        <Row label="Gross Profit" amount={grossProfit} bold color={grossProfit >= 0 ? '#16a34a' : '#ef4444'} borderTop />
        <Row label={`Gross Margin`} amount={0} bold indent />
        <div style={{ padding: '5px 16px 5px 32px', fontSize: 13, color: 'var(--text-muted)' }}>
          Gross Margin: {grossPct}%
        </div>

        {/* Operating Expenses */}
        <div style={{ padding: '12px 16px', background: '#fffbeb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operating Expenses</span>
        </div>
        <Row label="General Expenses" amount={opExpenses} indent />
        <Row label="Total Operating Expenses" amount={opExpenses} bold borderTop />

        {/* Net Profit */}
        <div style={{ padding: '14px 16px', background: netProfit >= 0 ? '#f0fdf4' : '#fef2f2', borderTop: '2px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Net Profit / (Loss)</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: netProfit >= 0 ? '#16a34a' : '#ef4444' }}>{fmt(netProfit)}</span>
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
        Based on {filteredInvoices.length} invoices, {filteredBills.length} vendor bills, {filteredEntries.length} general entries.
        {(!fromDate && !toDate) && ' Showing all-time data. Use date filters to narrow the range.'}
      </div>
    </div>
  );
};
