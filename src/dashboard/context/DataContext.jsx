import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { realDb } from '../lib/realDb';

const DataContext = createContext(null);

const formatINR = (num) => '₹' + Number(num).toLocaleString('en-IN');
const parseINR = (s) => parseInt(String(s).replace(/[₹,\s]/g, '') || 0, 10);

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [settings, setSettings] = useState(null);
  const [activities, setActivities] = useState([]);

  // ── Refresh Helpers ──
  const refreshData = useCallback(async () => {
    try {
      const [c, q, b, p, inv, logs, s] = await Promise.all([
        realDb.getCustomers(),
        realDb.getQuotes(),
        realDb.getBookings(),
        realDb.getPayments(),
        realDb.getInvoices(),
        realDb.getLogs(),
        realDb.getSettings()
      ]);

      setCustomers(c.map(item => ({
        id: item.customer_code,
        uuid: item.id,
        code: item.customer_code,
        name: item.full_name,
        phone: item.phone,
        email: item.email,
        location: item.city,
        type: item.customer_type === 'corporate' ? 'Corporate' : 'Individual',
        joined: new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        raw: item
      })));

      setQuotes(q.map(item => ({
        id: item.quote_number,
        uuid: item.id,
        quoteNumber: item.quote_number,
        customerName: item.real_customers?.full_name || 'Unknown',
        customerPhone: item.real_customers?.phone || '',
        destName: item.destination,
        destType: item.destination_type,
        amount: formatINR(item.total_payable || item.total_cost),
        profit: formatINR(item.total_profit),
        status: item.status,
        tripDate: item.departure_date ? new Date(item.departure_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        createdDate: new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        createdTime: new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        raw: item
      })));

      setBookings(b.map(item => ({
        id: item.booking_number,
        uuid: item.id,
        bookingNumber: item.booking_number,
        customerName: item.real_customers?.full_name || 'Unknown',
        destination: item.destination,
        amount: formatINR(item.total_payable || item.total_cost),
        profit: formatINR(item.total_profit),
        paymentStatus: item.payment_status,
        paymentText: `${formatINR(item.amount_paid)} / ${formatINR(item.total_cost)}`,
        remaining: item.amount_pending > 0 ? formatINR(item.amount_pending) : '—',
        status: item.booking_status,
        date: new Date(item.booked_at || item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        raw: item
      })));

      setPayments(p.map(item => ({
        id: item.payment_number,
        uuid: item.id,
        paymentNumber: item.payment_number,
        against: item.allocations?.[0]?.booking_number || 'Advance',
        customerName: item.real_customers?.full_name || 'Unknown',
        amount: formatINR(item.total_amount),
        amountNum: Number(item.total_amount),
        modeType: item.payment_mode,
        modeLabel: item.payment_mode === 'upi' ? 'UPI' : item.payment_mode === 'bank_transfer' ? 'Bank Transfer' : 'Cash',
        ref: item.transaction_reference || '—',
        bankName: item.bank_name || '',
        remarks: item.notes || '',
        date: new Date(item.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        againstType: item.payment_type === 'advance' ? 'advance' : 'normal',
        badge: item.payment_type === 'advance' ? 'Advance' : 'Payment',
        createdDate: new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        raw: item
      })));

      setInvoices(inv.map(item => ({
        id: item.invoice_number,
        uuid: item.id,
        invoiceNumber: item.invoice_number,
        customerName: item.real_customers?.full_name || 'Unknown',
        amount: formatINR(item.total_amount),
        status: item.status,
        date: new Date(item.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: item.invoice_type === 'tax_invoice' ? 'Tax Invoice' : 'Invoice',
        raw: item
      })));

      setActivities(logs.map(item => ({
        id: item.id,
        uuid: item.id,
        type: item.reference_type === 'customer' ? 'customer' : item.reference_type === 'quote' ? 'quote' : 'booking',
        action: item.action_type,
        message: item.description,
        name: '', // Optional
        time: new Date(item.created_at).toLocaleString('en-IN'),
        icon: item.action_type.includes('add') ? 'customer-add' : 'customer-edit'
      })));

      setSettings(s || {
        companyName: 'My Agency',
        companySubtitle: 'Travel & Tourism',
        userName: 'Admin',
        userRole: 'admin',
        email: '',
        phone: '',
      });

    } catch (err) {
      // handle refresh failure
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Migration Logic ──
  useEffect(() => {
    const runMigration = async () => {
      const isMigrated = localStorage.getItem('moontrip_supabase_migrated');
      if (isMigrated === 'true') {
        refreshData();
        return;
      }

      // migration starting
      try {
        const localCustomers = JSON.parse(localStorage.getItem('real_customers') || '[]');
        const localQuotes = JSON.parse(localStorage.getItem('real_quotes') || '[]');
        const localBookings = JSON.parse(localStorage.getItem('real_bookings') || '[]');
        const localPayments = JSON.parse(localStorage.getItem('real_payments') || '[]');
        const localSettings = JSON.parse(localStorage.getItem('real_settings') || '{}');

        // 1. Migrate Customers
        const customerMap = {}; // oldId -> newId
        for (const c of localCustomers) {
          const payload = {
            customer_code: c.id,
            full_name: c.name,
            phone: c.phone,
            email: c.email,
            city: c.location,
            customer_type: c.type?.toLowerCase() === 'corporate' ? 'corporate' : 'individual',
            company_name: c.companyName || ''
          };
          const result = await realDb.createCustomer(payload);
          customerMap[c.id] = result.id;
        }

        // 2. Migrate Quotes
        for (const q of localQuotes) {
          const detail = JSON.parse(localStorage.getItem(`real_quoteDetail_${q.id}`) || 'null');
          const payload = {
            quote_number: q.id,
            customer_id: customerMap[q.customerId] || null, // Assuming q.customerId exists in localStorage
            status: q.status,
            destination: q.destName,
            destination_type: q.destType,
            total_cost: parseINR(q.amount),
            margin: parseINR(q.profit),
            total_payable: parseINR(q.amount),
            itinerary: detail
          };
          await realDb.createQuote(payload);
        }

        // 3. Migrate Settings
        if (Object.keys(localSettings).length > 0) {
          await realDb.updateSettings({
            company_name: localSettings.companyName,
            company_subtitle: localSettings.companySubtitle,
            email: localSettings.email,
            phone: localSettings.phone
          });
        }

        localStorage.setItem('moontrip_supabase_migrated', 'true');
        // migration complete
      } catch (err) {
        // handle migration failure
      }
      refreshData();
    };

    runMigration();
  }, [refreshData]);

  const logActivity = useCallback(async (entry) => {
    try {
      await realDb.createLog({
        action_type: entry.action,
        title: entry.message,
        description: entry.message,
        reference_id: entry.id,
        reference_type: entry.type
      });
      refreshData();
    } catch (err) {
      // handle error
    }
  }, [refreshData]);

  // ── Customer CRUD ──
  const addCustomer = useCallback(async (data) => {
    const payload = {
      full_name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.location,
      customer_type: data.type?.toLowerCase(),
      company_name: data.companyName,
      customer_code: `C-${Date.now()}`
    };
    const result = await realDb.createCustomer(payload);
    await logActivity({
      type: 'customer',
      action: 'added',
      message: `New customer ${data.name || 'Unknown'} added`,
      id: result.id
    });
    return { ...result, id: result.customer_code, uuid: result.id };
  }, [logActivity]);

  const updateCustomer = useCallback(async (id, updates) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    const result = await realDb.updateCustomer(customer.uuid, {
      full_name: updates.name,
      phone: updates.phone,
      email: updates.email,
      city: updates.location,
      customer_type: updates.type?.toLowerCase(),
      company_name: updates.companyName
    });
    await logActivity({
      type: 'customer',
      action: 'updated',
      message: `Customer updated`,
      id
    });
    return result;
  }, [customers, logActivity]);

  const deleteCustomer = useCallback(async (id) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    await realDb.deleteCustomer(customer.uuid);
    await logActivity({
      type: 'customer',
      action: 'deleted',
      message: `Customer deleted`,
      id
    });
  }, [customers, logActivity]);

  // ── Quote CRUD ──
  const addQuote = useCallback(async (data) => {
    const payload = {
      quote_number: `Q-${Date.now()}`,
      customer_id: data.customerId,
      status: data.status || 'draft',
      destination: data.destName,
      destination_type: data.destType,
      total_cost: parseINR(data.amount),
      margin: parseINR(data.profit),
      total_payable: parseINR(data.amount),
      departure_date: data.tripDate
    };
    const result = await realDb.createQuote(payload);
    await logActivity({
      type: 'quote',
      action: 'created',
      message: `Quote ${result.quote_number} created`,
      id: result.id
    });
    return { ...result, id: result.quote_number, uuid: result.id };
  }, [logActivity]);

  const updateQuote = useCallback(async (id, updates) => {
    const quote = quotes.find(q => q.id === id);
    if (!quote) return;
    const result = await realDb.updateQuote(quote.uuid, updates);
    await refreshData();
    return result;
  }, [quotes, refreshData]);

  const deleteQuote = useCallback(async (id) => {
    const quote = quotes.find(q => q.id === id);
    if (!quote) return;
    await realDb.deleteQuote(quote.uuid);
    refreshData();
  }, [quotes, refreshData]);

  // ── Booking CRUD ──
  const addBooking = useCallback(async (data) => {
    const result = await realDb.createBooking(data);
    refreshData();
    return { ...result, id: result.booking_number, uuid: result.id };
  }, [refreshData]);

  const updateBooking = useCallback(async (id, updates) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    const result = await realDb.updateBooking(booking.uuid, updates);
    refreshData();
    return result;
  }, [bookings, refreshData]);

  const deleteBooking = useCallback(async (id) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    await realDb.deleteBooking(booking.uuid);
    refreshData();
  }, [bookings, refreshData]);

  // ── Payment CRUD ──
  const addPayment = useCallback(async (data) => {
    const result = await realDb.createPayment({
      total_amount: parseINR(data.amount),
      payment_mode: data.modeType,
      payment_date: data.date,
      transaction_reference: data.ref,
      notes: data.remarks,
      payment_type: data.againstType === 'booking' ? 'regular' : 'advance'
    });
    refreshData();
    return result;
  }, [refreshData]);

  // ── Settings ──
  const updateSettings = useCallback(async (updates) => {
    const result = await realDb.updateSettings(updates);
    refreshData();
    return result;
  }, [refreshData]);

  // ── Advanced Logic ──
  const getTopCustomers = useCallback(() => {
    const totals = {};
    const bookingCounts = {};
    payments.forEach(p => {
      const name = p.customerName;
      if (!name) return;
      totals[name] = (totals[name] || 0) + parseINR(p.amount);
    });
    bookings.forEach(b => {
      const name = b.customerName;
      if (!name) return;
      bookingCounts[name] = (bookingCounts[name] || 0) + 1;
    });
    return customers
      .map(c => ({ ...c, totalRevenue: totals[c.name] || 0, bookingCount: bookingCounts[c.name] || 0 }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  }, [customers, payments, bookings]);

  const convertQuote = useCallback(async (quoteId, customerEdits = {}) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return null;

    try {
      // 1. Mark quote as converted
      await realDb.updateQuote(quote.uuid, { status: 'converted' });

      // 2. Create booking
      const bookingPayload = {
        booking_number: `B-${Date.now()}`,
        customer_id: quote.raw.customer_id,
        destination: quote.destName,
        destination_type: quote.destType,
        total_cost: parseINR(quote.amount),
        total_payable: parseINR(quote.amount),
        amount_paid: 0,
        amount_pending: parseINR(quote.amount),
        booking_status: 'confirmed',
        pax: customerEdits.travelers || 1,
        departure_date: quote.raw.departure_date,
        booked_at: new Date().toISOString()
      };
      const booking = await realDb.createBooking(bookingPayload);

      // 3. Create invoice
      const invoiceValue = customerEdits.invoiceValue || parseINR(quote.amount);
      const invoicePayload = {
        invoice_number: `INV-${Date.now()}`,
        customer_id: quote.raw.customer_id,
        booking_id: booking.id,
        invoice_date: new Date().toISOString(),
        total_amount: invoiceValue,
        status: 'unpaid',
        invoice_type: 'tax_invoice'
      };
      const invoice = await realDb.createInvoice(invoicePayload);

      await logActivity({
        type: 'booking',
        action: 'created',
        message: `Quote converted to Booking ${booking.booking_number}`,
        id: booking.id
      });

      await refreshData();
      return { booking, invoice };
    } catch (err) {
      // handle error
      return null;
    }
  }, [quotes, logActivity, refreshData]);

  const value = {
    loading,
    customers,
    quotes,
    bookings,
    payments,
    invoices,
    settings,
    activities,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById: (id) => customers.find(c => c.id === id),
    addQuote,
    updateQuote,
    deleteQuote,
    getQuoteById: (id) => quotes.find(q => q.id === id),
    getQuoteDetail: (id) => quotes.find(q => q.id === id)?.raw?.itinerary,
    saveQuoteDetail: async (id, detail) => {
      const quote = quotes.find(q => q.id === id);
      if (!quote) return;
      await realDb.updateQuote(quote.uuid, { itinerary: detail });
      await refreshData();
    },
    updateBooking,
    deleteBooking,
    addPayment,
    updateSettings,
    getProfileData: (id) => customers.find(c => c.id === id)?.raw?.profile_data,
    updateProfileData: async (id, data) => {
      const customer = customers.find(c => c.id === id);
      if (!customer) return;
      await realDb.updateCustomer(customer.uuid, { profile_data: data });
      await refreshData();
    },
    getTopCustomers,
    convertQuote,
    refreshData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
