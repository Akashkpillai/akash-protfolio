---

description: "Implementation tasks for the professional profile (v0.3.0)"
---

# Tasks: Professional Profile

**Input**: Design documents in `specs/004-professional-profile/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [UI contract](contracts/ui.md), [quickstart.md](quickstart.md)

**Tests**: No test suite is requested. Tasks require command, HTTP, browser, and content
checks recorded with actual outcomes in `specs/004-professional-profile/verification.md`.

**Organization**: Setup and shared content/layout first, then stories in priority order:
US1 Experience/Skills/About (P1), US2 Contact/résumé (P1), US3 Changelog/version (P2),
US4 Navigation (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on another incomplete task in the same phase
- **[US1]–[US4]**: Maps to the user story in [spec.md](spec.md)

## Path Conventions

- Single Next.js App Router app; new components in `src/components/profile/`
- New CSS appended to `src/app/globals.css` with existing tokens; existing rules untouched
- Every fact comes from the spec's "Owner-supplied facts" and Clarifications; nothing else
- The phone number and home town never appear in any page, component, content file, or metadata

---

## Phase 1: Setup

- [X] T001 Verify root, actual Git branch (`feat/004-resume`), `git status`, unset `SPECIFY_*` overrides, and `.specify/feature.json` → `specs/004-professional-profile`; run `npm run lint`, `npm run typecheck`, `npm run build` as a baseline; create `specs/004-professional-profile/verification.md` with the results.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T002 [P] Update `src/content/profile.ts`: remove the PROVISIONAL comment (role confirmed by the résumé "Backend Developer | AI Developer"), keep `role: "Backend & AI Developer"`, add `location: "Kerala, India"` (no town) and `about: string[]` built only from résumé facts — B.Sc. Physics, NSS College, Kerala University, 2018–2021; backend development since March 2023; current backend and AI work; languages English (fluent), Hindi (intermediate), Malayalam (native) — with no motives or anecdotes (FR-009).
- [X] T003 [P] Create `src/content/contact.ts` with `ContactLink { kind: "email" | "linkedin" | "github"; label; href }` and exactly three entries: `mailto:akashkpillai55@gmail.com`, `https://www.linkedin.com/in/akash-k-pillai/`, `https://github.com/Akashkpillai`; export the plain email address separately for the copy button (FR-008).
- [X] T004 Update `src/content/navigation.ts` to Home `/`, Work `/#work`, Experience `/#experience`, About `/#about`, Approach `/#approach`, Contact `/#contact`; confirm `src/components/layout/Header.tsx` and `MobileNav.tsx` render all six without code changes (FR-012).

**Checkpoint**: Shared content ready.

---

## Phase 3: User Story 1 - Understand who the owner is and their experience (Priority: P1) 🎯 MVP

**Goal**: Homepage shows Experience, Skills, and About from résumé facts.

**Independent Test**: At 390/768/1440 px with and without JavaScript, every role, date, skill group, and education fact matches the spec; the IITIL entry neither names nor links the HRMS case study.

