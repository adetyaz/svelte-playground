import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3500);
await page.screenshot({ path: 'shot-hero.png' });
// hover the third row to catch the sweep + sparkline
const row = page.locator('.row').nth(2);
await row.hover();
await page.waitForTimeout(700);
await page.screenshot({ path: 'shot-hover.png' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
await page.screenshot({ path: 'shot-bottom.png' });
await browser.close();
console.log('done');
