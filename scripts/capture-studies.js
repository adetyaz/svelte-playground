// Screenshots every study route for the homepage deck's SHOTS art.
//
//   npm run dev                      (in another terminal)
//   npm run capture:studies          (all routes)
//   npm run capture:studies -- flip  (just the slugs you name)
//
// Shots land in src/lib/assets/studies/<slug>.jpg, where the homepage picks them up.
import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const ROUTES = 'src/routes';
const OUT = 'src/lib/assets/studies';
const SETTLE_MS = 3000; // let entrance animations finish

const only = process.argv.slice(2);
const slugs = readdirSync(ROUTES, { withFileTypes: true })
	.filter((entry) => entry.isDirectory() && existsSync(join(ROUTES, entry.name, '+page.svelte')))
	.map((entry) => entry.name)
	.filter((slug) => only.length === 0 || only.includes(slug));

mkdirSync(OUT, { recursive: true });

// Prefer Playwright's own Chromium; fall back to an installed Chrome or Edge.
const launch = async () => {
	for (const channel of [undefined, 'chrome', 'msedge']) {
		try {
			return await chromium.launch({ channel });
		} catch {
			/* try the next one */
		}
	}
	throw new Error('No browser found. Run `npx playwright install chromium`.');
};

const browser = await launch();
const page = await browser.newPage({
	viewport: { width: 1280, height: 900 },
	deviceScaleFactor: 1
});

for (const slug of slugs) {
	try {
		await page.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle', timeout: 20000 });
		await page.waitForTimeout(SETTLE_MS);
		await page.screenshot({ path: join(OUT, `${slug}.jpg`), type: 'jpeg', quality: 72 });
		console.log(`✓ ${slug}`);
	} catch (error) {
		console.log(`✗ ${slug}: ${error.message.split('\n')[0]}`);
	}
}

await browser.close();
