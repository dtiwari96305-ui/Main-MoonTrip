import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Header } from '../../components/Header';

const TYPE_ORDER = { asset: 1, liability: 2, equity: 3, revenue: 4, expense: 5 };
const TYPE_COLORS = { asset: '#3b82f6', liability: '#ef4444', equity: '#8b5cf6', revenue: '#16a34a', expense: '#f59e0b' };
const TYPE_ICONS = {
  asset:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  liability: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  equity:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  revenue:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></svg>,
  expense:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/></svg>,
};

const EMPTY_FORM = { code: '', name: '', type: 'asset', subType: '', description: '' };

export const ChartOfAccounts = ({ chartOfAccounts = [], addCoAAccount, updateCoAAccount, onViewChange, triggerDemoPopup, mode = 'demo' }) => {
  const [collapsed, setCollapsed] = useState({});
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const grouped = useMemo(() => {
    const groups = {};
    chartOfAccounts
      .sort((a, b) => (TYPE_ORDER[a.type] || 9) - (TYPE_ORDER[b.type] || 9) || a.code.localeCompare(b.code))
      .forEach(a => {
        if (!groups[a.type]) groups[a.type] = [];
        groups[a.type].push(a);
      });
    return groups;
  }, [chartOfAccounts]);

  const openAdd = () => {
    setEditAccount(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (acct) => {
    setEditAccount(acct);
    setForm({ code: acct.code, name: acct.name, type: acct.type, subType: acct.subType || '', description: acct.description || '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type) { setError('Ledger name and account group are required.'); return; }
    if (triggerDemoPopup) { triggerDemoPopup(); return; }
    setSaving(true);
    setError('');
    try {
      if (editAccount) {
        await updateCoAAccount(editAccount.id, form);
      } else {
        await addCoAAccount(form);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to save account.');
    } finally {
      setSaving(false);
    }
  };

  const toggleGroup = (type) => setCollapsed(c => ({ ...c, [type]: !c[type] }));
  const expandAll = () => setCollapsed({});
  const collapseAll = () => {
    const all = {};
    Object.keys(grouped).forEach(t => { all[t] = true; });
    setCollapsed(all);
  };

  const filteredGrouped = useMemo(() => {
    if (!search) return grouped;
    const q = search.toLowerCase();
    const result = {};
    Object.entries(grouped).forEach(([type, accounts]) => {
      const matches = accounts.filter(a => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q));
      if (matches.length) result[type] = matches;
    });
    return result;
  }, [grouped, search]);

  return (
    <div className="page-content">
      <Header title="Chart of Accounts" subtitle="Account groups and ledgers for double-entry accounting" mode={mode} showNewQuote={false}>
        <button className="btn-secondary" onClick={() => triggerDemoPopup ? triggerDemoPopup() : null}>Seed Default CoA</button>
        <button className="btn-accounts-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Ledger
        </button>
      </Header>

      {/* Search + Expand/Collapse */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ledgers..."
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px 10px 40px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'var(--font)' }} />
        </div>
        <button onClick={expandAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Expand All</button>
        <button onClick={collapseAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Collapse All</button>
      </div>

      {chartOfAccounts.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No chart of accounts</div>
          <div style={{ fontSize: 14, marginBottom: 20 }}>Seed the default CoA to get started</div>
          <button className="btn-accounts-primary" onClick={() => triggerDemoPopup ? triggerDemoPopup() : null}>Seed Default CoA</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(filteredGrouped).map(([type, accounts]) => {
            const color = TYPE_COLORS[type] || '#6b7280';
            const isCollapsed = collapsed[type];
            return (
              <div key={type} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(type)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 16px', background: color + '10', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color }}>{TYPE_ICONS[type]}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color, textTransform: 'capitalize' }}>{type}s</span>
                    <span style={{ fontSize: 12, background: color + '20', color, borderRadius: 10, padding: '2px 8px' }}>{accounts.length}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"
                    style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                </button>

                {/* Account Rows */}
                {!isCollapsed && accounts.map((acct, i) => (
                  <div key={acct.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 16px', paddingLeft: 24,
                    borderTop: '1px solid #f3f4f6',
                    background: '#fff',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-muted)', minWidth: 40 }}>{acct.code}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{acct.name}</div>
                        {acct.description && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{acct.description}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {acct.isSystem && (
                        <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', padding: '2px 7px', borderRadius: 8 }}>System</span>
                      )}
                      {!acct.isSystem && (
                        <button onClick={() => openEdit(acct)} className="btn-ghost-sm">Edit</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal — rendered via portal to escape stacking context */}
      {showModal && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>{editAccount ? 'Edit Ledger Account' : 'New Ledger Account'}</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}>{error}</div>}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ledger Name *</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Cash in Hand" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Code (optional)</label>
                <input className="form-input" value={form.code} onChange={e => set('code', e.target.value)} placeholder="e.g. 1001" disabled={!!editAccount} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Account Group *</label>
                <div className="select-wrapper">
                  <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)} disabled={!!editAccount} required>
                    <option value="" disabled>Select group...</option>
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="equity">Equity</option>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </select>
                  <svg className="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px 22px', border: 'none', borderRadius: 10, background: saving ? '#fca5a5' : '#f97066', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {saving ? 'Saving…' : editAccount ? 'Update Ledger' : 'Create Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
