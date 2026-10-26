# Verification: Lab Companion, Ask the Lab, Motion, and Messages

Actual outcomes only; a check not listed here has not run. Builds use
`SITE_URL=https://portfolio.example` (not releasable).

## Preparation (2026-10-26)

- Spec checklist 16/16. Analysis: 0 critical/high; one medium (T015 wording ambiguous about
  how answers are collected) fixed in `tasks.md` before implementation. Constitution 2.0.0
  gates pass; 006 implemented and awaiting acceptance, 005 paused (recorded in the plan).
- delin.dev reviewed read-only from its public bundle (research.md); techniques borrowed,
  no visual design or character copied.

## T001 Baseline (2026-10-26)

Root confirmed; Git `feat/005-launch-readiness` (HEAD `0e1cd5f`, 005 + 006 work uncommitted);
`SPECIFY_*` unset; `.specify/feature.json` → `specs/007-lab-companion-motion`. lint 0,
typecheck 0, build 0.

## Implementation (2026-10-26)

New: `src/components/motion/{MotionProvider,MotionToggle,AmbientBackground,Tilt}.tsx`,
`src/components/lab/{LabProbe,AskLab,AskLabButton}.tsx`,
`src/components/profile/{MessageSection,MessageForm}.tsx`,
`src/lib/{motion,lab-knowledge,lab-answer,message-delivery}.ts`. Updated: `layout.tsx` (head
script, provider, ambient, progress bar, dialog, Probe), `Header` (toggle), `Reveal` (variants,
pause-aware), `ProjectConstellation` (ids, Probe events, packet, stagger), `SystemsLab` (Ask
button), section components (Probe tips, reveals, tilt, timeline), `CopyEmailButton`
(celebrate), `page.tsx` (Message section; Contact → 07), `globals.css` (007 blocks).
No new dependency (`package.json` unchanged).

Problems found and fixed during verification:

| Found by | Problem | Fix |
| --- | --- | --- |
| Build review | `MOTION_KEY` imported from a `"use client"` module into the server layout would arrive as a client reference | moved to `src/lib/motion.ts` |
| Code review | Provider wrote `data-motion="on"` before reading the saved pause, undoing the head script for a frame | write only once loaded |
| Screenshot | Probe tip bubble covered the panel heading | tips open above the orb toward the roomier side; map tip anchored on its title |
| Screenshot | Dialog rendered top-left (Tailwind preflight removes the UA `margin: auto`) | `margin: auto` |
| `responsive` | Homepage 8 px horizontal overflow at 390 and emulated 200% (cards waiting to slide in sideways) | `#main-content { overflow-x: clip }` (keeps sticky) |
| `motionPause` | 29 reveal transitions still running after pausing | no reveal/timeline transitions while paused |
| `probe` | Focus did not return to the Probe after closing the dialog (still `visibility: hidden` when refocused) | Probe dimmed, not hidden, under the modal (the dialog is in the top layer anyway); refocus next frame |
| `check-confidentiality` (003) | **Ask the lab knowledge shipped organization names (and the term "employer") to every page, including all four case studies** (3 matches each) | experience answer drops organization names and links to the Experience section; case-study pages back to 0 |
| Screenshot | Brand wrapped at 390 px with the new toggle | `nowrap`, tighter tracking ≤ 25rem |
| Test bugs | trace check scrolled the step off-screen (docking was correct); mailto compared byte-for-byte though Chrome serialises `'` as `%27` | scroll step into view; compare decoded subject and body |

## T026 Full verification (2026-10-26, final build)

Environment: Windows 10.0.26200, Node 24.12.0, npm 11.6.2, Chrome 156.0.8078.47,
playwright-core 1.64.1, axe-core 4.14.0, Lighthouse 13.5.0; `next start` on localhost.

| Check | Result |
| --- | --- |
| lint / typecheck / build | 0 / 0 / 0 (13 routes) |
| Browser suite (20 checks) | **All PASS**: responsive, notFound, noJavaScript, focusWalk (min focus contrast 9.38:1), reducedMotionAll, accessibility (0 axe violations, 0 text-contrast failures, min 5.52:1, 0 unresolved), links (60; LinkedIn unconfirmed), diagramSelection, mobileNav, constellation, mobileMap, firstScreen, navFromEveryRoute, caseStudyNav, reveal, profile, **probe**, **askLab**, **motionPause**, **messageForm** |
| probe | perched 4.1 px from the selected node; 0.1 px from the traced step; drag follows and springs back without opening the dialog; click opens Ask the lab; Escape returns focus; docked on touch and with reduced motion |
| askLab | opened by keyboard with focus inside; 10/10 suggestions answered with links; typed "Kafka" → Notification Platform; unknown → fallback; "hire" → contact links; empty → hint; axe on open dialog 0; Escape returns focus |
| motionPause | running animations 9 → 0 when paused; probe docked; progress bar hidden; still paused after reload (0 running); 38 running after resume |
| messageForm | empty → 3 field errors, focus on Name, "3 fields need attention."; bad email → email error only; valid → mailto subject `[Portfolio] Project — Ada Example` and exact body; confirmation; Copy message; 0 non-GET requests |
| `check-lab-knowledge.mjs` | 12 answers, 191 strings, all verbatim from `src/content`; no draft |
| 006 `check-content-preserved.mjs` | 208/208 |
| 005 evidence / metadata / served-output | 0 missing / all pass / draft 0, personal 0 |
| 003 confidentiality (case-study scope) | case-study pages 0, `.next/static` 0; 25 expected hits (homepage Experience), same as 005/006 |
| Lighthouse home desktop | perf 100, a11y 100, BP 100, SEO 100; LCP 0.6 s; CLS 0.019 |
| Lighthouse home mobile | perf 95, a11y 100, BP 100, SEO 100; LCP 2.6 s; TBT 160 ms; CLS 0.028 (targets ≥ 85, < 0.1) |

