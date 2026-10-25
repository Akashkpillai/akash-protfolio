# Verification: Engineering Case Studies

Actual outcomes only. A check not listed as run here has not been run.

## T001 Context (2026-10-25)

- Root: `C:\Users\HP\Desktop\akash-portfolio`
- Git branch (`git branch --show-current`): `feat/002-engineering-case-studies`
- `git status --short` before changes: `M .specify/integration.json`, untracked `.claude/`,
  `.specify/integrations/claude.manifest.json`, `specs/002-engineering-case-studies/`
- `SPECIFY_INIT_DIR`, `SPECIFY_FEATURE_DIRECTORY`, `SPECIFY_FEATURE`: unset
- `.specify/feature.json` → `specs/002-engineering-case-studies`
- Tools: Node.js `v24.12.0`, npm `11.6.2`, Git `2.37.1.windows.1`
- Spec quality checklist: 16/16 checked

## T002 Baseline (unchanged v0.1.0 source)

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 0 vulnerabilities |
| `npm run lint` | Pass; no output |
| `npm run typecheck` | Pass; no output |
| `npm run build` | Pass; routes `/` and `/_not-found`, both static |

`package.json` dependencies unchanged; no dependency added in this feature.

## T003–T006 Source review (2026-10-25, reviewer Claude)

Method: `git clone --depth 1` into fresh empty scratchpad directories; files read only;
nothing installed or executed; clones deleted afterwards.

| Project | Repository | Branch | Reviewed commit |
| --- | --- | --- | --- |
| Resume Analyzer | `Akashkpillai/resume-analyzer` | `main` | `e0d61a854566aff4f3256e5b68d3957f06dc49bd` |
| Notification Platform | `Akashkpillai/notificationservice` | `master` | `f202b4837fb2ff4fd96dcdcde3497e7a44c2f01a` |
| User Management API | `Akashkpillai/user-management-with-prisma` | `master` | `97603df57820c47d0dc0256aa031ef26aadddc7b` |

Files read and claim IDs are listed per project in `docs/project-evidence.md`.

Guide claims changed by the review:

- Resume Analyzer: README model name (GPT-3.5-turbo) and TypeORM both contradicted by code;
  copy follows code. Added limitations RA-L3–RA-L5 (in-memory skill filter, local file
  storage, no tests).
- Notification Platform: "retry" narrowed — workers publish retry/dead-letter events, but no
  retry or DLQ consumer exists (NP-L2). Found a record-ID mismatch between router and
  workers (NP-L3). Preference/template models are schema-only (NP-L4). README's
  "production-grade" not used. Retry threshold read from source: three attempts.
- User Management API: role behavior confirmed, plus an authorization gap — `role` accepted
  on public create and USER-accessible update, no ownership check (UM-L2).

Owner-confirmed rationale tables added (empty). Owner review of the register: pending.

## T022 / T026 Build, HTTP, and content checks (production server, `next start`)

- `npm run lint`: pass. First run failed (`no-html-link-for-pages` on the hero's `/#work`
  anchor); fixed by using the in-page `#work` anchor, then pass.
- `npm run typecheck`: pass. `npm run build`: pass; routes `/`, `/_not-found`, `/work`, and
  exactly three SSG paths `/work/resume-analyzer`, `/work/notification-platform`,
  `/work/user-management-api`.
- HTTP (`curl`): 200 for `/`, `/work`, and the three case studies; 404 for `/work/meridian`,
  `/work/not-a-project`, `/work/Resume-Analyzer`, `/work/x123`; 308 for
  `/work/resume-analyzer/` → `/work/resume-analyzer`. **Pass (SC-002 status part).**
- Raw HTML of each case study: one `h1`; Problem, My contribution, Implementation,
  Architecture, Decisions, Tradeoffs, Limitations, Stack, and a single source link to the
  register URL; diagram component list and status labels present; no selection buttons in
  server HTML. **Pass (SC-001).**
- Leak search (case-insensitive `meridian`, `notification_service`) in all fetched pages and
  in `.next/server` and `.next/static`: 0 matches. **Pass.**
- Found and fixed during checks:
  1. Notification Platform evidence IDs (`NP-…`) appeared in the page's hydration data
     because the interactive diagram received full component records. Evidence is now
     stripped before the Client Component; re-check found 0 evidence IDs in any page.
  2. Client JS bundled every project record (draft included) because client code imported
     status labels from `projects.ts`. Labels moved to import-free
     `src/content/claim-status.ts`; re-check found no case-study prose in `.next/static`.
- Repository links (`curl -L`): all three return 200 (checked 2026-10-25).

## T025 Draft transition

Set `user-management-api` to `status: "draft"`, rebuilt: build listed only two case-study
paths; `/work/user-management-api` → 404; no "User Management" text on `/`, `/work`, or the
other case studies; no `user-management-api` prerendered files; after the bundle fix, 0
client chunks contain its text. Restored `published` and rebuilt: three paths again.
**Pass.**

## T024 Source search

