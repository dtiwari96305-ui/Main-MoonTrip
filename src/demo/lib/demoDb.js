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
}
