// SC-002 (feature 007): every Ask the lab answer comes from published content. Reads the
// answers captured by run-browser-checks.mjs (askLab → lab-answers.json) and checks that each
// paragraph text and list item appears verbatim in src/content, that labels are verbatim names
// or known interface labels, that notes are dates, and that no draft project appears.
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const here = dirname(fileURLToPath(import.meta.url));
const interfaceLabels = new Set(['Location', 'Languages', 'Email', 'My contribution', 'How it works', 'Stack', 'A limitation']);
const statusLabels = new Set(['Implemented code path', 'Unfinished', 'Illustrative']);
const date = /^[A-Z][a-z]{2} \d{4} – (Present|[A-Z][a-z]{2} \d{4})$/;
const draft = [/user-management/i, /user management/i];

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (path.endsWith('.ts')) yield path;
  }
}
let corpus = '';
for await (const file of files(join(root, 'src/content'))) {
  corpus += (await readFile(file, 'utf8')).replace(/\\"/g, '"').replace(/\\'/g, "'") + '\n';
}

const answers = JSON.parse(await readFile(join(here, 'lab-answers.json'), 'utf8'));
const problems = [];
let checked = 0;
for (const answer of answers) {
  for (const paragraph of answer.paragraphs) {
    const where = `"${answer.question}"`;
    for (const value of [paragraph.text, ...(paragraph.items ?? [])].filter(Boolean)) {
      checked++;
      if (!corpus.includes(value)) problems.push(`${where}: not in content: ${value.slice(0, 90)}`);
    }
    if (paragraph.label) {
      checked++;
      const label = paragraph.label.trim();
      if (!interfaceLabels.has(label) && !corpus.includes(label)) problems.push(`${where}: unknown label: ${label}`);
    }
    if (paragraph.note && !date.test(paragraph.note)) problems.push(`${where}: note is not a date: ${paragraph.note}`);
    if (paragraph.status && !statusLabels.has(paragraph.status)) problems.push(`${where}: unknown status: ${paragraph.status}`);
  }
  if (draft.some(pattern => pattern.test(JSON.stringify(answer)))) problems.push(`"${answer.question}": mentions the draft project`);
}

for (const problem of problems) console.log(`FAIL ${problem}`);
console.log(`${problems.length ? `${problems.length} problem(s)` : 'all answers from published content'} (${answers.length} answers, ${checked} strings)`);
process.exitCode = problems.length ? 1 : 0;
