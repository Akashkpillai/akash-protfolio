import { createRequire } from 'node:module';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Test tooling lives outside the application dependency tree.
const require = createRequire(import.meta.url);
const { chromium } = require(join(tmpdir(), 'akash-portfolio-qa-tools/node_modules/playwright-core'));
const output = dirname(fileURLToPath(import.meta.url));
const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const baseURL = 'http://127.0.0.1:3000';
const selectedChecks = new Set(process.argv.slice(2));
const results = selectedChecks.size
  ? JSON.parse(await readFile(join(output, 'results.json'), 'utf8'))
  : { date: new Date().toISOString(), baseURL, checks: {}, errors: [] };
results.lastRun = { date: new Date().toISOString(), checks: [...selectedChecks] };

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
        text: Array.from(element.childNodes).filter(node => node.nodeType === 3).map(node => node.textContent.trim()).join(' '),
        foreground: element.tagName.toLowerCase() === 'text' ? style.fill : style.color,
        backgrounds, fontSize: style.fontSize, fontWeight: style.fontWeight,
        inactive: !!element.closest(':disabled'), effects,
      };
    }));
  if (!rows.length) throw new Error('No rendered text was collected');
  return rows.map(row => {
    const background = row.backgrounds.reduce((back, color) => composite(rgba(color), back), [255, 255, 255]);
    const foreground = composite(rgba(row.foreground), background);
    const fontSize = Number.parseFloat(row.fontSize);
    const fontWeight = Number(row.fontWeight);
    if (!Number.isFinite(fontSize) || !Number.isFinite(fontWeight)) throw new Error('Invalid font measurement');
    const threshold = fontSize >= 24 || (fontSize >= 18.6667 && fontWeight >= 700) ? 3 : 4.5;
    const ratio = contrast(foreground, background);
    return { ...row, background, ratio, threshold,
      status: row.inactive ? 'EXEMPT-INACTIVE' : row.effects.length ? 'UNRESOLVED-EFFECT' : ratio >= threshold ? 'PASS' : 'FAIL' };
  });
}
async function dimensions(page) {
  return page.evaluate(() => ({ innerWidth, innerHeight, outerWidth, outerHeight,
    dpr: devicePixelRatio, visualScale: visualViewport.scale,
    clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    userAgent: navigator.userAgent }));
}
async function inspect(page, selector) {
  return page.locator(selector).evaluateAll(elements => elements.map(element => {
    const s = getComputedStyle(element);
    return { text: element.textContent.trim(), color: s.color, background: s.backgroundColor,
      border: s.borderTopColor, outline: s.outlineColor, outlineWidth: s.outlineWidth,
      outlineOffset: s.outlineOffset, fill: s.fill, stroke: s.stroke,
      focusVisible: element.matches(':focus-visible'), hover: element.matches(':hover') };
  }));
}
async function settleTransitions(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
  });
}
async function run(name, action) {
  if (selectedChecks.size && !selectedChecks.has(name)) return;
  try { results.checks[name] = await action(); }
  catch (error) { results.checks[name] = { status: 'ERROR', message: String(error) }; results.errors.push(name); }
  await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(name, results.checks[name].status ?? 'MEASURED');
}

