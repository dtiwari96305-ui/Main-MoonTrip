import React, { useState, useEffect, useRef } from 'react';
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
import { CustomerProfile } from '../pages/CustomerProfile';
import { QuoteDetail } from '../pages/QuoteDetail';
import { PageSkeleton } from '../components/PageSkeleton';
import { registerCustomerNav } from '../utils/customerNav';
import { registerQuoteNav } from '../utils/quoteNav';

// Mock routing since original app didn't use URL paths for tabs
export const AppRouter = () => {
  const [activeView, setActiveView] = useState(() => sessionStorage.getItem('activeView') || 'dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingView, setPendingView] = useState(activeView);
  const [customerProfileId, setCustomerProfileId] = useState(() => sessionStorage.getItem('customerProfileId') || null);
  const [profileFromView, setProfileFromView] = useState(() => sessionStorage.getItem('profileFromView') || 'customers');
  const [quoteDetailId, setQuoteDetailId] = useState(() => sessionStorage.getItem('quoteDetailId') || null);
  const [quoteFromView, setQuoteFromView] = useState(() => sessionStorage.getItem('quoteFromView') || 'quotes');
  const activeViewRef = useRef(activeView);

  useEffect(() => { activeViewRef.current = activeView; }, [activeView]);

  useEffect(() => {
    // Initial load skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPendingView(null);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Register global customer navigation handler
  useEffect(() => {
    registerCustomerNav((customerId, fromView) => {
      const fv = fromView || activeViewRef.current;
      setCustomerProfileId(customerId);
      setProfileFromView(fv);
      sessionStorage.setItem('customerProfileId', customerId);
      sessionStorage.setItem('profileFromView', fv);
      handleViewChange('customer-profile');
    });
  }, []);

  // Register global quote navigation handler
  useEffect(() => {
    registerQuoteNav((quoteId, fromView) => {
      const fv = fromView || activeViewRef.current;
      setQuoteDetailId(quoteId);
      setQuoteFromView(fv);
      sessionStorage.setItem('quoteDetailId', quoteId);
      sessionStorage.setItem('quoteFromView', fv);
      handleViewChange('quote-detail');
    });
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
              {activeView === 'customer-profile' && (
                <CustomerProfile
                  customerId={customerProfileId}
                  fromView={profileFromView}
                  onBack={() => handleViewChange(profileFromView || 'customers')}
                  onViewChange={handleViewChange}
                />
              )}
              {activeView === 'quote-detail' && (
                <QuoteDetail
                  quoteId={quoteDetailId}
                  fromView={quoteFromView}
                  onBack={() => handleViewChange(quoteFromView || 'quotes')}
                  onViewChange={handleViewChange}
                />
              )}
            </>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
};
