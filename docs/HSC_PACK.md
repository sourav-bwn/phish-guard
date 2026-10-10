# Hack for Social Cause: submission pack

Track: Hack for Social Cause (MY Bharat / Innovate for Bharat). Theme: Digital Safety & Cyber Fraud Awareness. Registration ID HSC|WB|00053. Deadline: **15 Oct 2026**.

Live prototype: https://phish-guard-seven-pi.vercel.app
Public repo: https://github.com/sourav-bwn/phish-guard

## Deck outline (7 slides)

1. **Title.** PhishGuard: paste a suspicious message, get an answer in Bengali or English. Name, track, registration ID, live link.
2. **The problem.** Fake KYC, UPI "collect", electricity-bill and lottery messages reach people on WhatsApp and SMS every day. Victims decide in seconds and have no quick, free way to check. (Add one or two official statistics from cybercrime.gov.in or I4C with source and date before presenting. We have not verified specific numbers here.)
3. **Who it helps.** First-time smartphone users, elders, small shopkeepers and students in West Bengal, where the scam wording is often in Bengali or mixed Hinglish and most tools are English only.
4. **The solution.** Three ways in: paste a link, paste a whole message, or scan a QR image. Output: Likely phishing / Suspicious / No red flags found, with plain reasons. Screenshot of the phishing result on a phone.
5. **How it works.** Readable rules (look-alike domains, scam wording, risky endings, shorteners, hidden redirects, APK downloads) run in the browser. Optional lookups: PhishTank, urlscan.io, domain age, Google Safe Browsing, URLhaus. Never opens the link. Nothing stored. Free stack: GitHub + Vercel.
6. **Impact and next steps.** Bulk checking with CSV for banks branches, schools and NGOs. Open API for other apps. Awareness cards for the 8 common scams plus the 1930 helpline. Roadmap: trained model with a measured evaluation, opt-in scam reporting, WhatsApp bot.
7. **Honest limits and ask.** Rules not ML, no accuracy figure yet, can miss brand-new scams. Link to repo, live site, contact. Ask: mentoring from IIT Bombay on evaluation and reaching rural users.

## Demo video script (about 4 minutes)

**0:00 Hook (20s).** Show a real-looking scam SMS on a phone. "This arrived at 11 pm. Your account will be blocked. Would you click?"
**0:20 Problem (30s).** One line on scale, with a cited figure once you have one. "People have seconds, and no quick free check."
**0:50 Link check (40s).** Open the site on a phone. Tap the `sbi-kyc-update.xyz` example. Read the result aloud: "Likely phishing, because it uses the SBI name but is not SBI, KYC wording, a risky ending, no HTTPS."
**1:30 Bengali (30s).** Toggle বাং. Same result in Bengali. "Most scams here are in Bengali. The answer should be too."
**2:00 Whole message (45s).** Message tab, tap "Try a sample scam SMS". Show cues found plus the link. Then paste a normal message and show it stays "No red flags".
**2:45 Bulk and QR (30s).** Bulk tab with four links, Download CSV, Print report. Scan a QR image.
**3:15 Trust and limits (25s).** "It never opens the link, stores nothing, and says 'no red flags' not 'safe' because no tool can promise that."
**3:40 Close (20s).** Awareness cards and 1930. Show repo and live link. "Free, open source, and ready for others to build on."

Recording tips: record on the phone at normal speed, 1080p, voiceover in his own voice, subtitles in English if narrating in Bengali. Keep under 5 minutes.

## Submission checklist

- [ ] Log in at mybharat.gov.in (account MBP79780471), open the Hack for Social Cause page and use **Submit Entry**.
- [ ] Deck: 6-7 slides, exported as PDF (and PPTX if the form asks).
- [ ] Prototype: public repo link https://github.com/sourav-bwn/phish-guard (confirm it opens while logged out) and live link.
- [ ] Demo video: 3-5 minutes, uploaded as the portal requires (file or public link). Confirm the link works logged out.
- [ ] Team name: currently a placeholder ("Sourav Garai"). Rename if the portal allows.
- [ ] Add real, dated statistics with sources to slide 2.
- [ ] Optional free keys for Google Safe Browsing and URLhaus added as Vercel environment variables, then re-check the live site.
- [ ] Test the live site on a phone one last time, in both languages.
- [ ] Confirm the college Google Form (for Ministry reporting) was submitted from the college mail ID. Reported as done on 8 Oct.
- [ ] Submit at least a day before 15 Oct and keep the confirmation screenshot.

## Feature list for the deck and demo (all live)

Link, message, screenshot (OCR), number/UPI, email headers, bulk, QR, shareable verdict card, Bengali + English, Hindi cues, community reports with stats, ML advisory row, open API at /api/check, Chrome extension.

Demo add-ons: (1) upload a scam SMS screenshot, (2) open Community, submit a report and watch the chart update, (3) paste headers of a spam mail.

Honest caveats to say out loud: the extension is untested in a real browser; the ML model is advisory (84.6% accuracy on a held-out split of public phishing lists vs top-ranked sites); no public database of scam numbers or UPI IDs exists in India; Community numbers start at zero and are only real reports; the WhatsApp bot is parked (needs a Meta account and dedicated number).
