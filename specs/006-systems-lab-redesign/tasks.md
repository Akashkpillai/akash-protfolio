---

description: "Implementation tasks for the Systems Lab redesign"
---

# Tasks: Systems Lab Redesign

**Input**: Design documents in `specs/006-systems-lab-redesign/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [UI contract](contracts/ui.md), [quickstart.md](quickstart.md)

**Tests**: No test suite is requested. Tasks build verification scripts and run command,
HTTP, browser, accessibility, and content checks, recording actual outcomes in
`specs/006-systems-lab-redesign/verification.md`. Checks that cannot run are recorded as
**not run**.

**Organization**: Setup and theme foundation, then US1 homepage systems (P1), US2 work and
case studies (P2), US3 profile, navigation, and site-wide identity (P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on another incomplete task in the same phase
- **[US1]–[US3]**: Maps to the user story in [spec.md](spec.md)

## Path Conventions

- Single Next.js App Router app; new client enhancements in `src/components/lab/`
- Colours only through tokens in `src/app/globals.css` `:root`
- No claim text, evidence ID, or profile fact is edited; flows cite register IDs only
- Builds use `SITE_URL=https://portfolio.example` (not releasable)
- No commit, tag, push, or deployment

---

## Phase 1: Setup

- [X] T001 Verify root, Git branch and status, unset `SPECIFY_*` overrides, `.specify/feature.json` → `specs/006-systems-lab-redesign`, constitution 2.0.0; snapshot the owner's untracked prototype (`src/components/layout/SystemsLab.tsx` and the "Systems Lab homepage direction" CSS block) as `.txt` files in `specs/006-systems-lab-redesign/prototype/` before any change; run `npm run lint`, `npm run typecheck`, and `npm run build` (with `SITE_URL`) on the starting tree (005 work + owner prototype) and record results, including any prototype build failure, in `specs/006-systems-lab-redesign/verification.md`.
- [X] T002 [P] Rewrite `docs/design-direction.md` for the Systems Lab identity (tokens, composition, interaction, motion, accessibility, differentiation incl. delin.dev list) keeping a dated note that it replaces the Engineering Journal direction; add dated status notes to `docs/product-brief.md` and `docs/roadmap.md` (006 active, 005 paused).

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T003 Re-theme `src/app/globals.css`: dark tokens in `:root` per research (canvas `#0d1116`, surface `#131a21`, surface-2 `#18212a`, ink `#f1ebe2`, muted `#aab4bc`, subtle `#8695a0`, line `#2a3540`, teal `#2fd3c4`, cobalt `#6f9bff`, copper `#de8a5f`, sand `#d9c27a`, focus = teal, grid); replace every hard-coded light colour outside `:root` with a token; rewrite the prototype's "Systems Lab homepage direction" block onto tokens; global focus ring ≥ 2 px; keep the global reduced-motion rule (FR-001, FR-018, FR-022).
- [X] T004 [P] Create `src/content/systems.ts`: `Accent = "teal" | "cobalt" | "copper" | "sand"`; `projectAccents: Record<ProjectSlug, Accent>` (resume-analyzer teal, notification-platform cobalt, hrms-backend copper, meridian-assistant sand, user-management-api teal); `FlowStep { id; label (≤ 40 chars); detail (one sentence); evidence (≥ 1 register ID); status? }`; `SystemFlow { steps (3–7); branch? { from: step id; label; steps (1–3) } }`; `systemFlows` with the four flows in research "Flow content" (HRMS narrowed to HR-xx facts; no "response" step); `focusStatements` = the three owner sentences (FR-009, FR-011).
- [X] T005 [P] Update `src/content/navigation.ts` to Work `/#work`, Experience `/#experience`, About `/#about`, Contact `/#contact`; set `profile.intro` in `src/content/profile.ts` to an introduction built only from the owner-confirmed About text (backend services with Node.js, NestJS, and PostgreSQL, and AI features) (FR-003, FR-004).
- [X] T006 Update `src/components/layout/Header.tsx` (brand "AKASH / SYSTEMS LAB" link to `/` whose name contains the visible text; nav items; Resume item with `download` only when `hasResume()`) and `src/components/layout/MobileNav.tsx` (accepts plain items including the optional Resume item; same details/summary behaviour) (depends on T005; FR-003, FR-025).

**Checkpoint**: Site renders dark with the new navigation; content unchanged.

---

## Phase 3: User Story 1 - Explore systems from the homepage (Priority: P1) 🎯 MVP

**Goal**: Three-part hero with the project map, architecture panel, trace, and focus strip.

**Independent Test**: At 1440/768/390 px select every node by click, tap, Enter, Space; panel, `aria-pressed`, and live message update; reduced motion and no-JS behave per the contract.

