# Evaluation: eval/heldout.jsonl

Generated 2026-10-25T00:25:57.234Z by `node scripts/evaluate.mjs eval/heldout.jsonl`. All messages are synthetic.

"Flagged" means the verdict was "Some warning signs" or "Several strong warning signs".

| Set | Messages | Flagged | No known warning signs found | A few weak signs | Some warning signs | Several strong warning signs |
|---|---|---|---|---|---|---|
| Scam | 30 | 30 (100%) | 0 | 0 | 7 | 23 |
| Legitimate | 25 | 0 (0%) | 23 | 2 | 0 | 0 |

Warning signs the labeller marked in scam messages: 128; detected: 111 (87%). Counting legitimate messages too: 114 of 142 (80%).

| Sign | Marked in scam messages | Detected there | Marked in all messages | Detected |
|---|---|---|---|---|
| urgency | 15 | 13 (87%) | 21 | 14 (67%) |
| authority_impersonation | 17 | 16 (94%) | 21 | 17 (81%) |
| domain_mismatch | 16 | 8 (50%) | 16 | 8 (50%) |
| unusual_payment | 15 | 13 (87%) | 16 | 14 (88%) |
| credentials_request | 13 | 11 (85%) | 16 | 11 (69%) |
| pay_to_earn | 13 | 12 (92%) | 13 | 12 (92%) |
| threat | 10 | 10 (100%) | 10 | 10 (100%) |
| gov_edu_mismatch | 9 | 9 (100%) | 9 | 9 (100%) |
| secrecy | 8 | 8 (100%) | 8 | 8 (100%) |
| unsolicited_contact_switch | 6 | 5 (83%) | 6 | 5 (83%) |
| lookalike_domain | 4 | 4 (100%) | 4 | 4 (100%) |
| link_shortener | 2 | 2 (100%) | 2 | 2 (100%) |

Scam messages not flagged: none

Legitimate messages flagged (false alarms): none

## Per message

