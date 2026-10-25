# Evaluation: eval/heldout.jsonl

Generated 2026-10-25T00:08:29.724Z by `node scripts/evaluate.mjs eval/heldout.jsonl`. All messages are synthetic.

"Flagged" means the verdict was "Some warning signs" or "Several strong warning signs".

| Set | Messages | Flagged | No known warning signs found | A few weak signs | Some warning signs | Several strong warning signs |
|---|---|---|---|---|---|---|
| Scam | 30 | 24 (80%) | 3 | 3 | 8 | 16 |
| Legitimate | 25 | 0 (0%) | 23 | 2 | 0 | 0 |

Warning signs a human labeller marked as present: 142; detected: 82 (58%).

| Sign | Labelled present | Detected |
|---|---|---|
| urgency | 21 | 13 (62%) |
| authority_impersonation | 21 | 11 (52%) |
| domain_mismatch | 16 | 8 (50%) |
| unusual_payment | 16 | 13 (81%) |
| credentials_request | 16 | 5 (31%) |
| pay_to_earn | 13 | 3 (23%) |
| threat | 10 | 7 (70%) |
| gov_edu_mismatch | 9 | 8 (89%) |
| secrecy | 8 | 5 (63%) |
| unsolicited_contact_switch | 6 | 4 (67%) |
| lookalike_domain | 4 | 3 (75%) |
| link_shortener | 2 | 2 (100%) |

Scam messages not flagged: H-S17, H-S20, H-S21, H-S23, H-S28, H-S29

Legitimate messages flagged (false alarms): none

## Per message