- [X] T007 [US1] Create `src/components/lab/ProjectConstellation.tsx` (`"use client"`): props `projects: LabProject[]`; hydration flag via `useSyncExternalStore`; before hydration nodes are links to `/work/<slug>`, after it `button type="button" aria-pressed`; selection state (default first); panel `#architecture-panel` with explanatory label, name, summary, ordered steps with status labels, optional branch sub-list, "Trace flow"/"Next step"/"Restart trace" with `aria-current="step"`, "Open case study" link; visually hidden `aria-live="polite"` message ("Showing <name>: <n> steps." / "Step <i> of <n>: <label>."); no focus or scroll change on update; `<noscript>` list of every project's flow (FR-005–FR-010, FR-026).
- [X] T008 [US1] Rewrite the owner's prototype `src/components/layout/SystemsLab.tsx` as a server component: `section#systems` with intro (`h1` name, role, headline, `profile.intro`, "Explore systems" → `#project-map`, Resume action only when `hasResume()`), `ProjectConstellation` with `LabProject[]` built from `publishedProjects` + `projectAccents` + `systemFlows` and ellipse positions from index and count, and the focus strip `aside[aria-label="Current focus"]` (FR-004, FR-005, FR-011).
- [X] T009 [US1] Update `src/app/page.tsx` order to `SystemsLab`, `SelectedWork`, Experience, Skills, About, Contact; remove the Approach section and the `FlowDiagram`/`Hero` imports; keep the metadata export (FR-012, FR-019).
- [X] T010 [US1] Style the hero, map (ellipse layout, connector SVG, centre node), nodes (accent border, selected marker, focus/hover glow), panel, trace highlight and connector animation, and focus strip in `src/app/globals.css`, with breakpoints > 68rem three columns, 52–68rem two columns (panel below), ≤ 52rem single column vertical cards ≥ 44 px; motion only under `prefers-reduced-motion: no-preference` (FR-017, FR-018, FR-024, FR-025).
- [X] T011 [US1] Create `specs/006-systems-lab-redesign/verification/run-browser-checks.mjs` from 005's script: nav expectations (5 items + Resume, mobile menu), no Approach/flow checks; add `constellation` (click, Enter, Space, touch tap with `hasTouch`; one `aria-pressed="true"`; panel heading and link match; live message text; trace advances with `aria-current="step"`; focus stays on node), `mobileMap` (390 px: nodes stacked, each ≥ 44 × 44, panel after list), `firstScreen` (1440 × 900: name, role, headline, both actions, and every map node inside the viewport on load), `navFromEveryRoute` (each nav item from `/work/hrms-backend`, `/changelog`, and a 404 page, desktop and mobile, reaches its section), and homepage noJavaScript (nodes are links, noscript lists all published flows, no trace button).
- [X] T012 [US1] Build with `SITE_URL`, start on port 3100, run the browser script and `check-evidence-ids.mjs`; review homepage screenshots and crops at 1440/768/390/zoom200; fix observed problems only; record in `specs/006-systems-lab-redesign/verification.md` (SC-001–SC-004, SC-007).

**Checkpoint**: Homepage hero, map, and panel complete and accessible.

---

## Phase 4: User Story 2 - Work previews and case studies (Priority: P2)

**Goal**: System-preview work cards and restyled case studies with summary, highlighting, and reveals; content unchanged.

**Independent Test**: Work section, `/work`, and each case study at three widths, keyboard, reduced motion, no-JS; every claim and label present.

- [X] T013 [P] [US2] Create `src/lib/evidence-note.ts` deriving `{ source, commit (7 chars), unfinished, notRunEndToEnd }` from a `Project` and a short text ("Public source · reviewed at e0d61a8 · some paths not run end to end").
- [X] T014 [US2] Restyle `src/components/work/ProjectStory.tsx`, `src/components/work/SelectedWork.tsx`, and `src/app/work/page.tsx` as system previews: title link, summary, stack, evidence note, existing preview diagram + caption, "Open case study"; accent from `projectAccents`; only `publishedProjects` (depends on T013; FR-013).
- [X] T015 [P] [US2] Create `src/components/lab/Reveal.tsx` (`"use client"`): wraps server-rendered children; visible by default; after hydration, only with motion allowed and when starting below the viewport, hides then reveals on intersection (opacity + 12 px translate, 300 ms); never hides content above the fold (FR-016, FR-018).
- [X] T016 [P] [US2] Create `src/components/lab/CaseStudyNav.tsx` (`"use client"`): `nav[aria-label="Case study sections"]` with the project's flow steps (static) and links to the seven section ids; `IntersectionObserver` sets `aria-current="true"` on the section in view; works as plain links without JS (FR-015).
- [X] T017 [US2] Update `src/components/work/CaseStudyArticle.tsx`: two-column layout on wide screens with sticky `CaseStudyNav`, single placement after the header on narrow screens; wrap each section in `Reveal`; ensure section ids exist; no change to claim text, labels, diagrams, or source logic (FR-014–FR-016).
- [X] T018 [US2] Style work previews, `/work`, case-study layout and sticky summary, claim status labels, and all diagram SVG fills/strokes for the dark theme in `src/app/globals.css` (status still distinguished by text and border style) (FR-001, FR-022).
- [X] T019 [P] [US2] Create `specs/006-systems-lab-redesign/verification/check-content-preserved.mjs`: for each published case study, every `text:` and `responsibility:` string from `src/content/case-studies/<slug>.ts` appears in the rendered page; every experience highlight, skill, and contact href appears on `/`; exit non-zero on any miss (SC-008).
- [X] T020 [US2] Extend the browser script with `caseStudyNav` (wide: summary sticky, `aria-current` changes after scrolling to Limitations; narrow: not sticky) and `reveal` (no-JS and reduced motion: all sections visible; motion: below-fold section becomes visible after scroll); build, run, review case-study screenshots; record (SC-005, SC-007, SC-008).

