const H = require('../public/heuristics.js');
const { checkAll } = require('./external');
const ML = require('../public/ml.js');
let MODEL = null;
try { MODEL = require('../public/model.json'); } catch (e) {}

// Shared by the Vercel function and the local dev server.
// GET /api/check?url=...   or   POST /api/check {"url": "..."} | {"text": "whole message"} | {"urls": [...]}
async function handleCheck(input, env) {
  if (input && typeof input === 'object') {
    if (Array.isArray(input.urls)) {
      const results = input.urls.slice(0, 50).map(u => summarize(String(u)));
      return { status: 200, body: { results } };
    }
    if (typeof input.text === 'string') {
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
  const local = H.analyze(url);
  if (!local.ok) return { status: 400, body: { error: 'invalid url' } };
  const p = H.parse(url);
  const full = p && p.url ? p.url.href : url;
  const external = p && p.url ? await checkAll(full, p.url.hostname, env, local.registrable) : [];
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
module.exports = { handleCheck };
