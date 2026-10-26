# Verification: Recruiter-Scan Refinement (feature 008)

Actual outcomes only. Builds use `SITE_URL=https://portfolio.example`, a reserved test host:
**not releasable**. Nothing was committed, pushed, tagged, or deployed.

## T001 Context (2026-10-26)

- Root `C:\Users\HP\Desktop\akash-portfolio`. Git on `codex-sug` at `b6bcb35` (= `main` =
  `feat/005-launch-readiness`), clean tree; created `feat/008-recruiter-scan-refinement` from
  it. `SPECIFY_INIT_DIR`, `SPECIFY_FEATURE_DIRECTORY`, `SPECIFY_FEATURE` unset.
  `.specify/feature.json` moved from `specs/005-launch-readiness` to
  `specs/008-recruiter-scan-refinement`; `check-prerequisites.ps1 -PathsOnly` resolved 008.
- Feature 005's open tasks (T012–T014, T030–T036, T041–T044) are untouched and still open.
- Environment: Windows 11 (10.0.26200), Node `24.12.0`, npm `11.6.2`, Chrome `156.0.8078.47`,
  Next.js `16.4.3`; QA tools from `%TEMP%\akash-portfolio-qa-tools` (playwright-core `1.64.1`,
  axe-core `4.14.0`, Lighthouse `13.5.0`). No dependency added; `package.json` and lockfile
  unchanged.
- No reference image was received in this session; the written brief was the only input.
- Port 3100 was already held by an earlier `next start` of this repository not started in this
  session; it was left running. Feature builds were served on 3102, the baseline on 3101.

## T002 Baseline (`b6bcb35`, git worktree in `%TEMP%\akash-008-baseline`)

`measure-layout.mjs` (reduced motion, so the entrance cannot shift anything):

| Width | Hero height before → after | Top of `#work` before → after |
| --- | --- | --- |
| 390 | 1832 → 927 px | 1905 → **1000 px** |
| 768 | 1241 → 762 px | 1314 → 835 px |
| 1440 | 904 → 828 px | 977 → 901 px |

Raw data: `verification/layout-baseline-b6bcb35.json`, `verification/layout-current.json`.

## T023 Static checks

`npm run lint` exit 0; `npm run typecheck` exit 0; `npm run build` exit 0 (13 routes: `/`,
`/_not-found`, `/changelog`, `/icon.svg`, `/og.png`, `/robots.txt`, `/sitemap.xml`, `/work`, four
case studies). Re-run after the last source change: same results.

## T024 Browser suite (`verification/run-browser-checks.mjs`, against `next start -p 3102`)

Copied from 007. Assertions changed only where 008 changes behaviour:

| Check | Change | Why |
| --- | --- | --- |
| constellation | opens "Explore architecture" (keyboard) before tracing; asserts closed on load and kept open across selections | FR-003, FR-004 |
| mobileMap | two-column, non-overlapping selectors and collapsed flow instead of a stacked list | FR-005 |
| firstScreen | role, name, introduction, all three actions, every node (was headline + two links) | FR-001, FR-002, SC-001 |
| navFromEveryRoute | also `/#message` lands inside `#contact` (desktop and mobile, from 3 routes) | FR-019 |
| probe | rests at the dock with 0 moves in 30 s idle, instead of "roams off dock"; parts measured before the idle sample (the eye dozes after 30 s, pausing its float by design); opens the disclosure before tracing | FR-013, SC-005 |
| askLab | exactly four initial questions; "More questions" `aria-expanded` false → true by keyboard, focus kept; then every question answered | FR-021 |

Added: `cardText` (SC-003), `contactSection` (SC-007), `workPosition` (SC-002).

Full run (fresh `results.json`): **25 / 25 PASS**, 0 errors — responsive (10 pages × 390/768/1440/
emulated 200%, no horizontal overflow), notFound, noJavaScript, focusWalk (every focusable element
reached in DOM order; minimum focus contrast 9.38:1), reducedMotionAll, accessibility (0 axe
violations on 20 page/width cases; minimum computed text contrast 5.52:1; axe "incomplete"
colour-contrast items are SVG/gradient text it cannot resolve, as in 005–007), links (LinkedIn
"unconfirmed": blocks bots), diagramSelection, mobileNav, constellation, mobileMap, firstScreen,
navFromEveryRoute, caseStudyNav, reveal, profile, probe (idle 120 samples / 0 moves; perched 1.0 px
from the node; 0.3 px from the traced step; max travel 460 px/s against the 450 px/s cap, the same
sampling excess recorded in 007), intro, askLab (4 initial, 10 total), motionPause (0 running
animations when paused, persisted across reload), messageForm, orbit, cardText (8 cards, 0
mismatches, HRMS team attribution present), contactSection, workPosition (1905 → 1000 px).

