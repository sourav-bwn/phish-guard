(function () {
  const I18N = {
    en: {
      title: "Got a link you don't trust?", sub: "Paste it here before you tap it. We never open the link.", label: 'Link to check',
      ph: 'Paste the link here', check: 'Check link', try: 'Try:', why: 'Why', dbs: 'Scam databases',
      fine: "No tool can promise a link is safe. If a message is rushing you about money, a bank, KYC or a prize, stop and call the company on its official number.",
      pat: 'Scams going around in India', help: 'Already clicked or paid?',
      h1: 'Call <a href="tel:1930">1930</a> (National Cyber Crime Helpline) right away. The first hour matters most for stopping a transfer.',
      h2: 'Report at <a href="https://cybercrime.gov.in" rel="noopener" target="_blank">cybercrime.gov.in</a>.',
      h3: 'Call your bank, block the card or UPI, and change passwords you typed on that page.',
      foot: 'Free and open source. Built for Hack for Social Cause - Digital Safety & Cyber Fraud Awareness.',
      empty: 'Paste a link first.', invalid: "That doesn't look like a link.",
      v_phishing: 'Likely phishing', v_suspicious: 'Suspicious', v_safe: 'No red flags found',
      d_phishing: 'Do not open this link or enter any details.', d_suspicious: 'Be careful. Do not enter OTP, PIN, passwords or card details.', d_safe: "Nothing in the address looks wrong. That is not a guarantee.",
      host: 'Site', none: 'No warning signs in the address itself.', official: 'This is a genuine {b} address.',
      db_flagged: 'FLAGGED', db_clear: 'not listed', db_skip: 'not configured', db_err: 'unavailable', db_wait: 'checking...',
      db_override: 'A scam database lists this link, so treat it as dangerous.'
    },
    bn: {
      title: 'সন্দেহজনক লিংক পেয়েছেন?', sub: 'ক্লিক করার আগে এখানে পেস্ট করুন। আমরা লিংকটি খুলি না।', label: 'যাচাই করার লিংক',
      ph: 'লিংকটি এখানে পেস্ট করুন', check: 'লিংক যাচাই করুন', try: 'চেষ্টা করুন:', why: 'কারণ', dbs: 'প্রতারণার ডেটাবেস',
      fine: 'কোনো টুলই লিংক নিরাপদ বলে গ্যারান্টি দিতে পারে না। টাকা, ব্যাংক, KYC বা পুরস্কারের কথা বলে তাড়া দিলে থামুন, এবং কোম্পানির সরকারি নম্বরে ফোন করে জেনে নিন।',
      pat: 'ভারতে যে প্রতারণাগুলো চলছে', help: 'ক্লিক বা পেমেন্ট করে ফেলেছেন?',
      h1: 'এখনই <a href="tel:1930">1930</a> (জাতীয় সাইবার ক্রাইম হেল্পলাইন) নম্বরে ফোন করুন। টাকা আটকাতে প্রথম এক ঘণ্টা সবচেয়ে গুরুত্বপূর্ণ।',
      h2: '<a href="https://cybercrime.gov.in" rel="noopener" target="_blank">cybercrime.gov.in</a>-এ অভিযোগ জানান।',
      h3: 'ব্যাংকে ফোন করে কার্ড বা UPI ব্লক করুন, আর ওই পেজে যে পাসওয়ার্ড দিয়েছেন তা বদলে ফেলুন।',
      foot: 'বিনামূল্যে ও ওপেন সোর্স। Hack for Social Cause - ডিজিটাল সুরক্ষা ও সাইবার প্রতারণা সচেতনতার জন্য তৈরি।',
      empty: 'আগে একটি লিংক পেস্ট করুন।', invalid: 'এটা লিংকের মতো দেখাচ্ছে না।',
      v_phishing: 'ফিশিং হওয়ার সম্ভাবনা বেশি', v_suspicious: 'সন্দেহজনক', v_safe: 'কোনো বিপদ-সংকেত পাওয়া যায়নি',
      d_phishing: 'এই লিংক খুলবেন না, কোনো তথ্যও দেবেন না।', d_suspicious: 'সাবধান। OTP, PIN, পাসওয়ার্ড বা কার্ডের তথ্য দেবেন না।', d_safe: 'ঠিকানায় সন্দেহজনক কিছু নেই। তবে এটা গ্যারান্টি নয়।',
      host: 'সাইট', none: 'ঠিকানায় কোনো সতর্কতা-চিহ্ন নেই।', official: 'এটি {b}-এর আসল ঠিকানা।',
      db_flagged: 'চিহ্নিত', db_clear: 'তালিকায় নেই', db_skip: 'চালু নেই', db_err: 'পাওয়া যায়নি', db_wait: 'যাচাই চলছে...',
      db_override: 'একটি প্রতারণা-ডেটাবেসে এই লিংক আছে, তাই এটিকে বিপজ্জনক ধরুন।'
    }
  };
  const PATTERNS = [
    { en: ['"Your KYC has expired"', 'SMS or WhatsApp says your bank account will be blocked today unless you update KYC through a link or app.', 'Banks never ask you to update KYC through a link in a message. Visit the branch or the official app.'],
      bn: ['"আপনার KYC শেষ হয়ে গেছে"', 'SMS বা WhatsApp-এ বলা হয় আজই KYC আপডেট না করলে ব্যাংক অ্যাকাউন্ট বন্ধ হবে, সঙ্গে একটি লিংক বা অ্যাপ।', 'ব্যাংক কখনও মেসেজের লিংকে KYC আপডেট করতে বলে না। শাখায় যান বা সরকারি অ্যাপ ব্যবহার করুন।'] },
    { en: ['UPI "collect" request', 'Someone says they sent you money by mistake or you won a refund, then asks you to approve a request or enter your PIN.', 'You never enter a PIN to receive money. A PIN is only for sending.'],
      bn: ['UPI "কালেক্ট" রিকোয়েস্ট', 'কেউ বলে ভুল করে টাকা পাঠিয়েছে বা রিফান্ড পাবেন, তারপর রিকোয়েস্ট অ্যাপ্রুভ করতে বা PIN দিতে বলে।', 'টাকা পেতে কখনও PIN লাগে না। PIN শুধু টাকা পাঠানোর সময় লাগে।'] },
    { en: ['Electricity bill disconnection', 'A message says your power will be cut tonight unless you pay or call a number. The "officer" then makes you install a screen-sharing app.', 'Check your bill on the official supplier website or app. Never install an app a caller asks for.'],
      bn: ['বিদ্যুৎ বিল কেটে দেওয়ার হুমকি', 'মেসেজে বলা হয় আজ রাতে বিদ্যুৎ কেটে দেওয়া হবে, টাকা দিন বা এই নম্বরে ফোন করুন। তারপর "অফিসার" স্ক্রিন-শেয়ারিং অ্যাপ ইনস্টল করতে বলে।', 'সরকারি ওয়েবসাইট বা অ্যাপে বিল দেখুন। ফোনে বলা কোনো অ্যাপ কখনও ইনস্টল করবেন না।'] },
    { en: ['Fake bank APK', 'A WhatsApp message sends a file like "SBI_Reward.apk" to claim points or cashback.', 'Install apps only from Google Play. These files can read your SMS and OTPs.'],
      bn: ['নকল ব্যাংক APK', 'WhatsApp-এ "SBI_Reward.apk" জাতীয় ফাইল পাঠিয়ে পয়েন্ট বা ক্যাশব্যাক নিতে বলা হয়।', 'অ্যাপ শুধু Google Play থেকে নিন। এই ফাইলগুলো আপনার SMS ও OTP পড়ে নিতে পারে।'] },
    { en: ['Lottery and "KBC" prizes', 'You "won" a prize, car or lakhs of rupees, and must pay a small fee first.', 'Real prizes do not ask for money in advance. If you did not enter, you did not win.'],
      bn: ['লটারি ও "KBC" পুরস্কার', 'আপনি নাকি গাড়ি বা লক্ষ টাকা জিতেছেন, কিন্তু আগে সামান্য ফি দিতে হবে।', 'আসল পুরস্কারে আগাম টাকা চায় না। আপনি অংশ না নিলে জেতার প্রশ্নই নেই।'] },
    { en: ['Part-time job and task scams', 'A WhatsApp or Telegram "recruiter" offers easy money for liking videos or rating products, then asks you to deposit money to continue.', 'A real job never asks you to pay to work.'],
      bn: ['পার্ট-টাইম চাকরি ও টাস্ক প্রতারণা', 'WhatsApp বা Telegram-এ "রিক্রুটার" ভিডিও লাইক বা প্রোডাক্ট রেটিং করে সহজে আয়ের কথা বলে, পরে কাজ চালাতে টাকা জমা দিতে বলে।', 'আসল চাকরিতে কাজ করতে টাকা দিতে হয় না।'] },
    { en: ['Fake courier or India Post notice', 'Your parcel is "held" and you must pay a small redelivery fee on a link.', 'Check tracking on the courier\'s own app or site. A small fee is a way to get your card details.'],
      bn: ['নকল কুরিয়ার বা ইন্ডিয়া পোস্ট নোটিশ', 'আপনার পার্সেল "আটকে আছে", লিংকে সামান্য রিডেলিভারি ফি দিতে হবে।', 'কুরিয়ারের নিজস্ব অ্যাপ বা সাইটে ট্র্যাক করুন। ছোট ফি আসলে কার্ডের তথ্য নেওয়ার ফাঁদ।'] },
    { en: ['QR code to "receive" money', 'A buyer on a marketplace asks you to scan a QR code to receive payment.', 'Scanning a QR always sends money out. Receiving never needs a scan.'],
      bn: ['টাকা "পেতে" QR কোড স্ক্যান', 'অনলাইনে ক্রেতা বলে পেমেন্ট পেতে QR কোড স্ক্যান করুন।', 'QR স্ক্যান করলে সবসময় টাকা বেরিয়ে যায়। টাকা পেতে স্ক্যান লাগে না।'] }
  ];

  const $ = (s) => document.querySelector(s);
  let lang = localStorage.getItem('pg-lang') || ((navigator.language || '').toLowerCase().startsWith('bn') ? 'bn' : 'en');
  let lastRun = null;
  const t = (k) => I18N[lang][k];

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $('#patterns').innerHTML = PATTERNS.map(p => { const x = p[lang]; return '<article class="pat"><h4>' + esc(x[0]) + '</h4><p>' + esc(x[1]) + '</p><p class="tip">' + esc(x[2]) + '</p></article>'; }).join('');
    if (lastRun) render(lastRun);
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function render(run) {
    const r = run.local, ext = run.ext;
    let verdict = r.verdict;
    const flagged = ext && ext.some(e => e.flagged);
    if (flagged) verdict = 'phishing';
    const box = $('#result');
    box.hidden = false;
    box.className = 'card result ' + verdict;
    $('#badge').textContent = verdict === 'safe' ? '✓' : verdict === 'suspicious' ? '!' : '✕';
    $('#vtitle').textContent = t('v_' + verdict);
    $('#vdesc').textContent = flagged && r.verdict !== 'phishing' ? t('db_override') : t('d_' + verdict);
    $('#meterfill').style.width = Math.max(flagged ? 100 : r.score, 4) + '%';
    $('#hostline').textContent = t('host') + ': ' + (r.host || '-');
    const lis = r.flags.map(f => '<li>' + esc(f[lang]) + '</li>');
    if (!lis.length) lis.push('<li>' + esc(r.officialBrand ? t('official').replace('{b}', r.officialBrand.toUpperCase()) : t('none')) + '</li>');
    $('#reasons').innerHTML = lis.join('');
    const el = $('#ext');
    if (!ext) { el.innerHTML = '<li><span>…</span><span class="s">' + t('db_wait') + '</span></li>'; return; }
    el.innerHTML = ext.map(e => {
      let cls = '', txt;
      if (e.status === 'skipped') txt = t('db_skip');
      else if (e.status === 'error') txt = t('db_err');
      else if (e.flagged) { cls = 'bad'; txt = t('db_flagged'); }
      else { cls = 'ok'; txt = t('db_clear'); }
      return '<li><span>' + esc(e.name) + '</span><span class="s ' + cls + '">' + txt + '</span></li>';
    }).join('');
  }

  async function run(raw) {
    const err = $('#err'); err.hidden = true;
    const val = raw.trim();
    if (!val) { err.textContent = t('empty'); err.hidden = false; return; }
    const local = window.PhishHeuristics.analyze(val);
    if (!local.ok) { err.textContent = t('invalid'); err.hidden = false; return; }
    const btn = $('#go'); btn.disabled = true;
    lastRun = { local, ext: null };
    render(lastRun);
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    try {
      const r = await fetch('/api/check?url=' + encodeURIComponent(val));
      if (r.ok) { const j = await r.json(); lastRun = { local, ext: j.external || [] }; }
      else lastRun = { local, ext: [] };
    } catch (e) { lastRun = { local, ext: [] }; }
    render(lastRun);
    btn.disabled = false;
  }

  $('#form').addEventListener('submit', e => { e.preventDefault(); run($('#url').value); });
  document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => { $('#url').value = c.dataset.example; run(c.dataset.example); }));
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.lang; localStorage.setItem('pg-lang', lang); applyLang(); }));
  applyLang();
  const q = new URLSearchParams(location.search).get('u');
  if (q) { $('#url').value = q; run(q); }
})();
