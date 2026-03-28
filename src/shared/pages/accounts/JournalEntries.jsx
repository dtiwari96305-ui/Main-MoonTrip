import React, { useState, useMemo } from 'react';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const TYPE_BADGE = {
  manual:     { label: 'Manual',     color: '#8b5cf6', bg: '#f5f3ff' },
  auto:       { label: 'Auto',       color: '#3b82f6', bg: '#eff6ff' },
  adjustment: { label: 'Adjustment', color: '#f59e0b', bg: '#fffbeb' },
};

export const JournalEntries = ({ journalEntries = [], onViewChange, getJournalLines, mode = 'demo' }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [linesCache, setLinesCache] = useState({});
  const [loadingLines, setLoadingLines] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return journalEntries.filter(e => {
      const matchType = filterType === 'all' || e.entryType === filterType;
      const matchSearch = !q || (e.narration || '').toLowerCase().includes(q) || (e.entryNumber || '').toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [journalEntries, search, filterType]);

  const toggleExpand = async (entry) => {
    if (expandedId === entry.id) { setExpandedId(null); return; }
    setExpandedId(entry.id);
    if (linesCache[entry.id]) return;
    setLoadingLines(true);
    try {
      const lines = getJournalLines ? await getJournalLines(entry.id) : [];
      setLinesCache(c => ({ ...c, [entry.id]: lines }));
    } catch { /* ignore */ }
    setLoadingLines(false);
  };

  return (
    <div className="page-content">
      <Header title="Journal Entries" subtitle={`${journalEntries.length} voucher${journalEntries.length !== 1 ? 's' : ''} — double-entry ledger`} mode={mode} showNewQuote={false}>
        <button className="btn-secondary">Backfill All</button>
        <button className="btn-accounts-primary" onClick={() => onViewChange('accounts-mjv')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Manual JV
        </button>
      </Header>

      {/* Search + Filter Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search narration..."
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px 10px 40px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'var(--font)' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{
              appearance: 'none', padding: '10px 36px 10px 14px', border: '1px solid #e5e7eb',
              borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'var(--font)',
              background: '#fff', cursor: 'pointer', color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Types</option>
            <option value="manual">Manual</option>
            <option value="auto">Auto</option>
            <option value="adjustment">Adjustment</option>
          </select>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No journal entries</div>
          <div style={{ fontSize: 13 }}>Post your first journal or use Backfill to auto-generate from existing transactions</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Entry #</th><th>Date</th><th>Narration</th><th>Type</th><th style={{ textAlign: 'right' }}>Debit</th><th style={{ textAlign: 'right' }}>Credit</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const badge = TYPE_BADGE[e.entryType] || TYPE_BADGE.manual;
                const isExpanded = expandedId === e.id;
                const lines = linesCache[e.id] || [];
                return (
                  <React.Fragment key={e.id}>
                    <tr>
                      <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{e.entryNumber}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{e.date}</td>
                      <td>{e.narration || '—'}</td>
                      <td>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: badge.bg, color: badge.color, fontWeight: 600 }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(e.totalDebit)}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(e.totalCredit)}</td>
                      <td>
                        <button className="btn-ghost-sm" onClick={() => toggleExpand(e)}>
                          {isExpanded ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} style={{ padding: '0 16px 12px', background: '#f9fafb' }}>
                          {loadingLines && !lines.length ? (
                            <div style={{ padding: '12px 0', color: 'var(--text-muted)', fontSize: 13 }}>Loading lines…</div>
                          ) : lines.length === 0 ? (
                            <div style={{ padding: '12px 0', color: 'var(--text-muted)', fontSize: 13 }}>No journal lines found.</div>
                          ) : (
                            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Code</th>
                                  <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Account</th>
                                  <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Dr</th>
                                  <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Cr</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lines.map((l, i) => (
                                  <tr key={i}>
                                    <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>{l.account_code}</td>
                                    <td style={{ padding: '6px 8px' }}>{l.account_name}</td>
                                    <td style={{ padding: '6px 8px', textAlign: 'right', color: '#ef4444' }}>{l.debit > 0 ? fmt(l.debit) : '—'}</td>
                                    <td style={{ padding: '6px 8px', textAlign: 'right', color: '#16a34a' }}>{l.credit > 0 ? fmt(l.credit) : '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
