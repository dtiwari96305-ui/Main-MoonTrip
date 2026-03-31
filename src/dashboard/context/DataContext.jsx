import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { realDb } from '../lib/realDb';
import { supabase } from '../../shared/lib/supabase';

const DataContext = createContext(null);

const formatINR = (num) => '₹' + Number(num).toLocaleString('en-IN');
const parseINR = (s) => parseInt(String(s).replace(/[₹,\s]/g, '') || 0, 10);

// Map Supabase snake_case settings → camelCase UI format
function mapSettingsFromDb(s) {
  if (!s) return null;
  return {
    id: s.id,
    companyName: s.company_name || 'My Agency',
    companySubtitle: s.company_subtitle || 'Travel & Tourism',
    slug: s.slug || '',
    gstin: s.gstin || '',
    pan: s.pan || '',
    companyPhone: s.company_phone || '',
    companyEmail: s.company_email || '',
    streetAddress: s.street_address || '',
    city: s.city || '',
    state: s.state || 'Maharashtra',
    pincode: s.pincode || '',
    accountNumber: s.account_number || '',
    ifscCode: s.ifsc_code || '',
    bankName: s.bank_name || '',
    branch: s.branch || '',
    accountHolderName: s.account_holder_name || '',
    upiId: s.upi_id || '',
    invoiceTerms: s.invoice_terms || '',
    gstEnabled: s.gst_enabled !== false,
    pdfTheme: s.pdf_theme || 'classic',
    quotePrefix: s.quote_prefix || 'WL-Q-',
    quoteNextNum: String(s.quote_next_number || 1),
    quoteSuffix: s.quote_suffix || '',
    bookingPrefix: s.invoice_prefix || 'WL-B-',
    bookingNextNum: String(s.invoice_next_number || 1),
    bookingSuffix: s.invoice_suffix || '',
    userName: s.user_name || 'Admin',
    userRole: s.user_role || 'admin',
    email: s.email || '',
    phone: s.phone || '',
  };
}

