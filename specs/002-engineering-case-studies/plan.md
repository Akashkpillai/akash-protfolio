# Implementation Plan: Engineering Case Studies

**Branch**: `feat/002-engineering-case-studies` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-engineering-case-studies/spec.md`

**Note**: The setup script reported `002-engineering-case-studies` from Spec Kit context.
The actual Git branch above was independently verified.

## Summary

Add three evidence-based case studies to the v0.1.0 foundation: a homepage selected-work
section with numbered stories and three different kinds of explanatory preview, a `/work`
index, and prerendered `/work/[slug]` pages. Unknown and draft slugs return 404. Content
is typed local data in which every claim carries evidence IDs and an optional visible
status label. Before any copy is written, the three recorded repositories are reviewed
read-only at pinned commits and `docs/project-evidence.md` is updated. Everything is
server-rendered; the only new Client Component is the Notification Platform diagram's
component selection. No new dependencies.

## Technical Context

**Language/Version**: Strict TypeScript `6.0.3`; Node.js `24.12.0` (unchanged from 001)

**Primary Dependencies**: Existing pins only: `next@16.4.3`, `react@19.3.1`,
`react-dom@19.3.1`, `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`. No additions
(see [research](research.md)).

**Storage**: Typed local content in `src/content/`; evidence register in
`docs/project-evidence.md`. No database or runtime GitHub call.

**Testing**: `npm run lint`, `npm run typecheck`, `npm run build`; `curl` status checks
against `next start`; browser checks with `playwright-core` from a temp tools directory
(as in 001); manual claim-to-evidence review.

**Target Platform**: Modern desktop and mobile browsers; Node.js 20.9+ to build and run

**Project Type**: Single Next.js App Router website

**Performance Goals**: All case-study text in the initial HTML; no client JavaScript on
static pages beyond the existing shell; measure, don't promise, scores.

**Constraints**: No horizontal scroll at 390/768/1440 px or 200% zoom; readable without
JavaScript; reduced motion honored; no dead links; Meridian and `notification_service`
absent; no demo actions; no screenshots.

**Scale/Scope**: 3 published projects, 5 new or changed routes (`/`, `/work`, 3 case
studies) plus a not-found page; 3 diagrams (1 interactive).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Pre-research gate | Post-design review |
| --- | --- | --- |
| I. Evidence-based content | Pass: spec limits copy to the register; contribution owner-confirmed 2026-10-25 | Pass: claim records require evidence IDs ([data model](data-model.md)); source review comes before copy; no Meridian record |
| II. Distinct visual identity | Pass: reuses the foundation's tokens and type | Pass: varied story compositions, three different preview kinds, prohibited motifs excluded ([UI contract](contracts/ui.md)) |
| III. Accessible, immediate content | Pass: no-JS, keyboard, and reduced-motion requirements in the spec | Pass: server-rendered text; static diagram equivalents; native buttons with `aria-pressed` and a live region |
| IV. Simple implementation | Pass: no new service | Pass: no new dependency; MDX rejected with rationale; one small Client Component |
| V. Specification-led | Pass: spec clarified, 16/16 quality items, branch and feature verified | Pass: FR→design mapping below; tasks deferred to `/speckit-tasks` |
| VI. Honest verification | Pass: measurable success criteria | Pass: [quickstart](quickstart.md) lists concrete checks; none claimed as run |
| VII. Release discipline | Pass: v0.2.0 target per roadmap | Pass: per clarification, no `CHANGELOG.md` and no version bump in this feature; v0.2.0 is not an accepted release until feature 003 (see research) |
| VIII. Safe publication | Pass: drafts excluded; cloned sources treated as untrusted data | Pass: `dynamicParams = false`, single published selector, no sitemap added, no private material |

No violations; Complexity Tracking is empty. The publication gate stays open until the
owner reviews the updated evidence register.

## Design Decisions

### Evidence first

Implementation begins with the source review: shallow-clone each recorded repository into
a fresh scratchpad directory, record `HEAD`, read the files listed in the register, and
add the reviewed commit, reviewer, date, claim-ID table, and discrepancies to
`docs/project-evidence.md`. Claims the code doesn't support are dropped or labeled before
being written into content. Specific details such as retry thresholds, entity fields, and
pipeline stages come only from this review. Clones are never executed or copied in.

### Content and routing

`src/content/projects.ts` defines the `Project`, `CaseStudy`, `Claim`, and diagram types
plus the `publishedProjects` and `getPublishedProject` selectors. Each case study lives in
`src/content/case-studies/<slug>.ts`. `src/app/work/page.tsx` renders the index;
`src/app/work/[slug]/page.tsx` uses `generateStaticParams` (published slugs only),
`dynamicParams = false`, `generateMetadata`, and `notFound()` as a backstop.
`src/app/not-found.tsx` is the shared 404 page. No sitemap in this feature.

### Components

Server Components in `src/components/work/`: `SelectedWork` (homepage `#work`),
`ProjectStory` (numbered story with alternating composition), `ProjectPreview` (chooses
the compact diagram by `preview.kind`), `CaseStudyArticle` (sections in contract order),
`ClaimList` and `ClaimStatus` (visible status text). Diagrams in `src/components/diagrams/`:
`PipelineDiagram` and `DataModelDiagram` (server, static), `ArchitectureDiagram` (client,
selection), each with a `compact` preview mode, sharing hook-free drawing and text pieces
in `DiagramCanvas`. `ProjectPreview` renders `DiagramCanvas`'s static compact view for all
three kinds, so the homepage adds no client JavaScript. `ArchitectureDiagram` copies
`FlowDiagram`'s enhancement pattern; `FlowDiagram` is not modified. Evidence IDs are
stripped before props reach the Client Component, and claim-status labels live in
import-free `src/content/claim-status.ts`, so no project record reaches the browser.

