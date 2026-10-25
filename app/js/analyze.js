// Second Read analysis core. Pure function of its inputs: no network, no storage, no randomness.
import { runTextRules, SIGNS } from './rules.js';
import { extractLinks, analyzeUrl, parseSender, isOfficial, isGovSuffix, isEduSuffix, GOV_VENDORS, EXTRA_TOKENS } from './links.js';
import { ORGS, FREEMAIL, SHORTENERS } from './orgs.js';
import { lookup } from './psl.js';
import { SOURCES as S, REPORT } from './sources.js';

export const MAX_CHARS = 20000;
const TIER_POINTS = { strong: 3, moderate: 2, weak: 1, context: 0, info: 0 };
const TIER_ORDER = ['info', 'context', 'weak', 'moderate', 'strong'];
const SIGN_ORDER = Object.keys(SIGNS);
// Services schools commonly use on non-.edu domains (payments, LMS, login, email).
const EDU_VENDORS = new Set(['flywire.com', 'instructure.com', 'duo.com', 'duosecurity.com', 'okta.com', 'joinhandshake.com', 'microsoftonline.com', 'office.com', 'zoom.us', 'qualtrics.com', 'transact.com', 'cashnet.com', 'touchnet.com', 'campuslogic.com', 'terradotta.com', 'sunapsis.com', 'fmjfee.com']);
const CLAIM_SENSITIVE = new Set(['usps', 'ups', 'fedex', 'dhl', 'paypal', 'apple', 'microsoft', 'amazon', 'chase', 'bofa', 'wells', 'citi', 'capone', 'netflix', 'coinbase', 'google', 'duo', 'okta', 'venmo', 'zelle', 'cashapp']);

function maxTier(a, b) { return TIER_ORDER.indexOf(a) >= TIER_ORDER.indexOf(b) ? a : b; }
function downTier(t) { return t === 'strong' ? 'moderate' : t === 'moderate' ? 'weak' : t === 'weak' ? 'context' : t; }

/**
 * @param {{text:string, sender?:string, links?:string, schoolDomain?:string}} input
 */
