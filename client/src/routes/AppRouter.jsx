import React, { useState, useEffect } from 'react';
import { AuthGuard } from '../utils/authGuard';
import { Layout } from '../components/Layout';
import { Dashboard } from '../pages/Dashboard';
import { Customers } from '../pages/Customers';
import { Quotes } from '../pages/Quotes';
import { Bookings } from '../pages/Bookings';
import { LiveTrips } from '../pages/LiveTrips';
import { Payments } from '../pages/Payments';
import { SalesInvoices } from '../pages/SalesInvoices';
import { Settings } from '../pages/Settings';
import { Accounts } from '../pages/Accounts';
import { CreateQuote } from '../pages/CreateQuote';
import { PageSkeleton } from '../components/PageSkeleton';

// Mock routing since original app didn't use URL paths for tabs
export const AppRouter = () => {
  const [activeView, setActiveView] = useState(() => sessionStorage.getItem('activeView') || 'dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingView, setPendingView] = useState(activeView);

  useEffect(() => {
    // Initial load skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPendingView(null);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleViewChange = (newView) => {
    if (newView === activeView && !isLoading) return;
    
    setPendingView(newView);
    setIsLoading(true);
    sessionStorage.setItem('activeView', newView);

    // Minimum skeleton duration for natural feel
    setTimeout(() => {
      setActiveView(newView);
      setIsLoading(false);
      setPendingView(null);
    }, 600);
  };

  return (
    <AuthGuard>
      <Layout activeView={isLoading ? pendingView : activeView} onViewChange={handleViewChange}>
        <div className="fade-in" key={isLoading ? 'loading' : activeView}>
          {isLoading ? (
            <PageSkeleton view={pendingView} />
          ) : (
            <>
              {activeView === 'dashboard' && <Dashboard onViewChange={handleViewChange} />}
              {activeView === 'customers' && <Customers />}
              {activeView === 'quotes' && <Quotes onViewChange={handleViewChange} />}
              {activeView === 'create-quote' && <CreateQuote onViewChange={handleViewChange} />}
              {activeView === 'bookings' && <Bookings />}
              {activeView === 'livetrips' && <LiveTrips />}
              {activeView === 'payments' && <Payments />}
              {activeView === 'invoices' && <SalesInvoices />}
              {activeView === 'accounts' && <Accounts />}
              {activeView === 'settings' && <Settings />}
            </>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
};
