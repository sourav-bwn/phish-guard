const API = 'https://phish-guard-seven-pi.vercel.app/api/check?url=';
const TITLES = { phishing: 'Likely phishing - do not open', suspicious: 'Suspicious - be careful', safe: 'No red flags found' };
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'pg-check', title: 'Check link with PhishGuard', contexts: ['link'] });
});
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== 'pg-check' || !info.linkUrl) return;
  try {
    const r = await fetch(API + encodeURIComponent(info.linkUrl));
    const j = await r.json();
    const top = (j.reasons && j.reasons[0] && j.reasons[0].en) || 'Nothing in the address looks wrong. That is not a guarantee.';
    chrome.notifications.create({ type: 'basic', iconUrl: 'icon128.png', title: TITLES[j.verdict] || 'PhishGuard', message: top.slice(0, 200) });
  } catch (e) {
    chrome.notifications.create({ type: 'basic', iconUrl: 'icon128.png', title: 'PhishGuard', message: 'Could not reach the checker. Try again.' });
  }
});
