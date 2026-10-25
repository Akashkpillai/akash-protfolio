# Implementation Plan: Additional Case Studies — Meridian Assistant and HRMS Backend

**Branch**: `feat/002-engineering-case-studies` (actual Git branch; no 003 branch yet) | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-additional-case-studies/spec.md`

**Note**: The setup script reported `003-additional-case-studies` from Spec Kit context.
Git is still on the 002 branch with 002's work uncommitted; commit 002 and create a 003
branch before implementation.

## Summary

Add Meridian Assistant and an HRMS backend as published case studies, unpublish User
Management API, and reorder the published set to HRMS, Meridian, Notification Platform,
Resume Analyzer. Both new projects have private source, so the source row becomes a
neutral "Source code is private" statement. No company, employer, or interview is named
anywhere public or committed. HRMS evidence is split: publishable module-level claims in
the register, file-level paths in a gitignored private file. Meridian gains a new static
`workflow` diagram and an optional approved screenshot. Everything reuses 002's content
system; no new dependency.

## Technical Context

**Language/Version**: Strict TypeScript `6.0.3`; Node.js `24.12.0` (unchanged)

**Primary Dependencies**: Existing pins only (`next@16.4.3`, `react@19.3.1`,
`tailwindcss@4.3.3`); `next/image` from the installed framework for the screenshot.

**Storage**: Typed local content in `src/content/`; register in `docs/project-evidence.md`;
gitignored `private-evidence/hrms.md` for file-level HRMS evidence.

**Testing**: lint, typecheck, build; `curl` status checks on `next start`; Playwright
browser checks reusing 002's tooling; confidentiality term search; claim trace.

**Target Platform**: Modern browsers; Node.js 20.9+ to build and run

**Project Type**: Single Next.js App Router website

**Performance Goals**: Unchanged from 002; homepage adds no client JavaScript.

**Constraints**: No company/employer/interview mention in public or committed files
(FR-006); HRMS confidentiality (FR-004); HRMS publish only after owner text approval
(FR-005); screenshot only after approval and sanitization (FR-008); drafts absent from
client bundles.

**Scale/Scope**: 4 published case studies (2 new), 1 unpublished; 1 new diagram wrapper;
up to 1 image asset.

## Constitution Check

| Principle | Pre-research gate | Post-design review |
| --- | --- | --- |
| I. Evidence-based content | Pass: Meridian reviewed at `22ca5b0`; HRMS review precedes copy; owner statements recorded | Pass: register IDs for every claim; private file keeps file-level traceability; self-reported results attributed |
| II. Distinct visual identity | Pass: reuses 002 design | Pass: four distinct preview kinds; screenshot shown only as genuine capture |
| III. Accessible, immediate content | Pass | Pass: static text for every diagram; new diagrams static |
| IV. Simple implementation | Pass: no new service | Pass: no dependency; one small diagram wrapper; `next/image` built in |
| V. Specification-led | Pass: spec clarified (3 answers), 16/16 checklist | Pass: FR→design mapping below; 002's three-project scope is superseded by this spec, recorded in its Assumptions |
| VI. Honest verification | Pass | Pass: quickstart lists concrete checks; none claimed as run |
| VII. Release discipline | Pass: part of v0.2.0 | Pass: no version bump or changelog, per 002's decision |
| VIII. Safe publication | Pass: drafts and private material excluded | Pass: private evidence gitignored; term search over register and build output; HRMS draft until owner approves text |

No violations; Complexity Tracking is empty.

**Open governance note**: `AGENTS.md` says never to reuse HRMS feature state,
constitution, or configuration. This plan reads HRMS source only as evidence and copies
nothing; it does not reuse HRMS Spec Kit state or configuration.

## Design Decisions

### Evidence first

1. Rewrite register section 04 (Meridian) without background context, local paths, or the
   private repository's owner/name beyond "private repository".
2. Review the HRMS local copy read-only (see [research](research.md)); write
   `private-evidence/hrms.md` (gitignored) with file paths, and register section 05 with
   module-level claims only.
3. Draft both case studies from claim IDs; HRMS stays draft until the owner approves its
   exact text.

### Content and routing

- `src/content/projects.ts`: `source` union replaces `repositoryUrl`; `order` numeric;
  slugs and `workflow` kind added; optional `screenshot`; User Management API → draft;
  new records for `meridian-assistant` and `hrms-backend`.
- `src/content/case-studies/meridian-assistant.ts`, `hrms-backend.ts`: new.
- `src/app/work/[slug]/page.tsx`, `/work`, not-found: unchanged code; they read the
  selectors.

### Components

- `CaseStudyArticle`: source row handles `private`; renders the optional screenshot.
- `src/components/diagrams/WorkflowDiagram.tsx`: new static wrapper over `DiagramCanvas`.
- `ProjectPreview`: kind label for `workflow`; screenshot preview when present.
- `SelectedWork`: heading copy for four projects; layout cycle unchanged in code.

### Requirement mapping

| Requirements | Design |
| --- | --- |
| FR-001, FR-012 | New case-study records; `WorkflowDiagram`; HRMS diagram kind from review |
| FR-002, FR-005, FR-007 | Register sections 04/05; owner approvals recorded; attributed wording |
| FR-003, FR-006, FR-011 | `source: private`; neutral copy; no company anywhere |
| FR-004 | Module-level register; gitignored private evidence; term search |
| FR-008 | Optional `screenshot`, gated; banner cropped; user ID removed |
| FR-009, FR-016 | `order` values; User Management API draft |
| FR-010 | Existing `[slug]` route with `dynamicParams = false` |
| FR-013, FR-014 | 002 + 001 regression checks; responsive and accessibility checks |
| FR-015 | No version or changelog change |

## Project Structure

### Documentation (this feature)

```text
specs/003-additional-case-studies/
  spec.md
  checklists/requirements.md
  plan.md
  research.md
  data-model.md
  contracts/ui.md
  quickstart.md
  tasks.md                 # /speckit-tasks output; not created here
  verification.md          # created during implementation
```

### Source Code (changes planned, not made)

```text
.gitignore                                # add private-evidence/
private-evidence/hrms.md                  # new, gitignored
docs/project-evidence.md                  # sections 04 rewritten, 05 added
public/work/meridian-assistant/           # approved screenshot only, if any
src/
  content/
    projects.ts                           # source union, order, slugs, UM → draft
    case-studies/
      meridian-assistant.ts               # new
      hrms-backend.ts                     # new
  components/
    work/CaseStudyArticle.tsx             # private source row, screenshot
    work/ProjectPreview.tsx               # workflow label, screenshot preview
    work/SelectedWork.tsx                 # heading copy
    diagrams/WorkflowDiagram.tsx          # new
  app/globals.css                         # appended styles only
```

**Structure Decision**: Same single App Router app; extends 002's files.

## Complexity Tracking

No constitution violations.
