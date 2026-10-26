// Feature 008 SC-001/SC-002: hero height, top of #work, and above-the-fold hero items at
// 390/768/1440 px, with motion reduced so the entrance does not shift anything.
// Usage: BASE_URL=http://127.0.0.1:3101 node measure-layout.mjs [label]
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(join(tmpdir(), 'akash-portfolio-qa-tools/node_modules/playwright-core'));
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3100';
const label = process.argv[2] ?? 'current';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const rows = [];
for (const [width, height] of [[390, 844], [768, 1024], [1440, 900]]) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  rows.push({
    width,
    ...(await page.evaluate(() => {
      const top = (selector) => {
        const element = document.querySelector(selector);
        return element ? Math.round(element.getBoundingClientRect().top + scrollY) : null;
      };
      const visible = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return rect.bottom <= innerHeight && rect.height > 0;
      };
      return {
        heroHeight: Math.round(document.querySelector('#systems').getBoundingClientRect().height),
        workTop: top('#work'),
        nameVisible: visible('#lab-title'),
        introVisible: visible('.lab-copy'),
        actionsVisible: visible('.lab-actions'),
        mapVisible: visible('.lab-orbit'),
      };
    })),
  });
  await context.close();
}
await browser.close();
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), `layout-${label}.json`), JSON.stringify({ baseURL, rows }, null, 2));
console.log(JSON.stringify(rows, null, 2));
