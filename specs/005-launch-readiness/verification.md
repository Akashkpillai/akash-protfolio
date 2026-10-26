# Verification: Launch Readiness (readiness report)

Actual outcomes only. A check not listed as run here has not been run. Builds made with
`SITE_URL=https://portfolio.example` use a reserved test host and are **not releasable**.

## T001 Context and baseline (2026-10-25)

- Root `C:\Users\HP\Desktop\akash-portfolio`; Git branch `feat/005-launch-readiness`
  (already created by the owner, at `main` = `0e1cd5f8a14204c03459af9ec7d2fa1735df49bc`);
  only `specs/005-launch-readiness/` untracked. `SPECIFY_*` overrides unset;
  `.specify/feature.json` → `specs/005-launch-readiness`. Spec checklist 16/16.
- Environment: Windows NT 10.0.26200.0, Node.js `24.12.0`, npm `11.6.2`, Chrome
  `156.0.8078.47`.
- Baseline (before `SITE_URL` exists): `npm run lint` exit 0, `npm run typecheck` exit 0,
  `npm run build` exit 0; routes `/`, `/_not-found`, `/changelog`, `/work`, four case studies.

## T002 QA tools (2026-10-25)

Installed in `%TEMP%\akash-portfolio-qa-tools`, outside the app: `playwright-core` `1.64.1`
(reinstalled — the first `npm install --prefix` removed the earlier unlisted copy),
`axe-core` `4.14.0`, `lighthouse` `13.5.0`. `package.json` unchanged.
`private-evidence/personal-terms.txt` (gitignored, confirmed with `git check-ignore`) holds
the phone and town terms from feature 004 T019 plus spacing/prefix variants.

## T003–T006 Production-address setting (2026-10-25)

`src/lib/site.ts` (`siteOrigin`, `absoluteUrl`), `.env.example` (`SITE_URL=` only),
`.nvmrc` (`24.12.0`), root `metadataBase` from `siteOrigin` with default title,
description, and `applicationName` only.

| `SITE_URL` | `npm run build` exit | Message |
| --- | --- | --- |
| unset | 1 | `SITE_URL is required for production builds. Set it to the production address, …` |
| `http://portfolio.example` | 1 | `SITE_URL must use https://. …` |
| `https://localhost` | 1 | `SITE_URL must not be localhost or a loopback address. …` |
| `https://portfolio.example/path` | 1 | `SITE_URL must not include a path. …` |
| `https://portfolio.example` | 0 | — (reserved test host: not releasable) |

- `npm run dev` without `SITE_URL` (port 3102): `/` 200 (uses `http://localhost:3000`).
- Analysis finding I1: `npm run start` **without** `SITE_URL` at runtime, on the
  test-host build: `/` 200, `/changelog` 200, `/work/meridian`, `/nope`,
  `/work/user-management-api` 404 — prerendered output does not re-read the setting. The
  deployment guide still asks for `SITE_URL` in both build and runtime environments, since
  some hosts render on demand.
- Environment note: `next start` warns that it ignored an unrelated `pnpm-lock.yaml` in
  `C:\Users\HP` (outside the repository); no effect on output.
- Side effect: running `npm run dev` made Next.js append its "nextjs-agent-rules" block
  to `AGENTS.md` (10 lines; written by `next/dist/server/lib/generate-agent-files.js`).
  Left in place for the owner to keep or commit.

## US1 results (2026-10-25, Engineering Journal design, test host `portfolio.example`)

All runs against `next start -p 3100`, Chrome `156.0.8078.47`, `playwright-core` `1.64.1`,
`axe-core` `4.14.0`.

- **T007**: `/nope`, `/work/meridian`, `/work/user-management-api` → 404, title
  `Page not found | Akash K Pillai`, `noindex`, no canonical.
