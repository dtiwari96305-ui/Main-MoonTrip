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
import { registerCreateQuoteNav } from '../utils/createQuoteNav';
import { registerBillingNav } from '../utils/billingNav';
import { registerEditQuoteNav } from '../utils/editQuoteNav';
import { registerBookingNav } from '../utils/bookingNav';
import { registerDesignerNav } from '../utils/designerNav';
import { Billing } from '../pages/Billing';
import { BookingDetail } from '../pages/BookingDetail';
import { QuoteDesigner } from '../pages/QuoteDesigner';

// Mock routing since original app didn't use URL paths for tabs
export const AppRouter = () => {
  const [activeView, setActiveView] = useState(() => sessionStorage.getItem('activeView') || 'dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingView, setPendingView] = useState(activeView);
  const [customerProfileId, setCustomerProfileId] = useState(() => sessionStorage.getItem('customerProfileId') || null);
  const [profileFromView, setProfileFromView] = useState(() => sessionStorage.getItem('profileFromView') || 'customers');
  const [quoteDetailId, setQuoteDetailId] = useState(() => sessionStorage.getItem('quoteDetailId') || null);
  const [quoteFromView, setQuoteFromView] = useState(() => sessionStorage.getItem('quoteFromView') || 'quotes');
  const [createQuoteCustomer, setCreateQuoteCustomer] = useState(null);
  const [editQuoteData, setEditQuoteData] = useState(null);
  const [billingFromView, setBillingFromView] = useState('dashboard');
  const [bookingDetailId, setBookingDetailId] = useState(() => sessionStorage.getItem('bookingDetailId') || null);
  const [bookingFromView, setBookingFromView] = useState(() => sessionStorage.getItem('bookingFromView') || 'bookings');
  const [designerQuoteId, setDesignerQuoteId] = useState(null);
  const [designerQuoteData, setDesignerQuoteData] = useState(null);
  const [designerFromView, setDesignerFromView] = useState('create-quote');
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

  // Register create-quote-with-customer navigation handler
  useEffect(() => {
    registerCreateQuoteNav((customer) => {
      setCreateQuoteCustomer(customer);
      handleViewChange('create-quote');
    });
  }, []);

  // Register edit-quote navigation handler
  useEffect(() => {
    registerEditQuoteNav((formData) => {
      setCreateQuoteCustomer(null);
      setEditQuoteData(formData);
      handleViewChange('create-quote');
    });
  }, []);

  // Register billing navigation handler
  useEffect(() => {
    registerBillingNav((fromView) => {
      const fv = fromView || activeViewRef.current;
      setBillingFromView(fv);
      handleViewChange('billing');
    });
  }, []);

  // Register global booking navigation handler
  useEffect(() => {
    registerBookingNav((bookingId, fromView) => {
      const fv = fromView || activeViewRef.current;
      setBookingDetailId(bookingId);
      setBookingFromView(fv);
      sessionStorage.setItem('bookingDetailId', bookingId);
      sessionStorage.setItem('bookingFromView', fv);
      handleViewChange('booking-detail');
    });
  }, []);

  // Register designer navigation handler
  useEffect(() => {
    registerDesignerNav((quoteId, quoteData, fromView) => {
      const fv = fromView || activeViewRef.current;
      setDesignerQuoteId(quoteId);
      setDesignerQuoteData(quoteData);
      setDesignerFromView(fv);
      handleViewChange('quote-designer');
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

    // Clear pre-filled customer / edit data when navigating away from create-quote
    if (activeViewRef.current === 'create-quote' && newView !== 'create-quote') {
      setCreateQuoteCustomer(null);
      setEditQuoteData(null);
    }

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
              {activeView === 'create-quote' && <CreateQuote onViewChange={handleViewChange} prefilledCustomer={createQuoteCustomer} editQuote={editQuoteData} />}
              {activeView === 'bookings' && <Bookings />}
              {activeView === 'booking-detail' && (
                <BookingDetail
                  bookingId={bookingDetailId}
                  fromView={bookingFromView}
                  onBack={() => handleViewChange(bookingFromView || 'bookings')}
                  onViewChange={handleViewChange}
                />
              )}
              {activeView === 'livetrips' && <LiveTrips />}
              {activeView === 'payments' && <Payments />}
              {activeView === 'invoices' && <SalesInvoices />}
              {activeView === 'accounts' && <Accounts />}
              {activeView === 'settings' && <Settings />}
              {activeView === 'billing' && (
                <Billing
                  fromView={billingFromView}
                  onBack={() => handleViewChange(billingFromView || 'settings')}
                />
              )}
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
              {activeView === 'quote-designer' && (
                <QuoteDesigner
                  quoteId={designerQuoteId}
                  quoteData={designerQuoteData}
                  fromView={designerFromView}
                  onBack={() => handleViewChange(designerFromView || 'create-quote')}
                />
              )}
            </>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
};
