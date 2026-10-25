// Searches everything the production build serves for draft markers and unapproved personal
// details (feature 005 FR-010, SC-005). Personal terms are read from gitignored
// private-evidence/personal-terms.txt and never printed: output is counts and file names only.
// Server-only chunks are not reachable over HTTP; their draft counts are informational.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3100';
const pages = ['/', '/work', '/changelog', '/work/hrms-backend', '/work/meridian-assistant', '/work/notification-platform', '/work/resume-analyzer'];
const generated = ['/sitemap.xml', '/robots.txt'];
const draftTerms = ['user-management-api', 'user management api', 'user-management-with-prisma'];
const personalTerms = (await readFile(join(root, 'private-evidence/personal-terms.txt'), 'utf8'))
  .replace(/^﻿/, '').split(/\r?\n/).map(t => t.trim().toLowerCase()).filter(Boolean);
// The owner approved the résumé PDF with its phone number and home town (feature 004 T013).
const personalExempt = [join('public', 'resume') + sep];

function count(text, terms) {
  const lower = text.toLowerCase();
  return terms.reduce((n, term) => n + lower.split(term).length - 1, 0);
}

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}

const served = { draft: 0, personal: 0, hits: [] };
const informational = { draft: 0, files: [] };
// Prerendered responses live in .next/server/app and, from Next.js 16, .next/server/route-cache.
const isPrerendered = path => /\.(html|rsc|meta|body)$/.test(path)
  && [join('.next', 'server', 'app'), join('.next', 'server', 'route-cache')].some(dir => path.startsWith(dir));

async function scan(where, text) {
  const draft = count(text, draftTerms);
  const personal = personalExempt.some(p => where.startsWith(p)) ? 0 : count(text, personalTerms);
  served.draft += draft;
  served.personal += personal;
  if (draft || personal) served.hits.push(`${where} (draft ${draft}, personal ${personal})`);
}

for await (const path of files(join(root, '.next', 'server'))) {
  const rel = relative(root, path);
  const text = await readFile(path, 'utf8').catch(() => '');
  if (isPrerendered(rel)) {
    await scan(rel, text);
  } else {
    const n = count(text, draftTerms);
    if (n) { informational.draft += n; informational.files.push(rel); }
  }
}
for (const dir of [join('.next', 'static'), 'public']) {
  for await (const path of files(join(root, dir))) {
    await scan(relative(root, path), await readFile(path, 'utf8').catch(() => ''));
  }
}
const skipped = [];
for (const path of [...pages, ...generated]) {
  const response = await fetch(baseURL + path);
  if (response.status === 404 && generated.includes(path)) { skipped.push(path); continue; }
  await scan(`GET ${path} (${response.status})`, await response.text());
}

for (const hit of served.hits) console.log(`HIT  ${hit}`);
if (skipped.length) console.log(`skipped (404, not built yet): ${skipped.join(', ')}`);
console.log(`served surface: draft=${served.draft} personal=${served.personal} (personal terms=${personalTerms.length})`);
console.log(`informational, server-only chunks: draft=${informational.draft} in ${informational.files.length} file(s)${informational.files.length ? ': ' + informational.files.join(', ') : ''}`);
// exitCode, not exit(): exiting while fetch sockets close trips a libuv assertion on Windows.
process.exitCode = served.draft + served.personal ? 1 : 0;
