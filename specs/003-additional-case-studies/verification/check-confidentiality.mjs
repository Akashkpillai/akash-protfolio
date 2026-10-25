// Searches public output and committed content for confidential terms (feature 003, SC-002).
// Terms are read at run time from gitignored private-evidence/terms.txt and are never
// printed: output is counts and file names only.
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3100';
const pages = (process.env.PAGES ?? '/,/work,/work/hrms-backend,/work/meridian-assistant,/work/notification-platform,/work/resume-analyzer').split(',');
const terms = (await readFile(join(root, 'private-evidence/terms.txt'), 'utf8'))
  .split(/\r?\n/).map(t => t.trim().toLowerCase()).filter(Boolean);

function count(text) {
  const lower = text.toLowerCase();
  return terms.reduce((n, term) => n + lower.split(term).length - 1, 0);
}

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if ((await stat(path)).size < 5_000_000) yield path;
  }
}

const findings = [];
for (const path of pages) {
  const response = await fetch(baseURL + path);
  const n = count(await response.text());
  findings.push({ where: `page ${path} (${response.status})`, matches: n });
}
for (const dir of ['.next/server', '.next/static', 'src/content']) {
  let n = 0;
  const hits = [];
  for await (const file of files(join(root, dir))) {
    const c = count(await readFile(file, 'utf8').catch(() => ''));
    if (c) { n += c; hits.push(file.slice(root.length + 1)); }
  }
  findings.push({ where: dir, matches: n, files: hits });
}
const register = count(await readFile(join(root, 'docs/project-evidence.md'), 'utf8'));
findings.push({ where: 'docs/project-evidence.md', matches: register });

for (const f of findings) console.log(`${f.matches === 0 ? 'ok  ' : 'HIT '} ${f.where}: ${f.matches}${f.files?.length ? ' in ' + f.files.join(', ') : ''}`);
const total = findings.reduce((n, f) => n + f.matches, 0);
console.log(`terms=${terms.length} total matches=${total}`);
process.exit(total ? 1 : 0);
