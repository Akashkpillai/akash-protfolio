# Tasks: Recruiter-Scan Refinement

**Input**: Design documents from `specs/008-recruiter-scan-refinement/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: No new test framework. Verification adapts the existing 007 browser suite (copied into
this feature) only where this spec changes behaviour, and records results in `verification.md`.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Record context in `specs/008-recruiter-scan-refinement/verification.md`: root, Git branch `feat/008-recruiter-scan-refinement` at `b6bcb35`, clean tree, `SPECIFY_*` unset, `.specify/feature.json` → 008, Node/npm/Chrome versions; state that 005's open tasks are untouched.
- [X] T002 Baseline on `b6bcb35`: build it in a `git worktree` under `%TEMP%` with `SITE_URL=https://portfolio.example`, serve on port 3101, and record the top of `#work` at 390 px and 1440 px and the hero height in `specs/008-recruiter-scan-refinement/verification.md` (SC-002 baseline).
- [X] T003 Copy `specs/007-lab-companion-motion/verification/run-browser-checks.mjs` to `specs/008-recruiter-scan-refinement/verification/run-browser-checks.mjs` (output paths resolve to its own folder); change nothing else yet.

## Phase 2: Foundational (data fields used by several stories)

- [X] T004 Add required `layout: "featured" | "compact"` to `Project` in `src/content/projects.ts`; set `hrms-backend` and `meridian-assistant` → `"featured"`, `notification-platform`, `resume-analyzer`, and draft `user-management-api` → `"compact"` (data-model.md).
- [X] T005 [P] Set `profile.intro` in `src/content/profile.ts` to exactly "I build backend systems with Node.js, NestJS, and PostgreSQL, and AI features using retrieval and tool calling." with a comment citing `about[1]` (feature 004 owner-confirmed); keep `headline`.
- [X] T006 [P] Add optional `initial?: boolean` to `LabTopic` in `src/lib/lab-knowledge.ts` and set it `true` for exactly `projects`, `experience`, `skills`, `contact`.

## Phase 3: User Story 1 — Hero (P1) 🎯 MVP

**Goal**: two-column hero, primary/secondary actions, compact summary with "Explore architecture", mobile selectors, shorter hero.
**Independent test**: spec US1 acceptance scenarios 1–5.

- [X] T007 [US1] In `src/components/layout/SystemsLab.tsx`: remove `.lab-headline` and the `.lab-focus` aside; actions become `a.lab-button-primary[href="#work"]` "View selected work", résumé `a[download]` "Resume PDF" (only when `hasResume()`), and `AskLabButton` (secondary); keep the `noscript` flow list and letters entrance.
- [X] T008 [US1] In `src/components/lab/ProjectConstellation.tsx`: replace the always-open panel with a summary section `#architecture-panel` (name, summary, `details.lab-architecture` > `summary` "Explore architecture" containing the explanatory label, flow, branch, and trace button; `a.lab-panel-link` outside); mirror `open` in state (`architectureOpen`, starts false, kept on selection, set true by trace; selection resets trace); keep live-region messages and Probe events.
- [X] T009 [US1] Styles in `src/app/globals.css` (new "008" block; remove `.lab-focus*` and `.lab-headline` rules): hero grid — intro | stage at ≥ 68rem with map above summary; at 46–68rem intro full width, map and summary side by side; below 46rem the four nodes as a two-column grid of compact toggle buttons ≥ 44 px with the ✓ selected shape; compact orbit size; disclosure summary styled as a button with visible focus and an open/closed indicator.
- [X] T010 [US1] Move `focusStatements` into `src/components/profile/AboutSection.tsx` as a "Current focus" list (FR-006), styled in the 008 block.

## Phase 4: User Story 2 — Project presentation (P1)

**Goal**: "Built to solve real problems"; problem / does / contribution cards; featured vs compact.
**Independent test**: spec US2 scenarios 1–4; card text equals records.

- [X] T011 [US2] `src/components/work/SelectedWork.tsx`: heading "Built to solve real problems", intro "What each project solves, what it does, and what I built. Each case study goes deeper, including the parts that are unfinished."; Probe tip text updated to match; eyebrow numbering "02 / Selected work"; use a single reveal style.
- [X] T012 [US2] `src/components/work/ProjectStory.tsx`: remove `Tilt`; add `project-story-${project.layout}` class; render `dl.story-facts` with `dt`/`dd` "The problem" (`caseStudy.problem[0].text`), "What it does" (`summary`), "My contribution" (every `caseStudy.contribution` text as `p`), then stack, `ProjectPreview`, evidence note, case-study link (contract).
- [X] T013 [US2] Delete `src/components/motion/Tilt.tsx` and its `.tilt` CSS; card layout CSS in the 008 block: `.project-stories` two columns at ≥ 60rem, featured spans both (copy | diagram), compact one column each (diagram below); quiet evidence footer; prose ≤ 65ch.

