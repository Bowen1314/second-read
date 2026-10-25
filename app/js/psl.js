// Registrable-domain lookup against the vendored Public Suffix List, using the standard algorithm
// from https://github.com/publicsuffix/list/wiki/Format#formal-algorithm (wildcards + exceptions).
import { PSL_ICANN, PSL_PRIVATE } from '../data/psl-data.js';

const rules = new Map(); // rule (without "!") -> { exception, private }
for (const [list, isPrivate] of [[PSL_ICANN, false], [PSL_PRIVATE, true]]) {
  for (const r of list.split(' ')) {
    if (!r) continue;
    const exception = r.startsWith('!');
    rules.set(exception ? r.slice(1) : r, { exception, private: isPrivate });
  }
}

/**
 * @param {string} asciiHost lowercase ASCII hostname (punycode already applied)
 * @returns {{publicSuffix:string, registrable:string|null, subdomain:string, listed:boolean, privateSuffix:boolean}|null}
 */
export function lookup(asciiHost) {
  if (!asciiHost || asciiHost.startsWith('.')) return null;
  const host = asciiHost.toLowerCase().replace(/\.$/, '');
  const labels = host.split('.');
  if (labels.some((l) => l === '')) return null;
  let best = null; // { len, exception, private }
  for (let i = 0; i < labels.length; i++) {
    const cand = labels.slice(i).join('.');
    const wild = ['*', ...labels.slice(i + 1)].join('.');
    for (const key of [cand, wild]) {
      const r = rules.get(key);
      if (!r) continue;
      const len = labels.length - i;
      if (r.exception) {
        best = { len: len - 1, exception: true, private: r.private };
        break;
      }
      if (!best || (!best.exception && len > best.len)) best = { len, exception: false, private: r.private };
    }
    if (best && best.exception) break;
  }
  const listed = !!best;
  const suffixLen = best ? best.len : 1; // unlisted TLD: implicit "*" rule
  const publicSuffix = labels.slice(-suffixLen).join('.');
  const registrable = labels.length > suffixLen ? labels.slice(-(suffixLen + 1)).join('.') : null;
  const subdomain = registrable ? labels.slice(0, labels.length - suffixLen - 1).join('.') : '';
  return { publicSuffix, registrable, subdomain, listed, privateSuffix: !!(best && best.private) };
}

/** True when the TLD itself is on the list (used to reject "file.txt"-style false link matches). */
export function isKnownTld(asciiHost) {
  const tld = asciiHost.toLowerCase().split('.').pop();
  return rules.has(tld);
}
