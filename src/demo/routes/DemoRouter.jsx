import React, { useState, useEffect, useRef } from 'react';
import { AuthGuard } from '../../shared/utils/authGuard';
import { DemoLayout } from '../components/Layout';
import { DemoProvider } from '../context/DemoContext';
import { Dashboard } from '../../pages/Dashboard';
import { Customers } from '../../pages/Customers';
import { Quotes } from '../../pages/Quotes';
import { Bookings } from '../../pages/Bookings';
import { LiveTrips } from '../../pages/LiveTrips';
import { Payments } from '../../pages/Payments';
import { SalesInvoices } from '../../pages/SalesInvoices';
import { Settings } from '../../pages/Settings';
import { Accounts } from '../../pages/Accounts';
import { CreateQuote } from '../../pages/CreateQuote';
import { CustomerProfile } from '../../pages/CustomerProfile';
import { QuoteDetail } from '../../pages/QuoteDetail';
import { PageSkeleton } from '../../shared/components/PageSkeleton';
import { registerCustomerNav } from '../../utils/customerNav';
import { registerQuoteNav } from '../../utils/quoteNav';
import { registerCreateQuoteNav } from '../../utils/createQuoteNav';
import { registerBillingNav } from '../../utils/billingNav';
import { registerEditQuoteNav } from '../../utils/editQuoteNav';
import { registerBookingNav } from '../../utils/bookingNav';
import { registerDesignerNav } from '../../utils/designerNav';
import { Billing } from '../../pages/Billing';
import { BookingDetail } from '../../pages/BookingDetail';
import { QuoteDesigner } from '../../pages/QuoteDesigner';

export const DemoRouter = ({ onSwitchMode }) => {
  const [activeView, setActiveView] = useState(() => sessionStorage.getItem('demo_activeView') || 'dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingView, setPendingView] = useState(activeView);
  const [customerProfileId, setCustomerProfileId] = useState(() => sessionStorage.getItem('demo_customerProfileId') || null);
  const [profileFromView, setProfileFromView] = useState(() => sessionStorage.getItem('demo_profileFromView') || 'customers');
  const [quoteDetailId, setQuoteDetailId] = useState(() => sessionStorage.getItem('demo_quoteDetailId') || null);
  const [quoteFromView, setQuoteFromView] = useState(() => sessionStorage.getItem('demo_quoteFromView') || 'quotes');
  const [createQuoteCustomer, setCreateQuoteCustomer] = useState(null);
  const [editQuoteData, setEditQuoteData] = useState(null);
  const [billingFromView, setBillingFromView] = useState('dashboard');
  const [bookingDetailId, setBookingDetailId] = useState(() => sessionStorage.getItem('demo_bookingDetailId') || null);
  const [bookingFromView, setBookingFromView] = useState(() => sessionStorage.getItem('demo_bookingFromView') || 'bookings');
  const [designerQuoteId, setDesignerQuoteId] = useState(null);
  const [designerQuoteData, setDesignerQuoteData] = useState(null);
  const [designerFromView, setDesignerFromView] = useState('create-quote');
  const activeViewRef = useRef(activeView);

  useEffect(() => { activeViewRef.current = activeView; }, [activeView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPendingView(null);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Register navigation handlers
  useEffect(() => {
    registerCustomerNav((customerId, fromView) => {
      const fv = fromView || activeViewRef.current;
      setCustomerProfileId(customerId);
      setProfileFromView(fv);
      sessionStorage.setItem('demo_customerProfileId', customerId);
      sessionStorage.setItem('demo_profileFromView', fv);
      handleViewChange('customer-profile');
    });
  }, []);

  useEffect(() => {
    registerCreateQuoteNav((customer) => {
      setCreateQuoteCustomer(customer);
      handleViewChange('create-quote');
    });
  }, []);

  useEffect(() => {
    registerEditQuoteNav((formData) => {
      setCreateQuoteCustomer(null);
      setEditQuoteData(formData);
      handleViewChange('create-quote');
    });
  }, []);

  useEffect(() => {
    registerBillingNav((fromView) => {
      const fv = fromView || activeViewRef.current;
      setBillingFromView(fv);
      handleViewChange('billing');
    });
  }, []);

  useEffect(() => {
    registerBookingNav((bookingId, fromView) => {
      const fv = fromView || activeViewRef.current;
      setBookingDetailId(bookingId);
      setBookingFromView(fv);
      sessionStorage.setItem('demo_bookingDetailId', bookingId);
      sessionStorage.setItem('demo_bookingFromView', fv);
      handleViewChange('booking-detail');
    });
  }, []);

  useEffect(() => {
    registerDesignerNav((quoteId, quoteData, fromView) => {
      const fv = fromView || activeViewRef.current;
      setDesignerQuoteId(quoteId);
      setDesignerQuoteData(quoteData);
      setDesignerFromView(fv);
      handleViewChange('quote-designer');
    });
  }, []);

  useEffect(() => {
    registerQuoteNav((quoteId, fromView) => {
      const fv = fromView || activeViewRef.current;
      setQuoteDetailId(quoteId);
      setQuoteFromView(fv);
      sessionStorage.setItem('demo_quoteDetailId', quoteId);
      sessionStorage.setItem('demo_quoteFromView', fv);
      handleViewChange('quote-detail');
    });
  }, []);

  const handleViewChange = (newView) => {
    if (newView === activeView && !isLoading) return;

    if (activeViewRef.current === 'create-quote' && newView !== 'create-quote') {
      setCreateQuoteCustomer(null);
      setEditQuoteData(null);
    }

    setPendingView(newView);
    setIsLoading(true);
    sessionStorage.setItem('demo_activeView', newView);

    setTimeout(() => {
      setActiveView(newView);
      setIsLoading(false);
      setPendingView(null);
    }, 600);
  };

  return (
    <AuthGuard>
      <DemoProvider>
        <DemoLayout
          activeView={isLoading ? pendingView : activeView}
          onViewChange={handleViewChange}
          onSwitchMode={onSwitchMode}
        >
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
        </DemoLayout>
      </DemoProvider>
    </AuthGuard>
  );
};