## Phase 5: User Story 3 — Unified contact (P2)

**Goal**: one `#contact` with links and form; `#message` kept.
**Independent test**: spec US3 scenarios 1–3.

- [X] T014 [US3] Rewrite `src/components/profile/ContactSection.tsx`: eyebrow "06 / Contact", `h2#contact-title` "Get in touch", short intro; column 1 direct links (email address, `CopyEmailButton`, LinkedIn, GitHub, `ResumeLink`); column 2 `div#message[tabIndex=-1]` with `h3` "Send a message", text "Compose email opens your own email app with the message ready to send. This site doesn't store or send anything.", and `MessageForm`.
- [X] T015 [US3] Delete `src/components/profile/MessageSection.tsx`; remove it from `src/app/page.tsx`; update contact styles in the 008 block (two columns ≥ 52rem).

## Phase 6: User Story 4 — Motion (P2)

**Goal**: no timed roaming; fewer decorative effects; pause and reduced motion intact.
**Independent test**: spec US4 scenarios 1–4; SC-005.

- [X] T016 [US4] `src/components/lab/LabProbe.tsx`: remove `scheduleRoam`, `pickRoam`, `clear`, `roamSpot`, `roamRef`, `ROAM_SELECTOR`, `BUSY`; `goal()` = target spot ?? dock; parked = target ? perched : docked; section tips only for sections entering view after the first scroll (sections intersecting before any scroll are skipped for this page); update the header comment.
- [X] T017 [P] [US4] `src/components/motion/AmbientBackground.tsx`: three signals, no `.ambient-scan`; remove `.ambient-scan` CSS in `src/app/globals.css`.
- [X] T018 [P] [US4] `src/components/lab/Reveal.tsx`: drop the `variant` prop (single "up" style); update callers `src/components/profile/AboutSection.tsx` (clip), `src/components/profile/SkillsSection.tsx` (scale), `src/components/work/SelectedWork.tsx` (left/right) — `MessageSection.tsx` is deleted by T015 — and remove the `[data-variant]` CSS.

## Phase 7: User Story 5 — Ask the lab (P3)

- [X] T019 [US5] `src/components/lab/AskLab.tsx`: show topics with `initial`; `button.ask-lab-more[aria-expanded][aria-controls="ask-lab-more"]` "More questions" / "Fewer questions" reveals the rest in `#ask-lab-more`; keep note, links, focus, Escape, Enter.
- [X] T020 [US5] Dialog room in the 008 CSS block: wider dialog on large screens (≈ 46rem), taller log (min ≈ 16rem, max ≈ 55vh), more padding/gap between entries, roomier input row.

## Phase 8: Polish, documentation, and verification

- [X] T021 Hierarchy pass in the 008 CSS block: consistent section padding, prose max widths, heading spacing (FR-017); confirm experience/skills/about content untouched (`git diff` on their content files is empty) (FR-018).
- [X] T022 [P] Update `docs/design-direction.md` (composition, motion, responsive) and add a 2026-10-26 status line for 008 in `docs/roadmap.md` (FR-024).
- [X] T023 `npm run lint`, `npm run typecheck`, `npm run build` (`SITE_URL=https://portfolio.example`); record exit codes and route list.
- [X] T024 Adapt `specs/008-recruiter-scan-refinement/verification/run-browser-checks.mjs` only where behaviour changed (hero actions, disclosure before trace, mobile selectors, Probe idle/no-roam, four suggestions + more, merged contact, intro assertions); add checks: card text equals records (SC-003), `#contact`/`#message` single and nested (SC-007), idle 30 s no Probe move (SC-005), `#work` top at 390 px (SC-002); run against `next start -p 3100`; record results.
- [X] T025 Run `check-metadata.mjs`, `check-served-output.mjs`, `check-evidence-ids.mjs` (005) and `check-lab-knowledge.mjs` (007) against the build; record.
- [X] T026 Screenshots: full-page `/` at 1440 and 390 after scrolling every section, plus 768; hero with architecture expanded; mobile menu; Ask the lab; save in `verification/` and inspect.
- [X] T027 Lighthouse mobile (and desktop) for `/` and `/work` on the production server; record scores, environment, and limits.
- [X] T028 Reconcile FR-001–FR-024 and SC-001–SC-007 in `specs/008-recruiter-scan-refinement/verification.md`; list owner-only items (acceptance, version, commit) as open.

