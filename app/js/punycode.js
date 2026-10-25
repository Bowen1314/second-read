// Punycode decoder (RFC 3492), written for Second Read. Decode-only: we only ever need to show
// people what an "xn--" domain really spells.
const BASE = 36, TMIN = 1, TMAX = 26, SKEW = 38, DAMP = 700, INITIAL_BIAS = 72, INITIAL_N = 128;

function adapt(delta, numPoints, firstTime) {
  let k = 0;
  delta = firstTime ? Math.floor(delta / DAMP) : delta >> 1;
  delta += Math.floor(delta / numPoints);
  for (; delta > ((BASE - TMIN) * TMAX) >> 1; k += BASE) delta = Math.floor(delta / (BASE - TMIN));
  return Math.floor(k + ((BASE - TMIN + 1) * delta) / (delta + SKEW));
}

function digit(cp) {
  if (cp >= 48 && cp <= 57) return cp - 22; // 0-9 -> 26-35
  if (cp >= 65 && cp <= 90) return cp - 65; // A-Z
  if (cp >= 97 && cp <= 122) return cp - 97; // a-z
  return BASE;
}

/** Decode one punycode label body (without the "xn--" prefix). Throws on malformed input. */
export function decodeLabel(input) {
  const output = [];
  let i = 0, n = INITIAL_N, bias = INITIAL_BIAS;
  let basic = input.lastIndexOf('-');
  if (basic < 0) basic = 0;
  for (let j = 0; j < basic; j++) {
    if (input.charCodeAt(j) >= 0x80) throw new Error('not basic');
    output.push(input.charCodeAt(j));
  }
  for (let idx = basic > 0 ? basic + 1 : 0; idx < input.length; ) {
    const oldi = i;
    for (let w = 1, k = BASE; ; k += BASE) {
      if (idx >= input.length) throw new Error('bad input');
      const d = digit(input.charCodeAt(idx++));
      if (d >= BASE) throw new Error('bad digit');
      if (d > Math.floor((0x7fffffff - i) / w)) throw new Error('overflow');
      i += d * w;
      const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
      if (d < t) break;
      if (w > Math.floor(0x7fffffff / (BASE - t))) throw new Error('overflow');
      w *= BASE - t;
    }
    const len = output.length + 1;
    bias = adapt(i - oldi, len, oldi === 0);
    if (Math.floor(i / len) > 0x7fffffff - n) throw new Error('overflow');
    n += Math.floor(i / len);
    i %= len;
    if (n > 0x10ffff) throw new Error('bad code point');
    output.splice(i++, 0, n);
  }
  return String.fromCodePoint(...output);
}

/** Convert an ASCII hostname to its Unicode display form. Malformed labels are left as-is. */
export function toUnicode(host) {
  return host
    .split('.')
    .map((label) => {
      if (!/^xn--/i.test(label)) return label;
      try {
        return decodeLabel(label.slice(4).toLowerCase());
      } catch {
        return label;
      }
    })
    .join('.');
}
