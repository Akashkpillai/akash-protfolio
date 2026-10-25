---

description: "Implementation tasks for engineering case studies v0.2.0"
---

# Tasks: Engineering Case Studies

**Input**: Design documents in `specs/002-engineering-case-studies/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [UI contract](contracts/ui.md), [quickstart.md](quickstart.md)

**Tests**: No test suite is required by the spec. Tasks require meaningful command, HTTP,
browser, and claim-to-evidence verification, recorded with actual outcomes in
`specs/002-engineering-case-studies/verification.md`. Do not mark a check passed until it
has run.

**Organization**: Setup and the evidence-first source review precede the user stories.
Stories run in priority order: US1 (P1), US4 (P1), US2 (P2), US3 (P3). Publication stays
gated by the owner's review of `docs/project-evidence.md`. Per the 2026-10-25
clarifications, decision/tradeoff reasons appear only when owner-confirmed in the register,
and no `CHANGELOG.md` is created here: v0.2.0 is not recorded as an accepted release until
feature 003.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on another incomplete task in the same phase
- **[US1]–[US4]**: Maps to the corresponding user story in [spec.md](spec.md)
- Every task names the file it creates, updates, or uses to record verification

## Path Conventions

- Single Next.js App Router application at the repository root; source under `src/`
- `src/components/diagrams/FlowDiagram.tsx` and `src/content/flow.ts` are not modified (FR-018)
- Existing rules in `src/app/globals.css` are not edited; new rules are appended using existing tokens
- Every new page renders `<main id="main-content" tabIndex={-1}>` so the existing skip link in `src/components/layout/Header.tsx` resolves
- Repository clones live only in fresh, empty directories in the session scratchpad; never executed, installed, or copied into this repository
- Verification notes belong in `specs/002-engineering-case-studies/verification.md`; browser tooling in `specs/002-engineering-case-studies/verification/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the working context and a clean v0.1.0 baseline before any change.

- [X] T001 Verify root `C:\Users\HP\Desktop\akash-portfolio`, actual Git branch `feat/002-engineering-case-studies`, `git status`, unset `SPECIFY_INIT_DIR`/`SPECIFY_FEATURE_DIRECTORY`/`SPECIFY_FEATURE`, and `.specify/feature.json` → `specs/002-engineering-case-studies`; create `specs/002-engineering-case-studies/verification.md` with these results and the Node.js/npm versions actually in use.
- [X] T002 Run `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run build` on the unchanged baseline and record exact commands and outcomes as the pre-change baseline in `specs/002-engineering-case-studies/verification.md`; confirm `package.json` dependencies are unchanged and no new dependency is planned (plan: no additions).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Evidence-first source review, the typed content model, and route-safe navigation.
No case-study copy may be written until T003–T006 are complete.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Source review (FR-002, FR-014, SC-003)

