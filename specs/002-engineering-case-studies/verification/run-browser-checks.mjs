import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Test tooling lives outside the application dependency tree (same setup as 001).
const require = createRequire(import.meta.url);
const { chromium } = require(join(tmpdir(), 'akash-portfolio-qa-tools/node_modules/playwright-core'));
const output = dirname(fileURLToPath(import.meta.url));
const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3100';
const pages = ['/', '/work', '/work/resume-analyzer', '/work/notification-platform', '/work/user-management-api', '/work/meridian'];
const caseStudies = pages.filter(path => path.startsWith('/work/') && path !== '/work/meridian');
const results = { date: new Date().toISOString(), baseURL, checks: {}, errors: [] };

const browser = await chromium.launch({ executablePath, headless: true });

async function run(name, check) {
  try {
    results.checks[name] = await check();
  } catch (error) {
    results.checks[name] = { status: 'FAIL', error: String(error) };
    results.errors.push({ name, error: String(error) });
  }
}

function slugOf(path) {
  return path === '/' ? 'home' : path.slice(1).replaceAll('/', '-');
}

async function layout(page) {
  return page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    clipped: Array.from(document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,dd'))
      .filter(el => el.getClientRects().length && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible')
      .map(el => el.textContent.trim().slice(0, 60)),
  }));
}

// 390/768/1440 px, plus 200% zoom emulated as a 720 CSS px viewport at device scale 2
// (the CSS viewport a 1440 px window has at 200% browser zoom).
await run('responsive', async () => {
  const viewports = [
    { label: '390', width: 390, height: 844, deviceScaleFactor: 1 },
    { label: '768', width: 768, height: 1024, deviceScaleFactor: 1 },
    { label: '1440', width: 1440, height: 900, deviceScaleFactor: 1 },
    { label: 'zoom200', width: 720, height: 450, deviceScaleFactor: 2 },
  ];
  const cases = [];
  for (const { label, ...viewport } of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: viewport.deviceScaleFactor });
    const page = await context.newPage();
    for (const path of pages) {
      await page.goto(baseURL + path, { waitUntil: 'networkidle' });
      const result = await layout(page);
      if (path !== '/work/meridian') {
        await page.screenshot({ path: join(output, `${slugOf(path)}-${label}.png`), fullPage: true });
      }
      cases.push({ viewport: label, path, ...result, pass: !result.overflow && !result.clipped.length });
    }
    await context.close();
  }
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', method: 'zoom200 is emulated by viewport, not the browser zoom setting', cases };
});

await run('noJavaScript', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await context.newPage();
  const cases = [];
  for (const path of caseStudies) {
    await page.goto(baseURL + path);
    const data = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      sections: Array.from(document.querySelectorAll('.case-section h2')).map(h => h.textContent),
      diagramItems: document.querySelectorAll('.diagram-item').length,
      statusLabels: document.querySelectorAll('.claim-status').length,
      selectButtons: document.querySelectorAll('.diagram-select').length,
      sourceLink: document.querySelector('.case-meta a')?.textContent ?? null,
      limitations: document.querySelectorAll('#limitations ~ ul li, [aria-labelledby="limitations"] li').length,
    }));
    const expected = ['Problem', 'My contribution', 'Implementation', 'Architecture', 'Decisions', 'Tradeoffs', 'Limitations'];
    const pass = data.h1 === 1 && expected.every(s => data.sections.includes(s)) && data.diagramItems > 0
      && data.selectButtons === 0 && !!data.sourceLink && data.limitations > 0;
    cases.push({ path, ...data, pass });
  }
  await page.screenshot({ path: join(output, 'no-js-notification-platform.png'), fullPage: true });
  await context.close();
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', cases };
});

