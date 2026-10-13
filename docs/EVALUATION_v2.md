# Evaluation addendum: rules v2 (13 Oct 2026)

Same 20 OpenPhish links (seed 20261013, feed fetched 2026-10-13 16:58 UTC) and the same 27 benign links as docs/EVALUATION.md. Old numbers are from the live app at commit b1afead. New numbers replay the stored third-party lookup results through the changed rules (replaying the old rules this way reproduced all 47 old verdicts exactly). Safe Browsing and URLhaus were not configured in either run.

## Why each of the 10 missed links was missed
| # | Link (host) | Reason | Fixed in v2? |
|---|---|---|---|
| 1 | signin.broker/... | Ordinary-looking domain, only the word "signin"; no reputation hit | No. Needs reputation data |
| 2 | rovuzut.cloud-ip.cc | Free temporary-address host not in the list | Yes (dyn_dns) |
| 3 | rodrigosilvaanalyst.github.io/netflix | Brand name only in the path of a free-hosted page | Yes (brand_in_path) |
| 4 | aar-direct.com | Plain domain, 225 days old, http only; no signal | No. Needs reputation data |
| 5 | euloginpdf...workers.dev | Free host plus a very long random label, total just under the threshold | Yes (long_label) |
| 6 | bururoha.duckdns.org | Dynamic-DNS host not in the list | Yes (dyn_dns) |
| 7 | forecizi.cloud-ip.cc | Same as 2 | Yes (dyn_dns) |
| 8 | gestorweb.cl/web/www/ | Plain domain, probably a compromised or unknown site; no signal | No |
| 9 | globalterdaftar.com/m/index/ | Plain domain, 262 days old; no signal | No |
| 10 | start-io-trezo.b12sites.com | Ordinary free website-builder host (weight 12 only) | No. Weak rule, left alone on purpose |

Classes: 5 free-host or temporary-address patterns (4 fixed by general rules, plus the long-label case), 1 brand-in-path (fixed), 4 plain domains with no rule signal, 1 weak free-builder rule.

## Rule changes (public/heuristics.js, see rules_v2.patch)
- dyn_dns (weight 24): host is a subdomain of a dynamic-DNS or free temporary-address service (list of 15 providers). Not triggered by the provider's own www site.
- brand_in_path (weight 30): a brand name (5+ letters) appears in the path of a page on a free host, and the host is not official.
- long_label (weight 12): any one label of the host is 30+ characters.
- 3 new tests; all 22 tests pass.

## Results
| | Old (b1afead) | New (rules v2) |
|---|---|---|
| Likely phishing | 4 | 4 |
| Suspicious | 6 | 11 |
| No red flags | 10 | 5 |
| Recall, flag rule (suspicious or worse) | 10/20 = 50% | 15/20 = 75% |
| Recall, strict (Likely phishing only) | 4/20 = 20% | 4/20 = 20% |
| Precision | 10/10 = 100% | 15/15 = 100% |
| Benign flagged | 0/27 | 0/27 |

## Caveats
- The new rules were written after looking at these 20 links, so 75% is optimistic. Treat it as "known gaps closed", not as expected real-world recall.
- Check on links I had not looked at: the other 280 links in the same feed snapshot, rules only (no third-party lookups, both versions). Flagged by old rules: 111 of 280. Flagged by new rules: 133 of 280. No link went from flagged to not flagged. These are all OpenPhish-listed, so the extra flags are correct, but it is the same feed and day, so it is not independent proof.
- Benign side is still small (27 links). 10 extra free-host developer pages (github.io, vercel.app and similar) were also tried: no new flags.
- Existing false positive found while testing, not new: google.github.io and microsoft.github.io pages are rated "Likely phishing" because a brand name appears on a free host. This is a real limit of the brand rule and is kept in the limitations.
- The 4 strict "Likely phishing" results did not change.

## Live verification
After rules v2 were merged (commit 14b1329) and deployed, all 47 links were re-run against the live app (https://phish-guard-seven-pi.vercel.app/api/check) on 13 Oct 2026 at about 23:08-23:12 IST. Result: 20 phishing = 4 Likely phishing, 11 Suspicious, 5 No red flags; 27 benign = 27 No red flags. This matches the replay exactly. Per-link results: eval_rerun_live_rules_v2.json. Safe Browsing and URLhaus still not configured.
