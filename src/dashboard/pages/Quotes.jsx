import React, { useState } from 'react';
import { Header } from '../../shared/components/Header';
import { QuotesSearchBar } from '../../shared/components/QuotesSearchBar';
import { QuotesTable } from '../../shared/components/QuotesTable';
import { TableSkeleton } from '../../shared/components/PageSkeleton';
import { ExportDropdown } from '../../shared/components/ExportDropdown';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { buildEditFormData } from '../../shared/utils/buildEditFormData';
import { useData } from '../context/DataContext';

const QUOTES_COLUMNS = [
  { header: 'Quote #',      key: 'id' },
  { header: 'Customer',     key: 'customerName' },
  { header: 'Destination',  key: 'destName' },
  { header: 'Trip Date',    key: 'tripDate' },
  { header: 'Amount (₹)',   key: 'amount' },
  { header: 'Profit (₹)',   key: 'profit' },
  { header: 'Status',       key: 'status' },
];

export const RealQuotes = ({ onViewChange }) => {
  const { quotes, customers, updateQuote, deleteQuote, getQuoteDetail } = useData();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredQuotes = quotes.filter(q => {
    const matchesFilter = activeFilter === 'all' || q.status === activeFilter;
    const matchesSearch = searchQuery === '' ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.destName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAction = (actionType, quoteId) => {
    if (actionType === 'approve') {
      updateQuote(quoteId, { status: 'approved' });
    } else if (actionType === 'reject') {
      updateQuote(quoteId, { status: 'rejected' });
    } else if (actionType === 'delete') {
      setDeleteTarget(quoteId);
      return; // Don't refresh yet — wait for confirmation
    }
    setRefreshKey(prev => prev + 1);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteQuote(deleteTarget);
      setDeleteTarget(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
      setIsRefreshing(false);
    }, 800);
  };

  // Build quoteDetailData map for QuotesTable
  const quoteDetailData = {};
  quotes.forEach(q => {
    const detail = getQuoteDetail(q.id);
    if (detail) quoteDetailData[q.id] = detail;
  });

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
      ) : quotes.length === 0 ? (
        <EmptyState
          title="No quotes yet"
          description="Create your first quote to get started."
          actionLabel="Create Quote"
          onAction={() => onViewChange && onViewChange('create-quote')}
        />
      ) : filteredQuotes.length > 0 ? (
        <QuotesTable
          key={refreshKey}
          quotes={filteredQuotes}
          customers={customers}
          quoteDetailData={quoteDetailData}
          buildEditFormData={buildEditFormData}
          onAction={handleAction}
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

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Confirm Delete"
        message={`Are you sure you want to delete quote ${deleteTarget}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
