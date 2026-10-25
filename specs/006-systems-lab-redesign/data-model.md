# Data Model: Systems Lab Redesign

Typed local content; no database. Existing types in `src/content/projects.ts`
(`Project`, `CaseStudy`, `Claim`, `ClaimStatus`, `ProjectSlug`) are unchanged.

## Accent (`src/content/systems.ts`)

`type Accent = "teal" | "cobalt" | "copper" | "sand"`.
`projectAccents: Record<ProjectSlug, Accent>` — fixed per project (every slug, including
drafts, so adding a project is a type error until it has an accent).

## FlowStep

| Field | Type | Rule |
| --- | --- | --- |
| `id` | `string` | Unique within its flow |
| `label` | `string` | ≤ 40 characters; shown in node/panel |
| `detail` | `string` | One sentence; supported by `evidence` |
| `evidence` | `readonly string[]` | ≥ 1 claim ID present in `docs/project-evidence.md` |
| `status` | `ClaimStatus?` | `implemented-code-path` or `unfinished` where the register says so |

## SystemFlow

| Field | Type | Rule |
| --- | --- | --- |
| `steps` | `readonly FlowStep[]` | 3–7 steps in processing order |
| `branch` | `{ from: string; label: string; steps: readonly FlowStep[] }?` | `from` is a step `id`; 1–3 steps |

`systemFlows: Partial<Record<ProjectSlug, SystemFlow>>`. A published project without a flow
still appears (panel shows summary and link only).

## LabProject (server → client props, serializable)

Built on the server from `publishedProjects` (status `published`, sorted by `order`):

| Field | Source |
| --- | --- |
| `slug` | `project.slug` |
| `name` | `project.title` before " — " |
| `title` | `project.title` |
| `summary` | `project.summary` |
| `accent` | `projectAccents[slug]` |
| `flow` | `systemFlows[slug] ?? null` |
| `position` | `{ x, y }` percentages on the ellipse, from index and count |

Drafts never become `LabProject`s (SC-002).

## EvidenceNote (derived, work previews)

`{ source: "public" | "private"; commit: string (7 chars); unfinished: boolean;
notRunEndToEnd: boolean }` from `project.source`, `project.reviewedCommit`, and the statuses
of all claims and architecture components in `project.caseStudy`.

## FocusStatement

`focusStatements: readonly string[]` = the three owner-supplied sentences (FR-011), in
`src/content/systems.ts`.

## Navigation item (`src/content/navigation.ts`)

`{ label, href }` for Work `/#work`, Experience `/#experience`, About `/#about`, Contact
`/#contact`. Resume is appended by the server only when `hasResume()` is true, as
`{ label: "Resume", href: resumeHref, download: true }`.

## Interaction state (client only, not persisted)

- `ProjectConstellation`: `selectedSlug: ProjectSlug` (default first published),
  `traceIndex: number | null` (null = not tracing; reset on selection change),
  `hydrated: boolean`.
- `CaseStudyNav`: `activeSectionId: string | null`.
- `Reveal`: `state: "shown" | "waiting" | "revealed"` (`shown` on server and with reduced
  motion).
