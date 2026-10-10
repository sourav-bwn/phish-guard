const API = 'https://phish-guard-seven-pi.vercel.app/api/check?url=';
const u = document.getElementById('u'), out = document.getElementById('out'), go = document.getElementById('go');
chrome.tabs.query({ active: true, currentWindow: true }, t => { if (t[0] && /^https?:/.test(t[0].url || '')) u.value = t[0].url; });
async function check() {
  if (!u.value.trim()) return;
  go.disabled = true; out.textContent = '';
  try {
    const j = await (await fetch(API + encodeURIComponent(u.value.trim()))).json();
    if (j.error) { out.textContent = 'That does not look like a link.'; }
    else {
      const v = document.createElement('div'); v.className = 'v ' + j.verdict;
      v.textContent = { phishing: 'Likely phishing', suspicious: 'Suspicious', safe: 'No red flags found' }[j.verdict];
      const ul = document.createElement('ul');
      (j.reasons || []).slice(0, 4).forEach(r => { const li = document.createElement('li'); li.textContent = r.en; ul.appendChild(li); });
      out.append(v, ul);
    }
  } catch (e) { out.textContent = 'Could not reach the checker.'; }
  go.disabled = false;
}
go.addEventListener('click', check);
