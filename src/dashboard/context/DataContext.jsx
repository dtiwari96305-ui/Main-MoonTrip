import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { createRealDataService } from '../services/realDataService';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const service = useMemo(() => createRealDataService(), []);

  // Live state — components re-render when these change
  const [customers, setCustomers] = useState(() => service.getCustomers());
  const [quotes, setQuotes] = useState(() => service.getQuotes());
  const [bookings, setBookings] = useState(() => service.getBookings());
  const [payments, setPayments] = useState(() => service.getPayments());
  const [invoices, setInvoices] = useState(() => service.getInvoices());
  const [settings, setSettings] = useState(() => service.getSettings());
  const [activities, setActivities] = useState(() => service.getActivities());

  // Refresh helpers — re-read from localStorage
  const refreshCustomers = useCallback(() => setCustomers(service.getCustomers()), [service]);
  const refreshQuotes = useCallback(() => setQuotes(service.getQuotes()), [service]);
  const refreshBookings = useCallback(() => setBookings(service.getBookings()), [service]);
  const refreshPayments = useCallback(() => setPayments(service.getPayments()), [service]);
  const refreshInvoices = useCallback(() => setInvoices(service.getInvoices()), [service]);
  const refreshActivities = useCallback(() => setActivities(service.getActivities()), [service]);

  const logActivity = useCallback((entry) => {
    service.addActivity(entry);
    refreshActivities();
  }, [service, refreshActivities]);

  // ─── Customer CRUD ────────────────────────────────────────
  const addCustomer = useCallback((data) => {
    const result = service.addCustomer(data);
    refreshCustomers();
    logActivity({
      type: 'customer',
      action: 'added',
      message: `New customer ${result.name || 'Unknown'} added`,
      name: result.name,
      id: result.id,
      icon: 'customer-add',
    });
    return result;
  }, [service, refreshCustomers, logActivity]);

  const updateCustomer = useCallback((id, updates) => {
    const existing = service.getCustomerById(id);
    const result = service.updateCustomer(id, updates);
    refreshCustomers();
    logActivity({
      type: 'customer',
      action: 'updated',
      message: `Customer ${existing?.name || updates.name || id} updated`,
      name: existing?.name || updates.name || '',
      id,
      icon: 'customer-edit',
    });
    return result;
  }, [service, refreshCustomers, logActivity]);

  const deleteCustomer = useCallback((id, { cascade = false } = {}) => {
    const existing = service.getCustomerById(id);
    const customerName = existing?.name || '';

    if (cascade && customerName) {
      // Delete all linked quotes
      const allQuotes = service.getQuotes();
      allQuotes.filter(q => q.customerName === customerName).forEach(q => {
        service.deleteQuote(q.id);
      });
      // Delete all linked bookings
      const allBookings = service.getBookings();
      allBookings.filter(b => b.customerName === customerName).forEach(b => {
        service.deleteBooking(b.id);
      });
      // Delete all linked payments
      const allPayments = service.getPayments();
      allPayments.filter(p => p.customerName === customerName).forEach(p => {
        service.deletePayment(p.id);
      });
    }

    service.deleteCustomer(id);
    refreshCustomers();
    refreshQuotes();
    refreshBookings();
    refreshPayments();
    logActivity({
      type: 'customer',
      action: 'deleted',
      message: `Customer ${customerName || id} deleted`,
      name: customerName,
      id,
      icon: 'customer-delete',
    });
  }, [service, refreshCustomers, refreshQuotes, refreshBookings, refreshPayments, logActivity]);

  // ─── Quote CRUD ───────────────────────────────────────────
  const addQuote = useCallback((data) => {
    const result = service.addQuote(data);
    refreshQuotes();
    logActivity({
      type: 'quote',
      action: 'created',
      message: `Quote ${result.id} created for ${result.customerName || 'Unknown'}`,
      name: result.customerName,
      id: result.id,
      icon: 'quote-add',
    });
    return result;
  }, [service, refreshQuotes, logActivity]);

  const updateQuote = useCallback((id, updates) => {
    const existing = service.getQuoteById(id);
    const result = service.updateQuote(id, updates);
    refreshQuotes();
    if (updates.status && updates.status !== existing?.status) {
      logActivity({
        type: 'quote',
        action: 'status-changed',
        message: `Quote ${id} status changed to ${updates.status}`,
        name: existing?.customerName || '',
        id,
        icon: 'quote-status',
      });
    } else {
      logActivity({
        type: 'quote',
        action: 'updated',
        message: `Quote ${id} updated`,
        name: existing?.customerName || '',
        id,
        icon: 'quote-edit',
      });
    }
    return result;
  }, [service, refreshQuotes, logActivity]);

  const deleteQuote = useCallback((id) => {
    const existing = service.getQuoteById(id);
    service.deleteQuote(id);
    refreshQuotes();
    logActivity({
      type: 'quote',
      action: 'deleted',
      message: `Quote ${id} deleted`,
      name: existing?.customerName || '',
      id,
      icon: 'quote-delete',
    });
  }, [service, refreshQuotes, logActivity]);

  // ─── Booking CRUD ─────────────────────────────────────────
  const addBooking = useCallback((data) => {
    const result = service.addBooking(data);
    refreshBookings();
    logActivity({
      type: 'booking',
      action: 'created',
      message: `Booking ${result.id} created for ${result.customerName || 'Unknown'}`,
      name: result.customerName,
      id: result.id,
      icon: 'booking-add',
    });
    return result;
  }, [service, refreshBookings, logActivity]);

  const updateBooking = useCallback((id, updates) => {
    const existing = service.getBookingById(id);
    const result = service.updateBooking(id, updates);
    refreshBookings();
    if (updates.status === 'completed') {
      logActivity({
        type: 'booking',
        action: 'completed',
        message: `Booking ${id} marked as completed`,
        name: existing?.customerName || '',
        id,
        icon: 'booking-complete',
      });
    } else if (updates.status === 'cancelled') {
      logActivity({
        type: 'booking',
        action: 'cancelled',
        message: `Booking ${id} cancelled`,
        name: existing?.customerName || '',
        id,
        icon: 'booking-cancel',
      });
    } else {
      logActivity({
        type: 'booking',
        action: 'updated',
        message: `Booking ${id} updated`,
        name: existing?.customerName || '',
        id,
        icon: 'booking-edit',
      });
    }
    return result;
  }, [service, refreshBookings, logActivity]);

  const deleteBooking = useCallback((id) => {
    const existing = service.getBookingById(id);
    service.deleteBooking(id);
    refreshBookings();
    logActivity({
      type: 'booking',
      action: 'deleted',
      message: `Booking ${id} deleted`,
      name: existing?.customerName || '',
      id,
      icon: 'booking-delete',
    });
  }, [service, refreshBookings, logActivity]);

  // ─── Payment CRUD ─────────────────────────────────────────
  const addPayment = useCallback((data) => {
    const result = service.addPayment(data);
    refreshPayments();
    logActivity({
      type: 'payment',
      action: 'recorded',
      message: `Payment ${result.id} of ${result.amount} recorded for ${result.customerName || 'Unknown'}`,
      name: result.customerName,
      id: result.id,
      amount: result.amount,
      icon: 'payment-add',
    });
    return result;
  }, [service, refreshPayments, logActivity]);

  const updatePayment = useCallback((id, updates) => {
    const result = service.updatePayment(id, updates);
    refreshPayments();
    logActivity({
      type: 'payment',
      action: 'updated',
      message: `Payment ${id} updated`,
      name: result?.customerName || '',
      id,
      icon: 'payment-edit',
    });
    return result;
  }, [service, refreshPayments, logActivity]);

  const deletePayment = useCallback((id) => {
    const existing = service.getPaymentById(id);
    service.deletePayment(id);
    refreshPayments();
    logActivity({
      type: 'payment',
      action: 'deleted',
      message: `Payment ${id} deleted`,
      name: existing?.customerName || '',
      id,
      icon: 'payment-delete',
    });
  }, [service, refreshPayments, logActivity]);

  // ─── Invoices ─────────────────────────────────────────────
  const addInvoice = useCallback((data) => {
    const result = service.addInvoice(data);
    refreshInvoices();
    return result;
  }, [service, refreshInvoices]);

  const updateInvoice = useCallback((id, updates) => {
    const result = service.updateInvoice(id, updates);
    refreshInvoices();
    return result;
  }, [service, refreshInvoices]);

  const deleteInvoice = useCallback((id) => {
    service.deleteInvoice(id);
    refreshInvoices();
  }, [service, refreshInvoices]);

  // ─── Convert Quote → Booking + Invoice ────────────────────
  const convertQuote = useCallback((quoteId, customerEdits = {}) => {
    const quote = service.getQuoteById(quoteId);
    if (!quote) return null;

    // 1. Mark quote as converted
    service.updateQuote(quoteId, { status: 'converted' });
    refreshQuotes();

    // 2. Create booking
    const booking = service.addBooking({
      customerName: customerEdits.customerName || quote.customerName,
      customerPhone: customerEdits.customerPhone || quote.customerPhone,
      customerEmail: customerEdits.customerEmail || '',
      customerPan: customerEdits.customerPan || '',
      customerGstin: customerEdits.customerGstin || '',
      destination: quote.destName,
      destType: quote.destType,
      travelDate: quote.tripDate,
      amount: quote.amount,
      profit: quote.profit,
      paymentStatus: 'partial',
      paymentText: `₹0 / ${quote.amount}`,
      remaining: quote.amount,
      status: 'confirmed',
      pax: customerEdits.travelers || 1,
      quoteId,
    });
    refreshBookings();

    // 3. Create invoice
    const travelCost = customerEdits.travelCost || 0;
    const serviceFee = customerEdits.serviceFee || 200;
    const cgst = customerEdits.cgst || 18;
    const sgst = customerEdits.sgst || 18;
    const invoiceValue = customerEdits.invoiceValue || (travelCost + serviceFee + cgst + sgst);

    const invoice = service.addInvoice({
      quoteId,
      bookingId: booking.id,
      customerName: customerEdits.customerName || quote.customerName,
      customerPhone: customerEdits.customerPhone || quote.customerPhone,
      customerEmail: customerEdits.customerEmail || '',
      customerPan: customerEdits.customerPan || '',
      customerGstin: customerEdits.customerGstin || '',
      destination: quote.destName,
      destType: quote.destType,
      travelDate: quote.tripDate,
      duration: customerEdits.duration || '',
      travelers: customerEdits.travelers || 1,
      placeOfSupply: customerEdits.placeOfSupply || 'India',
      travelCost,
      serviceFee,
      cgst,
      sgst,
      invoiceValue,
      amount: quote.amount,
      total: `₹${invoiceValue.toLocaleString('en-IN')}`,
      status: 'Unpaid',
    });
    refreshInvoices();

    // 4. Log activity
    service.addActivity({
      type: 'booking',
      action: 'created',
      message: `Quote ${quoteId} converted to Booking ${booking.id} for ${quote.customerName}`,
      name: quote.customerName,
      id: booking.id,
      icon: 'booking-add',
    });
    refreshActivities();

    return { booking, invoice };
  }, [service, refreshQuotes, refreshBookings, refreshInvoices, refreshActivities]);

  // ─── Settings ─────────────────────────────────────────────
  const updateSettings = useCallback((updates) => {
    const result = service.updateSettings(updates);
    setSettings(result);
    return result;
  }, [service]);

  const value = {
    // Data
    customers,
    quotes,
    bookings,
    payments,
    invoices,
    settings,
    activities,

    // Customer CRUD
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById: service.getCustomerById,

    // Quote CRUD
    addQuote,
    updateQuote,
    deleteQuote,
    getQuoteById: service.getQuoteById,
    getQuoteDetail: service.getQuoteDetail,
    saveQuoteDetail: service.saveQuoteDetail,

    // Booking CRUD
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingById: service.getBookingById,

    // Payment CRUD
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentById: service.getPaymentById,

    // Profile
    getProfileData: service.getProfileData,
    updateProfileData: service.updateProfileData,

    // Dashboard
    getTopCustomers: service.getTopCustomers,

    // Settings
    updateSettings,

    // Invoice CRUD
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById: service.getInvoiceById,
    convertQuote,

    // Refresh helpers
    refreshCustomers,
    refreshQuotes,
    refreshBookings,
    refreshPayments,
    refreshInvoices,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