| ID | Label | Difficulty | Verdict | Missed signs | Signs reported |
|---|---|---|---|---|---|
| H-S01 | scam | easy | Several strong warning signs | pay_to_earn | threat, domain_mismatch, gov_edu_mismatch, lookalike_domain, urgency, authority_impersonation |
| H-S02 | scam | easy | Several strong warning signs | pay_to_earn | threat, secrecy, credentials_request, domain_mismatch, gov_edu_mismatch, lookalike_domain, unusual_payment, urgency, generic_greeting, authority_impersonation |
| H-S03 | scam | easy | Several strong warning signs |  | threat, secrecy, unusual_payment, unsolicited_contact_switch, urgency, authority_impersonation |
| H-S04 | scam | easy | Several strong warning signs |  | threat, secrecy, unusual_payment, credentials_request, urgency, authority_impersonation |
| H-S05 | scam | medium | Some warning signs | secrecy, unsolicited_contact_switch | threat, urgency, authority_impersonation |
| H-S06 | scam | medium | Several strong warning signs | urgency, threat, secrecy, pay_to_earn | unusual_payment, domain_mismatch, gov_edu_mismatch, unsolicited_contact_switch, authority_impersonation |
| H-S07 | scam | easy | Several strong warning signs | authority_impersonation, gov_edu_mismatch | domain_mismatch, lookalike_domain, pay_to_earn, urgency |
| H-S08 | scam | easy | Some warning signs | pay_to_earn, domain_mismatch | credentials_request, link_shortener |
| H-S09 | scam | medium | Several strong warning signs | unusual_payment, domain_mismatch | gov_edu_mismatch, pay_to_earn, authority_impersonation |
| H-S10 | scam | easy | Several strong warning signs |  | unusual_payment, pay_to_earn, unsolicited_contact_switch |
| H-S11 | scam | easy | Several strong warning signs | pay_to_earn | secrecy, unusual_payment, urgency |
| H-S12 | scam | medium | Several strong warning signs | pay_to_earn | domain_mismatch, freemail_sender, unusual_payment, unsolicited_contact_switch |
| H-S13 | scam | easy | Several strong warning signs | threat, unusual_payment | domain_mismatch, gov_edu_mismatch, lookalike_domain, urgency, authority_impersonation |
| H-S14 | scam | easy | Some warning signs | threat, unusual_payment, domain_mismatch | gov_edu_mismatch, urgency, authority_impersonation |
| H-S15 | scam | medium | Some warning signs | urgency, secrecy, authority_impersonation | unusual_payment |
| H-S16 | scam | easy | Several strong warning signs | authority_impersonation, unsolicited_contact_switch | secrecy, unusual_payment, urgency |
| H-S17 | scam | medium | A few weak signs | pay_to_earn | unusual_payment |
| H-S18 | scam | easy | Several strong warning signs | domain_mismatch | credentials_request, gov_edu_mismatch, threat, link_shortener, urgency, authority_impersonation |
| H-S19 | scam | medium | Several strong warning signs | authority_impersonation, lookalike_domain | unusual_payment, credentials_request, domain_mismatch, threat |
| H-S20 | scam | subtle | No known warning signs found | credentials_request |  |
| H-S21 | scam | medium | No known warning signs found | credentials_request |  |
| H-S22 | scam | medium | Some warning signs | pay_to_earn | domain_mismatch, freemail_sender, unusual_payment, urgency |
| H-S23 | scam | medium | A few weak signs | urgency, pay_to_earn | unusual_payment |
| H-S24 | scam | subtle | Some warning signs | credentials_request, domain_mismatch | gov_edu_mismatch, authority_impersonation |
| H-S25 | scam | subtle | Some warning signs | credentials_request, domain_mismatch | lookalike_domain |
| H-S26 | scam | subtle | Several strong warning signs | credentials_request, authority_impersonation | domain_mismatch, lookalike_domain, urgency, generic_greeting |
| H-S27 | scam | subtle | Several strong warning signs | credentials_request, authority_impersonation | domain_mismatch, lookalike_domain |
| H-S28 | scam | subtle | A few weak signs | domain_mismatch | suspicious_link |
| H-S29 | scam | subtle | No known warning signs found | credentials_request, pay_to_earn |  |
| H-S30 | scam | subtle | Some warning signs | credentials_request, authority_impersonation, domain_mismatch | gov_edu_mismatch |
| H-L01 | legit | medium | No known warning signs found |  |  |
| H-L02 | legit | easy | No known warning signs found |  |  |
| H-L03 | legit | easy | No known warning signs found |  |  |
| H-L04 | legit | easy | No known warning signs found |  |  |
| H-L05 | legit | medium | No known warning signs found | urgency | authority_impersonation |
| H-L06 | legit | medium | No known warning signs found | urgency, authority_impersonation |  |
| H-L07 | legit | medium | No known warning signs found | urgency |  |
| H-L08 | legit | easy | No known warning signs found |  |  |
| H-L09 | legit | easy | A few weak signs |  | unusual_payment |
| H-L10 | legit | easy | No known warning signs found |  |  |
| H-L11 | legit | easy | No known warning signs found |  |  |
| H-L12 | legit | easy | No known warning signs found |  |  |
| H-L13 | legit | medium | A few weak signs |  | unusual_payment |
| H-L14 | legit | easy | No known warning signs found | authority_impersonation |  |
| H-L15 | legit | subtle | No known warning signs found | credentials_request | urgency |
| H-L16 | legit | subtle | No known warning signs found | credentials_request |  |
| H-L17 | legit | easy | No known warning signs found |  |  |
| H-L18 | legit | medium | No known warning signs found | urgency |  |
| H-L19 | legit | medium | No known warning signs found | urgency |  |
| H-L20 | legit | medium | No known warning signs found |  |  |
| H-L21 | legit | subtle | No known warning signs found |  |  |
| H-L22 | legit | easy | No known warning signs found | authority_impersonation |  |
| H-L23 | legit | subtle | No known warning signs found | credentials_request |  |
| H-L24 | legit | medium | No known warning signs found |  | authority_impersonation |
| H-L25 | legit | easy | No known warning signs found |  |  |
