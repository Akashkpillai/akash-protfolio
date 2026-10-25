import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Feature 005: 004's checks extended to every public page, plus axe-core, computed contrast,
// and a keyboard focus walk. Test tooling lives outside the application dependency tree.
const require = createRequire(import.meta.url);
const tools = join(tmpdir(), 'akash-portfolio-qa-tools/node_modules');
const { chromium } = require(join(tools, 'playwright-core'));
const axePath = join(tools, 'axe-core/axe.min.js');
const output = dirname(fileURLToPath(import.meta.url));
const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3100';
const caseStudies = (process.env.CASE_STUDIES ?? '/work/hrms-backend,/work/meridian-assistant,/work/notification-platform,/work/resume-analyzer').split(',');
const publicPages = ['/', '/work', '/changelog', ...caseStudies];
const notFoundPages = ['/work/user-management-api', '/work/meridian', '/nope'];
const pages = [...publicPages, ...notFoundPages];
const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const selectedChecks = new Set(process.argv.slice(2));
const results = selectedChecks.size
  ? JSON.parse(await readFile(join(output, 'results.json'), 'utf8'))
  : { date: new Date().toISOString(), baseURL, checks: {}, errors: [] };
results.lastRun = { date: new Date().toISOString(), checks: [...selectedChecks] };

const browser = await chromium.launch({ executablePath, headless: true });
results.browser = await browser.version();
results.tools = { 'playwright-core': require(join(tools, 'playwright-core/package.json')).version, 'axe-core': require(join(tools, 'axe-core/package.json')).version };

async function run(name, check) {
  if (selectedChecks.size && !selectedChecks.has(name)) return;
  try {
    results.checks[name] = await check();
  } catch (error) {
    results.checks[name] = { status: 'FAIL', error: String(error) };
    results.errors.push({ name, error: String(error) });
  }
  await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(`${name}: ${results.checks[name].status}`);
}

function slugOf(path) {
  return path === '/' ? 'home' : path.slice(1).replaceAll('/', '-');
}

// Colour maths from 001's contrast check.
function rgba(value) {
  if (!/^rgba?\(/.test(value)) throw new Error(`Unsupported color: ${value}`);
  const numbers = value.match(/[\d.]+/g).map(Number);
  return [...numbers.slice(0, 3), numbers[3] ?? 1];
}
function composite(front, back) {
  return front.slice(0, 3).map((channel, i) => channel * front[3] + back[i] * (1 - front[3]));
}
function luminance(rgb) {
  return rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(front, back) {
  const a = luminance(front), b = luminance(back);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
function flatten(backgrounds) {
  return backgrounds.reduce((back, color) => composite(rgba(color), back), [255, 255, 255]);
}

// 001's textContrast, unchanged in method: every element with its own text node.
async function textContrast(page) {
  const rows = await page.evaluate(() => Array.from(document.querySelectorAll('body *'))
    .filter(element => Array.from(element.childNodes).some(node => node.nodeType === 3 && node.textContent.trim())
      && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden'
      && !['SCRIPT', 'STYLE', 'TITLE', 'DESC'].includes(element.tagName))
    .map(element => {
      const style = getComputedStyle(element);
      const backgrounds = [], effects = [];
      for (let parent = element; parent; parent = parent.parentElement) {
        const s = getComputedStyle(parent);
        backgrounds.unshift(s.backgroundColor);
        if (s.backgroundImage !== 'none' || s.opacity !== '1' || s.filter !== 'none') {
          effects.push({ opacity: s.opacity, image: s.backgroundImage, filter: s.filter });
        }
      }
      return {
        tag: element.tagName, class: element.getAttribute('class'),
        text: Array.from(element.childNodes).filter(node => node.nodeType === 3).map(node => node.textContent.trim()).join(' ').slice(0, 60),
        foreground: element.tagName.toLowerCase() === 'text' ? style.fill : style.color,
        backgrounds, fontSize: style.fontSize, fontWeight: style.fontWeight,
        inactive: !!element.closest(':disabled'), effects,
      };
    }));
  if (!rows.length) throw new Error('No rendered text was collected');
  return rows.map(row => {
    const background = flatten(row.backgrounds);
    const ratio = contrast(composite(rgba(row.foreground), background), background);
    const fontSize = Number.parseFloat(row.fontSize);
    const threshold = fontSize >= 24 || (fontSize >= 18.6667 && Number(row.fontWeight) >= 700) ? 3 : 4.5;
    return { tag: row.tag, class: row.class, text: row.text, ratio: Math.round(ratio * 100) / 100, threshold,
      status: row.inactive ? 'EXEMPT-INACTIVE' : row.effects.length ? 'UNRESOLVED-EFFECT' : ratio >= threshold ? 'PASS' : 'FAIL' };
  });
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

// FR-003: 390/768/1440 px, plus 200% zoom emulated as a 720 CSS px viewport at device scale 2.
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
      const response = await page.goto(baseURL + path, { waitUntil: 'networkidle' });
      const result = await layout(page);
      if (publicPages.includes(path) || path === '/nope') {
        await page.screenshot({ path: join(output, `${slugOf(path)}-${label}.png`), fullPage: true });
      }
      const expectedStatus = notFoundPages.includes(path) ? 404 : 200;
      cases.push({ viewport: label, path, status: response.status(), ...result,
        pass: response.status() === expectedStatus && !result.overflow && !result.clipped.length });
    }
    await context.close();
  }
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', method: 'zoom200 is emulated by viewport, not the browser zoom setting', cases };
});

