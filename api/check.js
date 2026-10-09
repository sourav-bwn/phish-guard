const { handleCheck } = require('../lib/handler');

// Open CORS so other sites and tools can call it. No keys, no storage, nothing logged.
module.exports = async (req, res) => {
  res.setHeader('cache-control', 'no-store');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  let input = req.query && req.query.url;
  if (!input && req.method === 'POST') input = req.body;
  if (typeof input === 'string' && input.trim().startsWith('{')) { try { input = JSON.parse(input); } catch (e) {} }
  const out = await handleCheck(input, process.env);
  res.status(out.status).json(out.body);
};
