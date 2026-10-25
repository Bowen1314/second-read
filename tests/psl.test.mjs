// Runs the Public Suffix List project's own test vectors (data/psl/test_psl.txt, CC0) against our lookup.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { domainToASCII } from 'node:url';
import { lookup } from '../app/js/psl.js';
import { toUnicode, decodeLabel } from '../app/js/punycode.js';

const vectors = readFileSync(new URL('../data/psl/test_psl.txt', import.meta.url), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l.startsWith('checkPublicSuffix('))
  .map((l) => {
    const args = l.slice('checkPublicSuffix('.length, l.lastIndexOf(')')).split(',').map((s) => s.trim());
    const parse = (s) => (s === 'null' ? null : s.replace(/^'|'$/g, ''));
    return [parse(args[0]), parse(args[1])];
  });

test('official PSL test vectors', () => {
  assert.ok(vectors.length > 50, 'vectors loaded');
  let n = 0;
  for (const [input, expected] of vectors) {
    let got = null;
    if (input !== null && !input.startsWith('.')) {
      const ascii = domainToASCII(input.toLowerCase());
      const r = ascii ? lookup(ascii) : null;
      got = r ? r.registrable : null;
    }
    const want = expected === null ? null : domainToASCII(expected.toLowerCase());
    assert.equal(got, want, `checkPublicSuffix(${input}) expected ${want} got ${got}`);
    n++;
  }
  console.log(`  ${n} PSL vectors passed`);
});

test('private section is honoured (subdomains of hosting platforms are separate owners)', () => {
  assert.equal(lookup('evil.github.io').registrable, 'evil.github.io');
  assert.equal(lookup('evil.github.io').privateSuffix, true);
  assert.equal(lookup('china-embassy.gov.cn').publicSuffix, 'gov.cn');
  assert.equal(lookup('www.uscis.gov').registrable, 'uscis.gov');
  assert.equal(lookup('my.rutgers.edu').subdomain, 'my');
});

test('punycode decoding (RFC 3492 sample strings)', () => {
  // RFC 3492 section 7.1 samples (Chinese simplified, Russian) and well-known IDN examples
  assert.equal(decodeLabel('ihqwcrb4cv8a8dqg056pqjye'), '他们为什么不说中文');
  assert.equal(decodeLabel('b1abfaaepdrnnbgefbadotcwatmq2g4l'), 'почемужеонинеговорятпорусски');
  assert.equal(toUnicode('xn--80ak6aa92e.com'), 'аррӏе.com');
  assert.equal(toUnicode('xn--mnchen-3ya.de'), 'münchen.de');
  assert.equal(toUnicode('xn--!!.com'), 'xn--!!.com', 'malformed label left unchanged');
});
