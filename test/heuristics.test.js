const test = require('node:test');
const assert = require('node:assert');
const { analyze } = require('../public/heuristics.js');
const v = (u) => analyze(u).verdict;

test('safe: well known sites', () => {
  for (const u of ['https://www.google.com', 'google.com', 'https://www.onlinesbi.sbi/', 'https://www.irctc.co.in/nget/train-search', 'https://github.com/sourav-bwn', 'https://en.wikipedia.org/wiki/Phishing'])
    assert.strictEqual(v(u), 'safe', u);
});
test('phishing: lookalike and brand abuse', () => {
  assert.strictEqual(v('http://paypa1.com/signin'), 'phishing');
  assert.strictEqual(v('http://sbi-kyc-update.xyz/login'), 'phishing');
  assert.strictEqual(v('http://hdfcbank.com.verify-account.top/otp'), 'phishing');
  assert.strictEqual(v('http://192.168.4.5/paytm/kyc'), 'phishing');
  assert.strictEqual(v('https://xn--pypal-4ve.com/login'), 'phishing');
});
test('suspicious: shorteners', () => {
  assert.notStrictEqual(v('https://bit.ly/3xYz12'), 'safe');
});
test('apk download is flagged', () => {
  assert.notStrictEqual(v('http://example-offers.in/sbi-reward.apk'), 'safe');
});
test('bad input', () => {
  assert.strictEqual(analyze('').ok, false);
  assert.strictEqual(v('javascript:alert(1)'), 'phishing');
});
test('no scheme is not penalised', () => {
  assert.strictEqual(v('amazon.in'), 'safe');
});
test('official subdomain is safe, trick domain is not', () => {
  assert.strictEqual(v('https://netbanking.hdfcbank.com/'), 'safe');
  assert.notStrictEqual(v('https://hdfcbank.com.secure-login.work/'), 'safe');
});

const { analyzeMessage, extractLinks } = require('../public/heuristics.js');
test('message: KYC scam SMS', () => {
  const m = analyzeMessage('Dear customer, your SBI account will be blocked today. Update KYC immediately: http://sbi-kyc-update.xyz/login');
  assert.strictEqual(m.verdict, 'phishing');
  assert.strictEqual(m.links.length, 1);
});
test('message: Bengali scam wording', () => {
  const m = analyzeMessage('আপনার অ্যাকাউন্ট আজ বন্ধ হয়ে যাবে। কেওয়াইসি আপডেট করুন bit.ly/abc123');
  assert.notStrictEqual(m.verdict, 'safe');
});
test('message: ordinary text is safe', () => {
  assert.strictEqual(analyzeMessage('Hi, lunch at 2? Here is the menu https://www.google.com/maps').verdict, 'safe');
});
test('extractLinks ignores emails and trailing punctuation', () => {
  assert.deepStrictEqual(extractLinks('mail me at ravi@gmail.com or open https://example.com/a.'), ['https://example.com/a']);
});
test('ordinary words close to a brand are not flagged', () => {
  for (const u of ['https://apply.com', 'https://taxis.example.in', 'https://maple.com'])
    assert.strictEqual(v(u), 'safe', u);
});
test('extra-letter typosquat is flagged', () => {
  assert.notStrictEqual(v('https://gooogle.com/login'), 'safe');
  assert.notStrictEqual(v('https://arnazon.in/deal'), 'safe');
});

