import React, { useState, useEffect } from 'react';
import { Header } from '../shared/components/Header';
import { QuotesSearchBar } from '../shared/components/QuotesSearchBar';
import { QuotesTable } from '../shared/components/QuotesTable';
import { buildEditFormData } from '../shared/utils/buildEditFormData';
import { useDemoPopup, useDemoData } from '../context/DemoContext';
import { TableSkeleton } from '../shared/components/PageSkeleton';
import { ExportDropdown } from '../shared/components/ExportDropdown';
import { QuoteTypeModal } from '../shared/components/QuoteTypeModal';

const QUOTES_COLUMNS = [
  { header: 'Quote #',      key: 'id' },
  { header: 'Customer',     key: 'customerName' },
  { header: 'Destination',  key: 'destName' },
  { header: 'Trip Date',    key: 'tripDate' },
  { header: 'Amount (₹)',   key: 'amount' },
  { header: 'Profit (₹)',   key: 'profit' },
  { header: 'Status',       key: 'status' },
];

export const Quotes = ({ onViewChange }) => {
  const triggerDemoPopup = useDemoPopup();
  const { quotes, updateQuote, convertQuote, deleteQuote, customers, quoteDetailData } = useDemoData();
  const [activeFilter, setActiveFilter] = useState(() => sessionStorage.getItem('quotes_activeFilter') || 'all');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);

  // Persist filter changes
  useEffect(() => {
    sessionStorage.setItem('quotes_activeFilter', activeFilter);
  }, [activeFilter]);

  const handleQuoteAction = (actionType, quoteId) => {
    switch (actionType) {
      case 'approve':
        updateQuote(quoteId, { status: 'approved' });
        break;
      case 'reject':
        updateQuote(quoteId, { status: 'rejected' });
        break;
      case 'back-to-sent':
        updateQuote(quoteId, { status: 'sent' });
        break;
      case 'reopen':
        updateQuote(quoteId, { status: 'draft' });
        break;
      case 'convert':
        convertQuote(quoteId);
        break;
      case 'delete':
        if (deleteQuote) deleteQuote(quoteId);
        break;
      default:
        break;
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesFilter = activeFilter === 'all' || q.status === activeFilter;
    const matchesType   = activeTypeFilter === 'all' || (q.quoteType || q.type || 'detailed') === activeTypeFilter;
    const matchesSearch = searchQuery === '' ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.destName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesType && matchesSearch;
  });

  const handleRefresh = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setActiveTypeFilter('all');
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
        onNewQuote={() => setShowTypeModal(true)}
      />

      <QuotesSearchBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeTypeFilter={activeTypeFilter}
        onTypeFilterChange={setActiveTypeFilter}
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
          customers={customers}
          quoteDetailData={quoteDetailData}
          buildEditFormData={buildEditFormData}
          onAction={handleQuoteAction}
          companyName="Wanderlust Travels"
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

      {showTypeModal && (
        <QuoteTypeModal
          onClose={() => setShowTypeModal(false)}
          onContinue={(type) => {
            setShowTypeModal(false);
            if (type === 'quick') {
              onViewChange && onViewChange('quick-quote');
            } else {
              onViewChange && onViewChange('create-quote');
            }
          }}
        />
      )}
    </div>
  );
};
