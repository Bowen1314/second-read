// Second Read UI. All user-supplied text is rendered with textContent; user links are never made clickable.
import { analyze } from './analyze.js';
import { SAMPLES } from './samples.js';
import { PSL_VERSION } from '../data/psl-data.js';
import { CONFUSABLES_VERSION } from '../data/confusables-data.js';

const $ = (id) => document.getElementById(id);
const TIER_LABEL = { strong: 'Strong sign', moderate: 'Moderate sign', weak: 'Weak sign', context: 'Context', info: 'Note' };

/** Tiny DOM builder: el('p', {class:'x'}, 'text', child) — strings become text nodes, never HTML. */
function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) {
    if (k == null || k === false) continue;
    n.append(typeof k === 'string' ? document.createTextNode(k) : k);
  }
  return n;
}

function sourceLinks(sources) {
  if (!sources || !sources.length) return null;
  return el('p', { class: 'sources' }, 'Based on: ',
    ...sources.flatMap((s, i) => [i ? ' · ' : '', el('a', { href: s.url, rel: 'noopener noreferrer', target: '_blank' }, `${s.org}: ${s.title}`)]));
}

function verdictCard(r) {
  const n = r.signs.filter((s) => s.tier !== 'context' && s.tier !== 'info').length;
  const meter = el('div', { class: 'meter', 'aria-hidden': 'true' }, [1, 2, 3].map((i) => el('span', { class: i <= r.level ? 'on' : '' })));
  return el('div', { class: `panel verdict lvl${r.level}` },
    el('div', { class: 'verdict-top' }, meter,
      el('div', {},
        el('p', { class: 'eyebrow' }, 'Second Read’s view'),
        el('h2', { id: 'verdict-h', tabindex: '-1' }, r.verdict.label))),
    el('p', { class: 'verdict-detail' }, r.verdict.detail),
    el('p', { class: 'verdict-meta' }, `${n} warning sign${n === 1 ? '' : 's'} found · ${r.links.length} link${r.links.length === 1 ? '' : 's'} taken apart (not opened)`),
    r.notes.length ? el('ul', { class: 'notes' }, r.notes.map((t) => el('li', {}, t))) : null,
    r.errors.length ? el('p', { class: 'error' }, r.errors.join(' ')) : null);
}

function highlighted(r) {
  if (!r.text.trim()) return null;
  const box = el('div', { class: 'msgview', lang: /[一-鿿]/.test(r.text) ? 'zh' : 'en' });
  for (const seg of r.highlights) {
    if (!seg.mark) { box.append(document.createTextNode(seg.text)); continue; }
    const m = seg.mark;
    const sign = r.signs.find((s) => s.n === m.n);
    const title = sign ? sign.title : 'A link (shown below, not opened)';
    const mark = el('mark', { class: `t-${m.tier}${m.link ? ' is-link' : ''}`, title }, seg.text);
    if (m.n) mark.append(el('sup', { 'aria-hidden': 'true' }, String(m.n)));
    mark.append(el('span', { class: 'sr-only' }, ` (${m.n ? `warning sign ${m.n}: ` : ''}${title})`));
    box.append(mark);
  }
  return el('div', { class: 'panel' },
    el('h3', {}, 'In the message'),
    el('p', { class: 'fine' }, 'Highlighted parts match a warning sign. The number points to the explanation below. Links are shown as plain text and cannot be tapped here.'),
    box,
    legend());
}

function legend() {
  return el('p', { class: 'legend' },
    ...['strong', 'moderate', 'weak', 'context'].map((t) => el('span', { class: `chip t-${t}` }, TIER_LABEL[t])));
}

function signList(r) {
  if (!r.signs.length) {
    return el('div', { class: 'panel' }, el('h3', {}, 'Warning signs'),
      el('p', {}, 'None of Second Read’s rules matched. That is not the same as safe: see “What this check can’t see” below.'));
  }
  return el('div', { class: 'panel' },
    el('h3', {}, 'Warning signs, explained'),
    el('ol', { class: 'signs' }, r.signs.map((s) => el('li', { class: `sign t-${s.tier}` },
      el('div', { class: 'sign-head' },
        el('span', { class: 'num', 'aria-hidden': 'true' }, String(s.n)),
        el('h4', {}, s.title),
        el('span', { class: `chip t-${s.tier}` }, TIER_LABEL[s.tier])),
      el('p', {}, s.explain),
      evidenceList(s),
      sourceLinks(s.sources)))));
}

