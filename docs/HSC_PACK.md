# Hack for Social Cause: submission pack

Track: Hack for Social Cause (MY Bharat / VBYLD 2027). Theme: Digital Safety & Cyber Fraud Awareness. Registration ID HSC|WB|00053. MY Bharat ID MBP79780471. Deadline: 15 Oct 2026.
Live: https://phish-guard-seven-pi.vercel.app   Repo (public): https://github.com/sourav-bwn/phish-guard

## Official rules (checked 11 Oct 2026 at https://mybharat.gov.in/pages/hack-for-social-cause, FAQ Q18-Q30)

- Full submission = (1) deck, (2) demo video (preferred, not mandatory), (3) public repo link, (4) Annexure 1: team details, signed self-certification, self-attested student ID per member, plus government photo ID number/details. Team Lead uploads.
- Deck: 6-7 slides, PPT or PDF, max 10 MB, "standard hackathon template provided by IIT Bombay" on the portal submission page. Required content: Problem (slides 1-2), Solution (3-4), Impact & Scalability (5), Team & Implementation plus AI-tool-use disclosure with an estimated proportion (6-7).
- Video: 3-5 min, MP4/MOV, min 720p, max 80 MB, uploaded on the portal.
- Repo: public, full source, detailed README with setup, architecture documentation, sample data or tests, licence.
- File naming for uploads: convention shown on the portal (the FAQ text lost the pattern; read it on the upload page).
- Edits allowed until the deadline; latest version counts. Deadline 15 Oct 2026.
- Note: the portal's timeline table says state hackathons start 16 Oct, FAQ Q31 says 26 Oct. Does not affect submission.

## Deck (7 slides, built: PhishGuard_HSC_Deck.pptx / .pdf)

1. Problem: headline official figures (see below).
2. Who is hit and the gap (West Bengal, Bengali/Hinglish, free check before the loss).
3. Solution: link/message/screenshot/number/email/QR/bulk, verdict plus reasons, Bengali and English screenshots.
4. How it works and what is stored: rules in browser, optional lookups, advisory ML (84.6% held-out accuracy, never changes the verdict). Checking stores nothing in our code; Community reports are separate, opt-in, only scam type + channel + state in Supabase; rate-limit hash kept up to one day.
5. Impact and scalability: bulk CSV, open API, PWA, extension (untested in real browser), Community stats, next steps.
6. Team and implementation, stack, shipped list, honest limits.
7. AI-use disclosure (percentage left for Sourav to confirm) and the ask.

### Official statistics (dated, sourced)

- 2024: 19,18,865 financial-fraud complaints on NCRP; Rs 22,845.73 crore reported lost. 2023: 13,10,354 complaints; Rs 7,465.18 crore. Source: MHA reply, Lok Sabha Unstarred Q.344, 22 July 2025: https://www.mha.gov.in/MHA1/Par2017/pdfs/par2025-pdfs/LS22072025/344.pdf
- Till 30 June 2026: more than Rs 11,158 crore saved in more than 32.80 lakh complaints via CFCFRMS (helpline 1930). Source: MHA reply, Rajya Sabha, 22 July 2026: https://www.mha.gov.in/MHA1/Par2017/pdfs/par2026-pdfs/RS22072026/398.pdf
- Say "all cyber financial fraud", not "phishing only".

## Repo wording patch (applied to README and this file on 11 Oct 2026)

Replace "Nothing stored", "Rules not ML, no accuracy figure yet" and the roadmap items already live (trained model, opt-in reporting) with:
- Checking a link or message: the app never opens the link; the link text is looked up in outside reputation databases; our code does not save checked links or messages.
- Community reports: opt-in, anonymous: only scam type, channel, state. No link, number, name or IP. A salted hash of the network address is kept up to one day to enforce 5 reports per hour. (README says "no IP"; accurate for the reports table, but the rate-limit hash should be mentioned.)
- ML row: advisory, 84.6% accuracy, 89.6% precision, 76.6% recall on 24,000 held-out hosts; benign data is top-ranked sites so it can over-flag small legitimate sites.
- Remaining roadmap: WhatsApp bot, measured evaluation with mentors, more languages.

## Demo video script (about 4 min, voiceover by Sourav)

0:00 Hook (20s): scam SMS on a phone. "Would you click?"
0:20 Problem (30s): "Rs 22,845 crore reported lost to cyber fraud in 2024 (MHA, Lok Sabha, July 2025). People have seconds and no quick free check."
0:50 Link check (35s): tap sbi-kyc-update.xyz; read the reasons aloud.
1:25 Bengali (25s): toggle to Bengali, same result.
1:50 Whole message (35s): Message tab, sample scam SMS; then a normal message stays "No red flags".
2:25 Screenshot and number/UPI (25s): upload an SMS screenshot (read on-device); check a UPI ID format.
2:50 Bulk and QR (25s): four links, Download CSV; scan a QR image.
3:15 Trust and limits (30s): "Checking never opens the link and our code does not save what you check. Looked-up links go to reputation databases. Tokens links are held back. Community reports are optional and anonymous. The model is advisory at 84.6%, and no tool can promise 'safe'."
3:45 Community + close (15s): Community tab stats (zero or real only), 1930, repo and live link.
Add the team intro (name, college) in the first 20s, since the portal asks the video to show the team.
Recording: phone screen recording 1080p MP4 under 80 MB, English or Bengali voiceover with subtitles.

## Capture plan

Ready (taken 11 Oct 2026 from the live app, 390 px mobile): link result EN and BN, message result, bulk table. Re-record the full video by hand. Not captured, needs the phone: screenshot-OCR upload, QR scan, number/UPI result, token-link warning, Community tab. Do not submit fake Community reports; stats must stay real.

## Checklist

- [ ] Sourav: confirm AI-use percentage on slide 7.
- [ ] Sourav: Annexure 1 (details, signed self-certification, self-attested student ID, government ID details).
- [ ] Sourav: record demo video (his voice and face).
- [ ] Download the IIT Bombay deck template on the portal submission page; paste content in if required.
- [ ] Rename team ("Sourav Garai" placeholder) if the portal allows.
- [x] Update docs/HSC_PACK.md and README wording in the repo (done 11 Oct 2026).
- [ ] Confirm repo opens logged out (HTTP 200 checked 11 Oct), tests pass, README has setup and architecture sections.
- [ ] Submit by 14 Oct, keep confirmation screenshot.
