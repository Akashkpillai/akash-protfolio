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
