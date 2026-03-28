import { supabase } from '../../shared/lib/supabase'

export const demoDb = {
  // Customers
  getCustomers: async () => {
    const { data, error } = await supabase
      .from('demo_customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createCustomer: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_customers')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateCustomer: async (id, data) => {
    const { data: result, error } = await supabase
      .from('demo_customers')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  
  // Quotes
  getQuotes: async () => {
    const { data, error } = await supabase
      .from('demo_quotes')
      .select('*, demo_customers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createQuote: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_quotes')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateQuote: async (id, data) => {
    const { data: result, error } = await supabase
      .from('demo_quotes')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  
  // Bookings
  getBookings: async () => {
    const { data, error } = await supabase
      .from('demo_bookings')
      .select('*, demo_customers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createBooking: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_bookings')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateBooking: async (id, data) => {
    const { data: result, error } = await supabase
      .from('demo_bookings')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  
  // Payments
  getPayments: async () => {
    const { data, error } = await supabase
      .from('demo_payments')
      .select('*, demo_customers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createPayment: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_payments')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  
  // Activity Log
  getLogs: async () => {
    const { data, error } = await supabase
      .from('demo_activity_log')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createLog: async (data) => {
    const { error } = await supabase
      .from('demo_activity_log')
      .insert(data);
    if (error) throw error;
  },
  markAllRead: async () => {
    const { error } = await supabase
      .from('demo_activity_log')
      .update({ is_read: true })
      .eq('is_read', false);
    if (error) throw error;
  },
  
  // Sales Invoices
  getInvoices: async () => {
    const { data, error } = await supabase
      .from('demo_sales_invoices')
      .select('*, demo_customers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  
  // Vendors
  getVendors: async () => {
    const { data, error } = await supabase
      .from('demo_vendors')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createVendor: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_vendors')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateVendor: async (id, data) => {
    const { data: result, error } = await supabase
      .from('demo_vendors')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Vendor Bills
  getVendorBills: async () => {
    const { data, error } = await supabase
      .from('demo_vendor_bills')
      .select('*, demo_vendors(*), demo_bookings(booking_number)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createVendorBill: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_vendor_bills')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateVendorBill: async (id, data) => {
    const { data: result, error } = await supabase
      .from('demo_vendor_bills')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Vendor Payments
  getVendorPayments: async () => {
    const { data, error } = await supabase
      .from('demo_vendor_payments')
      .select('*, demo_vendors(*), demo_vendor_bills(bill_number)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createVendorPayment: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_vendor_payments')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Advance Ledger
  getLedger: async (customerId) => {
    const { data, error } = await supabase
      .from('demo_advance_ledger')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Chart of Accounts
  getChartOfAccounts: async () => {
    const { data, error } = await supabase
      .from('demo_chart_of_accounts')
      .select('*')
      .order('code', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  createCoAAccount: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_chart_of_accounts')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateCoAAccount: async (id, data) => {
    const { data: result, error } = await supabase
      .from('demo_chart_of_accounts')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Journal Entries
  getJournalEntries: async () => {
    const { data, error } = await supabase
      .from('demo_journal_entries')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  createJournalEntry: async (entry, lines) => {
    const { data: result, error } = await supabase
      .from('demo_journal_entries')
      .insert(entry)
      .select()
      .single();
    if (error) throw error;
    if (lines && lines.length > 0) {
      const { error: lineErr } = await supabase
        .from('demo_journal_lines')
        .insert(lines.map(l => ({ ...l, entry_id: result.id })));
      if (lineErr) throw lineErr;
    }
    return result;
  },
  getJournalLines: async (entryId) => {
    const { data, error } = await supabase
      .from('demo_journal_lines')
      .select('*')
      .eq('entry_id', entryId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  // Bank Accounts
  getBankAccounts: async () => {
    const { data, error } = await supabase
      .from('demo_bank_accounts')
      .select('*')
      .order('is_default', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  createBankAccount: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_bank_accounts')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateBankAccount: async (id, data) => {
    const { data: result, error } = await supabase
      .from('demo_bank_accounts')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // General Entries
  getGeneralEntries: async () => {
    const { data, error } = await supabase
      .from('demo_general_entries')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  createGeneralEntry: async (data) => {
    const { data: result, error } = await supabase
      .from('demo_general_entries')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
}
