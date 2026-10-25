# Data Model: Engineering Case Studies

Typed local content in `src/content/`. No database or runtime fetch. Field names are a
planning contract; implementation may adjust names if the plan and this file are updated.

## Project (`src/content/projects.ts`)

| Field | Type | Rules |
| --- | --- | --- |
| `slug` | `"resume-analyzer" \| "notification-platform" \| "user-management-api"` | Unique, lowercase; matches the route |
| `order` | `1 \| 2 \| 3` | Curated order; shown as `01`–`03` |
| `status` | `"draft" \| "published"` | Published only after FR-002's gate is met |
| `title` | string | e.g. "Notification Platform — Event-Driven Backend" |
| `summary` | string | One line; no model names or metrics |
| `stack` | string[] | Only stack items in the evidence register |
| `repositoryUrl` | string | Must equal the register URL for that project |
| `reviewedCommit` | string | Full SHA from the register; shown shortened on the case study |
| `demo` | `{ url; checkedOn; flowChecked } \| undefined` | `undefined` for all three in v0.2.0 (FR-010) |
| `preview` | `{ kind: "pipeline" \| "architecture" \| "data-model"; caption }` | Kinds must all differ; caption labels it explanatory |
| `caseStudy` | `CaseStudy` | Required |

Selectors: `publishedProjects` (filtered by status, sorted by `order`) and
`getPublishedProject(slug)`. Every page, list, and `generateStaticParams` call reads only
these selectors. No Meridian record exists.

Mapping to the recorded repositories: `resume-analyzer` → `Akashkpillai/resume-analyzer`;
`notification-platform` → `Akashkpillai/notificationservice` (never `notification_service`);
`user-management-api` → `Akashkpillai/user-management-with-prisma`.

## CaseStudy (`src/content/case-studies/<slug>.ts`)

| Field | Type | Rules |
| --- | --- | --- |
| `problem` | `Claim[]` | Required, non-empty |
| `contribution` | `Claim[]` | May state sole authorship (owner-confirmed 2026-10-25) |
| `implementation` | `Claim[]` | Each behavioral claim needs evidence IDs |
| `architecture` | `ArchitectureExplanation` | Drives the diagram and its static text |
| `decisions` | `Claim[]` | Required |
| `tradeoffs` | `Claim[]` | Required |
| `limitations` | `Claim[]` | Must include every limitation recorded in the register |
| `discrepancies` | `string[]` | Internal only (e.g. README says TypeORM, code uses Prisma); not rendered |

Stack and source links come from the parent `Project`, so all nine FR-006 sections exist.

## Claim

| Field | Type | Rules |
| --- | --- | --- |
| `text` | string | Visitor-facing sentence |
| `status` | `"implemented-code-path" \| "unfinished" \| "illustrative" \| undefined` | Rendered as visible text (FR-013); `undefined` means plainly established in reviewed source |
| `evidence` | string[] | Register claim IDs such as `RA-03`; required unless the claim is the owner's contribution statement. A decision or tradeoff that states a reason must cite an owner-confirmed rationale ID (`RA-R01`…). Not rendered and not sent to the browser. |

Visible labels: `implemented-code-path` → "Implemented code path", `unfinished` →
"Unfinished", `illustrative` → "Illustrative". The status type and labels live in the
import-free `src/content/claim-status.ts` so client code never bundles project records.

## ArchitectureExplanation and DiagramComponent

| Field | Type | Rules |
| --- | --- | --- |
| `kind` | `"pipeline" \| "architecture" \| "data-model"` | Same as the project's `preview.kind` |
| `interactive` | boolean | `true` only for `notification-platform` (FR-012) |
| `title` | string | Visible diagram title and SVG `<title>` |
| `summary` | string | One-paragraph static explanation |
| `components` | `DiagramComponent[]` | Ordered in reading order |
| `links` | `{ from; to; label; status? }[]` | Edges; status uses Claim statuses |

`DiagramComponent`: `id`, `name`, `shortName?` (SVG label when `name` is long),
`responsibility`, `status?` (Claim status), `evidence[]`, `grid: { column; row }` (SVG
placement; edges are straight lines between centres).
For data models, `responsibility` lists key fields and relations; examples use fictional
data only.

## Evidence record (`docs/project-evidence.md`, not code)

Each project section gains: reviewer, review date, reviewed commit SHA, evidence paths,
a claim-ID table (`RA-01`… `NP-01`… `UM-01`…) mapping each ID to file paths and a short
statement, README/code discrepancies, owner contribution confirmation (2026-10-25),
limitations, asset provenance (none in v0.2.0), demo check (none in v0.2.0), and an
"Owner-confirmed rationale" table filled only from the owner's own words.

## State transitions

`draft → published` happens only when every FR-002 field is filled and the owner has
reviewed the register. `published → draft` removes the project from every surface at the
next build. No other states.
