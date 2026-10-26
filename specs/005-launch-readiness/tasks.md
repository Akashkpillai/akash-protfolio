---

description: "Implementation tasks for launch readiness (v1.0.0, prepared not published)"
---

# Tasks: Launch Readiness

**Input**: Design documents in `specs/005-launch-readiness/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [site metadata contract](contracts/site-metadata.md),
[deployment contract](contracts/deployment.md), [quickstart.md](quickstart.md)

**Tests**: No test suite is requested. Tasks build verification scripts and run command,
HTTP, browser, accessibility, performance, and content checks, recording actual outcomes in
`specs/005-launch-readiness/verification.md` (the readiness report). A check not recorded
there has not run; an unrun check is never marked passed.

**Organization**: Setup and the production-address setting first, then stories in
priority order: US1 working site on every device (P1), US2 metadata and discoverability
(P2), US3 release preparation (P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on another incomplete task in the same phase
- **[US1]â€“[US3]**: Maps to the user story in [spec.md](spec.md)

## Path Conventions

- Single Next.js App Router app; new helpers in `src/lib/`, generated files under `src/app/`
- Verification scripts, screenshots, and Lighthouse JSON in `specs/005-launch-readiness/verification/`
- QA tools only in `%TEMP%\akash-portfolio-qa-tools`, never in `package.json`
- Verification builds use `SITE_URL=https://portfolio.example` and are **not releasable**
- No tag, push, or deployment anywhere in this list (FR-024); commits only with the owner's go-ahead

---

## Phase 1: Setup

