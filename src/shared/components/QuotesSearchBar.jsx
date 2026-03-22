import React from 'react';

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'approved', label: 'Approved' },
  { id: 'converted', label: 'Converted' },
  { id: 'rejected', label: 'Rejected' },
];

export const QuotesSearchBar = ({ activeFilter, onFilterChange, searchQuery, onSearchChange, onRefresh, children }) => {
  return (
    <div className="page-search-bar">
      <div className="search-input-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search by quote number or customer..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-tabs">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
            onClick={() => onFilterChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button className="icon-btn refresh-btn" title="Refresh" onClick={onRefresh}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
      </button>
      {children}
    </div>
  );
};
