import React, { useState, useMemo } from 'react';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const parseAmt = (s) => {
  if (typeof s === 'number') return s;
  return Number(String(s || '0').replace(/[₹,\s]/g, '')) || 0;
};

const TYPE_BADGE = {
  payment:        { label: 'Payment In',  color: '#16a34a', bg: '#f0fdf4' },
  vendor_payment: { label: 'Vendor Pay',  color: '#ef4444', bg: '#fef2f2' },
  invoice:        { label: 'Invoice',     color: '#3b82f6', bg: '#eff6ff' },
  income:         { label: 'Income',      color: '#16a34a', bg: '#f0fdf4' },
  expense:        { label: 'Expense',     color: '#ef4444', bg: '#fef2f2' },
  transfer:       { label: 'Transfer',    color: '#8b5cf6', bg: '#f5f3ff' },
  other:          { label: 'Other',       color: '#6b7280', bg: '#f9fafb' },
  journal:        { label: 'Journal',     color: '#f59e0b', bg: '#fffbeb' },
};

export const DayBook = ({ payments = [], vendorPayments = [], invoices = [], generalEntries = [], journalEntries = [], onViewChange, mode = 'demo' }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');

  const allEntries = useMemo(() => {
    const entries = [];

    payments.forEach(p => entries.push({
      date: p.date || p.createdDate || '',
      type: 'payment',
      ref: p.paymentNumber || p.id,
      description: `Payment received from ${p.customerName}`,
      amount: parseAmt(p.amount),
      dr: 0,
      cr: parseAmt(p.amount),
    }));

    vendorPayments.forEach(p => entries.push({
      date: p.paymentDate || p.createdAt?.slice(0, 10) || '',
      type: 'vendor_payment',
      ref: p.paymentNumber || p.id,
      description: `Vendor payment to ${p.vendorName}`,
      amount: Number(p.amount || 0),
      dr: Number(p.amount || 0),
      cr: 0,
    }));

    invoices.forEach(i => entries.push({
      date: i.date || '',
      type: 'invoice',
      ref: i.invoiceNumber || i.id,
      description: `Invoice raised for ${i.customerName}`,
      amount: parseAmt(i.amount),
      dr: parseAmt(i.amount),
      cr: 0,
    }));

    generalEntries.forEach(e => entries.push({
      date: e.date,
      type: e.category || 'other',
      ref: e.entryNumber,
      description: e.description,
      amount: e.amount,
      dr: e.category === 'expense' ? e.amount : 0,
      cr: e.category === 'income' ? e.amount : 0,
    }));

    journalEntries.forEach(e => entries.push({
      date: e.date,
      type: 'journal',
      ref: e.entryNumber,
      description: e.narration || 'Journal Entry',
      amount: e.totalDebit,
      dr: e.totalDebit,
      cr: e.totalCredit,
    }));

    return entries.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [payments, vendorPayments, invoices, generalEntries, journalEntries]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allEntries.filter(e => {
      if (fromDate && e.date < fromDate) return false;
      if (toDate && e.date > toDate) return false;
      if (q && !(e.description || '').toLowerCase().includes(q) && !(e.ref || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allEntries, fromDate, toDate, search]);

  const totalDr = filtered.reduce((s, e) => s + e.dr, 0);
  const totalCr = filtered.reduce((s, e) => s + e.cr, 0);

  return (
    <div className="page-content">
      <button className="back-btn" onClick={() => onViewChange('accounts-reports')}>← Back to Reports</button>

      <Header title="Day Book" subtitle="Chronological record of all transactions" mode={mode} showNewQuote={false} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="form-input" style={{ width: 160, fontSize: 13 }} />
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>to</span>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="form-input" style={{ width: 160, fontSize: 13 }} />
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search entries…"
            style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 34px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{filtered.length} entries</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
          <div style={{ fontWeight: 600 }}>No entries found</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your date range or search filters.</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Ref #</th><th>Description</th><th>Type</th>
                <th style={{ textAlign: 'right' }}>Debit</th>
                <th style={{ textAlign: 'right' }}>Credit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const badge = TYPE_BADGE[e.type] || TYPE_BADGE.other;
                return (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13, whiteSpace: 'nowrap' }}>{e.date}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 500 }}>{e.ref}</td>
                    <td>{e.description}</td>
                    <td>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: badge.bg, color: badge.color, fontWeight: 600 }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#ef4444' }}>{e.dr > 0 ? fmt(e.dr) : '—'}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#16a34a' }}>{e.cr > 0 ? fmt(e.cr) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #e5e7eb' }}>
                <td colSpan={4} style={{ padding: '12px 16px', fontWeight: 700 }}>Total</td>
                <td style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 700, color: '#ef4444' }}>{fmt(totalDr)}</td>
                <td style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 700, color: '#16a34a' }}>{fmt(totalCr)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
