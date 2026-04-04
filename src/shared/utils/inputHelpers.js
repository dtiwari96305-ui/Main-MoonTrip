// ─── Input validation helpers ─────────────────────────────────────────────────
// Used across all forms to enforce number-only, text-only, and phone input rules.

/**
 * Filter value to digits only (and optionally decimal point).
 * Usage: onChange={e => set('amount', numericOnly(e.target.value))}
 */
export function numericOnly(value, allowDecimal = true) {
  if (allowDecimal) {
    let v = value.replace(/[^0-9.]/g, '');
    const parts = v.split('.');
    if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
    return v;
  }
  return value.replace(/[^0-9]/g, '');
}

/**
 * Filter value to letters and spaces only (for names).
 * Usage: onChange={e => set('name', lettersOnly(e.target.value))}
 */
export function lettersOnly(value) {
  return value.replace(/[^a-zA-Z\u00C0-\u024F\s'-]/g, '');
}

/**
 * Filter value for phone numbers: digits, +, -, spaces.
 * Usage: onChange={e => set('phone', phoneOnly(e.target.value))}
 */
export function phoneOnly(value) {
  return value.replace(/[^0-9+\-\s()]/g, '');
}

/**
 * onKeyDown handler to block non-numeric keys for amount/number fields.
 * Usage: onKeyDown={blockNonNumericKeys}
 */
export function blockNonNumericKeys(e) {
  // Allow: backspace, delete, tab, escape, enter, arrow keys, home, end
  if ([8, 9, 27, 13, 46, 37, 38, 39, 40, 36, 35].includes(e.keyCode)) return;
  // Allow: Ctrl/Cmd shortcuts
  if (e.ctrlKey || e.metaKey) return;
  // Allow decimal point
  if (e.key === '.') return;
  // Block non-digit
  if (!/[0-9]/.test(e.key)) e.preventDefault();
}