export function analyze(input) {
  const errors = [];
  let text = String(input.text || '');
  const truncated = text.length > MAX_CHARS;
  if (truncated) {
    text = text.slice(0, MAX_CHARS);
    errors.push(`Only the first ${MAX_CHARS.toLocaleString('en-US')} characters were checked.`);
  }
  const senderRaw = String(input.sender || '').trim();
  const extraLinks = String(input.links || '').split(/\s+/).map((s) => s.trim()).filter(Boolean);
  if (!text.trim() && !senderRaw && !extraLinks.length) {
    return { empty: true, errors: ['Paste a message, a sender, or a link to check.'] };
  }

  // ---- the user's own school (optional) becomes a known organisation
  EXTRA_TOKENS.clear();
  let school = null;
  const sd = String(input.schoolDomain || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^@/, '');
  if (sd) {
    let ascii = sd;
    try { ascii = new URL('http://' + sd).hostname; } catch { /* ignore */ }
    const info = lookup(ascii);
    if (info && info.registrable) {
      const label = info.registrable.split('.')[0];
      school = { id: 'myschool', name: info.registrable, kind: 'edu', re: new RegExp(`\\b${label.replace(/[^a-z0-9-]/g, '')}\\b`, 'i'), domains: [info.registrable], tokens: [label] };
      if (label.length >= 4) EXTRA_TOKENS.set(label, school);
    } else {
      errors.push(`“${sd}” does not look like a domain, so it was ignored.`);
    }
  }
  const orgs = school ? [...ORGS, school] : ORGS;

  // ---- sender
  let sender = parseSender(senderRaw);
  if (sender.kind === 'none') {
    const fromLine = text.match(/^\s*From:\s*(.+)$/im);
    if (fromLine) sender = parseSender(fromLine[1]);
  }

  // ---- links
  const inline = extractLinks(text);
  const seen = new Set();
  const links = [];
  for (const l of inline) {
    const key = l.raw.toLowerCase();
    if (seen.has(key)) { links.find((x) => x.raw.toLowerCase() === key).spans.push([l.start, l.end]); continue; }
    seen.add(key);
    const an = analyzeUrl(l.raw);
    if (l.merchantName) {
      an.merchantName = true;
      an.flags = an.flags.filter((f) => f.sign === 'info');
      an.flags.push({ sign: 'info', tier: 'info', text: 'Written in capitals with no path, this looks like a shop name in a receipt or alert rather than a link, so it is not used for the sender check.' });
    }
    links.push({ ...an, spans: [[l.start, l.end]], source: 'message' });
  }
  for (const raw of extraLinks) {
    if (seen.has(raw.toLowerCase())) continue;
    seen.add(raw.toLowerCase());
    links.push({ ...analyzeUrl(raw), spans: [], source: 'pasted' });
  }

  // the sender's email domain gets the same lookalike checks as a link
  if (sender.kind === 'email') {
    const sa = analyzeUrl('http://' + sender.hostAscii);
    sender.flags = sa.flags.filter((f) => ['lookalike_domain', 'gov_edu_mismatch'].includes(f.sign));
  }

  // ---- signs collector
  const signs = new Map();
  const notes = [];
  const add = (id, tier, ev) => {
    const s = signs.get(id) || { id, tier: 'info', evidence: [] };
    s.tier = maxTier(s.tier, tier);
    if (ev) s.evidence.push(ev);
    signs.set(id, s);
  };

  for (const h of runTextRules(text)) add(h.sign, h.tier, { kind: 'text', text: h.text, start: h.start, end: h.end, tier: h.tier });
  for (const f of sender.flags || []) add(f.sign, f.tier, { kind: 'sender', text: 'Sender address: ' + f.text, tier: f.tier });
  for (const l of links) {
    for (const f of l.flags) {
      if (f.sign === 'info') continue;
      add(f.sign, f.tier, { kind: 'link', text: f.text, link: l.raw, tier: f.tier });
    }
  }

  // ---- organisations the message mentions or claims to be from
  const head = text.slice(0, 220);
  const tail = text.slice(-200);
  const display = sender.kind === 'email' ? sender.display : sender.kind === 'handle' ? sender.value : '';
  const mentioned = [];
  for (const org of orgs) {
    org.re.lastIndex = 0;
    const inText = text.match(org.re);
    const inDisplay = display && org.re.test(display);
    if (!inText && !inDisplay) continue;
    const claim = inDisplay || org.re.test(head) || org.re.test(tail) || org.kind !== 'company';
    mentioned.push({ org, claim, index: inText ? inText.index : -1, match: inText ? inText[0] : display });
  }
  const authority = mentioned.filter((m) => m.org.kind !== 'company');
  for (const m of mentioned.filter((x) => x.org.kind !== 'company' || x.claim)) {
    add('authority_impersonation', 'context', m.index >= 0
      ? { kind: 'text', text: m.match, start: m.index, end: m.index + m.match.length, tier: 'context', note: `Claims to be or mentions ${m.org.name}` }
      : { kind: 'sender', text: `The sender name says “${display}”`, tier: 'context' });
  }

  // ---- domain consistency
  const domains = []; // { reg, info, where }
  if (sender.kind === 'email') domains.push({ reg: sender.registrable, info: sender.info, where: `the sender address ${sender.address}` });
  for (const l of links) {
    if (l.error || !l.registrable || SHORTENERS.has(l.registrable) || l.merchantName) continue;
    domains.push({ reg: l.registrable, info: l.info, where: `the link ${l.registrableUnicode || l.registrable}` });
  }
  const uniqueDomains = [...new Map(domains.map((d) => [d.reg, d])).values()];
  // a .gov/.edu domain spelled with lookalike characters does not count as institutional
  const clean = (d) => !d.reg.includes('xn--');
  const anyGov = uniqueDomains.some((d) => (isGovSuffix(d.info) && clean(d)) || GOV_VENDORS.has(d.reg));
  const anyEdu = uniqueDomains.some((d) => (isEduSuffix(d.info) && clean(d)) || EDU_VENDORS.has(d.reg) || (school && isOfficial(school, d.reg)));
  const anyInstitutional = anyGov || anyEdu;
  let verifiedMatch = false;

  if (uniqueDomains.length) {
    const claimed = mentioned.filter((m) => m.claim);
    const matched = claimed.filter((m) => uniqueDomains.some((d) => isOfficial(m.org, d.reg)));
    verifiedMatch = (matched.length > 0 || anyInstitutional) && uniqueDomains.every((d) =>
      claimed.some((m) => isOfficial(m.org, d.reg)) || isGovSuffix(d.info) || isEduSuffix(d.info) || GOV_VENDORS.has(d.reg) || EDU_VENDORS.has(d.reg) || (school && isOfficial(school, d.reg)));

    // Specific companies / agencies with known domains
    const named = claimed.filter((m) => m.org.domains.length && m.org.kind !== 'edu');
    if (named.length && !matched.some((m) => m.org.domains.length) && !anyInstitutional) {
      const who = [...new Set(named.map((m) => m.org.name))].join(' / ');
      const where = uniqueDomains.map((d) => d.where).join(' and ');
      add('domain_mismatch', 'strong', { kind: 'domain', text: `It mentions ${who}, but ${where} ${uniqueDomains.length > 1 ? 'do' : 'does'} not belong to ${who}.`, tier: 'strong' });
    }
    // Government claims need a government domain
    // (a school or a verified company may mention an agency in passing, e.g. "USCIS must receive your I-765")
    const govClaims = authority.filter((m) => (m.org.kind === 'gov' || m.org.kind === 'foreign-gov') && !(m.org.domains.length === 0 && matched.length));
    if (govClaims.length && !anyInstitutional && !matched.length) {
      add('gov_edu_mismatch', 'strong', { kind: 'domain', text: `It presents itself as ${govClaims[0].org.name}, but none of its addresses (${uniqueDomains.map((d) => d.reg).join(', ')}) is a government domain.`, tier: 'strong' });
    }
    // School claims need a school domain (or a known school vendor)
    const eduClaims = authority.filter((m) => m.org.kind === 'edu');
    if (eduClaims.length && !anyEdu && !govClaims.length) {
      add('gov_edu_mismatch', 'strong', { kind: 'domain', text: `It presents itself as coming from ${eduClaims[0].org.id === 'myschool' ? eduClaims[0].org.name : 'a university office'}, but none of its addresses (${uniqueDomains.map((d) => d.reg).join(', ')}) is a .edu domain${school ? ' or your school\'s domain' : ''}.`, tier: 'strong' });
    }
  }
  // Free webmail claiming to be an institution or a big company
  if (sender.kind === 'email' && FREEMAIL.has(sender.registrable)) {
    const who = mentioned.find((m) => m.claim && (m.org.kind !== 'company' || CLAIM_SENSITIVE.has(m.org.id)) && !isOfficial(m.org, sender.registrable));
    if (who) add('freemail_sender', 'strong', { kind: 'sender', text: `It claims to be ${who.org.name}, but it was sent from a free ${sender.registrable} account.`, tier: 'strong' });
  }

  // ---- a short link in a message that claims to be a known organisation: real ones link to their own site
  if (signs.has('link_shortener') && mentioned.some((m) => m.claim && m.org.domains.length)) {
    signs.get('link_shortener').tier = 'strong';
    signs.get('link_shortener').evidence.push({ kind: 'domain', text: `It says it is from ${mentioned.find((m) => m.claim && m.org.domains.length).org.name}, but uses a shortened link instead of that organisation's own website.`, tier: 'strong' });
  }

  // ---- calibration: a matching address lowers (does not remove) pressure signals
  const moneyOrSecrets = ['unusual_payment', 'pay_to_earn', 'secrecy', 'freemail_sender', 'lookalike_domain'].some((id) => signs.has(id)) ||
    (signs.has('credentials_request') && signs.get('credentials_request').tier === 'strong');
  if (verifiedMatch && !moneyOrSecrets && !signs.has('domain_mismatch') && !signs.has('gov_edu_mismatch')) {
    for (const id of ['threat', 'urgency', 'unsolicited_contact_switch', 'credentials_request']) {
      if (signs.has(id)) signs.get(id).tier = downTier(signs.get(id).tier);
    }
    if (['threat', 'urgency', 'credentials_request', 'unsolicited_contact_switch'].some((id) => signs.has(id))) {
      notes.push('The sender and link addresses match the organisation the message names, so pressure words count for less here. Addresses can still be faked or come from a hacked account, so a match is not proof.');
    }
  }
  // ---- combination that the FBI and FTC warnings describe
  const combo = authority.some((m) => m.org.kind !== 'company') &&
    ['unusual_payment', 'secrecy', 'pay_to_earn'].some((id) => signs.has(id) && signs.get(id).tier !== 'context') ||
    (authority.length && signs.has('threat') && signs.get('threat').tier === 'strong' && (signs.has('unusual_payment') || signs.has('credentials_request')));
  if (combo) notes.push('This combination (an official-sounding sender plus pressure to pay, keep quiet or hand over details) is the exact pattern in the FBI IC3 and FTC impersonation warnings.');

  // ---- score and verdict (qualitative only, never "safe")
  const list = [...signs.values()]
    .map((s) => ({ ...s, ...SIGNS[s.id] }))
    .sort((a, b) => TIER_ORDER.indexOf(b.tier) - TIER_ORDER.indexOf(a.tier) || SIGN_ORDER.indexOf(a.id) - SIGN_ORDER.indexOf(b.id));
  let points = 0, strong = 0;
  const domainGroup = ['domain_mismatch', 'gov_edu_mismatch', 'freemail_sender'];
  let domainCounted = false;
  for (const s of list) {
    if (domainGroup.includes(s.id)) {
      if (domainCounted) continue;
      domainCounted = true;
    }
    points += TIER_POINTS[s.tier];
    if (s.tier === 'strong') strong++;
  }
  if (combo) points += 2;
  const level = points >= 7 || strong >= 2 ? 3 : points >= 3 || strong >= 1 ? 2 : points >= 1 ? 1 : 0;

  list.forEach((s, i) => { s.n = i + 1; });
  const highlights = buildHighlights(text, list, links);
  const scenarios = detectScenarios(text, mentioned, signs, links, sender);

  return {
    empty: false,
    errors,
    truncated,
    text,
    sender,
    links,
    signs: list,
    notes,
    points,
    strongCount: strong,
    level,
    verdict: VERDICTS[level],
    highlights,
    scenarios,
    nextSteps: nextSteps(scenarios, level, sender, links),
    ifAlready: ifAlready(scenarios),
    mentioned: mentioned.map((m) => m.org.name),
  };
}