### Changes to v0.1.0 files (extend, don't rewrite)

- `src/content/navigation.ts`: hrefs become `/`, `/#work`, `/#approach`.
- `src/components/layout/Header.tsx`: brand href `#home` → `/`.
- `src/components/layout/Hero.tsx`: add a "View selected work" link; keep "Explore the flow".
- `src/app/page.tsx`: insert `<SelectedWork />` between hero and Approach; Approach eyebrow
  `02` → `03`.
- `src/app/globals.css`: append new classes using existing tokens; existing rules untouched.

### Requirement mapping

| Requirements | Design |
| --- | --- |
| FR-001, FR-002, FR-008 | Status field, published selector, evidence-first review, no Meridian record |
| FR-003, FR-004, FR-015 | `SelectedWork`, `/work`, route-absolute navigation |
| FR-005, FR-007, FR-009 | Prerendered `[slug]`, `dynamicParams = false`, not-found page, server rendering |
| FR-006, FR-013, FR-014 | `CaseStudy` sections, `Claim.status` labels, evidence IDs |
| FR-010, FR-011 | `demo` undefined; explanatory captions; no screenshots |
| FR-012 | Static text lists for all diagrams; selection only in `ArchitectureDiagram` |
| FR-016, FR-017, FR-018 | Existing tokens and breakpoints; 001 regression checks |

## Project Structure

### Documentation (this feature)

```text
specs/002-engineering-case-studies/
  spec.md
  checklists/requirements.md
  plan.md
  research.md
  data-model.md
  contracts/ui.md
  quickstart.md
  tasks.md                 # /speckit-tasks output; not created here
  verification.md          # created during implementation
  verification/            # browser-check script and screenshots
```

### Source Code (repository root; new files planned, not created)

```text
docs/project-evidence.md                 # updated by source review
src/
  app/
    page.tsx                             # changed: inserts SelectedWork
    globals.css                          # changed: appended styles
    not-found.tsx                        # new
    work/
      page.tsx                           # new
      [slug]/page.tsx                    # new
  components/
    layout/Header.tsx, Hero.tsx          # changed: hrefs, one hero link
    work/
      SelectedWork.tsx
      ProjectStory.tsx
      ProjectPreview.tsx
      CaseStudyArticle.tsx
      ClaimList.tsx
      ClaimStatus.tsx
    diagrams/
      FlowDiagram.tsx                    # unchanged
      DiagramCanvas.tsx                  # shared SVG, text list, compact view
      PipelineDiagram.tsx
      ArchitectureDiagram.tsx            # "use client"
      DataModelDiagram.tsx
  content/
    navigation.ts                        # changed: route-absolute hrefs
    claim-status.ts                      # new: import-free status labels
    projects.ts                          # new
    case-studies/
      resume-analyzer.ts
      notification-platform.ts
      user-management-api.ts
```

**Structure Decision**: Same single App Router app as 001, with `components/work/` and
`content/case-studies/` added per build-guide section 4. Planning and Spec Kit directories
stay at the root.

## Complexity Tracking

No constitution violations.
