/* PhishGuard heuristics - runs in the browser and in Node. No dependencies. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PhishHeuristics = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const SHORTENERS = new Set(['bit.ly','bitly.com','tinyurl.com','t.co','goo.gl','is.gd','cutt.ly','rb.gy','shorturl.at','tiny.cc','ow.ly','rebrand.ly','s.id','t.ly','lnkd.in','buff.ly','v.gd','shorte.st','bl.ink','clck.ru','qr.ae','tr.im','soo.gd','x.co']);
  const RISKY_TLDS = new Set(['tk','ml','ga','cf','gq','xyz','top','click','link','icu','buzz','rest','cyou','sbs','cfd','work','support','zip','mov','vip','monster','quest','fit','loan','win','bid','men','date','party','review','country','stream','download','racing','cam','surf','uno']);
  const FREE_HOSTS = ['pages.dev','web.app','firebaseapp.com','blogspot.com','weebly.com','wixsite.com','netlify.app','vercel.app','github.io','glitch.me','000webhostapp.com','ngrok.io','ngrok-free.app','workers.dev','herokuapp.com','onrender.com','repl.co','godaddysites.com','webflow.io','framer.app','carrd.co'];
  const MULTI_SUFFIX = new Set(['co.in','org.in','net.in','gov.in','nic.in','ac.in','edu.in','res.in','gen.in','firm.in','ind.in','co.uk','org.uk','ac.uk','gov.uk','com.au','net.au','org.au','co.nz','co.za','com.br','com.bd','com.pk','com.np','co.jp','com.sg','com.my','com.cn','com.hk','com.tr','co.id']);
  // brand -> official registrable domains
  const BRANDS = {
    sbi: ['sbi.co.in','onlinesbi.sbi','onlinesbi.com','sbicard.com','sbilife.co.in','sbi.bank.in','yonosbi.com'],
    hdfc: ['hdfcbank.com','hdfc.com','hdfclife.com','hdfcergo.com','hdfcsec.com'],
    icici: ['icicibank.com','icicidirect.com','iciciprulife.com','icicilombard.com'],
    axis: ['axisbank.com','axismf.com'],
    kotak: ['kotak.com','kotak811.com'],
    pnb: ['pnbindia.in','netpnb.com'],
    paytm: ['paytm.com','paytmbank.com','paytm.in'],
    phonepe: ['phonepe.com'],
    googlepay: ['pay.google.com','gpay.app.goo.gl'],
    paypal: ['paypal.com','paypal.me'],
    amazon: ['amazon.in','amazon.com','amazon.co.uk','amazon.de','amazonaws.com','amzn.in','amzn.to'],
    flipkart: ['flipkart.com','fkrt.it','fkrt.cc'],
    google: ['google.com','google.co.in','goo.gl','gstatic.com','googleapis.com','youtube.com','gmail.com'],
    facebook: ['facebook.com','fb.com','fb.me','facebook.net'],
    instagram: ['instagram.com'],
    whatsapp: ['whatsapp.com','whatsapp.net','wa.me'],
    netflix: ['netflix.com'],
    microsoft: ['microsoft.com','live.com','office.com','microsoftonline.com','outlook.com','windows.com'],
    apple: ['apple.com','icloud.com'],
    irctc: ['irctc.co.in','irctc.com'],
    aadhaar: ['uidai.gov.in','aadhaar.gov.in'],
    uidai: ['uidai.gov.in'],
    incometax: ['incometax.gov.in','incometaxindia.gov.in'],
    epfo: ['epfindia.gov.in','epfo.gov.in'],
    jio: ['jio.com','ril.com'],
    airtel: ['airtel.in','airtel.com'],
    indiapost: ['indiapost.gov.in'],
    bsnl: ['bsnl.co.in'],
    swiggy: ['swiggy.com'],
    zomato: ['zomato.com'],
    myntra: ['myntra.com'],
    meesho: ['meesho.com']
  };
  const KEYWORDS = [
    ['kyc','KYC'],['otp','OTP'],['verify','verify'],['verification','verification'],['lucky','lucky'],['winner','winner'],['prize','prize'],['reward','reward'],['claim','claim'],['refund','refund'],['suspend','suspend'],['blocked','blocked'],['expire','expire'],['urgent','urgent'],['cashback','cashback'],['giftcard','gift card'],['freegift','free gift'],['bonus','bonus'],['aadhaar','aadhaar'],['aadhar','aadhar'],['pancard','PAN card'],['upi','UPI'],['netbanking','net banking'],['signin','sign in'],['login','login'],['secure','secure'],['update','update'],['account','account'],['wallet','wallet'],['kbc','KBC'],['lottery','lottery'],['loan','loan'],['recharge','recharge'],['electricitybill','electricity bill'],['billpay','bill pay'],['customercare','customer care'],['helpline','helpline'],['support','support']
  ];
  const STRONG_KW = new Set(['kyc','otp','lucky','winner','prize','lottery','kbc','claim','refund','suspend','blocked','cashback','giftcard','freegift','aadhaar','aadhar','pancard','electricitybill','customercare','helpline']);

  const BN = {
    no_https: 'লিংকটি HTTPS ব্যবহার করে না - তথ্য সুরক্ষিত নয়।',
    ip_host: 'ডোমেইনের বদলে সরাসরি IP ঠিকানা ব্যবহার করা হয়েছে - আসল ব্যাংক বা কোম্পানি এটা করে না।',
    at_sign: 'লিংকে "@" চিহ্ন আছে - আসল ঠিকানা লুকানোর কৌশল হতে পারে।',
    punycode: 'ডোমেইনে বিশেষ (punycode) অক্ষর আছে - দেখতে আসল ডোমেইনের মতো, কিন্তু আলাদা হতে পারে।',
    shortener: 'এটি একটি শর্ট লিংক - ক্লিক না করা পর্যন্ত আসল গন্তব্য বোঝা যায় না।',
    risky_tld: 'এই ডোমেইন-শেষাংশ (TLD) প্রতারণায় বেশি দেখা যায়।',
    many_subdomains: 'ডোমেইনে অনেকগুলো সাবডোমেইন আছে - আসল নামটি মাঝখানে লুকানো থাকতে পারে।',
    long_url: 'লিংকটি অস্বাভাবিক রকম লম্বা।',
    many_hyphens: 'ডোমেইনে অনেক হাইফেন (-) আছে - নকল সাইটে এটা দেখা যায়।',
    odd_port: 'লিংকে অস্বাভাবিক পোর্ট নম্বর আছে।',
    free_host: 'সাইটটি বিনামূল্যের হোস্টিং সার্ভিসে তৈরি - প্রতারকরা প্রায়ই এগুলো ব্যবহার করে।',
    apk: 'লিংকটি একটি APK অ্যাপ ডাউনলোড করায় - প্লে স্টোরের বাইরের অ্যাপ ফোনের ক্ষতি করতে পারে।',
    redirect_param: 'লিংকের ভেতরে আরেকটি লিংক লুকানো আছে (রিডাইরেক্ট)।',
    bad_scheme: 'এই লিংক ব্রাউজারে কোড চালাতে চায় - খুবই বিপজ্জনক।',
    digits_in_label: 'ডোমেইনের নামে অনেক সংখ্যা মেশানো আছে।'
  };

  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  function deLeet(s) {
    return s.replace(/rn/g, 'm').replace(/vv/g, 'w').replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/\$/g, 's').replace(/4/g, 'a');
  }
  function registrable(host) {
    const parts = host.split('.');
    if (parts.length <= 2) return host;
    const last2 = parts.slice(-2).join('.');
    if (MULTI_SUFFIX.has(last2)) return parts.slice(-3).join('.');
    return last2;
  }
  function isOfficial(reg, host) {
    for (const k in BRANDS) for (const d of BRANDS[k]) {
      if (host === d || host.endsWith('.' + d) || reg === d) return k;
    }
    return null;
  }
  function isIPv4Like(h) {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(h) || /^0x[0-9a-f]+$/i.test(h) || /^\d{8,10}$/.test(h);
  }

  function parse(input) {
    let s = String(input || '').trim();
    if (!s) return null;
    if (/^(javascript|data|vbscript):/i.test(s)) return { bad: true, raw: s };
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = 'http://' + s.replace(/^\/+/, '');
    s = s.replace(/\s+/g, '');
    let u;
    try { u = new URL(s); } catch (e) { return null; }
    if (!u.hostname) return null;
    return { url: u, raw: input.trim(), assumedScheme: !/^[a-z][a-z0-9+.-]*:\/\//i.test(String(input).trim()) };
  }

  function analyze(input) {
    const p = parse(input);
    if (!p) return { ok: false, error: 'invalid' };
    const flags = [];
    const add = (id, weight, en, bn, extra) => flags.push(Object.assign({ id, weight, en, bn }, extra || {}));
    if (p.bad) {
      add('bad_scheme', 90, 'This link tries to run code in your browser instead of opening a website. Never open it.', BN.bad_scheme);
      return finish({ host: '', flags });
    }
    const u = p.url;
    const host = u.hostname.toLowerCase().replace(/\.$/, '');
    const reg = registrable(host);
    const labels = host.split('.');
    const tld = labels[labels.length - 1];
    const fullLower = (u.pathname + u.search + u.hash).toLowerCase();
    const hostFlat = host.replace(/[.-]/g, '');
    const official = isOfficial(reg, host);

    if (u.protocol === 'http:' && !p.assumedScheme) add('no_https', 12, 'The link does not use HTTPS, so anything you type can be intercepted.', BN.no_https);
    if (u.protocol === 'http:' && p.assumedScheme) { /* user typed no scheme; do not penalise */ }
    if (isIPv4Like(host) || host.startsWith('[')) add('ip_host', 35, 'The link uses a raw IP address instead of a website name. Real banks and shops do not do this.', BN.ip_host);
    if (u.username || u.password || /@/.test(String(input).split('?')[0].replace(/^[a-z]+:\/\//i, '').split('/')[0])) add('at_sign', 30, 'The link contains an "@" sign, a trick to hide the real destination.', BN.at_sign);
    if (labels.some(l => l.startsWith('xn--'))) add('punycode', 50, 'The domain uses special look-alike characters (punycode). It may look like a real site but is a different one.', BN.punycode);
    if (SHORTENERS.has(host) || SHORTENERS.has(reg)) add('shortener', 25, 'This is a shortened link. You cannot tell where it leads until you click, so scammers love them.', BN.shortener);
    if (RISKY_TLDS.has(tld) && !isIPv4Like(host)) add('risky_tld', 18, 'The ".' + tld + '" ending is very common on scam and throwaway websites.', BN.risky_tld);
    const subCount = labels.length - registrable(host).split('.').length;
    if (subCount >= 3) add('many_subdomains', 20, 'The address has many sub-parts (' + labels.length + ' levels). The real site name is the part just before the ending, and it may be hidden.', BN.many_subdomains);
    if ((host.replace(/xn--/g, '').match(/-/g) || []).length >= 3) add('many_hyphens', 14, 'The domain has lots of hyphens, a common pattern in fake sites.', BN.many_hyphens);
    const regLabel = reg.split('.')[0];
    if ((regLabel.match(/\d/g) || []).length >= 3 && !isIPv4Like(host)) add('digits_in_label', 10, 'The site name is mixed with many digits.', BN.digits_in_label);
    if (u.port && !['80', '443'].includes(u.port)) add('odd_port', 12, 'The link uses an unusual port number (' + u.port + ').', BN.odd_port);
    if ((u.href.length > 120)) add('long_url', 8, 'The link is unusually long.', BN.long_url);
    if (/\.apk(\?|$)/.test(u.pathname.toLowerCase())) add('apk', 40, 'The link downloads an APK app file. Fake "bank" or "KYC" apps sideloaded this way can read your SMS and empty your account.', BN.apk);
    if (/(^|[?&=])(https?%3a%2f%2f|https?:\/\/)/i.test(u.search) || /url=|redirect=|redir=|next=|dest=/i.test(u.search) && /https?(%3a|:)/i.test(u.search)) add('redirect_param', 15, 'Another link is hidden inside this one (a redirect). Scammers use this to borrow a trusted name.', BN.redirect_param);
    const onFree = FREE_HOSTS.find(d => host === d || host.endsWith('.' + d));
    if (onFree) add('free_host', 12, 'The page is on a free hosting service (' + onFree + '). Anyone can publish a page there, including scammers.', BN.free_host, { extra: onFree });

    // Brand impersonation
    let brandHit = null;
    if (!official) {
      const flat = deLeet(hostFlat);
      for (const b in BRANDS) {
        if (b.length < 4) {
          if (host.split(/[.-]/).includes(b)) { brandHit = { brand: b, kind: 'contains' }; break; }
          continue;
        }
        if (b.length >= 6 ? hostFlat.includes(b) : host.split(/[.-]/).includes(b)) { brandHit = { brand: b, kind: 'contains' }; break; }
        if (b.length >= 6 && flat.includes(b)) { brandHit = { brand: b, kind: 'typo' }; break; }
      }
      if (!brandHit) {
        const cleanLabel = deLeet(regLabel.replace(/-/g, ''));
        for (const b in BRANDS) {
          if (b.length < 4) continue;
          const d = levenshtein(cleanLabel, b);
          const hasLeet = /[0-9$]|rn|vv/.test(regLabel);
          if (d > 0 && d <= (b.length >= 7 ? 2 : 1) && (b.length >= 6 || hasLeet)) { brandHit = { brand: b, kind: 'typo' }; break; }
        }
      }
      if (!brandHit && regLabel !== regLabel.replace(/[01345$]/g, '') && false) {}
    }
    if (brandHit) {
      const nice = brandHit.brand.toUpperCase();
      const official1 = BRANDS[brandHit.brand][0];
      if (brandHit.kind === 'typo') add('lookalike', 56, 'The domain "' + reg + '" looks like ' + nice + ' (' + official1 + ') with small spelling changes. This is a classic look-alike trick.', 'ডোমেইন "' + reg + '" দেখতে ' + nice + ' (' + official1 + ')-এর মতো, কিন্তু বানানে সামান্য বদল - এটা নকল সাইটের পরিচিত কৌশল।', { brand: nice });
      else add('brand_abuse', 38, 'The address mentions "' + nice + '" but the site is not run by ' + nice + '. The real one is ' + official1 + '.', 'ঠিকানায় "' + nice + '" নাম আছে, কিন্তু সাইটটি ' + nice + '-এর নয়। আসল সাইট: ' + official1 + '।', { brand: nice });
    }
    // Keywords in host and path
    const hostKw = [], pathKw = [];
    for (const [k, label] of KEYWORDS) {
      if (hostFlat.includes(k)) hostKw.push([k, label]);
      else if (fullLower.replace(/[^a-z0-9]/g, '').includes(k)) pathKw.push([k, label]);
    }
    const kwAll = hostKw.concat(pathKw);
    if (kwAll.length && !official) {
      const strong = kwAll.filter(([k]) => STRONG_KW.has(k)).length;
      const weight = Math.min(30, strong * 12 + (kwAll.length - strong) * 5 + (hostKw.length ? 4 : 0));
      const names = kwAll.slice(0, 4).map(x => '"' + x[1] + '"').join(', ');
      add('keywords', weight, 'The link uses pressure or account words like ' + names + '. Scam messages lean on these.', 'লিংকে ' + names + ' জাতীয় শব্দ আছে - প্রতারণার মেসেজে এগুলো খুব দেখা যায়।');
    }
    // Combination boosts
    if (brandHit && flags.some(f => ['keywords', 'risky_tld', 'free_host', 'no_https'].includes(f.id))) add('combo', 12, 'A brand name together with other warning signs makes impersonation very likely.', 'ব্র্যান্ডের নামের সাথে আরও সন্দেহজনক লক্ষণ থাকায় নকল হওয়ার সম্ভাবনা অনেক বেশি।');
    if (official) {
      for (const f of flags) if (['keywords','brand_abuse'].includes(f.id)) f.weight = 0;
    }
    return finish({ host, registrable: reg, officialBrand: official, flags });
  }

  function finish(r) {
    const flags = r.flags.filter(f => f.weight > 0);
    const score = Math.min(100, flags.reduce((s, f) => s + f.weight, 0));
    let verdict = 'safe';
    if (score >= 55) verdict = 'phishing';
    else if (score >= 22) verdict = 'suspicious';
    flags.sort((a, b) => b.weight - a.weight);
    return Object.assign({}, r, { ok: true, flags, score, verdict });
  }


  // ---- Whole-message analysis ----
  const CUES = [
    [/(account|a\/c|card|sim|number).{0,40}(block|blocked|suspend|suspended|deactivat|closed|freeze|frozen|expire)/i, 22, 'Threatens to block or close your account', 'অ্যাকাউন্ট বা কার্ড বন্ধ করে দেওয়ার হুমকি'],
    [/(update|complete|verify|re-?verify).{0,25}\bkyc\b|\bkyc\b.{0,30}(update|expire|pending|incomplete|verify)/i, 28, 'Asks you to update or verify KYC', 'KYC আপডেট বা যাচাই করতে বলছে'],
    [/(share|send|tell|enter|give).{0,20}(otp|pin|cvv|password|passcode)/i, 30, 'Asks for your OTP, PIN, CVV or password. No bank ever does.', 'OTP, PIN, CVV বা পাসওয়ার্ড চাইছে। কোনো ব্যাংক এটা চায় না।'],
    [/(won|win|winner|lucky|selected|prize|lottery|jackpot|kbc)/i, 18, 'Claims you won a prize or were selected', 'আপনি পুরস্কার জিতেছেন বলে দাবি করছে'],
    [/(refund|cashback|reward|bonus).{0,40}(claim|click|link|credit|receive)|claim.{0,20}(refund|reward|cashback|bonus)/i, 18, 'Offers a refund, cashback or reward if you click', 'ক্লিক করলে রিফান্ড, ক্যাশব্যাক বা রিওয়ার্ডের লোভ দেখাচ্ছে'],
    [/(power|electricity|connection|supply).{0,40}(disconnect|cut|off|tonight|today)|(disconnect|cut).{0,40}(power|electricity)/i, 24, 'Electricity disconnection threat', 'বিদ্যুৎ সংযোগ কেটে দেওয়ার হুমকি'],
    [/(urgent|immediately|within\s+\d+\s*(hour|hr|min)|today\s+only|last\s+date|act\s+now|expires?\s+(today|soon|in))/i, 12, 'Creates urgency', 'তাড়াহুড়ো করানোর চেষ্টা'],
    [/(pay|deposit|send).{0,25}(small|nominal|registration|processing|redelivery|customs)\s*(fee|charge|amount)/i, 22, 'Asks for a small fee before you get something', 'কিছু পাওয়ার আগে সামান্য ফি চাইছে'],
    [/(download|install).{0,30}(apk|app).{0,30}(claim|reward|kyc|verify|update)|\.apk/i, 25, 'Pushes you to install an app outside Play Store', 'প্লে স্টোরের বাইরের অ্যাপ ইনস্টল করতে বলছে'],
    [/(part[- ]?time|work from home|earn).{0,40}(₹|rs\.?|inr)?\s*\d{3,6}.{0,20}(per|daily|day|hour)/i, 20, 'Too-good-to-be-true job offer', 'অবিশ্বাস্য আয়ের চাকরির প্রস্তাব'],
    [/(aapka|apka|aapke).{0,30}(account|khata|card).{0,20}(band|block)|turant|abhi\s+click|inaam|lottery\s+lagi/i, 20, 'Hinglish pressure phrases typical of scam SMS', 'হিন্দি-ইংরেজি মেশানো প্রতারণা-মেসেজের ধাঁচ'],
    [/(আপনার|আপনি).{0,40}(অ্যাকাউন্ট|একাউন্ট|কার্ড|সংযোগ).{0,40}(বন্ধ|ব্লক|কেটে)|কেওয়াইসি|কে ?ওয়াই ?সি|পুরস্কার|লটারি|বিদ্যুৎ.{0,30}(কেটে|বিচ্ছিন্ন)/, 24, 'Bengali scam wording (account block, KYC, prize, power cut)', 'বাংলায় প্রতারণার ভাষা (অ্যাকাউন্ট বন্ধ, KYC, পুরস্কার, বিদ্যুৎ কাটা)'],
    [/(?:dear|respected)\s+(customer|user|sir|madam|account\s*holder)|প্রিয় গ্রাহক/i, 8, 'Generic greeting instead of your name', 'আপনার নাম নয়, সাধারণ সম্বোধন'],
    [/(?:call|whatsapp|contact).{0,25}(\+?91[\s-]?)?[6-9]\d{9}/i, 10, 'Asks you to call or WhatsApp a mobile number', 'একটি মোবাইল নম্বরে ফোন বা WhatsApp করতে বলছে']
  ];
  const URL_RE = /(?:https?:\/\/|www\.)[^\s<>"'()]+|(?<![@\w.-])[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)*\.(?:com|in|co\.in|net|org|xyz|top|click|link|icu|buzz|cyou|sbs|cfd|vip|work|live|info|site|online|shop|store|app|apk|me|ly|gl|co|io|tk|ml|ga|cf|gq|zip|mov)\b(?:\/[^\s<>"'()]*)?/gi;
  const UPI_RE = /\b[a-z0-9._-]{2,}@(?:ok(?:axis|hdfcbank|icici|sbi)|ybl|ibl|axl|paytm|upi|apl|sbi|icici|hdfcbank|pnb|barodampay|fbl|aubank)\b/gi;

  function extractLinks(text) {
    const out = [];
    const seen = new Set();
    const t = String(text || '');
    const upis = new Set((t.match(UPI_RE) || []).map(x => x.toLowerCase()));
    for (let m of (t.match(URL_RE) || [])) {
      m = m.replace(/[.,;:!?)\]}>]+$/, '');
      if (upis.has(m.toLowerCase())) continue;
      if (/^[^/]*@/.test(m) && !/^https?:/i.test(m)) continue; // email address
      const k = m.toLowerCase();
      if (!seen.has(k)) { seen.add(k); out.push(m); }
    }
    return out.slice(0, 50);
  }

  function analyzeMessage(text) {
    const t = String(text || '').trim();
    if (!t) return { ok: false, error: 'empty' };
    const links = extractLinks(t).map(l => Object.assign({ input: l }, analyze(l))).filter(r => r.ok);
    const cues = [];
    for (const [re, w, en, bn] of CUES) if (re.test(t)) cues.push({ id: 'cue', weight: w, en, bn });
    const upis = Array.from(new Set((t.match(UPI_RE) || []).map(x => x.toLowerCase())));
    if (upis.length) cues.push({ id: 'upi', weight: 10, en: 'Contains a UPI ID (' + upis.slice(0, 2).join(', ') + '). Never pay someone just because a message told you to.', bn: 'UPI আইডি আছে (' + upis.slice(0, 2).join(', ') + ')। মেসেজে বলা হয়েছে বলেই কাউকে টাকা পাঠাবেন না।' });
    const cueScore = cues.reduce((s, c) => s + c.weight, 0);
    const worstLink = links.reduce((m, l) => Math.max(m, l.score), 0);
    let score = Math.min(100, Math.round(worstLink * 0.8 + cueScore * (links.length ? 1 : 0.9)));
    if (cues.length >= 3 && links.length) score = Math.max(score, 60);
    cues.sort((a, b) => b.weight - a.weight);
    const verdict = score >= 55 ? 'phishing' : score >= 22 ? 'suspicious' : 'safe';
    return { ok: true, score, verdict, cues, links, upis };
  }

  // ---- Hindi cues (Devanagari + romanised) ----
  CUES.push(
    [/(आपका|आपके).{0,40}(खाता|अकाउंट|कार्ड|सिम|बिजली).{0,40}(बंद|ब्लॉक|कट|रद्द)|केवाईसी|के\s?वाई\s?सी|इनाम|लॉटरी|बधाई.{0,30}(जीत|इनाम)/, 24, 'Hindi scam wording (account block, KYC, prize, power cut)', 'হিন্দিতে প্রতারণার ভাষা (অ্যাকাউন্ট বন্ধ, KYC, পুরস্কার, বিদ্যুৎ কাটা)'],
    [/(ओटीपी|पिन|सीवीवी|पासवर्ड).{0,20}(बताएं|भेजें|शेयर|दें)|(बताएं|भेजें|शेयर).{0,20}(ओटीपी|पिन)/, 30, 'Hindi: asks for OTP or PIN', 'হিন্দিতে OTP বা PIN চাইছে'],
    [/(kyc|pan|aadhaar|aadhar).{0,30}(update|expire|band|verify|link)\s*(karo|kare|karein|kijiye|nahi)|(otp|pin)\s*(batao|bhejo|share\s*karo|dijiye)|bijli.{0,20}(kat|band)/i, 26, 'Hinglish: KYC/OTP/power-cut pressure', 'হিন্দি-ইংরেজি মেশানো: KYC/OTP/বিদ্যুৎ কাটার চাপ']
  );

  // ---- Phone number checker ----
  const SCAM_CC = { '92': 'Pakistan', '84': 'Vietnam', '62': 'Indonesia', '60': 'Malaysia', '855': 'Cambodia', '856': 'Laos', '95': 'Myanmar', '234': 'Nigeria', '254': 'Kenya', '233': 'Ghana', '63': 'Philippines', '66': 'Thailand', '977': 'Nepal', '880': 'Bangladesh' };
  function analyzePhone(input) {
    const raw = String(input || '').trim();
    const flags = [];
    const add = (w, en, bn) => flags.push({ weight: w, en, bn });
    let d = raw.replace(/[^\d+]/g, '');
    if (d.replace(/\D/g, '').length < 5) return { ok: false, error: 'invalid' };
    let national = null, cc = null;
    if (d.startsWith('+')) d = d.slice(1); else if (d.startsWith('00')) d = d.slice(2);
    else if (d.length === 12 && d.startsWith('91')) { /* 91XXXXXXXXXX */ }
    else if (d.length === 11 && d.startsWith('0')) d = '91' + d.slice(1);
    else if (d.length === 10) d = '91' + d;
    if (d.startsWith('91') && d.length === 12) { cc = '91'; national = d.slice(2); }
    else { cc = Object.keys(SCAM_CC).concat(['1', '44', '971', '65', '61']).sort((a, b) => b.length - a.length).find(c => d.startsWith(c)) || d.slice(0, 2); national = d.slice(cc.length); }
    if (cc !== '91') {
      if (SCAM_CC[cc]) add(32, 'Foreign number (+' + cc + ', ' + SCAM_CC[cc] + '). Scam calls and WhatsApp job or lottery offers often come from numbers like this.', 'বিদেশি নম্বর (+' + cc + ', ' + SCAM_CC[cc] + ')। প্রতারণার কল ও WhatsApp-এ চাকরি/লটারির অফার প্রায়ই এমন নম্বর থেকে আসে।');
      else add(18, 'Foreign number (+' + cc + '). If a bank, courier or officer says they are calling from India, this does not match.', 'বিদেশি নম্বর (+' + cc + ')। ব্যাংক বা অফিসার ভারত থেকে ফোন করছে বললে এটা মেলে না।');
    } else {
      if (!/^[6-9]\d{9}$/.test(national)) add(30, 'Not a valid Indian mobile number (mobiles start with 6, 7, 8 or 9 and have 10 digits).', 'এটি বৈধ ভারতীয় মোবাইল নম্বর নয় (মোবাইল নম্বর ৬-৯ দিয়ে শুরু, ১০ অঙ্কের)।');
      else {
        if (/(\d)\1{5,}/.test(national) || /(?:0123|1234|2345|3456|4567|5678|6789|9876|8765|7654)/.test(national) && /(\d)\1{3,}/.test(national)) add(8, 'Looks like a "VIP" pattern number. Scammers buy these to look official, but so do honest people.', 'এটা "VIP" প্যাটার্নের নম্বর। প্রতারকরা এমন নম্বর কেনে, তবে সাধারণ মানুষও কেনে।');
      }
    }
    if (/^1[4-9]\d/.test(d.replace(/^91/, '')) && d.replace(/^91/, '').length <= 10 && !/^[6-9]/.test(d.replace(/^91/, ''))) add(10, 'Numbers starting with 140 are telemarketing lines. Banks use official 1800 numbers or short sender IDs.', '140 দিয়ে শুরু নম্বর টেলিমার্কেটিং-এর। ব্যাংক সরকারি 1800 নম্বর বা নির্দিষ্ট সেন্ডার আইডি ব্যবহার করে।');
    const score = Math.min(100, flags.reduce((a, f) => a + f.weight, 0));
    const verdict = score >= 55 ? 'phishing' : score >= 20 ? 'suspicious' : 'safe';
    flags.sort((a, b) => b.weight - a.weight);
    return { ok: true, display: (cc === '91' ? '+91 ' + national : '+' + d), score, verdict, flags };
  }

  // ---- UPI ID checker ----
  const UPI_HANDLES = new Set(['okaxis','okhdfcbank','okicici','oksbi','ybl','ibl','axl','paytm','apl','upi','sbi','icici','hdfcbank','pnb','barodampay','fbl','aubank','axisbank','kotak','yesbank','indus','idfcbank','postbank','cnrb','unionbank','boi','federal','rbl','ikwik','freecharge','jupiter','slice','airtel','jio','waicici','wahdfcbank','waaxis','wasbi','abfspay','yapl','ezetap','pingpay','naviaxis','okbizaxis','gpay','allbank','cboi','centralbank','dbs','dlb','equitas','hsbc','idbi','iob','jkb','kbl','kvb','lvb','mahb','obc','psb','sib','scb','tjsb','uboi','utbi','uco','vijb','ubi','ptsbi','pthdfc','ptyes','ptaxis','postbank']);
  const UPI_BAD_NAME = /(refund|kyc|cashback|reward|lottery|prize|winner|helpdesk|customercare|care|support|official|helpline|claim|bonus|govt|police|electric|bijli|bank|sbi|hdfc|icici|paytm|rbi|income-?tax|verify)/i;
  function analyzeUPI(input) {
    const raw = String(input || '').trim().toLowerCase();
    const m = raw.match(/^([a-z0-9._-]{2,64})@([a-z][a-z0-9]{1,30})$/);
    if (!m) return { ok: false, error: 'invalid' };
    const [, name, handle] = m;
    const flags = [];
    const add = (w, en, bn) => flags.push({ weight: w, en, bn });
    if (!UPI_HANDLES.has(handle)) add(35, 'The handle "@' + handle + '" is not one I know. Real UPI IDs end in handles like @okaxis, @ybl, @paytm, @oksbi.', '"@' + handle + '" হ্যান্ডেলটি আমার পরিচিত নয়। আসল UPI আইডি @okaxis, @ybl, @paytm, @oksbi-র মতো হ্যান্ডেলে শেষ হয়।');
    if (UPI_BAD_NAME.test(name)) add(35, 'The name part has words like refund, support, KYC, reward or a bank name. Scammers pick names that sound official; a real person or shop does not need to.', 'নামের অংশে refund, support, KYC, reward বা ব্যাংকের নাম আছে। প্রতারকরা সরকারি-সরকারি নাম বেছে নেয়।');
    if (/^\d{10}$/.test(name)) { /* phone-number UPI is normal */ }
    else if ((name.match(/\d/g) || []).length >= 6 && !/^\d+$/.test(name)) add(8, 'Many digits mixed into the name.', 'নামে অনেক সংখ্যা মেশানো।');
    add(0, '', '');
    const f2 = flags.filter(f => f.weight > 0);
    const score = Math.min(100, f2.reduce((a, f) => a + f.weight, 0));
    const verdict = score >= 55 ? 'phishing' : score >= 25 ? 'suspicious' : 'safe';
    f2.sort((a, b) => b.weight - a.weight);
    return { ok: true, id: name + '@' + handle, score, verdict, flags: f2 };
  }

  // ---- Email header analyzer ----
  function unfold(h) { return String(h || '').replace(/\r?\n[ \t]+/g, ' '); }
  function hdr(h, name) { const m = unfold(h).match(new RegExp('^' + name + ':\\s*(.*)$', 'im')); return m ? m[1].trim() : ''; }
  function addrDomain(v) { const m = String(v || '').match(/@([a-z0-9.-]+\.[a-z]{2,})/i); return m ? m[1].toLowerCase() : ''; }
  function analyzeHeaders(text) {
    const h = String(text || '');
    if (!/^[A-Za-z-]+:/m.test(h)) return { ok: false, error: 'invalid' };
    const flags = [];
    const add = (w, en, bn) => flags.push({ weight: w, en, bn });
    const auth = unfold(h).match(/^Authentication-Results:.*$/gim) || [];
    const all = auth.join(' ') + ' ' + hdr(h, 'Received-SPF');
    const res = k => { const m = all.match(new RegExp('\\b' + k + '=(\\w+)', 'i')); return m ? m[1].toLowerCase() : null; };
    const spf = res('spf') || (/^(pass|fail|softfail|neutral|none)/i.test(hdr(h, 'Received-SPF')) ? hdr(h, 'Received-SPF').split(/\s/)[0].toLowerCase() : null);
    const dkim = res('dkim'), dmarc = res('dmarc');
    const status = { spf, dkim, dmarc };
    const bad = v => v && ['fail', 'softfail', 'permerror', 'temperror'].includes(v);
    if (bad(spf)) add(30, 'SPF ' + spf + ': the sending server is not allowed to send for this domain.', 'SPF ' + spf + ': এই ডোমেইনের হয়ে মেইল পাঠানোর অনুমতি এই সার্ভারের নেই।');
    if (bad(dkim)) add(30, 'DKIM ' + dkim + ': the message signature is missing or broken.', 'DKIM ' + dkim + ': মেসেজের ডিজিটাল সিগনেচার নেই বা ভাঙা।');
    if (bad(dmarc)) add(35, 'DMARC ' + dmarc + ': the domain owner\'s own rules reject this mail.', 'DMARC ' + dmarc + ': ডোমেইনের মালিকের নিজের নিয়মেই এই মেইল গ্রহণযোগ্য নয়।');
    if (!spf && !dkim && !dmarc) add(12, 'No SPF, DKIM or DMARC results found in these headers (they may be incomplete).', 'এই হেডারে SPF, DKIM বা DMARC-এর ফল পাওয়া যায়নি (হেডার অসম্পূর্ণ হতে পারে)।');
    const from = hdr(h, 'From'), reply = hdr(h, 'Reply-To'), ret = hdr(h, 'Return-Path'), mid = hdr(h, 'Message-ID');
    const fd = addrDomain(from), rd = addrDomain(reply), td = addrDomain(ret), md = addrDomain(mid);
    const reg = d => d ? registrable(d) : '';
    if (fd && rd && reg(fd) !== reg(rd)) add(30, 'Reply-To (' + rd + ') goes to a different domain than From (' + fd + '). Replies would reach someone else.', 'Reply-To (' + rd + ') আর From (' + fd + ') আলাদা ডোমেইন। উত্তর অন্য কারও কাছে যাবে।');
    if (fd && td && reg(fd) !== reg(td)) add(10, 'Return-Path domain (' + td + ') differs from From (' + fd + '). Common with bulk senders, also with spoofing.', 'Return-Path (' + td + ') আর From (' + fd + ') আলাদা। বাল্ক সেন্ডারে এটা দেখা যায়, স্পুফিংয়েও।');
    if (fd && md && reg(fd) !== reg(md) && !/(google|outlook|amazonses|sendgrid|mailchimp|mandrill)/.test(md)) add(8, 'Message-ID domain (' + md + ') does not match From (' + fd + ').', 'Message-ID ডোমেইন (' + md + ') From-এর সাথে মেলে না।');
    const disp = from.replace(/<.*$/, '').replace(/"/g, '').trim().toLowerCase();
    if (fd && disp) for (const b in BRANDS) { if (b.length >= 4 && disp.includes(b) && !isOfficial(reg(fd), fd)) { add(35, 'Display name says "' + disp + '" but the address is @' + fd + ', not an official ' + b.toUpperCase() + ' domain.', 'নামে "' + disp + '" লেখা, কিন্তু ঠিকানা @' + fd + ' - ' + b.toUpperCase() + '-এর সরকারি ডোমেইন নয়।'); break; } }
    if (fd) { const d = analyze(fd); if (d.ok) d.flags.filter(f => ['lookalike', 'brand_abuse', 'punycode', 'risky_tld'].includes(f.id)).slice(0, 2).forEach(f => add(Math.round(f.weight * 0.8), 'Sender domain: ' + f.en, 'প্রেরকের ডোমেইন: ' + f.bn)); }
    const score = Math.min(100, flags.reduce((a, f) => a + f.weight, 0));
    const verdict = score >= 55 ? 'phishing' : score >= 22 ? 'suspicious' : 'safe';
    flags.sort((a, b) => b.weight - a.weight);
    return { ok: true, score, verdict, flags, status, from, replyTo: reply, domain: fd };
  }

  // Does this link look like it carries a token or secret (reset, verify, magic-link, long random value)?
  // Used before anything is sent to outside databases. Returns { risky, reasons[] }.
  var SECRET_KEYS = /^(token|access_token|id_token|refresh_token|auth|authkey|auth_token|key|api_key|apikey|secret|sig|signature|session|sessionid|sid|code|otp|pin|password|passwd|pwd|reset|resettoken|verify|verification|magic|jwt|hash|ticket|nonce)$/i;
  var SECRET_PATH = /(reset|verify|verification|confirm|activate|magic|invite|unsubscribe|password|passwd|recover|oauth|callback|auth)[-_/]?(password|link|token|email|account)?/i;
  function secretInUrl(raw) {
    var reasons = [];
    var s = String(raw || '').trim();
    if (!s) return { risky: false, reasons: reasons };
    var u;
    try { u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(s) ? s : 'http://' + s); } catch (e) { return { risky: false, reasons: reasons }; }
    if (u.username || u.password) reasons.push('login');
    var params = Array.from(u.searchParams.entries());
    if (u.hash && /[#&?](access_token|id_token|token|code|key)=/i.test(u.hash)) reasons.push('fragment');
    params.forEach(function (kv) {
      var k = kv[0], v = kv[1];
      if (SECRET_KEYS.test(k) && v.length >= 6) reasons.push('param:' + k.toLowerCase());
      else if (v.length >= 24 && /^[A-Za-z0-9_\-+=./]+$/.test(v) && /[A-Za-z]/.test(v) && /\d/.test(v) && !/[-_.]{2,}/.test(v) && /[a-z]/.test(v) && /[A-Z0-9]/.test(v)) reasons.push('long:' + k.toLowerCase());
    });
    var segs = u.pathname.split('/').filter(Boolean);
    var pathHit = SECRET_PATH.test(u.pathname) && segs.some(function (g) { return g.length >= 20 && /^[A-Za-z0-9_\-=]+$/.test(g) && /\d/.test(g) && /[A-Za-z]/.test(g); });
    if (pathHit) reasons.push('path');
    else if (segs.some(function (g) { return g.length >= 32 && /^[A-Za-z0-9_\-=]+$/.test(g) && /\d/.test(g) && /[A-Za-z]/.test(g); }) && SECRET_PATH.test(u.pathname)) reasons.push('path');
    return { risky: reasons.length > 0, reasons: reasons };
  }

  return { secretInUrl, analyze, analyzePhone, analyzeUPI, analyzeHeaders, analyzeMessage, extractLinks, parse, registrable, levenshtein, BRANDS, SHORTENERS };
});
