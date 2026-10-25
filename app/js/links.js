// Link anatomy: take a link apart WITHOUT ever fetching it. Everything here is string analysis.
import { lookup, isKnownTld } from './psl.js';
import { toUnicode } from './punycode.js';
import { CONFUSABLES } from '../data/confusables-data.js';
import { ORGS, SHORTENERS } from './orgs.js';

// Brand label -> org, e.g. "paypal" -> PayPal (from each org's official registrable domains).
const BRAND_LABELS = new Map();
const BRAND_TOKENS = new Map();
for (const org of ORGS) {
  for (const d of org.domains) {
    const info = lookup(d);
    if (!info || !info.registrable) continue;
    const label = info.registrable.slice(0, info.registrable.length - info.publicSuffix.length - 1);
    if (label.length >= 3 && !BRAND_LABELS.has(label)) BRAND_LABELS.set(label, org);
  }
  for (const t of org.tokens) if (!BRAND_TOKENS.has(t)) BRAND_TOKENS.set(t, org);
}

// Mail/notification vendors that real agencies and schools use (e.g. USCIS emails come via GovDelivery).
export const GOV_VENDORS = new Set(['govdelivery.com', 'granicus.com']);
// Extra brand tokens supplied at runtime (the user's own school, e.g. "rutgers").
export const EXTRA_TOKENS = new Map();

export function isOfficial(org, registrable) {
  return !!registrable && org.domains.some((d) => registrable === d || registrable.endsWith('.' + d));
}

export function officialOrgFor(registrable) {
  return ORGS.find((o) => isOfficial(o, registrable)) || null;
}

/** True for registrable domains under a government or education suffix (.gov, .mil, .edu, gov.cn, ac.uk ...). */
export function isGovEduSuffix(info) {
  if (!info) return false;
  const ps = info.publicSuffix;
  return /(^|\.)(gov|mil|edu)$/.test(ps) || /^(gov|edu|ac|mil)\.[a-z]{2}$/.test(ps);
}
export function isGovSuffix(info) {
  if (!info) return false;
  return /(^|\.)(gov|mil)$/.test(info.publicSuffix) || /^gov\.[a-z]{2}$/.test(info.publicSuffix);
}
export function isEduSuffix(info) {
  if (!info) return false;
  return /(^|\.)edu$/.test(info.publicSuffix) || /^(edu|ac)\.[a-z]{2}$/.test(info.publicSuffix);
}

// ---------------------------------------------------------------- extraction
const TRAIL = /[.,;:!?)\]}'"»”’。，；：！？）】」]+$/;
const LINK_RE = /\b(?:https?:\/\/|hxxps?:\/\/)[^\s<>"'“”]+|\bwww\.[^\s<>"'“”]+|(?<![@\w.-])(?:[a-z0-9¡-￿](?:[a-z0-9¡-￿-]{0,62})\.)+(?:[a-z¡-￿]{2,63}|xn--[a-z0-9-]{2,59})(?::\d{2,5})?(?:\/[^\s<>"'“”]*)?/giu;
const FILE_EXT = new Set(['zip', 'mov', 'exe', 'pdf', 'jpg', 'png', 'doc', 'txt']);

/** Find link-like substrings in free text. Bare domains must end in a real (PSL-listed) TLD. */
export function extractLinks(text) {
  const out = [];
  if (!text) return out;
  for (const m of text.matchAll(LINK_RE)) {
    let raw = m[0].replace(TRAIL, '');
    if (m[0].length > raw.length && m[0][raw.length] === ')' && raw.includes('(')) raw += ')';
    if (!raw) continue;
    const hasScheme = /^(https?|hxxps?):\/\//i.test(raw) || /^www\./i.test(raw);
    if (!hasScheme) {
      const host = raw.split(/[/:]/)[0];
      const tld = host.split('.').pop().toLowerCase();
      let ascii;
      try { ascii = new URL('http://' + host).hostname; } catch { continue; }
      if (!isKnownTld(ascii)) continue;
      if (FILE_EXT.has(tld) && !raw.includes('/')) continue;
      if (/^\d+(\.\d+)*$/.test(host)) continue; // version numbers, amounts
      if (host.split('.').some((l) => l.length === 1) && host.length < 6) continue; // "e.g", "U.S"
    }
    // "BESTBUY.COM" in a bank alert is a merchant name, not a link: bare, all caps, no path
    const merchantName = !/^(https?|hxxps?):\/\/|^www\./i.test(raw) && !raw.includes('/') && raw === raw.toUpperCase() && /[A-Z]/.test(raw);
    out.push({ raw, start: m.index, end: m.index + raw.length, merchantName });
  }
  return out;
}

