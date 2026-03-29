import React, { useState, useMemo } from 'react';
import { VendorPaymentModal } from '../../components/vendor/VendorPaymentModal';
import { Header } from '../../components/Header';

const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const SERVICE_LABELS = {
  flight: '✈ Flight', hotel: '🏨 Hotel', cab: '🚗 Cab',
  bus: '🚌 Bus', train: '🚆 Train', visa: '📋 Visa',
  insurance: '🛡 Insurance', other: '⚙ Other',
};

const STATUS_TABS = ['all', 'pending', 'partial', 'paid'];

const STATUS_STYLE = {
  pending: { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
  unpaid:  { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
  partial: { bg: '#fff7ed', color: '#f97316', border: '#fed7aa' },
  paid:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
};

export const VendorBillsList = ({ vendorBills, vendors, addVendorPayment, onViewChange, mode = 'demo' }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [payModal, setPayModal] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vendorBills.filter(b => {
      const matchSearch =
        (b.billNumber || '').toLowerCase().includes(q) ||
        (b.vendorName || '').toLowerCase().includes(q) ||
        (b.bookingId || '').toLowerCase().includes(q);
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'pending' ? (b.status === 'unpaid' || b.status === 'pending') : b.status === filterStatus);
      return matchSearch && matchStatus;
    });
  }, [vendorBills, search, filterStatus]);

  return (
    <div className="page-content">
      <Header title="Vendor Bills" subtitle="Manage vendor costs and payments" showNewQuote={false} mode={mode}>
        <button
          className="btn-primary"
          style={{ background: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => onViewChange('create-vendor-bill')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Vendor Invoice
        </button>
      </Header>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            style={{
              padding: '7px 18px',
              borderRadius: 20,
              border: filterStatus === tab ? '1.5px solid var(--text-primary)' : '1.5px solid #e5e7eb',
              background: filterStatus === tab ? 'var(--text-primary)' : '#fff',
              color: filterStatus === tab ? '#fff' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: filterStatus === tab ? 600 : 400,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
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
          placeholder="Search by vendor name or booking number..."
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

      {/* Content */}
      {filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
            </svg>
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>No vendor bills yet</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {search || filterStatus !== 'all' ? 'No bills match your filters.' : 'Upload a vendor bill to get started'}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Vendor</th>
                <th>Service</th>
                <th>Date</th>
                <th>Gross</th>
                <th>Net Payable</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const ss = STATUS_STYLE[b.status] || STATUS_STYLE.unpaid;
                return (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 500 }}>{b.billNumber}</td>
                    <td>
                      <button className="link-btn" onClick={() => onViewChange('vendor-detail', b.vendorId)}>
                        {b.vendorName}
                      </button>
                    </td>
                    <td>{SERVICE_LABELS[b.serviceType] || b.serviceType}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{b.serviceDate || b.invoiceDate || '—'}</td>
                    <td>{fmt(b.grossAmount)}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(b.netPayable)}</td>
                    <td>
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                        {b.status === 'unpaid' ? 'Pending' : b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {b.status !== 'paid' && (
                        <button className="btn-ghost-sm" onClick={() => setPayModal({ bill: b, vendor: vendors.find(v => v.id === b.vendorId) })}>
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {payModal && (
        <VendorPaymentModal
          bill={payModal.bill}
          vendor={payModal.vendor}
          onSave={addVendorPayment}
          onClose={() => setPayModal(null)}
          mode={mode}
        />
      )}
    </div>
  );
};