function evidenceList(s) {
  const seen = new Set();
  const items = [];
  for (const ev of s.evidence) {
    const key = ev.kind + ev.text;
    if (seen.has(key)) continue;
    seen.add(key);
    if (ev.kind === 'text') items.push(el('li', {}, 'In the text: ', el('q', {}, ev.text)));
    else items.push(el('li', {}, ev.text));
    if (items.length >= 4) break;
  }
  return items.length ? el('ul', { class: 'evidence' }, items) : null;
}

function linkCards(r) {
  const cards = [];
  if (r.sender && r.sender.kind === 'email') {
    cards.push(el('div', { class: 'linkcard' },
      el('p', { class: 'raw' }, el('span', { class: 'k' }, 'Sender address '), el('code', {}, r.sender.address)),
      el('dl', {},
        row('Real domain', el('strong', { class: 'reg' }, r.sender.registrable)),
        r.sender.hostUnicode !== r.sender.hostAscii ? row('Reads as', r.sender.hostUnicode) : null),
      flagList(r.sender.flags || [])));
  }
  for (const l of r.links) {
    if (l.error) {
      cards.push(el('div', { class: 'linkcard' }, el('p', { class: 'raw' }, el('code', {}, l.raw)), el('p', { class: 'error' }, l.error)));
      continue;
    }
    cards.push(el('div', { class: 'linkcard' },
      el('p', { class: 'raw' }, el('span', { class: 'k' }, l.source === 'pasted' ? 'Pasted link ' : 'Link in message '), el('code', {}, l.raw)),
      el('dl', {},
        row('Real website', el('strong', { class: 'reg' }, l.registrableUnicode || l.registrable),
          l.registrableUnicode && l.registrableUnicode !== l.registrable ? el('span', { class: 'puny' }, ` (punycode: ${l.registrable})`) : null),
        l.subdomain ? row('Part in front', l.subdomain + '.', el('span', { class: 'fine' }, ' (chosen by whoever owns the real website)')) : null,
        row('Domain ending', '.' + (l.publicSuffix || '')),
        l.path && l.path !== '/' ? row('Path', el('code', {}, l.path)) : null,
        l.params.length ? row('Parameters', el('ul', { class: 'params' }, l.params.map((p) => el('li', { class: p.isUrl ? 'flag' : '' }, el('code', {}, `${p.key} = ${p.value}`))))) : null,
        row('Scheme', l.scheme)),
      flagList(l.flags),
      el('p', { class: 'fine notopen' }, 'Not opened. Second Read only read this address as text.')));
  }
  if (!cards.length) return null;
  return el('div', { class: 'panel' }, el('h3', {}, 'Links and sender, taken apart'),
    el('p', { class: 'fine' }, 'The “real website” is the part someone had to register. Everything to its left can be made up by its owner.'),
    ...cards);
}
function row(k, ...v) { return el('div', { class: 'dlrow' }, el('dt', {}, k), el('dd', {}, ...v)); }
function flagList(flags) {
  if (!flags.length) return el('p', { class: 'fine' }, 'No unusual structure found in this address. That does not prove who owns it.');
  return el('ul', { class: 'flags' }, flags.map((f) => el('li', { class: `t-${f.tier}` }, el('span', { class: `chip t-${f.tier}` }, TIER_LABEL[f.tier]), ' ', f.text)));
}

function nextSteps(r) {
  return el('div', { class: 'panel next' },
    el('h3', {}, 'Safe next steps'),
    el('ol', { class: 'nextlist' }, r.nextSteps.map((s) => el('li', {},
      el('h4', {}, s.title),
      el('p', {}, s.body),
      s.report ? el('ul', { class: 'report' }, s.report.map((x) => el('li', {}, x.url ? el('a', { href: x.url, rel: 'noopener noreferrer', target: '_blank' }, x.label) : x.label))) : null,
      sourceLinks(s.sources)))),
    el('details', { class: 'already' },
      el('summary', {}, 'Already clicked, paid or shared something?'),
      el('ul', {}, r.ifAlready.map((x) => el('li', {}, el('strong', {}, x.when + ': '), x.what))),
      sourceLinks([r.ifAlready[0].source])));
}

