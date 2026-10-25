# Data Model: Portfolio Foundation

This release uses local presentation data. It has no database, account, or external API.

## Profile

| Field | Meaning | Rule |
| --- | --- | --- |
| `name` | Public display name | `Akash K Pillai`; confirmed by project brief |
| `role` | Short professional positioning | Working `Backend & AI Developer`; provisional until owner confirmation |
| `headline` | Hero statement | Working `Backend systems. Practical AI. Thoughtfully built.`; provisional |
| `intro` | Short explanatory copy | No invented experience, metrics, employers, or achievements |

Keep these values in one typed profile record so the hero, metadata, and later profile sections
cannot silently diverge. Record provisional status in internal documentation. Publication
requires confirmation against the current résumé; there is no placeholder résumé action.

## Navigation item

| Field | Meaning | Rule |
| --- | --- | --- |
| `label` | Visible name | Matches the destination's purpose |
| `href` | Destination | Must resolve to a section present in this release |
| `available` | Whether content exists | Only available items render |

For v0.1.0 the available destinations are Home (`/`) and Approach (`/#approach`).
Work, Experience, About, Contact, and résumé are deferred until their content or asset exists.

## Illustrative flow stage

| Field | Meaning | Rule |
| --- | --- | --- |
| `id` | Stable stage key | Unique within the flow |
| `label` | Short visible stage name | Plain language; readable at narrow widths |
| `responsibility` | What the stage represents | Present in the static explanation and interactive detail |
| `order` | Reading and step order | Sequential and consistent across visual and text views |

The flow is generic and illustrative. Its planned stages are Input, Process, and Result:
receive a request, apply a defined transformation, and return an outcome. Copy must avoid
implying live telemetry, an existing deployment, or a verified project workflow.

## Interaction state

The trace state is either idle or a selected stage ID. Initially idle, with all stage
responsibilities visible in static text. Activating `Trace the flow` selects the first
stage. `Next step` advances through stages and returns to the first after the last; an
individual stage may be selected directly. Current state is expressed by text and an
accessible selected indication, never color alone. Reduced motion changes presentation,
not stage order or content.