// ---------------------------------------------------------------- similarity helpers
function skeleton(s) {
  let out = '';
  for (const ch of s) out += CONFUSABLES[ch] ?? ch;
  return out.toLowerCase();
}
function asciiHomoglyphs(label) {
  const base = label.replace(/rn/g, 'm').replace(/vv/g, 'w').replace(/0/g, 'o').replace(/3/g, 'e').replace(/5/g, 's').replace(/\$/g, 's').replace(/4/g, 'a');
  return [base.replace(/1/g, 'l'), base.replace(/1/g, 'i'), base.replace(/[1l]/g, 'i'), base.replace(/[1i]/g, 'l')];
}
function dl1(a, b) {
  // true when a and b differ by exactly one edit (insert/delete/substitute/adjacent swap)
  if (a === b) return false;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  while (i < la && i < lb && a[i] === b[i]) i++;
  if (la === lb) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true;
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
  }
  return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}
function hasNonAscii(s) { return /[^\x00-\x7f]/.test(s); }
function scriptName(ch) {
  for (const sc of ['Cyrillic', 'Greek', 'Armenian', 'Cherokee', 'Han', 'Hiragana', 'Katakana', 'Hangul', 'Arabic', 'Hebrew', 'Latin']) {
    if (new RegExp(`\\p{Script=${sc}}`, 'u').test(ch)) return sc === 'Latin' ? 'accented Latin' : sc;
  }
  return 'non-Latin';
}
/** Every non-ASCII character in a hostname, with what it imitates. */
export function oddChars(hostUnicode) {
  const out = [];
  for (const ch of new Set(hostUnicode)) {
    if (!hasNonAscii(ch)) continue;
    out.push({ ch, cp: 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'), script: scriptName(ch), looksLike: CONFUSABLES[ch] || null });
  }
  return out;
}
function describeOdd(list) {
  return list.map((c) => `${c.script} “${c.ch}” (${c.cp})${c.looksLike ? `, which looks like “${c.looksLike}”` : ''}`).join('; ');
}
function scriptsOf(s) {
  const set = new Set();
  for (const ch of s) {
    if (/[a-z0-9-]/i.test(ch)) set.add('Latin');
    else if (/\p{Script=Cyrillic}/u.test(ch)) set.add('Cyrillic');
    else if (/\p{Script=Greek}/u.test(ch)) set.add('Greek');
    else if (/\p{Script=Latin}/u.test(ch)) set.add('Latin');
    else if (/\p{Script=Han}/u.test(ch)) set.add('Han');
    else if (/\p{Script=Armenian}/u.test(ch)) set.add('Armenian');
    else if (/\p{Script=Cherokee}/u.test(ch)) set.add('Cherokee');
    else set.add('Other');
  }
  return set;
}

// ---------------------------------------------------------------- anatomy
/**
 * Take one link apart. Never fetches anything.
 * @returns anatomy object with `flags`: [{ sign, tier, text }]
 */
export function analyzeUrl(raw) {
  const a = { raw, flags: [], params: [] };
  let s = raw.trim().replace(/^hxxp/i, 'http');
  a.schemeGiven = /^[a-z][a-z0-9+.-]*:\/\//i.test(s);
  if (!a.schemeGiven) s = 'http://' + s;
  let u;
  try {
    u = new URL(s);
  } catch {
    a.error = 'This could not be read as a web address, so it was not analysed.';
    return a;
  }
  if (!/^https?:$/.test(u.protocol)) {
    a.error = `This uses the "${u.protocol.replace(':', '')}" scheme, which Second Read does not analyse. Treat it with caution.`;
    return a;
  }
  a.scheme = a.schemeGiven ? u.protocol.replace(':', '') : '(none given)';
  a.hostAscii = u.hostname.toLowerCase();
  a.hostUnicode = toUnicode(a.hostAscii);
  a.oddChars = oddChars(a.hostUnicode);
  a.port = u.port || '';
  a.path = decodeSafe(u.pathname);
  a.fragment = u.hash ? decodeSafe(u.hash) : '';
  const add = (sign, tier, text) => a.flags.push({ sign, tier, text });

  if (u.username || u.password) {
    add('suspicious_link', 'strong', `Everything before the “@” (“${decodeSafe(u.username)}”) is ignored by the browser. The link really goes to ${a.hostUnicode}.`);
  }
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(a.hostAscii) || a.hostAscii.startsWith('[');
  if (isIp) {
    a.registrable = a.hostAscii;
    add('suspicious_link', 'moderate', 'The link points to a raw IP address instead of a named website. Real organisations almost never send links like this.');
  } else {
    const info = lookup(a.hostAscii);
    a.info = info;
    a.publicSuffix = info ? info.publicSuffix : '';
    a.registrable = info && info.registrable ? info.registrable : a.hostAscii;
    a.registrableUnicode = toUnicode(a.registrable);
    a.subdomain = info ? info.subdomain : '';
    if (info && !info.listed) add('suspicious_link', 'weak', `“.${a.publicSuffix}” is not a recognised internet domain ending.`);
    if (info && info.privateSuffix) {
      add('free_hosting', 'weak', `“${a.publicSuffix}” is a service where anyone can create their own site. The owner here is “${a.registrableUnicode}”, not the service.`);
    }
    if (a.hostAscii.includes('xn--')) {
      add('info', 'info', `The address is written in “punycode” (${a.hostAscii}), the form browsers use for non-English letters. Decoded, it is “${a.hostUnicode}”: see the highlighted characters.`);
    }
    if (SHORTENERS.has(a.registrable)) {
      add('link_shortener', 'moderate', `${a.registrable} is a link shortener. The real destination is hidden, and Second Read will not open the link to find out.`);
    }
    lookalikeChecks(a, add);
  }
  if (a.port && !['80', '443'].includes(a.port)) add('suspicious_link', 'weak', `The link uses an unusual port number (${a.port}).`);
  if (a.schemeGiven && a.scheme === 'http') add('info', 'info', 'The link is not encrypted (http, not https). That alone does not make it fake, and https does not make a site real.');

  for (const [key, value] of u.searchParams) {
    const v = value || '';
    const embedded = /^(https?:\/\/|www\.)/i.test(v) || /^(https?%3a|%2f%2f)/i.test(v) || /\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(v);
    a.params.push({ key, value: v, isUrl: embedded });
    if (embedded) {
      let inner = v;
      try { inner = decodeURIComponent(v); } catch { /* keep raw */ }
      add('suspicious_link', 'moderate', `The link carries another address inside it (“${key}” = ${truncate(inner, 80)}). Links like this can bounce you somewhere else.`);
    }
  }
  return a;
}

function lookalikeChecks(a, add) {
  const reg = a.registrable;
  const info = a.info;
  if (!info || !info.registrable) return;
  const official = officialOrgFor(reg);
  const labelAscii = reg.slice(0, reg.length - info.publicSuffix.length - 1);
  const labelUni = toUnicode(labelAscii);

  // 1. Lookalike characters (IDN homographs)
  if (hasNonAscii(labelUni)) {
    const scripts = scriptsOf(labelUni);
    const sk = skeleton(labelUni);
    const brand = BRAND_LABELS.get(sk) || [...BRAND_LABELS.keys()].map((k) => (sk.includes(k) && k.length >= 4 ? BRAND_LABELS.get(k) : null)).find(Boolean);
    if (brand) {
      const odd = oddChars(labelUni);
      add('lookalike_domain', 'strong', `This is not ${brand.name}. “${labelUni}” contains ${odd.length === 1 ? 'a character' : odd.length + ' characters'} from another alphabet: ${describeOdd(odd)}. On screen it looks like “${sk}”, but it is a different domain.`);
    } else if (sk !== labelUni.toLowerCase() && /^[a-z0-9-]+$/.test(sk)) {
      const mixed = scripts.size > 1 && scripts.has('Latin');
      add('lookalike_domain', mixed ? 'strong' : 'moderate', `“${labelUni}” ${mixed ? 'mixes ordinary letters with characters from another alphabet' : 'is made of characters'} that look like the Latin letters “${sk}” but are not.${isGovEduSuffix(info) ? ' The .edu or .gov ending does not make it the real one.' : ''}`);
    } else if (scripts.size > 1 && scripts.has('Latin')) {
      add('lookalike_domain', 'strong', `“${labelUni}” mixes ${[...scripts].join(' and ')} characters in one name, a common trick in fake domains.`);
    }
  }
  // Subdomain lookalike characters
  if (a.subdomain && hasNonAscii(toUnicode(a.subdomain))) {
    const sk = skeleton(toUnicode(a.subdomain));
    if (/^[a-z0-9.-]+$/.test(sk) && sk !== toUnicode(a.subdomain)) add('lookalike_domain', 'moderate', `The start of the address uses lookalike characters (reads like “${sk}”).`);
  }
  if (official) return; // it really is one of the known organisations

  // 2. Typo-squats: paypa1, rnicrosoft, amazom ...
  if (!hasNonAscii(labelUni)) {
    const pieces = [labelAscii, ...labelAscii.split('-').filter((x) => x.length >= 4)];
    for (const variant of pieces.flatMap((p) => [p, ...asciiHomoglyphs(p)])) {
      const hit = [...BRAND_LABELS.entries()].find(([k]) => k.length >= 5 && (variant === k || dl1(variant, k)) && !pieces.includes(k));
      if (hit) {
        add('lookalike_domain', 'strong', `“${reg}” looks like “${hit[0]}” (${hit[1].name}) with a letter swapped or changed. It is not ${hit[1].name}'s domain.`);
        return;
      }
    }
  }
  // 3. Brand name inside an unrelated domain: uscis-case-verify.com, paypal-secure-login.net
  brandLoop: for (const variant of [labelAscii, ...asciiHomoglyphs(labelAscii)]) {
    const parts = variant.split(/[-0-9]+/).filter(Boolean);
    for (const [tok, org] of [...BRAND_TOKENS.entries(), ...BRAND_LABELS.entries(), ...EXTRA_TOKENS.entries()]) {
      const inParts = parts.includes(tok);
      const inside = tok.length >= 5 && variant.includes(tok);
      if ((inParts || inside) && !isOfficial(org, reg)) {
        const how = variant === labelAscii ? `contains “${tok}”` : `reads like “${tok}” once you look closely (“${labelAscii}” uses swapped characters)`;
        add('lookalike_domain', 'strong', `“${reg}” ${how}, but ${org.name} does not own this domain. Anyone can register a name like this.`);
        break brandLoop;
      }
    }
  }
  // 4. Decoy brand in the subdomain: paypal.com.account-check.xyz
  if (a.subdomain) {
    const subParts = a.subdomain.split(/[.\-]/);
    const hit = [...BRAND_LABELS.entries(), ...BRAND_TOKENS.entries()].find(([k]) => subParts.includes(k) || (k.length >= 5 && subParts.some((p) => p.includes(k))));
    if (hit) add('lookalike_domain', 'strong', `The address starts with “${a.subdomain}”, but that part is a decoy: the site is really “${reg}”, which ${hit[1].name} does not own.`);
  }
  // 5. "gov"/"edu" used as a word inside a non-.gov/.edu domain: usps-gov.help, rutgers-edu-portal.net
  const words = (labelAscii + (a.subdomain ? '.' + a.subdomain : '')).split(/[-.0-9]+/).filter(Boolean);
  const govEduWord = words.some((w) => w === 'gov' || w === 'edu' ||
    (/(gov|edu)$/.test(w) && (BRAND_TOKENS.has(w.slice(0, -3)) || BRAND_LABELS.has(w.slice(0, -3)) || EXTRA_TOKENS.has(w.slice(0, -3)))));
  if (!isGovEduSuffix(info) && !GOV_VENDORS.has(reg) && govEduWord) {
    add('gov_edu_mismatch', 'strong', `The address uses “gov” or “edu” as a word, but the real domain “${reg}” is not a .gov or .edu domain. Only US government bodies can get .gov.`);
  }
}

function decodeSafe(s) {
  try { return decodeURIComponent(s); } catch { return s; }
}
function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

/** Parse a "sender" field: email address, phone number, or handle. */
export function parseSender(sender) {
  const s = (sender || '').trim();
  if (!s) return { kind: 'none' };
  const email = s.match(/<?([^\s<>@]+@([^\s<>@]+\.[^\s<>@]+?))>?\s*$/) || s.match(/([^\s<>@]+@([^\s<>@]+\.[^\s<>@.]+))/);
  if (email) {
    let ascii = email[2].toLowerCase().replace(/[>.]+$/, '');
    try { ascii = new URL('http://' + ascii).hostname; } catch { /* keep */ }
    const info = lookup(ascii);
    const display = s.replace(email[0], '').replace(/["<>]/g, '').trim();
    return { kind: 'email', address: email[1], hostAscii: ascii, hostUnicode: toUnicode(ascii), oddChars: oddChars(toUnicode(ascii)), info, registrable: info && info.registrable ? info.registrable : ascii, display };
  }
  if (/^[+()\d\s.-]{5,}$/.test(s)) {
    const digits = s.replace(/\D/g, '');
    return { kind: 'phone', value: s, digits, international: s.startsWith('+') && !s.startsWith('+1') };
  }
  return { kind: 'handle', value: s };
}