const H2 = require('../public/heuristics.js');
test('phone: foreign and invalid numbers', () => {
  assert.notStrictEqual(H2.analyzePhone('+84 912 345 678').verdict, 'safe');
  assert.strictEqual(H2.analyzePhone('+91 98765 43210').verdict, 'safe');
  assert.notStrictEqual(H2.analyzePhone('+91 12345 67890').verdict, 'safe');
});
test('upi: official-sounding names and odd handles', () => {
  assert.strictEqual(H2.analyzeUPI('ravi.kumar@oksbi').verdict, 'safe');
  assert.strictEqual(H2.analyzeUPI('9876543210@ybl').verdict, 'safe');
  assert.notStrictEqual(H2.analyzeUPI('sbi-refund-care@paytmx').verdict, 'safe');
  assert.strictEqual(H2.analyzeUPI('nonsense').ok, false);
});
test('headers: failures and reply-to mismatch', () => {
  const h = 'From: "HDFC Bank" <alerts@hdfc-secure.top>\nReply-To: <help@gmail.com>\nAuthentication-Results: mx.google.com; spf=fail smtp.mailfrom=hdfc-secure.top; dkim=none; dmarc=fail\nSubject: Update KYC';
  const r = H2.analyzeHeaders(h);
  assert.strictEqual(r.verdict, 'phishing');
  assert.strictEqual(r.status.spf, 'fail');
  const ok = H2.analyzeHeaders('From: Google <no-reply@accounts.google.com>\nAuthentication-Results: mx.google.com; spf=pass; dkim=pass; dmarc=pass');
  assert.strictEqual(ok.verdict, 'safe');
});
test('hindi cues', () => {
  assert.notStrictEqual(H2.analyzeMessage('आपका खाता आज बंद हो जाएगा, केवाईसी अपडेट करें').verdict, 'safe');
});

const { secretInUrl } = require('../public/heuristics.js');
test('secretInUrl: flags token-bearing links', () => {
  for (const u of [
    'https://app.example.com/reset-password?token=9f8a7c6b5d4e3f2a1b0c',
    'https://example.com/verify?code=482913&email=a@b.com',
    'https://example.com/cb#access_token=abcdef123456',
    'https://example.com/x?session=abc12345',
    'https://user:pass@example.com/',
    'https://example.com/path?ref=Ab12Cd34Ef56Gh78Ij90Kl12Mn34',
    'https://example.com/reset/aB3dE5gH7jK9mN1pQ3sT5vX7zA9cE1',
  ]) assert.strictEqual(secretInUrl(u).risky, true, u);
});
test('secretInUrl: leaves ordinary links alone', () => {
  for (const u of ['https://www.google.com/search?q=hello+world', 'https://en.wikipedia.org/wiki/Phishing', 'sbi-kyc-update.xyz/login', 'https://example.com/?page=2&sort=asc', 'https://youtu.be/dQw4w9WgXcQ', '']) assert.strictEqual(secretInUrl(u).risky, false, u);
});

const { createLimiter } = require('../lib/ratelimit.js');
test('rate limiter: blocks after the limit, separates callers, recovers after the window', () => {
  let t = 1000; const l = createLimiter({ limit: 3, windowMs: 60000, now: () => t });
  for (let i = 0; i < 3; i++) assert.strictEqual(l.take('a').ok, true);
  const r = l.take('a'); assert.strictEqual(r.ok, false); assert.ok(r.retryAfter >= 1 && r.retryAfter <= 60);
  assert.strictEqual(l.take('b').ok, true);
  t += 60001; assert.strictEqual(l.take('a').ok, true);
});
test('handler: 429 with retry-after once a caller passes the cap, no ip means no limit', async () => {
  const { handleCheck, LIMITS } = require('../lib/handler.js');
  let last;
  for (let i = 0; i < 25; i++) last = await handleCheck({ urls: ['http://paypa1.com'] }, {}, { ip: '203.0.113.9' });
  for (let i = 0; i < 40 && last.status !== 429; i++) last = await handleCheck({ urls: ['http://paypa1.com'] }, {}, { ip: '203.0.113.9' });
  assert.strictEqual(last.status, 429); assert.ok(Number(last.headers['retry-after']) >= 1);
  const ok = await handleCheck({ urls: ['http://paypa1.com'] }, {}, { ip: '203.0.113.10' }); assert.strictEqual(ok.status, 200);
  const none = await handleCheck({ urls: ['http://paypa1.com'] }, {}); assert.strictEqual(none.status, 200);
});
