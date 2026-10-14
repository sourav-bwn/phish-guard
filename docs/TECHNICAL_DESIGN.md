# PhishGuard technical design

## Scope and source

This document describes the repository at rules-v2 commit `14b1329`, with evaluation documents added through `44f0423`. It is a source review, not a security audit or a guarantee of detection. The suspicious destination page is not fetched. A URL submitted for reputation lookup can still disclose sensitive address text to external services.

## Architecture and trust zones

```text
UNTRUSTED INPUT                  DEVICE / BROWSER
URL, message, QR or image  --->  public/app.js
                                | QR / OCR decode locally
                                v
                                public/heuristics.js
                                rules -> score 0-100 -> local verdict
                                |
              token-like URL? --+--> confirmation / on-device-only option
                                |
                    single URL lookup chosen
                                v
SERVER / VERCEL                  api/check.js -> lib/handler.js
                                | validate, rate limit, rerun rules
                                v
EXTERNAL SERVICES               lib/external.js
                                | PhishTank, urlscan.io
                                | Safe Browsing / URLhaus if configured
                                | RDAP domain-age lookup
                                v
SERVER                          local score + external flags -> final verdict
                                |
DEVICE                          reasons + service status + reporting guidance
```

The score is the bounded heuristic score, not a calibrated probability. Thresholds are 22 for Suspicious and 55 for Likely phishing. A non-warning external positive upgrades the verdict to phishing; warning-level positives can upgrade safe to suspicious. External results do not rewrite the numeric heuristic score. The advisory ML probability is separate and does not set the verdict.

```text
DEVICE                         OPTIONAL COMMUNITY REPORTING
public/reports.js  ---------->  Supabase RPC submit_report / get_stats
                               schema: docs/schema.sql
                               aggregate reports, separate from URL lookup
```

### Device boundary

`public/heuristics.js` supplies the shared URL rules, including dynamic-DNS, free-host brand-path and long-label signals. `public/app.js` handles UI, secret-link confirmation and local-only use. `public/ml.js` uses `public/model.json` for an advisory host-pattern model. QR and screenshot OCR processing happens in the browser; third-party browser libraries may need network access to load. This is not a promise that every app feature works offline.

### API boundary

`api/check.js` adapts requests to `lib/handler.js`; `dev/server.js` uses the same handler locally. Single-URL requests can call reputation services. Text and bulk API requests use local rules only; bulk is capped at 50 URLs and text is truncated to 5,000 characters. The API itself does not enforce the browser's secret-link confirmation, so direct API clients must avoid submitting private token URLs.

The in-memory limiter allows 20 single-link checks and 60 text/bulk checks per caller per minute, plus a shared external-lookup cap per warm instance. These are best-effort limits, not distributed enforcement. API responses use no-store. Open CORS permits other clients to call the endpoint.

### External-service boundary and failures

`lib/external.js` sends URL or domain information to fixed reputation/RDAP services, not to the suspicious page. Each service can return a status such as ok, skipped or error. Missing keys, errors and unavailable services are not negative reputation evidence. The local verdict remains usable, but incomplete lookups reduce coverage.

In the documented 13 October live evaluations, Google Safe Browsing and URLhaus were **not configured** and contributed no detection. This is a dated evaluation status, not a live settings audit. PhishTank and urlscan.io can work without optional keys; limits and availability still apply.

### Community reporting boundary

The optional report path is separate from detection. The schema restricts direct table access and exposes RPCs for submission and aggregates. Reports store category/channel/state rather than suspicious URLs. Network-rate enforcement uses a daily-salted address hash in a separate table; see the schema for retention/cleanup behavior. Browser Supabase configuration is in `public/reports.js`, not server environment variables. A fork needs its own project and schema; never put a service-role secret in browser code. Source controls are not proof of deployed database policy correctness.

## Setup and configuration

Use Node.js 18 or newer. This repository has no npm package dependencies and no frontend build step. See the root README for commands and server environment-variable names. The local server reads exported process environment variables; it does not automatically load a `.env` file. Vercel uses `public/` and `api/check.js` as configured in `vercel.json`.

## Evaluation and test evidence

- [Baseline evaluation](EVALUATION.md): 47 labeled links, 20 phishing and 27 benign. Flagged 10/20 phishing, 0/27 benign.
- [Rules-v2 addendum](EVALUATION_v2.md): same links, live rerun after rules-v2 deployment; flagged 15/20 phishing (75% recall), 0/27 benign. Strict phishing-only recall stayed 4/20.
- [Baseline rows](eval_results.csv) and [v2 rows](eval_rerun_v2.json) make per-link results discoverable. **These contain known malicious URLs. Treat them as inert text; do not open them.**
- `test/heuristics.test.js`: 22 automated tests at this revision, run with `npm test`. They cover parsing, heuristics, handler behavior and rate limits; they are not end-to-end browser tests or an independent security assessment.

The v2 rules were tuned after inspecting the evaluation links. The 75% recall is a same-dataset rerun, not expected real-world performance. The benign set is small. Known false positives include brand-owned free-host pages described in the addendum. The ML model's separate held-out metric is not the verdict engine's accuracy. The Chrome extension is built but not yet tested in a real browser according to the README.

## Limitations and next validation

Address-pattern rules cannot reliably detect compromised ordinary domains or newly created scams with no signal. "No red flags" never means guaranteed safe. Further work needs unseen multi-day datasets, broader benign controls, privacy/security review, and user-pilot measurements. Fetching suspicious page content is intentionally outside this design.

## License

The root [MIT LICENSE](../LICENSE) covers the software. External datasets, services and libraries retain their own terms; the project license does not override them.
