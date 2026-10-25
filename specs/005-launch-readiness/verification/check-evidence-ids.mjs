// Every evidence ID cited in src/content must exist in docs/project-evidence.md (feature 005 FR-007).
// Only IDs inside `evidence: [...]` arrays count, so comments and prose are ignored.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const idPattern = /[A-Z]{2,4}-R?\d{2}/g;

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (path.endsWith('.ts')) yield path;
  }
}

const register = new Set((await readFile(join(root, 'docs/project-evidence.md'), 'utf8')).match(idPattern));
const cited = new Map();
for await (const file of files(join(root, 'src/content'))) {
  const text = await readFile(file, 'utf8');
  for (const [, list] of text.matchAll(/evidence:\s*\[([^\]]*)\]/g)) {
    for (const id of list.match(idPattern) ?? []) {
      cited.set(id, [...(cited.get(id) ?? []), file.slice(root.length + 1)]);
    }
  }
}

const missing = [...cited.keys()].filter(id => !register.has(id)).sort();
for (const id of missing) console.log(`MISSING ${id} cited in ${[...new Set(cited.get(id))].join(', ')}`);
console.log(`register ids=${register.size} cited ids=${cited.size} citations=${[...cited.values()].flat().length} missing=${missing.length}`);
process.exit(missing.length ? 1 : 0);
