# Implementation Plan: Systems Lab Redesign

**Branch**: `feat/005-launch-readiness` (actual Git branch; 005 is paused and its work is uncommitted in the same tree — the owner decides whether to commit 005 first or branch for 006; nothing is committed by this feature) | **Date**: 2026-10-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-systems-lab-redesign/spec.md`

## Summary

Replace the Engineering Journal look with the owner's "Akash / Systems Lab" identity across
the site. The homepage becomes a three-part hero — introduction, a map of published projects
around an "AK" node, and an architecture panel whose explanatory flows cite evidence IDs —
followed by a focus strip, system-preview work cards, and the restyled profile sections.
Case studies gain a sticky system summary with section highlighting and optional reveals,
with all claims unchanged. The owner's prototype is kept as the starting point but split at
the server/client boundary so it builds, works without JavaScript, and makes no unsupported
claim. Constitution amended to 2.0.0 first. No new dependency.

## Technical Context

**Language/Version**: Strict TypeScript `6.0.3`; Node.js `24.12.0`, npm `11.6.2` (unchanged)

**Primary Dependencies**: Existing pins only (`next@16.4.3`, `react@19.3.1`,
`tailwindcss@4.3.3`); CSS transitions and `IntersectionObserver`; no animation library.

**Storage**: Typed local content (`src/content/`); new `src/content/systems.ts`.

**Testing**: lint, typecheck, build; 005's metadata, served-output, evidence-ID scripts and
003's confidentiality script unchanged; new `check-content-preserved.mjs`; Playwright browser
checks adapted from 005 plus constellation, mobile map, and case-study summary checks; axe and
computed contrast; screenshot review; one Lighthouse run as a regression signal. Tools in
`%TEMP%\akash-portfolio-qa-tools` (present: playwright-core 1.64.1, axe-core 4.14.0,
lighthouse 13.5.0).

**Target Platform**: Modern browsers; Node.js host running `next start`

**Project Type**: Single Next.js App Router website

**Performance Goals**: No regression beyond noise against 005's Journal measurements; new
client code limited to the map/panel, case-study summary, and reveal wrapper.

**Constraints**: Dark-only; WCAG 2.2 AA contrast; 44 px targets; no layout shift from motion;
no continuous motion; content visible without JS; no draft exposure; no new claims.

**Scale/Scope**: 7 public pages + 404; 4 published projects (map supports 1–6); ~12
components touched; `globals.css` re-themed.

## Constitution Check

Constitution **2.0.0** (amended 2026-10-26 at the owner's direction; principle II now the
Systems Lab identity).

| Principle | Pre-research gate | Post-design review |
| --- | --- | --- |
| I. Evidence-based content | Pass: no new claims; flows must cite IDs (FR-009) | Pass: every flow step cites register IDs; prototype's unsupported intro replaced; HRMS flow narrowed to recorded facts |
| II. Distinct visual identity (2.0.0) | Pass after amendment; before it, **violation** (resolved by the owner-directed amendment, not by weakening the spec) | Pass: tokens per research; delin.dev motifs, fake metrics, invented screenshots, telemetry framing excluded; panel labelled explanatory |
| III. Accessible, immediate content | Pass | Pass: server-rendered text; links before hydration; noscript flows; `aria-pressed`, polite live message; reduced motion removes all motion |
| IV. Simple implementation | Pass | Pass: no dependency; three small client components (`ProjectConstellation`, `CaseStudyNav`, `Reveal`) plus existing ones; typed content |
| V. Specification-led, one feature at a time | **Conditional**: 005 in progress | Pass: 005 explicitly paused with recorded state and resume steps; 006 is the only active feature |
| VI. Honest verification | Pass | Pass: quickstart lists concrete checks; unavailable tools → "not run" |
| VII. Release discipline | Pass: 0.4.0 at acceptance | Pass: no tag/push/deploy; version bump only with owner approval |
| VIII. Safe publication | Pass | Pass: drafts excluded via `publishedProjects`; served-output and confidentiality re-run |

No unjustified violations remain.

## Design Decisions

See [research](research.md) for rationale and the prototype review.

- **Theme**: dark tokens in `:root`; hard-coded light colours replaced by tokens; the
  prototype's "Systems Lab homepage direction" block rewritten onto tokens.
- **Header**: brand "AKASH / SYSTEMS LAB", nav Work/Experience/About/Contact + Resume (server
  checks the PDF; `MobileNav` receives plain items).
- **Homepage**: `SystemsLab` (server, owner's file rewritten) → intro, `ProjectConstellation`
  (client: map, panel, trace, live message, noscript list), focus strip; Approach section and
  the old `Hero` removed from the page (files kept until cleanup task decides).
- **Content**: `src/content/systems.ts` (accents, flows, focus statements);
  `src/content/navigation.ts` updated; `profile.intro` replaced with the owner-confirmed intro.
- **Work**: `ProjectStory`, `SelectedWork`, `/work` restyled with evidence notes
  (`src/lib/evidence-note.ts`).
- **Case studies**: `CaseStudyArticle` gains a two-column layout with `CaseStudyNav` and
  `Reveal`-wrapped sections; content untouched.
- **Assets**: `og.png` and `icon.svg` redrawn.
- **Docs**: `docs/design-direction.md` rewritten; dated status notes in product brief and
  roadmap.

### Requirement mapping

| Requirements | Design |
| --- | --- |
| FR-001, FR-002, FR-022 | Tokens and `globals.css`; screenshot review; axe + contrast |
| FR-003 | `Header`, `MobileNav`, `navigation.ts` |
| FR-004, FR-011, FR-012 | `SystemsLab`, `profile.intro`, `focusStatements`, homepage order |
| FR-005–FR-010 | `ProjectConstellation`, `systems.ts` flows, live message, trace |
| FR-013 | `ProjectStory`, `SelectedWork`, `work/page.tsx`, `evidence-note.ts` |
| FR-014–FR-016 | `CaseStudyArticle`, `CaseStudyNav`, `Reveal` |
| FR-017, FR-018 | CSS transitions under `prefers-reduced-motion: no-preference`; global reduce rule kept |
| FR-019, FR-020 | No change to metadata/sitemap/robots/content; 005 scripts + content-preserved check |
| FR-021 | `og.png/route.tsx`, `icon.svg` |
| FR-023–FR-026 | Focus styles, 44 px sizing, breakpoints 68rem/52rem, noscript and static lists |
| FR-027 | Acceptance task (owner) |

## Project Structure

### Documentation (this feature)

```text
specs/006-systems-lab-redesign/
├── plan.md  research.md  data-model.md  quickstart.md
├── contracts/ui.md
├── checklists/requirements.md
├── verification.md, verification/   # implementation
└── tasks.md                          # $speckit-tasks
```

### Source Code (repository root)

```text
.specify/memory/constitution.md        # 2.0.0 (done in this feature's preparation)
docs/design-direction.md               # rewritten for Systems Lab
docs/product-brief.md docs/roadmap.md  # dated status notes
src/
  app/
    globals.css                        # re-themed; prototype block rewritten
    page.tsx                           # new section order
    og.png/route.tsx  icon.svg         # redrawn
    work/page.tsx                      # preview cards
  components/
    layout/Header.tsx MobileNav.tsx    # brand, nav, Resume item
    layout/SystemsLab.tsx              # owner prototype → server hero section
    lab/ProjectConstellation.tsx       # new, "use client"
    lab/CaseStudyNav.tsx               # new, "use client"
    lab/Reveal.tsx                     # new, "use client"
    work/ProjectStory.tsx SelectedWork.tsx CaseStudyArticle.tsx
    profile/*Section.tsx               # renumbered labels only
  content/
    systems.ts                         # new: accents, flows, focus statements
    navigation.ts profile.ts           # nav items; intro
  lib/evidence-note.ts                 # new
```

**Structure Decision**: Same single Next.js app; new `src/components/lab/` holds the three
client enhancements.

## Complexity Tracking

No unjustified constitution violations. The principle II conflict was resolved by an
owner-directed amendment (2.0.0), recorded in the constitution's Sync Impact Report.
