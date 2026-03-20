// Migrated from: index.html & dashboard.css — zero visual or behavioral changes
import React from 'react';

export const SearchBar = ({ placeholder, onRefresh }) => {
  return (
    <div className="flex items-center gap-[12px] mb-[20px] flex-wrap">
      <div className="flex-1 min-w-[280px] h-[44px] bg-[#fff] border-[1px] border-[var(--border-color)] rounded-[12px] flex items-center px-[16px] gap-[12px] text-[var(--text-secondary)] transition-all duration-[0.2s] ease-[cubic-bezier(0.4,0,0.2,1)] focus-within:border-[#F47D5B] focus-within:shadow-[0_0_0_3px_rgba(244,125,91,0.15)] focus-within:text-[#F47D5B]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          type="text" 
          placeholder={placeholder || 'Search...'} 
          className="bg-transparent border-none outline-none text-[0.9rem] font-[500] text-[var(--text-primary)] w-full placeholder:text-[#cbd5e1]" 
        />
      </div>
      <button 
        onClick={onRefresh}
        className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center bg-[#fff] border-[1px] border-[var(--border-color)] text-[var(--text-secondary)] cursor-pointer transition-all duration-[0.2s] ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 hover:bg-[#f8fafc] hover:border-[#F47D5B] hover:text-[#F47D5B]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
      </button>
    </div>
  );
};