## T025 Other checks (same build)

- `check-metadata.mjs` (005): all checks passed — titles, descriptions, canonicals, sharing,
  sitemap = published canonicals, robots, `og.png` 1200×630, 404s without canonical.
- `check-served-output.mjs` (005): served surface draft 0, personal 0; the draft record exists only
  in server-only chunks (informational, unchanged from 005).
- `check-evidence-ids.mjs` (005): 51 register IDs, 49 cited, 150 citations, 0 missing.
- `check-lab-knowledge.mjs` (007): all 12 answers from published content (191 strings).
- FR-018: `git diff` on `src/content/experience.ts`, `skills.ts`, `contact.ts`,
  `ExperienceSection.tsx`, and `src/content/case-studies/` is empty.

## T026 Screenshots (inspected)

`verification/`: `home-{1440,768,390}-fold.png` and `-full.png`, `work-{1440,768,390}-full.png`,
`hero-architecture-open-{1440,768,390}.png`, `ask-lab-1440.png`, `no-js-home.png`, suite pages, and
`before-*` captures of `b6bcb35`. Full-page captures are taken after scrolling to the bottom, so
reveals have run (the script warns if any reveal is still waiting; none did).

Findings: two-column hero at 1440 with name, intro, actions, and map above the fold; tablet
shows map beside summary; phone shows four selectors and the collapsed summary in the first
screen. Fixed during review: compact-card previews did not fill the card (old `align-items:
center`). Known, unchanged from 007: on phones the docked Probe button (fixed, bottom-right)
overlaps the right edge of text while scrolling.

## T027 Performance (Lighthouse 13.5.0, localhost `next start`, single runs)

| Page | Mobile perf | Desktop perf | A11y / BP / SEO | Mobile LCP / TBT / CLS |
| --- | --- | --- | --- | --- |
| `/` | 95 | 100 | 100 / 100 / 100 | 2.6 s / 150 ms / 0.035 |
| `/work` | 97 | 100 | 100 / 100 / 100 | 2.5 s / 70 ms / 0 |
| `/` baseline `b6bcb35` | 96 | — | — | 2.7 s / 70 ms / 0.025 |

Single localhost runs vary by a few points; no production-host measurement exists (no domain).

## Not run

Screen reader; Chrome's real 200% zoom setting (emulated only); Firefox/Safari; a real email
app receiving the composed message; a person opening the LinkedIn link; production-host
performance. Owner review of `checklists/ux.md` (26 items left unchecked for the owner).

## T028 Reconciliation

| Requirement | Evidence | Result |
| --- | --- | --- |
| FR-001, FR-002, SC-001 | firstScreen; screenshots | pass |
| FR-003, FR-004 | constellation (closed on load, keyboard open, kept open, trace) | pass |
| FR-005 | mobileMap (2 columns, ≥ 44 px, collapsed) | pass |
| FR-006 | About shows "Current focus"; hero has no focus strip (screenshots, source) | pass |
| FR-007, SC-002 | workPosition 1905 → 1000 px | pass |
| FR-008, FR-009, SC-003 | cardText; heading/intro in source and screenshots | pass |
| FR-010 | cardText layouts; 1440 screenshot | pass |
| FR-011 | no image added; diagram captions unchanged | pass |
| FR-012 | caseStudyNav, links, `/work` screenshots | pass |
| FR-013, SC-005 | Superseded by Revision 1 (below) | see Revision 1 |
| FR-014 | Spotlight and scan line removed, 3 signals, one reveal style (source); tilt per FR-025; motionPause | pass |
| FR-015 | reducedMotionAll, motionPause, noJavaScript, reveal | pass |
| FR-016, FR-023 | `package.json`, lockfile, changelog unchanged | pass |
| FR-017 | measures ≤ 38rem intros, 62ch card text (CSS); screenshots | pass (visual review) |
| FR-018 | empty diff on profile content | pass |
| FR-019, FR-020, SC-007 | contactSection, navFromEveryRoute `#message`, messageForm | pass |
| FR-021, FR-022 | askLab; `ask-lab-1440.png` | pass |
| FR-024 | `docs/design-direction.md`, `docs/roadmap.md` updated | pass |
| SC-004 | 25/25 suite, 0 axe violations, no overflow | pass |
| SC-006 | mobile 95 on `/` (≥ 90) | pass (localhost) |

