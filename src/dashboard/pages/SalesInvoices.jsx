import React from 'react';
import { Header } from '../../shared/components/Header';
import { EmptyState } from '../components/EmptyState';

export const RealSalesInvoices = () => {
  return (
    <div id="view-invoices" className="fade-in">
      <Header title="Sales Invoices" subtitle="Manage invoices" />
      <EmptyState
        title="No invoices yet"
        description="Invoices will be generated automatically when bookings are confirmed and payments recorded."
      />
    </div>
  );
};