await run('keyboardNavigation', async () => {
  const cases = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(baseURL + '/work/resume-analyzer', { waitUntil: 'networkidle' });
    if (width === 390) {
      await page.locator('.mobile-nav-summary').focus();
      await page.keyboard.press('Enter');
      const work = page.locator('.mobile-nav-panel a', { hasText: 'Work' });
      await work.focus();
    } else {
      await page.locator('.desktop-nav a', { hasText: 'Work' }).focus();
    }
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/#work$/);
    await page.waitForTimeout(300);
    const reached = await page.evaluate(() => {
      const section = document.getElementById('work');
      const rect = section?.getBoundingClientRect();
      return { url: location.pathname + location.hash, sectionExists: !!section, sectionTop: rect ? Math.round(rect.top) : null };
    });
    cases.push({ width, ...reached, pass: reached.url === '/#work' && reached.sectionExists });
    await context.close();
  }

  // Homepage → case study within two activations, keyboard only: tab to the story link, press Enter.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const activations = [];
  for (const path of caseStudies) {
    await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
    const link = page.locator(`.project-story a[href="${path}"]`);
    await link.focus();
    const focusVisible = await link.evaluate(el => getComputedStyle(el).outlineStyle !== 'none');
    await page.keyboard.press('Enter');
    await page.waitForURL(baseURL + path);
    activations.push({ path, activations: 1, focusVisible, pass: focusVisible });
  }
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await page.locator('a.work-all-link').focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(baseURL + '/work');
  const workItems = await page.locator('.work-index-list > li h2 a').evaluateAll(as => as.map(a => a.getAttribute('href')));
  await context.close();
  const workPass = JSON.stringify(workItems) === JSON.stringify(caseStudies);
  return {
    status: cases.every(c => c.pass) && activations.every(a => a.pass) && workPass ? 'PASS' : 'FAIL',
    navToWork: cases, homepageToCaseStudy: activations, workIndexOrder: workItems,
  };
});

await run('diagramSelection', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/work/notification-platform', { waitUntil: 'networkidle' });
  const buttons = page.locator('.diagram-select');
  const count = await buttons.count();
  const steps = [];
  for (const index of [0, 5]) {
    const button = buttons.nth(index);
    await button.focus();
    const focusVisible = await button.evaluate(el => getComputedStyle(el).outlineStyle !== 'none');
    await page.keyboard.press(index === 0 ? 'Enter' : 'Space');
    const state = await page.evaluate(i => ({
      pressed: Array.from(document.querySelectorAll('.diagram-select')).map(b => b.getAttribute('aria-pressed')),
      live: document.querySelector('.diagram-current')?.textContent,
      liveAttr: document.querySelector('.diagram-current')?.getAttribute('aria-live'),
      selectedItem: document.querySelectorAll('.diagram-item')[i]?.classList.contains('diagram-item-selected'),
      selectedNodes: document.querySelectorAll('.diagram-node-selected').length,
    }), index);
    steps.push({ index, key: index === 0 ? 'Enter' : 'Space', focusVisible, ...state,
      pass: focusVisible && state.pressed[index] === 'true' && state.pressed.filter(p => p === 'true').length === 1
        && state.live?.startsWith('Selected: ') && state.liveAttr === 'polite' && state.selectedItem && state.selectedNodes === 1 });
  }
  await buttons.nth(2).click();
  const pointer = await page.evaluate(() => document.querySelector('.diagram-current')?.textContent);
  await page.screenshot({ path: join(output, 'diagram-selected.png'), fullPage: false, clip: undefined });
  const labels = await page.evaluate(() => ({
    pushUnfinished: Array.from(document.querySelectorAll('.diagram-item')).some(li => li.textContent.includes('Push worker') && li.textContent.includes('Unfinished')),
    retryICP: Array.from(document.querySelectorAll('.diagram-item')).some(li => li.textContent.includes('Retry and dead-letter') && li.textContent.includes('Implemented code path')),
    dashedPushEdge: !!document.querySelector('.diagram-edge-unfinished'),
  }));
  await context.close();
  const pass = count === 8 && steps.every(s => s.pass) && pointer?.startsWith('Selected: Router') && Object.values(labels).every(Boolean);
  return { status: pass ? 'PASS' : 'FAIL', buttons: count, steps, pointer, labels };
});