| ID | Label | Difficulty | Verdict | Missed signs | Signs reported |
|---|---|---|---|---|---|
| H-S01 | scam | easy | Several strong warning signs |  | threat, domain_mismatch, gov_edu_mismatch, lookalike_domain, pay_to_earn, urgency, authority_impersonation |
| H-S02 | scam | easy | Several strong warning signs |  | threat, secrecy, credentials_request, domain_mismatch, gov_edu_mismatch, lookalike_domain, pay_to_earn, unusual_payment, urgency, generic_greeting, authority_impersonation |
| H-S03 | scam | easy | Several strong warning signs |  | threat, secrecy, unusual_payment, unsolicited_contact_switch, urgency, authority_impersonation |
| H-S04 | scam | easy | Several strong warning signs |  | threat, secrecy, unusual_payment, credentials_request, urgency, authority_impersonation |
| H-S05 | scam | medium | Several strong warning signs |  | threat, secrecy, unsolicited_contact_switch, urgency, authority_impersonation |
| H-S06 | scam | medium | Several strong warning signs | urgency | threat, secrecy, unusual_payment, domain_mismatch, gov_edu_mismatch, lookalike_domain, pay_to_earn, unsolicited_contact_switch, authority_impersonation |
| H-S07 | scam | easy | Several strong warning signs |  | domain_mismatch, gov_edu_mismatch, lookalike_domain, pay_to_earn, urgency, authority_impersonation |
| H-S08 | scam | easy | Several strong warning signs | domain_mismatch | credentials_request, link_shortener, pay_to_earn |
| H-S09 | scam | medium | Several strong warning signs | unusual_payment, domain_mismatch | gov_edu_mismatch, pay_to_earn, authority_impersonation |
| H-S10 | scam | easy | Several strong warning signs |  | unusual_payment, pay_to_earn, unsolicited_contact_switch |
| H-S11 | scam | easy | Several strong warning signs |  | secrecy, unusual_payment, pay_to_earn, urgency, authority_impersonation |
| H-S12 | scam | medium | Several strong warning signs |  | domain_mismatch, pay_to_earn, freemail_sender, unusual_payment, unsolicited_contact_switch, authority_impersonation |
| H-S13 | scam | easy | Several strong warning signs | unusual_payment | threat, domain_mismatch, gov_edu_mismatch, lookalike_domain, urgency, authority_impersonation |
| H-S14 | scam | easy | Several strong warning signs | domain_mismatch | threat, unusual_payment, gov_edu_mismatch, urgency, authority_impersonation |
| H-S15 | scam | medium | Several strong warning signs | urgency | secrecy, unusual_payment, authority_impersonation |
| H-S16 | scam | easy | Several strong warning signs | unsolicited_contact_switch | secrecy, unusual_payment, urgency, authority_impersonation |
| H-S17 | scam | medium | Some warning signs |  | pay_to_earn, unusual_payment, authority_impersonation |
| H-S18 | scam | easy | Several strong warning signs | domain_mismatch | credentials_request, gov_edu_mismatch, threat, link_shortener, urgency, authority_impersonation |
| H-S19 | scam | medium | Several strong warning signs |  | unusual_payment, credentials_request, domain_mismatch, lookalike_domain, threat, authority_impersonation |
| H-S20 | scam | subtle | Some warning signs |  | credentials_request, authority_impersonation |
| H-S21 | scam | medium | Some warning signs |  | credentials_request |
| H-S22 | scam | medium | Several strong warning signs |  | domain_mismatch, pay_to_earn, freemail_sender, unusual_payment, urgency, authority_impersonation |
| H-S23 | scam | medium | Some warning signs |  | pay_to_earn, unusual_payment, urgency, authority_impersonation |
| H-S24 | scam | subtle | Several strong warning signs | domain_mismatch | credentials_request, gov_edu_mismatch, authority_impersonation |
| H-S25 | scam | subtle | Some warning signs | credentials_request, domain_mismatch | lookalike_domain |
| H-S26 | scam | subtle | Several strong warning signs |  | domain_mismatch, gov_edu_mismatch, lookalike_domain, credentials_request, urgency, generic_greeting, authority_impersonation |
| H-S27 | scam | subtle | Several strong warning signs | credentials_request | domain_mismatch, lookalike_domain, authority_impersonation |
| H-S28 | scam | subtle | Some warning signs | domain_mismatch | credentials_request, suspicious_link |
| H-S29 | scam | subtle | Some warning signs | pay_to_earn | credentials_request |
| H-S30 | scam | subtle | Several strong warning signs | authority_impersonation, domain_mismatch | credentials_request, gov_edu_mismatch |
| H-L01 | legit | medium | No known warning signs found |  | authority_impersonation |
| H-L02 | legit | easy | No known warning signs found |  |  |
| H-L03 | legit | easy | No known warning signs found |  | authority_impersonation |
| H-L04 | legit | easy | No known warning signs found |  | authority_impersonation |
| H-L05 | legit | medium | No known warning signs found | urgency | authority_impersonation |
| H-L06 | legit | medium | No known warning signs found | urgency, authority_impersonation |  |
| H-L07 | legit | medium | No known warning signs found | urgency |  |
| H-L08 | legit | easy | No known warning signs found |  | authority_impersonation |
| H-L09 | legit | easy | A few weak signs |  | unusual_payment, authority_impersonation |
| H-L10 | legit | easy | No known warning signs found |  | authority_impersonation |
| H-L11 | legit | easy | No known warning signs found |  |  |
| H-L12 | legit | easy | No known warning signs found |  |  |
| H-L13 | legit | medium | A few weak signs |  | unusual_payment, authority_impersonation |
| H-L14 | legit | easy | No known warning signs found | authority_impersonation |  |
| H-L15 | legit | subtle | No known warning signs found | credentials_request | urgency, authority_impersonation |
| H-L16 | legit | subtle | No known warning signs found | credentials_request |  |
| H-L17 | legit | easy | No known warning signs found |  | authority_impersonation |
| H-L18 | legit | medium | No known warning signs found | urgency |  |
| H-L19 | legit | medium | No known warning signs found | urgency |  |
| H-L20 | legit | medium | No known warning signs found |  | authority_impersonation |
| H-L21 | legit | subtle | No known warning signs found |  | authority_impersonation |
| H-L22 | legit | easy | No known warning signs found | authority_impersonation |  |
| H-L23 | legit | subtle | No known warning signs found | credentials_request |  |
| H-L24 | legit | medium | No known warning signs found |  | authority_impersonation |
| H-L25 | legit | easy | No known warning signs found |  |  |
