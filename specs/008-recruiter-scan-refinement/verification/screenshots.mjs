// Feature 008 T026: full-page screenshots after scrolling every section (so reveals have run),
// plus hero states. Usage: BASE_URL=... node screenshots.mjs [prefix]
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(join(tmpdir(), 'akash-portfolio-qa-tools/node_modules/playwright-core'));
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3100';
const prefix = process.argv[2] ?? '';
const out = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const pause = () => new Promise((resolve) => setTimeout(resolve, 150));
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.5)) {
      scrollTo(0, y);
      await pause();
    }
    scrollTo(0, document.documentElement.scrollHeight);
    await pause();
    await pause();
  });
  await page.waitForTimeout(500);
  const waiting = await page.evaluate(() => document.querySelectorAll('.reveal[data-reveal="waiting"]').length);
  if (waiting) console.warn(`${page.url()}: ${waiting} reveal(s) still waiting`);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
}

for (const [width, height] of [[1440, 900], [768, 1024], [390, 844]]) {
  const context = await browser.newContext({ viewport: { width, height } });
  // Skip the first-visit entrance so captures show the settled page.
  await context.addInitScript(() => sessionStorage.setItem('lab-intro-seen', '1'));
  const page = await context.newPage();
  for (const path of ['/', '/work']) {
    await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' });
    await scrollThrough(page);
    const name = path === '/' ? 'home' : 'work';
    if (path === '/') await page.screenshot({ path: join(out, `${prefix}${name}-${width}-fold.png`) });
    await page.screenshot({ path: join(out, `${prefix}${name}-${width}-full.png`), fullPage: true });
  }
  if (!prefix) {
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
    await page.locator('.lab-architecture > summary').click();
    await page.waitForTimeout(300);
    await page.locator('#architecture-panel').screenshot({ path: join(out, `hero-architecture-open-${width}.png`) });
  }
  await context.close();
}
await browser.close();
console.log('done');