**Checkpoint**: Work and case studies consistent with the homepage.

---

## Phase 5: User Story 3 - Profile, navigation, and site-wide identity (Priority: P3)

**Goal**: Profile sections, 404, changelog, footer, sharing image, and icon in the new identity.

**Independent Test**: Every nav item and contact action from every page, desktop and mobile; 404 and changelog; inspect `/og.png` and the icon.

- [X] T021 [US3] Renumber section labels sequentially after the hero now that Approach is gone (Work 02, Experience 03, Skills 04, About 05, Contact 06 — only Contact changes) in `src/components/work/SelectedWork.tsx` and `src/components/profile/{Experience,Skills,About,Contact}Section.tsx`, and restyle those sections, including the formerly inverted contact block, in `src/app/globals.css`; content unchanged (FR-012, FR-020).
- [X] T022 [P] [US3] Restyle the 404 page, changelog, and footer in `src/app/globals.css` (no content change) (FR-001).
- [X] T023 [P] [US3] Redraw `src/app/og.png/route.tsx` (dark canvas, faint grid, "AKASH / SYSTEMS LAB", name, role, headline one sentence per line, teal rule; fonts read once at module scope) and `src/app/icon.svg` (dark rounded square, teal ring node, accent dots; paths/circles only) (FR-021).
- [X] T024 [US3] Run the browser script's profile, links, notFound, and nav checks plus 005's `check-metadata.mjs`; view `/og.png` and the icon at 16/32/128 px; record (SC-009).

**Checkpoint**: All stories complete.

---

## Phase 6: Polish & Cross-Cutting

- [X] T025 Remove the now-unreferenced homepage-only components (`src/components/layout/Hero.tsx`, `src/components/diagrams/FlowDiagram.tsx`, `src/content/flow.ts`) and their CSS only if nothing imports them; record what was removed.
- [X] T026 Full verification: `npm run lint`, `npm run typecheck`, build, `check-evidence-ids.mjs`, `check-content-preserved.mjs`, `check-metadata.mjs`, `check-served-output.mjs`, 003 `check-confidentiality.mjs` (case-study pages), the full browser script, and Lighthouse home mobile/desktop; inspect all screenshots; record every result, environment, and anything not run in `specs/006-systems-lab-redesign/verification.md`.
- [X] T027 Reconcile FR-001–FR-027 and SC-001–SC-009 in `specs/006-systems-lab-redesign/verification.md`; add to `specs/005-launch-readiness/verification.md` that its UI results are stale and list what 005 must re-run.
- [X] T028 Acceptance (owner): confirm the constitution 2.0.0 amendment and the design; then set `package.json`/lockfile to `0.4.0` with a 0.4.0 changelog entry describing only completed 006 work, rebuild, confirm footer = package = changelog; no commit, tag, push, or deployment unless the owner asks (FR-027).

---

## Dependencies & Execution Order

- Setup (T001–T002) → Foundational (T003–T006) → stories.
- **US1** (T007–T012): T008 needs T004, T007; T009 needs T008; T012 last.
- **US2** (T013–T020): T014 needs T013; T017 needs T015, T016; T020 needs T011 (script) and T017–T019.
- **US3** (T021–T024): independent of US2; T024 needs T011.
- **Polish** (T025–T028): after stories; T028 needs the owner.

### Parallel Opportunities

- T002 with T001. T004 and T005. T013, T015, T016, T019. T022 and T023.
- Do not edit `src/app/globals.css` concurrently (T003, T010, T018, T021, T022 are sequential).

## Parallel Example: User Story 2

```text
Task: T013 [US2] Create src/lib/evidence-note.ts
Task: T015 [US2] Create src/components/lab/Reveal.tsx
Task: T016 [US2] Create src/components/lab/CaseStudyNav.tsx
Task: T019 [US2] Create verification/check-content-preserved.mjs
```

## Implementation Strategy

1. Foundation (theme, flows, nav) → US1 homepage → validate (T012): the MVP of the redesign.
2. US2 case studies and work → validate (T020).
3. US3 profile and identity assets → validate (T024).
4. Polish, full verification, reconciliation; owner acceptance bumps to 0.4.0.

## Notes

- Feature 005 stays paused; its scripts are reused unchanged.
- If browser tooling is unavailable, browser checks are recorded as not run.

**Accepted 2026-10-26**: owner approved the design and the constitution 2.0.0 amendment ("everything is approved"), together with 007. Package set to 0.5.0 (0.4.0 entry describes 006 only), recorded in feature 005's branch eat/005-launch-readiness.
