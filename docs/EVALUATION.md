# PhishGuard verdict engine: evaluation summary

Run: 13 Oct 2026, about 22:30-22:36 IST. Target: the live app API, https://phish-guard-seven-pi.vercel.app/api/check (commit b1afead). One request per link, no retries that changed results, no errors.

## Dataset and labels
- Phishing (20): random sample (Python random.seed 20261013, no cherry-picking) from the OpenPhish community feed https://openphish.com/feed.txt, retrieved 2026-10-13 16:58 UTC (300 URLs in the feed). Label = listed as phishing by OpenPhish at retrieval. I did not open any of the links. PhishTank's own download was blocked (HTTP 403), so it was not used as the label source (the app also queries PhishTank, so using it would be circular).
- Benign (27): 10 major sites (Google, Wikipedia, Amazon.in, Flipkart, IRCTC, SBI online, HDFC Bank, GitHub, BBC, The Hindu), 11 smaller Indian institutional sites (MHA, CBSE, Presidency University, Indian Museum Kolkata, Bengaluru Metro, NIT Durgapur, Victoria Memorial, IIEST, RKMVU, National Library, Sahapedia) and 6 login/identity-style pages that could trigger word rules (myAadhaar verify, Income Tax portal, NPCI UPI, EPFO, Paytm, PhonePe). Label = well-known legitimate site, chosen by me before running.
- Verdict shown by the app: safe ("No red flags found"), suspicious, phishing ("Likely phishing").

## Results
Counts: phishing links -> 4 Likely phishing, 6 Suspicious, 10 No red flags. Benign links -> 27 No red flags.

| | Flagged (Suspicious or Likely phishing) | Not flagged |
|---|---|---|
| Phishing (20) | TP 10 | FN 10 |
| Benign (27) | FP 0 | TN 27 |

- Flag rule (Suspicious or Likely phishing counts as detection): precision 100% (10/10), recall 50% (10/20), false-positive rate 0% (0/27), accuracy 37/47 = 78.7%.
- Strict rule (only Likely phishing counts): precision 100% (4/4), recall 20% (4/20), FPR 0%.
- Small sites: 0 false positives on 17 Indian small / institutional / login-style pages.

## What the misses look like
- 10 of 20 phishing links got "No red flags found". Most are throwaway or hacked pages with no brand name in the address (cloud-ip.cc, duckdns.org, workers.dev, github.io, b12sites.com, gestorweb.cl, globalterdaftar.com, aar-direct.com). The rules look at the address text, so these pass.
- Of the 4 "Likely phishing" results, 3 came from the rules (brand name + free host / hyphens / keywords) and 1 from a PhishTank hit.
- Google Safe Browsing and URLhaus are "not configured" in the live app, so they did not contribute. Enabling the free keys would likely raise recall; not tested.

## Limits (say these out loud)
- Small sample (20 + 27). The 95% interval on recall is roughly 27% to 73%. It shows direction, not a precise rate.
- One feed, one day. Fresh phishing is the hardest case, and a base-rate mix of real traffic would look different.
- Benign set is mostly well-known sites, so 0 false positives does not prove none on all small sites.
- Not an independent audit; run by the team's assistant, not a third party.

Files: S-Guard_eval_results.csv (every URL, verdict, score, PhishTank flag).