`src/` contains no Meridian record or name; pages read projects only through
`publishedProjects`/`getPublishedProject`; `src/app/layout.tsx` metadata is unchanged
(profile only); no `sitemap.ts` or `robots.ts` exists. **Pass.**

## T037 / T038 / T039 Browser checks

Script: `specs/002-engineering-case-studies/verification/run-browser-checks.mjs`
(`playwright-core` from `%TEMP%/akash-portfolio-qa-tools`, installed Chrome, headless,
`next start` on port 3100). Raw output: `verification/results.json`; screenshots alongside.

| Check | Result | Notes |
| --- | --- | --- |
| responsive | PASS | 390, 768, 1440 px and "zoom200" on `/`, `/work`, 3 case studies, 404: `scrollWidth == innerWidth`, no clipped text. **zoom200 is emulated** (720 CSS px viewport at device scale 2), not Chrome's zoom setting as in 001. |
| noJavaScript | PASS | All sections, diagram lists, status labels, source link, limitations present; 0 selection buttons |
| keyboardNavigation | PASS | Work in desktop and mobile nav from a case study reaches `/#work`; each case study reached from homepage with one keyboard activation; "View all work" reaches `/work`, which lists the three in curated order |
| diagramSelection | PASS | 8 "Show …" buttons; Enter and Space toggle `aria-pressed` (only one true), visible focus, polite live region "Selected: …", SVG and list highlight; pointer click works; Push "Unfinished" with dashed edge; Retry/dead-letter "Implemented code path" |
| reducedMotion | PASS | Media query matches; no transitions on diagram items, nodes, or buttons |
| links | PASS | 20 distinct links on all new pages and the 404 page: internal 200 with existing hash targets; GitHub 200 |
| regression001 | PASS | Hero name/role/headline and "Explore the flow" → `#approach` unchanged; mobile menu opens, lists Home/Work/Approach, Escape closes and returns focus; flow Trace/Next steps Input → Process |

Visual review (screenshots): first homepage pass at 1440 px showed the pipeline and
architecture previews too small and the full-width data-model preview oversized; preview
column widened and data-model preview capped at 44rem, re-run all PASS, re-reviewed. At
390 px case studies show the full text list with the SVG hidden, as designed. No
prohibited delin.dev motifs observed. Not reviewed by a human yet.

Contrast (WCAG ratio, computed): implemented label 6.90, unfinished label 6.70,
illustrative label 13.22, captions 6.82–7.51, SVG status text 9.80, copper story numbers
4.61, selected node text 13.12. All ≥ 4.5.

## T040 Claim trace

Every evidence ID cited in `src/content/case-studies/*.ts` exists in
`docs/project-evidence.md` (0 missing). Every recorded limitation appears in that
project's Limitations section (RA 6/6, NP 5/5, UM 5/5). Claims without evidence: only the
three contribution statements (owner-confirmed sole authorship). No owner-confirmed
rationale exists yet, so no decision states an owner motive. One decision (RA-D4) quotes a
reason from a code comment, attributed to the code — flagged for owner review. Uncited
register ID: RA-12 (Swagger), unused. No metrics, testimonials, employment details, demo
actions, screenshots, or rationale placeholders appear.

## T041 Owner review

**Open.** The owner has not yet reviewed the updated register. Items needing an owner
decision: UM-L2 (authorization gap) and NP-L3 (record-ID mismatch) are stated publicly as
limitations; RA-D4's quoted code-comment reason. Publication gate remains open.

## T042 Reconciliation (2026-10-25)

| Item | Result |
| --- | --- |
| FR-001 status + published selector | Pass (T025) |
| FR-002 evidence record per project | Fields filled (T003–T006); **owner review open** |
| FR-003 homepage stories, distinct previews, "View all work" | Pass |
| FR-004 `/work` | Pass |
| FR-005 direct case-study addresses | Pass |
| FR-006 nine sections; decisions without unconfirmed motives | Pass |
| FR-007 404 + way back to `/work` | Pass |
| FR-008 drafts absent incl. generated assets | Pass after bundle fix |
| FR-009 no-JS content | Pass |
| FR-010 no demo action | Pass |
| FR-011 labeled explanatory visuals, no empty preview | Pass |
| FR-012 static text; only Notification interactive; keyboard, state, focus | Pass |
| FR-013 status labels without JS or color; limitations visible | Pass |
| FR-014 register-only claims and URLs | Pass (T040); owner review open |
| FR-015 nav Work → `/#work`, back links, no dead links | Pass |
| FR-016 widths, zoom, reduced motion | Pass (zoom emulated) |
| FR-017 visual language, no prohibited motifs | Pass (automated + Claude screenshot review) |
| FR-018 001 behavior | Pass (regression001) |
| SC-001 – SC-002, SC-004 – SC-006 | Pass |
| SC-003 | Pass for traceability; owner review open |
| SC-007 | Static text explains every component; preview distinctness judged by Claude only |

Unrun: Chrome's real 200% zoom setting; human visual review; owner register review.
