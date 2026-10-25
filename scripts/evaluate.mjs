// Evaluate the rules on a labelled JSONL set.
// Usage: node scripts/evaluate.mjs eval/dev.jsonl [--write eval/results-dev] [--verbose]
// "Flagged" = the verdict is level 2 ("Some warning signs") or level 3 ("Several strong warning signs").
import { readFileSync, writeFileSync } from 'node:fs';
import { analyze, VERDICTS } from '../app/js/analyze.js';

const args = process.argv.slice(2);
const file = args[0];
const outIdx = args.indexOf('--write');
const out = outIdx >= 0 ? args[outIdx + 1] : null;
const verbose = args.includes('--verbose');

const rows = readFileSync(file, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
const per = [];
const signStats = {}; // id -> {expected, caught}
let extraOnScam = 0;
for (const r of rows) {
  const res = analyze({ text: r.text, sender: r.sender, links: (r.links || []).join('\n') });
  const got = new Set(res.signs.map((s) => s.id));
  const exp = r.expected_signs || [];
  const caught = exp.filter((s) => got.has(s));
  const missed = exp.filter((s) => !got.has(s));
  for (const s of exp) {
    signStats[s] ??= { expected: 0, caught: 0 };
    signStats[s].expected++;
    if (got.has(s)) signStats[s].caught++;
  }
  per.push({ id: r.id, label: r.label, difficulty: r.difficulty || '', level: res.level, flagged: res.level >= 2, caught, missed, emitted: [...got], points: res.points });
  if (verbose) console.log(r.id, r.label, 'L' + res.level, res.points, [...got].join(','), missed.length ? 'MISSED:' + missed.join(',') : '');
}

const scams = per.filter((p) => p.label === 'scam');
const legit = per.filter((p) => p.label === 'legit');
const dist = (set) => [0, 1, 2, 3].map((l) => set.filter((p) => p.level === l).length);
const summary = {
  file,
  generated: new Date().toISOString(),
  messages: per.length,
  scam: { n: scams.length, flagged: scams.filter((p) => p.flagged).length, levels: dist(scams) },
  legit: { n: legit.length, flagged: legit.filter((p) => p.flagged).length, levels: dist(legit) },
  signs: signStats,
  signsTotal: { expected: Object.values(signStats).reduce((a, s) => a + s.expected, 0), caught: Object.values(signStats).reduce((a, s) => a + s.caught, 0) },
  missedScams: scams.filter((p) => !p.flagged).map((p) => p.id),
  falseAlarms: legit.filter((p) => p.flagged).map((p) => p.id),
};

const pct = (a, b) => (b ? ((100 * a) / b).toFixed(0) + '%' : 'n/a');
const lines = [];
lines.push(`# Evaluation: ${file}`);
lines.push('');
lines.push(`Generated ${summary.generated} by \`node scripts/evaluate.mjs ${file}\`. All messages are synthetic.`);
lines.push('');
lines.push('"Flagged" means the verdict was "Some warning signs" or "Several strong warning signs".');
lines.push('');
lines.push('| Set | Messages | Flagged | ' + VERDICTS.map((v) => v.label).join(' | ') + ' |');
lines.push('|---|---|---|' + VERDICTS.map(() => '---').join('|') + '|');
lines.push(`| Scam | ${summary.scam.n} | ${summary.scam.flagged} (${pct(summary.scam.flagged, summary.scam.n)}) | ${summary.scam.levels.join(' | ')} |`);
lines.push(`| Legitimate | ${summary.legit.n} | ${summary.legit.flagged} (${pct(summary.legit.flagged, summary.legit.n)}) | ${summary.legit.levels.join(' | ')} |`);
lines.push('');
lines.push(`Warning signs a human labeller marked as present: ${summary.signsTotal.expected}; detected: ${summary.signsTotal.caught} (${pct(summary.signsTotal.caught, summary.signsTotal.expected)}).`);
lines.push('');
lines.push('| Sign | Labelled present | Detected |');
lines.push('|---|---|---|');
for (const [id, s] of Object.entries(signStats).sort((a, b) => b[1].expected - a[1].expected)) lines.push(`| ${id} | ${s.expected} | ${s.caught} (${pct(s.caught, s.expected)}) |`);
lines.push('');
lines.push(`Scam messages not flagged: ${summary.missedScams.join(', ') || 'none'}`);
lines.push('');
lines.push(`Legitimate messages flagged (false alarms): ${summary.falseAlarms.join(', ') || 'none'}`);
lines.push('');
lines.push('## Per message');
lines.push('');
lines.push('| ID | Label | Difficulty | Verdict | Missed signs | Signs reported |');
lines.push('|---|---|---|---|---|---|');
for (const p of per) lines.push(`| ${p.id} | ${p.label} | ${p.difficulty} | ${VERDICTS[p.level].label} | ${p.missed.join(', ')} | ${p.emitted.join(', ')} |`);
const md = lines.join('\n') + '\n';

console.log(`scam flagged ${summary.scam.flagged}/${summary.scam.n} levels ${summary.scam.levels} | legit flagged ${summary.legit.flagged}/${summary.legit.n} levels ${summary.legit.levels} | signs ${summary.signsTotal.caught}/${summary.signsTotal.expected}`);
console.log('missed scams:', summary.missedScams.join(' ') || '-', '| false alarms:', summary.falseAlarms.join(' ') || '-');
if (out) {
  writeFileSync(out + '.md', md);
  writeFileSync(out + '.json', JSON.stringify({ summary, per }, null, 2) + '\n');
  console.log('wrote', out + '.md', out + '.json');
}
