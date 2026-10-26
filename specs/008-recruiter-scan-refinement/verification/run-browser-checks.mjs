import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Feature 008 Revision 1: probe (starts docked; still while a traced step is in view), probeWander
// (SC-005: occasional slow trips, safe landings, no trips while typing, paused, or hidden), and
// cardTilt (SC-008: ±2° under a mouse only).
// Feature 008: 007's suite with assertions changed only where 008 changes behaviour (hero
// disclosure, phone selectors, idle Probe, four starter questions, #message inside Contact), plus
// cardText (SC-003), contactSection (SC-007), and workPosition (SC-002).
// Feature 007: 006's checks plus Probe, Ask the lab, motion pause, and message form.
// Feature 006 (Systems Lab): 005's checks (every public page, axe-core, computed contrast,
// keyboard focus walk) adapted to the new navigation, plus project-map, mobile-map,
// first-screen, navigation-from-every-route, case-study summary, and reveal checks.
// Test tooling lives outside the application dependency tree.
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
// Revision 4: every check starts with the homepage entrance already seen, so it sees the settled
// page; `{ intro: true }` opts a context out of that (the `intro` check).
const openContext = browser.newContext.bind(browser);
browser.newContext = async ({ intro = false, ...options } = {}) => {
  const context = await openContext(options);
  if (!intro) await context.addInitScript(() => { try { sessionStorage.setItem('lab-intro-seen', '1'); } catch {} });
  return context;
};
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
  // Windows can briefly lock the file (editor or antivirus); retry before giving up.
  for (let attempt = 1; ; attempt++) {
    try {
      await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
      break;
    } catch (error) {
      if (attempt === 5) throw error;
      await new Promise(resolve => setTimeout(resolve, 300 * attempt));
    }
  }
  console.log(`${name}: ${results.checks[name].status}`);
}


// Screenshots can hit the same transient Windows file lock as results.json; retry briefly.
async function shot(page, options) {
  for (let attempt = 1; ; attempt++) {
    try { return await page.screenshot(options); }
    catch (error) { if (attempt === 5) throw error; await new Promise(r => setTimeout(r, 300 * attempt)); }
  }
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

// 001's textContrast, extended for 006: the dark theme draws a grid and a glow with CSS
// gradients, which 001 treated as unresolved. Each gradient colour stop is now composited over
// the solid colours beneath it and the worst ratio is taken; only url() images, opacity, and
// filters stay unresolved.
async function textContrast(page) {
  const rows = await page.evaluate(() => Array.from(document.querySelectorAll('body *'))
    .filter(element => Array.from(element.childNodes).some(node => node.nodeType === 3 && node.textContent.trim())
      && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden'
      && !['SCRIPT', 'STYLE', 'TITLE', 'DESC'].includes(element.tagName))
    .map(element => {
      const style = getComputedStyle(element);
      const backgrounds = [], gradients = [], effects = [];
      for (let parent = element; parent; parent = parent.parentElement) {
        const s = getComputedStyle(parent);
        backgrounds.unshift(s.backgroundColor);
        gradients.unshift(s.backgroundImage === 'none' ? [] : s.backgroundImage.match(/rgba?\([^)]*\)/g) ?? []);
        if (/url\(/.test(s.backgroundImage) || s.opacity !== '1' || s.filter !== 'none') {
          effects.push({ opacity: s.opacity, image: s.backgroundImage, filter: s.filter });
        }
      }
      return {
        tag: element.tagName, class: element.getAttribute('class'),
        text: Array.from(element.childNodes).filter(node => node.nodeType === 3).map(node => node.textContent.trim()).join(' ').slice(0, 60),
        foreground: element.tagName.toLowerCase() === 'text' ? style.fill : style.color,
        backgrounds, gradients, fontSize: style.fontSize, fontWeight: style.fontWeight,
        inactive: !!element.closest(':disabled'), effects,
      };
    }));
  if (!rows.length) throw new Error('No rendered text was collected');
  return rows.map(row => {
    // Candidate backgrounds: the solid stack, plus each gradient stop layered at its level.
    const candidates = [flatten(row.backgrounds)];
    row.gradients.forEach((stops, level) => {
      for (const stop of stops) {
        const below = flatten(row.backgrounds.slice(0, level + 1));
        candidates.push(row.backgrounds.slice(level + 1).reduce((back, color) => composite(rgba(color), back), composite(rgba(stop), below)));
      }
    });
    const ratio = Math.min(...candidates.map(background => contrast(composite(rgba(row.foreground), background), background)));
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
        await shot(page, { path: join(output, `${slugOf(path)}-${label}.png`), fullPage: true });
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
      // Homepage: nodes are links before hydration; the noscript block lists every flow.
      nodeLinks: Array.from(document.querySelectorAll('a.lab-node')).map(a => a.getAttribute('href')),
      nodeButtons: document.querySelectorAll('button.lab-node').length,
      traceButtons: document.querySelectorAll('.lab-panel-actions button').length,
      staticProjects: document.querySelectorAll('.lab-static > ol > li').length,
      staticSteps: document.querySelectorAll('.lab-static > ol > li > ol > li').length,
      panelSteps: document.querySelectorAll('#architecture-panel .lab-step').length,
      sections: Array.from(document.querySelectorAll('.case-section h2')).map(h => h.textContent),
      diagramItems: document.querySelectorAll('.diagram-item').length,
      selectButtons: document.querySelectorAll('.diagram-select').length,
      limitations: document.querySelectorAll('#limitations ~ ul li, [aria-labelledby="limitations"] li').length,
      hiddenSections: Array.from(document.querySelectorAll('.reveal')).filter(s => getComputedStyle(s).opacity !== '1').length,
    }));
    let pass = data.h1 === 1 && data.navLinks === 5 && data.mainText > 100 && !!data.footer;
    if (path === '/') {
      pass &&= data.nodeLinks.length === caseStudies.length && data.nodeLinks.every(h => caseStudies.includes(h))
        && data.nodeButtons === 0 && data.traceButtons === 0 && data.staticProjects === caseStudies.length
        && data.staticSteps > 0 && data.panelSteps > 0;
    }
    if (caseStudies.includes(path)) {
      const expected = ['Problem', 'My contribution', 'Implementation', 'Architecture', 'Decisions', 'Tradeoffs', 'Limitations'];
      pass &&= expected.every(s => data.sections.includes(s)) && data.diagramItems > 0 && data.selectButtons === 0
        && data.limitations > 0 && data.hiddenSections === 0;
    }
    if (notFoundPages.includes(path)) pass = data.h1 === 1 && data.navLinks === 5 && data.mainText > 20;
    cases.push({ path, ...data, pass });
    if (path === '/' || path === '/work/notification-platform') {
      await shot(page, { path: join(output, `no-js-${slugOf(path)}.png`), fullPage: true });
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
    // Reduced motion: measure the settled page, not sections still waiting to reveal (opacity 0).
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
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
  await shot(page, { path: join(output, 'diagram-selected.png') });
  await context.close();
  return { status: count === 8 && steps.every(s => s.pass) ? 'PASS' : 'FAIL', buttons: count, steps };
});