export const VERDICTS = [
  { level: 0, label: 'No known warning signs found', detail: 'That does not mean it is safe. Second Read only knows a fixed set of rules. A new kind of scam, a hacked real account or a faked sender can look completely normal. If you were not expecting this message, check it yourself anyway.' },
  { level: 1, label: 'A few weak signs', detail: 'These signs also show up in plenty of real messages. If anything feels off, or you were not expecting it, confirm it through a website or phone number you look up yourself.' },
  { level: 2, label: 'Some warning signs', detail: 'Parts of this message match common scam patterns. Do not click, pay or reply until you have checked it through a channel you find yourself.' },
  { level: 3, label: 'Several strong warning signs', detail: 'This message closely matches patterns in FTC and FBI scam warnings. Treat it as a scam unless you can confirm it through a channel you find yourself.' },
];

function buildHighlights(text, list, links) {
  const cands = [];
  for (const s of list) {
    for (const ev of s.evidence) {
      if (ev.kind === 'text') cands.push({ start: ev.start, end: ev.end, n: s.n, sign: s.id, tier: ev.tier });
    }
  }
  for (const l of links) {
    const flagged = l.flags.filter((f) => f.sign !== 'info');
    const top = flagged.reduce((t, f) => maxTier(t, f.tier), 'context');
    const s = flagged.length ? list.find((x) => x.id === flagged.sort((a, b) => TIER_ORDER.indexOf(b.tier) - TIER_ORDER.indexOf(a.tier))[0].sign) : null;
    for (const [start, end] of l.spans) cands.push({ start, end, n: s ? s.n : null, sign: s ? s.id : 'link', tier: s ? top : 'link', link: true });
  }
  // keep strongest, then longest, non-overlapping spans
  cands.sort((a, b) => TIER_ORDER.indexOf(b.tier) - TIER_ORDER.indexOf(a.tier) || (b.end - b.start) - (a.end - a.start) || a.start - b.start);
  const kept = [];
  for (const c of cands) {
    if (c.end <= c.start) continue;
    if (kept.some((k) => c.start < k.end && k.start < c.end)) continue;
    kept.push(c);
  }
  kept.sort((a, b) => a.start - b.start);
  const segs = [];
  let pos = 0;
  for (const k of kept) {
    if (k.start > pos) segs.push({ text: text.slice(pos, k.start) });
    segs.push({ text: text.slice(k.start, k.end), mark: k });
    pos = k.end;
  }
  if (pos < text.length) segs.push({ text: text.slice(pos) });
  return segs;
}