await run('reducedMotion', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(baseURL + '/work/notification-platform', { waitUntil: 'networkidle' });
  await page.locator('.diagram-select').first().click();
  const data = await page.evaluate(() => ({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    transitions: Array.from(document.querySelectorAll('.diagram-item, .diagram-node rect, .diagram-select'))
      .map(el => getComputedStyle(el).transitionDuration).filter(d => d.split(',').some(v => parseFloat(v) > 0.001)),
    live: document.querySelector('.diagram-current')?.textContent,
  }));
  await context.close();
  return { status: data.matches && !data.transitions.length && data.live?.startsWith('Selected: ') ? 'PASS' : 'FAIL', ...data };
});

await run('links', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const hrefs = new Set();
  const sameDocument = [];
  for (const path of pages) {
    await page.goto(baseURL + path, { waitUntil: 'networkidle' });
    for (const href of await page.locator('a[href]').evaluateAll(as => as.filter(a => a.getClientRects().length || a.classList.contains('skip-link')).map(a => a.href))) {
      const url = new URL(href);
      if (url.pathname === path && url.hash) {
        // Same-page anchor (e.g. the skip link on the 404 page): only its target matters.
        const target = await page.evaluate(id => !!document.getElementById(id), url.hash.slice(1));
        sameDocument.push({ href, from: path, target, pass: target });
      } else {
        hrefs.add(href);
      }
    }
  }
  const cases = [...sameDocument];
  for (const href of hrefs) {
    const url = new URL(href);
    if (url.origin === new URL(baseURL).origin) {
      const response = await page.request.get(url.origin + url.pathname);
      let target = true;
      if (url.hash) {
        await page.goto(url.origin + url.pathname);
        target = await page.evaluate(id => !!document.getElementById(id), url.hash.slice(1));
      }
      cases.push({ href, status: response.status(), target, pass: response.status() === 200 && target });
    } else {
      const response = await page.request.get(href, { maxRedirects: 5 });
      cases.push({ href, status: response.status(), pass: response.status() === 200 });
    }
  }
  await context.close();
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', cases };
});

// FR-018: 001 hero, mobile disclosure, and illustrative flow behave as accepted.
await run('regression001', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const hero = await page.evaluate(() => ({
    name: document.querySelector('.hero-name')?.textContent,
    role: document.querySelector('.hero-role')?.textContent,
    headline: document.querySelector('#hero-title')?.textContent,
    actions: Array.from(document.querySelectorAll('.hero-action')).map(a => [a.textContent.trim(), a.getAttribute('href')]),
  }));
  const summary = page.locator('.mobile-nav-summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  const opened = await page.evaluate(() => document.querySelector('.mobile-nav').open);
  const items = await page.locator('.mobile-nav-panel a').allTextContents();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');
  const escape = await page.evaluate(() => ({
    open: document.querySelector('.mobile-nav').open,
    focusOnSummary: document.activeElement?.classList.contains('mobile-nav-summary'),
  }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('.flow-control-secondary').click();
  const first = await page.locator('.flow-current').textContent();
  await page.locator('.flow-control-primary').click();
  const second = await page.locator('.flow-current').textContent();
  const pressed = await page.locator('.flow-select').evaluateAll(bs => bs.map(b => b.getAttribute('aria-pressed')));
  await context.close();
  const pass = !!hero.name && !!hero.role && !!hero.headline
    && hero.actions.some(([text, href]) => text.startsWith('Explore the flow') && href === '#approach')
    && opened && JSON.stringify(items) === JSON.stringify(['Home', 'Work', 'Approach'])
    && !escape.open && escape.focusOnSummary
    && first?.startsWith('Current step: Input') && second?.startsWith('Current step: Process') && pressed[1] === 'true';
  return { status: pass ? 'PASS' : 'FAIL', hero, mobileNav: { opened, items, escape }, flow: { first, second, pressed } };
});

await browser.close();
await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2));
for (const [name, result] of Object.entries(results.checks)) console.log(`${name}: ${result.status}`);
if (results.errors.length) console.log(JSON.stringify(results.errors, null, 2));
