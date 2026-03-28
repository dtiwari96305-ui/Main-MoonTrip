import React, { useMemo, useState } from 'react';
import { VendorPaymentModal } from '../../components/vendor/VendorPaymentModal';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const SERVICE_LABELS = {
  flight: '✈ Flight', hotel: '🏨 Hotel', cab: '🚗 Cab',
  bus: '🚌 Bus', train: '🚆 Train', visa: '📋 Visa',
  insurance: '🛡 Insurance', other: '⚙ Other',
};

const STATUS_COLORS = {
  unpaid: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  partial: { bg: 'rgba(249,115,22,0.15)', color: '#fb923c' },
  paid: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80' },
};

export const VendorDetail = ({ vendorId, vendors, vendorBills, vendorPayments, addVendorPayment, onBack, onViewChange }) => {
  const [payModal, setPayModal] = useState(null); // bill to pay

  const vendor = vendors.find(v => v.id === vendorId);
  const bills = vendorBills.filter(b => b.vendorId === vendorId);
  const payments = vendorPayments.filter(p => p.vendorId === vendorId);

  const totalBilled = useMemo(() => bills.reduce((s, b) => s + b.netPayable, 0), [bills]);
  const totalPaid = useMemo(() => payments.reduce((s, p) => s + p.amount, 0), [payments]);
  const outstanding = totalBilled - totalPaid;

  if (!vendor) {
    return (
      <div className="page-content">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <p style={{ color: '#6b7280', marginTop: 24 }}>Vendor not found.</p>
      </div>
    );
  }

  // Combined ledger: bills + payments sorted by date
  const ledger = [
    ...bills.map(b => ({ ...b, _type: 'bill', _date: b.serviceDate || b.createdAt })),
    ...payments.map(p => ({ ...p, _type: 'payment', _date: p.paymentDate || p.createdAt })),
  ].sort((a, b) => new Date(b._date) - new Date(a._date));

  return (
    <div className="page-content">
      <button className="back-btn" onClick={onBack}>← Back to Vendors</button>

      {/* Header */}
      <div className="page-header" style={{ marginTop: 16 }}>
        <div>
          <h1 className="page-title">{vendor.name}</h1>
          {vendor.notes && <p className="page-subtitle">{vendor.notes}</p>}
        </div>
        <button className="btn-primary" onClick={() => onViewChange('create-vendor-bill', vendor.id)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Bill
        </button>
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="detail-card">
          <div className="detail-card-title">Contact</div>
          <div className="detail-row"><span>Person</span><span>{vendor.contactPerson || '—'}</span></div>
          <div className="detail-row"><span>Phone</span><span>{vendor.phone || '—'}</span></div>
          <div className="detail-row"><span>Email</span><span>{vendor.email || '—'}</span></div>
        </div>
        <div className="detail-card">
          <div className="detail-card-title">Tax & Bank</div>
          <div className="detail-row"><span>GST</span><span>{vendor.gstNumber || '—'}</span></div>
          <div className="detail-row"><span>PAN</span><span>{vendor.panNumber || '—'}</span></div>
          <div className="detail-row"><span>Bank</span><span>{vendor.bankName || '—'}</span></div>
          <div className="detail-row"><span>Account</span><span>{vendor.bankAccount || '—'}</span></div>
          <div className="detail-row"><span>IFSC</span><span>{vendor.ifscCode || '—'}</span></div>
        </div>
      </div>

      {/* Financial summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Billed', value: fmt(totalBilled), color: '#d1d5db' },
          { label: 'Total Paid', value: fmt(totalPaid), color: '#4ade80' },
          { label: 'Outstanding', value: fmt(outstanding), color: outstanding > 0 ? '#f97316' : '#4ade80' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div><div className="stat-value" style={{ color: s.color }}>{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Ledger */}
      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e8eaed', marginBottom: 12 }}>Transaction Ledger</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Type</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ledger.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#6b7280', padding: 32 }}>No transactions yet.</td></tr>
            ) : ledger.map((item) => {
              if (item._type === 'bill') {
                const sc = STATUS_COLORS[item.status] || STATUS_COLORS.unpaid;
                return (
                  <tr key={`bill-${item.id}`}>
                    <td style={{ color: '#9ca3af', fontSize: 13 }}>{item.serviceDate || '—'}</td>
                    <td style={{ color: '#e8eaed', fontWeight: 500 }}>{item.billNumber}</td>
                    <td><span style={{ fontSize: 12, color: '#a5b4fc', background: 'rgba(99,102,241,0.12)', padding: '2px 8px', borderRadius: 20 }}>Bill</span></td>
                    <td style={{ color: '#d1d5db' }}>{SERVICE_LABELS[item.serviceType] || item.serviceType}</td>
                    <td style={{ color: '#f87171', fontWeight: 600 }}>−{fmt(item.netPayable)}</td>
                    <td>
                      <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 20, background: sc.bg, color: sc.color }}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status !== 'paid' && (
                        <button className="btn-ghost-sm" onClick={() => setPayModal(item)}>Pay</button>
                      )}
                    </td>
                  </tr>
                );
              }
              // payment row
              return (
                <tr key={`pay-${item.id}`}>
                  <td style={{ color: '#9ca3af', fontSize: 13 }}>{item.paymentDate || '—'}</td>
                  <td style={{ color: '#e8eaed', fontWeight: 500 }}>{item.paymentNumber}</td>
                  <td><span style={{ fontSize: 12, color: '#4ade80', background: 'rgba(74,222,128,0.12)', padding: '2px 8px', borderRadius: 20 }}>Payment</span></td>
                  <td style={{ color: '#9ca3af', fontSize: 12 }}>
                    {item.paymentMode?.replace('_', ' ')}
                    {item.reference ? ` · ${item.reference}` : ''}
                  </td>
                  <td style={{ color: '#4ade80', fontWeight: 600 }}>+{fmt(item.amount)}</td>
                  <td>—</td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {payModal && (
        <VendorPaymentModal
          bill={payModal}
          vendor={vendor}
          onSave={addVendorPayment}
          onClose={() => setPayModal(null)}
        />
      )}
    </div>
  );
};