function detectScenarios(text, mentioned, signs, links, sender) {
  const ids = new Set(mentioned.map((m) => m.org.id));
  const t = text.toLowerCase();
  const sc = new Set();
  if (['uscis', 'ice', 'dhs', 'state'].some((i) => ids.has(i)) || /\b(visa|sevis|i-20|immigration|deport|f-1|opt\b|green card|i-94)/i.test(text) || /(移民|签证|遣返)/.test(text)) sc.add('immigration');
  if (['fbi', 'marshals', 'cnpolice', 'cbp'].some((i) => ids.has(i)) || /\b(police|sheriff|officer|warrant|detective)\b/i.test(text) || /(公安|警察|大使馆|领事馆)/.test(text)) sc.add('police');
  if (ids.has('irs') || /\b(tax(es)?|refund|w-2|1040)\b/i.test(text)) sc.add('tax');
  if (['usps', 'ups', 'fedex', 'dhl'].some((i) => ids.has(i)) || /\b(package|parcel|delivery|shipment|tracking|redeliver)/i.test(text) || /(快递|包裹)/.test(text)) sc.add('package');
  if (signs.has('pay_to_earn') && !sc.has('package') || /\b(job|position|hiring|recruit(er|ing)|remote work|work from home|part[- ]time|internship|salary|commission|tasks?)\b/i.test(text)) sc.add('job');
  if (/\b(tuition|bursar|student account|balance due|semester (bill|fee)|enrollment hold|registration hold)\b/i.test(text) || /(学费)/.test(text)) sc.add('tuition');
  if (signs.has('credentials_request') || ['microsoft', 'google', 'duo', 'okta', 'apple'].some((i) => ids.has(i)) || /\b(log ?in|password|netid|account)\b/i.test(t)) sc.add('account');
  if (/\b(code|otp|passcode)\b/i.test(text) || /验证码/.test(text)) sc.add('code');
  if (signs.has('unusual_payment')) sc.add('payment');
  if (/\b(rent|landlord|apartment|lease|sublet|deposit)\b/i.test(text)) sc.add('rental');
  if (sender.kind === 'phone' || /\b(text|sms|reply stop)\b/i.test(text)) sc.add('sms');
  return [...sc];
}