function cannotSee() {
  return el('div', { class: 'panel muted' },
    el('h3', {}, 'What this check can’t see'),
    el('ul', {},
      el('li', {}, 'Whether the sender is really who they say: numbers and email names can be faked, and real accounts get hacked.'),
      el('li', {}, 'Images, QR codes, attachments, voice calls, or what a link opens.'),
      el('li', {}, 'New tricks that are not in its rules yet. Messages that quote scam wording (like a friend warning you) can be over-flagged.')));
}

function render(r) {
  const out = $('out');
  out.replaceChildren();
  if (r.empty) {
    showError(r.errors[0]);
    return;
  }
  showError('');
  out.append(verdictCard(r));
  const parts = [highlighted(r), signList(r), linkCards(r), nextSteps(r), cannotSee()];
  for (const p of parts) if (p) out.append(p);
  $('placeholder').hidden = true;
  out.hidden = false;
  const h = $('verdict-h');
  if (h) h.focus({ preventScroll: true });
  if (window.matchMedia('(max-width: 999px)').matches && h) h.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  updateNetCount();
}

function showError(msg) {
  const e = $('input-error');
  e.textContent = msg || '';
  e.hidden = !msg;
}

function run() {
  try {
    render(analyze({ text: $('msg').value, sender: $('sender').value, links: $('links').value, schoolDomain: $('school').value }));
  } catch (err) {
    // Never fail silently: tell the person, and do not pretend the message is fine.
    $('out').replaceChildren(el('div', { class: 'panel verdict lvl2' },
      el('h2', { id: 'verdict-h', tabindex: '-1' }, 'Second Read could not finish this check'),
      el('p', {}, 'Something in this message broke the checker, so no result is shown. That says nothing about whether the message is safe. Treat it with caution and check it through a channel you find yourself.'),
      el('p', { class: 'fine' }, `Technical detail: ${err && err.message ? err.message : String(err)}`)));
    $('placeholder').hidden = true;
    $('out').hidden = false;
  }
}

function clearAll() {
  for (const id of ['msg', 'sender', 'links', 'school']) $(id).value = '';
  $('sample').value = '';
  $('out').replaceChildren();
  $('out').hidden = true;
  $('placeholder').hidden = false;
  showError('');
}

// Count every network request the page has made (resource timing). Its own files load first;
// after that the number should never go up, whatever you paste.
let baseline = null;
function updateNetCount() {
  const entries = performance.getEntriesByType('resource');
  if (baseline === null) baseline = entries.length;
  const since = entries.length - baseline;
  $('net-count').textContent = `${entries.length} file request${entries.length === 1 ? '' : 's'} while the page loaded its own files; ${since} since then.`;
}

function init() {
  const sel = $('sample');
  for (const s of SAMPLES) sel.append(el('option', { value: s.id }, `Example: ${s.label} (made up)`));
  sel.addEventListener('change', () => {
    const s = SAMPLES.find((x) => x.id === sel.value);
    if (!s) return;
    $('msg').value = s.text;
    $('sender').value = s.sender;
    $('links').value = s.links;
    run();
  });
  $('go').addEventListener('click', run);
  $('clear').addEventListener('click', () => { clearAll(); $('msg').focus(); });
  for (const id of ['msg', 'sender', 'links', 'school']) {
    $(id).addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); } });
  }
  // Clear on close/leave, and make sure a back/forward cache restore never shows old text.
  window.addEventListener('pagehide', clearAll);
  window.addEventListener('pageshow', (e) => { if (e.persisted) clearAll(); });
  $('psl-version').textContent = PSL_VERSION.slice(0, 10);
  $('conf-version').textContent = CONFUSABLES_VERSION;
  setTimeout(updateNetCount, 1500);

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
      $('offline-status').textContent = 'This copy is saved for offline use.';
    }).catch(() => {
      $('offline-status').textContent = 'Offline copy not available in this browser.';
    });
  }
}

init();
