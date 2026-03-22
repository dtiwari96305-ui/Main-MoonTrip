import React, { useState } from 'react';
import { Header } from '../../shared/components/Header';
import { RecordPaymentModal } from '../../shared/components/RecordPaymentModal';
import { PaymentDetailModal } from '../../shared/components/PaymentDetailModal';
import { ExportDropdown } from '../../shared/components/ExportDropdown';
import { TableSkeleton } from '../../shared/components/PageSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useData } from '../context/DataContext';

const PAYMENTS_COLUMNS = [
  { header: 'Payment #',  key: 'id' },
  { header: 'Customer',   key: 'customerName' },
  { header: 'Method',     key: 'modeLabel' },
  { header: 'Amount (₹)', key: 'amount' },
  { header: 'Type',       key: 'againstType' },
  { header: 'Date',       key: 'date' },
];

export const RealPayments = () => {
  const { payments, customers, addPayment, updatePayment, deletePayment, getPaymentById } = useData();
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [paymentDetailId, setPaymentDetailId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSavePayment = (formData) => {
    addPayment(formData);
    setRecordPaymentOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const handlePaymentAction = (action, paymentId, data) => {
    if (action === 'save' && data) {
      updatePayment(paymentId, data);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleDelete = (e, paymentId) => {
    e.stopPropagation();
    setDeleteTarget(paymentId);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deletePayment(deleteTarget);
      setDeleteTarget(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div id="view-payments" className="fade-in">
      <Header
        title="Payments"
        subtitle={`${payments.length} payment${payments.length !== 1 ? 's' : ''} recorded`}
        buttonLabel="Record Payment"
        onNewQuote={() => setRecordPaymentOpen(true)}
      />

      <div className="page-search-bar" style={{ marginBottom: 20 }}>
        <div className="search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" className="search-input" placeholder="Search payments..." />
        </div>
        <button className="icon-btn refresh-btn" title="Refresh" onClick={handleRefresh}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <ExportDropdown data={payments} columns={PAYMENTS_COLUMNS} sectionName="Payments" />
      </div>

      {isRefreshing ? (
        <TableSkeleton rows={5} cols={6} />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No payments recorded"
          description="Record your first payment to get started."
          actionLabel="Record Payment"
          onAction={() => setRecordPaymentOpen(true)}
        />
      ) : (
        <div className="data-table-card" key={refreshKey}>
          <table className="data-table">
            <thead>
              <tr>
                <th>PAYMENT #</th>
                <th>CUSTOMER</th>
                <th>AMOUNT</th>
                <th>MODE</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="animate-row" style={{ cursor: 'pointer' }} onClick={() => setPaymentDetailId(p.id)}>
                  <td><span className="qt-id cp-name-link">{p.id}</span></td>
                  <td>{p.customerName}</td>
                  <td><span className="qt-amount">{p.amount}</span></td>
                  <td><span className={`mode-badge mode-${p.modeType}`}>{p.modeLabel}</span></td>
                  <td><span className={`pdm-badge pdm-badge-${p.badge === 'Advance' ? 'advance' : p.badge === 'Full' ? 'full' : 'balance'}`}>{p.badge}</span></td>
                  <td>{p.date}</td>
                  <td>
                    <button className="action-btn delete-btn" title="Delete" onClick={(e) => handleDelete(e, p.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RecordPaymentModal
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        customers={customers}
        onSave={handleSavePayment}
      />

      {paymentDetailId && (
        <PaymentDetailModal
          paymentId={paymentDetailId}
          onClose={() => setPaymentDetailId(null)}
          getPaymentById={getPaymentById}
          onSave={handlePaymentAction}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Confirm Delete"
        message={`Are you sure you want to delete payment ${deleteTarget}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
