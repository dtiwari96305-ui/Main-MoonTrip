import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DemoModal } from '../components/DemoModal';
import { demoDb } from '../lib/demoDb';

// ── Helpers ──────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #f6d365, #fda085)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
];

const generateInitials = (name) => {
  if (!name) return '??';
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const generateGradient = (name) => {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

const formatINR = (num) => '₹' + Number(num).toLocaleString('en-IN');

const parseINR = (s) => {
  if (!s || s === '—') return 0;
  return parseInt(String(s).replace(/[₹,\s]/g, ''), 10) || 0;
};

const todayStr = () => {
  const d = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const nowTime = () => {
  const d = new Date();
  let h = d.getHours();
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${ampm}`;
};

// ── Contexts ──────────────────────────────────────────────────────
const DemoPopupContext = createContext(null);
const DemoDataContext = createContext(null);

export const DemoProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const triggerDemoPopup = useCallback(() => setIsOpen(true), []);

  const [customers, setCustomers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [quoteDetailData, setQuoteDetailData] = useState({});
  const [vendors, setVendors] = useState([]);
  const [vendorBills, setVendorBills] = useState([]);
  const [vendorPayments, setVendorPayments] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [generalEntries, setGeneralEntries] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);

  // ── Fetch Initial Data ──
  const refreshData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        demoDb.getCustomers(),
        demoDb.getQuotes(),
        demoDb.getBookings(),
        demoDb.getPayments(),
        demoDb.getInvoices(),
        demoDb.getLogs(),
        demoDb.getVendors(),
        demoDb.getVendorBills(),
        demoDb.getVendorPayments(),
        demoDb.getBankAccounts(),
        demoDb.getGeneralEntries(),
        demoDb.getJournalEntries(),
        demoDb.getChartOfAccounts(),
      ]);
      const getValue = (r) => (r.status === 'fulfilled' ? r.value : []);
      const [c, q, b, p, inv, logs, vend, vbills, vpay, banks, gEntries, jEntries, coa] = results.map(getValue);
      
      // Map Supabase data to expected UI format
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
        gradient: generateGradient(item.full_name),
        initials: generateInitials(item.full_name),
        raw: item
      })));

      setQuotes(q.map(item => ({
        id: item.quote_number,
        uuid: item.id,
        quoteNumber: item.quote_number,
        customerName: item.demo_customers?.full_name || 'Unknown',
        customerPhone: item.demo_customers?.phone || '',
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
        customerName: item.demo_customers?.full_name || 'Unknown',
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
        customerName: item.demo_customers?.full_name || 'Unknown',
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
        customerName: item.demo_customers?.full_name || 'Unknown',
        amount: formatINR(item.total_amount),
        status: item.status === 'active' ? 'Unpaid' : item.status, // Simplification for demo
        date: new Date(item.invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: item.invoice_type === 'tax_invoice' ? 'Tax Invoice' : 'Invoice',
        raw: item
      })));

      setActivities(logs.map(item => ({
        id: item.id,
        referenceId: item.reference_id,
        referenceType: item.reference_type,
        type: item.reference_type === 'customer' ? 'customers' : item.reference_type === 'quote' ? 'quotes' : 'bookings',
        title: item.title,
        createdAt: item.created_at,
      })));

      // Populate quote details from itinerary field
      const details = {};
      q.forEach(item => {
        if (item.itinerary && typeof item.itinerary === 'object') {
          details[item.id] = item.itinerary;
        }
      });
      setQuoteDetailData(details);

      // Vendors
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
        vendorName: b.demo_vendors?.name || '—',
        bookingId: b.booking_id,
        bookingNumber: b.demo_bookings?.booking_number || '—',
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
        vendorName: p.demo_vendors?.name || '—',
        billId: p.bill_id,
        billNumber: p.demo_vendor_bills?.bill_number || '—',
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
      // silently handle fetch failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ── Customer CRUD ──
  const addCustomer = useCallback(async (data) => {
    try {
      const payload = {
        customer_code: `DEMO-C-${String(Date.now()).slice(-4)}`,
        full_name: data.fullName,
        phone: `+91 ${data.phone}`,
        email: data.email || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || 'India',
        customer_type: (data.customerType || 'Individual').toLowerCase(),
        company_name: data.companyName || '',
        pan: data.panNumber || '',
        gstin: data.gstin || '',
        avatar_color: generateGradient(data.fullName) 
      };
      const result = await demoDb.createCustomer(payload);
      
      await demoDb.createLog({
        action_type: 'customer_created',
        title: 'Customer Added',
        description: `New customer ${data.fullName} created.`,
        reference_id: result.id,
        reference_type: 'customer'
      });

      refreshData();
      return { id: result.id, ...result };
    } catch (err) {
      // handle error
      throw err;
    }
  }, [refreshData]);

  const updateCustomer = useCallback(async (id, data) => {
    // For demo, we might block updates to original seed data or allow everything
    // The prompt says "functional actions" write to Supabase.
    try {
      const customer = customers.find(c => c.id === id);
      if (!customer) return;

      const payload = {
        full_name: data.fullName,
        phone: data.phone ? `+91 ${data.phone}` : undefined,
        email: data.email,
        city: data.city,
        state: data.state,
        country: data.country,
        customer_type: data.customerType?.toLowerCase(),
        company_name: data.companyName,
        pan: data.panNumber,
        gstin: data.gstin
      };
      await demoDb.updateCustomer(customer.uuid, payload);
      refreshData();
    } catch (err) {
      // handle error
    }
  }, [customers, refreshData]);

  // ── Quote CRUD ──
  const addQuote = useCallback(async (formData, calcResult) => {
    try {
      const customerName = formData.customerSearch || formData.newCustomerName || 'Customer';
      const tempId = `TEMP-${Date.now()}`;
      const detail = buildQuoteDetail(formData, calcResult, tempId);

      const payload = {
        quote_number: `DEMO-Q-${String(Date.now()).slice(-4)}`,
        customer_id: formData._customerId || null,
        status: 'draft',
        destination: formData.destination || '',
        destination_type: (formData.destType || 'domestic').toLowerCase(),
        total_cost: calcResult?.costOfServices || 0,
        margin: calcResult?.totalProfit || 0,
        total_payable: calcResult?.packagePriceCustomer || 0,
        departure_date: formData.startDate || null,
        itinerary: detail // Store full enriched detail in itinerary
      };
      
      const result = await demoDb.createQuote(payload);

      await demoDb.createLog({
        action_type: 'quote_created',
        title: 'Quote Created',
        description: `Quote for ${customerName} at ${payload.destination}`,
        reference_id: result.id,
        reference_type: 'quote'
      });

      refreshData();
      return { id: result.quote_number, quote: result }; // Return formatted number as ID
    } catch (err) {
      // handle error
      throw err;
    }
  }, [refreshData]);

  const updateQuote = useCallback(async (id, updates) => {
    try {
      const quote = quotes.find(q => q.id === id);
      if (!quote) return;
      await demoDb.updateQuote(quote.uuid, updates);
      refreshData();
    } catch (err) {
      // handle error
    }
  }, [quotes, refreshData]);

  const updateQuoteFromForm = useCallback(async (id, formData, calcResult) => {
    try {
      const quote = quotes.find(q => q.id === id);
      if (!quote) return;
      const detail = buildQuoteDetail(formData, calcResult, id);
      const updates = {
        destination: formData.destination,
        destination_type: formData.destType?.toLowerCase(),
        total_cost: calcResult?.costOfServices,
        margin: calcResult?.totalProfit,
        total_payable: calcResult?.packagePriceCustomer,
        departure_date: formData.startDate,
        itinerary: detail
      };
      await demoDb.updateQuote(quote.uuid, updates);
      refreshData();
    } catch (err) {
      // handle error
    }
  }, [quotes, refreshData]);

  const saveQuoteDetail = useCallback(async (id, detail) => {
    try {
      const quote = quotes.find(q => q.id === id);
      if (!quote) return;
      await demoDb.updateQuote(quote.uuid, { itinerary: detail });
      refreshData();
    } catch (err) {
      // handle error
    }
  }, [quotes, refreshData]);

  // ── Booking CRUD ──
  const updateBooking = useCallback(async (id, updates) => {
    try {
      const booking = bookings.find(b => b.id === id);
      if (!booking) return;
      await demoDb.updateBooking(booking.uuid, updates);
      refreshData();
    } catch (err) {
      // handle error
    }
  }, [bookings, refreshData]);

  // ── Payment CRUD ──
  const addPayment = useCallback(async (data) => {
    try {
      const payload = {
        payment_number: `DEMO-REC-${String(Date.now()).slice(-4)}`,
        customer_id: data.customerId || null,
        total_amount: Number(data.amount),
        payment_mode: data.mode || 'cash',
        transaction_reference: data.reference || '',
        bank_name: data.bankName || '',
        notes: data.notes || '',
        payment_date: data.date || todayStr(),
        payment_type: data.allocateTo === 'advance' ? 'advance' : 'regular'
      };
      
      const result = await demoDb.createPayment(payload);
      
      await demoDb.createLog({
        action_type: 'payment_recorded',
        title: 'Payment Recorded',
        description: `Payment of ${formatINR(data.amount)} from ${data.customerName}`,
        reference_id: result.id,
        reference_type: 'payment'
      });

      refreshData();
      return result;
    } catch (err) {
      // handle error
      throw err;
    }
  }, [refreshData]);

  // ── Convert Quote to Booking ──
  const convertQuote = useCallback(async (quoteId) => {
    try {
      // In a real app, this would be a single transaction or complex set of inserts
      // For demo, we'll just update quote and create booking
      const quote = quotes.find(q => q.id === quoteId);
      if (!quote) return null;

      await demoDb.updateQuote(quote.uuid, { status: 'converted' });
      
      // Simplified booking creation
      const bPayload = {
        booking_number: `DEMO-B-${String(Date.now()).slice(-4)}`,
        quote_id: quote.uuid,
        customer_id: quote.raw?.customer_id,
        booking_status: 'confirmed',
        payment_status: 'unpaid',
        destination: quote.destName,
        total_cost: parseINR(quote.amount),
        total_profit: parseINR(quote.profit),
        booked_at: new Date().toISOString()
      };
      
      const booking = await demoDb.createBooking(bPayload);

      refreshData();
      return { booking };
    } catch (err) {
      // handle error
      return null;
    }
  }, [quotes, refreshData]);

  // ── Getters ──
  const getCustomerById = useCallback((id) => customers.find(c => c.id === id), [customers]);
  const getQuoteById = useCallback((id) => quotes.find(q => q.id === id), [quotes]);
  const getBookingById = useCallback((id) => bookings.find(b => b.id === id), [bookings]);
  const getPaymentById = useCallback((id) => payments.find(p => p.id === id), [payments]);
  const getVendorById = useCallback((id) => vendors.find(v => v.id === id), [vendors]);
  const getVendorBillById = useCallback((id) => vendorBills.find(b => b.id === id), [vendorBills]);

  // ── Vendor CRUD ──
  const addVendor = useCallback(async (data) => {
    try {
      const payload = {
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
      };
      const result = await demoDb.createVendor(payload);
      refreshData();
      return result;
    } catch (err) { throw err; }
  }, [refreshData]);

  const updateVendor = useCallback(async (id, data) => {
    try {
      const payload = {
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
      };
      await demoDb.updateVendor(id, payload);
      refreshData();
    } catch (err) { throw err; }
  }, [refreshData]);

  const addVendorBill = useCallback(async (data) => {
    try {
      const payload = {
        bill_number: `VB-${Date.now()}`,
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
      };
      const result = await demoDb.createVendorBill(payload);
      refreshData();
      return result;
    } catch (err) { throw err; }
  }, [refreshData]);

  const updateVendorBill = useCallback(async (id, data) => {
    try {
      await demoDb.updateVendorBill(id, data);
      refreshData();
    } catch (err) { throw err; }
  }, [refreshData]);

  const addVendorPayment = useCallback(async (data) => {
    try {
      const payload = {
        payment_number: `VP-${Date.now()}`,
        vendor_id: data.vendorId || null,
        bill_id: data.billId || null,
        amount: Number(data.amount) || 0,
        payment_mode: data.paymentMode || 'bank_transfer',
        payment_date: data.paymentDate || new Date().toISOString().slice(0, 10),
        reference: data.reference || '',
        bank_name: data.bankName || '',
        notes: data.notes || '',
      };
      // Mark bill as paid if a bill is attached
      if (data.billId) {
        await demoDb.updateVendorBill(data.billId, { status: 'paid' });
      }
      const result = await demoDb.createVendorPayment(payload);
      refreshData();
      return result;
    } catch (err) { throw err; }
  }, [refreshData]);

  // ── Accounts CRUD ──
  const addBankAccount = useCallback(async (data) => {
    try {
      const result = await demoDb.createBankAccount({
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
    } catch (err) { throw err; }
  }, [refreshData]);

  const addGeneralEntry = useCallback(async (data) => {
    try {
      const result = await demoDb.createGeneralEntry({
        entry_number: `GE-${Date.now()}`,
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
    } catch (err) { throw err; }
  }, [refreshData]);

  const addJournalEntry = useCallback(async (entry, lines) => {
    try {
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
      const result = await demoDb.createJournalEntry(entryPayload, lines.map(l => ({
        account_id: l.accountId || null,
        account_code: l.accountCode || '',
        account_name: l.accountName || '',
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
        description: l.description || '',
      })));
      refreshData();
      return result;
    } catch (err) { throw err; }
  }, [refreshData]);

  const addCoAAccount = useCallback(async (data) => {
    try {
      const result = await demoDb.createCoAAccount({
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
    } catch (err) { throw err; }
  }, [refreshData]);

  const updateCoAAccount = useCallback(async (id, data) => {
    try {
      await demoDb.updateCoAAccount(id, {
        name: data.name,
        description: data.description || '',
      });
      refreshData();
    } catch (err) { throw err; }
  }, [refreshData]);

  const dataValue = {
    loading,
    customers, quotes, bookings, payments, invoices, activities, quoteDetailData,
    addCustomer, updateCustomer, getCustomerById,
    addQuote, updateQuote, updateQuoteFromForm, saveQuoteDetail, getQuoteById,
    updateBooking, getBookingById,
    addPayment, getPaymentById,
    convertQuote,
    vendors, vendorBills, vendorPayments,
    addVendor, updateVendor, getVendorById,
    addVendorBill, updateVendorBill, getVendorBillById,
    addVendorPayment,
    bankAccounts, generalEntries, journalEntries, chartOfAccounts,
    addBankAccount, addGeneralEntry, addJournalEntry, addCoAAccount, updateCoAAccount,
    refreshData
  };

  return (
    <DemoPopupContext.Provider value={triggerDemoPopup}>
      <DemoDataContext.Provider value={dataValue}>
        {children}
        {isOpen && <DemoModal onClose={() => setIsOpen(false)} />}
      </DemoDataContext.Provider>
    </DemoPopupContext.Provider>
  );
};

export const useDemoPopup = () => useContext(DemoPopupContext) || (() => {});
export const useDemoData = () => useContext(DemoDataContext);

// ── Reset helper (call when navigating back to landing) ──
export const clearDemoSession = () => {
  try { sessionStorage.removeItem('demo_mode'); } catch { /* ignore */ }
};

// ── Build quote detail from form data ──
function buildQuoteDetail(formData, calcResult, quoteId) {
  const customerName = formData.customerSearch || formData.newCustomerName || 'Customer';
  return {
    customerName,
    customerId: formData._customerId || null,
    customerPhone: formData.newCustomerPhone ? `+91 ${formData.newCustomerPhone}` : '',
    customerEmail: formData.newCustomerEmail || '',
    destination: formData.destination || '',
    destType: (formData.destType || 'domestic').charAt(0).toUpperCase() + (formData.destType || 'domestic').slice(1),
    tripDate: formData.startDate || '',
    duration: formData.duration || '',
    departure: formData.startDate || 'N/A',
    returnDate: formData.endDate || 'N/A',
    travelers: formData.numTravelers ? `${formData.numTravelers} Pax` : '1 Pax',
    createdDate: todayStr(),
    services: Object.entries(formData.serviceDetails || {}).map(([key, svc]) => ({
      type: key.includes('hotel') ? 'hotel' : key.includes('transport') || key.includes('cab') ? 'transport' : key.includes('activity') || key.includes('activities') ? 'activity' : 'admission',
      name: svc.name || key,
      vendor: svc.vendor || '',
      cost: formatINR(formData.serviceCosts?.[key] || 0),
    })).filter(s => parseINR(s.cost) > 0),
    totalServiceCost: calcResult?.costOfServices ? formatINR(calcResult.costOfServices) : '₹0',
    fin: {
      costOfServices: calcResult?.costOfServices ? formatINR(calcResult.costOfServices) : '₹0',
      hiddenMarkup: calcResult?.hiddenMarkup ? formatINR(calcResult.hiddenMarkup) : '₹0',
      processingCharge: calcResult?.processingCharge ? formatINR(calcResult.processingCharge) : '₹0',
      costOfTravel: calcResult?.costOfServices ? formatINR(calcResult.costOfServices) : '₹0',
      processingCustomer: calcResult?.processingCharge ? formatINR(calcResult.processingCharge) : '₹0',
      gstRate: '18.00%',
      gstAmount: calcResult?.gstOnMargin ? formatINR(calcResult.gstOnMargin) : '₹0',
      cgst: calcResult?.cgst ? formatINR(calcResult.cgst) : '₹0',
      sgst: calcResult?.sgst ? formatINR(calcResult.sgst) : '₹0',
      invoiceValue: calcResult?.invoiceValueAgent ? formatINR(calcResult.invoiceValueAgent) : '₹0',
      profitTotal: calcResult?.totalProfit ? formatINR(calcResult.totalProfit) : '₹0',
      profitPct: calcResult?.profitPct || '0%',
      packagePrice: calcResult?.packagePriceCustomer ? formatINR(calcResult.packagePriceCustomer) : '₹0',
      totalPayable: calcResult?.packagePriceCustomer ? formatINR(calcResult.packagePriceCustomer) : '₹0',
      inputMode: 'Margin',
      billingModel: formData.billingModel || 'pure_agent',
      quoteDate: todayStr(),
    },
    itinerary: formData.itDays || [],
    inclusions: formData.inclusions || [],
    exclusions: formData.exclusions || [],
  };
}