// 001's mobile disclosure, with 006's items (the illustrative flow it also checked is removed).
await run('mobileNav', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const summary = page.locator('.mobile-nav-summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  const opened = await page.evaluate(() => document.querySelector('.mobile-nav').open);
  const items = await page.locator('.mobile-nav-panel a').allTextContents();
  const resume = await page.locator('.mobile-nav-panel a[download]').getAttribute('href');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Escape');
  const escape = await page.evaluate(() => ({
    open: document.querySelector('.mobile-nav').open,
    focusOnSummary: document.activeElement?.classList.contains('mobile-nav-summary'),
  }));
  await context.close();
  const pass = opened && JSON.stringify(items) === JSON.stringify(['Work', 'Experience', 'About', 'Contact', 'Resume'])
    && resume === '/resume/Akash_K_Pillai_Resume.pdf' && !escape.open && escape.focusOnSummary;
  return { status: pass ? 'PASS' : 'FAIL', opened, items, resume, escape };
});

const nodeName = async locator => (await locator.locator('.lab-node-name').textContent())?.trim();

// FR-005–FR-010: select every node by click, Enter, and Space; the panel, pressed state, and
// live message follow; focus and scroll stay put; trace steps through the flow.
await run('constellation', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('button.lab-node');
  // Revision 2: planets revolve; pointing at the map holds them still, as for a visitor.
  await page.hover('.lab-core');
  const nodes = page.locator('button.lab-node');
  const count = await nodes.count();
  const selections = [];
  for (let i = 0; i < count; i++) {
    const node = nodes.nth(i);
    const name = await nodeName(node);
    const method = ['click', 'Enter', 'Space'][i % 3];
    const scrollBefore = await page.evaluate(() => window.scrollY);
    if (method === 'click') await node.click();
    else { await node.focus(); await page.keyboard.press(method); }
    await page.waitForTimeout(250);
    const state = await page.evaluate(() => ({
      pressed: Array.from(document.querySelectorAll('button.lab-node')).map(b => b.getAttribute('aria-pressed')),
      heading: document.querySelector('#lab-panel-title')?.textContent,
      link: document.querySelector('#architecture-panel .lab-panel-link')?.getAttribute('href'),
      live: document.querySelector('.lab-stage [aria-live="polite"]')?.textContent,
      focused: document.activeElement?.classList.contains('lab-node') ? document.activeElement.textContent.trim() : null,
      scrollY: window.scrollY,
      steps: document.querySelectorAll('#architecture-panel .lab-step').length,
    }));
    const keyboard = method !== 'click';
    selections.push({ name, method, ...state,
      pass: state.pressed[i] === 'true' && state.pressed.filter(p => p === 'true').length === 1 && state.heading === name
        && caseStudies.includes(state.link) && state.live === `Showing ${name}: ${state.steps} steps.`
        && (!keyboard || (state.focused?.includes(name) && state.scrollY === scrollBefore)) });
  }
  // Feature 008 FR-003/FR-004: the flow is behind "Explore architecture", closed on load; it opens by
  // keyboard and stays open when another project is selected.
  const disclosure = page.locator('#architecture-panel details.lab-architecture');
  const closedAtFirst = !(await disclosure.evaluate(d => d.open));
  await page.locator('#architecture-panel .lab-architecture > summary').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  const openedByKeyboard = await disclosure.evaluate(d => d.open);
  await nodes.nth(0).click();
  await page.waitForTimeout(250);
  await nodes.nth(count - 1).click();
  await page.waitForTimeout(250);
  const keptOpen = await page.locator('#architecture-panel details.lab-architecture').evaluate(d => d.open);
  const disclosurePass = closedAtFirst && openedByKeyboard && keptOpen;
  // Trace the last selected project's flow to the end and around once.
  const trace = page.locator('#architecture-panel .lab-panel-actions button');
  const total = await page.locator('#architecture-panel .lab-step').count();
  const traceStates = [];
  for (let i = 0; i <= total; i++) {
    const label = (await trace.textContent())?.trim();
    await trace.click();
    traceStates.push(await page.evaluate(() => ({
      current: Array.from(document.querySelectorAll('#architecture-panel .lab-step')).findIndex(s => s.getAttribute('aria-current') === 'step'),
      live: document.querySelector('.lab-stage [aria-live="polite"]')?.textContent,
    })).then(s => ({ label, ...s })));
  }
  await shot(page, { path: join(output, 'constellation-traced-1440.png') });
  await context.close();
  const tracePass = traceStates.every((s, i) => s.current === i % total && s.live?.startsWith(`Step ${(i % total) + 1} of ${total}: `))
    && traceStates[0].label === 'Trace flow' && traceStates[total - 1].label === 'Next step' && traceStates[total].label === 'Restart trace';

  // Touch: tap a node on a touch phone.
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const phone = await touch.newPage();
  await phone.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await phone.waitForSelector('button.lab-node');
  const target = phone.locator('button.lab-node').nth(2);
  const tapName = await nodeName(target);
  await target.tap();
  await phone.waitForTimeout(250);
  const tapped = await phone.evaluate(() => ({
    pressed: Array.from(document.querySelectorAll('button.lab-node')).map(b => b.getAttribute('aria-pressed')),
    heading: document.querySelector('#lab-panel-title')?.textContent,
  }));
  await touch.close();
  const tapPass = tapped.pressed[2] === 'true' && tapped.heading === tapName;
  return { status: count === caseStudies.length && selections.every(s => s.pass) && disclosurePass && tracePass && tapPass ? 'PASS' : 'FAIL',
    count, selections, disclosure: { closedAtFirst, openedByKeyboard, keptOpen }, traceStates, tap: { name: tapName, ...tapped, pass: tapPass } };
});

// FR-024, FR-025 (007), changed by 008 FR-005: phones show compact selectors in two columns
// (≥ 44 × 44 px, no overlap) with the summary after them and its flow collapsed.
await run('mobileMap', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const rect = el => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right, width: r.width, height: r.height }; };
    return {
      nodes: Array.from(document.querySelectorAll('.lab-node')).map(rect),
      panel: rect(document.querySelector('#architecture-panel')),
      flowOpen: document.querySelector('#architecture-panel details.lab-architecture')?.open ?? null,
      actions: Array.from(document.querySelectorAll('.lab-actions a, .mobile-nav-summary')).map(rect),
      viewport: innerWidth,
    };
  });
  await context.close();
  const overlap = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const twoColumns = new Set(data.nodes.map(n => Math.round(n.left))).size === 2
    && data.nodes.every((n, i) => data.nodes.every((m, j) => i === j || !overlap(n, m)));
  const sized = [...data.nodes, ...data.actions].every(r => r.width >= 44 && r.height >= 44);
  const inside = data.nodes.every(n => n.left >= 0 && n.right <= data.viewport);
  const panelAfter = data.panel.top >= data.nodes.at(-1).bottom;
  const collapsed = data.flowOpen === false;
  return { status: twoColumns && sized && inside && panelAfter && collapsed ? 'PASS' : 'FAIL', twoColumns, sized, inside, panelAfter, collapsed, ...data };
});

// SC-001 (008): at 1440 × 900, role, name, introduction, all three actions, and every node are in
// the first screen.
await run('firstScreen', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const items = await page.evaluate(() => Array.from(document.querySelectorAll('#lab-title, .lab-kicker, .lab-copy, .lab-actions a, .lab-actions button, .lab-node'))
    .map(el => { const r = el.getBoundingClientRect(); return { text: el.textContent.trim().slice(0, 30), top: Math.round(r.top), bottom: Math.round(r.bottom), visible: r.top >= 0 && r.bottom <= innerHeight }; }));
  await context.close();
  return { status: items.length >= 10 && items.every(i => i.visible) ? 'PASS' : 'FAIL', items };
});

