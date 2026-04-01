import React, { useState, useMemo } from 'react';
import { VendorPaymentModal } from '../../components/vendor/VendorPaymentModal';
import { Header } from '../../components/Header';
import { openVendorDetail } from '../../../utils/vendorNav';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const MODE_LABELS = {
  bank_transfer: 'Bank Transfer',
  upi: 'UPI',
  cash: 'Cash',
  cheque: 'Cheque',
};

export const VendorPaymentsList = ({ vendorPayments, vendorBills, vendors, addVendorPayment, onViewChange, mode = 'demo' }) => {
  const [search, setSearch] = useState('');
  const [showPay, setShowPay] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vendorPayments.filter(p =>
      p.paymentNumber.toLowerCase().includes(q) ||
      p.vendorName.toLowerCase().includes(q) ||
      (p.reference || '').toLowerCase().includes(q)
    );
  }, [vendorPayments, search]);

  const totalPaid = useMemo(() => filtered.reduce((s, p) => s + p.amount, 0), [filtered]);
  const unpaidBills = useMemo(() => vendorBills.filter(b => b.status !== 'paid'), [vendorBills]);
  const totalOutstanding = useMemo(() => unpaidBills.reduce((s, b) => s + b.netPayable, 0), [unpaidBills]);

  return (
    <div className="page-content">
      <Header title="Vendor Payments" subtitle="All payments made to vendors" showNewQuote={false} mode={mode}>
        <button className="btn-primary" onClick={() => setShowPay(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Record Payment
        </button>
      </Header>

      {/* Stats */}
      <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Payments', value: filtered.length },
          { label: 'Amount Paid', value: fmt(totalPaid), color: '#4ade80' },
          { label: 'Outstanding', value: fmt(totalOutstanding), color: totalOutstanding > 0 ? '#f97316' : '#4ade80' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div><div className="stat-value" style={s.color ? { color: s.color } : {}}>{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by vendor name, payment number or reference..."
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '11px 14px 11px 40px',
            border: '1px solid #e5e7eb', borderRadius: 10,
            fontSize: 14, color: 'var(--text-primary)',
            background: '#fff', outline: 'none',
            fontFamily: 'var(--font)',
          }}
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Payment #</th>
              <th>Vendor</th>
              <th>Against Bill</th>
              <th>Date</th>
              <th>Mode</th>
              <th>Reference</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
                {search ? 'No payments match your search.' : 'No vendor payments recorded yet.'}
              </td></tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500, color: '#e8eaed' }}>{p.paymentNumber}</td>
                <td>
                  <button className="link-btn" onClick={() => mode === 'real' ? openVendorDetail(p.vendorId, 'vendors-payments') : onViewChange('vendor-detail', p.vendorId)}>
                    {p.vendorName}
                  </button>
                </td>
                <td style={{ color: '#9ca3af', fontSize: 13 }}>{p.billNumber !== '—' ? p.billNumber : '—'}</td>
                <td style={{ color: '#9ca3af', fontSize: 13 }}>{p.paymentDate || '—'}</td>
                <td style={{ color: '#d1d5db' }}>{MODE_LABELS[p.paymentMode] || p.paymentMode}</td>
                <td style={{ color: '#9ca3af', fontSize: 12 }}>{p.reference || '—'}</td>
                <td style={{ fontWeight: 600, color: '#4ade80' }}>{fmt(p.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPay && (
        <VendorPaymentModal
          bill={null}
          vendor={null}
          vendors={vendors}
          vendorBills={vendorBills}
          onSave={addVendorPayment}
          onClose={() => setShowPay(false)}
          mode={mode}
        />
      )}
    </div>
  );
};
