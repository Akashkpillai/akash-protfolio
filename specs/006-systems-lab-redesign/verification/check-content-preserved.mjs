// SC-008 (feature 006): the redesign keeps every published case-study claim and every
// owner-confirmed profile fact. Reads the content files and checks each string appears in
// the rendered page. Node fetch only; BASE_URL is the running production build.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3100';

function strings(source, keys) {
  const pattern = new RegExp(`(?:${keys.join('|')}):\\s*"((?:[^"\\\\]|\\\\.)*)"`, 'g');
  return [...source.matchAll(pattern)].map(m => m[1].replace(/\\"/g, '"'));
}
function decode(html) {
  return html
    .replace(/<!-- -->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
}
async function page(path) {
  const response = await fetch(baseURL + path);
  return { status: response.status, text: decode(await response.text()) };
}

const projects = await readFile(join(root, 'src/content/projects.ts'), 'utf8');
const published = [...projects.matchAll(/slug: "([^"]+)",\s*order: \d+,\s*status: "published"/g)].map(m => m[1]);
const fileFor = { 'resume-analyzer': 'resume-analyzer', 'notification-platform': 'notification-platform', 'hrms-backend': 'hrms-backend', 'meridian-assistant': 'meridian-assistant', 'user-management-api': 'user-management-api' };

let missing = 0;
let checked = 0;
function report(where, items, text) {
  const absent = items.filter(item => !text.includes(item.replace(/\s+/g, ' ')));
  checked += items.length;
  missing += absent.length;
  console.log(`${absent.length ? 'FAIL' : 'ok  '} ${where}: ${items.length - absent.length}/${items.length}`);
  for (const item of absent) console.log(`     missing: ${item.slice(0, 100)}`);
}

for (const slug of published) {
  const source = await readFile(join(root, `src/content/case-studies/${fileFor[slug]}.ts`), 'utf8');
  const { status, text } = await page(`/work/${slug}`);
  if (status !== 200) { missing++; console.log(`FAIL /work/${slug}: status ${status}`); continue; }
  report(`/work/${slug} claims and components`, strings(source, ['text', 'responsibility']), text);
}

const home = await page('/');
const experience = await readFile(join(root, 'src/content/experience.ts'), 'utf8');
const highlights = strings(experience, ['summary']).concat([...experience.matchAll(/^\s+"([^"]{30,})",?$/gm)].map(m => m[1]));
report('/ experience highlights and project summaries', highlights, home.text);
report('/ experience titles and organizations', strings(experience, ['title', 'organization']), home.text);
const skills = await readFile(join(root, 'src/content/skills.ts'), 'utf8');
report('/ skills and groups', strings(skills, ['name']), home.text);
const contact = await readFile(join(root, 'src/content/contact.ts'), 'utf8');
const hrefs = [...contact.matchAll(/href: "([^"]+)"|email = "([^"]+)"/g)].map(m => m[1] ?? m[2]).map(h => h.replace('${email}', 'akashkpillai55@gmail.com'));
const homeHtml = await (await fetch(baseURL + '/')).text();
report('/ contact links', hrefs, homeHtml);
const profile = await readFile(join(root, 'src/content/profile.ts'), 'utf8');
report('/ about paragraphs', [...profile.matchAll(/^\s+"([^"]{40,})",?$/gm)].map(m => m[1]), home.text);

console.log(`\n${missing ? `${missing} missing` : 'all present'} (${checked} strings, published: ${published.join(', ')})`);
process.exitCode = missing ? 1 : 0;