// FR-002: unknown and draft addresses.
await run('notFound', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const cases = [];
  for (const path of notFoundPages) {
    const response = await page.goto(baseURL + path, { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent,
      links: Array.from(document.querySelectorAll('.not-found-links a')).map(a => a.getAttribute('href')),
    }));
    cases.push({ path, status: response.status(), ...data,
      pass: response.status() === 404 && data.links.includes('/') && data.links.includes('/work') });
  }
  await context.close();
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', cases };
});

// FR-005: essential text, navigation, and diagram explanations without JavaScript, every page.
await run('noJavaScript', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await context.newPage();
  const cases = [];
  for (const path of pages) {
    await page.goto(baseURL + path);
    const data = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      navLinks: document.querySelectorAll('.desktop-nav a').length,
      mainText: document.querySelector('main')?.innerText.trim().length ?? 0,
      footer: document.querySelector('.site-footer a')?.textContent ?? null,
      flowStages: document.querySelectorAll('.flow-stage').length,
      sections: Array.from(document.querySelectorAll('.case-section h2')).map(h => h.textContent),
      diagramItems: document.querySelectorAll('.diagram-item').length,
      selectButtons: document.querySelectorAll('.diagram-select').length,
      limitations: document.querySelectorAll('#limitations ~ ul li, [aria-labelledby="limitations"] li').length,
    }));
    let pass = data.h1 === 1 && data.navLinks === 6 && data.mainText > 100 && !!data.footer;
    if (path === '/') pass &&= data.flowStages > 0;
    if (caseStudies.includes(path)) {
      const expected = ['Problem', 'My contribution', 'Implementation', 'Architecture', 'Decisions', 'Tradeoffs', 'Limitations'];
      pass &&= expected.every(s => data.sections.includes(s)) && data.diagramItems > 0 && data.selectButtons === 0 && data.limitations > 0;
    }
    if (notFoundPages.includes(path)) pass = data.h1 === 1 && data.navLinks === 6 && data.mainText > 20;
    cases.push({ path, ...data, pass });
    if (path === '/' || path === '/work/notification-platform') {
      await page.screenshot({ path: join(output, `no-js-${slugOf(path)}.png`), fullPage: true });
    }
  }
  await context.close();
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', cases };
});

