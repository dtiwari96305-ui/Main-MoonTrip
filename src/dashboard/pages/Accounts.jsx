import React from 'react';
import { Header } from '../../shared/components/Header';
import { useData } from '../context/DataContext';

export const RealAccounts = () => {
  const { payments } = useData();

  const totalReceived = payments.reduce((sum, p) => {
    return sum + (parseInt((p.amount || '0').replace(/[₹,]/g, ''), 10) || 0);
  }, 0);

  return (
    <div id="view-accounts" className="fade-in">
      <Header title="Accounts" subtitle="Financial overview" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #48bb78, #38a169)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Total Received</p>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>₹{totalReceived.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Payments Count</p>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{payments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
