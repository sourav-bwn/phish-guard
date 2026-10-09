const { analyze } = require('../public/heuristics.js');
const { checkAll } = require('./external');

// Shared by the Vercel function and the local server.
async function handleCheck(input, env) {
  const url = String(input || '').trim().slice(0, 2048);
  if (!url) return { status: 400, body: { error: 'missing url' } };
  const local = analyze(url);
  if (!local.ok) return { status: 400, body: { error: 'invalid url' } };
  const p = require('../public/heuristics.js').parse(url);
  const full = p && p.url ? p.url.href : url;
  const external = p && p.url ? await checkAll(full, p.url.hostname, env) : [];
  return { status: 200, body: { external } };
}
module.exports = { handleCheck };
