import React, { useState, useEffect } from 'react';
import { Header } from '../shared/components/Header';
import { QuotesSearchBar } from '../shared/components/QuotesSearchBar';
import { QuotesTable } from '../shared/components/QuotesTable';
import { demoCustomers, demoQuoteDetailData } from '../shared/data/demoData';
import { buildEditFormData } from '../shared/utils/buildEditFormData';
import { useDemoPopup } from '../context/DemoContext';
import { TableSkeleton } from '../shared/components/PageSkeleton';
import { ExportDropdown } from '../shared/components/ExportDropdown';

const QUOTES_COLUMNS = [
  { header: 'Quote #',      key: 'id' },
  { header: 'Customer',     key: 'customerName' },
  { header: 'Destination',  key: 'destName' },
  { header: 'Trip Date',    key: 'tripDate' },
  { header: 'Amount (₹)',   key: 'amount' },
  { header: 'Profit (₹)',   key: 'profit' },
  { header: 'Status',       key: 'status' },
];

const initialQuotes = [
  { id: 'WL-Q-0001', customerName: 'Rahul Sharma', customerPhone: '+91 99876 54321', destName: 'Bali, Indonesia', destType: 'international', amount: '₹1,40,952', profit: '₹18,000', status: 'converted', tripDate: '15 Apr 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0002', customerName: 'Priya Mehta', customerPhone: '+91 98765 12345', destName: 'Jaipur - Udaipur - Jodhpur', destType: 'domestic', amount: '₹1,10,520', profit: '₹14,000', status: 'sent', tripDate: '01 May 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0003', customerName: 'Vikram Iyer', customerPhone: '+91 98456 78901', destName: 'Goa', destType: 'domestic', amount: '₹4,69,900', profit: '₹55,000', status: 'converted', tripDate: '20 Mar 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0004', customerName: 'Ananya Reddy', customerPhone: '+91 87654 32109', destName: 'Paris - Switzerland - Rome', destType: 'international', amount: '₹8,92,400', profit: '₹1,05,000', status: 'draft', tripDate: '10 Jun 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0005', customerName: 'Rajesh Patel', customerPhone: '+91 97654 32100', destName: 'Srinagar - Gulmarg - Pahalgam', destType: 'domestic', amount: '₹1,56,880', profit: '₹16,000', status: 'converted', tripDate: '05 Apr 2026', createdDate: '09 Mar 2026', createdTime: '12:19 pm' },
  { id: 'WL-Q-0006', customerName: 'Arjun Singh', customerPhone: '+91 91234 56789', destName: 'Leh - Ladakh', destType: 'domestic', amount: '₹78,500', profit: '₹9,500', status: 'approved', tripDate: '22 May 2026', createdDate: '10 Mar 2026', createdTime: '02:45 pm' },
  { id: 'WL-Q-0007', customerName: 'Kavita Sharma', customerPhone: '+91 99988 77766', destName: 'Dubai', destType: 'international', amount: '₹2,45,000', profit: '₹22,000', status: 'rejected', tripDate: '10 Apr 2026', createdDate: '08 Mar 2026', createdTime: '11:30 am' }
];

export const Quotes = ({ onViewChange }) => {
  const triggerDemoPopup = useDemoPopup();
  const [activeFilter, setActiveFilter] = useState(() => sessionStorage.getItem('quotes_activeFilter') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Persist filter changes
  useEffect(() => {
    sessionStorage.setItem('quotes_activeFilter', activeFilter);
  }, [activeFilter]);

  const filteredQuotes = initialQuotes.filter(q => {
    const matchesFilter = activeFilter === 'all' || q.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.destName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRefresh = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div id="view-quotes" className="fade-in">
      <Header
        title="Quotes"
        subtitle={`${filteredQuotes.length} quotation${filteredQuotes.length !== 1 ? 's' : ''}`}
        onNewQuote={() => onViewChange && onViewChange('create-quote')}
      />

      <QuotesSearchBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
      >
        <ExportDropdown
          data={filteredQuotes}
          columns={QUOTES_COLUMNS}
          sectionName="Quotes"
        />
      </QuotesSearchBar>

      {isRefreshing ? (
        <TableSkeleton rows={5} cols={7} />
      ) : filteredQuotes.length > 0 ? (
        <QuotesTable
          key={refreshKey}
          quotes={filteredQuotes}
          customers={demoCustomers}
          quoteDetailData={demoQuoteDetailData}
          buildEditFormData={buildEditFormData}
          onAction={triggerDemoPopup}
        />
      ) : (

        <div className="empty-state-card">
          <div className="empty-icon-wrap">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 className="empty-state-title">No quotes found</h3>
          <p className="empty-state-desc">Try adjusting your filters or search.</p>
        </div>
      )}
    </div>
  );
};