## Dependencies & Execution Order

- Phase 1 → Phase 2 → stories. US1 and US2 depend on T004/T005; US5 on T006. US3 and US4 are
  independent of each other and of US1/US2 (different files), except all share `globals.css`
  (edit sequentially). Phase 8 after all stories.
- Parallel: T005/T006; T017/T018; T022 alongside verification.

## Implementation Strategy

MVP = Phase 1–3 (hero). Then US2 (projects), US3, US4, US5, then a single verification pass,
because the browser suite covers the whole site.

## Phase 9: Convergence

- [X] T029 Correct the stale roaming comments in `src/components/lab/LabProbe.tsx` (event list "null selector = roam"; physics-loop wake list "a new roaming spot") per FR-013 (partial)

## Phase 10: Revision 1 — restrained tilt and occasional wandering (owner, 2026-10-26)

**Goal**: replace "no card tilt" and "no timed roaming" with the restrained behaviours in spec FR-013, FR-025, SC-005, SC-008; all other 008 work unchanged.

- [X] T030 [US4] Restore `src/components/motion/Tilt.tsx` (from `b6bcb35`) and restrain it: act only for `pointerType` mouse/pen while `(hover: hover) and (pointer: fine)` matches and motion is active; clamp `--tilt-x`/`--tilt-y` to ±2deg; drop `--card-spot-*`; clear variables and `data-tilting` on leave and when motion stops; accept a `className`.
- [X] T031 [US4] Wrap the card in `src/components/work/ProjectStory.tsx` with `<Tilt className="project-tilt project-tilt-{layout}">`; move grid placement in the 008 CSS block of `src/app/globals.css` from the article to the wrapper (`.project-stories > .project-tilt-featured` spans both columns; `.project-slot > .project-tilt` and `.project-tilt > .project-story` flex to fill).
- [X] T032 [US4] Tilt CSS in the 008 block: inside `@media (prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)`, `.project-tilt > .project-story` transitions transform over ≈ 600 ms (gentle return) alongside the existing border/shadow transitions; `:root:not([data-motion="paused"]) .project-tilt[data-tilting] > .project-story` uses `perspective(1600px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))` with ≈ 240 ms follow; no scale, no spotlight; `:focus-within` styling unchanged.
- [X] T033 [US4] `src/components/lab/LabProbe.tsx`: occasional wandering per FR-013 — rest timer (first trip 12–16 s after settling, then 18–30 s), candidates `main h2` and `.project-story h2, .project-story h3` with a free "text" spot whose five sample points hit nothing busy (text, links, form controls, buttons, `summary`, diagrams, the map, the dialog); guards for typing (text field focused or key in the last 5 s), drag, attended target in view or selection/trace in the last 15 s, dozing, hidden tab; wander speed cap 200 px/s (reactions 450 px/s); a wander spot leaving the viewport clears the wander and docks; mark `data-wander="true"` while perched on a wander spot; keep section tips, selection, trace, drag, blink, click-to-open; update the header comment.
- [X] T034 [P] [US4] Update `docs/design-direction.md` "Calmer motion (feature 008)" for Revision 1.
- [X] T035 `npm run lint`, `npm run typecheck`, `npm run build` (`SITE_URL=https://portfolio.example`); record.
- [X] T036 Browser suite `specs/008-recruiter-scan-refinement/verification/run-browser-checks.mjs`: rewrite the `probe` idle part for SC-005 (45 s with light pointer activity: 1–2 trips, ≥ 18 s rest, ≤ 210 px/s while wandering, safe landing inside viewport; 0 trips while typing 30 s and while a traced step is in view 20 s; docked on touch, reduced motion, paused; 0 page animation frames in 3 s with the tab reported hidden) and add `cardTilt` for SC-008 (mouse ≤ 2°, return within 1 s, touch 0, reduced motion 0, paused 0, keyboard focus 0 with glow); run the full suite; record.
- [X] T037 Desktop/mobile screenshots of a tilted card and a wandering Probe; Lighthouse mobile/desktop for `/`; update `specs/008-recruiter-scan-refinement/verification.md` (Revision 1 section and reconciliation rows for FR-013, FR-014, FR-025, SC-005, SC-008).