- **T008/T015** `run-browser-checks.mjs`: responsive (40 cases: 10 pages × 390/768/1440/
  emulated zoom200), notFound, noJavaScript (all 10 pages), focusWalk (20 cases: every
  focusable element reached in DOM order; minimum focus-outline contrast 5.66:1),
  reducedMotionAll, accessibility, links (35 destinations), diagramSelection,
  regression001, profile — **all PASS** after two fixes:
  - axe `label-content-name-mismatch` (serious, every page): the header brand link's
    `aria-label` "Akash K Pillai, Home" hid its visible text → label removed
    (`src/components/layout/Header.tsx`).
  - axe "incomplete" `aria-prohibited-attr`: `aria-label` on a role-less `div.flow-controls`
    → `role="group"` added (`src/components/diagrams/FlowDiagram.tsx`).
  - After fixes: 0 axe violations; 103 axe "incomplete" `color-contrast` items are SVG
    diagram text and `aria-hidden` arrows that axe cannot resolve. Manual review: every
    SVG text/fill pair computed ≥ 8.02:1 (ink or `#39444d` on `#fffdf8`, `#d7ebe6`,
    `#f5f2eb`); computed HTML text contrast minimum 4.61:1, none unresolved.
  - Visual review of viewport crops (390 hero and contact, 390 404 page, emulated 200% case
    study): no clipping or overflow. Chrome's real 200% zoom setting: **unrun** (not
    automatable here).
- **T009** `check-evidence-ids.mjs`: 49 cited IDs, 0 missing.
- **T010** `check-served-output.mjs`: served surface draft 0, personal 0; draft record only
  in server-only `src_content_projects_ts` chunks (informational). Script fixed to treat
  Next.js 16 `.next/server/route-cache/` as served and to set `process.exitCode` (a
  `process.exit` during socket close hit a Windows libuv assertion).
- **T011** evidence re-check (2026-10-25), sources: register, 002–004 specs, résumé.
  Corrections (unsupported by the register):
  - Resume Analyzer: "stray whitespace" → "trailing whitespace" (RA-02, two places);
    removed "Both the AI path and the fallback return the same result shape to the upload
    flow" (no register support).
  - Notification Platform: removed "validates the request" (not in NP-01); tradeoff "the
    caller receives an event ID" → "does not receive a delivery result".
  - HRMS and Meridian: owner-approved exact text; numbers (about 37 modules, ~250/200 test
    files, 28 documents, 30/30 reported) match the register. Profile and experience
    unchanged since 004's field-by-field check.
  - **New blocker found**: `docs/project-evidence.md` still says "Owner review of this
    register: pending" for the Resume Analyzer and Notification Platform records.
