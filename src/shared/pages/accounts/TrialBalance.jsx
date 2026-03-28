import React, { useMemo } from 'react';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const parseAmt = (s) => {
  if (typeof s === 'number') return s;
  return Number(String(s || '0').replace(/[₹,\s]/g, '')) || 0;
};

const TYPE_ORDER = { asset: 1, liability: 2, equity: 3, revenue: 4, expense: 5 };
const TYPE_COLORS = { asset: '#3b82f6', liability: '#ef4444', equity: '#8b5cf6', revenue: '#16a34a', expense: '#f59e0b' };

export const TrialBalance = ({ chartOfAccounts = [], invoices = [], vendorBills = [], payments = [], vendorPayments = [], generalEntries = [], bankAccounts = [], onViewChange, mode = 'demo' }) => {
  const parseAmt2 = (s) => {
    if (typeof s === 'number') return s;
    return Number(String(s || '0').replace(/[₹,\s]/g, '')) || 0;
  };

  const accountBalances = useMemo(() => {
    const balances = {};
    chartOfAccounts.forEach(a => {
      balances[a.id] = { ...a, debit: 0, credit: 0 };
    });

    // Add computed balances from data
    const bankTotal = bankAccounts.reduce((s, b) => s + Number(b.currentBalance || 0), 0);
    const receivable = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + parseAmt2(i.amount), 0);
    const payable = vendorBills.filter(b => b.status !== 'paid').reduce((s, b) => s + Number(b.netPayable || 0), 0);
    const revenue = invoices.reduce((s, i) => s + parseAmt2(i.amount), 0);
    const cogs = vendorBills.reduce((s, b) => s + Number(b.netPayable || 0), 0);
    const income = generalEntries.filter(e => e.category === 'income').reduce((s, e) => s + e.amount, 0);
    const expense = generalEntries.filter(e => e.category === 'expense').reduce((s, e) => s + e.amount, 0);

    // Map to CoA accounts (find by code)
    const setBalance = (code, debit, credit) => {
      const acct = chartOfAccounts.find(a => a.code === code);
      if (acct && balances[acct.id]) {
        balances[acct.id].debit = debit;
        balances[acct.id].credit = credit;
      }
    };

    setBalance('1002', bankTotal, 0);
    setBalance('1004', receivable, 0);
    setBalance('2001', 0, payable);
    setBalance('4001', 0, revenue + income);
    setBalance('5001', cogs, 0);
    setBalance('5003', expense, 0);

    return Object.values(balances)
      .filter(a => a.debit > 0 || a.credit > 0)
      .sort((a, b) => (TYPE_ORDER[a.type] || 9) - (TYPE_ORDER[b.type] || 9) || a.code.localeCompare(b.code));
  }, [chartOfAccounts, invoices, vendorBills, payments, vendorPayments, generalEntries, bankAccounts]);

  const totalDebit = accountBalances.reduce((s, a) => s + a.debit, 0);
  const totalCredit = accountBalances.reduce((s, a) => s + a.credit, 0);
  const balanced = Math.abs(totalDebit - totalCredit) < 1;

  return (
    <div className="page-content">
      <button className="back-btn" onClick={() => onViewChange('accounts-reports')}>← Back to Reports</button>

      <Header title="Trial Balance" subtitle="All accounts with debit and credit balances" mode={mode} showNewQuote={false}>
        <span style={{
          fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 20,
          background: balanced ? '#f0fdf4' : '#fef2f2',
          color: balanced ? '#16a34a' : '#ef4444',
          border: `1px solid ${balanced ? '#bbf7d0' : '#fecaca'}`,
        }}>
          {balanced ? '✓ Balanced' : '⚠ Imbalanced'}
        </span>
      </Header>

      {accountBalances.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
          <div style={{ fontWeight: 600 }}>No account balances yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Run the accounts SQL and add transactions to see the trial balance.</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th><th>Account Name</th><th>Type</th>
                <th style={{ textAlign: 'right' }}>Debit (₹)</th>
                <th style={{ textAlign: 'right' }}>Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {accountBalances.map(a => (
                <tr key={a.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{a.code}</td>
                  <td>{a.name}</td>
                  <td>
                    <span style={{ fontSize: 12, color: TYPE_COLORS[a.type] || '#6b7280', fontWeight: 600, textTransform: 'capitalize' }}>{a.type}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{a.debit > 0 ? fmt(a.debit) : '—'}</td>
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{a.credit > 0 ? fmt(a.credit) : '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 700, borderTop: '2px solid #e5e7eb' }}>
                <td colSpan={3} style={{ padding: '12px 16px', fontWeight: 700 }}>Total</td>
                <td style={{ textAlign: 'right', padding: '12px 16px', color: '#3b82f6' }}>{fmt(totalDebit)}</td>
                <td style={{ textAlign: 'right', padding: '12px 16px', color: '#ef4444' }}>{fmt(totalCredit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
