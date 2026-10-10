/* PhishGuard ML layer: logistic regression on host-level lexical features. Weights in model.json. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PhishML = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const KW = ['login','signin','secure','account','verify','update','bank','kyc','pay','wallet','free','bonus','support','service','confirm','webmail','online','official','portal','app'];
  function entropy(s) {
    const m = {}; for (const c of s) m[c] = (m[c] || 0) + 1;
    let e = 0; for (const k in m) { const p = m[k] / s.length; e -= p * Math.log2(p); } return e;
  }
  function hostOf(input) {
    let s = String(input || '').trim().toLowerCase().replace(/^[a-z][a-z0-9+.-]*:\/\//, '');
    s = s.split(/[/?#]/)[0].split('@').pop().replace(/:\d+$/, '').replace(/\.$/, '');
    return s;
  }
  // feature names (order matters, saved in model.json)
  function features(host, tlds) {
    const labels = host.split('.');
    const tld = labels[labels.length - 1];
    const sld = labels.length > 1 ? labels[labels.length - 2] : host;
    const flat = host.replace(/[.-]/g, '');
    const digits = (host.match(/\d/g) || []).length;
    const f = {
      len: Math.min(host.length, 80) / 80,
      sldlen: Math.min(sld.length, 30) / 30,
      labels: Math.min(labels.length, 7) / 7,
      digits: digits / Math.max(host.length, 1),
      hyphens: Math.min((host.match(/-/g) || []).length, 5) / 5,
      entropy: entropy(host) / 5,
      ip: /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ? 1 : 0,
      puny: host.includes('xn--') ? 1 : 0,
      digitrun: Math.min((host.match(/\d+/g) || ['']).reduce((m, x) => Math.max(m, x.length), 0), 8) / 8,
      vowelratio: ((sld.match(/[aeiou]/g) || []).length) / Math.max(sld.length, 1),
      kw: Math.min(KW.filter(k => flat.includes(k)).length, 4) / 4
    };
    for (const t of tlds) f['tld_' + t] = tld === t ? 1 : 0;
    return f;
  }
  function predict(model, input) {
    const host = hostOf(input);
    if (!host || !host.includes('.')) return null;
    const f = features(host, model.tlds);
    let z = model.bias;
    for (const k in model.weights) z += model.weights[k] * (f[k] || 0);
    const p = 1 / (1 + Math.exp(-z));
    return { probability: p, host };
  }
  return { features, predict, hostOf };
});