// Edge case: every navigation item works from other routes, desktop and mobile, by keyboard.
await run('navFromEveryRoute', async () => {
  const targets = { Work: 'work', Experience: 'experience', About: 'about', Contact: 'contact' };
  const cases = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const from of ['/work/hrms-backend', '/changelog', '/nope']) {
      for (const [label, id] of Object.entries(targets)) {
        await page.goto(baseURL + from, { waitUntil: 'networkidle' });
        if (width === 390) {
          await page.locator('.mobile-nav-summary').focus();
          await page.keyboard.press('Enter');
          await page.locator('.mobile-nav-panel a', { hasText: new RegExp(`^${label}$`) }).focus();
        } else {
          await page.locator('.desktop-nav a', { hasText: new RegExp(`^${label}$`) }).focus();
        }
        await page.keyboard.press('Enter');
        await page.waitForURL(new RegExp(`/#${id}$`));
        await page.waitForTimeout(150);
        cases.push({ width, from, label, pass: await page.evaluate(i => !!document.getElementById(i), id) });
      }
      // Feature 008 FR-019: an old link to the message form still lands inside Contact.
      await page.goto(baseURL + from, { waitUntil: 'networkidle' });
      await page.goto(baseURL + '/#message', { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      cases.push({ width, from, label: '#message', pass: await page.evaluate(() => {
        const target = document.getElementById('message');
        const r = target?.getBoundingClientRect();
        return !!target && !!target.closest('#contact') && r.top < innerHeight && r.bottom > 0;
      }) });
    }
    await context.close();
  }
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', checked: cases.length, failures: cases.filter(c => !c.pass) };
});

// FR-015: wide screens keep a sticky summary that marks the section in view; narrow do not.
await run('caseStudyNav', async () => {
  const cases = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(baseURL + '/work/notification-platform', { waitUntil: 'networkidle' });
    const nav = page.locator('nav[aria-label="Case study sections"]');
    const exists = await nav.count();
    const position = exists ? await nav.evaluate(el => getComputedStyle(el).position) : null;
    const current = [];
    for (const id of ['limitations', 'implementation']) {
      await page.evaluate(i => document.getElementById(i).scrollIntoView({ block: 'start', behavior: 'instant' }), id);
      await page.waitForTimeout(400);
      current.push({ id, current: await page.evaluate(() => document.querySelector('nav[aria-label="Case study sections"] [aria-current="true"]')?.getAttribute('href')) });
    }
    const inView = exists ? await nav.evaluate(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }) : false;
    if (width === 1440) await shot(page, { path: join(output, 'case-study-summary-1440.png') });
    await context.close();
    const tracking = current.every(c => c.current === `#${c.id}`);
    cases.push({ width, exists, position, inView, current,
      pass: exists === 1 && tracking && (width === 1440 ? position === 'sticky' && inView : position !== 'sticky') });
  }
  return { status: cases.every(c => c.pass) ? 'PASS' : 'FAIL', cases };
});

