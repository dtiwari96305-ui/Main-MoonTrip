import { supabase } from '../../shared/lib/supabase'

export const realDb = {
  // ── Sequential Document Numbers ──
  getNextDocNumber: async (type) => {
    const { data, error } = await supabase.rpc('get_next_doc_number', { p_type: type });
    if (error) throw error;
    return data;
  },

  // ── Nomenclature / Document Sequences ──
  hasNomenclatureSetup: async () => {
    const { data, error } = await supabase.rpc('has_nomenclature_setup');
    if (error) {
      // If function doesn't exist yet, fall back to direct query
      const { data: rows, error: qErr } = await supabase
        .from('real_document_sequences')
        .select('id')
        .limit(1);
      if (qErr) return false;
      return rows && rows.length > 0;
    }
    return data;
  },

  getDocumentSequences: async () => {
    const { data, error } = await supabase
      .from('real_document_sequences')
      .select('*')
      .order('document_type');
    if (error) throw error;
    return data || [];
  },

  saveDocumentSequences: async (sequences) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const rows = sequences.map(s => ({
      user_id: user.id,
      document_type: s.document_type,
      prefix: s.prefix,
      suffix: s.suffix,
      current_number: s.current_number,
      padding: s.padding,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('real_document_sequences')
      .upsert(rows, { onConflict: 'user_id,document_type' })
      .select();
    if (error) throw error;
    return data;
  },

  updateDocumentSequence: async (documentType, updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('real_document_sequences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('document_type', documentType)
      .select()
      .single();
    if (error) throw error;
    return data;
  },


  // Customers
  getCustomers: async () => {
    const { data, error } = await supabase
      .from('real_customers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
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
      .order('created_at', { ascending: false })
      .limit(500);
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
      .order('created_at', { ascending: false })
      .limit(500);
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
      .order('created_at', { ascending: false })
      .limit(500);
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

  // Activity Log — limited to 100 most recent entries
  getLogs: async () => {
    const { data, error } = await supabase
      .from('real_activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
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
      .order('created_at', { ascending: false })
      .limit(500);
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

  // Vendors
  getVendors: async () => {
    const { data, error } = await supabase
      .from('real_vendors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data;
  },
  createVendor: async (data) => {
    const { data: result, error } = await supabase
      .from('real_vendors')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateVendor: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_vendors')
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
      .from('real_vendor_bills')
      .select('*, real_vendors(*), real_bookings(booking_number)')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data;
  },
  createVendorBill: async (data) => {
    const { data: result, error } = await supabase
      .from('real_vendor_bills')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateVendorBill: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_vendor_bills')
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
      .from('real_vendor_payments')
      .select('*, real_vendors(*), real_vendor_bills(bill_number)')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data;
  },
  createVendorPayment: async (data) => {
    const { data: result, error } = await supabase
      .from('real_vendor_payments')
      .insert(data)
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
      .order('created_at', { ascending: false })
      .limit(200);
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
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return {
        company_name: 'My Agency',
        pdf_theme: 'classic',
        quote_prefix: 'WL-Q-',
        quote_next_number: 1,
        invoice_prefix: 'WL-B-',
        invoice_next_number: 1,
        receipt_prefix: 'REC-',
        receipt_next_number: 1,
        gst_enabled: true
      };
    }
    return data;
  },
  updateSettings: async (data) => {
    const { data: result, error } = await supabase
      .from('real_settings')
      .upsert(data, { onConflict: 'user_id' })
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
      .order('created_at', { ascending: false })
      .limit(100);
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

  // Chart of Accounts
  getChartOfAccounts: async () => {
    const { data, error } = await supabase
      .from('real_chart_of_accounts')
      .select('*')
      .order('code', { ascending: true })
      .limit(500);
    if (error) throw error;
    return data || [];
  },
  createCoAAccount: async (data) => {
    const { data: result, error } = await supabase
      .from('real_chart_of_accounts')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateCoAAccount: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_chart_of_accounts')
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
      .from('real_journal_entries')
      .select('*')
      .order('date', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data || [];
  },
  createJournalEntry: async (entry, lines) => {
    const { data: result, error } = await supabase
      .from('real_journal_entries')
      .insert(entry)
      .select()
      .single();
    if (error) throw error;
    if (lines && lines.length > 0) {
      const { error: lineErr } = await supabase
        .from('real_journal_lines')
        .insert(lines.map(l => ({ ...l, entry_id: result.id })));
      if (lineErr) throw lineErr;
    }
    return result;
  },
  getJournalLines: async (entryId) => {
    const { data, error } = await supabase
      .from('real_journal_lines')
      .select('*')
      .eq('entry_id', entryId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  // Bank Accounts
  getBankAccounts: async () => {
    const { data, error } = await supabase
      .from('real_bank_accounts')
      .select('*')
      .order('is_default', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  },
  createBankAccount: async (data) => {
    const { data: result, error } = await supabase
      .from('real_bank_accounts')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
  updateBankAccount: async (id, data) => {
    const { data: result, error } = await supabase
      .from('real_bank_accounts')
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
      .from('real_general_entries')
      .select('*')
      .order('date', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data || [];
  },
  createGeneralEntry: async (data) => {
    const { data: result, error } = await supabase
      .from('real_general_entries')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },
}
