import { localStorageService as ls } from './localStorageService';

// ─── Avatar helpers ────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #ff9a9e, #fad0c4)',
  'linear-gradient(135deg, #89f7fe, #66a6ff)',
  'linear-gradient(135deg, #fddb92, #d1fdff)',
];

function generateInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function generateGradient(name) {
  if (!name) return AVATAR_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

/**
 * Real data service — all CRUD is functional via localStorage.
 * All methods are synchronous but structured for easy migration to async API calls.
 */
export function createRealDataService() {
  return {
    // ─── Customers ──────────────────────────────────────────
    getCustomers: () => ls.getAll('customers'),
    getCustomerById: (id) => ls.getById('customers', id),
    addCustomer: (data) => {
      const id = ls.nextId('customers', 'WL-C-');
      const name = data.name || '';
      const customer = {
        id,
        name,
        phone: data.phone || '',
        email: data.email || '',
        location: data.location || '',
        type: data.type || 'Individual',
        joined: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        initials: generateInitials(name),
        gradient: generateGradient(name),
        ...data,
        id, // ensure generated id wins
        initials: generateInitials(data.name || name),
        gradient: generateGradient(data.name || name),
      };
      return ls.add('customers', customer);
    },
    updateCustomer: (id, updates) => {
      // Regenerate initials/gradient if name changes
      if (updates.name) {
        updates.initials = generateInitials(updates.name);
        updates.gradient = generateGradient(updates.name);
      }
      return ls.update('customers', id, updates);
    },
    deleteCustomer: (id) => ls.remove('customers', id),

    // ─── Quotes ─────────────────────────────────────────────
    getQuotes: () => ls.getAll('quotes'),
    getQuoteById: (id) => ls.getById('quotes', id),
    addQuote: (data) => {
      const id = ls.nextId('quotes', 'WL-Q-');
      const now = new Date();
      const quote = {
        id,
        customerName: data.customerName || '',
        customerPhone: data.customerPhone || '',
        destName: data.destName || '',
        destType: data.destType || 'domestic',
        amount: data.amount || '₹0',
        profit: data.profit || '₹0',
        status: data.status || 'draft',
        tripDate: data.tripDate || '',
        createdDate: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        createdTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        ...data,
        id,
      };
      return ls.add('quotes', quote);
    },
    updateQuote: (id, updates) => ls.update('quotes', id, updates),
    deleteQuote: (id) => ls.remove('quotes', id),
    getQuoteDetail: (id) => ls.getObject(`quoteDetail_${id}`),
    saveQuoteDetail: (id, detail) => ls.setObject(`quoteDetail_${id}`, detail),

    // ─── Bookings ───────────────────────────────────────────
    getBookings: () => ls.getAll('bookings'),
    getBookingById: (id) => ls.getById('bookings', id),
    addBooking: (data) => {
      const id = ls.nextId('bookings', 'WL-B-');
      const amount = data.amount || '₹0';
      const booking = {
        id,
        customerName: data.customerName || '',
        destination: data.destination || '',
        destType: data.destType || 'domestic',
        travelDate: data.travelDate || '',
        amount,
        profit: data.profit || '₹0',
        paymentStatus: data.paymentStatus || 'partial',
        paymentText: data.paymentText || `₹0 / ${amount}`,
        remaining: data.remaining || amount,
        status: data.status || 'confirmed',
        date: data.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        pax: data.pax || 1,
        createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        ...data,
        id,
      };
      return ls.add('bookings', booking);
    },
    updateBooking: (id, updates) => ls.update('bookings', id, updates),
    deleteBooking: (id) => ls.remove('bookings', id),

    // ─── Payments ───────────────────────────────────────────
    getPayments: () => ls.getAll('payments'),
    getPaymentById: (id) => ls.getById('payments', id),
    addPayment: (data) => {
      const id = ls.nextId('payments', 'WL-P-');
      const payment = {
        id,
        customerName: data.customerName || '',
        amount: data.amount || '₹0',
        date: data.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        modeType: data.modeType || 'bank',
        modeLabel: data.modeLabel || 'Bank Transfer',
        badge: data.badge || 'Full',
        againstType: data.againstType || 'booking',
        against: data.against || '',
        ref: data.ref || '',
        bankName: data.bankName || '',
        remarks: data.remarks || '',
        createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        ...data,
        id,
      };
      return ls.add('payments', payment);
    },
    updatePayment: (id, updates) => ls.update('payments', id, updates),
    deletePayment: (id) => ls.remove('payments', id),

    // ─── Invoices ───────────────────────────────────────────
    getInvoices: () => ls.getAll('invoices'),
    getInvoiceById: (id) => ls.getById('invoices', id),
    addInvoice: (data) => {
      const id = ls.nextId('invoices', 'INV-');
      const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const invoice = {
        quoteId: '',
        bookingId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerPan: '',
        customerGstin: '',
        destination: '',
        destType: 'domestic',
        duration: '',
        travelers: 1,
        travelDate: '',
        placeOfSupply: 'India',
        travelCost: 0,
        serviceFee: 200,
        cgst: 18,
        sgst: 18,
        invoiceValue: 0,
        amount: '₹0',
        total: '₹0',
        status: 'Unpaid',
        ...data,
        id,
        date: data.date || todayStr,
        createdDate: todayStr,
      };
      return ls.add('invoices', invoice);
    },
    updateInvoice: (id, updates) => ls.update('invoices', id, updates),
    deleteInvoice: (id) => ls.remove('invoices', id),

    // ─── Profile Data ───────────────────────────────────────
    getProfileData: (customerId) => ls.getObject(`profile_${customerId}`),
    updateProfileData: (customerId, data) => ls.setObject(`profile_${customerId}`, data),

    // ─── Dashboard ──────────────────────────────────────────
    getActivities: () => ls.getAll('activities'),
    addActivity: (activity) => {
      const activities = ls.getAll('activities');
      activities.unshift({
        ...activity,
        time: new Date().toLocaleString('en-IN'),
        timestamp: Date.now(),
      });
      // Keep only last 20 activities
      if (activities.length > 20) activities.length = 20;
      localStorage.setItem('real_activities', JSON.stringify(activities));
      return activity;
    },
    getTopCustomers: () => {
      const customers = ls.getAll('customers');
      const payments = ls.getAll('payments');
      // Aggregate payments per customer
      const totals = {};
      payments.forEach(p => {
        const amt = parseInt((p.amount || '0').replace(/[₹,]/g, ''), 10) || 0;
        totals[p.customerName] = (totals[p.customerName] || 0) + amt;
      });
      return customers
        .map(c => ({ ...c, totalRevenue: totals[c.name] || 0 }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);
    },

    // ─── Settings ───────────────────────────────────────────
    getSettings: () => ls.getObject('settings') || {
      companyName: 'My Agency',
      companySubtitle: 'Travel & Tourism',
      userName: 'Admin',
      userRole: 'admin',
      email: '',
      phone: '',
    },
    updateSettings: (updates) => {
      const current = ls.getObject('settings') || {};
      return ls.setObject('settings', { ...current, ...updates });
    },
  };
}
