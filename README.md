# PhishGuard

Paste a link you got on WhatsApp or SMS. PhishGuard tells you if it looks like phishing and explains why, in English and Bengali (বাংলা). It never opens the link.

**Privacy note:** the link you check is looked up against outside reputation databases (PhishTank, plus Google Safe Browsing and URLhaus if keys are enabled). It is never opened or fetched. Links that look like they carry a token or secret (password reset, verify, magic-link, long random values) are held back and need a second click, with an on-device-only option. The API (`/api/check`) is rate limited per caller, best-effort per serverless instance.

Built for **Hack for Social Cause** (MY Bharat, theme: Digital Safety & Cyber Fraud Awareness). 100% free stack, no card needed.

## What it checks

**On-device heuristics** (`public/heuristics.js`, no network, works offline):
- look-alike domains (`paypa1.com`) and brand names used on non-official sites (SBI, HDFC, ICICI, Paytm, PhonePe, IRCTC, Aadhaar and more)
- scam words in the address: kyc, otp, verify, lucky winner, refund, cashback...
- risky endings (.xyz, .top, .click...), URL shorteners, raw IP hosts, `@` tricks, punycode, many subdomains, odd ports, free hosting, hidden redirects, direct `.apk` downloads, no HTTPS

**Also in the UI:** whole-message paste (finds every link and scam wording, English/Bengali/Hinglish), bulk scan of up to 50 links with CSV export and a print view, and QR image scan (native BarcodeDetector, falls back to jsQR).

**Optional reputation lookups** (`lib/external.js`, run on the server, each degrades gracefully):

| Service | Key | Env var |
|---|---|---|
| PhishTank | works without one | `PHISHTANK_APP_KEY` (optional, higher limits) |
| urlscan.io | works without one | `URLSCAN_API_KEY` (optional) |
| Google Safe Browsing | free key from Google Cloud | `GOOGLE_SAFE_BROWSING_KEY` |
| URLhaus (abuse.ch) | free Auth-Key | `URLHAUS_AUTH_KEY` |

If a key is missing the row shows "not configured" and the heuristic verdict still works. A database hit upgrades the verdict to phishing.

## API

Free, no key, CORS open. Base: `https://phish-guard-seven-pi.vercel.app/api/check`

```
GET  /api/check?url=http://sbi-kyc-update.xyz/login
POST /api/check   {"url": "paypa1.com"}
POST /api/check   {"text": "Dear customer, your SBI account will be blocked... http://..."}
POST /api/check   {"urls": ["a.com", "b.xyz/login"]}      # up to 50
```

Single link returns `verdict` (`safe|suspicious|phishing`), `score` 0-100, `reasons[]` (English and Bengali), and `external[]` (database checks plus domain age from RDAP). `text` extracts every link, scores them and adds scam-wording cues (English, Bengali, Hinglish).

```
curl -s https://phish-guard-seven-pi.vercel.app/api/check -d '{"url":"http://paypa1.com/signin"}' -H 'content-type: application/json'
```

## Run it

```
npm start        # http://localhost:3000
npm test         # heuristics unit tests
```

Deploy free on Vercel: import the repo, no build step. `public/` is the site, `api/check.js` is the serverless function. Add the env vars above in Project Settings if you want them.

## More features

- **Screenshot OCR** (Tesseract.js, English/Bengali/Hindi). Runs in the browser, the image is never uploaded.
- **Number / UPI checker**: format and warning-sign checks only. India has no public list of scam numbers or UPI IDs (Chakshu has no public API), so "no red flags" is not "trusted".
- **Email header analyzer**: SPF/DKIM/DMARC results, From/Reply-To/Return-Path mismatch.
- **Bulk check**, **QR scan**, **shareable verdict card** (PNG), **Hindi/Hinglish scam cues**.
- **Community reports + stats** (Supabase free tier). Anonymous: only scam type, channel and state are stored. No link, number, name or IP. Writes go through one rate-limited function (5 per hour per network); the table cannot be read or written directly. Schema: [docs/schema.sql](docs/schema.sql).
- **ML advisory row**: logistic regression on host features, held-out accuracy 84.6%, precision 89.6%, recall 76.6%. Benign data is top-ranked sites only, so it is advisory and never changes the verdict.
- **Installable PWA** (manifest + service worker), verdict explainer and ML accuracy note on every result, "Report this scam" button.
- **Chrome extension** (MV3) in `extension/`. Load unpacked. Not yet tested in a real browser.

## Parked

- **WhatsApp bot**: reply-only replies inside the 24-hour window are free under Meta's current pricing, but it needs a Meta developer app, a business portfolio and a dedicated phone number not already on WhatsApp, and Meta can ask for business verification. Not done because it needs the team's own Meta account and number. Sources: https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
- Page-content analysis (needs fetching the suspicious URL server-side, which is unsafe).

See [docs/RESEARCH.md](docs/RESEARCH.md) for reasoning and sources, and [docs/HSC_PACK.md](docs/HSC_PACK.md) for the deck outline, demo script and checklist.

## Notes

- The suspicious URL is never fetched by the server, so a malicious page cannot attack it.
- Verdict = heuristic score (>=55 phishing, >=22 suspicious) or any database hit. "No red flags" is not a guarantee.
- OpenPhish is not used because its free feed license does not allow public display.

If you were scammed: call **1930** and report at https://cybercrime.gov.in.

MIT license.
