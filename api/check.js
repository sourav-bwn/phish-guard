const { handleCheck } = require('../lib/handler');

// Open CORS so other sites and tools can call it. No keys, no storage, nothing logged.
// Rate limited per caller (see lib/handler.js).
module.exports = async (req, res) => {
  res.setHeader('cache-control', 'no-store');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  res.setHeader('access-control-expose-headers', 'retry-after');
  if (req.method === 'OPTIONS') return res.status(204).end();
  let input = req.query && req.query.url;
  if (!input && req.method === 'POST') input = req.body;
  if (typeof input === 'string' && input.trim().startsWith('{')) { try { input = JSON.parse(input); } catch (e) {} }
  // Vercel sets x-forwarded-for itself, so the first entry is the caller.
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = fwd || req.headers['x-real-ip'] || (req.socket && req.socket.remoteAddress) || 'unknown';
  const out = await handleCheck(input, process.env, { ip });
  if (out.headers) for (const k of Object.keys(out.headers)) res.setHeader(k, out.headers[k]);
  res.status(out.status).json(out.body);
};
