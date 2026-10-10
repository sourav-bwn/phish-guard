(function () {
  const SB = 'https://btjwtngzanfxewslgqna.supabase.co', KEY = 'sb_publishable_2-Wf9sX11j9fY1t8LoLdgw_ASbcwHmo';
  const L = {
    en: { tab: 'Community', h: 'Report a scam', p: 'Anonymous. We store only the type, category and state. No link, number, name or IP address is saved.', kind: 'What was it?', scam: 'Scam type', region: 'Your state', send: 'Submit report', sending: 'Sending...', thanks: 'Thank you. Your report is counted.', limit: 'Too many reports from your network in the last hour. Try later.', fail: 'Could not send. Check your connection and try again.', stats: 'Reports from this community', total: 'Total reports', last7: 'Last 7 days', empty: 'No reports yet. Be the first.', bs: 'By scam type', br: 'Top states', bk: 'By channel', bd: 'Last 14 days', pick: 'Choose',
      kinds: { link: 'Link', message: 'SMS / WhatsApp message', phone: 'Phone call or number', upi: 'UPI request or ID', email: 'Email', qr: 'QR code' },
      scams: { bank_kyc: 'Bank / KYC update', upi_refund: 'UPI refund or collect request', lottery_prize: 'Lottery or prize', job_offer: 'Fake job offer', parcel_delivery: 'Parcel / delivery fee', investment: 'Investment or trading', impersonation: 'Officer / relative impersonation', loan_app: 'Loan app', other: 'Other' } },
    bn: { tab: 'কমিউনিটি', h: 'প্রতারণার রিপোর্ট করুন', p: 'নাম প্রকাশ হয় না। শুধু ধরন, বিভাগ আর রাজ্য জমা হয়। লিংক, নম্বর, নাম বা IP ঠিকানা রাখা হয় না।', kind: 'এটা কী ছিল?', scam: 'প্রতারণার ধরন', region: 'আপনার রাজ্য', send: 'রিপোর্ট জমা দিন', sending: 'পাঠানো হচ্ছে...', thanks: 'ধন্যবাদ। আপনার রিপোর্ট গোনা হয়েছে।', limit: 'গত এক ঘণ্টায় আপনার নেটওয়ার্ক থেকে অনেক রিপোর্ট এসেছে। পরে চেষ্টা করুন।', fail: 'পাঠানো যায়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।', stats: 'এই কমিউনিটির রিপোর্ট', total: 'মোট রিপোর্ট', last7: 'গত ৭ দিন', empty: 'এখনও কোনো রিপোর্ট নেই। প্রথম হোন।', bs: 'ধরন অনুযায়ী', br: 'শীর্ষ রাজ্য', bk: 'মাধ্যম অনুযায়ী', bd: 'গত ১৪ দিন', pick: 'বাছুন',
      kinds: { link: 'লিংক', message: 'SMS / WhatsApp মেসেজ', phone: 'ফোন কল বা নম্বর', upi: 'UPI অনুরোধ বা ID', email: 'ইমেল', qr: 'QR কোড' },
      scams: { bank_kyc: 'ব্যাংক / KYC আপডেট', upi_refund: 'UPI রিফান্ড বা কালেক্ট রিকোয়েস্ট', lottery_prize: 'লটারি বা পুরস্কার', job_offer: 'ভুয়া চাকরির অফার', parcel_delivery: 'পার্সেল / ডেলিভারি ফি', investment: 'বিনিয়োগ বা ট্রেডিং', impersonation: 'অফিসার / আত্মীয় সেজে', loan_app: 'লোন অ্যাপ', other: 'অন্যান্য' } }
  };
  const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Other UT','Not sure'];
  const lg = () => (localStorage.getItem('pg-lang') === 'bn' || (!localStorage.getItem('pg-lang') && (navigator.language || '').toLowerCase().startsWith('bn'))) ? 'bn' : 'en';
  const T = () => L[lg()];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tabs = document.querySelector('.tabs'); if (!tabs) return;
  const btn = document.createElement('button'); btn.type = 'button'; btn.setAttribute('role', 'tab'); btn.dataset.tab = 'rep'; btn.setAttribute('aria-selected', 'false');
  tabs.appendChild(btn);
  const panel = document.createElement('div'); panel.id = 'reppanel'; panel.dataset.panel = 'rep'; panel.hidden = true;
  tabs.parentNode.appendChild(panel);
  let loaded = false;
  function opts(map) { return '<option value="">' + esc(T().pick) + '</option>' + Object.keys(map).map(k => '<option value="' + k + '">' + esc(map[k]) + '</option>').join(''); }
  function draw(stats) {
    const t = T();
    const bars = (rows, map) => rows.length ? '<div class="bars">' + rows.map(r => { const max = rows[0].n || 1; return '<div class="bar"><span class="bl">' + esc(map ? (map[r.k] || r.k) : r.k) + '</span><span class="bt"><i style="width:' + Math.max(4, Math.round(r.n / max * 100)) + '%"></i></span><b>' + r.n + '</b></div>'; }).join('') + '</div>' : '';
    let s = '<h3>' + t.stats + '</h3>';
    if (!stats) s += '<p class="hint">…</p>';
    else if (!stats.total) s += '<p class="hint">' + t.empty + '</p>';
    else s += '<div class="kpis"><div><b>' + stats.total + '</b><span>' + t.total + '</span></div><div><b>' + stats.last7 + '</b><span>' + t.last7 + '</span></div></div><h4>' + t.bs + '</h4>' + bars(stats.by_scam, t.scams) + '<h4>' + t.br + '</h4>' + bars(stats.by_region) + '<h4>' + t.bk + '</h4>' + bars(stats.by_kind, t.kinds) + '<h4>' + t.bd + '</h4>' + bars(stats.by_day);
    panel.querySelector('#repstats').innerHTML = s;
  }
  let lastStats = null;
  function build() {
    const t = T(); btn.textContent = t.tab;
    const keep = ['repkind', 'repscam', 'repregion'].map(i => (panel.querySelector('#' + i) || {}).value || '');
    panel.innerHTML = '<h3>' + t.h + '</h3><p class="hint">' + t.p + '</p><form id="repform" class="repform"><label>' + t.kind + '<select id="repkind" required>' + opts(t.kinds) + '</select></label><label>' + t.scam + '<select id="repscam" required>' + opts(t.scams) + '</select></label><label>' + t.region + '<select id="repregion" required><option value="">' + esc(t.pick) + '</option>' + STATES.map(s => '<option>' + esc(s) + '</option>').join('') + '</select></label><div class="field"><button id="repgo" type="submit" class="primary"><span>' + t.send + '</span></button></div><p class="hint" id="repmsg" role="status" hidden></p></form><div id="repstats"></div>';
    ['repkind', 'repscam', 'repregion'].forEach((i, n) => { panel.querySelector('#' + i).value = keep[n]; });
    draw(lastStats);
    panel.querySelector('#repform').addEventListener('submit', submit);
  }
  async function rpc(name, body) {
    const r = await fetch(SB + '/rest/v1/rpc/' + name, { method: 'POST', headers: { apikey: KEY, 'content-type': 'application/json' }, body: JSON.stringify(body || {}) });
    if (!r.ok) throw new Error('http ' + r.status);
    return r.json();
  }
  async function load() { try { lastStats = await rpc('get_stats'); draw(lastStats); } catch (e) { panel.querySelector('#repstats').innerHTML = ''; } }
  async function submit(ev) {
    ev.preventDefault();
    const t = T(), g = panel.querySelector('#repgo'), m = panel.querySelector('#repmsg');
    const k = panel.querySelector('#repkind').value, s = panel.querySelector('#repscam').value, r = panel.querySelector('#repregion').value;
    if (!k || !s || !r) { panel.querySelector(!k ? '#repkind' : !s ? '#repscam' : '#repregion').focus(); return; }
    g.disabled = true; g.firstChild.textContent = t.sending; m.hidden = true;
    try {
      const res = await rpc('submit_report', { p_kind: k, p_scam: s, p_region: r });
      m.textContent = res.ok ? t.thanks : (res.error === 'rate_limited' ? t.limit : t.fail); m.hidden = false;
      if (res.ok) await load();
    } catch (e) { m.textContent = t.fail; m.hidden = false; }
    g.disabled = false; g.firstChild.textContent = t.send;
  }
  btn.addEventListener('click', () => { if (!loaded) { loaded = true; load(); } });
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setTimeout(build, 0)));
  build();
})();
