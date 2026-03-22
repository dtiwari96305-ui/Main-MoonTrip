import React, { useState, useEffect, useRef } from 'react';
import { AuthGuard } from '../../shared/utils/authGuard';
import { RealLayout } from '../components/Layout';
import { DataProvider, useData } from '../context/DataContext';
import { PageSkeleton } from '../../shared/components/PageSkeleton';
import { registerCustomerNav } from '../../utils/customerNav';
import { registerQuoteNav } from '../../utils/quoteNav';
import { registerCreateQuoteNav } from '../../utils/createQuoteNav';
import { registerBillingNav } from '../../utils/billingNav';
import { registerEditQuoteNav } from '../../utils/editQuoteNav';
import { registerBookingNav } from '../../utils/bookingNav';
import { registerDesignerNav } from '../../utils/designerNav';

// Real pages
import { RealDashboard } from '../pages/Dashboard';
import { RealCustomers } from '../pages/Customers';
import { RealQuotes } from '../pages/Quotes';
import { RealBookings } from '../pages/Bookings';
import { RealLiveTrips } from '../pages/LiveTrips';
import { RealPayments } from '../pages/Payments';
import { RealSalesInvoices } from '../pages/SalesInvoices';
import { RealSettings } from '../pages/Settings';
import { RealAccounts } from '../pages/Accounts';
import { RealCreateQuote } from '../pages/CreateQuote';
import { RealCustomerProfile } from '../pages/CustomerProfile';
import { RealQuoteDetail } from '../pages/QuoteDetail';
import { RealBilling } from '../pages/Billing';
import { RealBookingDetail } from '../pages/BookingDetail';
import { RealQuoteDesigner } from '../pages/QuoteDesigner';

const DashboardRouterInner = ({ onSwitchMode }) => {
  const { settings } = useData();
  const [activeView, setActiveView] = useState(() => sessionStorage.getItem('real_activeView') || 'dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingView, setPendingView] = useState(activeView);
  const [customerProfileId, setCustomerProfileId] = useState(() => sessionStorage.getItem('real_customerProfileId') || null);
  const [profileFromView, setProfileFromView] = useState(() => sessionStorage.getItem('real_profileFromView') || 'customers');
  const [quoteDetailId, setQuoteDetailId] = useState(() => sessionStorage.getItem('real_quoteDetailId') || null);
  const [quoteFromView, setQuoteFromView] = useState(() => sessionStorage.getItem('real_quoteFromView') || 'quotes');
  const [createQuoteCustomer, setCreateQuoteCustomer] = useState(null);
  const [editQuoteData, setEditQuoteData] = useState(null);
  const [billingFromView, setBillingFromView] = useState('dashboard');
  const [bookingDetailId, setBookingDetailId] = useState(() => sessionStorage.getItem('real_bookingDetailId') || null);
  const [bookingFromView, setBookingFromView] = useState(() => sessionStorage.getItem('real_bookingFromView') || 'bookings');
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

  useEffect(() => {
    registerCustomerNav((customerId, fromView) => {
      const fv = fromView || activeViewRef.current;
      setCustomerProfileId(customerId);
      setProfileFromView(fv);
      sessionStorage.setItem('real_customerProfileId', customerId);
      sessionStorage.setItem('real_profileFromView', fv);
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
      sessionStorage.setItem('real_bookingDetailId', bookingId);
      sessionStorage.setItem('real_bookingFromView', fv);
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
      sessionStorage.setItem('real_quoteDetailId', quoteId);
      sessionStorage.setItem('real_quoteFromView', fv);
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
    sessionStorage.setItem('real_activeView', newView);

    setTimeout(() => {
      setActiveView(newView);
      setIsLoading(false);
      setPendingView(null);
    }, 600);
  };

  return (
    <RealLayout
      activeView={isLoading ? pendingView : activeView}
      onViewChange={handleViewChange}
      onSwitchMode={onSwitchMode}
      userName={settings.userName || 'Admin'}
      userRole={settings.userRole || 'admin'}
      companyName={settings.companyName || 'My Agency'}
      companySubtitle={settings.companySubtitle || 'Travel & Tourism'}
    >
      <div className="fade-in" key={isLoading ? 'loading' : activeView}>
        {isLoading ? (
          <PageSkeleton view={pendingView} />
        ) : (
          <>
            {activeView === 'dashboard' && <RealDashboard onViewChange={handleViewChange} />}
            {activeView === 'customers' && <RealCustomers />}
            {activeView === 'quotes' && <RealQuotes onViewChange={handleViewChange} />}
            {activeView === 'create-quote' && <RealCreateQuote onViewChange={handleViewChange} prefilledCustomer={createQuoteCustomer} editQuote={editQuoteData} />}
            {activeView === 'bookings' && <RealBookings />}
            {activeView === 'booking-detail' && (
              <RealBookingDetail
                bookingId={bookingDetailId}
                fromView={bookingFromView}
                onBack={() => handleViewChange(bookingFromView || 'bookings')}
                onViewChange={handleViewChange}
              />
            )}
            {activeView === 'livetrips' && <RealLiveTrips />}
            {activeView === 'payments' && <RealPayments />}
            {activeView === 'invoices' && <RealSalesInvoices />}
            {activeView === 'accounts' && <RealAccounts />}
            {activeView === 'settings' && <RealSettings />}
            {activeView === 'billing' && (
              <RealBilling
                fromView={billingFromView}
                onBack={() => handleViewChange(billingFromView || 'settings')}
              />
            )}
            {activeView === 'customer-profile' && (
              <RealCustomerProfile
                customerId={customerProfileId}
                fromView={profileFromView}
                onBack={() => handleViewChange(profileFromView || 'customers')}
                onViewChange={handleViewChange}
              />
            )}
            {activeView === 'quote-detail' && (
              <RealQuoteDetail
                quoteId={quoteDetailId}
                fromView={quoteFromView}
                onBack={() => handleViewChange(quoteFromView || 'quotes')}
                onViewChange={handleViewChange}
              />
            )}
            {activeView === 'quote-designer' && (
              <RealQuoteDesigner
                quoteId={designerQuoteId}
                quoteData={designerQuoteData}
                fromView={designerFromView}
                onBack={() => handleViewChange(designerFromView || 'create-quote')}
              />
            )}
          </>
        )}
      </div>
    </RealLayout>
  );
};

export const DashboardRouter = ({ onSwitchMode }) => (
  <AuthGuard>
    <DataProvider>
      <DashboardRouterInner onSwitchMode={onSwitchMode} />
    </DataProvider>
  </AuthGuard>
);