// FR-016: sections are visible by default; with motion allowed a below-fold section reveals on scroll.
await run('reveal', async () => {
  const opacities = page => page.evaluate(() => Array.from(document.querySelectorAll('.reveal')).map(s => getComputedStyle(s).opacity));
  const reduced = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rp = await reduced.newPage();
  await rp.goto(baseURL + '/work/resume-analyzer', { waitUntil: 'networkidle' });
  const reducedOpacities = await opacities(rp);
  await reduced.close();
  const motion = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const mp = await motion.newPage();
  await mp.goto(baseURL + '/work/resume-analyzer', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(300);
  const before = await opacities(mp);
  await mp.evaluate(() => document.getElementById('limitations').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await mp.waitForTimeout(1000);
  const after = await opacities(mp);
  await motion.close();
  const pass = reducedOpacities.every(o => o === '1') && before.some(o => o !== '1') && after.at(-1) === '1' && before.length === after.length;
  return { status: pass ? 'PASS' : 'FAIL', reducedOpacities, before, after,
    note: 'before: sections waiting below the fold may be < 1; after scrolling, Limitations must be 1' };
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

// ---- Feature 007 checks: Probe, Ask the lab, motion pause, scroll progress, messages ----

const center = r => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
const rectOf = (page, selector) => page.evaluate(s => { const r = document.querySelector(s)?.getBoundingClientRect(); return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null; }, selector);
const probeState = page => page.evaluate(() => {
  const p = document.querySelector('.probe');
  const r = p.getBoundingClientRect();
  return { mode: p.dataset.mode, x: r.x, y: r.y, width: r.width, height: r.height, name: p.textContent.trim(), dialogOpen: document.getElementById('ask-lab')?.open ?? null };
});

// Revision 1: counts the eye's position changes over `ms` (sampled every 100 ms).
const watchMoves = (page, ms) => page.evaluate(ms => new Promise(resolve => {
  const probe = document.querySelector('.probe');
  const positions = [];
  const timer = setInterval(() => {
    const r = probe.getBoundingClientRect();
    positions.push(Math.round(r.x) + ',' + Math.round(r.y));
    if (positions.length * 100 >= ms) {
      clearInterval(timer);
      resolve({ samples: positions.length, moves: positions.filter((p, i) => i && p !== positions[i - 1]).length });
    }
  }, 100);
}), ms);

// Revision 1: records the eye's trips over `ms`, sampled every frame after that frame's callbacks
// (as in the probe speed check). Speed is averaged over ≥ 200 ms windows. At each landing it
// reports whether the eye is inside the viewport and what visible text or control it overlaps.
const trackTrips = (page, ms) => page.evaluate(ms => new Promise(resolve => {
  const probe = document.querySelector('.probe');
  const busy = 'a, button, input, textarea, select, summary, label';
  const visible = el => { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.opacity !== '0' && !el.closest('.visually-hidden, [hidden], dialog:not([open]), details:not([open]) > :not(summary)'); };
  const overlaps = r => {
    const box = { left: r.left + 2, top: r.top + 2, right: r.right - 2, bottom: r.bottom - 2 };
    const hit = q => q.width > 1 && q.height > 1 && q.left < box.right && box.left < q.right && q.top < box.bottom && box.top < q.bottom;
    for (const el of document.querySelectorAll(busy)) {
      if (probe.contains(el) || !visible(el)) continue;
      if ([...el.getClientRects()].some(hit)) return el.tagName.toLowerCase() + ': ' + el.textContent.trim().slice(0, 30);
    }
    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent.trim() || !visible(node.parentElement)) continue;
      range.selectNodeContents(node);
      if ([...range.getClientRects()].some(hit)) return 'text in ' + node.parentElement.className + ': ' + node.textContent.trim().slice(0, 30);
    }
    return null;
  };
  const begin = performance.now();
  const samples = [];
  const trips = [];
  let moving = null;
  let lastMoveAt = 0;
  const windowSpeed = from => {
    let max = 0;
    for (let i = from, j = from; i < samples.length; i++) {
      while (j < samples.length && samples[j].t - samples[i].t < 200) j++;
      if (j === samples.length) break;
      max = Math.max(max, Math.hypot(samples[j].x - samples[i].x, samples[j].y - samples[i].y) / ((samples[j].t - samples[i].t) / 1000));
    }
    return Math.round(max);
  };
  const sample = () => setTimeout(() => {
    const t = performance.now();
    const r = probe.getBoundingClientRect();
    const last = samples.at(-1);
    samples.push({ t, x: r.x, y: r.y });
    if (last) {
      if (Math.hypot(r.x - last.x, r.y - last.y) > 0.5) {
        if (!moving) moving = { start: Math.round(t - begin), from: samples.length - 2, wander: probe.dataset.wander === 'true' };
        lastMoveAt = t;
      } else if (moving && t - lastMoveAt > 800) {
        trips.push({ start: moving.start, end: Math.round(lastMoveAt - begin), maxSpeed: windowSpeed(moving.from), wander: moving.wander,
          inside: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight,
          over: overlaps(r), mode: probe.dataset.mode, wanderAtRest: probe.dataset.wander === 'true', at: { x: Math.round(r.x), y: Math.round(r.y) } });
        moving = null;
      }
    }
    if (t - begin > ms) resolve({ trips, unfinished: !!moving });
    else requestAnimationFrame(sample);
  }, 0);
  requestAnimationFrame(sample);
}), ms);

// Every section tip already seen, so tips do not move the eye during wandering measurements.
const allTipsSeen = () => { try { sessionStorage.setItem('lab-probe-seen', JSON.stringify(['map', 'work', 'experience', 'skills', 'about', 'contact', 'message'])); } catch {} };

// Counts blinks (data-blink set) from now on.
const watchBlinks = page => page.evaluate(() => {
  window.__blinks = 0;
  new MutationObserver(() => { if (document.querySelector('.probe').dataset.blink) window.__blinks++; })
    .observe(document.querySelector('.probe'), { attributes: true, attributeFilter: ['data-blink'] });
});

// FR-001–FR-005, SC-001, Revision 3 FR-032–FR-036, SC-012–SC-014: the robot eye blinks, rests at
// its dock when idle (feature 008 FR-013, SC-005: no movement in 30 s), travels at a capped speed, settles beside the selected node and traced steps,
// drags and returns, opens Ask the lab, and stays docked (no blinking) on touch and with reduced
// motion.
await run('probe', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await watchBlinks(page);
  await page.waitForTimeout(7000);
  const initial = await probeState(page);
  const parts = await page.evaluate(() => ({
    eye: !!document.querySelector('.probe .probe-eye .probe-iris .probe-pupil'),
    lids: document.querySelectorAll('.probe .probe-eye .probe-lid').length === 2,
    haloSpinning: document.querySelector('.probe-halo').getAnimations().some(a => a.playState === 'running'),
    floating: document.querySelector('.probe-float').getAnimations().some(a => a.playState === 'running'),
  }));
  const idleBlinks = await page.evaluate(() => window.__blinks);
  await page.evaluate(() => {
    window.__landed = false;
    new MutationObserver(() => { if (document.querySelector('.probe').dataset.landing) window.__landed = true; })
      .observe(document.querySelector('.probe'), { attributes: true, attributeFilter: ['data-landing'] });
  });
  await page.hover('.lab-core');
  const node = page.locator('button.lab-node').nth(2);
  const slug = (await node.evaluate(b => b.closest('.lab-node-slot').id)).replace('lab-node-', '');
  // Sampled every frame after that frame's callbacks have run (so the Probe's own frame callback is
  // always counted, whatever the callback order); speed averaged over ≥ 100 ms windows.
  await page.evaluate(() => {
    window.__samples = [];
    window.__sampling = true;
    const sample = t => setTimeout(() => {
      const r = document.querySelector('.probe').getBoundingClientRect();
      window.__samples.push({ t, x: r.x, y: r.y });
      if (window.__sampling) requestAnimationFrame(sample);
    }, 0);
    requestAnimationFrame(sample);
  });
  await node.click();
  await page.waitForTimeout(4000);
  const maxSpeed = await page.evaluate(() => {
    window.__sampling = false;
    const s = window.__samples;
    let max = 0;
    for (let i = 0, j = 0; i < s.length; i++) {
      while (j < s.length && s[j].t - s[i].t < 100) j++;
      if (j === s.length) break;
      max = Math.max(max, Math.hypot(s[j].x - s[i].x, s[j].y - s[i].y) / ((s[j].t - s[i].t) / 1000));
    }
    return Math.round(max);
  });
  const afterSelect = await probeState(page);
  const landed = await page.evaluate(() => window.__landed);
  const nodeRect = await rectOf(page, `#lab-node-${slug}`);
  // Perched on top: centred over the planet, sitting on its top edge.
  const nodeGap = Math.hypot(center(afterSelect).x - (nodeRect.x + nodeRect.width / 2), afterSelect.y + afterSelect.height - 12 - nodeRect.y);
  await page.locator('#architecture-panel .lab-architecture > summary').click();
  await page.locator('#architecture-panel .lab-panel-actions button').click();
  await page.evaluate(() => document.getElementById('lab-step-0').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(4000);
  const afterTrace = await probeState(page);
  // Revision 1 FR-013: no wandering while a traced step holds the eye's attention (20 s).
  const duringTrace = await watchMoves(page, 20000);
  const stepRect = await rectOf(page, '#lab-step-0');
  const panelRect = await rectOf(page, '#architecture-panel');
  const traceDy = Math.abs(center(afterTrace).y - (stepRect.y + Math.min(stepRect.height, 48) / 2));
  // Drag away and release: follows the pointer, does not open the dialog, springs back.
  const start = center(afterTrace);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 160, start.y + 90, { steps: 8 });
  const dragging = await probeState(page);
  await page.mouse.up();
  await page.waitForTimeout(4000);
  const afterDrag = await probeState(page);
  // Click (no drag) opens Ask the lab; Escape returns focus to the Probe.
  await page.locator('.probe').click();
  await page.waitForTimeout(300);
  const opened = await probeState(page);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const focusBack = await page.evaluate(() => document.activeElement?.classList.contains('probe'));
  await shot(page, { path: join(output, 'probe-trace-1440.png') });
  await context.close();

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const tp = await touch.newPage();
  await tp.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await tp.locator('button.lab-node').nth(1).tap();
  await tp.waitForTimeout(800);
  const touchState = await probeState(tp);
  await touch.close();

  const reduced = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rp = await reduced.newPage();
  await rp.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await watchBlinks(rp);
  await rp.locator('button.lab-node').nth(1).click();
  await rp.waitForTimeout(7000);
  const reducedState = await probeState(rp);
  const reducedBlinks = await rp.evaluate(() => window.__blinks);
  await reduced.close();

  const docked = (s, w, h) => s.mode === 'docked' && Math.abs(s.x - (w - 24 - 52)) <= 2 && Math.abs(s.y - (h - 24 - 52)) <= 2;
  const checks = {
    hasEyeParts: parts.eye && parts.lids && parts.haloSpinning && parts.floating,
    blinksWhenIdle: idleBlinks >= 1,
    startsDocked: docked(initial, 1440, 900),
    stillWhileTracing: duringTrace.moves === 0,
    calmTravelSpeed: maxSpeed <= 470,
    squashedOnLanding: landed,
    nameIsAskTheLab: initial.name.startsWith('Ask the lab'),
    perchedAtNode: afterSelect.mode === 'perched' && nodeGap < 60,
    besideTracedStep: traceDy < 30 && afterTrace.x + afterTrace.width <= panelRect.x + 2,
    dragFollows: dragging.mode === 'dragged' && Math.abs(center(dragging).x - (start.x + 160)) < 4,
    dragDidNotOpenDialog: afterDrag.dialogOpen === false,
    returnsAfterDrag: Math.hypot(afterDrag.x - afterTrace.x, afterDrag.y - afterTrace.y) < 3,
    clickOpensDialog: opened.dialogOpen === true,
    focusReturns: focusBack,
    dockedOnTouch: docked(touchState, 390, 844),
    dockedWithReducedMotion: docked(reducedState, 1440, 900),
    noBlinkWithReducedMotion: reducedBlinks === 0,
  };
  return { status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL', checks, parts, duringTrace, idleBlinks, reducedBlinks, maxSpeed, nodeGap, traceDy, initial, afterSelect, afterTrace, dragging, afterDrag, touchState, reducedState };
});

// Revision 4 FR-037–FR-041, SC-015: the entrance plays once per session on the homepage only, with
// motion allowed; nothing is covered; the Probe starts large at the centre and leaves; the name is
// unchanged; pausing ends it at once.
await run('intro', async () => {
  const fresh = (options = {}) => browser.newContext({ viewport: { width: 1440, height: 900 }, intro: true, ...options });
  const introAttr = page => page.evaluate(() => document.documentElement.dataset.intro ?? null);

  const context = await fresh();
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded' });
  const atStart = await introAttr(page);
  const watch = page.evaluate(() => new Promise(resolve => {
    const root = document.documentElement;
    if (root.dataset.intro !== 'play') return resolve(null);
    new MutationObserver((_, observer) => {
      if (root.dataset.intro !== 'play') { observer.disconnect(); resolve(Math.round(performance.now())); }
    }).observe(root, { attributes: true, attributeFilter: ['data-intro'] });
    setTimeout(() => resolve(-1), 8000);
  }));
  await page.waitForTimeout(300);
  const navUsable = await page.evaluate(() => {
    const link = document.querySelector('header nav a');
    const r = link.getBoundingClientRect();
    return link.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  });
  await page.waitForSelector('.probe[data-intro-big]', { timeout: 3000 });
  await page.waitForTimeout(600);
  const during = await page.evaluate(() => {
    const body = document.querySelector('.probe .probe-body').getBoundingClientRect();
    const letters = Array.from(document.querySelectorAll('.intro-letter')).map(l => Number(getComputedStyle(l).opacity));
    return { cx: body.x + body.width / 2, cy: body.y + body.height / 2, width: body.width, minLetterOpacity: Math.min(...letters) };
  });
  await shot(page, { path: join(output, 'intro-mid-1440.png') });
  const removedAt = await watch;
  await page.waitForTimeout(1500);
  const after = await probeState(page);
  const h1 = await page.locator('h1').textContent();
  await page.reload({ waitUntil: 'domcontentloaded' });
  const afterReload = await introAttr(page);
  await context.close();

  const variants = {};
  for (const [name, options, path, init] of [
    ['reducedMotion', { reducedMotion: 'reduce' }, '/'],
    ['savedPause', {}, '/', () => localStorage.setItem('lab-motion', 'paused')],
    ['caseStudyFirst', {}, '/work/hrms-backend'],
  ]) {
    const variant = await fresh(options);
    if (init) await variant.addInitScript(init);
    const vp = await variant.newPage();
    await vp.goto(baseURL + path, { waitUntil: 'domcontentloaded' });
    variants[name] = await introAttr(vp);
    await variant.close();
  }

  const pausing = await fresh();
  const pp = await pausing.newPage();
  await pp.goto(baseURL + '/', { waitUntil: 'domcontentloaded' });
  await pp.waitForSelector('.probe[data-intro]', { timeout: 3000 });
  await pp.locator('.motion-toggle').click();
  await pp.waitForTimeout(150);
  const pausedMid = await pp.evaluate(() => ({ intro: document.documentElement.dataset.intro ?? null, probe: document.querySelector('.probe').dataset.intro ?? null }));
  await pausing.close();

  const checks = {
    setBeforePaint: atStart === 'play',
    navUsableDuringIntro: navUsable,
    textNeverTransparent: during.minLetterOpacity >= 0.15,
    probeLargeAtCentre: Math.abs(during.cx - 720) < 6 && Math.abs(during.cy - 450) < 6 && during.width > 52 * 1.9,
    endsInTime: removedAt > 0 && removedAt <= 3500,
    probeLeavesCentre: Math.hypot(after.x + after.width / 2 - 720, after.y + after.height / 2 - 450) > 40,
    nameUnchanged: h1 === 'Akash K Pillai',
    oncePerSession: afterReload === null,
    notWithReducedMotion: variants.reducedMotion === null,
    notWithSavedPause: variants.savedPause === null,
    homepageOnly: variants.caseStudyFirst === null,
    pauseEndsAtOnce: pausedMid.intro === null && pausedMid.probe === null,
  };
  return { status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL', checks, removedAt, during, after, h1, variants, pausedMid };
});

// FR-007–FR-011, SC-002, SC-003: open by button, keyboard, and Probe; every suggestion answers with
// links; typed match and fallback; focus returns; axe on the open dialog. Answers saved for the
// content check (check-lab-knowledge.mjs).
await run('askLab', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const opener = page.locator('.lab-button-ask');
  await opener.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const openedByKeyboard = await page.evaluate(() => ({ open: document.getElementById('ask-lab').open, focusInside: document.getElementById('ask-lab').contains(document.activeElement) }));
  const lastReply = () => page.evaluate(() => {
    const replies = document.querySelectorAll('.ask-lab-reply');
    const reply = replies[replies.length - 1];
    return {
      paragraphs: Array.from(reply.querySelectorAll('.lab-answer-paragraph')).map(p => {
        const label = p.querySelector('.lab-answer-label');
        return {
          label: label?.childNodes[0]?.nodeType === 3 ? label.childNodes[0].textContent : undefined,
          note: label?.querySelector('span:not(.lab-answer-status)')?.textContent.replace(/^ · /, ''),
          status: label?.querySelector('.lab-answer-status')?.textContent.trim(),
          text: p.querySelector(':scope > p:not(.lab-answer-label)')?.textContent,
          items: Array.from(p.querySelectorAll(':scope > ul > li')).map(li => li.textContent),
        };
      }),
      links: Array.from(reply.querySelectorAll('.ask-lab-links a')).map(a => ({ label: a.textContent, href: a.getAttribute('href') })),
      text: reply.textContent,
    };
  });
  const visibleSuggestions = () => page.locator('.ask-lab-suggestions button:not(.ask-lab-more)').evaluateAll(bs => bs.filter(b => b.getClientRects().length).map(b => b.textContent));
  const initialSuggestions = await visibleSuggestions();
  const more = page.locator('.ask-lab-more');
  const moreBefore = await more.getAttribute('aria-expanded');
  await more.focus();
  await page.keyboard.press('Enter');
  const moreAfter = await more.getAttribute('aria-expanded');
  const moreFocused = await page.evaluate(() => document.activeElement?.classList.contains('ask-lab-more'));
  const suggestions = await visibleSuggestions();
  const answers = [];
  for (const label of suggestions) {
    await page.locator('.ask-lab-suggestions button', { hasText: label }).first().click();
    await page.waitForFunction(() => !document.querySelector('.ask-lab-typing'), null, { timeout: 5000 });
    answers.push({ question: label, ...(await lastReply()) });
  }
  const typed = [];
  for (const question of ['What did he build with Kafka?', 'what is the weather today', 'How do I hire him?']) {
    await page.locator('#ask-lab-input').fill(question);
    await page.locator('.ask-lab-form button[type="submit"]').click();
    await page.waitForFunction(() => !document.querySelector('.ask-lab-typing'), null, { timeout: 5000 });
    typed.push({ question, ...(await lastReply()) });
  }
  await page.locator('#ask-lab-input').fill('   ');
  await page.locator('.ask-lab-form button[type="submit"]').click();
  const emptyHint = await page.locator('.ask-lab-hint').textContent();
  await page.addScriptTag({ path: axePath });
  const axe = await page.evaluate(async tags => (await window.axe.run(document.getElementById('ask-lab'), { runOnly: { type: 'tag', values: tags } })).violations.map(v => v.id), axeTags);
  const entries = await page.locator('.ask-lab-entry').count();
  await shot(page, { path: join(output, 'ask-lab-1440.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const closed = await page.evaluate(() => ({ open: document.getElementById('ask-lab').open, focusBack: document.activeElement?.classList.contains('lab-button-ask') }));
  await context.close();
  await writeFile(join(output, 'lab-answers.json'), JSON.stringify(answers.concat(typed.filter(t => !t.text.includes("I can't answer"))), null, 2) + '\n');

  const draft = /user[- ]management/i;
  const checks = {
    openedByKeyboard: openedByKeyboard.open && openedByKeyboard.focusInside,
    fourInitialSuggestions: initialSuggestions.length === 4
      && ['What has he built?', 'Where has he worked?', "What's his stack?", 'How can I contact him?'].every(q => initialSuggestions.includes(q)),
    moreQuestionsDisclosure: moreBefore === 'false' && moreAfter === 'true' && moreFocused && suggestions.length > 4,
    everySuggestionAnswered: answers.length === suggestions.length && answers.every(a => a.paragraphs.length > 0 && a.links.length > 0 && !a.text.includes("I can't answer")),
    linksPublished: answers.every(a => a.links.every(l => !/^\/work\/(?!hrms-backend|meridian-assistant|notification-platform|resume-analyzer)/.test(l.href))),
    noDraft: answers.concat(typed).every(a => !draft.test(a.text)),
    typedKafkaToNotification: typed[0].links.some(l => l.href === '/work/notification-platform'),
    fallback: typed[1].text.includes("I can't answer that from this site"),
    typedHireToContact: typed[2].links.some(l => l.href.startsWith('mailto:')),
    emptyHint: emptyHint === 'Type a question first.',
    keepsLatest20: entries <= 20,
    axeOpenDialog: axe.length === 0,
    closesAndReturnsFocus: !closed.open && closed.focusBack,
  };
  return { status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL', checks, initialSuggestions, suggestions: suggestions.length, entries, axe, typed: typed.map(t => ({ q: t.question, links: t.links.map(l => l.href) })) };
});

// FR-014, FR-015, SC-004: pausing stops every running animation, docks the Probe, persists;
// resuming restores motion. Scroll progress shows only with motion on and support.
await run('motionPause', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const running = () => page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length);
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const before = { running: await running(), progress: await page.evaluate(() => getComputedStyle(document.querySelector('.scroll-progress')).display) };
  await page.locator('.motion-toggle').click();
  await page.waitForTimeout(400);
  const paused = await page.evaluate(() => ({
    pressed: document.querySelector('.motion-toggle').getAttribute('aria-pressed'),
    motion: document.documentElement.dataset.motion,
    probe: document.querySelector('.probe').dataset.mode,
    progress: getComputedStyle(document.querySelector('.scroll-progress')).display,
  }));
  const pausedRunning = await running();
  const pausedNames = await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').map(a => (a.animationName || a.transitionProperty || a.constructor.name) + ':' + (a.effect?.target?.className?.baseVal ?? a.effect?.target?.className ?? '')).slice(0, 10));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const reloaded = { motion: await page.evaluate(() => document.documentElement.dataset.motion), running: await running(),
    pressed: await page.locator('.motion-toggle').getAttribute('aria-pressed') };
  await page.locator('.motion-toggle').click();
  await page.waitForTimeout(400);
  const resumed = await running();
  await context.close();
  const pass = before.running > 0 && before.progress === 'block' && paused.pressed === 'true' && paused.motion === 'paused'
    && paused.probe === 'docked' && paused.progress === 'none' && pausedRunning === 0
    && reloaded.motion === 'paused' && reloaded.running === 0 && reloaded.pressed === 'true' && resumed > 0;
  return { status: pass ? 'PASS' : 'FAIL', before, paused, pausedRunning, pausedNames, reloaded, resumed };
});

// FR-018–FR-021, SC-007: validation, focus, exact mailto, confirmation, copy.
await run('messageForm', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  await context.addInitScript(() => {
    const original = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.href.startsWith('mailto:')) { window.__mailto = this.href; return; }
      return original.call(this);
    };
  });
  const page = await context.newPage();
  const requests = [];
  page.on('request', r => { if (r.method() !== 'GET') requests.push(r.url()); });
  await page.goto(baseURL + '/#message', { waitUntil: 'networkidle' });
  const send = page.locator('.message-send');
  await send.click();
  const empty = await page.evaluate(() => ({
    errors: Array.from(document.querySelectorAll('.field-error')).map(e => e.id),
    invalid: Array.from(document.querySelectorAll('[aria-invalid="true"]')).map(e => e.id),
    focused: document.activeElement?.id,
    summary: document.querySelector('.message-summary').textContent,
  }));
  await page.fill('#message-name', 'Ada Example');
  await page.fill('#message-email', 'ada@');
  await page.fill('#message-message', "Hello Akash, I'd like to talk about a backend role.");
  await send.click();
  const badEmail = await page.evaluate(() => ({ errors: Array.from(document.querySelectorAll('.field-error')).map(e => e.id), focused: document.activeElement?.id }));
  await page.fill('#message-email', 'ada@example.com');
  await page.selectOption('#message-topic', 'Project');
  await send.click();
  await page.waitForTimeout(200);
  const mailto = await page.evaluate(() => window.__mailto);
  const subject = '[Portfolio] Project — Ada Example';
  const body = "Hello Akash, I'd like to talk about a backend role.\n\n— Ada Example\nReply to: ada@example.com";
  const expected = `mailto:akashkpillai55@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const sentShown = await page.locator('.message-sent').isVisible();
  await page.locator('.message-sent button').click();
  await page.waitForTimeout(200);
  const clipboard = await page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
  await page.locator('#message').scrollIntoViewIfNeeded();
  await shot(page, { path: join(output, 'message-1440.png') });
  await context.close();
  const checks = {
    emptyErrors: JSON.stringify(empty.errors) === JSON.stringify(['message-name-error', 'message-email-error', 'message-message-error']),
    emptyFocusName: empty.focused === 'message-name',
    summary: empty.summary === '3 fields need attention.',
    badEmailOnly: JSON.stringify(badEmail.errors) === JSON.stringify(['message-email-error']) && badEmail.focused === 'message-email',
    exactMailto: (() => {
      const [address, query] = (mailto ?? '').split('?');
      const params = Object.fromEntries((query ?? '').split('&').map(p => p.split('=')).map(([k, v]) => [k, decodeURIComponent(v ?? '')]));
      return address === 'mailto:akashkpillai55@gmail.com' && params.subject === subject && params.body === body && expected.startsWith(address);
    })(),
    confirmation: sentShown,
    copied: clipboard?.includes(subject) && clipboard?.includes('Reply to: ada@example.com'),
    nothingTransmitted: requests.length === 0,
  };
  return { status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL', checks, empty, badEmail, mailto, requests };
});

// Revision 2 (FR-026, FR-027, SC-009, SC-010): planets revolve when idle, hold still under the
// pointer, with motion paused, and with reduced motion; nearer planets are larger; all stay
// inside the map at 768 and 1440 px.
await run('orbit', async () => {
  const slots = page => page.evaluate(() => Array.from(document.querySelectorAll('.lab-node-slot')).map(slot => {
    const r = slot.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, near: Number(slot.style.getPropertyValue('--near')) };
  }));
  const moved = (a, b) => Math.max(...a.map((p, i) => Math.hypot(p.x - b[i].x, p.y - b[i].y)));
  const cases = {};
  for (const width of [1440, 768]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
    await page.mouse.move(2, 2);
    await page.waitForTimeout(600);
    const a = await slots(page);
    await page.waitForTimeout(2000);
    const b = await slots(page);
    const box = await rectOf(page, '.lab-map');
    const inside = b.every(p => p.x >= box.x - 1 && p.x + p.width <= box.x + box.width + 1);
    const nearest = b.reduce((m, p) => (p.near > m.near ? p : m));
    const farthest = b.reduce((m, p) => (p.near < m.near ? p : m));
    await page.hover('.lab-core');
    await page.waitForTimeout(300);
    const c = await slots(page);
    await page.waitForTimeout(2000);
    const d = await slots(page);
    cases[width] = { revolves: moved(a, b) > 2, holdsUnderPointer: moved(c, d) === 0, inside, nearerIsLarger: nearest.width > farthest.width };
    await context.close();
  }
  const still = async options => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
    const page = await context.newPage();
    await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
    if (options.pause) {
      await page.locator('.motion-toggle').click();
    }
    await page.mouse.move(2, 2);
    await page.waitForTimeout(500);
    const a = await slots(page);
    await page.waitForTimeout(2000);
    const b = await slots(page);
    await context.close();
    return moved(a, b);
  };
  const reducedMovement = await still({ reducedMotion: 'reduce' });
  const pausedMovement = await still({ pause: true });
  const pass = Object.values(cases).every(c => Object.values(c).every(Boolean)) && reducedMovement === 0 && pausedMovement === 0;
  return { status: pass ? 'PASS' : 'FAIL', cases, reducedMovement, pausedMovement };
});

// ---- Feature 008 checks ----

// SC-003: every card sentence (problem, what it does, contribution) on / and /work appears verbatim
// on that project's case-study page, which renders the same records; the problem is the case
// study's first problem paragraph.
await run('cardText', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const norm = t => t.replace(/\s+/g, ' ').trim();
  const cards = [];
  for (const path of ['/', '/work']) {
    await page.goto(baseURL + path, { waitUntil: 'networkidle' });
    cards.push(...(await page.evaluate(() => Array.from(document.querySelectorAll('article.project-story')).map(card => ({
      href: card.querySelector('.project-story-link').getAttribute('href'),
      layout: card.classList.contains('project-story-featured') ? 'featured' : card.classList.contains('project-story-compact') ? 'compact' : null,
      labels: Array.from(card.querySelectorAll('.story-facts dt')).map(dt => dt.textContent),
      problem: card.querySelector('.story-facts div:nth-child(1) dd')?.textContent,
      does: card.querySelector('.story-facts div:nth-child(2) dd')?.textContent,
      contribution: Array.from(card.querySelectorAll('.story-contribution dd p')).map(p => p.textContent),
    })))).map(card => ({ path, ...card })));
  }
  const pages = {};
  for (const href of new Set(cards.map(c => c.href))) {
    await page.goto(baseURL + href, { waitUntil: 'networkidle' });
    pages[href] = await page.evaluate(() => ({ text: document.querySelector('main').textContent, firstProblem: document.getElementById('problem')?.closest('section')?.querySelector('.claim-list > li')?.textContent ?? null }));
  }
  await context.close();
  const expectedLayouts = { '/work/hrms-backend': 'featured', '/work/meridian-assistant': 'featured', '/work/notification-platform': 'compact', '/work/resume-analyzer': 'compact' };
  const mismatches = [];
  for (const card of cards) {
    const target = pages[card.href];
    const text = norm(target.text);
    for (const sentence of [card.problem, card.does, ...card.contribution]) {
      if (!sentence || !text.includes(norm(sentence))) mismatches.push({ path: card.path, href: card.href, sentence });
    }
    if (target.firstProblem !== null && norm(target.firstProblem) !== norm(card.problem ?? '')) mismatches.push({ path: card.path, href: card.href, problemNotFirst: true });
    if (card.labels.join('|') !== 'The problem|What it does|My contribution') mismatches.push({ path: card.path, href: card.href, labels: card.labels });
    if (expectedLayouts[card.href] !== card.layout) mismatches.push({ path: card.path, href: card.href, layout: card.layout });
  }
  const hrms = cards.find(c => c.href === '/work/hrms-backend');
  const teamAttribution = !!hrms?.contribution.some(t => /Teammates built the platform layer/.test(t));
  return { status: cards.length === 8 && mismatches.length === 0 && teamAttribution ? 'PASS' : 'FAIL', cards: cards.length, mismatches, teamAttribution };
});

// SC-007 / FR-019 / FR-020: one contact section holding every contact action and the form.
await run('contactSection', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const contact = document.querySelectorAll('#contact');
    const section = contact[0];
    return {
      contactCount: contact.length,
      messageCount: document.querySelectorAll('#message').length,
      messageInside: !!section?.querySelector('#message'),
      heading: section?.querySelector('h2')?.textContent,
      formHeading: section?.querySelector('#message h3')?.textContent,
      note: section?.querySelector('#message .contact-message-note')?.textContent.replace(/\s+/g, ' ').trim(),
      email: !!section?.querySelector('a[href^="mailto:"]'),
      copy: !!section?.querySelector('.copy-email-button'),
      linkedin: !!section?.querySelector('a[href*="linkedin.com"]'),
      github: !!section?.querySelector('a[href="https://github.com/Akashkpillai"]'),
      resume: !!section?.querySelector('a[download][href$=".pdf"]'),
      form: !!section?.querySelector('#message form.message-form'),
      compose: section?.querySelector('.message-send')?.textContent.trim(),
      otherMessageSection: !!document.querySelector('.message-section'),
    };
  });
  await context.close();
  const pass = data.contactCount === 1 && data.messageCount === 1 && data.messageInside && data.heading === 'Get in touch'
    && data.formHeading === 'Send a message' && /opens your own email app/.test(data.note) && /doesn't store or send anything/.test(data.note)
    && data.email && data.copy && data.linkedin && data.github && data.resume && data.form && data.compose?.startsWith('Compose email')
    && !data.otherMessageSection;
  return { status: pass ? 'PASS' : 'FAIL', ...data };
});

// SC-002: at 390 px the selected-work section starts higher than on the baseline commit
// (layout-baseline-b6bcb35.json, measured by measure-layout.mjs with the same settings).
await run('workPosition', async () => {
  const baseline = JSON.parse(await readFile(join(output, 'layout-baseline-b6bcb35.json'), 'utf8')).rows;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const workTop = await page.evaluate(() => Math.round(document.getElementById('work').getBoundingClientRect().top + scrollY));
  await context.close();
  const before = baseline.find(r => r.width === 390).workTop;
  return { status: workTop < before ? 'PASS' : 'FAIL', before, after: workTop, saved: before - workTop };
});

// ---- Feature 008 Revision 1 checks ----

// SC-005: on a 1440 px desktop with light pointer activity, the eye makes 1–2 slow trips in 45 s,
// rests ≥ 18 s between them, and lands inside the viewport over no text, link, or control; it makes
// none while the visitor types, with the tab hidden (and runs no animation frames), or with motion
// paused. Touch and reduced motion are covered by the probe check (docked).
await run('probeWander', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(allTipsSeen);
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  // A view with headings and card titles: the top of Selected work.
  await page.evaluate(() => window.scrollTo(0, document.getElementById('work').getBoundingClientRect().top + scrollY - 40));
  await page.mouse.move(10, 450);
  await page.waitForTimeout(1500);
  const watch = trackTrips(page, 45000);
  // Light activity: a small pointer move at the page edge every 8 s keeps the eye awake.
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(8000);
    await page.mouse.move(10 + (i % 2) * 4, 450);
  }
  const wander = await watch;
  await page.screenshot({ path: join(output, 'probe-wander-1440.png') });

  // Typing: focus a form field and press a key every 3 s for 30 s.
  await page.locator('#message-name').scrollIntoViewIfNeeded();
  await page.locator('#message-name').focus();
  // The eye first returns to its dock from the wandering spot that scrolled away.
  await page.waitForTimeout(4000);
  const typingWatch = trackTrips(page, 30000);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.type('a');
    await page.waitForTimeout(3000);
  }
  const typing = await typingWatch;
  await context.close();

  // Hidden tab: report the page hidden, then count animation frames and moves for 20 s.
  const hiddenContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await hiddenContext.addInitScript(allTipsSeen);
  await hiddenContext.addInitScript(() => {
    window.__raf = 0;
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = callback => { window.__raf++; return raf(callback); };
  });
  const hp = await hiddenContext.newPage();
  await hp.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await hp.evaluate(() => window.scrollTo(0, document.getElementById('work').getBoundingClientRect().top + scrollY - 40));
  await hp.waitForTimeout(1500);
  await hp.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await hp.waitForTimeout(300);
  const rafBefore = await hp.evaluate(() => window.__raf);
  const hiddenMoves = await watchMoves(hp, 20000);
  const rafDuring = (await hp.evaluate(() => window.__raf)) - rafBefore;
  await hiddenContext.close();

  // Motion paused: 20 s at the same view, docked and still.
  const pausedContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await pausedContext.addInitScript(allTipsSeen);
  const pp = await pausedContext.newPage();
  await pp.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await pp.locator('.motion-toggle').click();
  await pp.evaluate(() => window.scrollTo(0, document.getElementById('work').getBoundingClientRect().top + scrollY - 40));
  await pp.waitForTimeout(13000);
  const pausedMoves = await watchMoves(pp, 20000);
  const pausedState = await probeState(pp);
  await pausedContext.close();

  const trips = wander.trips;
  const rests = trips.slice(1).map((trip, i) => Math.round(trip.start - trips[i].end));
  const docked = (s, w, h) => s.mode === 'docked' && Math.abs(s.x - (w - 24 - 52)) <= 2 && Math.abs(s.y - (h - 24 - 52)) <= 2;
  const checks = {
    oneOrTwoTrips: trips.length >= 1 && trips.length <= 2 && !wander.unfinished,
    tripsAreWandering: trips.every(t => t.wander && t.wanderAtRest && t.mode === 'perched'),
    longRests: rests.every(r => r >= 18000),
    slowTravel: trips.every(t => t.maxSpeed <= 210),  // 200 px/s cap + 5 % sampling tolerance
    landsInsideViewport: trips.every(t => t.inside),
    landsClearOfTextAndControls: trips.every(t => t.over === null),
    noTripsWhileTyping: typing.trips.every(t => !t.wander) && !typing.unfinished,
    noTripsOrFramesWhenHidden: hiddenMoves.moves === 0 && rafDuring === 0,
    dockedAndStillWhenPaused: pausedMoves.moves === 0 && docked(pausedState, 1440, 900),
  };
  return { status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL', checks, trips, rests, typing, hiddenMoves, rafDuring, pausedMoves, pausedState };
});

// SC-008: under a mouse, a card tilts at most 2° and settles back within 1 s of leaving, with no
// scaling; touch, reduced motion, motion paused (including mid-tilt), and keyboard focus never tilt
// it, and focus keeps its glow.
await run('cardTilt', async () => {
  const card = '#story-hrms-backend';
  const read = page => page.evaluate(selector => {
    const article = document.querySelector(selector).closest('article');
    const wrapper = article.closest('.project-tilt');
    const style = getComputedStyle(article);
    const m = style.transform.startsWith('matrix3d(') ? style.transform.slice(9, -1).split(',').map(Number) : null;
    return {
      tilting: wrapper.dataset.tilting === 'true',
      x: parseFloat(wrapper.style.getPropertyValue('--tilt-x')) || 0,
      y: parseFloat(wrapper.style.getPropertyValue('--tilt-y')) || 0,
      transform: style.transform,
      scaleFree: m ? m[0] <= 1.0001 && m[0] >= 0.99 && m[5] <= 1.0001 && m[5] >= 0.99 : style.transform === 'none',
      glow: style.boxShadow !== 'none',
    };
  }, card);
  const cardBox = async page => {
    await page.locator(card).scrollIntoViewIfNeeded();
    return page.locator(card).evaluate(h => { const r = h.closest('article').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
  };

  // Mouse: sweep the corners and centre; record the largest angle.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(allTipsSeen);
  const page = await context.newPage();
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const box = await cardBox(page);
  const states = [];
  for (const [fx, fy] of [[0.02, 0.05], [0.98, 0.05], [0.98, 0.95], [0.02, 0.95], [0.5, 0.5]]) {
    await page.mouse.move(box.x + box.width * fx, box.y + box.height * fy, { steps: 6 });
    await page.waitForTimeout(350);
    states.push(await read(page));
  }
  await page.screenshot({ path: join(output, 'card-tilt-1440.png') });
  const maxAngle = Math.max(...states.map(s => Math.max(Math.abs(s.x), Math.abs(s.y))));
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1, { steps: 4 });
  await page.waitForTimeout(350);
  await page.mouse.move(5, box.y + 20);
  await page.waitForTimeout(120);
  const returning = await read(page);
  await page.waitForTimeout(880);
  const afterLeave = await read(page);
  // Keyboard focus: the title link focused with the pointer away from the card.
  await page.locator(`${card} a`).focus();
  await page.waitForTimeout(400);
  const focused = await read(page);
  // Pause mid-tilt: pointer on the card, pause pressed from the keyboard.
  await page.locator(`${card} a`).blur();
  await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.1, { steps: 4 });
  await page.waitForTimeout(350);
  const beforePause = await read(page);
  await page.locator('.motion-toggle').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  const pausedMidTilt = await read(page);
  await page.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.9, { steps: 4 });
  await page.waitForTimeout(350);
  const pausedMove = await read(page);
  await context.close();

  // Touch phone: tap and drag across the card.
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const tp = await touch.newPage();
  await tp.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const tbox = await cardBox(tp);
  await tp.touchscreen.tap(tbox.x + tbox.width * 0.9, tbox.y + 40);
  await tp.waitForTimeout(400);
  const touchState = await read(tp);
  await touch.close();

  // Reduced motion with a mouse.
  const reduced = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rp = await reduced.newPage();
  await rp.goto(baseURL + '/', { waitUntil: 'networkidle' });
  const rbox = await cardBox(rp);
  await rp.mouse.move(rbox.x + rbox.width * 0.95, rbox.y + rbox.height * 0.1, { steps: 6 });
  await rp.waitForTimeout(400);
  const reducedState = await read(rp);
  await reduced.close();

  const flat = s => !s.tilting && s.transform === 'none';
  const checks = {
    tiltsUnderMouse: states.some(s => s.tilting && s.transform !== 'none'),
    atMostTwoDegrees: maxAngle <= 2 && maxAngle >= 1,
    noScaling: states.every(s => s.scaleFree),
    gentleReturn: !returning.tilting && returning.transform !== 'none' && flat(afterLeave),
    keyboardFocusDoesNotTilt: flat(focused) && focused.glow,
    pauseStopsMidTilt: beforePause.tilting && flat(pausedMidTilt) && flat(pausedMove),
    flatOnTouch: flat(touchState),
    flatWithReducedMotion: flat(reducedState),
  };
  return { status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL', checks, maxAngle, states, returning, afterLeave, focused, beforePause, pausedMidTilt, pausedMove, touchState, reducedState };
});

await browser.close();
if (results.errors.length) console.log(JSON.stringify(results.errors, null, 2));
