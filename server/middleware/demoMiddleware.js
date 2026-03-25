/**
 * demoMiddleware.js
 * Rate limiter for demo routes — 20 write requests per minute per IP.
 * No auth required.
 */
const rateLimit = require('express-rate-limit');

const demoWriteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment before trying again.' },
  skip: (req) => req.method === 'GET', // only limit writes
});

module.exports = { demoWriteLimiter };