- [X] T001 Verify root `C:\Users\HP\Desktop\akash-portfolio`, actual Git branch and `git status`, unset `SPECIFY_INIT_DIR`/`SPECIFY_FEATURE_DIRECTORY`/`SPECIFY_FEATURE`, and `.specify/feature.json` â†’ `specs/005-launch-readiness`; create branch `feat/005-launch-readiness` from `main` (or confirm the owner's preferred name); run `npm run lint`, `npm run typecheck`, `npm run build` as a baseline (before `SITE_URL` exists); create `specs/005-launch-readiness/verification.md` recording date, commit `0e1cd5f`, Windows version, Node `node --version`, npm `npm --version`, Chrome version, and the baseline results.
- [X] T002 [P] Install QA tools outside the app: `npm install --prefix $env:TEMP\akash-portfolio-qa-tools axe-core lighthouse` (keep the existing `playwright-core`); record each installed version in `specs/005-launch-readiness/verification.md`. Create gitignored `private-evidence/personal-terms.txt` holding the phone and town search terms listed in feature 004's T019 verification (never printed by scripts).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The single production-address setting. After this phase every production build needs `SITE_URL`.

- [X] T003 Create `src/lib/site.ts` exporting `siteOrigin: string` and `absoluteUrl(path: string): string` per [data model SiteConfig](data-model.md#siteconfig-srclibsitets): read `process.env.SITE_URL`; when `NODE_ENV === "production"`, throw `SITE_URL â€¦: <rule>` unless it is present, parses as a URL, protocol `https:`, pathname `/` or empty, no search, hash, username, or password, and host not `localhost`, `127.0.0.0/8`, `::1`, or `0.0.0.0`; in development only, absent â†’ `http://localhost:3000`; normalize `origin` to `https://host[:port]` with no trailing slash; `absoluteUrl` returns `new URL(path, origin).href` and rejects a `path` not starting with `/` (FR-012, FR-017).
- [X] T004 [P] Create `.env.example` containing only `SITE_URL=` with a one-line comment pointing to `docs/deployment.md`, and `.nvmrc` containing `24.12.0` (deployment contract, Runtime and Settings).
- [X] T005 Update `src/app/layout.tsx` metadata: `metadataBase: new URL(siteOrigin)`, default `title` `Akash K Pillai | Portfolio`, default `description` `profile.headline`, `applicationName` `profile.name`; no `alternates`, `openGraph`, or `twitter` at the root so nothing page-specific reaches the 404 page.
- [X] T006 Run quickstart Â§1: build with `SITE_URL` unset, `http://portfolio.example`, `https://localhost`, `https://portfolio.example/path` (each must exit â‰  0 with a message naming `SITE_URL` and the rule), then `https://portfolio.example` (exit 0); confirm `npm run dev` without `SITE_URL` still starts; record each exit code and message in `specs/005-launch-readiness/verification.md` (deployment contract, Build behavior; spec edge case 1).

**Checkpoint**: Builds fail without a valid address and never fall back to a local one.

---

## Phase 3: User Story 1 - Visitors get a complete, working site on every device (Priority: P1) ðŸŽ¯ MVP

**Goal**: Every public page loads directly, reads well at every width, works by keyboard, without motion, and without JavaScript; every visible action works; unknown and draft addresses show the 404 page; published copy matches its evidence and nothing private is served.

**Independent Test**: From the production build, open every public route directly at 390/768/1440 px and emulated 200% zoom, by keyboard only, with reduced motion, and with JavaScript disabled; activate every visible action; open `/work/user-management-api`, `/work/meridian`, and `/nope`.

- [X] T007 [P] [US1] Export `metadata` from `src/app/not-found.tsx` with title `Page not found | Akash K Pillai` and a description from its explanation text; no canonical or sharing fields. If Next.js ignores it, record the observed title and the reason in `specs/005-launch-readiness/verification.md` (FR-002; contract Not-found responses).
- [X] T008 [US1] Copy `specs/004-professional-profile/verification/run-browser-checks.mjs` to `specs/005-launch-readiness/verification/run-browser-checks.mjs` and extend it: pages `/`, `/work`, `/changelog`, the four case studies, plus not-found pages `/work/user-management-api`, `/work/meridian`, `/nope` (status 404, links to `/` and `/work`); responsive and screenshots for every public page at 390/768/1440 and emulated zoom200; keyboard order and a visible focus indicator (non-zero outline or box-shadow) on every interactive element of every page; reduced motion and JavaScript disabled on every page (essential text, navigation, diagram equivalents); links check over every visible action including a demo link if present; axe-core injected from `%TEMP%\akash-portfolio-qa-tools\node_modules\axe-core\axe.min.js` on every page at 390 and 1440 px with tags `wcag2a wcag2aa wcag21a wcag21aa wcag22aa`, saving violations and "incomplete" items; computed text contrast on every page in both viewports reusing `textContrast` from `specs/001-portfolio-foundation/verification/run-browser-checks.mjs`; write `results.json` beside the script (FR-001â€“FR-006, FR-008).
- [X] T009 [P] [US1] Create `specs/005-launch-readiness/verification/check-evidence-ids.mjs`: collect every evidence ID (pattern `[A-Z]{2,4}-R?\d{2}`) from `src/content/**/*.ts` and report any not present in `docs/project-evidence.md`; exit 1 on any missing ID (FR-007).
- [X] T010 [P] [US1] Create `specs/005-launch-readiness/verification/check-served-output.mjs`: search the served surface â€” prerendered `.html`, `.rsc`, `.body`, and `.meta` files under `.next/server/app/`, all of `.next/static/`, `public/`, and fetched `/sitemap.xml` and `/robots.txt` from `BASE_URL` (skip with a note if those routes 404 before US2) â€” for draft markers `user-management-api`, `User Management API`, `user-management-with-prisma` and for the terms in `private-evidence/personal-terms.txt` (case-insensitive, never printed; counts and file names only), excluding `public/resume/` for personal terms because the owner approved the PDF; report other `.next/server` chunk counts as informational; exit 1 on any served match (FR-010; research Draft exclusion).
- [X] T011 [US1] Evidence re-check (FR-007): run `check-evidence-ids.mjs`; then read every rendered page (`/`, `/work`, four case studies, `/changelog`) against `docs/project-evidence.md`, the owner-supplied facts in `specs/004-professional-profile/spec.md`, and the rÃ©sumÃ©; correct or remove any unsupported claim in its `src/content/` file without editing the evidence register to fit; record per page the review date, sources, and each correction in `specs/005-launch-readiness/verification.md`.
- [ ] T012 [US1] Action inventory (FR-008): list in `specs/005-launch-readiness/verification.md` every visible action â€” hero and contact "Download rÃ©sumÃ©", email link, copy email, LinkedIn, GitHub, each case-study source link, footer changelog link, 404 links, any demo â€” as an ActionCheck row with `page`, `action`, `destination`, `method` (`automated` | `manual` | `automated + manual`), `date`, `result` (`pass` | `fail` | `unconfirmed`); ask the owner to confirm the LinkedIn profile by hand so its `unconfirmed` bot-check result becomes `pass`; remove or fix any action that cannot be confirmed.
- [ ] T013 [US1] Demo check (FR-009): with a fictional rÃ©sumÃ© PDF (no real person's data; keep it in the scratchpad), run the Resume Analyzer flow at `https://resume-analyzer-rosy.vercel.app` once â€” upload, parsed record shown, search finds it; record date, steps, and outcome in `specs/005-launch-readiness/verification.md`. Only if every step works, set `demo: { url, checkedOn, flowChecked }` on the `resume-analyzer` entry in `src/content/projects.ts`; otherwise leave `demo` unset and record "no demo action".
- [ ] T014 [US1] Only if T013 set `demo`: render a "Live demo" link to `project.demo.url` beside the source link in `src/components/work/CaseStudyArticle.tsx` using the existing link and focus styles; nothing renders when `demo` is absent (contract Visible changes). Otherwise mark this task skipped with the reason.
- [X] T015 [US1] With `SITE_URL=https://portfolio.example`, build and `npm run start -- -p 3100`; run `run-browser-checks.mjs`, `check-served-output.mjs`, and `specs/003-additional-case-studies/verification/check-confidentiality.mjs` (`PAGES` = four case studies); inspect every screenshot by eye for clipping, overflow, and Journal fit; open Chrome headed once at real 200% zoom on `/` and one case study; fix only observed failures (in `src/app/globals.css` or the affected component) and re-run; review each axe "incomplete" item by hand; record per check environment, date, result (`pass` | `fail` | `unrun`), measurements, and limitations in `specs/005-launch-readiness/verification.md` (SC-001â€“SC-004).

**Checkpoint**: The site is complete and correct for visitors; metadata not yet added.

---

## Phase 4: User Story 2 - Shared links and search results describe the site accurately (Priority: P2)

**Goal**: Every public page has a unique title, a truthful description, a canonical on the production address, and a sharing preview with an owned image; the sitemap lists exactly the published pages; robots point to it; drafts appear nowhere.

**Independent Test**: `check-metadata.mjs` against `next start` exits 0; `/og.png` and the icon inspected by eye; sitemap equals the public-page canonicals; no draft or unknown address in any generated file.

- [X] T016 [P] [US2] Create `src/lib/metadata.ts` exporting `pageMetadata({ path, title, description })` returning `title`, `description`, `alternates.canonical: absoluteUrl(path)`, `openGraph` (`title`, `description`, `url: absoluteUrl(path)`, `siteName: "Akash K Pillai"`, `type: "website"`, `images: [{ url: absoluteUrl("/og.png"), width: 1200, height: 630, alt }]`), and `twitter` (`card: "summary_large_image"`, `title`, `description`, `images: [absoluteUrl("/og.png")]`) (FR-011â€“FR-013; contract Every public page).
- [X] T017 [P] [US2] Add Manrope static TTFs (two weights, e.g. Bold and Medium) and the OFL-1.1 license text to `src/assets/fonts/` (`Manrope-Bold.ttf`, `Manrope-Medium.ttf`, `OFL.txt`) from the Manrope upstream static instances; if unavailable, instance the Google Fonts variable file with `fontTools` `varLib.instancer`; record source URL or method, file sizes, and SHA-256 in `specs/005-launch-readiness/verification.md` (FR-014).
- [X] T018 [P] [US2] Create `src/content/pages.ts` exporting `workIntro` (the current work index intro sentence, unchanged) and `changelogIntro` (`Releases of this portfolio, newest first.`) so visible text and descriptions share one source (FR-011).
- [X] T019 [P] [US2] Create `src/app/icon.svg`: square `viewBox`, a geometric monogram drawn with paths only (no `<text>`, no external reference), canvas `#f5f2eb`, ink `#17212b`, copper `#b44e30`, distinguishable at 16Ã—16 px; no photograph or third-party logo (FR-014; contract Icon).
- [X] T020 [US2] Create `src/app/og.png/route.tsx`: `export const dynamic = "force-static"`; `GET` returns `new ImageResponse(...)` from `next/og`, 1200Ã—630, showing `profile.name`, `profile.role`, and `profile.headline` from `src/content/profile.ts` in Manrope (fonts read from `src/assets/fonts/` with `readFile` at build), ink `#17212b` on canvas `#f5f2eb`, one copper `#b44e30` rule, text contrast â‰¥ 4.5:1; no photograph, logo, or third-party mark (depends on T017; FR-013, FR-014; contract `/og.png`).
- [X] T021 [US2] Use `pageMetadata` in `src/app/page.tsx` (path `/`, title `Akash K Pillai | Backend & AI Developer`, description `${profile.role}. ${profile.intro}`) and `src/app/work/page.tsx` (path `/work`, title `Work | Akash K Pillai`, description `workIntro`, and render `workIntro` from `src/content/pages.ts` in place of the inline paragraph text) (depends on T016, T018).
- [X] T022 [US2] Use `pageMetadata` in `src/app/work/[slug]/page.tsx` `generateMetadata` (path `/work/${project.slug}`, title `${project.title} | Akash K Pillai`, description `project.summary`; keep returning `{}` for unknown slugs) and `src/app/changelog/page.tsx` (path `/changelog`, title `Changelog | Akash K Pillai`, description `changelogIntro`, and render `changelogIntro` as a paragraph under the `h1`, styled with existing intro styles in `src/app/globals.css` if needed) (depends on T016, T018).
- [X] T023 [P] [US2] Create `src/app/sitemap.ts` returning `{ url: absoluteUrl(path) }` for `/`, `/work`, each `publishedProjects` entry in `order` as `/work/<slug>`, then `/changelog`; no `lastModified`, `priority`, or `changeFrequency`; nothing from draft projects (FR-015; data model SitemapEntry).
- [X] T024 [P] [US2] Create `src/app/robots.ts` returning `{ rules: [{ userAgent: "*", allow: "/" }], sitemap: absoluteUrl("/sitemap.xml") }` (FR-016; data model RobotsRules).
- [X] T025 [US2] Create `specs/005-launch-readiness/verification/check-metadata.mjs` (Node `fetch` only; `BASE_URL` for requests, `SITE_URL` for expected values): for each public page assert status 200 and exactly one `<title>`, `meta[name=description]`, `link[rel=canonical]` = `SITE_URL + path` (homepage `SITE_URL + "/"`), `og:title`, `og:description`, `og:url` = canonical, `og:type` `website`, `og:site_name` `Akash K Pillai`, `og:image` = `SITE_URL/og.png` with width 1200, height 630, alt, `twitter:card` `summary_large_image` with title, description, image, `link[rel=icon]` SVG; titles unique; no `noindex`; no value containing `localhost`, `127.0.0.1`, a draft marker, or another host. For `/work/user-management-api`, `/work/meridian`, `/nope`: status 404, title `Page not found | Akash K Pillai`, robots includes `noindex`, no canonical, `og:url`, or `og:image`. `/sitemap.xml`: 200, XML, `<loc>` set equals the public-page canonicals exactly. `/robots.txt`: 200, parsed rules `User-Agent: *`, `Allow: /`, `Sitemap: SITE_URL/sitemap.xml`. `/og.png`: 200, `image/png`, PNG header dimensions 1200Ã—630. Print one line per assertion; exit 1 on any failure (contract site-metadata; reused for post-deploy confirmation).
- [X] T026 [US2] Build with `SITE_URL=https://portfolio.example`, start on port 3100, run `check-metadata.mjs` and `check-served-output.mjs` (now including sitemap and robots); open `/og.png` and the icon and inspect them by eye, computing the card's text contrast; fix failures and re-run; record results in `specs/005-launch-readiness/verification.md`; ask the owner to approve the sharing card and icon and record the answer as release blocker 4's status (SC-005).

**Checkpoint**: Metadata and generated files match the contract on the test domain.

---

## Phase 5: User Story 3 - The owner can release, deploy, and roll back with confidence (Priority: P3)

**Goal**: A tested 1.0.0 release candidate, a readiness report the owner can trust, host-neutral deployment and rollback instructions, and release notes â€” prepared, not published.

**Independent Test**: From a clean clone of the tested commit, the documented install and build succeed first time; version reads 1.0.0 in 3 places; report, deployment guide, and release notes answer every blocker, deploy, and rollback question.

- [X] T027 [P] [US3] Create `docs/deployment.md` for the owner per [deployment contract](contracts/deployment.md): Node `24.12.0` and npm `11.6.2` (tested), `npm ci` / `npm run build` / `npm run start`, `PORT`, the `SITE_URL` rules and that changing it requires a rebuild, the build-behavior table, owner inputs (host, domain), how to confirm a deployment (`check-metadata.mjs` with `BASE_URL` and `SITE_URL` set to the live domain, then footer `Version 1.0.0`, host record shows the tested commit, one case study, rÃ©sumÃ©, email), the tested-commit rule `git diff --stat T..D -- . ":!specs" ":!docs"` must print nothing, rollback for later releases and for first launch, and the owner-only actions list (FR-022).
- [X] T028 [US3] Performance (FR-021): with the test-domain build on `next start`, run the Lighthouse CLI from `%TEMP%\akash-portfolio-qa-tools` against `/` and `/work/notification-platform`, once mobile (default) and once `--preset=desktop`, using the installed Chrome; save JSON to `specs/005-launch-readiness/verification/lighthouse/<page>-<profile>.json`; record performance and accessibility scores, LCP, CLS, TBT, Lighthouse and Chrome versions, machine, throttling, and the limitation that localhost has no network or CDN; investigate if LCP > 2.5 s or CLS > 0.1 and record the outcome; state no score that was not measured.
- [X] T029 [US3] Version (FR-019): run `npm version 1.0.0 --no-git-tag-version` (updates `package.json` and `package-lock.json`); add a 1.0.0 entry at the top of `src/content/changelog.ts` (`features: ["005"]`, date of the release-candidate commit) describing only work completed in this feature (metadata, sharing card, icon, sitemap, robots, production-address setting, corrections from T011, any demo from T013); rebuild and confirm package, footer, and newest changelog entry all read `1.0.0` (SC-007).
- [ ] T030 [US3] Release candidate: with the owner's go-ahead, commit all application changes on `feat/005-launch-readiness` (attribution per repository rules); record the full SHA as the tested commit in `specs/005-launch-readiness/verification.md`. Any later application change makes a new candidate and re-runs T031.
- [ ] T031 [US3] On the tested commit: clone fresh with `git clone --no-local` into `%TEMP%\akash-portfolio-fresh`, check out the SHA, set `SITE_URL=https://portfolio.example`, run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build` following only `docs/deployment.md` (FR-018, SC-006); then re-run `check-metadata.mjs`, `check-served-output.mjs`, `run-browser-checks.mjs`, `check-evidence-ids.mjs`, and the 003 confidentiality script against that build; mark any earlier result not re-run on the tested commit as stale; record versions, durations, and results.
- [ ] T032 [US3] Complete the readiness report in `specs/005-launch-readiness/verification.md`: one ReadinessCheck row per FR-020 check (build, types, lint, direct routes, 404 and draft exclusion, responsive screenshots, keyboard and focus, reduced motion, JavaScript disabled, contrast and accessibility review, performance, links and actions, metadata, confidentiality, fresh install) with `environment` (OS, Node, npm, Chrome, tool and version, `SITE_URL`, commit), `date`, `result` (`pass` | `fail` | `unrun`), `measurements`, and `limitations` (required, even "none known"); list screen-reader testing as `unrun`; describe accessibility as automated checks plus manual review, never conformance; mark the build "not releasable" because `portfolio.example` is a reserved test host; include the ActionCheck table and the ReleaseBlocker list `{ id, description, owner action, status: open | resolved, resolved on }` (FR-020, SC-008).
- [ ] T033 [US3] Create `docs/releases/1.0.0.md` (ReleaseRecord): version `1.0.0`, tested commit SHA, release notes from the 1.0.0 changelog entry and the readiness report, known limitations (every `unrun` check and recorded limitation, no screenshots, demo outcome, no `favicon.ico`, emulated vs. real zoom, localhost performance), blockers â€” production address not supplied; feature 004 T028 owner acceptance; LinkedIn manual confirmation; owner approval of sharing card and icon â€” each with status, and `status: prepared â€” blocked` while any is open (FR-023, FR-024).

**Checkpoint**: Release prepared and documented; blocked until the owner closes the blockers.

---

## Phase 6: Polish & Cross-Cutting

- [X] T034 [P] Add dated status sections to `docs/roadmap.md` (005 â†’ launch readiness prepared, 1.0.0 blocked on the domain), `docs/content-needed.md` (still outstanding: domain and host; demo outcome; screenshots optional), and `docs/toolchain.md` (QA tool versions from T002, Lighthouse and Chrome versions), keeping earlier text as history.
- [ ] T035 Reconcile FR-001â€“FR-024 and SC-001â€“SC-009 against the recorded results in `specs/005-launch-readiness/verification.md`, citing the check behind each; keep any failing or unrun criterion open rather than weakening it.
- [ ] T036 Acceptance (owner): after the owner closes feature 004 T028 and supplies the production domain, rebuild the tested commit with `SITE_URL=https://<domain>`, re-run `check-metadata.mjs` and `check-served-output.mjs`, confirm the host is not a reserved test host, update blocker statuses in `docs/releases/1.0.0.md` and `specs/005-launch-readiness/verification.md`, and set status `prepared â€” ready` only when no blocker is open and no check is `fail` or `unconfirmed`; no tag, push, or deployment unless the owner separately asks (FR-024).

---

## Dependencies & Execution Order

- Setup (T001â€“T002) â†’ Foundational (T003â€“T006) â†’ stories. After T005, every production build needs `SITE_URL`.
- **US1** (T007â€“T015): needs Foundational. T008â€“T010 before T015; T011 needs T009; T014 only after T013 passes; T012 and T013 involve the owner or an external site.
- **US2** (T016â€“T026): needs Foundational; independent of US1. T020 needs T017; T021â€“T022 need T016 and T018; T025 before T026.
- **US3** (T027â€“T033): T027 and T028 can start once US1 and US2 code is stable; T029 â†’ T030 â†’ T031 â†’ T032 â†’ T033 in order; T030 needs the owner's go-ahead.
- **Polish** (T034â€“T036): after US3; T036 needs the owner's domain and 004 acceptance.

### Parallel Opportunities

- T002 with T001's build. T004 with T003.
- US1: T007, T009, T010 (different files); T008 alongside them.
- US2: T016, T017, T018, T019, T023, T024 (all different files).
- US3: T027 and T028.
- US1 and US2 can proceed side by side after Foundational, except that both may touch `src/app/globals.css` (T015 fixes, T022 intro style) â€” do not edit it concurrently, nor `src/content/projects.ts`.

## Parallel Example: User Story 1

```text
Task: T007 [US1] Export metadata from src/app/not-found.tsx
Task: T009 [US1] Create verification/check-evidence-ids.mjs
Task: T010 [US1] Create verification/check-served-output.mjs
```

## Parallel Example: User Story 2

```text
Task: T016 [US2] Create src/lib/metadata.ts
Task: T017 [US2] Add Manrope TTFs and OFL.txt to src/assets/fonts/
Task: T018 [US2] Create src/content/pages.ts
Task: T019 [US2] Create src/app/icon.svg
Task: T023 [US2] Create src/app/sitemap.ts
Task: T024 [US2] Create src/app/robots.ts
```

## Implementation Strategy

1. MVP: Setup, Foundational, US1 â†’ validate with T015 (a correct, accessible site with the address setting enforced).
2. Add US2 â†’ validate with T026 (metadata, sharing, sitemap, robots on the test domain).
3. Add US3 â†’ version bump, tested commit, fresh install, report, deployment guide, release notes.
4. Polish and reconcile; T036 waits for the owner's domain and 004 acceptance.

## Notes

- The release stays `prepared â€” blocked` until the domain is supplied; that is expected, not a failure.
- If the demo check fails, no demo action ships; this does not block the release.
- Fix only problems a check or screenshot actually shows; do not polish without evidence.
- No deployment, tag, or push is authorized by this list.

## Status (2026-10-26)

**Paused** for feature 006 (Systems Lab redesign); see `verification.md` "Feature paused".
Done: T001–T011, T015–T025, T028 (on the Journal design; UI results become stale after 006).
Open on owner input: T012 (LinkedIn), T013–T014 (demo-flow approval), T026 (card/icon).
Resume with T015, T026, T028 re-runs, then T027 and T029–T036.

## Phase 7: Convergence

- [X] T037 Re-run the site-quality checks on the Systems Lab design: build with `SITE_URL=https://portfolio.example`, `next start` on 3100, run `specs/007-lab-companion-motion/verification/run-browser-checks.mjs` (the suite of record; carries 005's page, 404, responsive, zoom, focus-walk, reduced-motion, no-JavaScript, axe, contrast, and links checks) plus `specs/003-additional-case-studies/verification/check-confidentiality.mjs`; inspect the screenshots; record environment, results, and limitations in `specs/005-launch-readiness/verification.md` as superseding the stale US1 results per FR-001–FR-006, SC-001–SC-003 (partial)
- [X] T038 Rebuild the action inventory (T012's automated part) on the new design from the suite's `links` results: one ActionCheck row per distinct visible action (including Ask the lab, the message form, copy email, and the motion pause) with page, action, destination, method, date, result; LinkedIn stays `unconfirmed` until T041 per FR-008, SC-004 (partial)
- [X] T039 Re-run T026 on the new build: `check-metadata.mjs`, `check-served-output.mjs`, `check-evidence-ids.mjs`; view `/og.png` and the icon; record results, and record release blocker "sharing card and icon approval" as resolved on 2026-10-26 by the owner's acceptance of 006 per SC-005 (partial)
- [X] T040 Re-run T028 performance on the new design: Lighthouse for `/` and `/work/notification-platform`, mobile and `--preset=desktop`, JSON to `specs/005-launch-readiness/verification/lighthouse/<page>-<profile>-r2.json`; record scores, LCP, CLS, TBT, versions, and limits; note that a fresh Lighthouse profile plays the homepage entrance per FR-021 (partial)
- [ ] T041 Owner: open the LinkedIn link from the live page by hand and confirm it reaches the right profile; record the answer and date in the ActionCheck table per FR-008 (partial)
- [ ] T042 Owner: review the Resume Analyzer and Notification Platform records in `docs/project-evidence.md`; on approval change "Owner review of this register: pending" to the review date, else correct the site content per FR-007 (partial)
- [ ] T043 Owner: decide the demo: approve running T013 (creates an account on the live Resume Analyzer and uses its AI quota) or ship 1.0.0 with no demo action; record the decision; T014 follows only an approved, passing T013 per FR-009 (partial)
- [ ] T044 When executing T031, use the 007 browser suite named in T037 instead of 005's retired script; when executing T032–T033, list blockers per spec "Resumed (2026-10-26)" (004 acceptance and card/icon resolved; domain, LinkedIn, and register review open until T041/T042/T036) per FR-020, FR-023 (contradicts)