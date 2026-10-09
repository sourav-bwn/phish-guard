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
