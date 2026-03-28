import React, { useState, useMemo } from 'react';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const CAT_STYLE = {
  income:   { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  expense:  { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
  transfer: { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
  other:    { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' },
};

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  category: 'expense',
  amount: '',
  paymentMode: 'bank_transfer',
  reference: '',
};

const TAB_CATS = [
  { id: 'all', label: 'All Types' },
  { id: 'income', label: 'Receipts' },
  { id: 'expense', label: 'Expenses' },
  { id: 'transfer', label: 'Payments' },
  { id: 'bank', label: 'Transfers' },
  { id: 'journal', label: 'Journals' },
];

export const GeneralEntries = ({ generalEntries = [], bankAccounts = [], addGeneralEntry, onViewChange, triggerDemoPopup, mode = 'demo' }) => {
  const [filterCat, setFilterCat] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [nlpText, setNlpText] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return generalEntries.filter(e => {
      const matchCat = filterCat === 'all' || e.category === filterCat;
      const matchSearch = !q ||
        (e.description || '').toLowerCase().includes(q) ||
        (e.entryNumber || '').toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [generalEntries, filterCat, search]);

  const parseNlp = () => {
    const text = nlpText.toLowerCase();
    const amountMatch = text.match(/₹?\s*(\d[\d,]*(?:\.\d+)?)/);
    const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : 0;
    const category = text.includes('receiv') || text.includes('income') || text.includes('earn') || text.includes('got')
      ? 'income'
      : text.includes('transfer') ? 'transfer'
      : 'expense';
    setForm({ ...EMPTY_FORM, description: nlpText, category, amount: String(amount) });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    if (triggerDemoPopup) { triggerDemoPopup(); return; }
    setSaving(true);
    try {
      await addGeneralEntry(form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setNlpText('');
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  return (
    <div className="page-content">
      <Header title="General Entries" subtitle="Record and track all financial transactions" mode={mode} showNewQuote={false} />

      {/* NLP Bar */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '16px 20px', marginBottom: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>What happened?</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            value={nlpText}
            onChange={e => setNlpText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && nlpText.trim() && parseNlp()}
            placeholder='e.g. "Received 50,000 from Nikhar" or "Paid 15000 office rent"'
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-primary)', background: 'none', fontFamily: 'var(--font)' }}
          />
          <button
            onClick={() => nlpText.trim() && parseNlp()}
            style={{
              width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setShowForm(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontSize: 13, fontWeight: 500, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Entry (manual form)
        </button>
      </div>

      {/* Manual Form */}
      {showForm && (
        <div className="form-section" style={{ marginBottom: 24 }}>
          <div className="form-section-title">New Entry</div>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="income">Receipt / Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Payment / Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <input className="form-input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="What is this entry for?" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Amount (₹) *</label>
                <input className="form-input" type="number" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Payment Mode</label>
                <select className="form-input" value={form.paymentMode} onChange={e => set('paymentMode', e.target.value)}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Reference</label>
                <input className="form-input" value={form.reference} onChange={e => set('reference', e.target.value)} placeholder="UTR / Ref. no." />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setNlpText(''); }}>Cancel</button>
              <button type="submit" className="btn-accounts-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Entry'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 20 }}>
        {TAB_CATS.map(tab => (
          <button key={tab.id} onClick={() => setFilterCat(tab.id)} style={{
            padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: filterCat === tab.id ? 600 : 400,
            color: filterCat === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
            borderBottom: filterCat === tab.id ? '2px solid var(--text-primary)' : '2px solid transparent',
            marginBottom: -1, whiteSpace: 'nowrap',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>No entries yet</div>
          <div style={{ fontSize: 13 }}>Use the input bar above to record your first entry. Try "Received 50000 from Nikhar"</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Entry #</th><th>Date</th><th>Description</th><th>Category</th><th>Mode</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const cs = CAT_STYLE[e.category] || CAT_STYLE.other;
                return (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500 }}>{e.entryNumber}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{e.date}</td>
                    <td>{e.description}</td>
                    <td>
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: cs.bg, color: cs.color, border: `1px solid ${cs.border}`, textTransform: 'capitalize' }}>
                        {e.category}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{e.paymentMode?.replace('_', ' ')}</td>
                    <td style={{ fontWeight: 600, color: e.category === 'income' ? '#16a34a' : e.category === 'expense' ? '#ef4444' : 'var(--text-primary)' }}>
                      {e.category === 'income' ? '+' : e.category === 'expense' ? '−' : ''}{fmt(e.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
