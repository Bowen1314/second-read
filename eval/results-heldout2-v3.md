# Evaluation: eval/heldout2.jsonl

Generated 2026-10-25T00:25:57.351Z by `node scripts/evaluate.mjs eval/heldout2.jsonl`. All messages are synthetic.

"Flagged" means the verdict was "Some warning signs" or "Several strong warning signs".

| Set | Messages | Flagged | No known warning signs found | A few weak signs | Some warning signs | Several strong warning signs |
|---|---|---|---|---|---|---|
| Scam | 30 | 28 (93%) | 0 | 2 | 16 | 12 |
| Legitimate | 30 | 2 (7%) | 23 | 5 | 1 | 1 |

Warning signs the labeller marked in scam messages: 103; detected: 88 (85%). Counting legitimate messages too: 88 of 103 (85%).

| Sign | Marked in scam messages | Detected there | Marked in all messages | Detected |
|---|---|---|---|---|
| authority_impersonation | 19 | 19 (100%) | 19 | 19 (100%) |
| urgency | 18 | 11 (61%) | 18 | 11 (61%) |
| threat | 11 | 10 (91%) | 11 | 10 (91%) |
| domain_mismatch | 11 | 9 (82%) | 11 | 9 (82%) |
| unusual_payment | 9 | 9 (100%) | 9 | 9 (100%) |
| unsolicited_contact_switch | 8 | 8 (100%) | 8 | 8 (100%) |
| lookalike_domain | 7 | 5 (71%) | 7 | 5 (71%) |
| gov_edu_mismatch | 6 | 6 (100%) | 6 | 6 (100%) |
| pay_to_earn | 5 | 3 (60%) | 5 | 3 (60%) |
| credentials_request | 5 | 4 (80%) | 5 | 4 (80%) |
| secrecy | 3 | 3 (100%) | 3 | 3 (100%) |
| link_shortener | 1 | 1 (100%) | 1 | 1 (100%) |

Scam messages not flagged: H2-S16, H2-S23

Legitimate messages flagged (false alarms): H2-L16, H2-L27

## Per message