function nextSteps(sc, level, sender, links) {
  const steps = [];
  const has = (s) => sc.includes(s);
  steps.push({ title: 'Check it through a channel you find yourself', body: 'Do not use the links, phone numbers or reply address in the message. Type the organisation\'s website yourself, use a bookmark or the official app, or call the number on your card or your school\'s website.', sources: [S.ftcPhishing, S.ftcGov] });
  if (has('immigration')) steps.push({ title: 'Tell your international student office', body: 'Your school\'s international student office (your DSO) deals with these messages all the time. Contact them using the details on your school\'s website. USCIS fees are paid through your myUSCIS account, and SEVP does not phone students to collect fees.', sources: [S.uscis, S.sevp, S.rutgers] });
  if (has('police')) steps.push({ title: 'You can hang up', body: 'Police, the FBI and embassies do not demand money over the phone, keep you on a video call or tell you to keep it secret. If you feel unsafe right now, call 911.', sources: [S.ic3Gov, S.ic3Chinese, S.embassyCN] });
  if (has('tax')) steps.push({ title: 'Check tax notices at irs.gov', body: 'The IRS never asks for gift cards. If you think you owe something, type irs.gov yourself and check your account, or ask your school\'s international tax help.', sources: [S.irs] });
  if (has('package')) steps.push({ title: 'Track the package yourself', body: 'Go to the courier\'s website by typing it, and use the tracking number from your order confirmation, not from this text. USPS does not text you asking for a redelivery fee.', sources: [S.ftcUsps] });
  if (has('job')) steps.push({ title: 'Real jobs do not make you pay', body: 'Look the job up on the company\'s own careers site. If you are on a student visa, check with your international student office before taking any job, because unauthorised work can affect your status.', sources: [S.ftcJob, S.ftcTask] });
  if (has('tuition')) steps.push({ title: 'Check your balance in your school portal', body: 'Log in to your school\'s portal the way you normally do (not through a link), or call the bursar using the number on the school\'s website.', sources: [S.berkeley] });
  if (has('code')) steps.push({ title: 'Never share a verification code', body: 'A code you did not ask for means someone may be trying to sign in as you. Do not share it. Change your password from the real site or app.', sources: [S.ftcCode] });
  if (has('payment')) steps.push({ title: 'Do not send money this way', body: 'Gift cards, crypto, wire transfers and payment-app transfers are very hard to reverse once sent.', sources: [S.ftcGiftAlert, S.ftcCrypto] });
  const report = [REPORT.ftc];
  if (has('immigration') || has('police')) report.push(REPORT.ic3);
  if (has('sms') || sender.kind === 'phone') report.push(REPORT.spam);
  steps.push({ title: 'Report it (optional)', body: 'Reporting helps others. You can also tell your school\'s international student office or IT help desk.', report, sources: [] });
  return steps;
}