// Map camelCase UI updates → snake_case Supabase format
function mapSettingsToDb(updates) {
  const KEY_MAP = {
    companyName: 'company_name',
    companySubtitle: 'company_subtitle',
    slug: 'slug',
    gstin: 'gstin',
    pan: 'pan',
    companyPhone: 'company_phone',
    companyEmail: 'company_email',
    streetAddress: 'street_address',
    city: 'city',
    state: 'state',
    pincode: 'pincode',
    accountNumber: 'account_number',
    ifscCode: 'ifsc_code',
    bankName: 'bank_name',
    branch: 'branch',
    accountHolderName: 'account_holder_name',
    upiId: 'upi_id',
    invoiceTerms: 'invoice_terms',
    gstEnabled: 'gst_enabled',
    pdfTheme: 'pdf_theme',
    quotePrefix: 'quote_prefix',
    quoteNextNum: 'quote_next_number',
    quoteSuffix: 'quote_suffix',
    bookingPrefix: 'invoice_prefix',
    bookingNextNum: 'invoice_next_number',
    bookingSuffix: 'invoice_suffix',
    userName: 'user_name',
    userRole: 'user_role',
    email: 'email',
    phone: 'phone',
  };
  const result = {};
  for (const [key, value] of Object.entries(updates)) {
    result[KEY_MAP[key] || key] = value;
  }
  return result;
}

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [settings, setSettings] = useState(null);
  const [activities, setActivities] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorBills, setVendorBills] = useState([]);
  const [vendorPayments, setVendorPayments] = useState([]);
  const [nomenclatureReady, setNomenclatureReady] = useState(null); // null = loading, true/false
  const [bankAccounts, setBankAccounts] = useState([]);
  const [generalEntries, setGeneralEntries] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);

  // ── Refresh Helpers ──
  const refreshData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        realDb.getCustomers(),
        realDb.getQuotes(),
        realDb.getBookings(),
        realDb.getPayments(),
        realDb.getInvoices(),
        realDb.getLogs(),
        realDb.getSettings(),
        realDb.getVendors(),
        realDb.getVendorBills(),
        realDb.getVendorPayments(),
        realDb.getBankAccounts(),
        realDb.getGeneralEntries(),
        realDb.getJournalEntries(),
        realDb.getChartOfAccounts(),
      ]);
      const getValue = (r) => (r.status === 'fulfilled' ? r.value : []);
      const [c, q, b, p, inv, logs, s, vend, vbills, vpay, banks, gEntries, jEntries, coa] = results.map(getValue);

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
        paymentText: `${formatINR(item.amount_paid)} / ${formatINR(item.total_payable || item.total_cost)}`,
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

      setSettings(mapSettingsFromDb(s) || {
        companyName: 'My Agency',
        companySubtitle: 'Travel & Tourism',
        userName: 'Admin',
        userRole: 'admin',
        email: '',
        phone: '',
      });

      setVendors(vend.map(v => ({
        id: v.id,
        name: v.name,
        vendorCode: v.vendor_code || '',
        city: v.city || '',
        contactPerson: v.contact_person || '',
        phone: v.phone || '',
        email: v.email || '',
        gstNumber: v.gst_number || '',
        panNumber: v.pan_number || '',
        bankName: v.bank_name || '',
        bankAccount: v.bank_account || '',
        ifscCode: v.ifsc_code || '',
        notes: v.notes || '',
        createdAt: v.created_at,
        raw: v,
      })));

      setVendorBills(vbills.map(b => ({
        id: b.id,
        billNumber: b.bill_number,
        vendorId: b.vendor_id,
        vendorName: b.real_vendors?.name || '—',
        bookingId: b.booking_id,
        bookingNumber: b.real_bookings?.booking_number || '—',
        serviceType: b.service_type,
        serviceDate: b.service_date || '',
        grossAmount: Number(b.gross_amount) || 0,
        commissionAmount: Number(b.commission_amount) || 0,
        tdsReceivable: Number(b.tds_receivable) || 0,
        processingFee: Number(b.processing_fee) || 0,
        vendorGstCgst: Number(b.vendor_gst_cgst) || 0,
        vendorGstSgst: Number(b.vendor_gst_sgst) || 0,
        roundOff: Number(b.round_off) || 0,
        netPayable: Number(b.net_payable) || 0,
        status: b.status || 'unpaid',
        serviceDetails: b.service_details || {},
        notes: b.notes || '',
        createdAt: b.created_at,
        raw: b,
      })));

      setVendorPayments(vpay.map(p => ({
        id: p.id,
        paymentNumber: p.payment_number,
        vendorId: p.vendor_id,
        vendorName: p.real_vendors?.name || '—',
        billId: p.bill_id,
        billNumber: p.real_vendor_bills?.bill_number || '—',
        amount: Number(p.amount) || 0,
        paymentMode: p.payment_mode || 'bank_transfer',
        paymentDate: p.payment_date || '',
        reference: p.reference || '',
        bankName: p.bank_name || '',
        notes: p.notes || '',
        createdAt: p.created_at,
        raw: p,
      })));

      setBankAccounts(banks.map(b => ({
        id: b.id,
        bankName: b.bank_name,
        accountNumber: b.account_number || '',
        ifscCode: b.ifsc_code || '',
        accountHolder: b.account_holder || '',
        accountType: b.account_type || 'current',
        openingBalance: Number(b.opening_balance) || 0,
        currentBalance: Number(b.current_balance) || 0,
        isDefault: b.is_default || false,
        createdAt: b.created_at,
        raw: b,
      })));

      setGeneralEntries(gEntries.map(e => ({
        id: e.id,
        entryNumber: e.entry_number,
        date: e.date,
        description: e.description,
        category: e.category || 'other',
        amount: Number(e.amount) || 0,
        paymentMode: e.payment_mode || '',
        reference: e.reference || '',
        bankAccountId: e.bank_account_id || null,
        notes: e.notes || '',
        createdAt: e.created_at,
        raw: e,
      })));

      setJournalEntries(jEntries.map(e => ({
        id: e.id,
        entryNumber: e.entry_number,
        date: e.date,
        narration: e.narration || '',
        refType: e.ref_type || '',
        entryType: e.entry_type || 'manual',
        posted: e.posted !== false,
        totalDebit: Number(e.total_debit) || 0,
        totalCredit: Number(e.total_credit) || 0,
        createdAt: e.created_at,
        raw: e,
      })));

      setChartOfAccounts(coa.map(a => ({
        id: a.id,
        code: a.code,
        name: a.name,
        type: a.type,
        subType: a.sub_type || '',
        parentId: a.parent_id || null,
        isSystem: a.is_system || false,
        balance: Number(a.balance) || 0,
        description: a.description || '',
        createdAt: a.created_at,
        raw: a,
      })));

    } catch (err) {
      console.error('DataContext: refreshData failed', err);
    } finally {
      setLoading(false);
      // Check if nomenclature has been set up
      try {
        const hasSetup = await realDb.hasNomenclatureSetup();
        setNomenclatureReady(hasSetup);
      } catch {
        setNomenclatureReady(false);
      }
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
        console.error('DataContext: migration failed', err);
      }
      refreshData();
    };

    runMigration();
  }, [refreshData]);

  // ── Real-time subscriptions ──
  useEffect(() => {
    const debounceRef = { timer: null };
    const debouncedRefresh = () => {
      clearTimeout(debounceRef.timer);
      debounceRef.timer = setTimeout(() => refreshData(), 800);
    };

    const channel = supabase
      .channel('realtime_data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_customers' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_quotes' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_bookings' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_payments' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_sales_invoices' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_vendors' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_vendor_bills' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_vendor_payments' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_activity_log' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_settings' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_advance_ledger' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_hidden_markup_entries' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_bank_accounts' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_general_entries' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_journal_entries' }, debouncedRefresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'real_chart_of_accounts' }, debouncedRefresh)
      .subscribe();

    return () => {
      clearTimeout(debounceRef.timer);
      supabase.removeChannel(channel);
    };
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
      console.error('DataContext: logActivity failed', err);
    }
  }, [refreshData]);

  // ── Customer CRUD ──
  const addCustomer = useCallback(async (data) => {
    try {
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
    } catch (err) {
      console.error('DataContext: addCustomer failed', err);
      throw err;
    }
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
    const quoteNum = await realDb.getNextDocNumber('quote').catch(() => `WL-Q-${Date.now()}`);
    const payload = {
      quote_number: quoteNum,
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
    try {
      // Generate booking number if not provided
      if (!data.booking_number) {
        data.booking_number = await realDb.getNextDocNumber('booking').catch(() => `WL-B-${Date.now()}`);
      }
      // Ensure payment defaults
      if (data.amount_paid === undefined) data.amount_paid = 0;
      if (data.amount_pending === undefined) data.amount_pending = Number(data.total_payable) || Number(data.total_cost) || 0;
      if (!data.booking_status) data.booking_status = 'confirmed';
      if (!data.payment_status) data.payment_status = 'unpaid';

      const result = await realDb.createBooking(data);
      await logActivity({
        type: 'booking',
        action: 'created',
        message: `Booking ${result.booking_number} created`,
        id: result.id
      });
      refreshData();
      return { ...result, id: result.booking_number, uuid: result.id };
    } catch (err) {
      console.error('DataContext: addBooking failed', err);
      throw err;
    }
  }, [logActivity, refreshData]);

  const updateBooking = useCallback(async (id, updates) => {
    try {
      const booking = bookings.find(b => b.id === id);
      if (!booking) return;
      const result = await realDb.updateBooking(booking.uuid, updates);
      refreshData();
      return result;
    } catch (err) {
      console.error('DataContext: updateBooking failed', err);
      throw err;
    }
  }, [bookings, refreshData]);

  const deleteBooking = useCallback(async (id) => {
    try {
      const booking = bookings.find(b => b.id === id);
      if (!booking) return;
      await realDb.deleteBooking(booking.uuid);
      refreshData();
    } catch (err) {
      console.error('DataContext: deleteBooking failed', err);
      throw err;
    }
  }, [bookings, refreshData]);

  const updateInvoice = useCallback(async (id, updates) => {
    try {
      const result = await realDb.updateInvoice(id, updates);
      refreshData();
      return result;
    } catch (err) {
      console.error('DataContext: updateInvoice failed', err);
      throw err;
    }
  }, [refreshData]);

  // ── Payment CRUD ──
  const addPayment = useCallback(async (data) => {
    try {
      const recNum = await realDb.getNextDocNumber('receipt').catch(() => `REC-${Date.now()}`);
      const isAdvance = data.allocateTo === 'advance' || data.againstType === 'advance';
      const result = await realDb.createPayment({
        payment_number: recNum,
        customer_id: data.customerId || data.customer_id || null,
        total_amount: Number(data.amount) || parseINR(data.amount),
        payment_mode: data.mode || data.modeType || 'cash',
        payment_date: data.date,
        transaction_reference: data.reference || data.ref || '',
        bank_name: data.bankName || '',
        notes: data.notes || data.remarks || '',
        payment_type: isAdvance ? 'advance' : 'regular',
        allocations: data.allocations || null,
      });

      // Update booking payment amounts if allocations exist
      if (data.allocations && Array.isArray(data.allocations)) {
        for (const alloc of data.allocations) {
          if (alloc.booking_id || alloc.bookingId) {
            const bid = alloc.booking_id || alloc.bookingId;
            const allocAmt = Number(alloc.amount) || 0;
            // Fetch current booking to update amount_paid
            const booking = bookings.find(b => b.uuid === bid || b.id === alloc.booking_number);
            if (booking) {
              const currentPaid = Number(booking.raw?.amount_paid) || 0;
              const totalPayable = Number(booking.raw?.total_payable) || Number(booking.raw?.total_cost) || 0;
              const newPaid = currentPaid + allocAmt;
              const newPending = Math.max(0, totalPayable - newPaid);
              let newStatus = 'unpaid';
              if (newPaid >= totalPayable && totalPayable > 0) newStatus = 'paid';
              else if (newPaid > totalPayable && totalPayable > 0) newStatus = 'overpaid';
              else if (newPaid > 0) newStatus = 'partial';

              await realDb.updateBooking(booking.uuid, {
                amount_paid: newPaid,
                amount_pending: newPending,
                payment_status: newStatus,
              });
            }
          }
        }
      }

      await logActivity({
        type: 'payment',
        action: 'recorded',
        message: `Payment ${recNum} of ${formatINR(Number(data.amount) || 0)} recorded`,
        id: result.id
      });
      refreshData();
      return result;
    } catch (err) {
      console.error('DataContext: addPayment failed', err);
      throw err;
    }
  }, [bookings, logActivity, refreshData]);

  // ── Settings ──
  const updateSettings = useCallback(async (updates) => {
    const dbPayload = mapSettingsToDb(updates);
    if (settings?.id) dbPayload.id = settings.id;
    const result = await realDb.updateSettings(dbPayload);
    refreshData();
    return result;
  }, [settings, refreshData]);

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
    const raw = quote.raw || {};

    try {
      // 1. Mark quote as converted
      await realDb.updateQuote(quote.uuid, { status: 'converted' });

      // 2. Create booking — copy all relevant fields from quote
      const bookingNum = await realDb.getNextDocNumber('booking').catch(() => `WL-B-${Date.now()}`);
      const totalPayable = Number(raw.total_payable) || parseINR(quote.amount);
      const bookingPayload = {
        booking_number: bookingNum,
        customer_id: raw.customer_id,
        quote_id: quote.uuid,
        destination: quote.destName,
        destination_type: quote.destType,
        billing_model: raw.billing_model || 'pure-agent',
        total_cost: Number(raw.total_cost) || parseINR(quote.amount),
        margin: Number(raw.margin) || 0,
        total_profit: Number(raw.total_profit) || 0,
        total_payable: totalPayable,
        amount_paid: 0,
        amount_pending: totalPayable,
        booking_status: 'confirmed',
        payment_status: 'unpaid',
        pax: customerEdits.travelers || Number(raw.pax) || 1,
        departure_date: raw.departure_date,
        services: raw.services || raw.itinerary?.services || null,
        itinerary: raw.itinerary || null,
        gst_amount: Number(raw.gst_amount) || 0,
        tcs_amount: Number(raw.tcs_amount) || 0,
        booked_at: new Date().toISOString()
      };
      const booking = await realDb.createBooking(bookingPayload);

      // 3. Create invoice — use 'invoice' doc number type
      const invoiceValue = customerEdits.invoiceValue || totalPayable;
      const invoiceNum = await realDb.getNextDocNumber('invoice').catch(() => `INV-${Date.now()}`);
      const invoicePayload = {
        invoice_number: invoiceNum,
        customer_id: raw.customer_id,
        booking_id: booking.id,
        invoice_date: new Date().toISOString(),
        total_amount: invoiceValue,
        status: 'unpaid',
        invoice_type: 'tax_invoice'
      };
      const invoice = await realDb.createInvoice(invoicePayload);

      // 4. Create hidden markup entry if Pure Agent billing
      if ((raw.billing_model || 'pure-agent') === 'pure-agent' && Number(raw.margin) > 0) {
        try {
          await supabase.from('real_hidden_markup_entries').insert({
            booking_id: booking.id,
            amount: Number(raw.margin),
            status: 'provisional',
            description: `Hidden markup from Quote ${quote.id}`
          });
        } catch (markupErr) {
          console.error('DataContext: hidden markup entry creation failed', markupErr);
        }
      }

      await logActivity({
        type: 'booking',
        action: 'created',
        message: `Quote converted to Booking ${booking.booking_number}`,
        id: booking.id
      });

      await refreshData();
      return { booking, invoice };
    } catch (err) {
      console.error('DataContext: convertQuote failed', err);
      return null;
    }
  }, [quotes, logActivity, refreshData]);

  // ── Vendor CRUD ──
  const addVendor = useCallback(async (data) => {
    const result = await realDb.createVendor({
      name: data.name,
      vendor_code: data.vendorCode || '',
      city: data.city || '',
      contact_person: data.contactPerson || '',
      phone: data.phone || '',
      email: data.email || '',
      gst_number: data.gstNumber || '',
      pan_number: data.panNumber || '',
      bank_name: data.bankName || '',
      bank_account: data.bankAccount || '',
      ifsc_code: data.ifscCode || '',
      notes: data.notes || '',
    });
    refreshData();
    return result;
  }, [refreshData]);

  const updateVendor = useCallback(async (id, data) => {
    await realDb.updateVendor(id, {
      name: data.name,
      vendor_code: data.vendorCode || '',
      city: data.city || '',
      contact_person: data.contactPerson || '',
      phone: data.phone || '',
      email: data.email || '',
      gst_number: data.gstNumber || '',
      pan_number: data.panNumber || '',
      bank_name: data.bankName || '',
      bank_account: data.bankAccount || '',
      ifsc_code: data.ifscCode || '',
      notes: data.notes || '',
    });
    refreshData();
  }, [refreshData]);

  const addVendorBill = useCallback(async (data) => {
    const billNum = await realDb.getNextDocNumber('vendor_bill').catch(() => `VB-${Date.now()}`);
    const result = await realDb.createVendorBill({
      bill_number: billNum,
      vendor_id: data.vendorId || null,
      booking_id: data.bookingId || null,
      service_type: data.serviceType || 'other',
      service_date: data.serviceDate || null,
      gross_amount: Number(data.grossAmount) || 0,
      commission_amount: Number(data.commissionAmount) || 0,
      tds_receivable: Number(data.tdsReceivable) || 0,
      processing_fee: Number(data.processingFee) || 0,
      vendor_gst_cgst: Number(data.vendorGstCgst) || 0,
      vendor_gst_sgst: Number(data.vendorGstSgst) || 0,
      round_off: Number(data.roundOff) || 0,
      net_payable: Number(data.netPayable) || 0,
      status: 'unpaid',
      service_details: data.serviceDetails || {},
      notes: data.notes || '',
    });
    refreshData();
    return result;
  }, [refreshData]);

  const updateVendorBill = useCallback(async (id, data) => {
    await realDb.updateVendorBill(id, data);
    refreshData();
  }, [refreshData]);

  const addVendorPayment = useCallback(async (data) => {
    try {
      const payNum = await realDb.getNextDocNumber('vendor_pay').catch(() => `VP-${Date.now()}`);
      const result = await realDb.createVendorPayment({
        payment_number: payNum,
        vendor_id: data.vendorId || null,
        bill_id: data.billId || null,
        amount: Number(data.amount) || 0,
        payment_mode: data.paymentMode || 'bank_transfer',
        payment_date: data.paymentDate || new Date().toISOString().slice(0, 10),
        reference: data.reference || '',
        bank_name: data.bankName || '',
        notes: data.notes || '',
      });

      // Update vendor bill status based on total paid vs net_payable
      if (data.billId) {
        const bill = vendorBills.find(b => b.id === data.billId);
        if (bill) {
          const totalPaidOnBill = vendorPayments
            .filter(p => p.billId === data.billId)
            .reduce((s, p) => s + (Number(p.amount) || 0), 0) + (Number(data.amount) || 0);
          const netPayable = Number(bill.netPayable) || 0;
          const newStatus = totalPaidOnBill >= netPayable ? 'paid' : 'partial';
          await realDb.updateVendorBill(data.billId, { status: newStatus });
        } else {
          await realDb.updateVendorBill(data.billId, { status: 'paid' });
        }
      }

      refreshData();
      return result;
    } catch (err) {
      console.error('DataContext: addVendorPayment failed', err);
      throw err;
    }
  }, [vendorBills, vendorPayments, refreshData]);

  // ── Accounts CRUD ──
  const addBankAccount = useCallback(async (data) => {
    const result = await realDb.createBankAccount({
      bank_name: data.bankName,
      account_number: data.accountNumber || '',
      ifsc_code: data.ifscCode || '',
      account_holder: data.accountHolder || '',
      account_type: data.accountType || 'current',
      opening_balance: Number(data.openingBalance) || 0,
      current_balance: Number(data.openingBalance) || 0,
      is_default: data.isDefault || false,
    });
    refreshData();
    return result;
  }, [refreshData]);

  const addGeneralEntry = useCallback(async (data) => {
    const entNum = await realDb.getNextDocNumber('gen_entry').catch(() => `GE-${Date.now()}`);
    const result = await realDb.createGeneralEntry({
      entry_number: entNum,
      date: data.date || new Date().toISOString().slice(0, 10),
      description: data.description,
      category: data.category || 'other',
      amount: Number(data.amount) || 0,
      payment_mode: data.paymentMode || 'bank_transfer',
      reference: data.reference || '',
      bank_account_id: data.bankAccountId || null,
      notes: data.notes || '',
    });
    refreshData();
    return result;
  }, [refreshData]);

  const addJournalEntry = useCallback(async (entry, lines) => {
    const entryPayload = {
      entry_number: `JE-${Date.now()}`,
      date: entry.date || new Date().toISOString().slice(0, 10),
      narration: entry.narration || '',
      ref_type: entry.refType || 'manual',
      entry_type: 'manual',
      posted: true,
      total_debit: lines.reduce((s, l) => s + (Number(l.debit) || 0), 0),
      total_credit: lines.reduce((s, l) => s + (Number(l.credit) || 0), 0),
    };
    const result = await realDb.createJournalEntry(entryPayload, lines.map(l => ({
      account_id: l.accountId || null,
      account_code: l.accountCode || '',
      account_name: l.accountName || '',
      debit: Number(l.debit) || 0,
      credit: Number(l.credit) || 0,
      description: l.description || '',
    })));
    refreshData();
    return result;
  }, [refreshData]);

  const addCoAAccount = useCallback(async (data) => {
    const result = await realDb.createCoAAccount({
      code: data.code,
      name: data.name,
      type: data.type,
      sub_type: data.subType || '',
      parent_id: data.parentId || null,
      is_system: false,
      description: data.description || '',
    });
    refreshData();
    return result;
  }, [refreshData]);

  const updateCoAAccount = useCallback(async (id, data) => {
    await realDb.updateCoAAccount(id, { name: data.name, description: data.description || '' });
    refreshData();
  }, [refreshData]);

  // ── Nomenclature ──
  const getDocumentSequences = useCallback(async () => {
    return realDb.getDocumentSequences();
  }, []);

  const saveDocumentSequences = useCallback(async (sequences) => {
    const result = await realDb.saveDocumentSequences(sequences);
    setNomenclatureReady(true);
    return result;
  }, []);

  const updateDocumentSequence = useCallback(async (documentType, updates) => {
    return realDb.updateDocumentSequence(documentType, updates);
  }, []);

  const value = {
    loading,
    nomenclatureReady,
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
    updateInvoice,
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
    vendors, vendorBills, vendorPayments,
    addVendor, updateVendor, getVendorById: (id) => vendors.find(v => v.id === id),
    addVendorBill, updateVendorBill, getVendorBillById: (id) => vendorBills.find(b => b.id === id),
    addVendorPayment,
    bankAccounts, generalEntries, journalEntries, chartOfAccounts,
    addBankAccount, addGeneralEntry, addJournalEntry, addCoAAccount, updateCoAAccount,
    getDocumentSequences, saveDocumentSequences, updateDocumentSequence,
    refreshData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
