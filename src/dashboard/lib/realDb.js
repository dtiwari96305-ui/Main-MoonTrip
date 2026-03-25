import { supabase } from '../../shared/lib/supabase'

export const realDb = {
  // Customers
  getCustomers: async () => {
    const { data, error } = await supabase
      .from('real_customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createCustomer: async (data) => {
    const { data: result, error } = await supabase
      .from('real_customers')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateCustomer: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_customers')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  deleteCustomer: async (id) => {
    const { error } = await supabase
      .from('real_customers')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  
  // Quotes
  getQuotes: async () => {
    const { data, error } = await supabase
      .from('real_quotes')
      .select('*, real_customers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createQuote: async (data) => {
    const { data: result, error } = await supabase
      .from('real_quotes')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateQuote: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_quotes')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  deleteQuote: async (id) => {
    const { error } = await supabase
      .from('real_quotes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  
  // Bookings
  getBookings: async () => {
    const { data, error } = await supabase
      .from('real_bookings')
      .select('*, real_customers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createBooking: async (data) => {
    const { data: result, error } = await supabase
      .from('real_bookings')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateBooking: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_bookings')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  deleteBooking: async (id) => {
    const { error } = await supabase
      .from('real_bookings')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  
  // Payments
  getPayments: async () => {
    const { data, error } = await supabase
      .from('real_payments')
      .select('*, real_customers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createPayment: async (data) => {
    const { data: result, error } = await supabase
      .from('real_payments')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updatePayment: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_payments')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  
  // Activity Log
  getLogs: async () => {
    const { data, error } = await supabase
      .from('real_activity_log')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createLog: async (data) => {
    const { error } = await supabase
      .from('real_activity_log')
      .insert(data);
    if (error) throw error;
  },
  markAllRead: async () => {
    const { error } = await supabase
      .from('real_activity_log')
      .update({ is_read: true })
      .eq('is_read', false);
    if (error) throw error;
  },
  
  // Sales Invoices
  getInvoices: async () => {
    const { data, error } = await supabase
      .from('real_sales_invoices')
      .select('*, real_customers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createInvoice: async (data) => {
    const { data: result, error } = await supabase
      .from('real_sales_invoices')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateInvoice: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_sales_invoices')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  
  // Advance Ledger
  getLedger: async (customerId) => {
    const { data, error } = await supabase
      .from('real_advance_ledger')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createLedgerEntry: async (data) => {
    const { data: result, error } = await supabase
      .from('real_advance_ledger')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  
  // Settings
  getSettings: async () => {
    const { data, error } = await supabase
      .from('real_settings')
      .select('*')
      .single();
    // Default settings if none found
    if (error && error.code === 'PGRST116') {
      return {
        company_name: 'My Agency',
        pdf_theme: 'default',
        quote_prefix: 'WL-Q-',
        quote_next_number: 1,
        invoice_prefix: 'WL-B-',
        invoice_next_number: 1,
        receipt_prefix: 'REC-',
        receipt_next_number: 1,
        gst_enabled: true
      };
    }
    if (error) throw error;
    return data;
  },
  updateSettings: async (data) => {
    const { data: result, error } = await supabase
      .from('real_settings')
      .upsert({ ...data, id: data.id || undefined }) // Assuming single settings row handles identity
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  
  // Team
  getTeamMembers: async () => {
    const { data, error } = await supabase
      .from('real_team_members')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  createTeamMember: async (data) => {
    const { data: result, error } = await supabase
      .from('real_team_members')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateTeamMember: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_team_members')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  deleteTeamMember: async (id) => {
    const { error } = await supabase
      .from('real_team_members')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
}
