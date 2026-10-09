# PhishGuard

Paste a link you got on WhatsApp or SMS. PhishGuard tells you if it looks like phishing and explains why, in English and Bengali (বাংলা). It never opens the link.

Built for **Hack for Social Cause** (MY Bharat, theme: Digital Safety & Cyber Fraud Awareness). 100% free stack, no card needed.

## What it checks

**On-device heuristics** (`public/heuristics.js`, no network, works offline):
- look-alike domains (`paypa1.com`) and brand names used on non-official sites (SBI, HDFC, ICICI, Paytm, PhonePe, IRCTC, Aadhaar and more)
- scam words in the address: kyc, otp, verify, lucky winner, refund, cashback...
- risky endings (.xyz, .top, .click...), URL shorteners, raw IP hosts, `@` tricks, punycode, many subdomains, odd ports, free hosting, hidden redirects, direct `.apk` downloads, no HTTPS

**Optional reputation lookups** (`lib/external.js`, run on the server, each degrades gracefully):

| Service | Key | Env var |
|---|---|---|
| PhishTank | works without one | `PHISHTANK_APP_KEY` (optional, higher limits) |
| urlscan.io | works without one | `URLSCAN_API_KEY` (optional) |
| Google Safe Browsing | free key from Google Cloud | `GOOGLE_SAFE_BROWSING_KEY` |
| URLhaus (abuse.ch) | free Auth-Key | `URLHAUS_AUTH_KEY` |

If a key is missing the row shows "not configured" and the heuristic verdict still works. A database hit upgrades the verdict to phishing.

## Run it

```
npm start        # http://localhost:3000
npm test         # heuristics unit tests
```

Deploy free on Vercel: import the repo, no build step. `public/` is the site, `api/check.js` is the serverless function. Add the env vars above in Project Settings if you want them.

## Notes

- The suspicious URL is never fetched by the server, so a malicious page cannot attack it.
- Verdict = heuristic score (>=55 phishing, >=22 suspicious) or any database hit. "No red flags" is not a guarantee.
- OpenPhish is not used because its free feed license does not allow public display.

If you were scammed: call **1930** and report at https://cybercrime.gov.in.

MIT license.
