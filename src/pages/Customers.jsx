import React, { useState } from 'react';
import { Header } from '../components/Header';
import { CustomerStats } from '../components/CustomerStats';
import { CustomersTable, customers as allCustomers } from '../components/CustomersTable';
import { TableSkeleton } from '../components/PageSkeleton';
import { ExportDropdown } from '../components/ExportDropdown';

const CUSTOMERS_COLUMNS = [
  { header: 'Customer #', key: 'id' },
  { header: 'Name',       key: 'name' },
  { header: 'Phone',      key: 'phone' },
  { header: 'Email',      key: 'email' },
  { header: 'Location',   key: 'location' },
  { header: 'Type',       key: 'type' },
  { header: 'Joined',     key: 'joined' },
];

export const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState(allCustomers);

  const handleRefresh = () => {
    setSearchQuery('');
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div id="view-customers" className="fade-in">
      <Header title="Customers" subtitle="6 total customers" />

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
          fileBase="Customers_Export"
        />
      </div>

      <CustomerStats />
      {isRefreshing ? <TableSkeleton rows={5} cols={6} /> : <CustomersTable key={refreshKey} searchQuery={searchQuery} onFilteredChange={setFilteredCustomers} />}
    </div>

  );
};

export default Customers;