- [X] T005 [P] [US1] Create `src/content/experience.ts` per `data-model.md`, newest first: (1) "Software Developer", organization "IITIL (Innovative Information Technologies India Limited)", location "Remote", start 2026-07, end `"present"`, highlights — built most of the HR modules in an HR management backend developed by a small team (NestJS, PostgreSQL); implemented notification services and Nodemailer email delivery; created Swagger API documentation for frontend integration; ran project demonstrations, resolved frontend integration issues, and guided new developers through the codebase; built an OpenAI-powered HR assistant for employee information, date-specific leave enquiries, and upcoming holidays — no link to or name of the HRMS case study (FR-003, FR-004); (2) "Backend Developer", "InFineIT Global Services LLP", "Surat, Gujarat, India", start 2023-03, end 2026-06 (FR-005), highlights from the résumé bullets (REST APIs with Node.js, Express.js, NestJS, Sails.js; led NestJS, Prisma, PostgreSQL backend work including schema design and API architecture; API and query optimization with Postman and Jest testing and production bug fixes; mentored 2 junior developers), projects FineOne (2025 – June 2026; NestJS, PostgreSQL, Prisma, Redis, Kafka, microservices, Docker; backend modules, Redis caching, a notification service, schemas and raw SQL, code reviews and unit tests) and FineStar (2023 – 2025; Sails.js, Node.js, MongoDB, Mongoose, Nodemailer; role-based stock filtering and analytics APIs, a bidding system with scheduled windows, scheduled EJS email notifications, aggregation reporting).
- [X] T006 [P] [US1] Create `src/content/skills.ts` with the résumé's six groups in résumé order and their skills in résumé order; add `caseStudy` only where that case study's register evidence shows the skill (NestJS → hrms-backend; OpenAI API, RAG, pgvector, embeddings, vector search, tool/function calling → meridian-assistant; Kafka, microservices, event-driven architecture, Twilio, Nodemailer → notification-platform; Groq API → resume-analyzer; Prisma → resume-analyzer); never link to a draft project (FR-006).
- [X] T007 [US1] Create `src/components/profile/ExperienceSection.tsx` (Server Component, `<section id="experience" tabIndex={-1}>`, eyebrow "03 / Experience"): each role as an `article` with title, organization, location, dates as `<time>` ("Jul 2026 – Present", "Mar 2023 – Jun 2026"), highlights list, and nested InFineIT projects (FR-001, FR-002).
- [X] T008 [US1] Create `src/components/profile/SkillsSection.tsx` (Server Component, `id="skills"`, eyebrow "04 / Skills"): six groups; a skill with `caseStudy` links to `/work/<slug>` only if `getPublishedProject(slug)` returns a project; no ratings or bars (FR-006).
- [X] T009 [US1] Create `src/components/profile/AboutSection.tsx` (Server Component, `id="about"`, eyebrow "05 / About") rendering `profile.about`, `profile.location`, and languages (FR-009).
- [X] T010 [US1] Insert Experience, Skills, and About after `<SelectedWork />` in `src/app/page.tsx` and renumber Approach's eyebrow to "06 / Approach"; leave Approach and `FlowDiagram` otherwise unchanged (FR-001, FR-014).
- [X] T011 [US1] Append styles for experience entries, skill groups, and about to `src/app/globals.css` using existing tokens; long organization names wrap; readable at 390/768/1440 and 200% zoom (FR-013).
- [X] T012 [US1] Review rendered Experience, Skills, and About against the spec facts and clarifications; record the field-by-field comparison in `specs/004-professional-profile/verification.md` (SC-001, SC-007).

**Checkpoint**: Profile sections readable on their own.

---

## Phase 4: User Story 2 - Contact the owner or download the résumé (Priority: P1)

**Goal**: Working email, copy-email, LinkedIn, GitHub, and a site-served résumé download.

**Independent Test**: Every contact action and the résumé link work by pointer and keyboard; the PDF is served from the site; no phone or town on any page.

- [X] T013 [US2] Résumé asset (FR-007): ask the owner for the corrected PDF (InFineIT ending June 2026). Copy the corrected file — or, only if the owner explicitly approves shipping the current one, `C:\Users\HP\Downloads\Akash_K_Pillai_Classic_Resume.pdf` — to `public/resume/Akash_K_Pillai_Resume.pdf`; record provenance, file size, and approval in `specs/004-professional-profile/verification.md`. If neither is approved, leave the file absent.
- [X] T014 [P] [US2] Create `src/lib/resume.ts` (server-only) exporting `resumeHref = "/resume/Akash_K_Pillai_Resume.pdf"` and `hasResume()` that checks the file exists under `public/` at build time.
- [X] T015 [P] [US2] Create `src/components/profile/CopyEmailButton.tsx` (`"use client"`): rendered only after hydration (`useSyncExternalStore` like `FlowDiagram`); native button "Copy email"; on success a polite live region says "Email copied"; on failure it shows the address in a selected read-only field for manual copy.
- [X] T016 [US2] Create `src/components/profile/ResumeLink.tsx` (Server Component): renders a "Download résumé" link with `download` to `resumeHref` only when `hasResume()` is true; otherwise renders nothing.
- [X] T017 [US2] Create `src/components/profile/ContactSection.tsx` (Server Component, `id="contact"`, eyebrow "07 / Contact"): visible email address with mail link, `CopyEmailButton`, LinkedIn and GitHub links, and `ResumeLink`; add it last in `src/app/page.tsx` (FR-008).
- [X] T018 [US2] Add `ResumeLink` beside the existing actions in `src/components/layout/Hero.tsx` (renders nothing without the PDF) and append contact/résumé styles to `src/app/globals.css` (FR-007, FR-012).
- [X] T019 [US2] Check against `next start`: mail link and LinkedIn/GitHub hrefs exactly as confirmed; résumé URL 200 with `application/pdf` when present, and no résumé link when absent; search every page and the metadata for the phone number (with and without spaces and `+91`) and the town name, expecting zero; record in `specs/004-professional-profile/verification.md` (SC-002, SC-006).

**Checkpoint**: Contact works on its own.

---

## Phase 5: User Story 3 - See what changed and which version is live (Priority: P2)

**Goal**: `/changelog` and a footer version that always agree with the package.

