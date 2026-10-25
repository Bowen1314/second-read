# Second Read

**A private second opinion on a suspicious message, before you click, pay or reply.**

Live: https://bowen1314.github.io/second-read/ · Demo video: [demo/demo.mp4](demo/demo.mp4) ([transcript](demo/transcript.md))

Second Read is a small web app for **international university students in the US** who get a text, email or chat message that pressures them: a "USCIS officer" saying their SEVIS record will be terminated, a "Chinese police" call about money laundering, a package "redelivery fee", a task job that needs a crypto deposit, a "student tax" bill. These are the exact scripts that the FTC, the FBI's IC3 and university international offices warn about ([sources](#sources)).

You paste the message, plus the sender and any link if you have them. Second Read then:

- **highlights each warning sign in the message itself**, numbered and coded by strength (colour *and* line style), and explains each one in plain language with a link to the public guidance it comes from;
- **takes every link and the sender address apart without opening them**: the real registrable domain (checked against the Public Suffix List), decoded punycode with impostor characters highlighted (for example a Cyrillic "а" in "аpple.com"), lookalike and typo-squatted brand names, decoy subdomains, URL shorteners, addresses hidden before an `@`, raw IP addresses, and links tucked inside other links;
- checks whether the **organisation the message claims to be** matches the domains it actually uses, including government and school claims from non-.gov / non-.edu addresses and official-sounding messages from free webmail;
- gives a **calibrated summary that never says "safe"**: *Several strong warning signs*, *Some warning signs*, *A few weak signs*, or *No known warning signs found: that does not mean it is safe*;
- suggests **safe next steps** for the situation (contact the organisation through a channel you look up yourself, tell your international student office, how to report), and what to do **if you already paid, clicked or shared a code**.