// FR-004, FR-006: Tab through every page; every focusable element is reached in DOM order with a
// visible indicator whose colour has at least 3:1 against the background behind it (WCAG 1.4.11).
await run('focusWalk', async () => {
  const cases = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const path of pages) {
      await page.goto(baseURL + path, { waitUntil: 'networkidle' });
      const expected = await page.evaluate(() => {
        const selector = 'a[href], button:not([disabled]), summary, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const all = Array.from(document.querySelectorAll(selector)).filter(el => {
          const closed = el.closest('details:not([open])');
          const insideClosed = closed && !(el.tagName === 'SUMMARY' && el.parentElement === closed);
          return !insideClosed && getComputedStyle(el).visibility !== 'hidden'
            && (el.getClientRects().length || el.classList.contains('skip-link'));
        });
        all.forEach((el, i) => { el.dataset.qaIndex = String(i); });
        return all.length;
      });
      const positiveTabindex = await page.evaluate(() => document.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').length);
      const seen = [];
      const problems = [];
      for (let i = 0; i < expected + 5; i++) {
        await page.keyboard.press('Tab');
        const info = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const s = getComputedStyle(el);
          const backgrounds = [];
          for (let parent = el.parentElement; parent; parent = parent.parentElement) backgrounds.unshift(getComputedStyle(parent).backgroundColor);
          return { index: el.dataset.qaIndex ?? null, text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40),
            outlineStyle: s.outlineStyle, outlineWidth: parseFloat(s.outlineWidth), outlineColor: s.outlineColor, boxShadow: s.boxShadow, backgrounds };
        });
        if (!info || (seen.length && info.index === seen[0].index)) break;
        const visible = (info.outlineStyle !== 'none' && info.outlineWidth > 0) || info.boxShadow !== 'none';
        const ratio = info.outlineStyle !== 'none' ? Math.round(contrast(rgba(info.outlineColor).slice(0, 3), flatten(info.backgrounds)) * 100) / 100 : null;
        seen.push({ index: info.index, text: info.text, visible, outlineColor: info.outlineColor, ratio });
        if (!visible || (ratio !== null && ratio < 3)) problems.push({ text: info.text, visible, ratio });
      }
      const order = seen.map(s => Number(s.index));
      const inOrder = order.every((n, i) => i === 0 || n > order[i - 1]);
      const reachedAll = new Set(order.filter(n => !Number.isNaN(n))).size === expected;
      cases.push({ width, path, focusable: expected, reached: seen.length, inOrder, reachedAll, positiveTabindex,
        minRatio: Math.min(...seen.map(s => s.ratio ?? Infinity)), problems,
        pass: inOrder && reachedAll && positiveTabindex === 0 && !problems.length && !seen.some(s => s.index === null) });
    }
    await context.close();
  }
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', method: 'Tab key from page load; order compared with DOM order of visible focusable elements', cases };
});

// FR-005: with reduced motion, no element keeps a non-zero transition or animation duration.
await run('reducedMotionAll', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const cases = [];
  for (const path of pages) {
    await page.goto(baseURL + path, { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => ({
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      moving: Array.from(document.querySelectorAll('*')).filter(el => {
        const s = getComputedStyle(el);
        return [s.transitionDuration, s.animationDuration].join(',').split(',').some(v => parseFloat(v) > 0.001);
      }).map(el => el.tagName + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '')).slice(0, 10),
    }));
    cases.push({ path, ...data, pass: data.matches && data.scrollBehavior === 'auto' && !data.moving.length });
  }
  await context.close();
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', cases };
});

// FR-006, FR-020: axe-core and computed text contrast at 390 and 1440 px on every page.
await run('accessibility', async () => {
  const cases = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const path of pages) {
      await page.goto(baseURL + path, { waitUntil: 'networkidle' });
      await page.addScriptTag({ path: axePath });
      const axe = await page.evaluate(async tags => {
        const r = await window.axe.run(document, { runOnly: { type: 'tag', values: tags } });
        const brief = list => list.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, targets: v.nodes.slice(0, 5).map(n => n.target.join(' ')) }));
        return { violations: brief(r.violations), incomplete: brief(r.incomplete), passes: r.passes.length };
      }, axeTags);
      const text = await textContrast(page);
      const failing = text.filter(r => r.status === 'FAIL');
      const unresolved = text.filter(r => r.status === 'UNRESOLVED-EFFECT');
      cases.push({ width, path, axeViolations: axe.violations, axeIncomplete: axe.incomplete, axePasses: axe.passes,
        textElements: text.length, minTextRatio: Math.min(...text.filter(r => r.status === 'PASS').map(r => r.ratio)),
        contrastFailures: failing, contrastUnresolved: unresolved.map(r => ({ class: r.class, text: r.text, ratio: r.ratio })),
        pass: !axe.violations.length && !failing.length });
    }
    await context.close();
  }
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', tags: axeTags,
    note: 'Automated checks only; "incomplete" and unresolved-effect items need manual review. Not a conformance claim.', cases };
});