- [X] T003 Review `https://github.com/Akashkpillai/resume-analyzer` read-only: `git clone --depth 1` into a fresh, empty scratchpad directory, record `git rev-parse HEAD`, read `backend/src/resume/resume-parser.service.ts`, `backend/src/resume/resume.service.ts`, the Prisma schema, the auth module, and the frontend pages; update the Resume Analyzer section of `docs/project-evidence.md` with reviewer (Claude), review date, reviewed commit SHA, evidence paths, a claim-ID table (`RA-01`…) mapping each ID to file paths and a short statement, README/code discrepancies (README says TypeORM, service uses Prisma), owner contribution confirmation (2026-10-25), limitations (including that the AI prompt receives the first 4,000 characters and fallback extraction is basic), asset provenance "none in v0.2.0", and demo check "none in v0.2.0" (deployment remains unverified). Record observable design choices (what the code chose and its visible effect) as claim IDs, without motives. Drop or relabel per FR-013 any guide claim the code does not support.
- [X] T004 Review `https://github.com/Akashkpillai/notificationservice` (never `notification_service`) read-only the same way: record `HEAD`, read `apps/notification-services/src/notification-router.service.ts`, the email/SMS/push service implementations, shared Kafka topics/contracts, and the Prisma schema; update the Notification Platform section of `docs/project-evidence.md` with reviewer, date, commit SHA, evidence paths, claim-ID table (`NP-01`…), discrepancies, contribution confirmation, limitations (push delivery unfinished; retry/dead-letter paths are implemented code paths, not exercised end to end; no exactly-once, production-reliability, or working FCM/APNs claim), the actual retry/dead-letter threshold as read from source, the gateway/broker/router/worker/database components for the diagram, observable design choices as claim IDs without motives, asset provenance "none", and demo check "none".
- [X] T005 Review `https://github.com/Akashkpillai/user-management-with-prisma` read-only the same way: record `HEAD`, read the auth/authorization guards, role decorator, user/country/state/city modules, Prisma schema, and Compodoc output; update the User Management API section of `docs/project-evidence.md` with reviewer, date, commit SHA, evidence paths, claim-ID table (`UM-01`…), discrepancies, contribution confirmation, limitations (README largely Nest starter material; no independently verified security or scalability guarantees), entity fields and relations for the data-model diagram, observable design choices as claim IDs without motives, asset provenance "none", and demo check "none".
- [X] T006 Update the provenance header and "Publication record" notes in `docs/project-evidence.md` to state that the three repositories were reviewed at the recorded commits on the review date, that Meridian remains draft with no record, and that owner review of the register is pending (v0.2.0 acceptance gate); add to each project section an empty "Owner-confirmed rationale" table (ID such as `RA-R01`, decision claim ID it explains, reason as confirmed by the owner, confirmation date) to be filled only from owner input; delete the scratchpad clones and record the review summary (commits, files read, claims dropped or relabeled) in `specs/002-engineering-case-studies/verification.md` (FR-006, SC-003).

### Content model and navigation

