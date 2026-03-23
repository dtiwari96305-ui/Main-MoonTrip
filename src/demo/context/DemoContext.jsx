import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DemoModal } from '../components/DemoModal';
import {
  demoCustomers, demoQuotes, demoBookings, demoPayments,
  demoProfileData, demoQuoteDetailData, demoActivities,
} from '../../shared/data/demoData';

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
  if (!name) return 'NA';
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const generateGradient = (name) => {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const formatINR = (num) => '₹' + Number(num).toLocaleString('en-IN');

const parseINR = (s) => {
  if (!s || s === '—') return 0;
  return parseInt(String(s).replace(/[₹,\s]/g, ''), 10) || 0;
};

const nextId = (arr, prefix) => {
  let max = 0;
  arr.forEach(item => {
    const m = item.id.match(/(\d+)$/);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return `${prefix}${String(max + 1).padStart(4, '0')}`;
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

const SS_KEY = 'demo_session_data';

const loadSession = () => {
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
};

// ── Contexts ──────────────────────────────────────────────────────
const DemoPopupContext = createContext(null);
const DemoDataContext = createContext(null);

export const DemoProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerDemoPopup = useCallback(() => setIsOpen(true), []);

  // ── Load initial state ──
  const init = loadSession();
  const [customers, setCustomers] = useState(() => init?.customers || deepClone(demoCustomers));
  const [quotes, setQuotes] = useState(() => init?.quotes || deepClone(demoQuotes));
  const [bookings, setBookings] = useState(() => init?.bookings || deepClone(demoBookings));
  const [payments, setPayments] = useState(() => init?.payments || deepClone(demoPayments));
  const [invoices, setInvoices] = useState(() => init?.invoices || []);
  const [profileData, setProfileData] = useState(() => init?.profileData || deepClone(demoProfileData));
  const [quoteDetailData, setQuoteDetailData] = useState(() => init?.quoteDetailData || deepClone(demoQuoteDetailData));
  const [activities, setActivities] = useState(() => init?.activities || deepClone(demoActivities));

  // ── Persist to sessionStorage ──
  useEffect(() => {
    try {
      sessionStorage.setItem(SS_KEY, JSON.stringify({
        customers, quotes, bookings, payments,
        invoices, profileData, quoteDetailData, activities,
      }));
    } catch { /* ignore */ }
  }, [customers, quotes, bookings, payments, invoices, profileData, quoteDetailData, activities]);

  // ── Activity logging ──
  const logActivity = useCallback((entry) => {
    setActivities(prev => [{
      ...entry,
      date: todayStr(),
      colorClass: entry.colorClass || 'ai-green',
    }, ...prev].slice(0, 50));
  }, []);

  // ── Customer CRUD ──
  const addCustomer = useCallback((data) => {
    const id = nextId(customers, 'WL-C-');
    const newCustomer = {
      id,
      name: data.fullName,
      phone: `+91 ${data.phone}`,
      email: data.email || '',
      location: data.city || '',
      type: data.customerType || 'Individual',
      joined: todayStr(),
      gradient: generateGradient(data.fullName),
      initials: generateInitials(data.fullName),
    };
    setCustomers(prev => [...prev, newCustomer]);
    setProfileData(prev => ({
      ...prev,
      [id]: {
        city: data.city || '', state: data.state || '', country: data.country || 'India',
        emailOverride: data.email || '',
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        pan: data.panNumber || '', gstin: data.gstin || '', company: data.companyName || '',
        ledger: [], payments: [],
      },
    }));
    logActivity({
      id, type: 'customers', amount: '',
      status: 'added', statusLabel: 'Added',
      customer: data.fullName, colorClass: 'ai-green',
    });
    return newCustomer;
  }, [customers, logActivity]);

  const updateCustomer = useCallback((id, data) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        name: data.fullName || c.name,
        phone: data.phone ? `+91 ${data.phone}` : c.phone,
        email: data.email || c.email,
        location: data.city || c.location,
        type: data.customerType || c.type,
        gradient: data.fullName ? generateGradient(data.fullName) : c.gradient,
        initials: data.fullName ? generateInitials(data.fullName) : c.initials,
      };
    }));
    setProfileData(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        city: data.city ?? prev[id]?.city ?? '',
        state: data.state ?? prev[id]?.state ?? '',
        country: data.country ?? prev[id]?.country ?? 'India',
        emailOverride: data.email ?? prev[id]?.emailOverride ?? '',
        tags: data.tags
          ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
          : (prev[id]?.tags || []),
        pan: data.panNumber ?? prev[id]?.pan ?? '',
        gstin: data.gstin ?? prev[id]?.gstin ?? '',
        company: data.companyName ?? prev[id]?.company ?? '',
        ledger: prev[id]?.ledger || [],
        payments: prev[id]?.payments || [],
      },
    }));
    logActivity({
      id, type: 'customers', amount: '',
      status: 'updated', statusLabel: 'Updated',
      customer: data.fullName || '', colorClass: 'ai-blue',
    });
  }, [logActivity]);

  // ── Quote CRUD ──
  const addQuote = useCallback((formData, calcResult) => {
    const id = nextId(quotes, 'WL-Q-');
    const customerName = formData.customerSearch || formData.newCustomerName || 'Customer';
    const customerPhone = formData.newCustomerPhone ? `+91 ${formData.newCustomerPhone}` : '';
    const amount = calcResult?.packagePriceCustomer ? formatINR(calcResult.packagePriceCustomer) : '₹0';
    const profit = calcResult?.totalProfit ? formatINR(calcResult.totalProfit) : '₹0';

    const newQuote = {
      id,
      customerName,
      customerPhone,
      destName: formData.destination || '',
      destType: (formData.destType || 'domestic').toLowerCase(),
      amount,
      profit,
      status: 'draft',
      tripDate: formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
      createdDate: todayStr(),
      createdTime: nowTime(),
    };
    setQuotes(prev => [newQuote, ...prev]);

    // Save quote detail
    const detail = buildQuoteDetail(formData, calcResult, id);
    setQuoteDetailData(prev => ({ ...prev, [id]: detail }));

    logActivity({
      id, type: 'quotes', amount,
      status: 'draft', statusLabel: 'Draft',
      customer: customerName, colorClass: 'ai-orange',
    });
    return { id, quote: newQuote };
  }, [quotes, logActivity]);

  const updateQuote = useCallback((id, updates) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
    if (updates.status) {
      const q = quotes.find(q => q.id === id);
      logActivity({
        id, type: 'quotes', amount: q?.amount || '',
        status: updates.status,
        statusLabel: updates.status.charAt(0).toUpperCase() + updates.status.slice(1),
        customer: q?.customerName || '', colorClass:
          updates.status === 'approved' ? 'ai-green' :
          updates.status === 'rejected' ? 'ai-orange' :
          updates.status === 'converted' ? 'ai-purple' : 'ai-blue',
      });
    }
  }, [quotes, logActivity]);

  const updateQuoteFromForm = useCallback((id, formData, calcResult) => {
    const customerName = formData.customerSearch || formData.newCustomerName || 'Customer';
    const customerPhone = formData.newCustomerPhone ? `+91 ${formData.newCustomerPhone}` : '';
    const amount = calcResult?.packagePriceCustomer ? formatINR(calcResult.packagePriceCustomer) : undefined;
    const profit = calcResult?.totalProfit ? formatINR(calcResult.totalProfit) : undefined;

    const updates = { customerName, customerPhone };
    if (formData.destination) updates.destName = formData.destination;
    if (formData.destType) updates.destType = formData.destType.toLowerCase();
    if (amount) updates.amount = amount;
    if (profit) updates.profit = profit;
    if (formData.startDate) {
      updates.tripDate = new Date(formData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));

    const detail = buildQuoteDetail(formData, calcResult, id);
    setQuoteDetailData(prev => ({ ...prev, [id]: detail }));

    logActivity({
      id, type: 'quotes', amount: amount || '',
      status: 'updated', statusLabel: 'Updated',
      customer: customerName, colorClass: 'ai-blue',
    });
  }, [logActivity]);

  const saveQuoteDetail = useCallback((id, detail) => {
    setQuoteDetailData(prev => ({ ...prev, [id]: detail }));
  }, []);

  // ── Booking CRUD ──
  const updateBooking = useCallback((id, updates) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    if (updates.status) {
      const b = bookings.find(b => b.id === id);
      logActivity({
        id, type: 'bookings', amount: b?.amount || '',
        status: updates.status,
        statusLabel: updates.status === 'in_progress' ? 'In Progress' :
          updates.status.charAt(0).toUpperCase() + updates.status.slice(1),
        customer: b?.customerName || '', colorClass:
          updates.status === 'completed' ? 'ai-green' :
          updates.status === 'cancelled' ? 'ai-orange' :
          updates.status === 'in_progress' ? 'ai-blue' : 'ai-blue',
      });
    }
  }, [bookings, logActivity]);

  // ── Payment CRUD ──
  const addPayment = useCallback((data) => {
    const id = nextId(payments, 'REC-');
    const newPayment = {
      id,
      against: data.allocateTo === 'advance' ? 'Advance' : (data.allocateTo || 'Advance'),
      customerName: data.customerName || '',
      amount: formatINR(data.amount),
      amountNum: Number(data.amount) || 0,
      modeType: data.mode || 'cash',
      modeLabel: ({ cash: 'Cash', upi: 'UPI', bank: 'Bank Transfer', cheque: 'Cheque', card: 'Card' })[data.mode] || 'Cash',
      ref: data.reference || '—',
      bankName: data.bankName || '',
      remarks: data.notes || '',
      date: data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : todayStr(),
      againstType: data.allocateTo === 'advance' ? 'advance' : 'normal',
      badge: data.allocateTo === 'advance' ? 'Advance' : 'Payment',
      createdDate: todayStr(),
    };
    setPayments(prev => [newPayment, ...prev]);

    // Update booking payment status if allocated to a booking
    if (data.allocateTo && data.allocateTo !== 'advance') {
      const bookingId = data.allocateTo;
      setBookings(prev => prev.map(b => {
        if (b.id !== bookingId) return b;
        const totalAmount = parseINR(b.amount);
        const currentPaid = parseINR(b.paymentText?.split('/')[0]);
        const newPaid = currentPaid + (Number(data.amount) || 0);
        const remaining = totalAmount - newPaid;
        const paymentStatus = remaining <= 0 ? 'paid' : 'partial';
        return {
          ...b,
          paymentStatus,
          paymentText: `${formatINR(Math.min(newPaid, totalAmount))} / ${formatINR(totalAmount)}`,
          remaining: remaining <= 0 ? '—' : formatINR(remaining),
        };
      }));
    }

    // Update customer profile
    if (data.customerId) {
      setProfileData(prev => {
        const profile = prev[data.customerId] || { ledger: [], payments: [] };
        return {
          ...prev,
          [data.customerId]: {
            ...profile,
            payments: [
              ...profile.payments,
              { id, badge: newPayment.badge, date: newPayment.date, method: data.mode || 'cash', amount: Number(data.amount) || 0 },
            ],
            ledger: [
              ...profile.ledger,
              { id, date: newPayment.date, desc: `${newPayment.modeLabel}(${newPayment.badge}) - ${newPayment.ref}`, credit: Number(data.amount) || 0, balance: 0 },
            ],
          },
        };
      });
    }

    logActivity({
      id, type: 'payments', amount: formatINR(data.amount),
      status: 'recorded', statusLabel: 'Recorded',
      customer: data.customerName || '', colorClass: 'ai-green',
    });
    return newPayment;
  }, [payments, logActivity]);

  // ── Convert Quote to Booking ──
  const convertQuote = useCallback((quoteId) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return null;

    // Mark quote as converted
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'converted' } : q));

    // Create booking
    const bookingId = nextId(bookings, 'WL-B-');
    const totalAmount = parseINR(quote.amount);
    const newBooking = {
      id: bookingId,
      customerName: quote.customerName,
      destination: quote.destName,
      amount: quote.amount,
      profit: quote.profit,
      paymentStatus: 'unpaid',
      paymentText: `₹0 / ${quote.amount}`,
      remaining: quote.amount,
      status: 'confirmed',
      date: todayStr(),
      quoteId,
    };
    setBookings(prev => [newBooking, ...prev]);

    // Create invoice
    const invoiceId = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    const newInvoice = {
      id: invoiceId,
      bookingId,
      quoteId,
      customerName: quote.customerName,
      destination: quote.destName,
      amount: quote.amount,
      status: 'Unpaid',
      date: todayStr(),
      type: 'Tax Invoice',
    };
    setInvoices(prev => [newInvoice, ...prev]);

    logActivity({
      id: quoteId, type: 'quotes', amount: quote.amount,
      status: 'converted', statusLabel: 'Converted',
      customer: quote.customerName, colorClass: 'ai-purple',
    });

    return { booking: newBooking, invoice: newInvoice };
  }, [quotes, bookings, invoices, logActivity]);

  // ── Getters ──
  const getCustomerById = useCallback((id) => customers.find(c => c.id === id), [customers]);
  const getQuoteById = useCallback((id) => quotes.find(q => q.id === id), [quotes]);
  const getBookingById = useCallback((id) => bookings.find(b => b.id === id), [bookings]);
  const getPaymentById = useCallback((id) => payments.find(p => p.id === id), [payments]);

  // ── Data context value ──
  const dataValue = {
    // Data arrays
    customers, quotes, bookings, payments, invoices, profileData, quoteDetailData, activities,
    // Customer
    addCustomer, updateCustomer, getCustomerById,
    // Quote
    addQuote, updateQuote, updateQuoteFromForm, saveQuoteDetail, getQuoteById,
    // Booking
    updateBooking, getBookingById,
    // Payment
    addPayment, getPaymentById,
    // Conversion
    convertQuote,
    // Activity
    logActivity,
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

// ── Hooks ──
const noop = () => {};
export const useDemoPopup = () => useContext(DemoPopupContext) || noop;
export const useDemoData = () => useContext(DemoDataContext);

// ── Reset helper (call when navigating back to landing) ──
export const clearDemoSession = () => {
  try { sessionStorage.removeItem(SS_KEY); } catch { /* ignore */ }
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
