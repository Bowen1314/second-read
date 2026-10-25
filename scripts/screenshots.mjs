// Captures the README / Devpost screenshots at 1280x800 from a local or live URL.
// Usage: node scripts/screenshots.mjs [baseURL]
import { chromium } from '@playwright/test';
const base = process.argv[2] || 'http://127.0.0.1:8962/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: 'light' });
const top = async (sel, offset = 16) => page.evaluate(([s, o]) => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - o); }, [sel, offset]);
await page.goto(base);
await page.selectOption('#sample', 'uscis');
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: 'screenshots/01-verdict-and-highlights.png' });
await top('.signs');
await page.screenshot({ path: 'screenshots/02-warning-signs-explained.png' });
await page.selectOption('#sample', 'apple');
await top('.linkcard', 70);
await page.screenshot({ path: 'screenshots/03-link-anatomy-punycode.png' });
await page.selectOption('#sample', 'uscis');
await page.click('details.already summary');
await top('.next');
await page.screenshot({ path: 'screenshots/04-safe-next-steps.png' });
await page.click('#clear');
await top('#privacy');
await page.screenshot({ path: 'screenshots/05-privacy-and-limits.png' });
await browser.close();
console.log('done');
