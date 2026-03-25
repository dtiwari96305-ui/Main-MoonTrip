/**
 * supabaseAdmin.js
 * Service-role Supabase client — bypasses RLS.
 * NEVER expose this to the frontend. Server-side only.
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl       = process.env.SUPABASE_URL;
const serviceRoleKey    = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[supabaseAdmin] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in server/.env');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

module.exports = { supabaseAdmin };