- **T012** action inventory: 47 distinct visible actions captured in
  `verification/results.json` (`checks.links.actions`); all destinations pass except
  LinkedIn (status 999 to automation → `unconfirmed`, awaiting the owner's manual check).
- **T013** demo: frontend `resume-analyzer-rosy.vercel.app` 200; backend
  `resume-analyzer-prod.onrender.com` live (`/api` Swagger 200 after a 32 s cold start).
  End-to-end flow **not run**: it requires creating an account on the owner's live service
  and spending its Groq quota — awaiting owner approval. No demo action shown.

## US2 results (2026-10-25)

- T016–T024: `src/lib/metadata.ts`, `src/content/pages.ts`, `src/app/icon.svg`,
  `src/app/og.png/route.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`; pages use
  `pageMetadata`; changelog gains a visible intro.
- **T017 fonts**: the Manrope upstream static-font repository returned 404, so the Google
  Fonts variable file `ofl/manrope/Manrope[wght].ttf` (sha256 `3ae11c49…9d6ae6`, 164,700
  bytes; default instance wght 200) was instanced with `fontTools` `varLib.instancer` (run
  via `uv run --with fonttools`, not installed in the project) → `Manrope-Medium.ttf`
  (500; 97,536 bytes; sha256 `86f23cfd…a09b2`) and `Manrope-SemiBold.ttf` (600; 97,584
  bytes; sha256 `cee433e7…6eb155a`); `OFL.txt` (sha256 `58172e0c…141f7b`).
- Homepage canonical: Next.js emits the bare origin; `absoluteUrl("/")` changed to return
  the bare origin so sitemap and canonical match (contract and data model updated).
- Sharing card headline set one sentence per line after visual review (it had broken
  "Practical / AI").
- **T025** `check-metadata.mjs`: 116 assertions, all pass (7 public pages, 3 not-found,
  sitemap, robots, `/og.png` 1200×630 PNG). Also passes against a server started
  **without** `SITE_URL`.
- **T026**: technical checks pass; owner approval of card and icon **pending**.

## T028 Performance (2026-10-25, Journal design)

Lighthouse `13.5.0`, Chrome `156`, `next start` on localhost, simulated throttling
(mobile: 150 ms RTT, 1.6 Mbps, 4× CPU; benchmarkIndex 1822.5). JSON in
`verification/lighthouse/`.

| Page | Profile | Perf | A11y | BP | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | mobile | 90 | 100 | 100 | 100 | 2.7 s | 280 ms | 0 |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 ms | 0 |
| `/work/notification-platform` | mobile | 97 | 100 | 100 | 100 | 2.3 s | 120 ms | 0 |
| `/work/notification-platform` | desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 ms | 0 |

Home mobile LCP 2.7 s exceeded the 2.5 s investigation trigger: LCP element is the hero
`h1`; breakdown TTFB 109 ms, element render delay 1,216 ms; render-blocking CSS 165 ms;
28 KiB unused JS in one chunk. No change made: the hero is being replaced by feature 006.
Limitation: localhost, no network or CDN.

## Feature paused (2026-10-26)

The owner started feature 006 (Systems Lab redesign). Per constitution V (one feature at a
time), 005 is **paused**, not abandoned. Its uncommitted application changes (setting,
metadata, sitemap, robots, sharing card, icon, content corrections, a11y fixes) remain in
the working tree and are prerequisites that 006 must preserve. Every browser, accessibility,
and performance result above describes the Journal design and becomes **stale** once 006
changes the UI; when 005 resumes, re-run T015, T026, T028 and continue from T029.

Update after 006 implementation (2026-10-26): the UI changed (Systems Lab). 005's
`run-browser-checks.mjs` now fails by design (it expects six nav items and the removed
illustrative flow); use `specs/006-systems-lab-redesign/verification/run-browser-checks.mjs`,
which carries 005's checks forward. 005's metadata, served-output, and evidence-ID scripts
still pass unchanged on the 006 build. The sharing card and icon were redrawn, so T026's owner
approval applies to the new artwork. Open
owner items: LinkedIn manual check, demo-flow approval, card/icon approval, register owner
review (Resume Analyzer, Notification Platform), production domain, 004 T028 acceptance.

## Resumed (2026-10-26): checks on the Systems Lab design, version 1.0.0

Context: owner accepted 004, 006, and 007 on 2026-10-26. Branch `feat/005-launch-readiness`
moved to `main` at `b5687cb` (it had no commits of its own); `.specify/feature.json` points to
this feature again. Package `0.5.0` then `1.0.0` (T029). Results below are from the
**uncommitted release-candidate working tree** (`b5687cb` + 005 changes) and supersede every
earlier UI, accessibility, and performance result in this file, which described the Journal
design. They become final only when re-run on the tested commit (T030–T031).

Environment: Windows 11 Home Single Language 10.0.26200; Node v24.12.0; npm 11.6.2; Chrome
156.0.8078.47 (headless); playwright-core 1.64.1; axe-core 4.14.0; Lighthouse 13.5.0;
`SITE_URL=https://portfolio.example` (reserved test host: **not releasable**); `next start` on
127.0.0.1:3100.

### T037 Site quality (FR-001–FR-006, SC-001–SC-003)

Build: lint exit 0, typecheck exit 0, build exit 0 (17 s). Suite of record
`specs/007-lab-companion-motion/verification/run-browser-checks.mjs`: **22/22 PASS, 0 errors**
(205 s), including:

| Check | Result | Measurements |
| --- | --- | --- |
| Direct routes | pass | 7 public pages 200 with full content |
| 404 and draft exclusion | pass | `/work/user-management-api`, `/work/meridian`, `/nope`: 404, title "Page not found / Akash K Pillai", links to `/` and `/work` |
| Responsive (390/768/1440, emulated 200%) | pass | 0 overflow, 0 clipped text; reduced-motion re-capture of all 16 page/width pairs: overflow 0 px, 0 transparent text |
| Keyboard and focus | pass | 20 page/width runs, 394 focusable elements, all reached in DOM order, 0 positive tabindex, lowest focus-indicator ratio 9.38:1 |
| Reduced motion | pass | every page: no moving elements, `scroll-behavior: auto`; entrance, Probe travel, and blinking off |
| JavaScript disabled | pass | every page: one h1, 5 nav links, full main text, footer `Version 1.0.0`, static project links |
| Accessibility (automated) | pass | axe tags wcag2a/aa, 21a/aa, 22aa: 0 violations on 20 runs; computed contrast over 2,166 text elements: 0 failures, 0 unresolved, lowest 5.52:1 |
| Confidentiality (003, case-study scope) | pass | 4 case-study pages 0 hits, `.next/static` 0; script exit 1 only for the 25 expected homepage Experience hits (employer names, owner-approved), same as 005/006/007 |

Manual review of axe "incomplete": all 20 are `color-contrast` "cannot determine" over the
layered background (grid, glows, translucent header); resolved by the computed-contrast check
above (0 failures). Screenshots inspected: the suite's full-page shots leave scroll-reveal
sections blank (a full-page capture never scrolls) and the 200% homepage shot exceeds Chrome's
16,384 px capture limit (content repeats); so a reduced-motion tiled set was captured and
inspected at 390 and 1440 for all 8 pages — no clipping or overlap. Observation: on phones the
docked Probe (fixed bottom-right button) overlaps a line of text until scrolled; pre-existing,
floating-button pattern, not a focus obstruction (focus walk passed).

Limitations: zoom is emulated by viewport width, not the browser zoom setting; no screen
reader test; Chrome only (no Firefox/Safari); no real devices.

### T038 Action inventory (FR-008, SC-004)

From the suite's `links` check (60 destination cases, 0 failing) and the feature checks that
operate each button. Distinct destinations and in-page actions:

| Action | Destination | Pages | Method | Date | Result |
| --- | --- | --- | --- | --- | --- |
| Akash/Systems Lab | `/` | 10 pages | automated | 2026-10-26 | pass |
| Skip to content | `/#main-content` | / | automated | 2026-10-26 | pass |
| Explore systems ↓ | `/#project-map` | / | automated | 2026-10-26 | pass |
| Version 1.0.0 | `/changelog` | 10 pages | automated | 2026-10-26 | pass |
| Skip to content | `/changelog#main-content` | /changelog | automated | 2026-10-26 | pass |
| Skip to content | `/nope#main-content` | /nope | automated | 2026-10-26 | pass |
| Resume (PDF) | `/resume/Akash_K_Pillai_Resume.pdf` | / | automated | 2026-10-26 | pass |
| View all work → | `/work` | 8 pages | automated | 2026-10-26 | pass |
| Open case study → | `/work/hrms-backend` | 5 pages | automated | 2026-10-26 | pass |
| Architecture | `/work/hrms-backend#architecture` | /work/hrms-backend | automated | 2026-10-26 | pass |
| My contribution | `/work/hrms-backend#contribution` | /work/hrms-backend | automated | 2026-10-26 | pass |
| Decisions | `/work/hrms-backend#decisions` | /work/hrms-backend | automated | 2026-10-26 | pass |
| Implementation | `/work/hrms-backend#implementation` | /work/hrms-backend | automated | 2026-10-26 | pass |
| Limitations | `/work/hrms-backend#limitations` | /work/hrms-backend | automated | 2026-10-26 | pass |
| Skip to content | `/work/hrms-backend#main-content` | /work/hrms-backend | automated | 2026-10-26 | pass |
| Problem | `/work/hrms-backend#problem` | /work/hrms-backend | automated | 2026-10-26 | pass |
| Tradeoffs | `/work/hrms-backend#tradeoffs` | /work/hrms-backend | automated | 2026-10-26 | pass |
| Meridian Assistant — Discord RAG and Proposal Agent | `/work/meridian-assistant` | 5 pages | automated | 2026-10-26 | pass |
| Architecture | `/work/meridian-assistant#architecture` | /work/meridian-assistant | automated | 2026-10-26 | pass |
| My contribution | `/work/meridian-assistant#contribution` | /work/meridian-assistant | automated | 2026-10-26 | pass |
| Decisions | `/work/meridian-assistant#decisions` | /work/meridian-assistant | automated | 2026-10-26 | pass |
| Implementation | `/work/meridian-assistant#implementation` | /work/meridian-assistant | automated | 2026-10-26 | pass |
| Limitations | `/work/meridian-assistant#limitations` | /work/meridian-assistant | automated | 2026-10-26 | pass |
| Skip to content | `/work/meridian-assistant#main-content` | /work/meridian-assistant | automated | 2026-10-26 | pass |
| Problem | `/work/meridian-assistant#problem` | /work/meridian-assistant | automated | 2026-10-26 | pass |
| Tradeoffs | `/work/meridian-assistant#tradeoffs` | /work/meridian-assistant | automated | 2026-10-26 | pass |
| Skip to content | `/work/meridian#main-content` | /work/meridian | automated | 2026-10-26 | pass |
| Notification Platform — Event-Driven Backend | `/work/notification-platform` | 5 pages | automated | 2026-10-26 | pass |
| Architecture | `/work/notification-platform#architecture` | /work/notification-platform | automated | 2026-10-26 | pass |
| My contribution | `/work/notification-platform#contribution` | /work/notification-platform | automated | 2026-10-26 | pass |
| Decisions | `/work/notification-platform#decisions` | /work/notification-platform | automated | 2026-10-26 | pass |
| Implementation | `/work/notification-platform#implementation` | /work/notification-platform | automated | 2026-10-26 | pass |
| Limitations | `/work/notification-platform#limitations` | /work/notification-platform | automated | 2026-10-26 | pass |
| Skip to content | `/work/notification-platform#main-content` | /work/notification-platform | automated | 2026-10-26 | pass |
| Problem | `/work/notification-platform#problem` | /work/notification-platform | automated | 2026-10-26 | pass |
| Tradeoffs | `/work/notification-platform#tradeoffs` | /work/notification-platform | automated | 2026-10-26 | pass |
| Resume Analyzer — AI Document Processing | `/work/resume-analyzer` | 5 pages | automated | 2026-10-26 | pass |
| Architecture | `/work/resume-analyzer#architecture` | /work/resume-analyzer | automated | 2026-10-26 | pass |
| My contribution | `/work/resume-analyzer#contribution` | /work/resume-analyzer | automated | 2026-10-26 | pass |
| Decisions | `/work/resume-analyzer#decisions` | /work/resume-analyzer | automated | 2026-10-26 | pass |
| Implementation | `/work/resume-analyzer#implementation` | /work/resume-analyzer | automated | 2026-10-26 | pass |
| Limitations | `/work/resume-analyzer#limitations` | /work/resume-analyzer | automated | 2026-10-26 | pass |
| Skip to content | `/work/resume-analyzer#main-content` | /work/resume-analyzer | automated | 2026-10-26 | pass |
| Problem | `/work/resume-analyzer#problem` | /work/resume-analyzer | automated | 2026-10-26 | pass |
| Tradeoffs | `/work/resume-analyzer#tradeoffs` | /work/resume-analyzer | automated | 2026-10-26 | pass |
| Skip to content | `/work/user-management-api#main-content` | /work/user-management-api | automated | 2026-10-26 | pass |
| Skip to content | `/work#main-content` | /work | automated | 2026-10-26 | pass |
| GitHub ↗ | `https://github.com/Akashkpillai` | / | automated | 2026-10-26 | pass |
| Source: notificationservice on GitHub | `https://github.com/Akashkpillai/notificationservice` | /work/notification-platform | automated | 2026-10-26 | pass |
| Source: resume-analyzer on GitHub | `https://github.com/Akashkpillai/resume-analyzer` | /work/resume-analyzer | automated | 2026-10-26 | pass |
| LinkedIn ↗ | `https://www.linkedin.com/in/akash-k-pillai/` | / | automated + manual (pending) | 2026-10-26 | unconfirmed (status 999 to automation; owner check T041) |
| akashkpillai55@gmail.com | `mailto:akashkpillai55@gmail.com` | / | automated | 2026-10-26 | pass |
| Ask the lab (floating Probe) (button) | in-page | / | automated (askLab, probe) | 2026-10-26 | pass |
| Ask the lab (button) | in-page | 10 pages | automated (askLab, probe) | 2026-10-26 | pass |
| Compose email → (button) | in-page | / | automated (messageForm) | 2026-10-26 | pass |
| Copy email (button) | in-page | / | automated (profile (clipboard = owner email)) | 2026-10-26 | pass |
| HRMS Backend (button) | in-page | / | automated (constellation (selects project, updates panel)) | 2026-10-26 | pass |
| Meridian Assistant (button) | in-page | / | automated (constellation (selects project, updates panel)) | 2026-10-26 | pass |
| Notification Platform (button) | in-page | / | automated (constellation (selects project, updates panel)) | 2026-10-26 | pass |
| Pause motion (button) | in-page | 10 pages | automated (motionPause) | 2026-10-26 | pass |
| Resume Analyzer (button) | in-page | / | automated (constellation (selects project, updates panel)) | 2026-10-26 | pass |
| Trace flow (button) | in-page | / | automated (constellation, probe) | 2026-10-26 | pass |

No demo action is shown (T043 decision pending; FR-009).

### T039 Metadata and generated files (SC-005)

| Script | Result |
| --- | --- |
| `check-metadata.mjs` | exit 0, "all checks passed" (titles, descriptions, canonicals, sharing tags, 404 metadata, sitemap, robots, `/og.png` 1200×630) |
| `check-served-output.mjs` | exit 0; served surface draft 0, personal 0 (7 terms); server-only chunks hold draft markers (informational, never served) |
| `check-evidence-ids.mjs` | exit 0; 51 register IDs, 49 cited, 150 citations, 0 missing |

The sharing card and icon were redrawn in 006 and accepted with it: release blocker
"owner approval of sharing card and icon" **resolved 2026-10-26**.

### T040 Performance (FR-021)

Lighthouse 13.5.0, Chrome 156, simulated throttling (mobile: 4× CPU, 150 ms RTT; desktop
preset), fresh profile (the homepage entrance plays), localhost (no network or CDN), single
runs. JSON in `verification/lighthouse/*-r2.json`.

| Page | Profile | Perf | A11y | BP | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | mobile | 95 | 100 | 100 | 100 | 2.61 s | 165 ms | 0.025 |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.59 s | 0 ms | 0.004 |
| `/work/notification-platform` | mobile | 97 | 100 | 100 | 100 | 2.55 s | 77 ms | 0 |
| `/work/notification-platform` | desktop | 100 | 100 | 100 | 100 | 0.52 s | 0 ms | 0 |

Investigation (mobile LCP above 2.5 s): LCP elements are the hero intro paragraph (`/`) and
the case-study `h1`; the one render-blocking request is the site stylesheet (estimated 155 ms
and 303 ms); the case study has no entrance animation and lands at the same time, so the
entrance is not the cause. Simulated, not measured on a network; the Journal design measured
the same 2.6 s. No change made (scores exceed the ≥ 85 target; fixing only observed failures).

### T027 and T029

- `docs/deployment.md` written for the owner per the deployment contract (host-neutral).
- `npm version 1.0.0 --no-git-tag-version`; 1.0.0 changelog entry (005 work only); footer and
  changelog read `Version 1.0.0` (suite `profile` check: package = footer = newest entry).

### Reconciliation (pre-candidate, 2026-10-26; final after T031)

| Requirement | Status | Evidence |
| --- | --- | --- |
| FR-001, SC-001 direct routes | pass | T037 direct routes, notFound |
| FR-002 404 | pass | T037 notFound (3 addresses, status 404, links) |
| FR-003, SC-002 responsive | pass | T037 responsive + reduced-motion tiled screenshots (emulated zoom) |
| FR-004, SC-003 keyboard | pass | T037 focus walk (394 elements) |
| FR-005 reduced motion / no JS | pass | T037 reducedMotionAll, noJavaScript |
| FR-006 contrast | pass (automated + manual) | T037 axe 0 violations, computed contrast ≥ 5.52:1 |
| FR-007 evidence | **open** | IDs pass (T039); owner review of RA/NP register records pending (T042) |
| FR-008, SC-004 actions | **open** | T038: all pass except LinkedIn `unconfirmed` (T041) |
| FR-009 demo | pass (no demo shown) | T043 decision pending; no demo action rendered |
| FR-010 confidentiality | pass | T039 served output; T037 confidentiality (case-study scope) |
| FR-011–FR-017, SC-005 metadata | pass on test host | T039 `check-metadata.mjs`; real domain pending (T036) |
| FR-018, SC-006 fresh install | **open** | needs tested commit (T030 → T031) |
| FR-019, SC-007 version | pass | 1.0.0 in package, footer, changelog (T029, suite `profile`) |
| FR-020, SC-008 report | **open** | this file; final rows on tested commit (T031–T032) |
| FR-021 performance | pass | T040 four Lighthouse runs, investigation recorded |
| FR-022 deployment guide | pass | `docs/deployment.md` |
| FR-023 release notes | **open** | `docs/releases/1.0.0.md` drafted; tested commit pending |
| FR-024 not published | pass | no tag, push, or deployment; status prepared — blocked |
| SC-009 owner can act from documents | pass | `docs/deployment.md`, `docs/releases/1.0.0.md` blockers table |