**Independent Test**: Footer version, `package.json` version, and newest changelog entry agree; a deliberate mismatch fails the build.

- [X] T020 [US3] Create `src/content/changelog.ts` with releases newest first: 0.3.0 (date set at acceptance; professional profile), 0.2.0 (2026-10-25; engineering case studies, features 002 and 003), 0.1.0 (2026-10-25; portfolio foundation); import `version` from `package.json` and throw at module load if the newest entry's version differs (FR-010, FR-011).
- [X] T021 [P] [US3] Create `src/app/changelog/page.tsx` with metadata, `<main id="main-content" tabIndex={-1}>`, one `h1`, and each release as an `h2` with `<time>`, summary, and change list (FR-010).
- [X] T022 [P] [US3] Create `src/components/layout/Footer.tsx` showing the owner's name and "Version X.Y.Z" linking to `/changelog`, and render it in `src/app/layout.tsx` after `{children}`; append footer and changelog styles to `src/app/globals.css` (FR-011).
- [X] T023 [US3] Verify the build fails when the newest changelog version differs from `package.json` (temporarily, then revert) and record it in `specs/004-professional-profile/verification.md` (SC-003).

**Checkpoint**: Versioning works on its own (with package still at the version being released).

---

## Phase 6: User Story 4 - Navigate the whole site from any page (Priority: P2)

**Goal**: Six navigation items work from every route and in the mobile menu.

**Independent Test**: From `/`, `/work`, each case study, `/changelog`, and the not-found page, every nav item reaches its section by pointer and keyboard.

- [X] T024 [US4] Copy `specs/003-additional-case-studies/verification/run-browser-checks.mjs` to `specs/004-professional-profile/verification/run-browser-checks.mjs` and extend it: pages add `/changelog`; nav check covers all six items from every route (desktop and mobile); copy-email live region; résumé link presence matches the file; footer version equals `package.json`; keep responsive, no-JavaScript, reduced-motion, links, diagram, and 001 regression checks (SC-002, SC-004, SC-005).

---

## Phase 7: Polish & Cross-Cutting

- [X] T025 Run `npm run lint`, `npm run typecheck`, `npm run build`, then the browser script against `next start`; review screenshots at 390/768/1440 and zoom for clipping and visual fit; record results in `specs/004-professional-profile/verification.md`.
- [X] T026 Run `specs/003-additional-case-studies/verification/check-confidentiality.mjs` with `PAGES` set to the four case studies; expect zero matches on case-study pages, `src/content/case-studies/`, and the register; record in `specs/004-professional-profile/verification.md` (case studies still name no organization).
- [X] T027 Update `docs/content-needed.md` (Meridian and HRMS are no longer blocked; résumé, contacts, experience, education supplied 2026-10-25) and `docs/roadmap.md` (002–004 status); record the 001 role/headline gate as closed in `specs/004-professional-profile/verification.md`.
- [ ] T028 Acceptance: with owner approval, set `"version": "0.3.0"` in `package.json` and `package-lock.json` (`npm install --package-lock-only`), set the 0.3.0 date in `src/content/changelog.ts`, rebuild, confirm footer = package = changelog, and reconcile FR-001–FR-015 and SC-001–SC-007 in `specs/004-professional-profile/verification.md`; no tag, push, or deployment unless the owner asks.

---

## Dependencies & Execution Order

- Setup (T001) → Foundational (T002–T004) → stories.
- **US1** (T005–T012): needs T002. **US2** (T013–T019): needs T003; T013 needs the owner's PDF decision; T017 uses T014–T016. **US3** (T020–T023): independent of US1/US2. **US4** (T024): after US1–US3 so all sections exist.
- **Polish** (T025–T028): after all stories; T028 needs owner approval.

### Parallel Opportunities

- T002 and T003 (different files). T005 and T006. T014 and T015. T021 and T022.
- Do not edit `src/app/page.tsx`, `src/app/globals.css`, or `src/content/projects.ts` concurrently.

## Parallel Example: User Story 1

```text
Task: T005 [US1] Create src/content/experience.ts
Task: T006 [US1] Create src/content/skills.ts
```

## Parallel Example: User Story 2

```text
Task: T014 [US2] Create src/lib/resume.ts
Task: T015 [US2] Create src/components/profile/CopyEmailButton.tsx
```

## Implementation Strategy

1. MVP: Setup, Foundational, US1 → validate with T012.
2. Add US2 (contact and résumé), US3 (changelog and version), US4 (navigation checks).
3. Polish, then acceptance (T028) bumps to 0.3.0 with the owner's approval.

## Notes

- If the corrected résumé is not supplied, everything else ships and the download stays absent.
- No deployment, tag, or push is authorized by this list.
