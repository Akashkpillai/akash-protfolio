// Checks page metadata, sitemap, robots, sharing image, and 404 responses against
// specs/005-launch-readiness/contracts/site-metadata.md. Node fetch only.
// BASE_URL is where requests go; SITE_URL is the production address the values must use.
// After deployment, set both to the live domain to confirm the deployment.
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3100';
const siteURL = (process.env.SITE_URL ?? '').replace(/\/$/, '');
if (!siteURL) {
  console.error('Set SITE_URL to the production address the build used.');
  process.exit(2);
}
const publicPages = (process.env.PAGES ?? '/,/work,/changelog,/work/hrms-backend,/work/meridian-assistant,/work/notification-platform,/work/resume-analyzer').split(',');
const notFoundPages = ['/work/user-management-api', '/work/meridian', '/nope'];
const forbidden = ['localhost', '127.0.0.1', 'user-management-api', 'user management api', 'user-management-with-prisma'];

let failures = 0;
function check(label, ok, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`);
}

function decode(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
function tags(head, name) {
  return [...head.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map(([, attrs]) =>
    Object.fromEntries([...attrs.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k.toLowerCase(), decode(v)])));
}
function canonicalOf(path) {
  return path === '/' ? siteURL : siteURL + path;
}

const titles = new Map();
for (const path of publicPages) {
  const response = await fetch(baseURL + path);
  const html = await response.text();
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const metas = tags(head, 'meta');
  const links = tags(head, 'link');
  const meta = key => metas.filter(m => m.name === key || m.property === key).map(m => m.content);
  const titleTags = [...head.matchAll(/<title>([^<]*)<\/title>/gi)].map(m => decode(m[1]));
  const canonical = links.filter(l => l.rel === 'canonical').map(l => l.href);
  const icons = links.filter(l => l.rel === 'icon');
  const expected = canonicalOf(path);
  const p = `${path}:`;

  check(`${p} status 200`, response.status === 200, String(response.status));
  check(`${p} one <title>`, titleTags.length === 1, titleTags.join(' / '));
  titles.set(path, titleTags[0]);
  check(`${p} one description`, meta('description').length === 1 && meta('description')[0].length > 20, meta('description')[0]);
  check(`${p} canonical`, canonical.length === 1 && canonical[0] === expected, canonical.join(', '));
  check(`${p} og:title = title`, meta('og:title').length === 1 && meta('og:title')[0] === titleTags[0]);
  check(`${p} og:description = description`, meta('og:description').length === 1 && meta('og:description')[0] === meta('description')[0]);
  check(`${p} og:url = canonical`, meta('og:url').length === 1 && meta('og:url')[0] === expected, meta('og:url')[0]);
  check(`${p} og:type website`, meta('og:type')[0] === 'website');
  check(`${p} og:site_name`, meta('og:site_name')[0] === 'Akash K Pillai');
  check(`${p} og:image`, meta('og:image').length === 1 && meta('og:image')[0] === `${siteURL}/og.png`
    && meta('og:image:width')[0] === '1200' && meta('og:image:height')[0] === '630' && !!meta('og:image:alt')[0], meta('og:image')[0]);
  check(`${p} twitter card`, meta('twitter:card')[0] === 'summary_large_image' && meta('twitter:title')[0] === titleTags[0]
    && meta('twitter:description')[0] === meta('description')[0] && meta('twitter:image')[0] === `${siteURL}/og.png`);
  check(`${p} SVG icon`, icons.some(l => l.type === 'image/svg+xml'), icons.map(l => l.href).join(', '));
  check(`${p} no noindex`, !meta('robots').some(c => c.includes('noindex')));
  const values = [...metas.map(m => m.content ?? ''), ...links.map(l => l.href ?? '')].join(' ').toLowerCase();
  const foreignHosts = [...values.matchAll(/https?:\/\/([^/\s"]+)/g)].map(m => m[1]).filter(h => h !== new URL(siteURL).host);
  check(`${p} no local, draft, or foreign values`, !forbidden.some(f => values.includes(f)) && !foreignHosts.length, foreignHosts.join(', '));
}
check('titles unique', new Set(titles.values()).size === publicPages.length, [...titles.values()].join(' | '));

for (const path of notFoundPages) {
  const response = await fetch(baseURL + path);
  const html = await response.text();
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const metas = tags(head, 'meta');
  const title = head.match(/<title>([^<]*)<\/title>/i)?.[1];
  check(`${path}: 404`, response.status === 404, String(response.status));
  check(`${path}: title`, decode(title ?? '') === 'Page not found | Akash K Pillai', title);
  check(`${path}: noindex`, metas.some(m => m.name === 'robots' && m.content.includes('noindex')));
  check(`${path}: no canonical, og:url, og:image`, !/rel="canonical"/.test(head) && !metas.some(m => m.property === 'og:url' || m.property === 'og:image'));
}

const sitemap = await fetch(baseURL + '/sitemap.xml');
const sitemapText = await sitemap.text();
const locs = [...sitemapText.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m => m[1]);
const expectedLocs = publicPages.map(canonicalOf);
check('sitemap 200 XML', sitemap.status === 200 && /xml/.test(sitemap.headers.get('content-type') ?? ''), `${sitemap.status} ${sitemap.headers.get('content-type')}`);
check('sitemap = public canonicals', locs.length === expectedLocs.length && expectedLocs.every(u => locs.includes(u)), locs.join(', '));

const robots = await fetch(baseURL + '/robots.txt');
const rules = (await robots.text()).split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => l.split(/:\s*/).map(s => s.trim()));
const rule = key => rules.filter(([k]) => k.toLowerCase() === key).map(([, ...v]) => v.join(':'));
check('robots 200 text/plain', robots.status === 200 && /text\/plain/.test(robots.headers.get('content-type') ?? ''));
check('robots rules', rule('user-agent').includes('*') && rule('allow').includes('/') && !rule('disallow').some(Boolean)
  && rule('sitemap').length === 1 && rule('sitemap')[0] === `${siteURL}/sitemap.xml`, JSON.stringify(rules));

const image = await fetch(baseURL + '/og.png');
const bytes = new Uint8Array(await image.arrayBuffer());
const view = new DataView(bytes.buffer);
const png = bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
check('og.png 200 PNG 1200×630', image.status === 200 && image.headers.get('content-type') === 'image/png' && png
  && view.getUint32(16) === 1200 && view.getUint32(20) === 630, `${image.status} ${image.headers.get('content-type')} ${png ? `${view.getUint32(16)}×${view.getUint32(20)}` : 'not PNG'}`);

console.log(`\n${failures ? `${failures} failure(s)` : 'all checks passed'} (BASE_URL ${baseURL}, SITE_URL ${siteURL})`);
// exitCode, not exit(): exiting while fetch sockets close trips a libuv assertion on Windows.
process.exitCode = failures ? 1 : 0;
