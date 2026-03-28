import React, { useState } from 'react';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const BANK_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
const getBankColor = (name) => {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return BANK_COLORS[Math.abs(hash) % BANK_COLORS.length];
};

const EMPTY_FORM = {
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  accountHolder: '',
  accountType: 'bank',
  openingBalance: '',
};

export const BankAccounts = ({ bankAccounts = [], addBankAccount, onViewChange, triggerDemoPopup, mode = 'demo' }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const totalBalance = bankAccounts.reduce((s, b) => s + Number(b.currentBalance || 0), 0);

  const closeForm = () => { setShowModal(false); setError(''); setForm(EMPTY_FORM); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.bankName) { setError('Account name is required.'); return; }
    if (triggerDemoPopup) { triggerDemoPopup(); return; }
    setSaving(true);
    setError('');
    try {
      await addBankAccount(form);
      closeForm();
    } catch (err) {
      setError(err.message || 'Failed to add bank account.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content">
      <Header title="Bank Accounts" subtitle="Manage your bank accounts, cash boxes, and wallets" mode={mode} showNewQuote={false}>
        <button className="btn-accounts-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Account
        </button>
      </Header>

      {/* Inline Add Form */}
      {showModal && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '24px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Add Bank Account</span>
            <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 14 }}>{error}</div>}
          <form onSubmit={handleSave}>
            {/* Row 1: Account Name | Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Account Name *</label>
                <input className="form-input" value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="e.g. HDFC Bank" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Type</label>
                <div className="select-wrapper">
                  <select className="form-input" value={form.accountType} onChange={e => set('accountType', e.target.value)}>
                    <option value="bank">Bank</option>
                    <option value="cash">Cash</option>
                    <option value="card">Credit Card</option>
                    <option value="wallet">Wallet</option>
                    <option value="other">Other</option>
                  </select>
                  <svg className="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>
            {/* Row 2: Account Number | IFSC Code */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Account Number</label>
                <input className="form-input" value={form.accountNumber} onChange={e => set('accountNumber', e.target.value)} placeholder="Optional" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">IFSC Code</label>
                <input className="form-input" value={form.ifscCode} onChange={e => set('ifscCode', e.target.value.toUpperCase())} placeholder="Optional" />
              </div>
            </div>
            {/* Row 3: Bank Name | Opening Balance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Bank Name</label>
                <input className="form-input" value={form.accountHolder} onChange={e => set('accountHolder', e.target.value)} placeholder="e.g. HDFC Bank Ltd" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Opening Balance</label>
                <input className="form-input" type="number" step="0.01" value={form.openingBalance} onChange={e => set('openingBalance', e.target.value)} placeholder="0.00" />
              </div>
            </div>
            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn-secondary" onClick={closeForm} style={{ flex: 1 }}>Cancel</button>
              <button type="submit" className="btn-accounts-primary" disabled={saving} style={{ flex: 1.5 }}>{saving ? 'Saving…' : 'Add Account'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Total Balance */}
      {bankAccounts.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: 14, padding: '20px 24px', marginBottom: 24, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Total Available Balance</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{fmt(totalBalance)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{bankAccounts.length} account{bankAccounts.length > 1 ? 's' : ''}</div>
          </div>
        </div>
      )}

      {/* Bank Cards */}
      {bankAccounts.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M3 22V12M21 22V12M12 22V12M3 12l9-9 9 9M2 22h20"/></svg>
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No bank accounts</div>
          <div style={{ fontSize: 14 }}>Add your first bank account to start tracking balances</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {bankAccounts.map(bank => {
            const color = getBankColor(bank.bankName);
            return (
              <div key={bank.id} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ background: `linear-gradient(135deg, ${color}dd, ${color})`, padding: '18px 20px', color: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{bank.bankName}</div>
                      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{bank.accountType?.charAt(0).toUpperCase() + bank.accountType?.slice(1)} Account</div>
                    </div>
                    {bank.isDefault && (
                      <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.25)', padding: '3px 8px', borderRadius: 10, fontWeight: 600 }}>DEFAULT</span>
                    )}
                  </div>
                  <div style={{ marginTop: 16, fontSize: 13, opacity: 0.9, letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                    •••• •••• {(bank.accountNumber || '').slice(-4) || '——'}
                  </div>
                </div>
                <div style={{ background: '#fff', padding: '16px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Current Balance</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(bank.currentBalance)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Opening Balance</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)' }}>{fmt(bank.openingBalance)}</div>
                    </div>
                  </div>
                  {bank.ifscCode && (
                    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                      IFSC: <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{bank.ifscCode}</span>
                    </div>
                  )}
                  {bank.accountHolder && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Bank: {bank.accountHolder}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
        Balance auto-updates from general entries.
      </div>
    </div>
  );
};
