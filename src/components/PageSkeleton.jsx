import React from 'react';

const SkeletonBox = ({ className = '', width, height, style }) => (
  <div 
    className={`skeleton-box ${className}`} 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      ...style 
    }} 
  />
);

const SkeletonCard = ({ children, className = '' }) => (
  <div className={`stat-card ${className}`} style={{ minHeight: '120px' }}>
    {children}
  </div>
);

const DashboardSkeleton = () => (
  <div className="fade-in">
    <div className="page-header-strip" style={{ marginBottom: '24px', paddingBottom: '24px' }}>
      <SkeletonBox width="200px" height="32px" style={{ marginBottom: '8px' }} />
      <SkeletonBox width="300px" height="16px" />
    </div>

    <div className="stat-cards">
      {[1, 2, 3, 4].map(i => (
        <SkeletonCard key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <SkeletonBox width="100px" height="16px" />
            <div className="skeleton-pulse" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          </div>
          <SkeletonBox width="120px" height="28px" style={{ marginBottom: '8px' }} />
          <SkeletonBox width="80px" height="14px" />
        </SkeletonCard>
      ))}
    </div>

    <div className="dashboard-body">
      <div className="revenue-chart-card" style={{ flex: 1 }}>
        <div className="chart-header">
           <SkeletonBox width="150px" height="20px" />
           <SkeletonBox width="100px" height="30px" />
        </div>
        <div style={{ height: '220px', marginTop: '20px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '0 20px' }}>
          {[...Array(12)].map((_, i) => (
            <SkeletonBox key={i} width="100%" height={`${30 + Math.random() * 60}%`} />
          ))}
        </div>
      </div>
      <div className="recent-activity-card" style={{ width: '340px' }}>
         <SkeletonBox width="150px" height="20px" style={{ marginBottom: '20px' }} />
         {[1, 2, 3, 4, 5].map(i => (
           <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div className="skeleton-pulse" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <SkeletonBox width="100%" height="14px" style={{ marginBottom: '6px' }} />
                <SkeletonBox width="60%" height="12px" />
              </div>
           </div>
         ))}
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 6, showHeader = true }) => (
  <div className="data-table-card fade-in">
    <table className="data-table">
      {showHeader && (
        <thead>
          <tr>
            {[...Array(cols)].map((_, i) => (
              <th key={i}><SkeletonBox width="60%" height="12px" /></th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {[...Array(rows)].map((_, i) => (
          <tr key={i}>
            {[...Array(cols)].map((_, j) => (
              <td key={j}><SkeletonBox width={`${70 + Math.random() * 20}%`} height="14px" /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PaymentsSkeleton = () => (
  <div className="fade-in">
    <div className="page-header-strip" style={{ marginBottom: '24px', paddingBottom: '24px' }}>
      <SkeletonBox width="180px" height="32px" style={{ marginBottom: '8px' }} />
      <SkeletonBox width="150px" height="16px" />
    </div>
    <div className="payment-stats" style={{ marginBottom: '24px' }}>
       {[1, 2, 3, 4].map(i => (
         <div key={i} className="pstat-card" style={{ display: 'flex', gap: '16px', padding: '20px' }}>
           <div className="skeleton-pulse" style={{ width: '40px', height: '40px', borderRadius: '12px' }} />
           <div style={{ flex: 1 }}>
             <SkeletonBox width="80px" height="20px" style={{ marginBottom: '8px' }} />
             <SkeletonBox width="100px" height="14px" />
           </div>
         </div>
       ))}
    </div>
    <TableSkeleton cols={8} />
  </div>
);

const SettingsSkeleton = () => (
  <div className="fade-in">
    <div className="settings-header-strip" style={{ marginBottom: '24px', paddingBottom: '24px' }}>
      <SkeletonBox width="150px" height="32px" style={{ marginBottom: '8px' }} />
      <SkeletonBox width="250px" height="16px" />
    </div>
    <div className="settings-wrap-container">
      <div className="settings-nav" style={{ width: '220px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="skeleton-pulse" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />
            <SkeletonBox width="100px" height="16px" />
          </div>
        ))}
      </div>
      <div className="settings-content-card" style={{ flex: 1, padding: '32px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
          <div className="skeleton-pulse" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
          <div style={{ flex: 1, paddingTop: '10px' }}>
             <SkeletonBox width="200px" height="24px" style={{ marginBottom: '8px' }} />
             <SkeletonBox width="150px" height="16px" />
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: '24px' }}>
            <SkeletonBox width="120px" height="14px" style={{ marginBottom: '10px' }} />
            <SkeletonBox width="100%" height="40px" style={{ borderRadius: '8px' }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PageSkeleton = ({ view }) => {
  switch (view) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'payments':
      return <PaymentsSkeleton />;
    case 'settings':
      return <SettingsSkeleton />;
    case 'customers':
      return (
        <div className="fade-in">
          <div className="page-header-strip" style={{ marginBottom: '24px', paddingBottom: '24px' }}>
            <SkeletonBox width="180px" height="32px" style={{ marginBottom: '8px' }} />
            <SkeletonBox width="150px" height="16px" />
          </div>
          <div className="page-search-bar" style={{ marginBottom: '20px' }}>
            <SkeletonBox width="100%" height="40px" style={{ borderRadius: '10px' }} />
          </div>
          <div className="customer-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
             {[1, 2, 3, 4].map(i => <SkeletonBox key={i} width="100%" height="100px" style={{ borderRadius: '12px' }} />)}
          </div>
          <TableSkeleton cols={6} />
        </div>
      );
    case 'quotes':
    case 'bookings':
    case 'invoices':
    case 'livetrips':
      return (
        <div className="fade-in">
          <div className="page-header-strip" style={{ marginBottom: '24px', paddingBottom: '24px' }}>
            <SkeletonBox width="180px" height="32px" style={{ marginBottom: '8px' }} />
            <SkeletonBox width="150px" height="16px" />
          </div>
          <div className="page-search-bar" style={{ marginBottom: '20px' }}>
             <SkeletonBox width="100%" height="40px" style={{ borderRadius: '10px' }} />
          </div>
          <div className="page-search-bar" style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
             <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                {[1, 2, 3, 4].map(i => <SkeletonBox key={i} width="80px" height="32px" style={{ borderRadius: '20px' }} />)}
             </div>
             <SkeletonBox width="40px" height="32px" style={{ borderRadius: '8px' }} />
             <SkeletonBox width="100px" height="32px" style={{ borderRadius: '8px' }} />
          </div>
          <TableSkeleton cols={7} />
        </div>
      );
    default:
      return <DashboardSkeleton />;
  }
};
