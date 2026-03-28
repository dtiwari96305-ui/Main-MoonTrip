import React, { useState, useMemo } from 'react';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const EMPTY_LINE = { accountId: '', accountCode: '', accountName: '', debit: '', credit: '', description: '' };

export const ManualJournalVoucher = ({ chartOfAccounts = [], addJournalEntry, onViewChange, triggerDemoPopup, mode = 'demo' }) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [narration, setNarration] = useState('');
  const [lines, setLines] = useState([{ ...EMPTY_LINE }, { ...EMPTY_LINE }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [acctSearch, setAcctSearch] = useState('');

  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const setLine = (i, k, v) => setLines(ls => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l));

  const addLine = () => setLines(ls => [...ls, { ...EMPTY_LINE }]);
  const removeLine = (i) => setLines(ls => ls.filter((_, idx) => idx !== i));

  const filteredAccounts = useMemo(() => {
    const q = acctSearch.toLowerCase();
    return chartOfAccounts.filter(a =>
      a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [chartOfAccounts, acctSearch]);

  const selectAccount = (lineIdx, acct) => {
    setLines(ls => ls.map((l, i) => i === lineIdx ? { ...l, accountId: acct.id, accountCode: acct.code, accountName: acct.name } : l));
    setDropdownOpen(null);
    setAcctSearch('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isBalanced) { setError('Total debits must equal total credits.'); return; }
    const validLines = lines.filter(l => l.accountName && (Number(l.debit) > 0 || Number(l.credit) > 0));
    if (validLines.length < 2) { setError('At least 2 lines are required.'); return; }
    if (triggerDemoPopup) { triggerDemoPopup(); return; }
    setSaving(true);
    setError('');
    try {
      await addJournalEntry({ date, narration }, validLines);
      onViewChange('accounts-journal');
    } catch (err) {
      setError(err.message || 'Failed to save journal entry.');
      setSaving(false);
    }
  };

  return (
    <div className="page-content cvb-form">
      <button className="back-btn" onClick={() => onViewChange('accounts-journal')}>← Back</button>

      <Header title="Manual Journal Voucher" subtitle="Create a double-entry journal voucher" mode={mode} showNewQuote={false} />

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Header */}
        <div className="form-section">
          <div className="form-section-title">Voucher Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Narration *</label>
              <input className="form-input" value={narration} onChange={e => setNarration(e.target.value)} placeholder="Description of this journal entry…" required />
            </div>
          </div>
        </div>

        {/* Lines */}
        <div className="form-section">
          <div className="form-section-title">Journal Lines</div>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12, width: '35%' }}>Account</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12 }}>Description</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#ef4444', fontSize: 12, width: 130 }}>Debit (Dr)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#16a34a', fontSize: 12, width: 130 }}>Credit (Cr)</th>
                  <th style={{ width: 32 }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {/* Account selector */}
                    <td style={{ padding: '8px 12px', position: 'relative' }}>
                      <div
                        className="form-input"
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, minHeight: 36 }}
                        onClick={() => { setDropdownOpen(dropdownOpen === i ? null : i); setAcctSearch(''); }}
                      >
                        <span style={{ color: line.accountName ? 'var(--text-primary)' : '#9ca3af' }}>
                          {line.accountName ? `${line.accountCode} — ${line.accountName}` : 'Select account…'}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      {dropdownOpen === i && (
                        <div style={{ position: 'absolute', left: 12, top: '100%', zIndex: 100, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 300, maxWidth: 400 }}>
                          <input
                            autoFocus
                            value={acctSearch}
                            onChange={e => setAcctSearch(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            placeholder="Search accounts…"
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: 'none', borderBottom: '1px solid #e5e7eb', outline: 'none', fontSize: 13, borderRadius: '10px 10px 0 0' }}
                          />
                          <div style={{ maxHeight: 220, overflow: 'auto' }}>
                            {filteredAccounts.length === 0 ? (
                              <div style={{ padding: '12px', color: '#6b7280', fontSize: 13 }}>No accounts found.</div>
                            ) : filteredAccounts.map(a => (
                              <div
                                key={a.id}
                                onClick={() => selectAccount(i, a)}
                                style={{ padding: '9px 12px', cursor: 'pointer', fontSize: 13, display: 'flex', justifyContent: 'space-between' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <span>{a.code} — {a.name}</span>
                                <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'capitalize' }}>{a.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        value={line.description}
                        onChange={e => setLine(i, 'description', e.target.value)}
                        placeholder="Optional note…"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 13, outline: 'none', fontFamily: 'var(--font)' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="number" step="0.01" min="0"
                        value={line.debit}
                        onChange={e => setLine(i, 'debit', e.target.value)}
                        placeholder="0.00"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 13, outline: 'none', textAlign: 'right', fontFamily: 'var(--font)' }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <input
                        type="number" step="0.01" min="0"
                        value={line.credit}
                        onChange={e => setLine(i, 'credit', e.target.value)}
                        placeholder="0.00"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 13, outline: 'none', textAlign: 'right', fontFamily: 'var(--font)' }}
                      />
                    </td>
                    <td style={{ padding: '8px 6px' }}>
                      {lines.length > 2 && (
                        <button type="button" onClick={() => removeLine(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid #e5e7eb', background: '#f9fafb' }}>
                  <td colSpan={2} style={{ padding: '10px 12px', fontWeight: 700, fontSize: 14 }}>Total</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>{fmt(totalDebit)}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>{fmt(totalCredit)}</td>
                  <td></td>
                </tr>
                {totalDebit > 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '8px 12px' }}>
                      <span style={{
                        fontSize: 13, fontWeight: 600,
                        color: isBalanced ? '#16a34a' : '#ef4444',
                      }}>
                        {isBalanced ? '✓ Balanced — Debit = Credit' : `⚠ Difference: ${fmt(Math.abs(totalDebit - totalCredit))}`}
                      </span>
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          <button type="button" onClick={addLine} style={{ marginTop: 12, background: 'none', border: '1px dashed #e5e7eb', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Line
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingBottom: 32 }}>
          <button type="button" className="btn-secondary" onClick={() => onViewChange('accounts-journal')}>Cancel</button>
          <button type="submit" className="btn-accounts-primary" disabled={saving || !isBalanced} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {saving ? 'Posting…' : 'Post Journal Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};
