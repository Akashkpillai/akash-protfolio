# Data Model: Additional Case Studies

Extends the [002 data model](../002-engineering-case-studies/data-model.md). Only changes
are listed; everything else (CaseStudy, Claim, ArchitectureExplanation, DiagramComponent,
evidence rules, owner-confirmed rationale) is unchanged.

## Project changes (`src/content/projects.ts`)

| Field | Type | Rules |
| --- | --- | --- |
| `slug` | adds `"meridian-assistant" \| "hrms-backend"` | Neither names a company |
| `order` | number | Published order: hrms-backend 1, meridian-assistant 2, notification-platform 3, resume-analyzer 4; user-management-api 5 (draft) |
| `status` | unchanged | `user-management-api` becomes `"draft"` |
| `source` | `{ kind: "public"; url: string } \| { kind: "private" }` | Replaces `repositoryUrl`. Public URLs must equal the register URL. Meridian and HRMS are `private` |
| `preview.kind` | adds `"workflow"` | Published kinds all differ: pipeline, architecture, workflow, and HRMS's kind |
| `screenshot` | `{ src; alt; width; height; provenance; approvedOn } \| undefined` | Set only after owner approval and sanitization (FR-008); `undefined` until then |

`repositoryName(project)` returns a name only for public sources.

## Text rules for the two new case studies

- No company, employer, client, or interview is named or described (FR-006).
- HRMS text and diagram: no code, paths, internal service or repository names, hosts,
  URLs, credentials, people's names or data, or business figures (FR-004).
- Self-reported results are written as reported ("the project's test suite reports …")
  (FR-007).
- HRMS `status` stays `"draft"` until the owner approves the exact text; the approval
  date is recorded in the register (FR-005).

## Evidence record changes (`docs/project-evidence.md`)

- Section 04 (Meridian) is rewritten without background context or local paths.
- New section 05 (HRMS backend): reviewed commit, review date, reviewer, module-level
  claim table (`HR-01`…), limitations (`HR-L1`…), owner-confirmed contribution,
  owner-confirmed permission to publish (2026-10-25, no company named), owner text
  approval date. No paths or internal names.
- File-level HRMS evidence lives in gitignored `private-evidence/hrms.md`.

## State transitions

Unchanged from 002. `user-management-api`: `published → draft`. `meridian-assistant` and
`hrms-backend`: `draft → published` only when FR-002 and, for HRMS, FR-005 are met.
