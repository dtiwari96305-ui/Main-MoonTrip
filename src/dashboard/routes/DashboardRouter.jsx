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
import { HelpSection } from '../../shared/components/HelpSection';
import { ManualSection } from '../../shared/components/ManualSection';
import { RealVendors } from '../pages/Vendors';
import { RealVendorDetail } from '../pages/VendorDetail';
import { RealVendorBills } from '../pages/VendorBills';
import { RealCreateVendorBill } from '../pages/CreateVendorBill';
import { RealVendorPayments } from '../pages/VendorPayments';
import { registerVendorNav } from '../../utils/vendorNav';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';


const DashboardRouterInner = ({ onSwitchMode }) => {
  const { settings, loading } = useData();
  const [activeView, setActiveView] = useState(() => sessionStorage.getItem('activeView') || 'dashboard');
  const [viewData, setViewData] = useState({});
  const [billingFromView, setBillingFromView] = useState(null);
  const [customerProfileId, setCustomerProfileId] = useState(() => sessionStorage.getItem('real_customerProfileId') || null);
  const [profileFromView, setProfileFromView] = useState(() => sessionStorage.getItem('real_profileFromView') || 'customers');
  const [quoteDetailId, setQuoteDetailId] = useState(() => sessionStorage.getItem('real_quoteDetailId') || null);
  const [quoteFromView, setQuoteFromView] = useState(() => sessionStorage.getItem('real_quoteFromView') || 'quotes');
  const [createQuoteCustomer, setCreateQuoteCustomer] = useState(null);
  const [editQuoteData, setEditQuoteData] = useState(null);
  const [bookingDetailId, setBookingDetailId] = useState(() => sessionStorage.getItem('real_bookingDetailId') || null);
  const [bookingFromView, setBookingFromView] = useState(() => sessionStorage.getItem('real_bookingFromView') || 'bookings');
  const [designerQuoteId, setDesignerQuoteId] = useState(null);
  const [designerQuoteData, setDesignerQuoteData] = useState(null);
  const [designerFromView, setDesignerFromView] = useState('create-quote');
  const [vendorDetailId, setVendorDetailId] = useState(null);
  const [vendorDetailFrom, setVendorDetailFrom] = useState('vendors-list');
  const [createBillVendorId, setCreateBillVendorId] = useState(null);
  const activeViewRef = useRef(activeView);

  useEffect(() => { activeViewRef.current = activeView; }, [activeView]);

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

  useEffect(() => {
    registerVendorNav((action, id, fromView) => {
      const fv = fromView || activeViewRef.current;
      if (action === 'vendor-detail') {
        setVendorDetailId(id);
        setVendorDetailFrom(fv);
        handleViewChange('vendor-detail');
      } else if (action === 'create-vendor-bill') {
        setCreateBillVendorId(id || null);
        handleViewChange('create-vendor-bill');
      }
    });
  }, []);

  const handleViewChange = (view, data = {}) => {
    setActiveView(view);
    setViewData(data);
    if (view === 'billing') {
      setBillingFromView(activeView);
    }
    if (activeViewRef.current === 'create-quote' && view !== 'create-quote') {
      setCreateQuoteCustomer(null);
      setEditQuoteData(null);
    }
    sessionStorage.setItem('activeView', view);
  };

  if (loading) {
    return (
      <RealLayout
        activeView={activeView}
        onViewChange={handleViewChange}
        onSwitchMode={onSwitchMode}
        userName="Loading..."
      >
        <PageSkeleton view={activeView} />
      </RealLayout>
    );
  }

  return (
    <RealLayout
      activeView={activeView}
      onViewChange={handleViewChange}
      onSwitchMode={onSwitchMode}
      userName={settings?.company_name || settings?.business_name || 'Admin'}
    >
      <div className="fade-in" key={activeView}>
        <ErrorBoundary key={activeView}><>
          {activeView === 'dashboard' && <RealDashboard onViewChange={handleViewChange} />}
          {activeView === 'customers' && <RealCustomers onViewChange={handleViewChange} />}
          {activeView === 'quotes' && <RealQuotes onViewChange={handleViewChange} />}
          {activeView === 'create-quote' && <RealCreateQuote onViewChange={handleViewChange} prefilledCustomer={createQuoteCustomer} editQuote={editQuoteData} />}
          {activeView === 'bookings' && <RealBookings onViewChange={handleViewChange} />}
          {activeView === 'booking-detail' && (
            <RealBookingDetail
              bookingId={bookingDetailId}
              fromView={bookingFromView}
              onBack={() => handleViewChange(bookingFromView || 'bookings')}
              onViewChange={handleViewChange}
            />
          )}
          {activeView === 'livetrips' && <RealLiveTrips onViewChange={handleViewChange} />}
          {activeView === 'payments' && <RealPayments />}
          {activeView === 'invoices' && <RealSalesInvoices />}
          {activeView.startsWith('accounts') && <RealAccounts view={activeView} onViewChange={handleViewChange} />}
          {activeView === 'settings' && <RealSettings onViewChange={handleViewChange} />}
          {activeView === 'help' && <HelpSection mode="real" onViewChange={handleViewChange} />}
          {activeView === 'manual' && <ManualSection mode="real" initialSection={viewData.initialSection} />}
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
          {activeView === 'vendors-list' && <RealVendors onViewChange={handleViewChange} />}
          {activeView === 'vendors-bills' && <RealVendorBills onViewChange={handleViewChange} />}
          {activeView === 'vendors-payments' && <RealVendorPayments onViewChange={handleViewChange} />}
          {activeView === 'vendor-detail' && (
            <RealVendorDetail
              vendorId={vendorDetailId}
              onBack={() => handleViewChange(vendorDetailFrom || 'vendors-list')}
              onViewChange={(view, id) => {
                if (view === 'vendor-detail') { setVendorDetailId(id); setVendorDetailFrom('vendor-detail'); handleViewChange('vendor-detail'); }
                else if (view === 'create-vendor-bill') { setCreateBillVendorId(id || null); handleViewChange('create-vendor-bill'); }
                else handleViewChange(view);
              }}
            />
          )}
          {activeView === 'create-vendor-bill' && (
            <RealCreateVendorBill
              prefilledVendorId={createBillVendorId}
              onBack={() => handleViewChange(createBillVendorId ? 'vendor-detail' : 'vendors-bills')}
              onSuccess={() => handleViewChange('vendors-bills')}
            />
          )}
        </></ErrorBoundary>
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