- [X] T007 Create `src/content/projects.ts` with the types from `data-model.md`: `Project` (`slug: "resume-analyzer" | "notification-platform" | "user-management-api"` — "Unique, lowercase; matches the route"; `order: 1 | 2 | 3` — "Curated order; shown as `01`–`03`"; `status: "draft" | "published"`; `title`; `summary` — "One line; no model names or metrics"; `stack: string[]` — "Only stack items in the evidence register"; `repositoryUrl` — "Must equal the register URL for that project"; `demo?: { url; checkedOn; flowChecked }` — "`undefined` for all three in v0.2.0"; `preview: { kind: "pipeline" | "architecture" | "data-model"; caption }` — "Kinds must all differ; caption labels it explanatory"; `caseStudy: CaseStudy`), `CaseStudy`, `Claim` (`status?: "implemented-code-path" | "unfinished" | "illustrative"`, `evidence: string[]` — "required unless the claim is the owner's contribution statement"), `ArchitectureExplanation` (`kind`, `interactive`, `summary`, `components`, `links: { from; to; label; status? }[]`); a decision/tradeoff claim that states a reason must cite an owner-confirmed rationale ID (e.g. `RA-R01`) in `evidence`, and `DiagramComponent` (`id`, `name`, `responsibility`, `status?`, `evidence[]`); export a `claimStatusLabels` map ("Implemented code path", "Unfinished", "Illustrative"), the `publishedProjects` selector (filtered by `status === "published"`, sorted by `order`), and `getPublishedProject(slug)`; import the three case-study records once they exist and add no Meridian record (FR-001, FR-008).
- [X] T008 [P] Change `src/content/navigation.ts` hrefs to route-absolute `/` (Home) and `/#approach` (Approach) without adding Work yet, and change the brand `href` from `#home` to `/` in `src/components/layout/Header.tsx`; confirm `src/components/layout/MobileNav.tsx` still tolerates the new hrefs and a missing hash target (FR-015, SC-004).
- [X] T009 [P] Create `src/components/work/ClaimStatus.tsx` (Server Component rendering the visible text label from `claimStatusLabels`, nothing for `undefined`) and `src/components/work/ClaimList.tsx` (renders a `Claim[]` as a plain list with each claim's `ClaimStatus` next to its text; never renders `evidence`), so status is readable without JavaScript or color (FR-013).
- [X] T010 Append base styles for claim lists and status labels to `src/app/globals.css` using existing tokens only; labels distinguishable by text and shape, not color alone (FR-013, FR-017).

**Checkpoint**: Evidence register updated at pinned commits; typed model, selectors, and route-safe navigation ready.

---

## Phase 3: User Story 1 - Read a case study directly (Priority: P1) 🎯 MVP

**Goal**: Each of the three case studies loads directly with all nine sections, its static
architecture explanation, stack, and verified source link, with and without JavaScript.

**Decisions and tradeoffs rule (FR-006)**: In T011–T013, each decision or tradeoff states
what the reviewed code chose and its observable effect, citing a source claim ID. A reason
or motive is written only when an owner-confirmed rationale ID exists in the register;
otherwise it is left out of the content file entirely — never as visible placeholder text.

**Independent Test**: Request `/work/resume-analyzer`, `/work/notification-platform`, and
`/work/user-management-api` directly in a fresh session with JavaScript enabled and disabled;
all nine sections, the diagram text list, status labels, and source link are present, and
the page links back to `/work` and the other case studies.

### Implementation for User Story 1

- [X] T011 [P] [US1] Write `src/content/case-studies/resume-analyzer.ts` from `RA-` claim IDs only: problem, contribution (may state sole authorship), implementation (Prisma persistence, Groq AI parsing with basic fallback), `architecture` with `kind: "pipeline"`, `interactive: false`, ordered pipeline components from T003, decisions and tradeoffs per the rule above, limitations listing every recorded limitation (first 4,000 characters), and internal `discrepancies` (TypeORM vs Prisma; not rendered); no model name in summary/headline and no accuracy or hiring-outcome claims (FR-006, FR-013, FR-014).
- [X] T012 [P] [US1] Write `src/content/case-studies/notification-platform.ts` from `NP-` claim IDs only: email/SMS integration code, routing, delivery-state persistence; `architecture` with `kind: "architecture"`, `interactive: true`, components and links from T004 where push delivery has `status: "unfinished"` and retry and dead-letter components/links have `status: "implemented-code-path"`; decisions and tradeoffs per the rule above; limitations list every recorded limitation; no exactly-once, production-reliability, or working FCM/APNs claim (FR-006, FR-013, FR-014).
- [X] T013 [P] [US1] Write `src/content/case-studies/user-management-api.ts` from `UM-` claim IDs only: role guards, relational user/country/state/city modules, API documentation; `architecture` with `kind: "data-model"`, `interactive: false`, entity components whose `responsibility` lists key fields and relations from T005, and any request example using fictional data marked `illustrative`; decisions and tradeoffs per the rule above; limitations list every recorded limitation; no security or scalability guarantees (FR-006, FR-011, FR-013, FR-014).
- [X] T014 [US1] Add the three `Project` records to `src/content/projects.ts` in order Resume Analyzer (1), Notification Platform (2), User Management API (3) with `repositoryUrl` exactly `https://github.com/Akashkpillai/resume-analyzer`, `https://github.com/Akashkpillai/notificationservice`, and `https://github.com/Akashkpillai/user-management-with-prisma`; `demo: undefined`; preview kinds `pipeline`, `architecture`, `data-model` with captions labeling each an explanatory diagram, not a screenshot; stack items only from the register; set `status: "published"` only after T003–T006 filled every FR-002 field (owner review remains the T041 gate) (FR-001–FR-003, FR-010, FR-011, FR-014).
- [X] T015 [P] [US1] Create server-rendered `src/components/diagrams/PipelineDiagram.tsx`: visible title, caption stating it explains the reviewed source and is not a live view, SVG with `role="img"` plus `<title>`/`<desc>`, and an ordered text list of every component, its responsibility, and its `ClaimStatus`, all from the `ArchitectureExplanation` data; accept a `compact` prop (used in US2) (FR-009, FR-011, FR-012).
- [X] T016 [P] [US1] Create server-rendered `src/components/diagrams/DataModelDiagram.tsx` with the same title/caption/SVG/text-list contract, listing each entity's key fields and relations; accept a `compact` prop (FR-009, FR-011, FR-012).
- [X] T017 [P] [US1] Create `src/components/diagrams/ArchitectureDiagram.tsx` with `"use client"`, rendering the same title/caption/SVG/ordered component list from data in its initial (server) render, with no selection controls yet; draw push delivery with a dashed edge and an "Unfinished" label and retry/dead-letter paths with "Implemented code path"; accept a `compact` prop; do not import or modify `FlowDiagram.tsx` (FR-009, FR-012, FR-013, FR-018).
- [X] T018 [US1] Create `src/components/work/CaseStudyArticle.tsx` (Server Component) rendering, in contract order: one `h1` title and summary → stack and source link (text names the repository, e.g. "Source: notificationservice on GitHub") → `h2` sections Problem, My contribution, Implementation, Architecture (diagram chosen by `architecture.kind`), Decisions, Tradeoffs, Limitations (plain visible list, never collapsed) → links to `/work` and to the other published case studies via `publishedProjects`; no demo action; never render `discrepancies` or evidence IDs (FR-006, FR-009, FR-010, FR-013).
- [X] T019 [US1] Create `src/app/work/[slug]/page.tsx`: `generateStaticParams()` returning only `publishedProjects` slugs, `export const dynamicParams = false`, `params` typed as `Promise<{ slug: string }>`, `generateMetadata` producing title and description from the published project only, `notFound()` when `getPublishedProject` misses, and `<main id="main-content" tabIndex={-1}>` wrapping `CaseStudyArticle` (FR-005, FR-007, FR-008, FR-009).
- [X] T020 [US1] Create `src/app/work/page.tsx` with metadata, page heading, short intro, and an ordered list of `publishedProjects` showing number (`01`–`03`), title, summary, stack, and a case-study link; no previews required (FR-004, US1 scenario 3).
- [X] T021 [US1] Append case-study article, `/work` list, and full-size diagram styles to `src/app/globals.css` using existing tokens and type scale; long titles and repository names wrap; SVG may hide below the mobile breakpoint only if illegible while the text list always shows; no prohibited delin.dev motif (FR-012, FR-016, FR-017).
- [X] T022 [US1] Run `npm run lint`, `npm run typecheck`, `npm run build` (build lists `/work` and exactly three `/work/[slug]` paths), then against `npm run start` fetch each case study's raw HTML with `curl -s` and confirm all nine sections, diagram text list, status labels, and source link are present; record outcomes in `specs/002-engineering-case-studies/verification.md` against SC-001 (FR-005, FR-006, FR-009).

**Checkpoint**: Three case studies readable directly and without JavaScript; `/work` index reachable from each.

---

## Phase 4: User Story 4 - Drafts and unknown projects stay private (Priority: P1)

**Goal**: Draft and unknown `/work/` slugs return 404 with a useful page; no draft name or
slug appears on any public surface.

**Independent Test**: Request `/work/meridian`, `/work/not-a-project`, `/work/Resume-Analyzer`,
and `/work/resume-analyzer/`; inspect homepage, `/work`, page metadata, build output, and any
sitemap for `meridian` and `notification_service`.

### Implementation for User Story 4

- [X] T023 [US4] Create `src/app/not-found.tsx` inside `<main id="main-content" tabIndex={-1}>` with a heading, short explanation, and links to `/work` and `/`, reusing the Engineering Journal shell and existing tokens; append any styles to `src/app/globals.css` (FR-007, FR-015, FR-017).
- [X] T024 [US4] Confirm `src/app/layout.tsx` metadata, `src/content/projects.ts`, and all pages reference projects only through `publishedProjects`/`getPublishedProject`, that no Meridian record or name exists anywhere under `src/`, and that no `src/app/sitemap.ts` or `src/app/robots.ts` is added; record the search commands and results in `specs/002-engineering-case-studies/verification.md` (FR-001, FR-008).
- [X] T025 [US4] Temporarily set one project's `status` to `"draft"` in `src/content/projects.ts`, rebuild, and confirm its slug returns 404 and it disappears from `/work`, the case-study cross-links, and metadata; restore `status: "published"`, rebuild, and record both results in `specs/002-engineering-case-studies/verification.md` (FR-001, FR-008, data-model state transitions).
- [X] T026 [US4] Against `npm run start`, run the quickstart HTTP loop and record codes: 200 for `/`, `/work`, and the three case studies; 404 for `/work/meridian`, `/work/not-a-project`, `/work/Resume-Analyzer`; 308 for `/work/resume-analyzer/`; search `.next` build output and fetched HTML case-insensitively for `meridian` and `notification_service` (expect no matches); record in `specs/002-engineering-case-studies/verification.md` against SC-002 (FR-007, FR-008, FR-014).

**Checkpoint**: Publication safety verified independently of homepage browsing.

---

## Phase 5: User Story 2 - Browse selected work (Priority: P2)

**Goal**: Homepage `#work` shows three numbered, varied project stories with distinct preview
kinds and a "View all work" link; Work navigation reaches it from every page.

**Independent Test**: From the homepage and from `/work`, by pointer and by keyboard, open
each listed project; each reaches the matching case study within two activations, and Work in
desktop and mobile navigation reaches `/#work` from a case study.

### Implementation for User Story 2

- [X] T027 [P] [US2] Create `src/components/work/ProjectPreview.tsx` (Server Component) that selects `PipelineDiagram`, `ArchitectureDiagram`, or `DataModelDiagram` in `compact` mode by `preview.kind` and shows the project's explanatory caption; with no image, never leaves a broken or empty preview area (FR-003, FR-011).
- [X] T028 [P] [US2] Create `src/components/work/ProjectStory.tsx` rendering a numbered story (`01`–`03`) with title, one-line summary, stack, `ProjectPreview`, and a "Read the case study" link, with an alternating composition prop (preview left/right or full width) — not a uniform card grid (FR-003).
- [X] T029 [US2] Create `src/components/work/SelectedWork.tsx`: `<section id="work" tabIndex={-1}>` with eyebrow "02 / Selected work", heading, the three `ProjectStory` items from `publishedProjects` in curated order with alternating compositions, and a closing "View all work" link to `/work` (FR-003).
- [X] T030 [US2] Insert `<SelectedWork />` between `<Hero />` and the Approach section in `src/app/page.tsx` and change Approach's eyebrow from "02 / Approach" to "03 / Approach"; leave the Approach section and `FlowDiagram` otherwise unchanged (FR-003, FR-018).
- [X] T031 [US2] Add `{ label: "Work", href: "/#work" }` between Home and Approach in `src/content/navigation.ts`, and add a "View selected work" link to `/#work` in `src/components/layout/Hero.tsx` while keeping "Explore the flow" (FR-015, FR-018).
- [X] T032 [US2] Append selected-work story, alternating composition, and compact preview styles to `src/app/globals.css` with existing tokens; readable at 390/768/1440 px and 200% zoom (FR-003, FR-016, FR-017).
- [X] T033 [US2] Record pointer and keyboard checks (homepage → each case study in at most two activations; Work in desktop and mobile nav reaches `/#work` from a case study; "View all work" reaches `/work`; `/work` lists exactly the three projects in order) and a visual judgment that the three previews differ in kind in `specs/002-engineering-case-studies/verification.md` against SC-005/SC-007 (FR-003, FR-004, FR-015).

**Checkpoint**: Browsing works independently; every new link resolves.

---

## Phase 6: User Story 3 - Understand an architecture explanation (Priority: P3)

**Goal**: The Notification Platform diagram gains accessible component selection; every
diagram's static text matches the evidence register and status labels.

**Independent Test**: Read each diagram's static list, then operate Notification Platform
selection by keyboard and pointer; compare components, responsibilities, and statuses to
`docs/project-evidence.md`.

### Implementation for User Story 3

- [X] T034 [US3] Enhance `src/components/diagrams/ArchitectureDiagram.tsx` in full (non-compact) mode, following `FlowDiagram`'s pattern: `useSyncExternalStore` to enable controls after hydration; a native "Show <name>" `<button aria-pressed>` per component in the list; selection highlights the component in the SVG and list and updates a polite `aria-live` region "Selected: <name>. <responsibility>"; native Enter/Space; no hover-only content and no directional-key requirement; without JavaScript no buttons render and all text remains (FR-012, FR-009).
- [X] T035 [US3] Append selection, visible focus, and selected-state styles to `src/app/globals.css`; selected state shown by text/outline as well as color; transitions none under `prefers-reduced-motion: reduce` (FR-012, FR-016).
- [X] T036 [US3] Compare each diagram's components, responsibilities, links, and statuses in `src/content/case-studies/*.ts` against the claim IDs in `docs/project-evidence.md` (push "Unfinished"; retry/dead-letter "Implemented code path"; fictional data only) and record the diagram accuracy review in `specs/002-engineering-case-studies/verification.md` against SC-007 (FR-012, FR-013).

**Checkpoint**: All four user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Verification

**Purpose**: Verify the complete v0.2.0 slice, regressions, and the evidence gate truthfully.

- [X] T037 Create `specs/002-engineering-case-studies/verification/run-browser-checks.mjs` using `playwright-core` from a temp tools directory outside the app (as in 001; nothing added to `package.json`), covering: 390/768/1440 px and 200% zoom on `/`, `/work`, and each case study (`scrollWidth <= innerWidth`, screenshots saved to `specs/002-engineering-case-studies/verification/`); JavaScript disabled (text and diagram lists present, no selection buttons); keyboard navigation and Notification diagram `aria-pressed`/live-region updates; reduced-motion emulation; every visible link returning a non-error destination.
- [X] T038 Run `specs/002-engineering-case-studies/verification/run-browser-checks.mjs` against `npm run start`, review screenshots for clipping, contrast of new text/status-label pairings, and absence of prohibited delin.dev motifs, and record actual results in `specs/002-engineering-case-studies/verification.md` against SC-004/SC-005/SC-006 (FR-009, FR-012, FR-015–FR-017).
- [X] T039 Re-run the 001 checks from `specs/001-portfolio-foundation/quickstart.md` for the hero, mobile navigation disclosure, and illustrative flow; confirm behavior is unchanged apart from the new nav item, hero link, and section number, and record results in `specs/002-engineering-case-studies/verification.md` (FR-018).
- [X] T040 Trace every public claim in `src/content/projects.ts` and `src/content/case-studies/*.ts` to a claim ID in `docs/project-evidence.md`; confirm every stated decision/tradeoff reason cites an owner-confirmed rationale ID and remove any that do not; confirm every recorded limitation and not-yet-exercised claim carries a visible label, and that no metrics, testimonials, employment details, demo actions, screenshots, or rationale placeholders appear; record the claim-by-claim table in `specs/002-engineering-case-studies/verification.md` against SC-003 (FR-002, FR-006, FR-010, FR-011, FR-013, FR-014).
- [ ] T041 Request the owner's review of the updated `docs/project-evidence.md`, including any decision reasons the owner wants to confirm into the "Owner-confirmed rationale" tables; if reasons are added, update `src/content/case-studies/*.ts` and re-run T040; record the review outcome and date, or an explicit open publication gate, in `specs/002-engineering-case-studies/verification.md`. Do not proceed to T043 while the review is outstanding (FR-002, FR-006, constitution I).
- [X] T042 Reconcile every FR-001–FR-018 and SC-001–SC-007 result with `specs/002-engineering-case-studies/spec.md` in `specs/002-engineering-case-studies/verification.md`; leave failures open, list unrun checks as unrun, and do not weaken requirements (constitution VI).
- [ ] T043 Only after T041 records owner approval and T042 shows no open failures, record feature 002 acceptance with the tested commit and checks in `specs/002-engineering-case-studies/verification.md`, and state there that v0.2.0 is **not** an accepted release: no `CHANGELOG.md` exists (deferred to feature 003), no version is displayed in the UI, and `package.json` stays at `0.1.0` so package version and changelog do not diverge; the version bump and changelog entry are carried to feature 003. Create no `CHANGELOG.md`; no tag, push, or deployment (constitution VII; spec Assumptions).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. T003–T006 (source review) block all copy; T007 blocks all content and pages. Blocks all user stories.
- **US1 (Phase 3)**: Depends on Phase 2. Delivers the MVP.
- **US4 (Phase 4)**: Depends on US1's `[slug]` route and published records (T014, T019).
- **US2 (Phase 5)**: Depends on Phase 2 and on US1's diagrams (T015–T017) for compact previews and on case-study routes for link targets.
- **US3 (Phase 6)**: Depends on T017 (static `ArchitectureDiagram`) and T011–T013 content.
- **Polish (Phase 7)**: Depends on all user stories. T041 gates T043.

### User Story Dependencies

- **US1 (P1)**: Independent after Phase 2; includes `/work` so case studies never link to a missing page.
- **US4 (P1)**: Uses US1's route; verifiable without US2/US3.
- **US2 (P2)**: Reuses US1 diagrams in compact mode; adds Work navigation only once `#work` exists (T031 after T029–T030), avoiding a dead link.
- **US3 (P3)**: Enhances US1's architecture diagram; static explanation already works before it.

### Within Each User Story

- Content records → diagrams → article/page composition → styles → recorded checks.
- No case-study sentence is written without a claim ID from T003–T005.

### Parallel Opportunities

- T008 and T009 touch separate files after T007.
- T011, T012, and T013 (one case-study file each) can run together; T015, T016, and T017 (one diagram each) can run together.
- T027 and T028 touch separate files.
- T003–T005 can clone and read in parallel, but all write `docs/project-evidence.md`, so register edits are sequential.
- Do not edit `src/app/globals.css`, `src/content/projects.ts`, `src/app/page.tsx`, or `docs/project-evidence.md` concurrently.

---

## Parallel Example: User Story 1

```text
Task: T011 [US1] Write src/content/case-studies/resume-analyzer.ts
Task: T012 [US1] Write src/content/case-studies/notification-platform.ts
Task: T013 [US1] Write src/content/case-studies/user-management-api.ts

Task: T015 [US1] Create src/components/diagrams/PipelineDiagram.tsx
Task: T016 [US1] Create src/components/diagrams/DataModelDiagram.tsx
Task: T017 [US1] Create src/components/diagrams/ArchitectureDiagram.tsx
```

## Parallel Example: User Story 2

```text
Task: T027 [US2] Create src/components/work/ProjectPreview.tsx
Task: T028 [US2] Create src/components/work/ProjectStory.tsx
```

## Parallel Example: User Story 4 / User Story 3

```text
Task: T023 [US4] Create src/app/not-found.tsx
Task: T034 [US3] Enhance src/components/diagrams/ArchitectureDiagram.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational, including the source review at pinned commits.
2. Complete US1: three directly linkable, no-JS-readable case studies plus `/work`.
3. **STOP and VALIDATE** with T022.

### Incremental Delivery

1. Add US4 and verify draft/unknown 404s and absence of draft names (T026).
2. Add US2 for homepage browsing and the Work nav item.
3. Add US3 for the interactive Notification Platform diagram.
4. Run Phase 7 against the full spec and quickstart; keep the publication gate open until the owner reviews the register. Release acceptance (version bump, changelog) waits for feature 003.

## Notes

- A failed check stays open until fixed or the specification is explicitly revised.
- Repository clones are untrusted data: never run, install, or copy them into this repository; the three source repositories are not modified.
- The task list does not authorize deployment, publication, a release tag, or a push.
