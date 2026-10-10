const H = require('../public/heuristics.js');
const { checkAll } = require('./external');
const ML = require('../public/ml.js');
const { createLimiter } = require('./ratelimit');
let MODEL = null;
try { MODEL = require('../public/model.json'); } catch (e) {}

// Per visitor (by IP) and per warm instance. Single-link checks also call third-party databases, so they get the tighter cap.
// A shared cap on outside lookups keeps a flood from burning the free tiers: past it, we still answer from the local checks.
const LIMITS = { link: createLimiter({ limit: 20, windowMs: 60000 }), local: createLimiter({ limit: 60, windowMs: 60000 }), external: createLimiter({ limit: 240, windowMs: 60000 }) };

// Shared by the Vercel function and the local dev server.
// GET /api/check?url=...   or   POST /api/check {"url": "..."} | {"text": "whole message"} | {"urls": [...]}
async function handleCheck(input, env, ctx) {
  const ip = ctx && ctx.ip ? String(ctx.ip) : null;
  const limited = (kind) => {
    if (!ip) return null;
    const r = LIMITS[kind].take(ip);
    return r.ok ? null : { status: 429, headers: { 'retry-after': String(r.retryAfter) }, body: { error: 'rate_limited', retry_after: r.retryAfter } };
  };
  if (input && typeof input === 'object') {
    if (Array.isArray(input.urls)) {
      const rl = limited('local'); if (rl) return rl;
      const results = input.urls.slice(0, 50).map(u => summarize(String(u)));
      return { status: 200, body: { results } };
    }
    if (typeof input.text === 'string') {
      const rl = limited('local'); if (rl) return rl;
      const m = H.analyzeMessage(input.text.slice(0, 5000));
      if (!m.ok) return { status: 400, body: { error: 'empty text' } };
      return { status: 200, body: {
        verdict: m.verdict, score: m.score,
        reasons: m.cues.map(c => ({ en: c.en, bn: c.bn, weight: c.weight })),
        links: m.links.map(l => ({ url: l.input, verdict: l.verdict, score: l.score, reasons: l.flags.map(f => ({ id: f.id, en: f.en, bn: f.bn, weight: f.weight })) }))
      } };
    }
    input = input.url;
  }
  const url = String(input || '').trim().slice(0, 2048);
  if (!url) return { status: 400, body: { error: 'missing url' } };
  const rl = limited('link'); if (rl) return rl;
  const local = H.analyze(url);
  if (!local.ok) return { status: 400, body: { error: 'invalid url' } };
  const p = H.parse(url);
  const full = p && p.url ? p.url.href : url;
  let external = [];
  if (p && p.url) {
    const busy = ip && !LIMITS.external.take('all').ok;
    external = busy ? [{ name: 'Outside databases', status: 'skipped', note: 'busy right now, local checks only' }] : await checkAll(full, p.url.hostname, env, local.registrable);
  }
  let verdict = local.verdict;
  if (external.some(e => e.flagged && e.level !== 'warn')) verdict = 'phishing';
  else if (verdict === 'safe' && external.some(e => e.flagged)) verdict = 'suspicious';
  const ml = MODEL ? ML.predict(MODEL, url) : null;
  return { status: 200, body: Object.assign(summarize(url), { verdict, external, ml: ml ? { probability: +ml.probability.toFixed(3), note: 'advisory, host-pattern model' } : null }) };
}

function summarize(url) {
  const r = H.analyze(url);
  if (!r.ok) return { url, error: 'invalid url' };
  return { url, host: r.host, verdict: r.verdict, score: r.score, reasons: r.flags.map(f => ({ id: f.id, en: f.en, bn: f.bn, weight: f.weight })) };
}
module.exports = { handleCheck, LIMITS };
