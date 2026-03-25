/**
 * numberGenerator.js
 * Generates formatted sequential document numbers from document_numbering table.
 * Format: prefix-number[-suffix] e.g. "B-1-FY26" or "INV-42"
 * Auto-increments next_number after each call.
 */
const { supabaseAdmin } = require('./supabaseAdmin');

/**
 * @param {string} userId
 * @param {'quote'|'booking'|'invoice'|'receipt'} type
 * @returns {Promise<string>} formatted number
 */
async function generateNumber(userId, type) {
  const colPrefix = `${type}_prefix`;
  const colSuffix = `${type}_suffix`;
  const colNext   = `${type}_next_number`;

  // Fetch (or create) the user's numbering row
  let { data: row, error } = await supabaseAdmin
    .from('document_numbering')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // No row yet — insert default
    const { data: inserted } = await supabaseAdmin
      .from('document_numbering')
      .insert({ user_id: userId })
      .select()
      .single();
    row = inserted;
  } else if (error) {
    throw error;
  }

  const prefix = row[colPrefix] || type.toUpperCase()[0];
  const suffix = row[colSuffix] || '';
  const num    = row[colNext] || 1;

  // Format: prefix-num[-suffix] — skip suffix if empty
  const formatted = suffix
    ? `${prefix}-${num}-${suffix}`
    : `${prefix}-${num}`;

  // Increment
  await supabaseAdmin
    .from('document_numbering')
    .update({ [colNext]: num + 1, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  return formatted;
}

module.exports = { generateNumber };
