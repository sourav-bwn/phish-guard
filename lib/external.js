// Optional free reputation checks. Every check degrades to { status: 'skipped' | 'error' } and never throws.
// We never fetch the suspicious URL itself - only ask third-party databases about it.
const TIMEOUT = 4500;

async function withTimeout(url, opts) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT);
  try { return await fetch(url, Object.assign({}, opts, { signal: ctl.signal })); }
  finally { clearTimeout(t); }
}

async function safeBrowsing(url, env) {
  const key = env.GOOGLE_SAFE_BROWSING_KEY;
  if (!key) return { name: 'Google Safe Browsing', status: 'skipped', note: 'no API key configured' };
  try {
    const r = await withTimeout('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + encodeURIComponent(key), {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client: { clientId: 'phish-guard', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'], threatEntryTypes: ['URL'], threatEntries: [{ url }]
        }
      })
    });
    if (!r.ok) return { name: 'Google Safe Browsing', status: 'error', note: 'HTTP ' + r.status };
    const j = await r.json();
    const hit = j.matches && j.matches.length;
    return { name: 'Google Safe Browsing', status: 'ok', flagged: !!hit, detail: hit ? j.matches.map(m => m.threatType).join(', ') : null };
  } catch (e) { return { name: 'Google Safe Browsing', status: 'error', note: e.name === 'AbortError' ? 'timed out' : 'unreachable' }; }
}

async function phishTank(url, env) {
  try {
    const body = new URLSearchParams({ url: Buffer.from(url).toString('base64'), format: 'json' });
    if (env.PHISHTANK_APP_KEY) body.set('app_key', env.PHISHTANK_APP_KEY);
    const r = await withTimeout('https://checkurl.phishtank.com/checkurl/', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': 'phishtank/phish-guard' }, body
    });
    if (!r.ok) return { name: 'PhishTank', status: 'error', note: 'HTTP ' + r.status };
    const j = await r.json();
    const res = j.results || {};
    if (res.in_database && res.valid) return { name: 'PhishTank', status: 'ok', flagged: true, detail: 'verified phish', link: res.phish_detail_page };
    return { name: 'PhishTank', status: 'ok', flagged: false };
  } catch (e) { return { name: 'PhishTank', status: 'error', note: e.name === 'AbortError' ? 'timed out' : 'unavailable' }; }
}

async function urlscan(host, env) {
  try {
    const headers = env.URLSCAN_API_KEY ? { 'API-Key': env.URLSCAN_API_KEY } : {};
    const r = await withTimeout('https://urlscan.io/api/v1/search/?size=3&q=' + encodeURIComponent('page.domain:"' + host + '"'), { headers });
    if (!r.ok) return { name: 'urlscan.io', status: 'error', note: 'HTTP ' + r.status };
    const j = await r.json();
    const ids = (j.results || []).slice(0, 3).map(x => x._id);
    if (!ids.length) return { name: 'urlscan.io', status: 'ok', flagged: false, detail: 'no public scans of this domain yet' };
    const verdicts = await Promise.all(ids.map(async id => {
      try {
        const rr = await withTimeout('https://urlscan.io/api/v1/result/' + id + '/', { headers });
        if (!rr.ok) return null;
        const jj = await rr.json();
        return { id, malicious: !!(jj.verdicts && jj.verdicts.overall && jj.verdicts.overall.malicious) };
      } catch (e) { return null; }
    }));
    const bad = verdicts.find(v => v && v.malicious);
    return { name: 'urlscan.io', status: 'ok', flagged: !!bad, detail: bad ? 'a past scan of this domain was judged malicious' : null, link: bad ? 'https://urlscan.io/result/' + bad.id + '/' : null };
  } catch (e) { return { name: 'urlscan.io', status: 'error', note: e.name === 'AbortError' ? 'timed out' : 'unavailable' }; }
}

async function urlhaus(url, env) {
  const key = env.URLHAUS_AUTH_KEY;
  if (!key) return { name: 'URLhaus', status: 'skipped', note: 'no API key configured' };
  try {
    const r = await withTimeout('https://urlhaus-api.abuse.ch/v1/url/', {
      method: 'POST', headers: { 'Auth-Key': key, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ url })
    });
    if (!r.ok) return { name: 'URLhaus', status: 'error', note: 'HTTP ' + r.status };
    const j = await r.json();
    return { name: 'URLhaus', status: 'ok', flagged: j.query_status === 'ok', detail: j.query_status === 'ok' ? (j.threat || 'malware distribution') : null };
  } catch (e) { return { name: 'URLhaus', status: 'error', note: 'unavailable' }; }
}

async function checkAll(url, host, env) {
  return Promise.all([safeBrowsing(url, env), phishTank(url, env), urlscan(host, env), urlhaus(url, env)]);
}
module.exports = { checkAll };