// FR-008: every visible action on every page, with its destination checked.
await run('links', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const hrefs = new Map();
  const sameDocument = [];
  const actions = {};
  for (const path of pages) {
    await page.goto(baseURL + path, { waitUntil: 'networkidle' });
    actions[path] = await page.evaluate(() => [
      ...Array.from(document.querySelectorAll('a[href]')).filter(a => a.getClientRects().length && !a.closest('.desktop-nav, .mobile-nav'))
        .map(a => ({ kind: 'link', text: a.textContent.trim().slice(0, 60), href: a.getAttribute('href') })),
      ...Array.from(document.querySelectorAll('button')).filter(b => b.getClientRects().length && !b.classList.contains('diagram-select') && !b.classList.contains('flow-select'))
        .map(b => ({ kind: 'button', text: b.textContent.trim().slice(0, 60) })),
    ]);
    for (const href of await page.locator('a[href]').evaluateAll(as => as.filter(a => a.getClientRects().length || a.classList.contains('skip-link')).map(a => a.href))) {
      const url = new URL(href);
      if (url.pathname === path && url.hash) {
        const target = await page.evaluate(id => !!document.getElementById(id), url.hash.slice(1));
        sameDocument.push({ href, from: path, target, pass: target });
      } else {
        hrefs.set(href, [...(hrefs.get(href) ?? []), path]);
      }
    }
  }
  const cases = [...sameDocument];
  for (const [href, from] of hrefs) {
    const url = new URL(href);
    if (url.protocol === 'mailto:') {
      // Not fetchable; the confirmed address is the only acceptable mail link.
      cases.push({ href, from, method: 'value', pass: href === 'mailto:akashkpillai55@gmail.com' });
      continue;
    }
    if (url.origin === new URL(baseURL).origin) {
      const response = await page.request.get(url.origin + url.pathname);
      let target = true;
      if (url.hash) {
        await page.goto(url.origin + url.pathname);
        target = await page.evaluate(id => !!document.getElementById(id), url.hash.slice(1));
      }
      cases.push({ href, from: from.length, status: response.status(), type: response.headers()['content-type'], target, pass: response.status() === 200 && target });
    } else {
      const response = await page.request.get(href, { maxRedirects: 5 });
      // LinkedIn answers automated requests with 999: recorded as unconfirmed, confirmed by a person.
      const unconfirmed = url.hostname.endsWith('linkedin.com') && response.status() === 999;
      cases.push({ href, from: from.length, status: response.status(), unconfirmed, pass: response.status() === 200 || unconfirmed });
    }
  }
  await context.close();
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', unconfirmed: cases.filter(c => c.unconfirmed).map(c => c.href), cases, actions };
});

// Regressions from 002–004.
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
    await page.keyboard.press(index === 0 ? 'Enter' : 'Space');
    const state = await page.evaluate(i => ({
      pressed: Array.from(document.querySelectorAll('.diagram-select')).map(b => b.getAttribute('aria-pressed')),
      live: document.querySelector('.diagram-current')?.textContent,
      selectedItem: document.querySelectorAll('.diagram-item')[i]?.classList.contains('diagram-item-selected'),
    }), index);
    steps.push({ index, ...state, pass: state.pressed[index] === 'true' && state.pressed.filter(p => p === 'true').length === 1 && state.live?.startsWith('Selected: ') && state.selectedItem });
  }
  await page.screenshot({ path: join(output, 'diagram-selected.png') });
  await context.close();
  return { status: count === 8 && steps.every(s => s.pass) ? 'PASS' : 'FAIL', buttons: count, steps };
});

await run('regression001', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
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
  await context.close();
  const pass = opened && JSON.stringify(items) === JSON.stringify(['Home', 'Work', 'Experience', 'About', 'Approach', 'Contact'])
    && !escape.open && escape.focusOnSummary && first?.startsWith('Current step: Input') && second?.startsWith('Current step: Process');
  return { status: pass ? 'PASS' : 'FAIL', mobileNav: { opened, items, escape }, flow: { first, second } };
});

await run('profile', async () => {
  const pkgVersion = JSON.parse(await readFile(join(output, '../../../package.json'), 'utf8')).version;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await page.locator('.copy-email-button').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  const copyStatus = await page.locator('.copy-email-status').textContent();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
  const resumeLinks = await page.locator('a[download]').evaluateAll(as => as.map(a => a.getAttribute('href')));
  const pdf = await page.request.get(baseURL + '/resume/Akash_K_Pillai_Resume.pdf');
  const footers = [];
  for (const path of publicPages) {
    await page.goto(baseURL + path, { waitUntil: 'networkidle' });
    footers.push(await page.locator('.site-footer a').textContent());
  }
  await page.goto(baseURL + '/changelog', { waitUntil: 'networkidle' });
  const newest = await page.locator('.release h2').first().textContent();
  await context.close();
  const pass = copyStatus === 'Email copied' && clipboard === 'akashkpillai55@gmail.com'
    && resumeLinks.length >= 1 && resumeLinks.every(h => h === '/resume/Akash_K_Pillai_Resume.pdf')
    && pdf.status() === 200 && pdf.headers()['content-type'] === 'application/pdf'
    && footers.every(f => f === `Version ${pkgVersion}`) && newest.startsWith(`Version ${pkgVersion}`);
  return { status: pass ? 'PASS' : 'FAIL', copyStatus, clipboard, resumeLinks, pdfStatus: pdf.status(), pkgVersion, footers, newest };
});

await browser.close();
if (results.errors.length) console.log(JSON.stringify(results.errors, null, 2));
