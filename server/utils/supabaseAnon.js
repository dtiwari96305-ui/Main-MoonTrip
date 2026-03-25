/**
 * supabaseAnon.js
 * Anon-key Supabase client — used for auth operations (signUp, signIn, etc.)
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl  = process.env.SUPABASE_URL;
const supabaseAnon = process.env.SUPABASE_ANON_KEY;

const supabaseAnonClient = createClient(supabaseUrl, supabaseAnon, {
  auth: { autoRefreshToken: false, persistSession: false }
});

module.exports = { supabaseAnonClient };
