import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const CANARY = 'zq7canary41x';
const base = () => test.info().project.use.baseURL;

async function check(page, { text, sender = '', links = '' }) {
  await page.fill('#msg', text);
  await page.fill('#sender', sender);
  await page.fill('#links', links);
  await page.click('#go');
  await expect(page.locator('#verdict-h')).toBeVisible();
}

test('@smoke core flow: example message gets highlighted signs, link anatomy and next steps', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Second Read');
  await page.selectOption('#sample', 'uscis');
  await expect(page.locator('#verdict-h')).toHaveText('Several strong warning signs');
  await expect(page.locator('.msgview mark')).not.toHaveCount(0);
  await expect(page.locator('.signs h4').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Safe next steps' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tell your international student office' })).toBeVisible();

  await page.selectOption('#sample', 'usps');
  await expect(page.locator('.linkcard .reg').first()).toHaveText('usps-parcel-care.top');
  await expect(page.locator('.linkcard').first()).toContainText('does not own this domain');
});

test('@smoke a punycode lookalike is decoded and tied to the brand it imitates', async ({ page }) => {
  await page.goto('./');
  await page.selectOption('#sample', 'apple');
  const card = page.locator('.linkcard').nth(1);
  await expect(card.locator('mark.odd')).toHaveText(/^а/);
  await expect(card).toContainText('U+0430');
  await expect(card).toContainText('This is not Apple');
});

test('@smoke checking a message makes zero network requests, and nothing containing the input is ever requested', async ({ page }) => {
  const all = [];
  page.on('request', (r) => all.push(r.url()));
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  const before = all.length;
  await check(page, {
    text: `URGENT ${CANARY}: pay the fee with gift cards at https://${CANARY}.example-pay.top/x?u=https://${CANARY}.net or call (202) 555-0101`,
    sender: `office@${CANARY}.com`,
    links: `https://bit.ly/${CANARY}`,
  });
  await page.waitForTimeout(800);
  expect(all.slice(before), 'requests made during the check').toEqual([]);
  expect(all.filter((u) => u.includes(CANARY))).toEqual([]);
});

test('@smoke the Content Security Policy is live: the page cannot send data out', async ({ page }) => {
  await page.goto('./');
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(csp).toContain("connect-src 'none'");
  expect(csp).toContain("form-action 'none'");
  const result = await page.evaluate(async () => {
    const violations = [];
    document.addEventListener('securitypolicyviolation', (e) => violations.push(e.violatedDirective));
    let fetchBlocked = false;
    try { await fetch('https://example.com/?leak=1'); } catch { fetchBlocked = true; }
    let xhrBlocked = false;
    try {
      await new Promise((res, rej) => { const x = new XMLHttpRequest(); x.onerror = rej; x.onload = res; x.open('GET', 'https://example.com/?leak=2'); x.send(); });
    } catch { xhrBlocked = true; }
    const img = new Image();
    img.src = 'https://example.com/pixel.gif?leak=3';
    await new Promise((r) => setTimeout(r, 500));
    return { fetchBlocked, xhrBlocked, violations };
  });
  expect(result.fetchBlocked).toBe(true);
  expect(result.xhrBlocked).toBe(true);
  expect(result.violations).toEqual(expect.arrayContaining(['connect-src', 'img-src']));
});

test('nothing is stored: no cookies, web storage or IndexedDB, and the offline cache holds only app files', async ({ page }) => {
  await page.goto('./');
  await check(page, { text: `Pay with Bitcoin now ${CANARY}` });
  const state = await page.evaluate(async (canary) => {
    const dbs = indexedDB.databases ? await indexedDB.databases() : [];
    const cached = [];
    for (const k of await caches.keys()) for (const r of await (await caches.open(k)).keys()) cached.push(r.url);
    return { ls: localStorage.length, ss: sessionStorage.length, cookie: document.cookie, dbs: dbs.length, leak: cached.filter((u) => u.includes(canary)) };
  }, CANARY);
  expect(state).toEqual({ ls: 0, ss: 0, cookie: '', dbs: 0, leak: [] });
});

test('fields are cleared by the Clear button and when the page is left', async ({ page }) => {
  await page.goto('./');
  await check(page, { text: 'Your account will be suspended. Verify your account now.', sender: 'x@y.com' });
  await page.click('#clear');
  await expect(page.locator('#msg')).toHaveValue('');
  await expect(page.locator('#out')).toBeHidden();
  await page.fill('#msg', 'something private');
  await page.goto('./icon.svg');
  await page.goBack();
  await expect(page.locator('#msg')).toHaveValue('');
});

test('works offline after the first visit', async ({ page, context }) => {
  await page.goto('./');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await page.selectOption('#sample', 'task');
  await expect(page.locator('#verdict-h')).toHaveText('Several strong warning signs');
  await context.setOffline(false);
});

test('errors are handled in plain language', async ({ page }) => {
  await page.goto('./');
  await page.click('#go');
  await expect(page.locator('#input-error')).toHaveText(/Paste a message/);
  await check(page, { text: 'see link', links: 'http://[::zz' });
  await expect(page.locator('.linkcard .error')).toContainText('could not be read');
  await check(page, { text: 'a '.repeat(15000) });
  await expect(page.locator('.verdict .error')).toContainText('Only the first');
});

test('user links are never made clickable, and a clean message is never called safe', async ({ page }) => {
  await page.goto('./');
  await check(page, { text: 'Lunch tomorrow? Menu at https://cafe-example.com/menu' });
  await expect(page.locator('#out a[href*="cafe-example"]')).toHaveCount(0);
  await expect(page.locator('#verdict-h')).toHaveText('No known warning signs found');
  await expect(page.locator('.verdict')).toContainText('does not mean it is safe');
  await page.selectOption('#sample', 'code-legit');
  await expect(page.locator('#verdict-h')).toHaveText('No known warning signs found');
});

test('phone width: no horizontal scrolling, results readable', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(base());
  await page.selectOption('#sample', 'apple');
  await expect(page.locator('#verdict-h')).toBeVisible();
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(sw).toBeLessThanOrEqual(cw);
  await ctx.close();
});

test('accessibility: axe-core finds no serious or critical issues (before and after a check, light and dark)', async ({ browser }) => {
  const axe = readFileSync(new URL('../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
  for (const colorScheme of ['light', 'dark']) {
    // bypassCSP only so the test can inject axe; the app itself never needs it
    const ctx = await browser.newContext({ bypassCSP: true, colorScheme });
    const page = await ctx.newPage();
    await page.goto(base());
    await page.addScriptTag({ content: axe });
    const run = () => page.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations
      .filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => `${v.id}: ${v.nodes.length}`));
    expect(await run(), `${colorScheme} empty`).toEqual([]);
    await page.selectOption('#sample', 'uscis');
    await page.locator('details.already summary').click();
    expect(await run(), `${colorScheme} results`).toEqual([]);
    await ctx.close();
  }
});
