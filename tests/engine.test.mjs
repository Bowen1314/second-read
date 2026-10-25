import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, VERDICTS } from '../app/js/analyze.js';
import { extractLinks, analyzeUrl, parseSender } from '../app/js/links.js';

const flagSigns = (url) => analyzeUrl(url).flags.map((f) => f.sign);

test('link extraction finds scheme, www and bare domains, ignores look-alike text', () => {
  const t = 'Go to https://a.example.com/x?y=1, or www.usps.com. Also uscis-help.top/pay and e.g. U.S. rules, v1.2.3, $4.50, file.txt and me@mail.com.';
  const got = extractLinks(t).map((l) => l.raw);
  assert.deepEqual(got, ['https://a.example.com/x?y=1', 'www.usps.com', 'uscis-help.top/pay']);
});

test('trailing punctuation is stripped, spans point into the text', () => {
  const t = 'Visit (https://bit.ly/abc).';
  const [l] = extractLinks(t);
  assert.equal(l.raw, 'https://bit.ly/abc');
  assert.equal(t.slice(l.start, l.end), l.raw);
});

test('anatomy: registrable domain, subdomain decoy, userinfo, IP, redirect parameter', () => {
  const a = analyzeUrl('https://paypal.com.account-check.xyz/login');
  assert.equal(a.registrable, 'account-check.xyz');
  assert.ok(a.flags.some((f) => f.sign === 'lookalike_domain' && /decoy/.test(f.text)));
  assert.ok(flagSigns('https://www.paypal.com@203.0.113.9/').includes('suspicious_link'));
  const r = analyzeUrl('https://good.example.com/out?url=https%3A%2F%2Fbad.example.net');
  assert.ok(r.params.some((p) => p.isUrl));
  assert.ok(r.flags.some((f) => /another address/.test(f.text)));
});

test('anatomy: punycode decoded and homograph tied to the brand it imitates', () => {
  const a = analyzeUrl('https://xn--pple-43d.com/');
  assert.equal(a.hostUnicode, 'аpple.com');
  assert.ok(a.flags.some((f) => f.sign === 'lookalike_domain' && f.tier === 'strong' && /Apple/.test(f.text)));
});

test('anatomy: typo-squats and brand-in-domain, but not the real domains', () => {
  assert.ok(flagSigns('paypa1.com').includes('lookalike_domain'));
  assert.ok(flagSigns('rnicrosoft-login.com').includes('lookalike_domain'));
  assert.ok(flagSigns('https://uscis-case-status.com').includes('lookalike_domain'));
  assert.ok(flagSigns('rutgers-edu-portal.net').includes('gov_edu_mismatch'));
  for (const real of ['https://www.paypal.com/', 'https://my.uscis.gov/', 'https://www.microsoft.com', 'https://tools.usps.com/go/TrackConfirmAction', 'https://public.govdelivery.com/x']) {
    assert.deepEqual(analyzeUrl(real).flags.filter((f) => f.sign !== 'info'), [], real);
  }
});

test('shortener and free-hosting flags', () => {
  assert.ok(flagSigns('https://bit.ly/3abc').includes('link_shortener'));
  assert.ok(flagSigns('https://student-portal.github.io/').includes('free_hosting'));
});

test('malformed input is handled, not thrown', () => {
  assert.ok(analyzeUrl('http://[::zz').error);
  assert.ok(analyzeUrl('javascript:alert(1)').error || analyzeUrl('javascript:alert(1)').flags);
  assert.equal(analyze({ text: '   ' }).empty, true);
  const big = analyze({ text: 'x'.repeat(30000) });
  assert.equal(big.truncated, true);
  assert.ok(big.errors.length > 0);
});

test('sender parsing', () => {
  const s = parseSender('USCIS Office <case.office@gmail.com>');
  assert.equal(s.kind, 'email');
  assert.equal(s.registrable, 'gmail.com');
  assert.equal(s.display, 'USCIS Office');
  assert.equal(parseSender('+1 (202) 555-0147').kind, 'phone');
});

test('negated requests are not warning signs ("never share your code", "call the number on your card")', () => {
  const r = analyze({ text: 'Your verification code is 123456. Never share this code with anyone. We will never ask for your password.' });
  assert.equal(r.level, 0);
  const b = analyze({ text: 'Did you make this purchase? If not, call the number on the back of your card.' });
  assert.ok(!b.signs.some((s) => s.id === 'unsolicited_contact_switch'));
});

test('government impersonation with gift cards is the top level', () => {
  const r = analyze({ text: 'This is USCIS. Your visa will be cancelled and you will be arrested today unless you pay the fee with Target gift cards. Do not tell your school.', sender: '+1 (202) 555-0100' });
  assert.equal(r.level, 3);
  for (const id of ['threat', 'unusual_payment', 'secrecy', 'authority_impersonation']) assert.ok(r.signs.some((s) => s.id === id), id);
  assert.ok(r.notes.some((n) => /IC3/.test(n)));
});

test('Chinese-language police impersonation is recognised', () => {
  const r = analyze({ text: '这里是公安局，你涉嫌洗钱，必须保密，把钱转到安全账户。' });
  assert.equal(r.level, 3);
});

test('verdict wording never calls a message safe', () => {
  for (const v of VERDICTS) {
    assert.ok(!/\bis safe\b|\bsafe to\b|\blegit(imate)?\b|\bgenuine\b/i.test(v.label), v.label);
  }
  assert.match(VERDICTS[0].detail, /does not mean it is safe/);
});

test('highlights cover the original text exactly', () => {
  const text = 'Final notice: pay with Bitcoin at https://uscis-pay.top now.';
  const r = analyze({ text });
  assert.equal(r.highlights.map((s) => s.text).join(''), text);
  assert.ok(r.highlights.some((s) => s.mark));
});

test('the analysis is deterministic', () => {
  const input = { text: 'USPS: pay a $2 redelivery fee at usps-help.top', sender: '+1 202 555 0111' };
  assert.deepEqual(JSON.stringify(analyze(input)), JSON.stringify(analyze(input)));
});
