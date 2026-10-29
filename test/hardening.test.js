// Hardening regressions: rate-limiter memory bound and CSV formula-injection guard.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { createLimiter } = require('../lib/ratelimit');

// csvCell lives inside the browser IIFE in public/app.js; extract and eval the
// shipped function so the test covers the exact code that runs in the browser.
function loadCsvCell() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');
  const m = src.match(/function csvCell\(v\) \{[\s\S]*?\n  \}/);
  assert.ok(m, 'csvCell found in app.js');
  return new Function(`${m[0]}; return csvCell;`)();
}

test('limiter caps memory by evicting oldest keys past maxKeys', () => {
  let t = 1e9;
  const lim = createLimiter({ limit: 5, windowMs: 60000, maxKeys: 10, now: () => t });
  for (let i = 0; i < 5000; i++) lim.take('ip-' + i);
  assert.ok(lim.size() <= 11, `map stays bounded, got ${lim.size()}`);
});

test('limiter still admits fresh keys after eviction', () => {
  const t0 = 1e9;
  const lim = createLimiter({ limit: 2, windowMs: 60000, maxKeys: 3, now: () => t0 });
  for (let i = 0; i < 50; i++) lim.take('flood-' + i);
  assert.strictEqual(lim.take('newcomer').ok, true, 'a new IP is not locked out by the flood');
});

test('limiter blocks past the limit and reports retry-after', () => {
  let t = 1e9;
  const lim = createLimiter({ limit: 2, windowMs: 60000, now: () => t });
  assert.strictEqual(lim.take('a').ok, true);
  assert.strictEqual(lim.take('a').ok, true);
  const blocked = lim.take('a');
  assert.strictEqual(blocked.ok, false);
  assert.ok(blocked.retryAfter >= 1);
  t += 61000; // window slides
  assert.strictEqual(lim.take('a').ok, true, 'allowed again after the window');
});

test('CSV export neutralises spreadsheet formulas', () => {
  const csvCell = loadCsvCell();
  for (const bad of ['=1+1', '+SUM(A1:A2)', '-2+3', '@cmd', '\t=x', '\r=x']) {
    const out = csvCell(bad);
    assert.ok(out.startsWith("'"), `formula-like cell is prefixed: ${JSON.stringify(out)}`);
  }
  assert.strictEqual(csvCell('http://evil.example/?a=1'), 'http://evil.example/?a=1', 'plain URLs unchanged');
  assert.strictEqual(csvCell('a,b'), '"a,b"', 'comma still quoted');
  assert.strictEqual(csvCell('say "hi"'), '"say ""hi"""', 'quotes still escaped');
});