It works fully on your device: no AI service, no API, no lookups, no storage. That is a property you can check, not just a promise (see [Privacy](#privacy-and-trust-design)).

> Second Read is a prototype checking aid. It is not a guarantee and not an emergency service. If you are in danger, call 911.

## One safer outcome (synthetic example)

**Before.** Lin, a fictional first-year F-1 student, gets a voicemail: an "officer" from U.S. Citizenship and Immigration Services says her SEVIS record will be terminated today, a warrant will be issued unless she pays a $950 "correction fee" in Target gift cards, and she must not discuss it with her school. This is the pattern in the FBI IC3's September 2026 PSA on law-enforcement and government impersonation, which names international students as targets. Frightened and told to keep it secret, the likely next step is to buy the cards.

**After.** Lin pastes the transcript into Second Read. It shows **"Several strong warning signs"**, highlights the threat ("SEVIS record will be terminated", "warrant", "arrest"), the secrecy demand, the gift-card payment, the fee and the call-back number, and notes that an official-sounding caller plus pressure to pay and keep quiet is the exact combination in the FBI and FTC warnings. Its first suggested steps are to check through a channel she finds herself and to **tell her international student office using the contact details on her school's website**, noting that USCIS fees are paid through a myUSCIS account and SEVP does not phone students to collect fees. She hangs up and calls her DSO instead of paying.

## Run it

It is a static site with no build step and no runtime dependencies.

```bash
git clone https://github.com/Bowen1314/second-read && cd second-read
python3 -m http.server 8000 --directory app    # then open http://localhost:8000
```

(Opening `app/index.html` straight from disk will not work because browsers block ES modules on `file://`.)

Tests and evaluation need Node 20+:

```bash
node --test tests/*.test.mjs                 # unit tests (rules, link anatomy, PSL test vectors, punycode)
node scripts/evaluate.mjs eval/heldout2.jsonl # accuracy on a labelled synthetic set
npm install && npx playwright test            # browser tests (privacy, offline, accessibility...)
BASE_URL=https://bowen1314.github.io/second-read/ npx playwright test --grep @smoke   # smoke test the live site
node scripts/build-data.mjs                   # rebuild app/data/ from the vendored upstream files
```

## How it works

Everything lives in `app/` and is plain JavaScript modules:

| File | What it does |
|---|---|
| `js/rules.js` | The text rules: readable regular expressions grouped into warning signs, each with a strength tier (strong / moderate / weak / context), a plain explanation and its sources. Negated phrasing ("we will **never** ask for your code", "call the number **on the back of your card**") is not counted. Includes a small set of Simplified Chinese phrases. |
| `js/links.js` | Link and sender anatomy: extraction from free text (bare domains must end in a real TLD), parsing with the browser's URL parser, registrable domain via the PSL, punycode decoding, lookalike checks (Unicode confusables skeleton, mixed scripts, one-edit and digit-swap typos of known brands, brand names inside unrelated domains, decoy subdomains, "gov"/"edu" used as a word), shorteners, `@` tricks, IP hosts, embedded URLs in parameters. |
| `js/orgs.js` | A hand-compiled table of organisations that scams impersonate (USCIS, ICE/SEVP, IRS, SSA, State Dept, FBI, USPS, couriers, banks, payment apps, login providers, E-ZPass...) with the domains they really use, plus lists of free-mail providers and URL shorteners. |
| `js/analyze.js` | Combines everything: claimed-organisation vs real-domain checks, a calibration step (a sender whose address matches the named organisation makes pressure words count for less, but never removes money, secrecy or lookalike signs), a points-based verdict with four qualitative levels, highlights, and scenario-based next steps. Pure function: same input, same output. |
| `js/psl.js`, `js/punycode.js` | Public Suffix List lookup (wildcards, exceptions, private section) and an RFC 3492 punycode decoder, both written for this project. |
| `js/ui.js` | The interface. All user text is rendered with `textContent`; user links are shown as text and never made clickable. |
| `sw.js` | Service worker that pre-caches the app's own files so it works offline. |

### Data sources and licenses

| Data | Source | License |
|---|---|---|
| Public Suffix List (`data/psl/public_suffix_list.dat`, version 2026-10-22, commit `8437e52`) and the derived `app/data/psl-data.js` | https://publicsuffix.org/ · https://github.com/publicsuffix/list | Mozilla Public License 2.0 (`data/psl/LICENSE`) |
| PSL test vectors (`data/psl/test_psl.txt`) | publicsuffix/list repository | Public domain (CC0) |
| Unicode confusables (`data/unicode/confusables.txt`, version 18.0.0) and the derived subset `app/data/confusables-data.js` (260 characters that look like ASCII letters or digits) | https://www.unicode.org/reports/tr39/ | Unicode License v3 (`data/unicode/LICENSE.txt`) |
| Organisation and domain table | Compiled by hand for this project from each organisation's own website | MIT (this project) |
| Evaluation messages (`eval/*.jsonl`) | Synthetic, written for this project. No real messages, people or phone numbers (phone numbers use the fictional 555-01XX range; scam domains are invented) | MIT (this project) |

### Sources

The warning signs and advice are paraphrased from these public pages (each sign in the app links to the ones it relies on):

- FTC: [How To Recognize and Avoid Phishing Scams](https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams) · [Spam Text Messages](https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages) · [USPS text scams (2025)](https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam) · [Only scammers ask for gift cards (2024)](https://consumer.ftc.gov/consumer-alerts/2024/10/only-scammers-tell-you-buy-gift-card-pay-them) · [Gift Card Scams](https://consumer.ftc.gov/articles/gift-card-scams) · [Government Impersonation](https://consumer.ftc.gov/articles/how-avoid-government-impersonation-scam) · [Job Scams](https://consumer.ftc.gov/articles/job-scams) · [Task scams (2025)](https://consumer.ftc.gov/consumer-alerts/2025/08/how-spot-avoid-task-scams) · [Verification codes (2024)](https://consumer.ftc.gov/node/84809) · [Cryptocurrency and Scams](https://consumer.ftc.gov/articles/what-know-about-cryptocurrency-and-scams) · [What To Do if You Were Scammed](https://consumer.ftc.gov/articles/what-do-if-you-were-scammed)
- FBI IC3 PSAs: [Law enforcement and government impersonation (Sep 2026)](https://www.ic3.gov/PSA/2026/PSA260917) · [Impersonation targeting Middle Eastern students (May 2025)](https://www.ic3.gov/PSA/2025/PSA250513) · [Chinese police imposters (Jan 2024)](https://www.ic3.gov/PSA/2024/PSA240103)
- Federal agencies: [USCIS Common Scams](https://www.uscis.gov/scams-fraud-and-misconduct/avoid-scams/common-scams) · [IRS Tax scams](https://www.irs.gov/help/tax-scams) · [SEVP will never call you to collect the I-901 fee](https://studyinthestates.dhs.gov/2015/05/students-sevp-will-never-call-you-collect-your-i-901-sevis-fee) · [get.gov: .gov eligibility](https://get.gov/domains/eligibility/)
- Universities: [Rutgers Global](https://global.rutgers.edu/scams) · [UC Berkeley International Office](https://internationaloffice.berkeley.edu/node/378) · [Ohio State Student Legal Services](https://studentlegal.osu.edu/international-students/scams) · [CSUN](https://www.csun.edu/international/international-students/scam-and-fraud-advisory)
- [Embassy of the PRC in the US: notice on telecom fraud (2025)](https://us.china-embassy.gov.cn/lsfw/lsxz/lstx/202501/t20250104_11527001.htm) · [Unicode UTS #39](https://www.unicode.org/reports/tr39/)

## Privacy and trust design

- **The browser blocks sending.** `index.html` sets a Content Security Policy as its first element: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; worker-src 'self'; manifest-src 'self'`. `fetch`, XHR, beacons, form posts and images to other hosts are refused by the browser, not just unused by our code. (GitHub Pages cannot set HTTP headers, so the policy is a `<meta>` tag; `frame-ancestors` cannot be set that way.)
- **No storage.** No cookies, localStorage, sessionStorage or IndexedDB. The fields are cleared when you press Clear, leave the page or close it, including when the browser restores a page from its back/forward cache.
- **No AI and no lookups.** Rules run in the tab. Links are never fetched, never resolved and never made clickable.
- **Offline.** A service worker pre-caches the app's own 16 files. It only handles same-origin GET requests for those files; the page never sends it messages, so it never sees what you paste. (A meta CSP does not govern the service worker script itself; its code is short and in `app/sw.js`.)
- **Third-party "helpers" are turned off.** The input boxes disable spell-check, autocorrect and Grammarly, because enhanced spell-check and writing extensions can send typed text to online services.
- **A live counter** in the privacy section shows how many network requests the page has made since it finished loading its own files.
- **Uncertainty is explicit.** There is no numeric "risk score". The lowest level says "No known warning signs found: that does not mean it is safe", every result lists what the check cannot see, and the address check explains that a matching domain is not proof.

## Testing

All of the following were run on 2026-10-24.

**Unit tests** (`node --test tests/*.test.mjs`): 17 tests, all passing. They include all 78 official Public Suffix List test vectors, RFC 3492 punycode samples, link extraction and anatomy cases, negation handling ("never share this code"), Chinese-language rules, determinism, and a check that no verdict ever calls a message safe. They also run in the GitHub Actions deploy workflow.

**Browser tests** (`npx playwright test`, Chromium): 11 tests, all passing against both the local server and the live GitHub Pages site. They check:
- the core flow (example message → verdict, highlights, explained signs, next steps; link anatomy; punycode decoding);
- **zero network requests during a check**, and that no request ever contains a marker string pasted into the message, sender or link fields;
- **the CSP is live**: `fetch`, XHR and an external image from the page are all blocked and reported as `connect-src` / `img-src` violations;
- **nothing is stored**: no cookies, web storage or IndexedDB after a check, and the offline cache contains only the app's own files;
- fields clear on Clear and when leaving and coming back;
- **works offline** after the first visit;
- errors are shown in plain language (empty input, unparseable link, very long input);
- user links are never clickable, and a clean message is never called safe;
- no horizontal scrolling at a 375 px phone width;
- **axe-core** reports no serious or critical accessibility issues, before and after a check, in light and dark mode.

The whole browser suite was also repeated 5 times in a row (55/55 passing). In one earlier run during development a single test failed and did not fail again; I could not reproduce it.

### Accuracy on synthetic messages

Evidence matters more than claims, so the rules were measured on labelled **synthetic** messages modelled on the advisories above. "Flagged" means the verdict was *Some warning signs* or *Several strong warning signs*.

To limit fooling myself, test sets were written by separate AI sessions that were not allowed to see the rules, and each set was frozen in git before the rules were run on it:

1. `eval/dev.jsonl` (20 scam, 15 legitimate) was written by me and used to build and tune the rules. Its results (20/20 flagged, 0/15 false alarms) say nothing about real accuracy.
2. `eval/heldout.jsonl` (30 scam, 25 legitimate) was written independently and frozen (commit `073aeeb`) before any rule existed. Rules v1 (commit `6df8d0c`) were run on it **once**.
3. After looking at what v1 missed, I made general rule changes (v2, commit `b4f9b3a`). A second independent set, `eval/heldout2.jsonl` (30 scam, 30 legitimate, 12 of them deliberately tricky), was then written and frozen (commit `4d75262`), and v2 was run on it **once**.
4. After looking at v2's misses and false alarms there, I fixed several logic bugs (v3, the current version). A third independent set was planned to measure v3, but its generation was blocked by an automated safety filter and it was not produced, so **v3 has no independent measurement**.

| Rules | Test set | Independent? | Scams flagged | Legitimate flagged (false alarms) | Warning signs found in scam messages |
|---|---|---|---|---|---|
| v1 | held-out 1 | **yes** | 24 / 30 (80%) | 0 / 25 | 79 / 128 (62%) |
| v2 | held-out 2 | **yes** | 22 / 30 (73%) | 4 / 30 (13%) | 80 / 103 (78%) |
| v3 (current) | held-out 1 | no (looked at it) | 30 / 30 | 0 / 25 | 111 / 128 |
| v3 (current) | held-out 2 | no (looked at it) | 28 / 30 | 2 / 30 | 88 / 103 |
| v3 (current) | dev | no (tuned on it) | 20 / 20 | 0 / 15 | 86 / 86 |

The honest summary is the two independent rows: on messages it had never seen, the rules flagged roughly three to four in five scams, with between 0 and 4 false alarms out of 25–30 legitimate look-alikes. The sets are small and synthetic and were written by AI models, not collected from real victims, so these numbers show the rules behave sensibly on the patterns in public advisories; they are not a real-world detection rate. Full per-message tables are in `eval/results-*.md`.

What the independent tests revealed (examples):
- **Missed:** a "wrong number" romance/investment opener with no money mentioned yet; a Chinese-language "customs seized a parcel with passports in your name" text (v2); a sublet "holding fee" on Venmo for a room the poster "can't show"; a bank "fraud department" text asking you to reply YES/NO and wait for a call.
- **False alarms:** a friend's WeChat message warning about fake embassy calls, and a university IT notice describing a phishing campaign. Both *quote* scam wording, and rules cannot tell quoting from asking. (v2 also flagged a school OPT reminder that mentions USCIS and a DHL notice that mentions customs; these were logic bugs fixed in v3.)

## Limitations

- **Rules miss things.** New scripts, polite messages with no money or threat yet ("wrong number" openers), and scams that move to a phone call can show *No known warning signs found*. That is why the lowest level never says safe.
- **It cannot verify a sender.** Display names, phone numbers and email "From" lines can be spoofed, and real accounts get hacked. A matching domain lowers the weight of pressure words but is never treated as proof.
- **It cannot see** images, screenshots, QR codes, attachments, voice calls, or where a link really leads (it never opens links, by design). It cannot expand short links.
- **Quoted scam wording is over-flagged**, such as a friend's or a university's warning about scams.
- **Coverage:** English, plus a small set of Simplified Chinese phrases. The organisation table covers common US agencies, couriers, banks and services, not every university; adding your school's email domain helps.
- **The evidence is synthetic and small** (see above). There has been no user testing with real students.
- **Not an emergency service and not a guarantee.**

## Credits

- Public Suffix List, Mozilla Public License 2.0. Unicode confusables data, Unicode License v3. PSL test vectors, CC0.
- Development and testing only (not shipped to users): [Playwright](https://playwright.dev/) (Apache-2.0), [axe-core](https://github.com/dequelabs/axe-core) (MPL-2.0), Node.js test runner. The demo video was recorded with Playwright and encoded with FFmpeg.
- Warning-sign wording and advice paraphrase public guidance from the FTC, FBI IC3, USCIS, IRS, DHS SEVP, get.gov, the Embassy of the PRC in the US, and the Rutgers, UC Berkeley, Ohio State and CSUN international offices (links above).
- No other pre-existing code, assets or templates were used. The icon and all code were made for this project.

## AI assistance

Built with an AI coding assistant (Claude). The assistant wrote most of the code, rules, tests and documentation; synthetic test messages for the held-out sets were generated by separate AI sessions that could not see the rules. Design decisions, testing and the write-up were reviewed by the author.

## Built during

Built during **SafeSpace Hacks (October 17 – November 22, 2026)**. All project work, including the code, rules, data processing, tests and documents, was created from October 24, 2026 onward. Pre-existing components are limited to the third-party data and tools credited above.

## License

Code and synthetic data: MIT (see `LICENSE`). `app/data/psl-data.js` and `data/psl/` remain under MPL 2.0; `app/data/confusables-data.js` and `data/unicode/` under the Unicode License v3.
