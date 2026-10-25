// Records the demo walkthrough with caption overlays (no voice-over).
// Usage: node scripts/record-demo.mjs [baseURL]   -> demo/raw/*.webm and demo/transcript.md
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';

const base = process.argv[2] || 'http://127.0.0.1:8962/';
rmSync('demo/raw', { recursive: true, force: true });
mkdirSync('demo/raw', { recursive: true });
const h2 = JSON.parse(readFileSync('eval/results-heldout2-v2.json', 'utf8')).summary;
const h2v3 = JSON.parse(readFileSync('eval/results-heldout2-v3.json', 'utf8')).summary;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'light', recordVideo: { dir: 'demo/raw', size: { width: 1280, height: 800 } } });
const page = await context.newPage();
const t0 = Date.now();
const log = [];
const wait = (ms) => page.waitForTimeout(ms);
async function cap(text, ms) {
  log.push({ t: (Date.now() - t0) / 1000, text });
  await page.evaluate((t) => { const c = document.getElementById('demo-caption'); c.textContent = t; c.classList.add('on'); }, text);
  await wait(ms);
}
const scrollTo = (sel, offset = 20) => page.evaluate(([s, o]) => {
  const e = document.querySelector(s);
  window.scrollTo({ top: e.getBoundingClientRect().top + window.scrollY - o, behavior: 'smooth' });
}, [sel, offset]);

const transcript = 'This is Officer Daniel Ross with U.S. Citizenship and Immigration Services. Your F-1 visa has been flagged and your SEVIS record will be terminated today. A warrant for your arrest will be issued unless you pay the $950 correction fee with Target gift cards. Call us back immediately at (202) 555-0188. Do not discuss this case with your school or anyone else.';

await page.goto(base);
await wait(800);
await cap('Second Read: a private second opinion on a suspicious message, before you click, pay or reply.', 6000);
await cap('Lin is an F-1 student (a fictional example). A caller says he is from USCIS and that her SEVIS record will be terminated today.', 7000);
await page.click('#msg');
await cap('He says there is a warrant for her arrest, that she must pay a $950 fee in Target gift cards, and that she must not tell her school.', 3000);
await page.type('#msg', transcript, { delay: 9 });
await page.fill('#sender', '(202) 555-0188');
await cap('The FBI and the FTC warn about exactly this script. Under pressure, people often pay first and check later.', 6500);
await cap('Lin pastes the voicemail transcript into Second Read and presses “Check message”.', 3500);
await page.click('#go');
await wait(600);
await cap('Result: “Several strong warning signs”. Second Read never calls a message safe. It says how closely it matches public scam warnings.', 8000);
await scrollTo('.msgview', 120);
await cap('Each warning sign is highlighted in the message itself and numbered. Strength is shown by colour and by line style, not colour alone.', 8000);
await scrollTo('.signs', 90);
await cap('Every sign is explained in plain language, with links to the FTC, FBI, USCIS or university guidance it comes from.', 9000);
await scrollTo('.next', 20);
await cap('The safer outcome: instead of buying gift cards, Lin hangs up and calls her international student office, using the number on her school’s website.', 9500);
await page.click('details.already summary');
await scrollTo('details.already', 120);
await cap('If someone has already paid, or shared a code or password, there are concrete recovery steps for each payment type.', 7500);

await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
await page.selectOption('#sample', 'apple');
await cap('Links are taken apart as text. Second Read never opens them, and it never makes them clickable.', 6000);
await scrollTo('.linkcard', 80);
await cap('This “apple.com” is not Apple: its first letter is a Cyrillic “а”. Second Read decodes the punycode and highlights the impostor letter.', 9000);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
await page.selectOption('#sample', 'usps');
await scrollTo('.linkcard', 80);
await cap('The “real website” is the part someone had to register. usps-parcel-care.top is not USPS, whatever the text says.', 7500);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
await page.selectOption('#sample', 'code-legit');
await cap('A real two-step code you asked for gets “No known warning signs found”, plus a reminder that this does not mean it is safe.', 8000);
await page.selectOption('#sample', 'police-zh');
await cap('It also knows a small set of Chinese phrases used in fake “Chinese police” calls, which the FBI says target Chinese students.', 7000);

await page.click('#clear');
await scrollTo('#privacy', 20);
await cap('Nothing leaves the device. The page’s security policy forbids sending data (connect-src \'none\'). Nothing is stored, and it works offline.', 9000);
await cap('Automated tests paste a marker, run a check, and confirm zero network requests, and that the browser blocks any attempt to send data.', 8500);
await cap(`Evidence: on ${h2.messages} synthetic messages the rules had never seen, it flagged ${h2.scam.flagged} of ${h2.scam.n} scams and wrongly flagged ${h2.legit.flagged} of ${h2.legit.n} real ones.`, 9000);
await cap(`After fixing what that test showed, the current rules flag ${h2v3.scam.flagged}/${h2v3.scam.n} and ${h2v3.legit.flagged}/${h2v3.legit.n} on that set, but that is no longer an independent test.`, 8500);
await cap('Limits: rules miss new tricks, cannot verify a sender, cannot see images or calls, and can be fooled by messages that quote scam wording.', 9000);
await cap('It is a checking aid, not a guarantee and not an emergency service. If you are in danger, call 911.', 7000);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
await cap('Second Read · built during SafeSpace Hacks 2026 · bowen1314.github.io/second-read · source: github.com/Bowen1314/second-read', 6500);
const total = (Date.now() - t0) / 1000;
await context.close();
await browser.close();

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
writeFileSync('demo/transcript.md',
  `# Second Read — demo transcript\n\nOn-screen captions of \`demo/demo.mp4\` (no voice-over). Recorded with Playwright from the app; all messages are synthetic. Length about ${fmt(total)}.\n\n` +
  log.map((l) => `- **${fmt(l.t)}** ${l.text}`).join('\n') + '\n');
console.log('recorded', total.toFixed(1), 's');
