/**
 * authMiddleware.js
 * Verifies the Supabase JWT on every real-dashboard request.
 * Attaches req.userId for use in all route handlers.
 */
const { supabaseAdmin } = require('../utils/supabaseAdmin');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = user.id;
  req.user   = user;
  next();
}

module.exports = { authMiddleware };
