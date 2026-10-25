# Verification: Systems Lab Redesign

Actual outcomes only. A check not listed as run here has not been run. Builds use
`SITE_URL=https://portfolio.example` (reserved test host; not releasable).

## Preparation (2026-10-26)

- Feature 005 recorded and paused (`specs/005-launch-readiness/verification.md`, "Feature
  paused"); `.specify/feature.json` → `specs/006-systems-lab-redesign`.
- Constitution amended 1.0.0 → 2.0.0 (principle II → Systems Lab identity) at the owner's
  direction; Sync Impact Report at the top of `.specify/memory/constitution.md`.
- Spec checklist 16/16; analysis: 0 critical/high, 4 medium fixed in spec/tasks before
  implementation (hover glow wording, first-screen check, nav-from-every-route check,
  prototype snapshot).

## T001 Context and baseline (2026-10-26)

- Root `C:\Users\HP\Desktop\akash-portfolio`; Git branch `feat/005-launch-readiness`
  (HEAD `0e1cd5f`); working tree = 005's uncommitted work + owner prototype + 10-line
  `AGENTS.md` block added by `next dev`. `SPECIFY_*` unset.
- Owner prototype snapshotted before any change:
  `prototype/SystemsLab.tsx.txt` (99 lines, sha256 prefix `77d71beabc1722ab`, identical to
  the source) and `prototype/systems-lab-prototype.css.txt` (30 lines).
- Baseline: `npm run lint` exit 0; `npm run typecheck` exit 0; `npm run build` **fails**:
  Turbopack "Failed to write app endpoint /page — the chunking context does not support
  external modules (request: node:fs)". Cause: the prototype client component imports
  `ResumeLink` → `src/lib/resume.ts` (`node:fs`) into the browser bundle. Fixed by T008's
  server/client split.

## T002–T006 Docs and foundation (2026-10-26)

- `docs/design-direction.md` rewritten for Systems Lab; dated status notes in
  `docs/product-brief.md` and `docs/roadmap.md`.
- T003: `globals.css` re-themed by a checked script (every replacement asserted its expected
  match count): dark tokens in `@theme`, `color-scheme: dark`, `#39444d` ×17 → `--color-muted`,
  `#4a555e` ×11 → `--color-subtle`, light washes → token washes, the formerly inverted contact
  panel → raised surface, prototype block removed (snapshot kept). CRLF endings preserved.
- T004 `src/content/systems.ts`: accents, four flows (25 steps, 5 branch steps), focus
  statements. T005 nav items and `profile.intro` (from the owner-confirmed About text).
  T006 `Header`/`MobileNav`: brand "AKASH / SYSTEMS LAB", Work/Experience/About/Contact, and
  a Resume download item added on the server only when the PDF exists.

## US1 results (2026-10-26)

Build `SITE_URL=https://portfolio.example`, `next start -p 3100`, Chrome `156.0.8078.47`,
`playwright-core` `1.64.1`, `axe-core` `4.14.0`. Script:
`verification/run-browser-checks.mjs`.

- lint 0, typecheck 0, build 0 (same 13 routes as 005).
- **PASS**: responsive (10 pages × 390/768/1440/emulated zoom200, no overflow or clipping),
  notFound, noJavaScript (homepage nodes are 4 links to case studies, no trace button,
  noscript lists 4 projects and their steps; 5 nav links everywhere), focusWalk (homepage
  46/46 and 42/42 focusable reached in DOM order; minimum focus contrast 9.38:1),
  reducedMotionAll, accessibility, links, diagramSelection, mobileNav (Work, Experience,
  About, Contact, Resume; Escape returns focus), constellation (4 nodes selected by click,
  Enter, Space, click; one `aria-pressed="true"`; panel heading and case-study link match;
  live message "Showing <name>: <n> steps."; focus and scroll unchanged on keyboard
  selection; trace 0→5 then "Restart trace" back to 0 with `aria-current="step"`; touch tap at
  390 px selects), mobileMap (cards 64 px tall, stacked, panel after them), firstScreen
  (1440 × 900: name, role, headline, both actions, all 4 nodes inside the viewport),
  navFromEveryRoute (24 keyboard activations from a case study, the changelog, and a 404 page,
  desktop and mobile), profile.
- Fixes made from observations:
  - Tablet (768 px) fell into the phone layout because the map breakpoint was 52rem
    (832 px) → map breakpoint 46rem; 768 px now shows two columns with the panel below.
  - Header (76rem shell) and hero (86rem) left edges misaligned at 1440 → one shared
    86rem content width from 68rem.
  - axe "incomplete" `aria-prohibited-attr` on `#project-map` (a `div` with
    `aria-labelledby`) → `section`.
  - Contrast check was vacuous: the new body grid is a CSS gradient, which 001's routine
    marked "unresolved" (1,720 elements). The routine now composites every gradient stop and
    takes the worst ratio. Result: 0 text-contrast failures, 0 unresolved, minimum 5.46:1;
    0 axe violations. 818 axe `color-contrast` items remain "incomplete" (axe cannot read
    gradient backgrounds); the computed check covers them.
- Visual review (viewport crops): 1440 three-part hero; 768 two columns + panel below;
  390 single column, 64 px cards with a ✓ selected marker, panel after the cards. No
  delin.dev motifs, metrics, or status indicators.
- Spec wording aligned before coding the phone layout: the brief's "panel below the selected
  project" would make visual order differ from keyboard order (WCAG 2.4.3) with one panel,
  so the panel follows the card list (FR-024, US1 scenario 7 updated with the reason).

## US2 results (2026-10-26)

- T013 `src/lib/evidence-note.ts` (derived: source, 7-char commit, unfinished, not run end to
  end). T014 `ProjectStory`/`SelectedWork`/`/work` as system-preview cards (accent, title
  link, summary, stack, evidence note, existing preview, "Open case study"); `/work` uses `h2`
  titles. T015 `Reveal`, T016 `CaseStudyNav`, T017 `CaseStudyArticle` two-column layout with
  sections wrapped in `Reveal`; claim text, labels, diagrams, and source logic untouched.
- T019 `check-content-preserved.mjs`: **208/208** strings present — every `text`/
  `responsibility` string of the 4 published case studies (35, 33, 29, 29), experience
  highlights and project summaries (12), titles and organizations (4), skills and groups
  (60), contact hrefs (3), About paragraphs (3).
- Bugs found by the checks and fixed:
  - Case-study summary never marked "Limitations": the short last section cannot scroll up
    to the reading line → at the bottom of the page the last section is current.
  - Check timing: `html { scroll-behavior: smooth }` made `scrollIntoView` animate, so the
    reveal check read mid-transition (0.80) → checks scroll with `behavior: 'instant'`.
  - Transient Windows file locks on `results.json` and screenshots (Desktop folder) → writes
    retry up to 5 times. Not a site issue.
  - Accessibility pass measured sections still waiting to reveal (opacity 0 → 567
    "unresolved") → the pass now uses reduced motion so it measures the settled page.
- Visual review fixes: two-column preview cards shrank diagrams until labels were
  unreadable → one project per row (copy left, preview right) from 60rem; the phone case
  summary was ~550 px tall → section links in two columns below 68rem (~400 px).

## US3 results (2026-10-26)

- T021: Contact label 07 → 06 (Approach removed; others already sequential). Profile
  sections restyled through tokens; the formerly inverted contact panel is a raised surface.
- T022: 404, changelog, footer use the tokens; visually reviewed (404 at 1440, changelog at
  390).
- T023: `/og.png` redrawn (dark canvas, grid, "AKASH / SYSTEMS LAB", role, name, headline one
  sentence per line, teal rule, decorative AK node with four accent dots; fonts read once at
  module scope); `icon.svg` redrawn (dark square, teal ring node, three accent dots). Both
  inspected; icon legible at 16/32/128 px.
- T024: covered by the full run below.

## T025 Cleanup (2026-10-26)

Deleted unreferenced `src/components/layout/Hero.tsx`, `src/components/diagrams/FlowDiagram.tsx`,
`src/content/flow.ts` (tracked in Git; recoverable). A checked parser removed 68 CSS rules whose
every selector targeted removed components (`.hero*`, `.approach*`, `.flow-*`, old work-index
and project-story layout classes) and two media blocks left empty; mixed selector lists kept.
Note: 005's accessibility fix to `FlowDiagram` (`role="group"`) leaves with the component.

## T026 Full verification (2026-10-26)

Final build: lint 0, typecheck 0, build 0 (13 routes). Same environment as US1.

| Check | Result | Notes |
| --- | --- | --- |
| `check-evidence-ids.mjs` (005) | Pass | 49 IDs cited, 150 citations (118 before + 32 from flows), 0 missing |
| `check-content-preserved.mjs` | Pass | 208/208 |
| `check-metadata.mjs` (005) | Pass | 116 assertions; sitemap, robots, `/og.png` 1200×630, 404s |
| `check-served-output.mjs` (005) | Pass | served draft 0, personal 0; draft only in server-only chunks (now 8 files: `systems.ts` lists the draft slug's accent) |
| `check-confidentiality.mjs` (003, case-study scope) | Pass | case-study pages 0, `.next/static` 0, register 0; 25 expected hits from the employer name in Experience (homepage + `experience.ts`), identical to 005 |
| Browser: responsive | Pass | 40 cases; 37 screenshots in `verification/` |
| Browser: notFound, noJavaScript, mobileNav, profile, links | Pass | 60 link destinations; LinkedIn **unconfirmed** (999 to automation) |
| Browser: focusWalk | Pass | 20 cases; minimum focus contrast 9.38:1 |
| Browser: reducedMotionAll | Pass | 0 elements with non-zero transition/animation |
| Browser: accessibility | Pass | 0 axe violations; computed text contrast 0 failures, 0 unresolved, min 5.46:1; 809 axe `color-contrast` "incomplete" (gradient backgrounds) covered by the computed check |
| Browser: constellation, mobileMap, firstScreen, navFromEveryRoute | Pass | see US1 |
| Browser: caseStudyNav, reveal, diagramSelection | Pass | sticky at 1440, static at 390; reveal 0 → 1 on scroll, all 1 with reduced motion and without JS |
| Lighthouse 13.5.0 home desktop | Measured | perf 100, a11y 100, BP 100, SEO 100; LCP 0.5 s; TBT 0; CLS 0.004 |
| Lighthouse home mobile | Measured | perf 95, a11y 100, BP 100, SEO 100; LCP 2.6 s (element `p.lab-copy`); TBT 170 ms; CLS 0. Over the 2.5 s investigation line, as 005's Journal home was (2.7 s, perf 90): no regression; same localhost limitation |

**Not run**: Chrome's real 200% zoom setting (emulated only); screen-reader testing; a
person checking the LinkedIn profile; real link-preview generation (needs a public domain);
performance on a deployed host.

**Known limitations**: the Meridian workflow preview fits six nodes in one row, so its labels
are small (~9 px) on the homepage card at 1440 px (the case study shows the full diagram, and
a text list replaces the preview below 40rem); dark theme only; axe cannot evaluate contrast
over gradients (computed check used instead).

## T027 Reconciliation (2026-10-26)

| Requirement | Evidence | Status |
| --- | --- | --- |
| FR-001, FR-002 | Tokens, screenshots reviewed; no forbidden motifs | Pass |
| FR-003 | mobileNav, navFromEveryRoute, header | Pass |
| FR-004 | Hero text from profile; actions; firstScreen | Pass |
| FR-005–FR-008 | constellation (pointer, Enter, Space, touch; `aria-pressed`; live message; focus/scroll kept) | Pass |
| FR-009 | Flows cite IDs (evidence check); statuses shown | Pass |
| FR-010 | constellation trace states | Pass |
| FR-011, FR-012 | Focus strip; sections reachable | Pass |
| FR-013 | Preview cards with evidence notes | Pass |
| FR-014 | content-preserved 208/208; public source links only | Pass |
| FR-015, FR-016 | caseStudyNav, reveal | Pass |
| FR-017, FR-018 | reducedMotionAll; motion only under no-preference; panel animates only after interaction | Pass |
| FR-019 | metadata 116/116, sitemap/robots, 404 | Pass |
| FR-020 | content-preserved; served-output | Pass |
| FR-021 | `/og.png`, `icon.svg` redrawn, inspected | Pass (owner approval pending) |
| FR-022 | 0 contrast failures; focus ≥ 9.38:1 | Pass (automated + review; not a conformance claim) |
| FR-023, FR-025, FR-026 | focusWalk, mobileMap (64 px), noJavaScript/noscript | Pass |
| FR-024 | responsive 40 cases; layouts reviewed at 390/768/1440 | Pass (200% zoom emulated) |
| FR-027 | No commit, tag, push, deploy; version still 0.3.0 | Open until owner acceptance (T028) |
| SC-001–SC-009 | As above | Pass, except SC-005's real browser zoom (unrun) |
