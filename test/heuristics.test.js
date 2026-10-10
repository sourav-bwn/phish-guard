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