**Open (owner only)**: acceptance of 008; review of `checklists/ux.md`; the release version
(no package/changelog change was made); a commit. Feature 005's release blockers are unchanged.

## Revision 1 — restrained tilt and occasional wandering (owner, 2026-10-26)

Spec, plan, research, data model, contract, and tasks (T030–T037) were updated before code.
Changed: `src/components/motion/Tilt.tsx` (restored, restrained), `src/components/work/ProjectStory.tsx`,
`src/components/lab/LabProbe.tsx`, the 008 CSS block, `docs/design-direction.md`. Nothing else.

**Static**: `npm run lint` 0, `npm run typecheck` 0, `npm run build` 0 (13 routes), re-run after the
last source change.

**Browser suite** (fresh `results.json`, `next start -p 3102`, Chrome 156): **27 / 27 PASS**, 0 errors.
Suite changes for this revision: `probe` asserts the eye starts docked (7 s window kept for the
blink check) and makes 0 moves in 20 s while a traced step is in view; new `probeWander` (SC-005)
and `cardTilt` (SC-008). A first run found a real defect — the rest timer started when a trip began,
so a slow trip left a 13.9 s rest — fixed so the rest starts after landing; the re-run passed.

| Measurement | Result |
| --- | --- |
| Wandering, 45 s with light pointer activity (1440 × 900, top of Selected work) | 2 trips (12.7 s and 38.6 s); rest 20.9 s; max 208 / 204 px/s (cap 200, frame-synced sampling over ≥ 200 ms); both landings inside the viewport over no visible text, link, or control (beside the section heading and the HRMS card title) |
| Typing in the message form, 30 s, a key every 3 s | 0 wandering trips |
| Traced step in view, 20 s | 0 moves |
| Tab reported hidden (simulated `document.hidden` + `visibilitychange`), 20 s | 0 moves, 0 animation frames |
| Motion paused, 20 s | docked, 0 moves |
| Touch phone; reduced motion | docked (probe check) |
| Reactions (unchanged) | perched 0.1 px from the node, 0.3 px from the traced step; reaction speed 460 px/s vs 450 cap (same sampling excess as 007); drag, return, click-to-open, focus return pass |
| Card tilt under a mouse (corners and centre) | max 1.92°; no scaling (matrix diagonal 0.99–1.0); 120 ms after leaving still settling, flat by 1 s |
| Keyboard focus on the card title | flat; border glow present |
| Pause pressed from the keyboard mid-tilt | flat within 1 s; stays flat while the mouse moves |
| Touch tap; reduced motion with a mouse | flat |

**Other checks** (same build): metadata all passed; served surface draft 0 / personal 0; evidence
IDs 49 cited, 0 missing; Ask the lab answers all from published content.

**Lighthouse 13.5.0** (`/`, localhost, single runs): mobile 91, 90, 96 (LCP 2.6–2.7 s, TBT
130–270 ms, CLS 0.035); desktop 100. Before this revision single runs gave 95–96; the spread suggests
a small blocking-time cost from the eight restored tilt wrappers, within the ≥ 90 target.

**Screenshots**: `verification/card-tilt-1440.png`, `verification/probe-wander-1440.png`.

**Not run**: a real hidden tab (simulated through the document API), a real touch device (emulated),
screen reader, Firefox/Safari, production-host performance.

| Requirement | Evidence | Result |
| --- | --- | --- |
| FR-013 (Revision 1) | probeWander, probe | pass |
| FR-025 | cardTilt | pass |
| SC-005 (Revision 1) | probeWander | pass |
| SC-008 | cardTilt | pass |
| SC-006 | mobile 90–96 on `/` | pass (localhost) |
