# Evaluation: eval/heldout2.jsonl

Generated 2026-10-25T00:14:40.856Z by `node scripts/evaluate.mjs eval/heldout2.jsonl`. All messages are synthetic.

"Flagged" means the verdict was "Some warning signs" or "Several strong warning signs".

| Set | Messages | Flagged | No known warning signs found | A few weak signs | Some warning signs | Several strong warning signs |
|---|---|---|---|---|---|---|
| Scam | 30 | 22 (73%) | 1 | 7 | 12 | 10 |
| Legitimate | 30 | 4 (13%) | 20 | 6 | 2 | 2 |

Warning signs the labeller marked in scam messages: 103; detected: 80 (78%). Counting legitimate messages too: 80 of 103 (78%).

| Sign | Marked in scam messages | Detected there | Marked in all messages | Detected |
|---|---|---|---|---|
| authority_impersonation | 19 | 18 (95%) | 19 | 18 (95%) |
| urgency | 18 | 11 (61%) | 18 | 11 (61%) |
| threat | 11 | 8 (73%) | 11 | 8 (73%) |
| domain_mismatch | 11 | 7 (64%) | 11 | 7 (64%) |
| unusual_payment | 9 | 9 (100%) | 9 | 9 (100%) |
| unsolicited_contact_switch | 8 | 7 (88%) | 8 | 7 (88%) |
| lookalike_domain | 7 | 4 (57%) | 7 | 4 (57%) |
| gov_edu_mismatch | 6 | 6 (100%) | 6 | 6 (100%) |
| pay_to_earn | 5 | 3 (60%) | 5 | 3 (60%) |
| credentials_request | 5 | 3 (60%) | 5 | 3 (60%) |
| secrecy | 3 | 3 (100%) | 3 | 3 (100%) |
| link_shortener | 1 | 1 (100%) | 1 | 1 (100%) |

Scam messages not flagged: H2-S06, H2-S07, H2-S09, H2-S10, H2-S16, H2-S21, H2-S23, H2-S28

Legitimate messages flagged (false alarms): H2-L01, H2-L06, H2-L16, H2-L30

## Per message

| ID | Label | Difficulty | Verdict | Missed signs | Signs reported |
|---|---|---|---|---|---|
| H2-S01 | scam | easy | Several strong warning signs |  | threat, credentials_request, domain_mismatch, gov_edu_mismatch, lookalike_domain, pay_to_earn, urgency, generic_greeting, authority_impersonation |
| H2-S02 | scam | easy | Some warning signs |  | threat, unsolicited_contact_switch, urgency, authority_impersonation |
| H2-S03 | scam | easy | Some warning signs |  | threat, unsolicited_contact_switch, urgency, authority_impersonation |
| H2-S04 | scam | easy | Several strong warning signs |  | threat, secrecy, unusual_payment, urgency, authority_impersonation |
| H2-S05 | scam | medium | Several strong warning signs |  | threat, domain_mismatch, gov_edu_mismatch, freemail_sender, credentials_request, unsolicited_contact_switch, urgency, authority_impersonation |
| H2-S06 | scam | medium | No known warning signs found | threat, unsolicited_contact_switch |  |
| H2-S07 | scam | easy | A few weak signs | threat, authority_impersonation, lookalike_domain, domain_mismatch | urgency |
| H2-S08 | scam | medium | Several strong warning signs |  | domain_mismatch, gov_edu_mismatch, lookalike_domain, urgency, authority_impersonation |
| H2-S09 | scam | subtle | A few weak signs |  | link_shortener, authority_impersonation |
| H2-S10 | scam | medium | A few weak signs |  | unsolicited_contact_switch |
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
| H2-S21 | scam | subtle | A few weak signs | urgency | unusual_payment, authority_impersonation |
| H2-S22 | scam | medium | Some warning signs |  | pay_to_earn, unusual_payment, authority_impersonation |
| H2-S23 | scam | subtle | A few weak signs |  | unsolicited_contact_switch |
| H2-S24 | scam | medium | Several strong warning signs | pay_to_earn | secrecy, unusual_payment |
| H2-S25 | scam | subtle | Some warning signs | urgency | pay_to_earn, generic_greeting |
| H2-S26 | scam | easy | Some warning signs |  | threat, unsolicited_contact_switch, urgency, authority_impersonation |
| H2-S27 | scam | subtle | Several strong warning signs |  | domain_mismatch, lookalike_domain, authority_impersonation |
| H2-S28 | scam | subtle | A few weak signs | urgency, domain_mismatch, credentials_request | lookalike_domain, authority_impersonation |
| H2-S29 | scam | subtle | Several strong warning signs |  | domain_mismatch, lookalike_domain, suspicious_link, authority_impersonation |
| H2-S30 | scam | subtle | Some warning signs | credentials_request | domain_mismatch, gov_edu_mismatch, freemail_sender, authority_impersonation |
| H2-L01 | legit | subtle | Some warning signs |  | domain_mismatch, authority_impersonation |
| H2-L02 | legit | subtle | No known warning signs found |  | authority_impersonation |
| H2-L03 | legit | subtle | No known warning signs found |  | urgency, authority_impersonation |
| H2-L04 | legit | medium | No known warning signs found |  | authority_impersonation |
| H2-L05 | legit | medium | No known warning signs found |  | authority_impersonation |
| H2-L06 | legit | subtle | Several strong warning signs |  | unusual_payment, gov_edu_mismatch, authority_impersonation |
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
| H2-L27 | legit | subtle | A few weak signs |  | credentials_request, urgency, authority_impersonation |
| H2-L28 | legit | medium | No known warning signs found |  |  |
| H2-L29 | legit | medium | A few weak signs |  | unsolicited_contact_switch |
| H2-L30 | legit | medium | Some warning signs |  | gov_edu_mismatch, authority_impersonation |
