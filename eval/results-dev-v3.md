# Evaluation: eval/dev.jsonl

Generated 2026-10-25T00:25:57.120Z by `node scripts/evaluate.mjs eval/dev.jsonl`. All messages are synthetic.

"Flagged" means the verdict was "Some warning signs" or "Several strong warning signs".

| Set | Messages | Flagged | No known warning signs found | A few weak signs | Some warning signs | Several strong warning signs |
|---|---|---|---|---|---|---|
| Scam | 20 | 20 (100%) | 0 | 0 | 1 | 19 |
| Legitimate | 15 | 0 (0%) | 13 | 2 | 0 | 0 |

Warning signs the labeller marked in scam messages: 86; detected: 86 (100%). Counting legitimate messages too: 89 of 93 (96%).

| Sign | Marked in scam messages | Detected there | Marked in all messages | Detected |
|---|---|---|---|---|
| urgency | 12 | 12 (100%) | 16 | 13 (81%) |
| authority_impersonation | 8 | 8 (100%) | 10 | 10 (100%) |
| threat | 9 | 9 (100%) | 10 | 9 (90%) |
| domain_mismatch | 8 | 8 (100%) | 8 | 8 (100%) |
| unusual_payment | 8 | 8 (100%) | 8 | 8 (100%) |
| credentials_request | 8 | 8 (100%) | 8 | 8 (100%) |
| lookalike_domain | 7 | 7 (100%) | 7 | 7 (100%) |
| pay_to_earn | 6 | 6 (100%) | 6 | 6 (100%) |
| unsolicited_contact_switch | 5 | 5 (100%) | 5 | 5 (100%) |
| secrecy | 4 | 4 (100%) | 4 | 4 (100%) |
| gov_edu_mismatch | 4 | 4 (100%) | 4 | 4 (100%) |
| generic_greeting | 2 | 2 (100%) | 2 | 2 (100%) |
| link_shortener | 2 | 2 (100%) | 2 | 2 (100%) |
| suspicious_link | 2 | 2 (100%) | 2 | 2 (100%) |
| freemail_sender | 1 | 1 (100%) | 1 | 1 (100%) |

Scam messages not flagged: none

Legitimate messages flagged (false alarms): none

## Per message

| ID | Label | Difficulty | Verdict | Missed signs | Signs reported |
|---|---|---|---|---|---|
| D-S01 | scam |  | Several strong warning signs |  | domain_mismatch, gov_edu_mismatch, lookalike_domain, pay_to_earn, urgency, authority_impersonation |
| D-S02 | scam |  | Several strong warning signs |  | threat, secrecy, unsolicited_contact_switch, urgency, authority_impersonation |
| D-S03 | scam |  | Several strong warning signs |  | threat, secrecy, unusual_payment, credentials_request, domain_mismatch, gov_edu_mismatch, pay_to_earn, freemail_sender, urgency, generic_greeting, authority_impersonation |
| D-S04 | scam |  | Several strong warning signs |  | unusual_payment, pay_to_earn, unsolicited_contact_switch |
| D-S05 | scam |  | Some warning signs |  | credentials_request |
| D-S06 | scam |  | Several strong warning signs |  | gov_edu_mismatch, lookalike_domain, threat, credentials_request, link_shortener, urgency, authority_impersonation |
| D-S07 | scam |  | Several strong warning signs |  | threat, secrecy, unusual_payment, unsolicited_contact_switch, urgency, authority_impersonation |
| D-S08 | scam |  | Several strong warning signs |  | unusual_payment, domain_mismatch, gov_edu_mismatch, threat, urgency, authority_impersonation |
| D-S09 | scam |  | Several strong warning signs |  | domain_mismatch, lookalike_domain, threat, credentials_request, generic_greeting, authority_impersonation |
| D-S10 | scam |  | Several strong warning signs |  | domain_mismatch, lookalike_domain, credentials_request, urgency, authority_impersonation |
| D-S11 | scam |  | Several strong warning signs |  | unusual_payment, pay_to_earn, urgency |
| D-S12 | scam |  | Several strong warning signs |  | credentials_request, domain_mismatch, gov_edu_mismatch, lookalike_domain, pay_to_earn, authority_impersonation |
| D-S13 | scam |  | Several strong warning signs |  | domain_mismatch, lookalike_domain, credentials_request, urgency, authority_impersonation |
| D-S14 | scam |  | Several strong warning signs |  | threat, secrecy, urgency, authority_impersonation |
| D-S15 | scam |  | Several strong warning signs |  | link_shortener, threat, pay_to_earn, urgency, authority_impersonation |
| D-S16 | scam |  | Several strong warning signs |  | domain_mismatch, pay_to_earn, freemail_sender, unusual_payment, authority_impersonation |
| D-S17 | scam |  | Several strong warning signs |  | domain_mismatch, lookalike_domain, credentials_request, suspicious_link, urgency, authority_impersonation |
| D-S18 | scam |  | Several strong warning signs |  | threat, unusual_payment, unsolicited_contact_switch, urgency, authority_impersonation |
| D-S19 | scam |  | Several strong warning signs |  | unusual_payment, credentials_request, domain_mismatch, lookalike_domain, suspicious_link, authority_impersonation |
| D-S20 | scam |  | Several strong warning signs |  | unusual_payment, pay_to_earn, unsolicited_contact_switch |
| D-L01 | legit |  | No known warning signs found |  | authority_impersonation |
| D-L02 | legit |  | No known warning signs found |  | authority_impersonation |
| D-L03 | legit |  | A few weak signs | urgency, threat | credentials_request, authority_impersonation |
| D-L04 | legit |  | No known warning signs found |  | authority_impersonation |
| D-L05 | legit |  | No known warning signs found |  | authority_impersonation |
| D-L06 | legit |  | No known warning signs found | urgency | authority_impersonation |
| D-L07 | legit |  | A few weak signs |  | unusual_payment, authority_impersonation |
| D-L08 | legit |  | No known warning signs found |  | authority_impersonation |
| D-L09 | legit |  | No known warning signs found |  |  |
| D-L10 | legit |  | No known warning signs found |  | authority_impersonation |
| D-L11 | legit |  | No known warning signs found |  | authority_impersonation |
| D-L12 | legit |  | No known warning signs found |  |  |
| D-L13 | legit |  | No known warning signs found |  | urgency, authority_impersonation |
| D-L14 | legit |  | No known warning signs found |  | authority_impersonation |
| D-L15 | legit |  | No known warning signs found | urgency | authority_impersonation |
