/**
 * Data Service Interface
 *
 * Defines the contract that both demo and real data services must implement.
 * Demo: returns hardcoded data, blocks writes with demo popup.
 * Real: uses localStorage (and eventually API), all CRUD is functional.
 *
 * All methods return plain values (not Promises) for simplicity,
 * but real implementations may wrap in Promises for API readiness.
 */

/**
 * @typedef {Object} DataService
 *
 * --- Customers ---
 * @property {function(): Array} getCustomers
 * @property {function(string): Object|null} getCustomerById
 * @property {function(Object): Object} addCustomer
 * @property {function(string, Object): Object} updateCustomer
 * @property {function(string): void} deleteCustomer
 *
 * --- Quotes ---
 * @property {function(): Array} getQuotes
 * @property {function(string): Object|null} getQuoteById
 * @property {function(Object): Object} addQuote
 * @property {function(string, Object): Object} updateQuote
 * @property {function(string): void} deleteQuote
 * @property {function(string): Object|null} getQuoteDetail - full detail with services, fin, itinerary
 *
 * --- Bookings ---
 * @property {function(): Array} getBookings
 * @property {function(string): Object|null} getBookingById
 * @property {function(Object): Object} addBooking
 * @property {function(string, Object): Object} updateBooking
 *
 * --- Payments ---
 * @property {function(): Array} getPayments
 * @property {function(string): Object|null} getPaymentById
 * @property {function(Object): Object} addPayment
 * @property {function(string, Object): Object} updatePayment
 *
 * --- Profile Data ---
 * @property {function(string): Object|null} getProfileData - extended customer profile
 * @property {function(string, Object): Object} updateProfileData
 *
 * --- Dashboard Data ---
 * @property {function(): Array} getActivities - recent activity feed
 * @property {function(): Array} getTopCustomers - top customers by revenue
 *
 * --- Settings ---
 * @property {function(): Object} getSettings
 * @property {function(Object): Object} updateSettings
 */

/**
 * Creates a base data service with no-op implementations.
 * Used as a starting point — concrete services override these methods.
 */
export function createDataService() {
  return {
    // Customers
    getCustomers: () => [],
    getCustomerById: () => null,
    addCustomer: () => ({}),
    updateCustomer: () => ({}),
    deleteCustomer: () => {},

    // Quotes
    getQuotes: () => [],
    getQuoteById: () => null,
    addQuote: () => ({}),
    updateQuote: () => ({}),
    deleteQuote: () => {},
    getQuoteDetail: () => null,

    // Bookings
    getBookings: () => [],
    getBookingById: () => null,
    addBooking: () => ({}),
    updateBooking: () => ({}),

    // Payments
    getPayments: () => [],
    getPaymentById: () => null,
    addPayment: () => ({}),
    updatePayment: () => ({}),

    // Profile Data
    getProfileData: () => null,
    updateProfileData: () => ({}),

    // Dashboard
    getActivities: () => [],
    getTopCustomers: () => [],

    // Settings
    getSettings: () => ({}),
    updateSettings: () => ({}),
  };
}
