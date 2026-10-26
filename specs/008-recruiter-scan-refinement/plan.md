# Implementation Plan: Recruiter-Scan Refinement

**Branch**: `feat/008-recruiter-scan-refinement` | **Date**: 2026-10-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/008-recruiter-scan-refinement/spec.md`

## Summary

Refine the existing Systems Lab homepage for faster scanning without replacing its identity:
a two-column hero whose architecture flow sits behind an "Explore architecture" disclosure,
problem-first project cards in featured and compact layouts built only from existing
records, calmer motion (no timed Probe roaming, fewer decorative effects), one merged contact
section, and an Ask the lab dialog that starts with four questions. Changes are confined to
existing components, content records, and the global stylesheet; no dependency, service, or
version change.

## Technical Context

**Language/Version**: TypeScript `6.0.3` (strict), React `19.3.1`, Node.js `24.12.0`, npm `11.6.2`

**Primary Dependencies**: Next.js `16.4.3` (App Router, static prerender), Tailwind CSS `4.3.3`
(preflight only; component styles live in `src/app/globals.css`). No additions (FR-016, FR-023).

**Storage**: N/A (typed local content in `src/content/`; browser storage only for the existing
motion pause and Probe "seen" keys)

**Testing**: `npm run lint`, `npm run typecheck`, `npm run build` with
`SITE_URL=https://portfolio.example`; 007 browser suite copied to
`specs/008-recruiter-scan-refinement/verification/run-browser-checks.mjs` and adjusted only for
behaviour this spec changes; `check-lab-knowledge.mjs`, `check-evidence-ids.mjs`,
`check-metadata.mjs`, `check-served-output.mjs`; Lighthouse `13.5.0`, playwright-core `1.64.1`,
axe-core `4.14.0` from `%TEMP%\akash-portfolio-qa-tools`; Chrome `156.0.8078.47`.

**Target Platform**: Modern evergreen browsers; 320–1440+ px; keyboard and touch.

**Project Type**: Single Next.js web application (static portfolio).

**Performance Goals**: Mobile Lighthouse performance ≥ 90 on `/` (SC-006); no added client
JavaScript beyond small state in existing client components.

**Constraints**: Content visible without JavaScript and if reveal logic fails (FR-015);
transforms/opacity only for motion; reduced motion and pause remove decorative motion; no
horizontal overflow at 390/768/1440 px; 44 px minimum targets.

**Scale/Scope**: 1 homepage, `/work`, 4 case studies, changelog, 404; ~12 components and one
stylesheet touched.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
| --- | --- | --- |
| I Evidence-Based Content | Card text reuses existing evidence-cited problem, summary, and contribution claims verbatim; new hero sentence restates owner-confirmed About text; no metrics or screenshots | Pass |
| II Distinct Visual Identity | Palette, typography, grid, orbit, Probe kept; diagrams keep "explanatory" labels; no delin.dev motifs | Pass |
| III Accessible, Immediate Content | Native disclosure (works without scripts), keyboard selectors, reduced motion, visible-by-default reveals | Pass |
| IV Simple, Maintainable | No dependency; deletes the tilt wrapper and the separate message section | Pass |
| V Specification-Led | Spec → plan → tasks before code; spec Clarifications record defaults | Pass |
| VI Honest Verification | Quickstart lists every check; unrun items reported as unrun | Pass |
| VII Release Discipline | No version or changelog change; release choice left to owner | Pass |
| VIII Safe Publication | Draft exclusion unchanged; served-output check re-run | Pass |

Post-design re-check (after Phase 1): unchanged — all pass. No complexity exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/008-recruiter-scan-refinement/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-contract.md
├── checklists/requirements.md, checklists/ux.md
├── tasks.md
├── verification.md
└── verification/ (scripts, results, screenshots)
```

### Source Code (repository root)

```text
src/
├── app/globals.css                    # 008 block appended; obsolete rules removed
├── app/page.tsx                       # MessageSection removed (merged into ContactSection)
├── content/profile.ts                 # intro sentence (FR-001)
├── content/projects.ts                # `layout: "featured" | "compact"` per project (FR-010)
├── lib/lab-knowledge.ts               # `initial` flag on four topics (FR-021)
├── components/layout/SystemsLab.tsx   # two-column hero, actions, focus strip removed
├── components/lab/ProjectConstellation.tsx  # summary + "Explore architecture" disclosure
├── components/lab/LabProbe.tsx        # occasional slow wandering with rests; tips only after scroll (FR-013, Revision 1)
├── components/lab/AskLab.tsx          # four suggestions + "More questions" (FR-021, FR-022)
├── components/lab/Reveal.tsx          # single reveal style (FR-014)
├── components/motion/AmbientBackground.tsx  # 3 signals, no scan line
├── components/motion/Tilt.tsx         # restored, restrained: ±2°, fine pointer only, no spotlight (FR-025, Revision 1)
├── components/work/ProjectStory.tsx   # problem / does / contribution, layouts
├── components/work/SelectedWork.tsx   # heading and intro (FR-008)
├── components/profile/AboutSection.tsx    # current-focus list (FR-006)
├── components/profile/ContactSection.tsx  # merged contact (FR-019, FR-020)
└── components/profile/MessageSection.tsx  # deleted
docs/design-direction.md, docs/roadmap.md  # FR-024
```

**Structure Decision**: Existing single-app layout; no new modules except data fields.

## Complexity Tracking

None.

## Revision 1 (2026-10-26, owner)

Restores restrained versions of two effects that the first pass removed (spec Clarifications,
Revision 1). Same files, no new dependency.

- **Tilt** (`src/components/motion/Tilt.tsx`, `src/components/work/ProjectStory.tsx`, 008 CSS):
  pointer events only for `pointerType` mouse/pen while `(hover: hover) and (pointer: fine)` matches
  and motion is active; rAF-throttled CSS variables `--tilt-x/--tilt-y` clamped to ±2°; transform
  `perspective(1600px) rotateX() rotateY()` on the article, applied only inside
  `@media (prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)` and
  `:root:not([data-motion="paused"])`; follow transition ≈ 240 ms, return ≈ 600 ms; no spotlight,
  no scale; `:focus-within` styling untouched. The wrapper carries the grid placement
  (`project-tilt-featured|compact`).
- **Probe wandering** (`src/components/lab/LabProbe.tsx`): a rest timer schedules trips (first
  12–16 s after settling, then 18–30 s); a trip picks a visible `main h2` or `.project-story h2/h3`
  with a free spot beside its text, verified by sampling five points under the eye against a
  "busy" selector (text, links, form controls, buttons, diagrams, the map); guards: typing (text
  field focused or key in the last 5 s), dialog open (already undocks travel), drag, an attended
  target in view or selected/traced in the last 15 s, dozing, hidden tab. Wander travel caps at
  200 px/s; reactions keep 450 px/s. A wander spot that leaves the viewport clears the wander and
  docks. Touch, reduced motion, and pause already disable travel (`canTravel`).
- **Verification**: browser-suite `probe` check rewritten for SC-005 (trip count, rest, speed,
  safe landing, typing, tracing, hidden tab); new `cardTilt` check for SC-008 (mouse, leave,
  touch, reduced motion, pause, keyboard focus).
