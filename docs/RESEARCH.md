# PhishGuard design review

How the feature set was chosen. We argued each option from four viewpoints, checked claims against public sources, and kept what a free, privacy-respecting tool can do well. Sources are linked at the end; claims that rest on our own testing say so.

## The panel

**Threat researcher.** Phishing sites are short lived, so blocklists alone are slow. A study of 15,126 newly registered phishing domains over 11 months found an average lifetime of 8.6 days [1]. A domain that is only days old and impersonates a brand is therefore a strong signal. This is why PhishGuard shows domain age (free RDAP lookup) and treats a domain under 30 days as at least suspicious.

**Detection engineer.** URL-only (lexical) features are cheap and work before any page is fetched. Surveys of URL-based phishing detection group the useful signals into lexical features (length, digits, special characters, keywords), host features (IP as host, subdomain count, TLD) and similarity to known brands [2][3]. PhishGuard implements these as readable rules, not a black-box model, so every verdict can be explained in plain words. Trade-off: rules cannot learn new tricks the way a trained model can. See "Limits".

**Safety / harm-reduction lead.** The audience is a person holding a suspicious SMS, not an analyst. So the tool (a) accepts the whole message, because the wording ("your account will be blocked", "update KYC") is often a stronger tell than the link; (b) answers in Bengali and English; (c) never opens the link, so checking cannot infect or alert the sender; and (d) says "no red flags found" instead of "safe", because no tool can promise safety.

**Privacy and cost lead.** Everything must run on free tiers with no card. Heuristics and message analysis run in the browser, so pasted text never leaves the device. Only the link itself goes to our server for the optional database lookups, and nothing is stored or logged by us. That is also why we dropped scam-report submission and a stats dashboard for now: they need stored user data and moderation.

## Decisions

| Option | Decision | Why |
|---|---|---|
| Rule-based URL scoring | Built | Explainable, instant, offline-capable [2][3] |
| Brand look-alike / typosquat | Built | Most common impersonation trick; tuned to avoid flagging ordinary words (tests included) |
| Whole-message analysis (EN/BN/Hinglish cues) | Built | Wording is often the best signal; fits the Digital Safety theme |
| Bulk scan, CSV, print report | Built | Lets a bank branch, school or NGO check a batch |
| QR image scan | Built (not tested on real QR photos) | "Quishing" lives in images, so text paste misses it |
| Domain age (RDAP) | Built | New domains are a strong signal [1] |
| Google Safe Browsing | Built, needs a free key | Large blocklist. Terms: non-commercial use only; commercial use should use Web Risk [4][5] |
| PhishTank, urlscan.io, URLhaus | Built | Community databases; URLhaus needs a free abuse.ch key. Phishing infrastructure and feeds are surveyed in [6] |
| OpenPhish | Not used | Free feed licence does not allow public display [8] |
| Developer API | Built | Open, keyless, documented in README |
| ML classifier | Roadmap | Lexical ML is well studied [7], but needs a labelled dataset and an evaluation we cannot honestly claim yet |
| Scam-report form, stats dashboard | Roadmap | Needs storage, abuse control, privacy review |
| Screenshot / page-content analysis | Roadmap | Requires fetching hostile pages in a sandbox |

## Limits (read before relying on it)

- Rules were checked against hand-written examples (unit tests), not a large labelled dataset. We have **not** measured precision or recall.
- A brand-new scam on a clean-looking domain can score "no red flags". Database rows and domain age reduce this but do not remove it.
- Hosting on a legitimate site (a hacked blog, a free host) can look fine. Free-host abuse adds a small score only.
- The keyless databases are rate limited and may be unavailable; rows then show "unavailable" and the heuristic verdict stands.
- Safe Browsing terms restrict commercial use [4]. Anyone using this in a company should swap in Google Web Risk or a licensed feed.

## If you were scammed

India's National Cyber Crime helpline is **1930**, and reports can be filed at the National Cybercrime Reporting Portal [9]. The 1930 system connects your report to the beneficiary bank so funds can be held; legal recovery rights rest on RBI's customer-liability rules and other law, and reporting early helps [10].

## Sources

1. Agarwal, S., Vasek, M. "Examining newly registered phishing domains at scale." Journal of Cybersecurity 12(1), 2026. https://discovery.ucl.ac.uk/id/eprint/10228328/
2. Aung, E. S., Zan, C. T., Yamana, H. "A Survey of URL-based Phishing Detection." https://db-event.jpn.org/deim2019/post/papers/201.pdf
3. Althobaiti et al. "A Review of Human- and Computer-Facing URL Phishing Features." https://www.pure.ed.ac.uk/ws/files/106509327/A_Review_of_Human_ALTHOBAITI_DoA050419_AFV.pdf
4. Google Safe Browsing APIs (v4) overview, including the non-commercial-use note. https://developers.google.com/safe-browsing/v4
5. Safe Browsing Lookup API (v4). https://developers.google.com/safe-browsing/v4/lookup-api
6. Interisle Consulting. "Phishing Landscape 2022." https://www.interisle-group.com/PhishingLandscape2022.pdf
7. Gupta, B. B. et al. "A novel approach for phishing URLs detection using lexical based machine learning in a real-time environment." Computer Communications, 2021. https://www.sciencedirect.com/science/article/abs/pii/S0140366421001675
8. OpenPhish feed licence (checked earlier by the project team; not re-verified in this review).
9. National Cybercrime Reporting Portal, I4C, Ministry of Home Affairs. https://cybercrime.gov.in/
10. Legal Republic. "Calling 1930 for cyber-fraud - the 24-hour rule and your bank's liability." https://www.legalrepublic.in/everyday-law/cyber-fraud-helpline-1930/
