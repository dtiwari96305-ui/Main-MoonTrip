import {
  demoCustomers,
  demoQuotes,
  demoBookings,
  demoPayments,
  getDemoPaymentById,
  demoProfileData,
  demoActivities,
  demoTopCustomers,
  demoQuoteDetailData,
} from '../../shared/data/demoData';

/**
 * Creates a demo data service.
 * All read operations return hardcoded demo data.
 * All write operations call `onBlock()` (the demo popup trigger).
 */
export function createDemoDataService(onBlock) {
  return {
    // Customers
    getCustomers: () => demoCustomers,
    getCustomerById: (id) => demoCustomers.find(c => c.id === id) || null,
    addCustomer: () => { onBlock(); return {}; },
    updateCustomer: () => { onBlock(); return {}; },
    deleteCustomer: () => { onBlock(); },

    // Quotes
    getQuotes: () => demoQuotes,
    getQuoteById: (id) => demoQuotes.find(q => q.id === id) || null,
    addQuote: () => { onBlock(); return {}; },
    updateQuote: () => { onBlock(); return {}; },
    deleteQuote: () => { onBlock(); },
    getQuoteDetail: (id) => demoQuoteDetailData[id] || null,

    // Bookings
    getBookings: () => demoBookings,
    getBookingById: (id) => demoBookings.find(b => b.id === id) || null,
    addBooking: () => { onBlock(); return {}; },
    updateBooking: () => { onBlock(); return {}; },

    // Payments
    getPayments: () => demoPayments,
    getPaymentById: (id) => getDemoPaymentById(id),
    addPayment: () => { onBlock(); return {}; },
    updatePayment: () => { onBlock(); return {}; },

    // Profile Data
    getProfileData: (customerId) => demoProfileData[customerId] || null,
    updateProfileData: () => { onBlock(); return {}; },

    // Dashboard
    getActivities: () => demoActivities,
    getTopCustomers: () => demoTopCustomers,

    // Settings
    getSettings: () => ({}),
    updateSettings: () => { onBlock(); return {}; },
  };
}
