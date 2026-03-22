import React, { useState } from 'react';
import { Header } from '../../shared/components/Header';
import { CustomerStats } from '../../shared/components/CustomerStats';
import { CustomersTable } from '../../shared/components/CustomersTable';
import { CustomerSidePanel } from '../../shared/components/CustomerSidePanel';
import { TableSkeleton } from '../../shared/components/PageSkeleton';
import { ExportDropdown } from '../../shared/components/ExportDropdown';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../context/DataContext';

const CUSTOMERS_COLUMNS = [
  { header: 'Customer #', key: 'id' },
  { header: 'Name',       key: 'name' },
  { header: 'Phone',      key: 'phone' },
  { header: 'Email',      key: 'email' },
  { header: 'Location',   key: 'location' },
  { header: 'Type',       key: 'type' },
  { header: 'Joined',     key: 'joined' },
];

export const RealCustomers = () => {
  const { customers, quotes, bookings, payments, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  // Side panel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState('add');
  const [panelCustomer, setPanelCustomer] = useState(null);
  const [panelProfileExt, setPanelProfileExt] = useState(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openAddPanel = () => {
    setPanelMode('add');
    setPanelCustomer(null);
    setPanelProfileExt(null);
    setPanelOpen(true);
  };

  const openEditPanel = (customer) => {
    setPanelMode('edit');
    setPanelCustomer(customer);
    setPanelProfileExt(null);
    setPanelOpen(true);
  };

  const handleSave = (formData) => {
    // Map CustomerSidePanel fields to data service fields
    const mapped = {
      ...formData,
      name: formData.fullName || formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      location: [formData.city, formData.state].filter(Boolean).join(', ') || formData.location || '',
      type: formData.customerType || formData.type || 'Individual',
    };
    if (panelMode === 'add') {
      addCustomer(mapped);
    } else if (panelCustomer) {
      updateCustomer(panelCustomer.id, mapped);
    }
    setPanelOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = (customerOrId) => {
    // CustomersTable passes the full customer object; extract id
    const id = typeof customerOrId === 'object' ? customerOrId.id : customerOrId;
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteCustomer(deleteTarget, { cascade: true });
      setDeleteTarget(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  // Build cascade warning message for delete modal
  const getDeleteMessage = () => {
    if (!deleteTarget) return '';
    const customer = customers.find(c => c.id === deleteTarget);
    const name = customer?.name || deleteTarget;
    const linkedQuotes = quotes.filter(q => q.customerName === name).length;
    const linkedBookings = bookings.filter(b => b.customerName === name).length;
    const linkedPayments = payments.filter(p => p.customerName === name).length;
    const parts = [];
    if (linkedQuotes > 0) parts.push(`${linkedQuotes} quote${linkedQuotes !== 1 ? 's' : ''}`);
    if (linkedBookings > 0) parts.push(`${linkedBookings} booking${linkedBookings !== 1 ? 's' : ''}`);
    if (linkedPayments > 0) parts.push(`${linkedPayments} payment${linkedPayments !== 1 ? 's' : ''}`);
    if (parts.length > 0) {
      return `This customer has ${parts.join(' and ')}. Deleting will remove all linked records. This action cannot be undone.`;
    }
    return `Are you sure you want to delete ${name}? This action cannot be undone.`;
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  const stats = [
    { label: 'Total Customers', value: customers.length, iconClass: 'cstat-icon-orange',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Individual', value: customers.filter(c => c.type === 'Individual').length, iconClass: 'cstat-icon-red',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { label: 'Corporate', value: customers.filter(c => c.type === 'Corporate').length, iconClass: 'cstat-icon-purple',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  ];

  return (
    <div id="view-customers" className="fade-in">
      <Header
        title="Customers"
        subtitle={`${customers.length} total customer${customers.length !== 1 ? 's' : ''}`}
        buttonLabel="Add Customer"
        onNewQuote={openAddPanel}
      />

      <div className="page-search-bar" style={{ marginBottom: 20 }}>
        <div className="search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, phone or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="icon-btn refresh-btn" title="Refresh" onClick={handleRefresh}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <ExportDropdown
          data={filteredCustomers}
          columns={CUSTOMERS_COLUMNS}
          sectionName="Customers"
        />
      </div>

      <CustomerStats stats={stats} />

      {isRefreshing ? (
        <TableSkeleton rows={5} cols={6} />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Add your first customer to get started."
          actionLabel="Add Customer"
          onAction={openAddPanel}
        />
      ) : (
        <CustomersTable
          key={refreshKey}
          customers={customers}
          searchQuery={searchQuery}
          onFilteredChange={setFilteredCustomers}
          onEdit={openEditPanel}
          onDelete={handleDelete}
        />
      )}

      <CustomerSidePanel
        isOpen={panelOpen}
        mode={panelMode}
        customer={panelCustomer}
        profileExt={panelProfileExt}
        onClose={() => setPanelOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Confirm Delete"
        message={getDeleteMessage()}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
