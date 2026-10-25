---

description: "Implementation tasks for portfolio foundation v0.1.0"
---

# Tasks: Portfolio Foundation

**Input**: Design documents in `specs/001-portfolio-foundation/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [UI contract](contracts/ui.md), [quickstart.md](quickstart.md)

**Tests**: No test suite is required by the spec. Tasks below require meaningful command
and browser verification, recorded with actual outcomes. Do not mark checks passed until run.

**Organization**: Setup and shared foundations precede the three priority-ordered user
stories. Public release remains gated by confirmation of provisional professional copy.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on another incomplete task in the same phase
- **[US1]–[US3]**: Maps to the corresponding user story in [spec.md](spec.md)
- Every task names the file it creates, updates, or uses to record verification

## Path Conventions

- Single application at the repository root; source under `src/`
- Existing `.specify/`, `.agents/`, `docs/`, `specs/`, `AGENTS.md`, and `.gitignore`
  must be preserved during scaffolding
- Verification notes belong in `specs/001-portfolio-foundation/verification.md`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the application toolchain without overwriting existing project files.

- [x] T001 Create the initial Next.js App Router manifest in `package.json` and record the planned dependency versions from `research.md`, without finalizing project scripts; scaffold into this repository while preserving `.specify/`, `.agents/`, `docs/`, `specs/`, `AGENTS.md`, and `.gitignore` (FR-002).
- [x] T002 Install the exact planned dependencies from `research.md` with npm and commit the resulting `package-lock.json`; record any necessary compatible pin change in `specs/001-portfolio-foundation/research.md` (FR-002).
- [x] T003 Configure strict TypeScript and Tailwind's PostCSS plugin in `tsconfig.json` and `postcss.config.mjs` (FR-004, FR-009).
- [x] T004 Configure the ESLint CLI in `eslint.config.mjs`, define or finalize the `dev`, `build`, `lint`, and `typecheck` scripts in `package.json`, and verify they work with the selected toolchain (FR-002, FR-009).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Provide the shared visual and document shell before story work.

- [x] T005 Define semantic canvas `#F5F2EB`, ink `#17212B`, copper `#B44E30`, surface, diagram teal `#176B62`, focus, and typography tokens in `src/app/globals.css`; include readable defaults and visible focus styling (FR-004, FR-007, FR-010).
- [x] T006 Create the server-rendered document shell in `src/app/layout.tsx`, loading Manrope headings and Source Sans 3 body with system fallbacks and font swap; keep metadata factual and avoid unsupported public claims (FR-001, FR-004, FR-011).

**Checkpoint**: The shared shell is ready; each user story can be built and checked as a slice.

---

## Phase 3: User Story 1 - Understand the portfolio immediately (Priority: P1) 🎯 MVP

**Goal**: Show identity and backend/AI focus on first load in an editorial responsive hero.

**Independent Test**: Open `/` at 390 and 1440 pixel widths without interaction or
JavaScript; name, role, and headline are present in initial content, readable, and unclipped.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create the typed single source of profile name, role, headline, and concise intro in `src/content/profile.ts`; mark role/headline provisional in internal comments and invent no personal achievements (FR-001, FR-011).
- [x] T008 [US1] Render the identity, role, headline, and short positioning as immediately readable text in `src/components/layout/Hero.tsx`, using only values from `src/content/profile.ts` (FR-001, FR-011).
- [x] T009 [US1] Compose the homepage hero in `src/app/page.tsx` with a clear main landmark and no blocking intro; include only a valid `/#approach` hero action once the target exists (FR-001, FR-003).
- [x] T010 [US1] Add the asymmetric desktop hero and stacked mobile reading order in `src/app/globals.css`, with bounded text width, generous space, and no horizontal overflow at 390/768/1440 pixels or 200% zoom (FR-004, FR-009, FR-010).
- [x] T011 [US1] Record the first-view and no-JavaScript checks for name, role, headline, reading order, and overflow in `specs/001-portfolio-foundation/verification.md` against SC-001/SC-002 (FR-001, FR-009).

