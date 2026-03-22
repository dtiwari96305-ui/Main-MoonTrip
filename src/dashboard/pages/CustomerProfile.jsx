import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { openQuoteDetail } from '../../utils/quoteNav';
import { openBookingDetail } from '../../utils/bookingNav';
import { openCreateQuoteWithCustomer } from '../../utils/createQuoteNav';
import { openBilling } from '../../utils/billingNav';
import { generateLedgerPdf } from '../../shared/utils/generateLedgerPdf';
import { CustomerSidePanel } from '../../shared/components/CustomerSidePanel';
import { RecordPaymentModal } from '../../shared/components/RecordPaymentModal';
import { PaymentDetailModal } from '../../shared/components/PaymentDetailModal';
import { EmptyState } from '../components/EmptyState';

export const RealCustomerProfile = ({ customerId, fromView, onBack, onViewChange }) => {
  const { customers, getCustomerById, getProfileData, updateCustomer, payments, getPaymentById, addPayment } = useData();
  const customer = getCustomerById(customerId);
  const ext = getProfileData(customerId);

  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [paymentDetailId, setPaymentDetailId] = useState(null);

  if (!customer) {
    return (
      <div className="fade-in" style={{ padding: 40 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: 600, marginBottom: 20, fontSize: '0.9rem' }}>
          ← Back to {fromView || 'customers'}
        </button>
        <EmptyState title="Customer not found" description="This customer may have been deleted." />
      </div>
    );
  }

  const customerPayments = payments.filter(p => p.customerName === customer.name);

  const handleEditSave = (formData) => {
    updateCustomer(customerId, formData);
    setEditPanelOpen(false);
  };

  const handleRecordPayment = (formData) => {
    addPayment({ ...formData, customerName: customer.name });
    setRecordPaymentOpen(false);
  };

  return (
    <div id="view-customer-profile" className="fade-in">
      <div className="cp-header">
        <button className="cp-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>

      <div className="cp-profile-card" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div className="user-avatar-sidebar" style={{ width: 48, height: 48, fontSize: '1.1rem' }}>
            {customer.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{customer.name}</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{customer.id} · {customer.type}</p>
          </div>
          <button
            onClick={() => setEditPanelOpen(true)}
            style={{ marginLeft: 'auto', padding: '6px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Edit
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Phone</span><br/><span style={{ fontSize: '0.85rem' }}>{customer.phone || '—'}</span></div>
          <div><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email</span><br/><span style={{ fontSize: '0.85rem' }}>{customer.email || '—'}</span></div>
          <div><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Location</span><br/><span style={{ fontSize: '0.85rem' }}>{customer.location || '—'}</span></div>
          <div><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Joined</span><br/><span style={{ fontSize: '0.85rem' }}>{customer.joined || '—'}</span></div>
        </div>
      </div>

      {/* Payments section */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Payments</h3>
          <button
            onClick={() => setRecordPaymentOpen(true)}
            style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'var(--accent, #667eea)', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Record Payment
          </button>
        </div>
        {customerPayments.length > 0 ? (
          <div className="data-table-card" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>Amount</th><th>Mode</th><th>Date</th></tr>
              </thead>
              <tbody>
                {customerPayments.map(p => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setPaymentDetailId(p.id)}>
                    <td><span className="cp-name-link">{p.id}</span></td>
                    <td>{p.amount}</td>
                    <td><span className={`mode-badge mode-${p.modeType}`}>{p.modeLabel}</span></td>
                    <td>{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No payment history.</p>
        )}
      </div>

      {paymentDetailId && (
        <PaymentDetailModal
          paymentId={paymentDetailId}
          onClose={() => setPaymentDetailId(null)}
          getPaymentById={getPaymentById}
          onSave={() => {}}
        />
      )}

      <CustomerSidePanel
        isOpen={editPanelOpen}
        mode="edit"
        customer={customer}
        profileExt={ext}
        onClose={() => setEditPanelOpen(false)}
        onSave={handleEditSave}
      />

      <RecordPaymentModal
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        preselectedCustomer={customer}
        customers={customers}
        onSave={handleRecordPayment}
      />
    </div>
  );
};