const browser = await chromium.launch({ executablePath, headless: true });
results.browser = await browser.version();
results.tool = 'playwright-core 1.64.1; installed temporarily, not in package.json';
try {
  await run('contrast', async () => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    try {
      const page = await context.newPage();
      await page.goto(baseURL);
      await page.getByRole('button', { name: 'Trace the flow' }).waitFor();
      const desktopContrast = await textContrast(page); // Define before reading or summarizing.
      const desktop = { conditions: await dimensions(page), text: desktopContrast };
      const states = {};
      await page.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('link', { name: 'Approach' }).hover();
      states.desktopLinkHover = { text: (await textContrast(page)).filter(row => row.text === 'Approach') };
      await page.locator('.skip-link').focus();
      await page.locator('.skip-link').hover();
      await settleTransitions(page);
      states.skipHover = { style: await inspect(page, '.skip-link'), text: (await textContrast(page)).filter(row => row.class === 'skip-link') };
      await page.getByRole('link', { name: 'Explore the flow' }).hover();
      await settleTransitions(page);
      states.heroHover = { style: await inspect(page, '.hero-action'), text: (await textContrast(page)).filter(row => row.class === 'hero-action') };
      await page.getByRole('button', { name: 'Trace the flow' }).press('Enter');
      await page.getByRole('button', { name: 'Next step' }).hover();
      await settleTransitions(page);
      states.nextHover = { style: await inspect(page, '.flow-control-primary'), text: (await textContrast(page)).filter(row => row.class === 'flow-control-primary') };
      await page.getByRole('button', { name: 'Trace the flow' }).hover();
      await settleTransitions(page);
      states.traceHover = { style: await inspect(page, '.flow-control-secondary'), text: (await textContrast(page)).filter(row => row.class === 'flow-control-secondary') };
      await page.getByRole('button', { name: 'Show process step' }).press('Enter');
      await settleTransitions(page);
      states.selected = { style: await inspect(page, '.flow-select[aria-pressed="true"], .flow-node-active circle'), text: (await textContrast(page)).filter(row => row.text === 'Show process step') };
      const graphicalSamples = await page.evaluate(() => {
        const style = selector => getComputedStyle(document.querySelector(selector));
        const canvas = style('.flow-card').backgroundColor;
        const surface = style('.flow-stage').backgroundColor;
        const node = style('.flow-node-active circle');
        const selected = style('.flow-select[aria-pressed="true"]');
        const unselected = style('.flow-select[aria-pressed="false"]');
        const selection = getComputedStyle(document.querySelector('.hero-intro'), '::selection');
        return [
          { name: 'Flow connection against canvas', foreground: style('.flow-line').stroke, background: canvas, threshold: 3 },
          { name: 'Selected node stroke against fill', foreground: node.stroke, background: node.fill, threshold: 3 },
          { name: 'Selected node stroke against canvas', foreground: node.stroke, background: canvas, threshold: 3 },
          { name: 'Selected stage boundary against surface', foreground: selected.borderTopColor, background: surface, threshold: 3 },
          { name: 'Selected stage boundary against selected fill', foreground: selected.borderTopColor, background: selected.backgroundColor, threshold: 3 },
          { name: 'Keyboard focus outside stage button', foreground: selected.outlineColor, background: surface, threshold: 3 },
          { name: 'Unselected button boundary (advisory: text identifies button)', foreground: unselected.borderTopColor, background: surface, threshold: null },
          { name: 'Text selection', foreground: selection.color, background: selection.backgroundColor, threshold: 4.5 },
        ];
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('summary').press('Enter');
      const mobileContrast = await textContrast(page);
      const mobile = { conditions: await dimensions(page), text: mobileContrast, controls: await inspect(page, 'summary, .menu-indicator, .flow-select, .flow-line, .flow-node circle') };
      await page.getByRole('navigation', { name: 'Mobile primary' }).getByRole('link', { name: 'Approach' }).hover();
      states.mobileLinkHover = { text: (await textContrast(page)).filter(row => row.text === 'Approach') };
      await page.locator('summary').press('Escape');
      states.menuFocus = await inspect(page, 'summary');
      graphicalSamples.push(...await page.evaluate(() => {
        const summary = getComputedStyle(document.querySelector('summary'));
        const icon = getComputedStyle(document.querySelector('.menu-indicator'), '::after');
        return [
          { name: 'Menu icon against summary', foreground: icon.borderTopColor, background: summary.backgroundColor, threshold: 3 },
          { name: 'Menu focus against canvas', foreground: summary.outlineColor, background: getComputedStyle(document.body).backgroundColor, threshold: 3 },
          { name: 'Menu boundary (advisory: icon/text identify control)', foreground: summary.borderTopColor, background: summary.backgroundColor, threshold: null },
        ];
      }));
      const graphics = graphicalSamples.map(sample => {
        const background = rgba(sample.background).slice(0, 3);
        const ratio = contrast(composite(rgba(sample.foreground), background), background);
        return { ...sample, ratio, status: sample.threshold === null ? 'ADVISORY' : ratio >= sample.threshold ? 'PASS' : 'FAIL' };
      });
      const all = [...desktopContrast, ...mobileContrast, ...Object.values(states).flatMap(state => state.text ?? [])];
      const failures = all.filter(row => row.status === 'FAIL' || row.status.startsWith('UNRESOLVED'));
      failures.push(...graphics.filter(row => row.status === 'FAIL'));
      return { status: failures.length ? 'FAIL' : 'PASS', desktop, mobile, states, graphics, failures };
    } finally { await context.close(); }
  });

  await run('reducedMotion', async () => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    try {
      const page = await context.newPage();
      await page.goto(baseURL);
      const staticBefore = await page.locator('.flow-stage > p').allTextContents();
      const transitions = await page.locator('.flow-stage, .flow-node circle, .hero-action').evaluateAll(elements => elements.map(element => ({ class: element.getAttribute('class'), duration: getComputedStyle(element).transitionDuration })));
      const preference = await page.evaluate(() => ({ reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior }));
      const sequence = [];
      await page.getByRole('button', { name: 'Trace the flow' }).press('Enter');
      sequence.push(await page.locator('.flow-current').innerText());
      for (let i = 0; i < 3; i++) { await page.getByRole('button', { name: 'Next step' }).press('Space'); sequence.push(await page.locator('.flow-current').innerText()); }
      const staticAfter = await page.locator('.flow-stage > p').allTextContents();
      await page.locator('.flow-card').screenshot({ path: join(output, 'reduced-motion.png') });
      const immediate = transitions.every(row => row.duration.split(',').every(value => Number.parseFloat(value) <= 0.00001));
      const expected = ['Input', 'Process', 'Result', 'Input'];
      const pass = preference.reducedMotion && preference.scrollBehavior === 'auto' && immediate
        && JSON.stringify(staticBefore) === JSON.stringify(staticAfter) && sequence.every((text, i) => text.startsWith(`Current step: ${expected[i]}.`));
      return { status: pass ? 'PASS' : 'FAIL', conditions: await dimensions(page), preference, transitions, sequence, staticBefore, staticAfter };
    } finally { await context.close(); }
  });

  await run('javaScriptDisabled', async () => {
    const cases = [];
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, javaScriptEnabled: false });
      try {
        const page = await context.newPage();
        await page.goto(baseURL);
        const name = await page.locator('.hero-name').innerText();
        const role = await page.locator('.hero-role').innerText();
        const headline = await page.locator('h1').innerText();
        const stages = await page.locator('.flow-stage > p').allTextContents();
        const labels = await page.locator('.flow-stage h4').allTextContents();
        const interactiveControls = await page.locator('.flow-controls, .flow-select').count();
        const disclaimer = await page.locator('.flow-disclaimer').innerText();
        const destinations = [];
        if (viewport.width < 832) {
          await page.locator('summary').press('Enter');
          const nav = page.getByRole('navigation', { name: 'Mobile primary' });
          await nav.getByRole('link', { name: 'Approach' }).press('Enter'); destinations.push(page.url());
          await nav.getByRole('link', { name: 'Home', exact: true }).press('Enter'); destinations.push(page.url());
          await page.locator('summary').press('Enter');
        } else {
          const nav = page.getByRole('navigation', { name: 'Primary', exact: true });
          await nav.getByRole('link', { name: 'Approach' }).press('Enter'); destinations.push(page.url());
          await nav.getByRole('link', { name: 'Home', exact: true }).press('Enter'); destinations.push(page.url());
        }
        await page.getByRole('link', { name: 'Explore the flow' }).press('Enter'); destinations.push(page.url());
        await page.locator('.flow-card').screenshot({ path: join(output, `no-js-${viewport.width}.png`) });
        const conditions = await dimensions(page); // Inspector evaluation does not enable page scripts.
        const pass = name === 'Akash K Pillai' && role === 'Backend & AI Developer' && headline.length > 0
          && stages.length === 3 && stages.every(Boolean) && labels.join(',') === 'Input,Process,Result'
          && interactiveControls === 0 && disclaimer.includes('not live telemetry') && !conditions.overflow
          && destinations.map(url => new URL(url).hash).join(',') === '#approach,#home,#approach';
        cases.push({ status: pass ? 'PASS' : 'FAIL', javaScriptEnabled: false, conditions, name, role, headline, stages, labels, interactiveControls, disclaimer, destinations });
      } finally { await context.close(); }
    }
    return { status: cases.every(test => test.status === 'PASS') ? 'PASS' : 'FAIL', cases };
  });
} finally { await browser.close(); }