**Checkpoint**: US1 alone gives a readable MVP homepage without unavailable actions.

---

## Phase 4: User Story 2 - Navigate available content (Priority: P2)

**Goal**: Make Home and Approach reachable on wide and narrow screens without dead actions.

**Independent Test**: Follow every displayed action with pointer and keyboard, including
the mobile disclosure; all destinations exist and deferred destinations are absent.

### Implementation for User Story 2

- [x] T012 [P] [US2] Render the brand/Home and Approach links, and no Work, Experience, About, Contact, or résumé action, in `src/components/layout/Header.tsx` (FR-002, FR-003).
- [x] T013 [P] [US2] Build the narrow-screen native `Menu` disclosure in `src/components/layout/MobileNav.tsx`; server-render Home/Approach links so they work without JavaScript, then enhance Escape-close, link-close, and focus return (FR-002, FR-003, FR-007).
- [x] T014 [US2] Integrate `src/components/layout/Header.tsx` into `src/app/layout.tsx`, render `src/components/layout/MobileNav.tsx` from the header at narrow widths and desktop navigation links at wide widths, and use one shared Home/Approach navigation model where practical; preserve native disclosure semantics, keyboard access, visible focus and Escape-to-close behavior, ensure responsive visibility, and verify the mobile menu is reachable from the header; create a real `id="approach"` section in `src/app/page.tsx` so Home, Approach, and the hero action resolve (FR-002, FR-003).
- [x] T015 [US2] Style desktop links and the mobile disclosure in `src/app/globals.css`; keep summary state, focus, and link targets clear at 390/768/1440 pixels and 200% zoom (FR-002, FR-007, FR-009).
- [x] T016 [US2] Record pointer, keyboard, Escape, Tab order, no-JavaScript navigation, and absent-action checks in `specs/001-portfolio-foundation/verification.md` against SC-003/SC-004 (FR-002, FR-003, FR-007).

**Checkpoint**: US2 navigation works independently of the optional flow interaction.

---

## Phase 5: User Story 3 - Explore an illustrative flow (Priority: P3)

**Goal**: Present a labeled, generic Input → Process → Result explanation with optional
step-through interaction and complete static content.

**Independent Test**: Read all stage responsibilities with JavaScript disabled; with
JavaScript enabled, use keyboard and pointer to trace and select stages; reduced motion
preserves the same explanation.

### Implementation for User Story 3

- [x] T017 [P] [US3] Define ordered Input, Process, and Result stage IDs, labels, and responsibilities in `src/content/flow.ts`; keep the flow generic and free of live-telemetry or project-performance claims (FR-005, FR-006, FR-011).
- [x] T018 [US3] Render the SVG/HTML diagram labeled `Illustrative flow`, its explicit not-live description, and every stage's static text in `src/components/diagrams/FlowDiagram.tsx` using `src/content/flow.ts` (FR-005, FR-006, FR-011).
- [x] T019 [US3] Add `Trace the flow`, `Next step`, and direct stage selection to `src/components/diagrams/FlowDiagram.tsx`; implement idle → Input → Process → Result → Input, textual/programmatic selected state, native keyboard activation, and controls that appear only when enhanced (FR-006, FR-007).
- [x] T020 [US3] Style flow nodes, focus, selected state, and short CSS transitions in `src/app/globals.css`; make state changes immediate under reduced motion and preserve full text at narrow widths (FR-007, FR-008, FR-009).
- [x] T021 [US3] Place `src/components/diagrams/FlowDiagram.tsx` in the existing Approach section of `src/app/page.tsx`, with labels and static explanation readable in source order (FR-005, FR-006).
- [x] T022 [US3] Record static/no-JavaScript, keyboard, stage order, selected-state, and reduced-motion results in `specs/001-portfolio-foundation/verification.md` against SC-004/SC-005 (FR-005, FR-006, FR-007, FR-008).

**Checkpoint**: The diagram adds exploration without hiding essential information.

---

## Phase 6: Polish & Cross-Cutting Verification

