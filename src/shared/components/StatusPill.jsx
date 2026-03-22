// Migrated from: index.html & dashboard.css — zero visual or behavioral changes
import React from 'react';

const styles = {
  draft: 'bg-[#f3f4f6] text-[#4b5563] border-[rgba(75,85,99,0.2)]',
  sent: 'bg-[#eff6ff] text-[#2563eb] border-[rgba(59,130,246,0.2)]',
  approved: 'bg-[#ecfdf5] text-[#10b981] border-[rgba(16,185,129,0.2)]',
  converted: 'bg-[#fdf4ff] text-[#c026d3] border-[rgba(192,38,211,0.2)]',
  rejected: 'bg-[#fef2f2] text-[#ef4444] border-[rgba(239,68,68,0.2)]',
};

export const StatusPill = ({ status, interactive = false, onApprove, onReject }) => {
  const baseStyle = "inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-[20px] text-[0.75rem] font-[700] uppercase tracking-[0.05em] border-[1px]";
  const interactiveStyle = interactive ? "cursor-pointer transition-all duration-[0.2s] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[1px] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:brightness-[0.95]" : "";
  const pillClass = `${baseStyle} ${styles[status.toLowerCase()]} ${interactiveStyle}`;

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  if (!interactive) {
    return <span className={pillClass}>{label}</span>;
  }

  return (
    <div className="relative inline-block group z-[50]">
      <span className={pillClass}>
        {label} 
        <svg className="ml-[2px]" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
      <div className="absolute top-[calc(100%+4px)] left-0 bg-[#fff] border-[1px] border-[var(--border-color)] rounded-[8px] shadow-[var(--shadow-md)] p-[4px] min-w-[140px] opacity-0 invisible -translate-y-[10px] transition-all duration-[0.2s] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 group-hover:visible group-hover:translate-y-[0]">
        
        {onApprove && (
          <div 
            onClick={onApprove}
            className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[6px] text-[0.8rem] font-[600] text-[var(--text-secondary)] cursor-pointer transition-all duration-[0.15s] hover:text-[#10b981] hover:bg-[#ecfdf5]"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Approve
          </div>
        )}

        {onReject && (
          <div 
            onClick={onReject}
            className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[6px] text-[0.8rem] font-[600] text-[var(--text-secondary)] cursor-pointer transition-all duration-[0.15s] hover:text-[#ef4444] hover:bg-[#fef2f2]"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            Reject
          </div>
        )}

      </div>
    </div>
  );
};
