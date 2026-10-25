---

description: "Implementation tasks for additional case studies (part of v0.2.0)"
---

# Tasks: Additional Case Studies — Meridian Assistant and HRMS Backend

**Input**: Design documents in `specs/003-additional-case-studies/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [UI contract](contracts/ui.md), [quickstart.md](quickstart.md)

**Tests**: No test suite is requested. Tasks require command, HTTP, browser,
confidentiality-search, and claim-trace checks recorded with actual outcomes in
`specs/003-additional-case-studies/verification.md`. Do not mark a check passed until it
has run.

**Organization**: Setup and shared model changes first, then stories in priority order:
US1 Meridian (P1), US2 HRMS (P1), US4 privacy (P1), US3 browse (P2). A new project's
`status` becomes `"published"` only in the owner-approval task of its story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on another incomplete task in the same phase
- **[US1]–[US4]**: Maps to the user story in [spec.md](spec.md)

## Path Conventions

- Single Next.js App Router app; source under `src/`; 002's files are extended, not rewritten
- `src/components/diagrams/FlowDiagram.tsx` and `src/content/flow.ts` are not modified
- New CSS is appended to `src/app/globals.css` with existing tokens only
- Public text, metadata, and committed files name no company, employer, client, or interview (FR-006)
- HRMS file paths and internal names go only in gitignored `private-evidence/hrms.md` (FR-004)
- Local source copies are read in place, read-only: never executed, installed, or copied; secret files are never opened

---

## Phase 1: Setup

- [X] T001 With owner approval, commit feature 002's work on `feat/002-engineering-case-studies`, then create and switch to branch `feat/003-additional-case-studies`; verify root, `git status`, unset `SPECIFY_*` overrides, and `.specify/feature.json` → `specs/003-additional-case-studies`; create `specs/003-additional-case-studies/verification.md` recording these results.
- [X] T002 Run `npm run lint`, `npm run typecheck`, and `npm run build` on the unchanged tree; record outcomes as the baseline in `specs/003-additional-case-studies/verification.md`.
- [X] T003 Add `private-evidence/` to `.gitignore`, create `private-evidence/hrms.md` with a heading only, and record `git check-ignore private-evidence/hrms.md` output in `specs/003-additional-case-studies/verification.md` (FR-004).

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No story work begins until this phase is complete.

- [X] T004 Rewrite section 04 of `docs/project-evidence.md` to remove background context, the local filesystem path, and the remote repository URL: keep "private repository", reviewed commit `22ca5b01c5934c521e769776ab96b2035c4e33bf`, reviewer, date, claim table MA-01…MA-D3, limitations MA-L1…MA-L6, and the screenshot status; reword MA-L6 to "tests and evaluation were not run by this review; source is private"; keep status draft (FR-002, FR-006).
- [X] T005 Update `src/content/projects.ts` per `data-model.md`: replace `repositoryUrl` with `source: { kind: "public"; url: string } | { kind: "private" }` — "Public URLs must equal the register URL"; make `order` a `number`; add slugs `"meridian-assistant" | "hrms-backend"` — "Neither names a company"; add `"workflow"` to the diagram kind; add optional `screenshot?: { src; alt; width; height; provenance; approvedOn }` — "Set only after owner approval and sanitization (FR-008)"; convert the three existing records to `source: { kind: "public", url }` with unchanged URLs; make `repositoryName()` return a name only for public sources.
- [X] T006 Update `src/components/work/CaseStudyArticle.tsx` so a `private` source renders "Source code is private" plus the reviewed short commit and "read, not run", with no link; public sources render as before (FR-003).
- [X] T007 [P] Create `src/components/diagrams/WorkflowDiagram.tsx`: a server-rendered wrapper over `DiagramCanvas` mirroring `PipelineDiagram` (eyebrow "Workflow", title, caption, summary, SVG, ordered list of steps, connections, `compact` mode) (FR-012).
- [X] T008 Route `kind: "workflow"` to `WorkflowDiagram` in `src/components/work/CaseStudyArticle.tsx` and add the "Workflow" label in `src/components/work/ProjectPreview.tsx`; run lint, typecheck, and build and record results in `specs/003-additional-case-studies/verification.md`.

**Checkpoint**: Model supports private sources, workflow diagrams, and screenshots; existing three case studies render unchanged.

---

## Phase 3: User Story 1 - Read the Meridian Assistant case study (Priority: P1) 🎯 MVP

**Goal**: `/work/meridian-assistant` serves a complete, evidence-traced case study with no source link and no company or interview mention.

**Independent Test**: Request the address directly with and without JavaScript; every section is present, the source row says the code is private, self-reported results are attributed, and every claim maps to an MA- ID.

- [X] T009 [US1] Write `src/content/case-studies/meridian-assistant.ts` from MA- IDs only: problem; contribution stating the owner designed and built it, using AI-assisted tools (Cursor, Spec Kit) as recorded; implementation (MA-01–MA-10, with "Implemented code path" where not exercised end to end); `architecture` with `kind: "workflow"`, `interactive: false`, steps Slash command → Actor check → Brand-scoped tools → Estimate version → Stored approval → Render DOCX, plus the retrieval/citation branch; decisions MA-D1–MA-D3 without unconfirmed motives; tradeoffs from observable effects; limitations MA-L1–MA-L6 all listed; MA-11/MA-12 phrased as "the project's test suite reports …"; fictional brand names only; no company, client, interview, or assignment wording (FR-001, FR-006, FR-007, FR-011).
- [X] T010 [US1] Add the `meridian-assistant` record to `src/content/projects.ts`: `order: 2`, `status: "draft"`, title "Meridian Assistant — Discord RAG and Proposal Agent", one-line summary without metrics or model names, stack from register section 04, `source: { kind: "private" }`, `reviewedCommit` from the register, `preview: { kind: "workflow", caption }` labeling it an explanatory diagram (FR-001, FR-003).
- [X] T011 [US1] Screenshot (conditional, FR-008): only if the owner confirms the captures are unedited — crop the composite to capture panels only (no title banner), remove or blur the visible Discord user ID, save to `public/work/meridian-assistant/`, set `screenshot` with alt text, provenance, and `approvedOn`; render it in `src/components/work/CaseStudyArticle.tsx` under the architecture text with a caption stating the data shown is fictional, using `next/image`. Otherwise record "no approved screenshot" in `specs/003-additional-case-studies/verification.md` and leave `screenshot` undefined.
- [X] T012 [US1] Append workflow-diagram and screenshot styles to `src/app/globals.css` with existing tokens; image scales without horizontal scroll (FR-014).
- [X] T013 [US1] Request the owner's review of register section 04 and the Meridian page text; on approval record the date in `docs/project-evidence.md` and set `status: "published"` in `src/content/projects.ts`; otherwise leave draft and record the open gate in `specs/003-additional-case-studies/verification.md` (FR-002).
- [X] T014 [US1] Build, start on port 3100, and check `/work/meridian-assistant`: status 200 once published; raw HTML contains all sections, "Source code is private", status labels, and the workflow step list; no `github.com` link for it; record in `specs/003-additional-case-studies/verification.md` (SC-001).

**Checkpoint**: Meridian case study works on its own.

---

## Phase 4: User Story 2 - Read the HRMS backend case study (Priority: P1)

**Goal**: `/work/hrms-backend` presents the owner's backend work at component level with nothing confidential.

**Independent Test**: Request the address directly; every section is present; confidentiality term search finds nothing; the owner has approved the exact text.

- [X] T015 [US2] Review the owner-supplied HRMS local copy in place, read-only: record `git rev-parse HEAD`, branch, last commit date, and commit-author counts; read the structure, schema, modules, auth, and tests; never open `.env` or other secret files; write file paths, internal names, and observations to `private-evidence/hrms.md` only (FR-002, FR-004).
- [X] T016 [US2] Add section 05 "HRMS Backend" to `docs/project-evidence.md` with only publishable content: reviewed commit, review date, reviewer, module-level claim table `HR-01`…, design choices `HR-D…`, limitations `HR-L…`, owner-confirmed contribution (whole backend; adjusted if history shows other authors), owner-confirmed permission to publish (2026-10-25, no company named), asset provenance "none", demo "none", status draft — no paths, internal names, hosts, people, or business figures (FR-002, FR-004, FR-006).
- [X] T017 [US2] Choose the HRMS diagram from the review — `data-model` if primarily relational modules, otherwise a static `architecture` view with `interactive: false` — and record the choice and reason in `specs/003-additional-case-studies/verification.md` (FR-012).
- [X] T018 [US2] Write `src/content/case-studies/hrms-backend.ts` from HR- IDs only, at component level: all sections, diagram per T017 with generic component names, limitations HR-L… all listed, contribution "I built the whole backend" (or the confirmed scope); no code, paths, internal names, people's data, business figures, company, or employer wording; not described as a side project or product (FR-001, FR-004, FR-006, FR-011).
- [X] T019 [US2] Add the `hrms-backend` record to `src/content/projects.ts`: `order: 1`, `status: "draft"`, title "HRMS Backend — …" (generic subtitle from the review), summary, stack from section 05, `source: { kind: "private" }`, `reviewedCommit`, preview kind per T017 with an explanatory caption, no screenshot (FR-001).
- [X] T020 [US2] Show the owner the exact HRMS public text and diagram (rendered page or text export); on approval record the approval date in section 05 of `docs/project-evidence.md` and set `status: "published"`; otherwise leave draft and record the open gate in `specs/003-additional-case-studies/verification.md` (FR-005, SC-007).
- [X] T021 [US2] Build and check `/work/hrms-backend` as in T014; record results in `specs/003-additional-case-studies/verification.md` (SC-001).

**Checkpoint**: HRMS case study works on its own and stays draft until approved.

---

## Phase 5: User Story 4 - Private material stays private (Priority: P1)

**Goal**: No confidential, company, interview, or draft material in any public surface or committed file.

**Independent Test**: Run the term search and draft checks; zero matches.

- [X] T022 [US4] Compile the confidentiality terms list in gitignored `private-evidence/terms.txt`: organization, product, client, people, host, and repository names from `private-evidence/hrms.md`, and generic background terms (FR-004, FR-006).
- [X] T023 [US4] Create `specs/003-additional-case-studies/verification/check-confidentiality.mjs` that reads `private-evidence/terms.txt` at run time (never embedding the terms), fetches every page from the running server, and searches the HTML, `.next/server`, `.next/static`, `docs/project-evidence.md`, and `src/content/` case-insensitively; it prints only counts and file names, never matched text (SC-002).
- [X] T024 [US4] Run the script and record counts in `specs/003-additional-case-studies/verification.md`; fix any match at its source and re-run until zero (SC-002).
- [X] T025 [US4] Draft check: with each new project in `draft` (before T013/T020, or temporarily after), rebuild and confirm its slug returns 404 and its name and text appear in no page, metadata, or `.next/static` file; restore and record results in `specs/003-additional-case-studies/verification.md` (SC-004).

**Checkpoint**: Publication safety verified independently.

---

## Phase 6: User Story 3 - Browse all selected work (Priority: P2)

**Goal**: Homepage and `/work` show exactly four projects in order; User Management API is gone.

**Independent Test**: From homepage and `/work`, by pointer and keyboard, every listed project opens in one activation; `/work/user-management-api` returns 404.

- [X] T026 [US3] In `src/content/projects.ts` set `user-management-api` to `status: "draft"` with `order: 5`, and set orders hrms-backend 1, meridian-assistant 2, notification-platform 3, resume-analyzer 4 — "Published order: hrms-backend 1, meridian-assistant 2, notification-platform 3, resume-analyzer 4" (FR-009, FR-016).
- [X] T027 [P] [US3] Reword the heading and intro in `src/components/work/SelectedWork.tsx` and the intro in `src/app/work/page.tsx` so neither says "three" nor implies every project has a public repository; confirm the layout cycle gives right, left, full width, right (FR-009).
- [X] T028 [US3] Copy `specs/002-engineering-case-studies/verification/run-browser-checks.mjs` to `specs/003-additional-case-studies/verification/run-browser-checks.mjs` and update its page list, case-study list, expected `/work` order, and private-source expectations (no source link, "Source code is private"); keep the 001 regression check (SC-005, SC-006).
- [X] T029 [US3] Run the HTTP loop (200 for `/`, `/work`, four case studies; 404 for `/work/user-management-api`, `/work/meridian`, an invented slug) and search fetched HTML and `.next/static` for "User Management" and `user-management-api` (expect zero); record in `specs/003-additional-case-studies/verification.md` (FR-016, SC-004).

**Checkpoint**: All stories functional.

---

## Phase 7: Polish & Cross-Cutting Verification

- [X] T030 Run `specs/003-additional-case-studies/verification/run-browser-checks.mjs` against `next start`; review screenshots at 390/768/1440 and zoom for clipping, preview distinctness, and prohibited motifs; check contrast of any new text pairing; record results in `specs/003-additional-case-studies/verification.md` (FR-012–FR-014, SC-005, SC-006).
- [X] T031 Trace every claim in `src/content/case-studies/meridian-assistant.ts` and `hrms-backend.ts` to register IDs; confirm all limitations listed and self-reported results attributed; record the table in `specs/003-additional-case-studies/verification.md` (SC-003).
- [X] T032 Reconcile FR-001–FR-016 and SC-001–SC-007 with `specs/003-additional-case-studies/spec.md` in `specs/003-additional-case-studies/verification.md`; list unrun checks and open owner gates; no version bump, changelog, tag, push, or deployment (FR-015, constitution VI–VII).

---

## Dependencies & Execution Order

- **Setup (T001–T003)** → **Foundational (T004–T008)** → stories.
- **US1 (T009–T014)**: needs T004–T008. T011 depends on owner screenshot confirmation; T013 on owner review.
- **US2 (T015–T021)**: needs T003, T005–T006; T017 needs T015; T020 needs owner approval. Independent of US1.
- **US4 (T022–T025)**: T022 needs T015; T025 is easiest before T013/T020 publish the new projects.
- **US3 (T026–T029)**: T026 can run any time after T005; T028–T029 need the published set final.
- **Polish (T030–T032)**: after all stories.

### Parallel Opportunities

- T007 (new diagram file) alongside T005–T006.
- US1 content (T009) and US2 review (T015) touch different files and can run together.
- T027 alongside T026.
- Do not edit `src/content/projects.ts`, `src/app/globals.css`, or `docs/project-evidence.md` concurrently.

## Parallel Example: User Story 1 / User Story 2

```text
Task: T009 [US1] Write src/content/case-studies/meridian-assistant.ts
Task: T015 [US2] Review the HRMS local copy into private-evidence/hrms.md
```

## Parallel Example: User Story 3

```text
Task: T026 [US3] Reorder and unpublish in src/content/projects.ts
Task: T027 [US3] Reword src/components/work/SelectedWork.tsx and src/app/work/page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Setup and Foundational.
2. US1: Meridian case study, published after owner review (T013).
3. Validate with T014.

### Incremental Delivery

1. US2 HRMS, gated on owner text approval (T020).
2. US4 confidentiality and draft checks.
3. US3 reorder and unpublish User Management API.
4. Polish and reconciliation; owner gates stay open until approved.

## Notes

- Never paste HRMS internal names into committed files, commit messages, or chat output beyond what the owner asks for.
- A failed check stays open until fixed or the spec is revised.
- No deployment, publication, tag, or push is authorized by this task list.