await run('browserZoom', async () => {
  const cases = [];
  for (const factor of [1, 2]) {
    const profile = await mkdtemp(join(tmpdir(), 'akash-portfolio-zoom-'));
    const context = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport: null, args: ['--window-size=1440,900'] });
    try {
      const page = context.pages()[0] ?? await context.newPage();
      await page.goto('chrome://settings/appearance');
      await page.locator('select#zoomLevel').selectOption({ label: `${factor * 100}%` });
      const zoomSetting = await page.locator('select#zoomLevel').evaluate(element => ({ value: element.value, label: element.selectedOptions[0]?.textContent.trim() }));
      await page.goto(baseURL);
      await page.getByRole('button', { name: 'Trace the flow' }).waitFor();
      const conditions = await dimensions(page);
      const clippedText = await page.locator('h1,h2,h3,h4,p,button,summary').evaluateAll(elements => elements.filter(element => element.getClientRects().length && element.scrollWidth > element.clientWidth + 1).map(element => ({ tag: element.tagName, text: element.textContent, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth })));
      let navigation;
      if (await page.locator('summary').isVisible()) {
        await page.locator('summary').press('Enter');
        await page.getByRole('navigation', { name: 'Mobile primary' }).getByRole('link', { name: 'Approach' }).press('Enter');
      } else {
        await page.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('link', { name: 'Approach' }).press('Enter');
      }
      await page.waitForURL('**/#approach');
      navigation = page.url();
      await page.getByRole('button', { name: 'Trace the flow' }).press('Enter');
      await page.getByRole('button', { name: 'Next step' }).press('Space');
      const currentStep = await page.locator('.flow-current').innerText();
      await page.screenshot({ path: join(output, `zoom-${factor * 100}.png`), fullPage: true });
      cases.push({ requestedFactor: factor, zoomSetting, conditions, clippedText, navigation, currentStep });
    } finally { await context.close(); }
  }
  const [baseline, enlarged] = cases;
  const ratio = enlarged.conditions.dpr / baseline.conditions.dpr;
  const actualZoom = enlarged.zoomSetting.label === '200%' && Math.abs(ratio - 2) < 0.05
    && Math.abs(baseline.conditions.innerWidth / enlarged.conditions.innerWidth - 2) < 0.05;
  const pass = actualZoom && !enlarged.conditions.overflow && !enlarged.clippedText.length
    && enlarged.navigation.endsWith('#approach') && enlarged.currentStep.startsWith('Current step: Process.');
  return { status: pass ? 'PASS' : 'FAIL', actualZoomVerified: actualZoom, dprRatio: ratio, cases };
});
await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(results.checks).map(([name, check]) => [name, check.status])), null, 2));
process.exitCode = Object.values(results.checks).every(check => check.status === 'PASS') ? 0 : 1;