function ifAlready(sc) {
  return [
    { when: 'I paid by card, bank transfer, Zelle or another payment app', what: 'Contact your bank or card company right away, tell them it was a scam, and ask them to stop or reverse the payment.' },
    { when: 'I paid with a gift card', what: 'Contact the company that issued the gift card, tell them it was used in a scam, and keep the card and the receipt.' },
    { when: 'I paid with cryptocurrency or a crypto ATM', what: 'Contact the exchange or ATM operator you used straight away. Crypto payments usually cannot be reversed, so act quickly and keep records.' },
    { when: 'I sent a wire (Western Union, MoneyGram)', what: 'Contact the wire company right away and ask them to reverse the transfer.' },
    { when: 'I typed a password or shared a code', what: 'Change that password from the real site or app, sign out other sessions, and turn on two-step verification. If it was your school login, tell your IT help desk now.' },
    { when: 'I shared my SSN, passport or visa details', what: 'Go to IdentityTheft.gov (from the FTC) for a recovery plan, and tell your international student office.' },
    { when: 'I only clicked a link', what: 'Close the page and do not enter anything. Do not open anything it downloaded. Keep your device updated.' },
  ].map((x) => ({ ...x, source: S.ftcScammed }))
    .concat([{ when: 'I feel threatened or unsafe', what: 'Call 911 if you are in danger right now. Being targeted is not your fault. Second Read is a checking tool, not an emergency service.', source: null }]);
}