**Purpose**: Check the complete v0.1.0 experience and preserve truthful release status.

- [x] T023 Run `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run build` from `package.json`; record exact commands, environment, results, and failures in `specs/001-portfolio-foundation/verification.md` (FR-002, FR-009).
- [ ] T024 Inspect rendered layout at 390, 768, and 1440 pixels and 200% zoom, including real contrast and the forbidden delin.dev motifs; record findings and screenshots/notes in `specs/001-portfolio-foundation/verification.md` against SC-001/SC-002/SC-006 (FR-004, FR-009, FR-010).
- [ ] T025 Follow `specs/001-portfolio-foundation/quickstart.md` for all visible links, keyboard focus, mobile menu, flow stages, reduced motion, and JavaScript-disabled content; record outcomes in `specs/001-portfolio-foundation/verification.md` against SC-003/SC-004/SC-005 (FR-003, FR-006, FR-007, FR-008).
- [x] T026 Review public copy and assets in `src/content/profile.ts`, `src/content/flow.ts`, and `src/app/layout.tsx` against `docs/project-evidence.md`; record owner confirmation of provisional role/headline or an explicit open public-release gate in `specs/001-portfolio-foundation/verification.md` (FR-011).
- [x] T027 Reconcile every FR-001–FR-011 and SC-001–SC-006 result with `specs/001-portfolio-foundation/spec.md` in `specs/001-portfolio-foundation/verification.md`; leave failures open and do not claim release, tag, or deployment (FR-001–FR-011).

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 setup precedes Phase 2 shared shell and styling.
- Phase 2 blocks all story phases.
- Phase 3 supplies the homepage; Phase 4 adds its live destinations; Phase 5 fills the
  Approach section with the diagram. Each has its independent checkpoint above.
- Phase 6 follows the desired complete v0.1.0 slice. Release approval is separate.

### User Story Dependencies

- **US1 (P1)**: Can be checked after Phase 2 as a first-view MVP. T009 must avoid a hero
  link until the Approach target exists in T014.
- **US2 (P2)**: Can build Header and MobileNav after Phase 2; integration uses the page
  established by US1. Its navigation can be verified before diagram interaction exists.
- **US3 (P3)**: Stage data and diagram can be built after Phase 2; final page placement
  uses the Approach section from US2. Static text works without the optional controls.

### Within Each User Story

- US1: profile record → hero → page composition → responsive treatment → independent check.
- US2: Header and MobileNav → layout/target integration → styling → independent check.
- US3: flow data → static diagram → optional controls → styling/integration → check.

### Parallel Opportunities

- T007 (profile), T012 (Header), T013 (MobileNav), and T017 (flow data) touch separate
  files after the shared foundation. T012 and T013 can proceed together, then T014
  integrates them. Do not edit `src/app/layout.tsx`, `src/app/page.tsx`, or
  `src/app/globals.css` concurrently across stories.

---

## Parallel Example: User Story 1

```text
Task: T007 [US1] Create the typed profile in src/content/profile.ts
Task: T012 [US2] Draft available Header links in src/components/layout/Header.tsx
```

## Parallel Example: User Story 2

```text
Task: T012 [US2] Create Header.tsx desktop navigation
Task: T013 [US2] Create MobileNav.tsx native disclosure
```

## Parallel Example: User Story 3

```text
Task: T017 [US3] Define stage data in src/content/flow.ts
Task: T007 [US1] Define profile data in src/content/profile.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete setup and shared foundation.
2. Complete US1 with no action to an unavailable destination.
3. Check the first-view and no-JavaScript outcome independently.

### Incremental Delivery

1. Add US2 and check every displayed destination.
2. Add US3 and check the static explanation before optional stepping.
3. Run Phase 6 against the complete spec and quickstart. Keep the public-release gate
   open until the provisional professional copy is confirmed.

## Notes

- Exact dependency pins are planned in `research.md`; verify actual resolution and
  commit the npm lockfile during implementation.
- A failed check stays open until fixed or the specification is explicitly revised.
- The task list does not authorize deployment, publication, or a release tag.
