# Data Model: Recruiter-Scan Refinement

Only presentation fields change; no claim, evidence ID, status, or publication field changes.

## Project (src/content/projects.ts) — one added field

| Field | Type | Rule |
| --- | --- | --- |
| `layout` | `"featured" \| "compact"` | Required. `hrms-backend`, `meridian-assistant` → featured; `notification-platform`, `resume-analyzer` → compact; draft `user-management-api` → compact (never rendered). |

Card content derived per published project (no new text):

| Card block | Source |
| --- | --- |
| Title | `title` |
| The problem | `caseStudy.problem[0].text` |
| What it does | `summary` |
| My contribution | every `caseStudy.contribution[i].text` |
| Stack | `stack` |
| Diagram | `caseStudy.architecture` + `preview` caption (explanatory) |
| Evidence label | `evidenceNote(project)` (unchanged derivation) |

## Profile (src/content/profile.ts)

| Field | Change |
| --- | --- |
| `intro` | "I build backend systems with Node.js, NestJS, and PostgreSQL, and AI features using retrieval and tool calling." (restates `about[1]`, feature 004 owner-confirmed) |
| `headline` | Unchanged; no longer shown in the hero; still the default site description |

## LabTopic (src/lib/lab-knowledge.ts) — one added field

| Field | Type | Rule |
| --- | --- | --- |
| `initial` | `boolean` (optional) | `true` for exactly four topics: `projects`, `experience`, `skills`, `contact`. |

## UI state (client only)

- Constellation: `selectedSlug`, `traceIndex`, `architectureOpen` (new; starts `false`;
  unchanged by selection; set `true` by a trace).
- Ask the lab: `moreOpen` (new; starts `false`; reset when the dialog closes is not required).
- Probe (Revision 1): `wanderRef` (element + placement of the current wandering spot, or null);
  `nextTripAt` (time of the next allowed trip); `lastKeyAt` (last key press, for the typing
  guard); `heldAt` (last selection/trace); `scrolled` flag (page-local) gates section tips.
- Tilt (Revision 1): per-card CSS variables `--tilt-x`, `--tilt-y` in degrees, clamped to ±2,
  and `data-tilting` while a fine pointer is over the card.