| ID | Label | Difficulty | Verdict | Missed signs | Signs reported |
|---|---|---|---|---|---|
| H2-S01 | scam | easy | Several strong warning signs |  | threat, credentials_request, domain_mismatch, gov_edu_mismatch, lookalike_domain, pay_to_earn, urgency, generic_greeting, authority_impersonation |
| H2-S02 | scam | easy | Some warning signs |  | threat, unsolicited_contact_switch, urgency, authority_impersonation |
| H2-S03 | scam | easy | Some warning signs |  | threat, unsolicited_contact_switch, urgency, authority_impersonation |
| H2-S04 | scam | easy | Several strong warning signs |  | threat, secrecy, unusual_payment, urgency, authority_impersonation |
| H2-S05 | scam | medium | Several strong warning signs |  | threat, domain_mismatch, gov_edu_mismatch, freemail_sender, credentials_request, unsolicited_contact_switch, urgency, authority_impersonation |
| H2-S06 | scam | medium | Some warning signs |  | threat, unsolicited_contact_switch, authority_impersonation |
| H2-S07 | scam | easy | Several strong warning signs |  | threat, domain_mismatch, gov_edu_mismatch, lookalike_domain, urgency, authority_impersonation |
| H2-S08 | scam | medium | Several strong warning signs |  | domain_mismatch, gov_edu_mismatch, lookalike_domain, urgency, authority_impersonation |
| H2-S09 | scam | subtle | Some warning signs |  | link_shortener, authority_impersonation |
| H2-S10 | scam | medium | Some warning signs |  | pay_to_earn, unsolicited_contact_switch |
| H2-S11 | scam | easy | Some warning signs | threat, pay_to_earn | unusual_payment, urgency |
| H2-S12 | scam | medium | Several strong warning signs |  | domain_mismatch, gov_edu_mismatch, pay_to_earn, freemail_sender, unusual_payment, authority_impersonation |
| H2-S13 | scam | easy | Several strong warning signs |  | threat, secrecy, unusual_payment, unsolicited_contact_switch, urgency, authority_impersonation |
| H2-S14 | scam | subtle | Some warning signs | urgency, lookalike_domain, domain_mismatch | gov_edu_mismatch, authority_impersonation |
| H2-S15 | scam | easy | Several strong warning signs | urgency | threat, secrecy, unusual_payment, authority_impersonation |
| H2-S16 | scam | subtle | A few weak signs | urgency | unusual_payment, authority_impersonation |
| H2-S17 | scam | medium | Some warning signs | lookalike_domain, domain_mismatch | gov_edu_mismatch, credentials_request, urgency, authority_impersonation |
| H2-S18 | scam | subtle | Some warning signs |  | credentials_request |
| H2-S19 | scam | subtle | Some warning signs |  | credentials_request, unsolicited_contact_switch |
| H2-S20 | scam | medium | Some warning signs | urgency | domain_mismatch, freemail_sender, unusual_payment, authority_impersonation |
| H2-S21 | scam | subtle | Some warning signs | urgency | pay_to_earn, unusual_payment, authority_impersonation |
| H2-S22 | scam | medium | Some warning signs |  | pay_to_earn, unusual_payment, authority_impersonation |
| H2-S23 | scam | subtle | A few weak signs |  | unsolicited_contact_switch |
| H2-S24 | scam | medium | Several strong warning signs | pay_to_earn | secrecy, unusual_payment |
| H2-S25 | scam | subtle | Some warning signs | urgency | pay_to_earn, generic_greeting |
| H2-S26 | scam | easy | Some warning signs |  | threat, unsolicited_contact_switch, urgency, authority_impersonation |
| H2-S27 | scam | subtle | Several strong warning signs |  | domain_mismatch, lookalike_domain, authority_impersonation |
| H2-S28 | scam | subtle | Several strong warning signs | urgency | credentials_request, domain_mismatch, lookalike_domain, authority_impersonation |
| H2-S29 | scam | subtle | Several strong warning signs |  | domain_mismatch, lookalike_domain, suspicious_link, authority_impersonation |
| H2-S30 | scam | subtle | Some warning signs | credentials_request | domain_mismatch, gov_edu_mismatch, freemail_sender, authority_impersonation |
| H2-L01 | legit | subtle | No known warning signs found |  | authority_impersonation |
| H2-L02 | legit | subtle | No known warning signs found |  | authority_impersonation |
| H2-L03 | legit | subtle | No known warning signs found |  | urgency, authority_impersonation |
| H2-L04 | legit | medium | No known warning signs found |  | authority_impersonation |
| H2-L05 | legit | medium | No known warning signs found |  | authority_impersonation |
| H2-L06 | legit | subtle | No known warning signs found |  | authority_impersonation |
| H2-L07 | legit | subtle | No known warning signs found |  | urgency |
| H2-L08 | legit | subtle | No known warning signs found |  |  |
| H2-L09 | legit | medium | No known warning signs found |  |  |
| H2-L10 | legit | subtle | No known warning signs found |  | authority_impersonation |
| H2-L11 | legit | subtle | No known warning signs found |  | authority_impersonation |
| H2-L12 | legit | medium | No known warning signs found |  | authority_impersonation |
| H2-L13 | legit | medium | A few weak signs |  | unusual_payment, authority_impersonation |
| H2-L14 | legit | easy | A few weak signs |  | unusual_payment, authority_impersonation |
| H2-L15 | legit | easy | No known warning signs found |  |  |
| H2-L16 | legit | subtle | Several strong warning signs |  | threat, secrecy, authority_impersonation |
| H2-L17 | legit | medium | No known warning signs found |  |  |
| H2-L18 | legit | medium | No known warning signs found |  |  |
| H2-L19 | legit | medium | No known warning signs found |  | authority_impersonation |
| H2-L20 | legit | medium | No known warning signs found |  |  |
| H2-L21 | legit | subtle | No known warning signs found |  |  |
| H2-L22 | legit | easy | No known warning signs found |  | authority_impersonation |
| H2-L23 | legit | medium | No known warning signs found |  | authority_impersonation |
| H2-L24 | legit | easy | A few weak signs |  | unusual_payment, authority_impersonation |
| H2-L25 | legit | subtle | No known warning signs found |  | authority_impersonation |
| H2-L26 | legit | easy | A few weak signs |  | unusual_payment, authority_impersonation |
| H2-L27 | legit | subtle | Some warning signs |  | credentials_request, urgency, authority_impersonation |
| H2-L28 | legit | medium | No known warning signs found |  |  |
| H2-L29 | legit | medium | A few weak signs |  | unsolicited_contact_switch |
| H2-L30 | legit | medium | No known warning signs found |  | authority_impersonation |
