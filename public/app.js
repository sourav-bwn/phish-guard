(function () {
  const I18N = {
    en: {
      title: "Got a link you don't trust?", sub: "Paste it here before you tap it. We never open the link.", label: 'Link to check',
      ph: 'Paste the link here', check: 'Check link', try: 'Try:', why: 'Why', dbs: 'Scam databases',
      fine: "No tool can promise a link is safe. If a message is rushing you about money, a bank, KYC or a prize, stop and call the company on its official number.",
      pat: 'Scams going around in India', help: 'Already clicked or paid?',
      h1: 'Call <a href="tel:1930">1930</a> (National Cyber Crime Helpline) right away. The sooner you report, the better the chance the money can be held.',
      h2: 'Report at <a href="https://cybercrime.gov.in" rel="noopener" target="_blank">cybercrime.gov.in</a>.',
      h3: 'Call your bank, block the card or UPI, and change passwords you typed on that page.',
      foot: 'Free and open source. Built for Hack for Social Cause - Digital Safety & Cyber Fraud Awareness.',
      t_link: 'Link', t_msg: 'Message', t_bulk: 'Bulk', qr: 'Scan a QR image', msglabel: 'Message to check', msgph: 'Paste the whole SMS or WhatsApp message', check_msg: 'Check message', msgex: 'Try a sample scam SMS',
      bulklabel: 'Links, one per line', bulkph: 'One link per line (up to 50)', check_bulk: 'Check all', csvin: 'Load .txt / .csv', csv: 'Download CSV', print: 'Print report',
      col_link: 'Link', col_verdict: 'Verdict', col_score: 'Score', col_top: 'Main reason', links_found: 'Links in this message', msg_none: 'No link in this message, judged on wording only.',
      bulk_title: '{n} links checked: {p} phishing, {s} suspicious, {k} no red flags', bulk_empty: 'Paste at least one link.', msg_empty: 'Paste a message first.', qr_none: 'No QR code found in that image.', qr_fail: 'Could not read that image.', qr_found: 'QR contains:',
      sample: 'Dear customer, your SBI account will be blocked today. Update KYC immediately: http://sbi-kyc-update.xyz/login',
      t_shot: 'Screenshot', t_num: 'Number / UPI', t_mail: 'Email', share: 'Share verdict card',
      shot_hint: 'Upload a screenshot of the SMS or WhatsApp chat. The text is read on your phone, the image is never uploaded.', shot_pick: 'Choose screenshot', shot_load: 'Loading text reader ({p}%)...', shot_read: 'Reading text ({p}%)...', shot_none: 'No readable text found in that image.', shot_fail: 'Could not read that image.',
      num_label: 'Phone number or UPI ID', num_ph: '+91 98765 43210 or name@okaxis', num_check: 'Check', num_hint: 'Checks the format and warning signs only. There is no free public list of scam numbers or UPI IDs, so "no red flags" does not mean trusted.', num_bad: 'That is not a phone number or UPI ID.',
      mail_label: 'Raw email headers', mail_ph: 'Paste the full email headers (Show original / View source)', mail_check: 'Check headers', mail_bad: 'That does not look like email headers.',
      ml: 'Pattern model', ml_txt: '{p}% phishing-like', ml_note: 'Advisory only', subj_phone: 'Number', subj_upi: 'UPI ID', subj_mail: 'Sender',
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
      h1: 'এখনই <a href="tel:1930">1930</a> (জাতীয় সাইবার ক্রাইম হেল্পলাইন) নম্বরে ফোন করুন। যত তাড়াতাড়ি জানাবেন, টাকা আটকানোর সম্ভাবনা তত বেশি।',
      h2: '<a href="https://cybercrime.gov.in" rel="noopener" target="_blank">cybercrime.gov.in</a>-এ অভিযোগ জানান।',
      h3: 'ব্যাংকে ফোন করে কার্ড বা UPI ব্লক করুন, আর ওই পেজে যে পাসওয়ার্ড দিয়েছেন তা বদলে ফেলুন।',
      foot: 'বিনামূল্যে ও ওপেন সোর্স। Hack for Social Cause - ডিজিটাল সুরক্ষা ও সাইবার প্রতারণা সচেতনতার জন্য তৈরি।',
      t_link: 'লিংক', t_msg: 'মেসেজ', t_bulk: 'একসাথে', qr: 'QR ছবি স্ক্যান', msglabel: 'যাচাই করার মেসেজ', msgph: 'পুরো SMS বা WhatsApp মেসেজ পেস্ট করুন', check_msg: 'মেসেজ যাচাই করুন', msgex: 'নমুনা প্রতারণার SMS',
      bulklabel: 'প্রতি লাইনে একটি লিংক', bulkph: 'প্রতি লাইনে একটি লিংক (সর্বোচ্চ ৫০)', check_bulk: 'সব যাচাই করুন', csvin: '.txt / .csv লোড', csv: 'CSV ডাউনলোড', print: 'রিপোর্ট প্রিন্ট',
      col_link: 'লিংক', col_verdict: 'ফল', col_score: 'স্কোর', col_top: 'প্রধান কারণ', links_found: 'এই মেসেজের লিংকগুলো', msg_none: 'মেসেজে কোনো লিংক নেই, শুধু ভাষা দেখে বিচার করা হয়েছে।',
      bulk_title: '{n}টি লিংক যাচাই: {p}টি ফিশিং, {s}টি সন্দেহজনক, {k}টিতে বিপদ-সংকেত নেই', bulk_empty: 'অন্তত একটি লিংক পেস্ট করুন।', msg_empty: 'আগে একটি মেসেজ পেস্ট করুন।', qr_none: 'ছবিতে কোনো QR কোড পাওয়া যায়নি।', qr_fail: 'ছবিটি পড়া গেল না।', qr_found: 'QR-এ আছে:',
      sample: 'প্রিয় গ্রাহক, আপনার SBI অ্যাকাউন্ট আজই বন্ধ হয়ে যাবে। এখনই KYC আপডেট করুন: http://sbi-kyc-update.xyz/login',
      t_shot: 'স্ক্রিনশট', t_num: 'নম্বর / UPI', t_mail: 'ইমেইল', share: 'ভার্ডিক্ট কার্ড শেয়ার',
      shot_hint: 'SMS বা WhatsApp চ্যাটের স্ক্রিনশট দিন। লেখা আপনার ফোনেই পড়া হয়, ছবি কোথাও আপলোড হয় না।', shot_pick: 'স্ক্রিনশট বেছে নিন', shot_load: 'লেখা পড়ার টুল লোড হচ্ছে ({p}%)...', shot_read: 'লেখা পড়া হচ্ছে ({p}%)...', shot_none: 'ছবিতে পড়ার মতো লেখা পাওয়া যায়নি।', shot_fail: 'ছবিটি পড়া গেল না।',
      num_label: 'ফোন নম্বর বা UPI আইডি', num_ph: '+91 98765 43210 বা name@okaxis', num_check: 'যাচাই', num_hint: 'শুধু ফরম্যাট ও সতর্কতা-চিহ্ন দেখা হয়। প্রতারক নম্বর বা UPI আইডির কোনো বিনামূল্যের সরকারি তালিকা নেই, তাই "বিপদ-সংকেত নেই" মানে ভরসাযোগ্য নয়।', num_bad: 'এটা ফোন নম্বর বা UPI আইডি নয়।',
      mail_label: 'ইমেইলের হেডার', mail_ph: 'পুরো ইমেইল হেডার পেস্ট করুন (Show original / View source)', mail_check: 'হেডার যাচাই', mail_bad: 'এটা ইমেইল হেডারের মতো নয়।',
      ml: 'প্যাটার্ন মডেল', ml_txt: '{p}% ফিশিং-ধাঁচের', ml_note: 'শুধু পরামর্শ', subj_phone: 'নম্বর', subj_upi: 'UPI আইডি', subj_mail: 'প্রেরক',
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
    if (typeof renderBulk === 'function' && bulkRows) renderBulk();
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function render(run) {
    if (run.mode === 'msg') return renderMsg(run);
    if (run.mode === 'simple') return renderSimple(run);
    $('#msgfound').hidden = true;
    const r = run.local, ext = run.ext;
    let verdict = r.verdict;
    const flagged = ext && ext.some(e => e.flagged && e.level !== 'warn');
    const warned = ext && ext.some(e => e.flagged && e.level === 'warn');
    if (warned && verdict === 'safe') verdict = 'suspicious';
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
      if (e.status === 'ok' && e.level === 'warn') { cls = e.flagged ? 'bad' : 'ok'; txt = (e.flagged ? '⚠ ' : '') + e.detail; }
      else if (e.status === 'skipped') txt = t('db_skip');
      else if (e.status === 'error') txt = t('db_err');
      else if (e.flagged) { cls = 'bad'; txt = t('db_flagged'); }
      else { cls = 'ok'; txt = t('db_clear'); }
      return '<li><span>' + esc(e.name) + '</span><span class="s ' + cls + '">' + txt + '</span></li>';
    }).join('') + (run.ml ? '<li><span>' + t('ml') + ' <small>(' + t('ml_note') + ')</small></span><span class="s ' + (run.ml.probability > 0.7 ? 'bad' : '') + '">' + t('ml_txt').replace('{p}', Math.round(run.ml.probability * 100)) + '</span></li>' : '');
  }


  function renderMsg(run) {
    const m = run.msg, verdict = m.verdict;
    const box = $('#result'); box.hidden = false; box.className = 'card result ' + verdict;
    $('#badge').textContent = verdict === 'safe' ? '✓' : verdict === 'suspicious' ? '!' : '✕';
    $('#vtitle').textContent = t('v_' + verdict);
    $('#vdesc').textContent = t('d_' + verdict);
    $('#meterfill').style.width = Math.max(m.score, 4) + '%';
    $('#hostline').textContent = '';
    const reasons = m.cues.map(c => '<li>' + esc(c[lang]) + '</li>');
    m.links.forEach(l => l.flags.slice(0, 2).forEach(f => reasons.push('<li><b>' + esc(l.host) + ':</b> ' + esc(f[lang]) + '</li>')));
    if (!reasons.length) reasons.push('<li>' + esc(t('none')) + '</li>');
    $('#reasons').innerHTML = reasons.join('');
    $('#msgfound').hidden = false;
    $('#msglinks').innerHTML = m.links.length ? m.links.map(l => '<li><span class="lk">' + esc(l.input) + '</span><span class="pill ' + l.verdict + '">' + t('v_' + l.verdict) + '</span></li>').join('') : '<li><span>' + esc(t('msg_none')) + '</span></li>';
    $('#ext').innerHTML = '';
  }
  function showErr(id, k) { const e = $(id); e.textContent = t(k); e.hidden = false; }
  function setTab(tab) {
    document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    document.querySelectorAll('[data-panel]').forEach(el => { el.hidden = el.dataset.panel !== tab; });
    $('#result').hidden = true; $('#bulkresult').hidden = true; lastRun = null; bulkRows = null;
  }
  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
  $('#msggo').addEventListener('click', () => {
    $('#msgerr').hidden = true;
    const m = window.PhishHeuristics.analyzeMessage($('#msg').value);
    if (!m.ok) return showErr('#msgerr', 'msg_empty');
    lastRun = { mode: 'msg', msg: m }; render(lastRun);
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('#msgex').addEventListener('click', () => { $('#msg').value = t('sample'); $('#msggo').click(); });

  // Bulk
  let bulkRows = null;
  function bulkInput(text) {
    return String(text || '').split(/\r?\n/).map(x => x.split(',')[0].trim().replace(/^"|"$/g, '')).filter(x => x && !/^(url|link|#)/i.test(x)).slice(0, 50);
  }
  $('#bulkfile').addEventListener('change', async e => { const f = e.target.files[0]; if (f) $('#bulk').value = (await f.text()).slice(0, 20000); });
  $('#bulkgo').addEventListener('click', () => {
    $('#bulkerr').hidden = true;
    const lines = bulkInput($('#bulk').value);
    if (!lines.length) return showErr('#bulkerr', 'bulk_empty');
    bulkRows = lines.map(l => ({ input: l, r: window.PhishHeuristics.analyze(l) }));
    renderBulk(); $('#bulkresult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  function renderBulk() {
    if (!bulkRows) return;
    const c = { phishing: 0, suspicious: 0, safe: 0 };
    bulkRows.forEach(x => { if (x.r.ok) c[x.r.verdict]++; });
    $('#bulkresult').hidden = false;
    $('#bulktitle').textContent = t('bulk_title').replace('{n}', bulkRows.length).replace('{p}', c.phishing).replace('{s}', c.suspicious).replace('{k}', c.safe);
    $('#bulktable tbody').innerHTML = bulkRows.map((x, i) => x.r.ok
      ? '<tr><td>' + (i + 1) + '</td><td class="l">' + esc(x.input) + '</td><td><span class="pill ' + x.r.verdict + '">' + t('v_' + x.r.verdict) + '</span></td><td>' + x.r.score + '</td><td>' + esc(x.r.flags[0] ? x.r.flags[0][lang] : '-') + '</td></tr>'
      : '<tr><td>' + (i + 1) + '</td><td class="l">' + esc(x.input) + '</td><td colspan="3">' + esc(t('invalid')) + '</td></tr>').join('');
  }
  function csvCell(v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  $('#csvbtn').addEventListener('click', () => {
    const rows = [['link', 'verdict', 'score', 'domain', 'reasons']].concat(bulkRows.map(x => x.r.ok ? [x.input, x.r.verdict, x.r.score, x.r.host, x.r.flags.map(f => f.en).join(' | ')] : [x.input, 'invalid', '', '', '']));
    const blob = new Blob(['\ufeff' + rows.map(r => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'phishguard-report.csv'; document.body.appendChild(a); a.click(); a.remove();
  });
  $('#printbtn').addEventListener('click', () => window.print());
  $('#printone').addEventListener('click', () => window.print());

  // QR
  $('#qrbtn').addEventListener('click', () => $('#qrfile').click());
  $('#qrfile').addEventListener('change', async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    $('#err').hidden = true;
    try {
      const bmp = await createImageBitmap(f);
      let text = null;
      if ('BarcodeDetector' in window) {
        const res = await new BarcodeDetector({ formats: ['qr_code'] }).detect(bmp);
        if (res[0]) text = res[0].rawValue;
      } else {
        await loadJsQR();
        const cv = document.createElement('canvas'); cv.width = bmp.width; cv.height = bmp.height;
        const cx = cv.getContext('2d'); cx.drawImage(bmp, 0, 0);
        const d = cx.getImageData(0, 0, cv.width, cv.height);
        const q = window.jsQR(d.data, d.width, d.height);
        if (q) text = q.data;
      }
      if (!text) return showErr('#err', 'qr_none');
      $('#url').value = text; run(text);
    } catch (err) { showErr('#err', 'qr_fail'); }
  });
  function loadJsQR() {
    return new Promise((ok, no) => { if (window.jsQR) return ok(); const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'; sc.onload = ok; sc.onerror = no; document.head.appendChild(sc); });
  }

  // ML advisory
  let modelP = null;
  function mlPredict(val) {
    if (!window.PhishML) return Promise.resolve(null);
    modelP = modelP || fetch('model.json').then(r => r.json()).catch(() => null);
    return modelP.then(m => m ? window.PhishML.predict(m, val) : null);
  }

  // Simple results: phone, UPI, email headers
  function renderSimple(run) {
    const r = run.res, verdict = r.verdict;
    const box = $('#result'); box.hidden = false; box.className = 'card result ' + verdict;
    $('#msgfound').hidden = true;
    $('#badge').textContent = verdict === 'safe' ? '✓' : verdict === 'suspicious' ? '!' : '✕';
    $('#vtitle').textContent = t('v_' + verdict);
    $('#vdesc').textContent = t('d_' + verdict);
    $('#meterfill').style.width = Math.max(r.score, 4) + '%';
    $('#hostline').textContent = t(run.subj) + ': ' + run.label;
    $('#reasons').innerHTML = r.flags.length ? r.flags.map(f => '<li>' + esc(f[lang]) + '</li>').join('') : '<li>' + esc(t('none')) + '</li>';
    $('#ext').innerHTML = run.status ? Object.keys(run.status).map(k => '<li><span>' + k.toUpperCase() + '</span><span class="s ' + (['pass'].includes(run.status[k]) ? 'ok' : run.status[k] ? 'bad' : '') + '">' + esc(run.status[k] || '-') + '</span></li>').join('') : '';
  }
  function showSimple(res, subj, label, status) {
    lastRun = { mode: 'simple', res, subj, label, status }; render(lastRun);
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  $('#numgo').addEventListener('click', () => {
    $('#numerr').hidden = true;
    const v = $('#numin').value.trim();
    const isUpi = v.includes('@');
    const r = isUpi ? window.PhishHeuristics.analyzeUPI(v) : window.PhishHeuristics.analyzePhone(v);
    if (!r.ok) return showErr('#numerr', 'num_bad');
    showSimple(r, isUpi ? 'subj_upi' : 'subj_phone', isUpi ? r.id : r.display);
  });
  $('#numin').addEventListener('keydown', e => { if (e.key === 'Enter') $('#numgo').click(); });
  $('#mailgo').addEventListener('click', () => {
    $('#mailerr').hidden = true;
    const r = window.PhishHeuristics.analyzeHeaders($('#mailin').value);
    if (!r.ok) return showErr('#mailerr', 'mail_bad');
    showSimple(r, 'subj_mail', r.domain || r.from || '-', r.status);
  });

  // Screenshot OCR (Tesseract.js, runs in the browser)
  function loadScript(src) { return new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = src; sc.onload = ok; sc.onerror = no; document.head.appendChild(sc); }); }
  $('#shotbtn').addEventListener('click', () => $('#shotfile').click());
  $('#shotfile').addEventListener('change', async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    const st = $('#shotstatus'), btn = $('#shotbtn'); $('#shoterr').hidden = true;
    btn.disabled = true; st.hidden = false; st.textContent = t('shot_load').replace('{p}', 0);
    try {
      if (!window.Tesseract) await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
      const worker = await window.Tesseract.createWorker('eng+ben+hin', 1, { logger: m => {
        if (m.status === 'recognizing text') st.textContent = t('shot_read').replace('{p}', Math.round(m.progress * 100));
        else if (m.progress != null) st.textContent = t('shot_load').replace('{p}', Math.round(m.progress * 100));
      } });
      const { data } = await worker.recognize(f);
      await worker.terminate();
      const text = (data.text || '').trim().replace(/((?:https?:\/\/|www\.)\S*[-/.])\s*\n\s*(\S)/g, '$1$2');
      st.hidden = true;
      if (text.length < 8) { btn.disabled = false; return showErr('#shoterr', 'shot_none'); }
      const ta = $('#shottext'); ta.hidden = false; ta.value = text;
      const m = window.PhishHeuristics.analyzeMessage(text);
      lastRun = { mode: 'msg', msg: m }; render(lastRun);
      $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) { st.hidden = true; showErr('#shoterr', 'shot_fail'); }
    btn.disabled = false;
  });
  $('#shottext').addEventListener('input', () => {
    const m = window.PhishHeuristics.analyzeMessage($('#shottext').value);
    if (m.ok) { lastRun = { mode: 'msg', msg: m }; render(lastRun); }
  });

  // Shareable verdict card (PNG)
  $('#sharebtn').addEventListener('click', async () => {
    const verdict = (($('#result').className.match(/(safe|suspicious|phishing)/) || [])[1]) || 'safe';
    const col = { safe: '#4ade80', suspicious: '#fbbf24', phishing: '#f87171' }[verdict];
    const reasons = Array.from(document.querySelectorAll('#reasons li')).slice(0, 3).map(li => li.textContent);
    const subject = $('#hostline').textContent;
    const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = cv.getContext('2d'), font = 'system-ui, "Noto Sans Bengali", "Noto Sans Devanagari", sans-serif';
    g.fillStyle = '#0b0f14'; g.fillRect(0, 0, W, H);
    g.fillStyle = col; g.fillRect(0, 0, W, 18);
    g.fillStyle = '#e7edf4'; g.font = '600 44px ' + font; g.fillText('PhishGuard', 70, 120);
    g.fillStyle = col; g.beginPath(); g.arc(150, 330, 90, 0, 7); g.globalAlpha = .18; g.fill(); g.globalAlpha = 1;
    g.font = '700 110px ' + font; g.textAlign = 'center'; g.fillText(verdict === 'safe' ? '✓' : verdict === 'suspicious' ? '!' : '✕', 150, 365); g.textAlign = 'left';
    g.fillStyle = '#e7edf4'; g.font = '700 64px ' + font; wrap(g, $('#vtitle').textContent, 280, 320, W - 350, 76);
    g.fillStyle = '#8b99aa'; g.font = '400 34px ' + font; wrap(g, subject, 70, 520, W - 140, 44);
    g.fillStyle = '#e7edf4'; g.font = '400 38px ' + font;
    let y = 650; reasons.forEach(r => { y = wrap(g, '• ' + r, 70, y, W - 140, 50) + 28; });
    g.fillStyle = '#8b99aa'; g.font = '400 30px ' + font;
    wrap(g, lang === 'bn' ? 'আগে যাচাই করুন, তারপর ক্লিক করুন। প্রতারিত হলে ১৯৩০ নম্বরে ফোন করুন।' : 'Check before you tap. Scammed? Call 1930.', 70, H - 150, W - 140, 42);
    g.fillStyle = col; g.font = '600 32px ' + font; g.fillText(location.host, 70, H - 60);
    const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
    const file = new File([blob], 'phishguard-verdict.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], text: location.origin }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
  });
  function wrap(g, text, x, y, maxW, lh) {
    const words = String(text).split(/(\s+)/); let line = '';
    for (const w of words) { const test = line + w; if (g.measureText(test).width > maxW && line) { g.fillText(line.trim(), x, y); y += lh; line = w.trimStart(); } else line = test; }
    g.fillText(line.trim(), x, y); return y;
  }

  async function run(raw) {
    const err = $('#err'); err.hidden = true;
    const val = raw.trim();
    if (!val) { err.textContent = t('empty'); err.hidden = false; return; }
    const local = window.PhishHeuristics.analyze(val);
    if (!local.ok) { err.textContent = t('invalid'); err.hidden = false; return; }
    const btn = $('#go'); btn.disabled = true;
    const ml = await mlPredict(val);
    lastRun = { local, ext: null, ml };
    render(lastRun);
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    try {
      const r = await fetch('/api/check?url=' + encodeURIComponent(val));
      if (r.ok) { const j = await r.json(); lastRun = { local, ml, ext: j.external || [] }; }
      else lastRun = { local, ml, ext: [] };
    } catch (e) { lastRun = { local, ml, ext: [] }; }
    render(lastRun);
    btn.disabled = false;
  }

  $('#form').addEventListener('submit', e => { e.preventDefault(); run($('#url').value); });
  document.querySelectorAll('.chip[data-example]').forEach(c => c.addEventListener('click', () => { $('#url').value = c.dataset.example; run(c.dataset.example); }));
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.lang; localStorage.setItem('pg-lang', lang); applyLang(); }));
  applyLang();
  const q = new URLSearchParams(location.search).get('u');
  if (q) { $('#url').value = q; run(q); }
})();