**Not run**: screen-reader testing; Chrome's real 200% zoom (emulated); a person checking
LinkedIn; the message form with a real email app (composition verified, hand-off to a mail app
not observable headless); Firefox/Safari (the scroll-progress bar is absent where
scroll-driven animations are unsupported, by design).

**Known limitations**: the docked Probe is a floating button and overlaps the edge of content
on phones, as floating buttons do; ambient signals can pass faintly behind text (background
layer, contrast unaffected); the experience answer in Ask the lab omits company names by design
(confidentiality) and links to the Experience section; Ask the lab is keyword-scripted.

## Revision 2: 3D orbit and livelier Probe (2026-10-26)

Owner request after implementation: 3D "solar system" map with revolving planets, a 3D orb,
delin.dev-style activities. Spec (US4, FR-026–FR-031, SC-009–SC-011) and tasks (T029–T033)
updated before coding.

- `src/lib/orbit.ts` (tilted ellipse rx 32 %, ry 26 %); `ProjectConstellation` revolves planets
  by transform (70 s per revolution), depth scale and z-order, spokes follow; holds still under
  the pointer, with focus inside, 10 s after a selection, off-screen, hidden tab, motion off,
  below 46rem. `LabProbe` rebuilt as CSS 3D (lit sphere, tilted ring and moon passing behind and
  in front, ground shadow) with float, scan ping, hover hop, stretch in flight, landing squash,
  throw velocity, doze "z", celebrate sparks, pointer-facing highlight, perch on top of planets,
  ride-along while the orbit moves. Old SVG Probe CSS pruned (10 rules).
- Found and fixed: `performance.now()` in a render-scope handler (React purity lint) → hold set
  by the orbit's click/pointerdown listeners; sun label contrast measured against no base colour
  → solid fallback colour under the gradient; planets left the map at 768 px → smaller tablet
  planets/sun, square tablet orbit box, rx 32 %; desktop intro jumped when a longer panel was
  selected → hero top-aligned; cramped desktop orbit → ry 26 %, 7.5rem planets.
- Tests: node clicks first point at the sun (as a visitor does; moving targets never pass
  Playwright's stability check); new `orbit` check; `probe` adds 3D-parts and landing checks.

Final build (Revision 2): lint 0, typecheck 0, build 0. Browser suite **21/21 PASS** — orbit at
768 and 1440: revolves, holds under the pointer, nearer planets larger, all inside the map;
0 px movement with reduced motion and with motion paused; probe: 3D parts present, ring and
float running, landing squash observed, perched 0.51 px from the planet's top centre; motion
pause 16 → 0 running animations (0 after reload, 44 on resume); accessibility 0 axe
violations, 0 contrast failures (min 5.52:1), 0 unresolved, focus ≥ 9.38:1. Knowledge 191/191
strings from content; content 208/208; evidence 0 missing; metadata all pass; served draft 0,
personal 0; confidentiality case-study pages 0 (25 expected homepage hits). Lighthouse home:
mobile perf 97, a11y/BP/SEO 100, LCP 2.6 s, TBT 80 ms, CLS 0.028; desktop 100s, CLS 0.004.

**Not run**: screen reader; real 200% zoom; Firefox/Safari rendering of the CSS 3D ring.

## T027 Reconciliation

| Requirements | Status |
| --- | --- |
| FR-001–FR-006 (Probe) | Pass (probe check; screenshots) |
| FR-007–FR-012 (Ask the lab) | Pass (askLab, knowledge check); FR-009 tightened: no organization names |
| FR-013–FR-017 (motion) | Pass (motionPause, reducedMotionAll, responsive/CLS, screenshots) |
| FR-018–FR-022 (messages) | Pass (messageForm) |
| FR-023 (preservation) | Pass (all 006 checks, content, metadata, served, evidence, confidentiality) |
| FR-024 (no dependency) | Pass |
| FR-025 (no release actions) | Open until owner acceptance (T028); version still 0.3.0 |
| SC-001–SC-008 | Pass |
