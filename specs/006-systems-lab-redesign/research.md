# Research: Systems Lab Redesign

Research date: 2026-10-26. Stack unchanged (`next@16.4.3`, `react@19.3.1`,
`tailwindcss@4.3.3`, TypeScript `6.0.3`, Node.js `24.12.0`, npm `11.6.2`); no new
dependency. Bundled Next.js docs read: `02-guides/server-and-client-boundary.md`,
`01-getting-started/13-fonts.md`, `03-api-reference/04-functions/image-response.md`.
Starting point: feature 005's uncommitted work plus the owner's prototype
(`src/components/layout/SystemsLab.tsx`, a "Systems Lab homepage direction" block in
`globals.css`, and `page.tsx` rendering `<SystemsLab />`).

## Governance

**Decision**: Constitution amended 1.0.0 → 2.0.0 (principle II now the Systems Lab identity;
all delin.dev prohibitions kept; fake metrics, invented screenshots, and diagrams-as-telemetry
added). `docs/design-direction.md` is rewritten for Systems Lab; the product brief gains a
dated status note. `AGENTS.md` still says "Follow The Engineering Journal design" — it is the
owner's instruction file and is left for the owner to update (reported, not edited).

## Prototype review

The prototype is a single `"use client"` component holding the navigation, hero, map, panel,
and focus strip. Kept: the brand treatment, three-part hero grid, orbit lines, central "AK"
node, node buttons with `aria-pressed`, panel, focus strip, and the colour direction.
Changed, with reasons:

| Prototype | Problem | Change |
| --- | --- | --- |
| Imports `ResumeLink` (uses `node:fs` via `hasResume`) into a client component | Everything a client module imports joins the browser bundle; `node:fs` cannot | Server components check the résumé and pass plain data (`resumeHref: string \| null`) |
| Navigation inside the homepage section | FR-003 needs it on every page | Restyle the shared `Header`/`MobileNav` |
| "I design and build reliable backend systems … that solve real problems." | "reliable" and outcome claims are not in the register | Intro from owner-confirmed About text (FR-004) |
| Flow = first four architecture components | Order is a grid layout, not a flow; no evidence or status shown | Typed per-project flows with evidence IDs and status (FR-009) |
| Nodes at fixed positions for three projects | Four are published; count may change | Positions computed from the count (1–6) |
| `aria-live` on the whole panel | Re-reads the full panel on every change | One short visually hidden live message |
| No no-JS state; nodes are dead buttons without JS | Spec edge case | Server render nodes as links to case studies; `<noscript>` lists every flow |
| Unicode glyph icons (`□ ⌁ ◈`) | Arbitrary, read by some screen readers | Decorative CSS shapes, `aria-hidden` |

## Theming

**Decision**: Redefine the existing tokens in `:root` for a dark theme (dark-only) and replace
the hard-coded light colours (`#39444d` ×17, `#4a555e` ×11, `#d7ebe6`, `#fffdf8`, …) with
tokens. Token names stay (`--color-canvas`, `--color-surface`, `--color-ink` = primary text,
`--color-line`, `--color-teal`, `--color-copper`) so 110 existing uses keep working; new
tokens: `--color-surface-2`, `--color-muted`, `--color-subtle`, `--color-cobalt`,
`--color-sand`, `--color-focus`, `--color-grid`. The prototype's ad-hoc hex values move onto
these tokens.

| Token | Value | Use | Contrast on canvas `#0d1116` |
| --- | --- | --- | --- |
| `--color-canvas` | `#0d1116` | page background | — |
| `--color-surface` | `#131a21` | panels, cards | — |
| `--color-surface-2` | `#18212a` | raised / selected | — |
| `--color-ink` | `#f1ebe2` | primary text (warm off-white) | ≈ 16:1 |
| `--color-muted` | `#aab4bc` | secondary text | ≈ 8.9:1 |
| `--color-subtle` | `#8695a0` | labels, captions | ≈ 6.0:1 |
| `--color-line` | `#2a3540` | borders, grid | decorative |
| `--color-teal` | `#2fd3c4` | accent 1, focus | ≈ 10:1 |
| `--color-cobalt` | `#6f9bff` | accent 2, links | ≈ 7:1 |
| `--color-copper` | `#de8a5f` | accent 3, kickers | ≈ 7:1 |
| `--color-sand` | `#d9c27a` | accent 4 | ≈ 10:1 |

Ratios are design estimates; the computed-contrast and axe checks are authoritative (FR-022).
Glow (`box-shadow` with accent at low alpha) only on focus, selection, and the "AK" node.

**Alternatives considered**: a parallel dark stylesheet (two themes to maintain, no light
theme requested); renaming every token (large diff, no benefit).

## Typography

**Decision**: Keep Manrope (display) and Source Sans 3 (body); labels use Manrope uppercase
with letter-spacing as in the prototype. No monospace font is added (no requirement needs it;
avoids another font download).

## Homepage structure and the client boundary

**Decision**:

- `src/components/layout/SystemsLab.tsx` (the owner's prototype file, rewritten in place as a
  server component, so no second copy exists): section `#systems`; renders the intro, the
  client `ProjectConstellation` (`src/components/lab/`), and the focus strip.
- `ProjectConstellation` (client): receives serializable `LabProject[]` (slug, title, short
  name, summary, accent, flow) built on the server from `publishedProjects` + flows. Renders
  map, panel, trace control, and live message. CSS grid `display: contents` lets the map and
  panel be the hero's second and third columns.
- No-JS / pre-hydration: a hydration flag (`useSyncExternalStore`, same pattern as
  `FlowDiagram`) renders nodes as links to `/work/<slug>` until hydration, then as buttons
  with identical box styles (no layout shift). The panel shows the first project in both
  states. A `<noscript>` block lists every project's flow as text (FR-026, edge case).
- Selection state: `selectedSlug` (default first published project). Node activation by
  click/tap/Enter/Space (native button). Focus stays on the node (FR-008).
- Announcement: a visually hidden `aria-live="polite"` paragraph: "Showing <name>: <n> steps."
  and during tracing "Step <i> of <n>: <label>."

**Alternatives considered**: whole homepage as one client component (prototype; ships
content as JS and breaks the `node:fs` boundary); radio-group semantics for nodes (spec and
owner brief ask for `aria-pressed` buttons; toggle buttons with one pressed are acceptable
for a single-select set and match the existing diagram controls).

## Node layout

**Decision**: On wide screens nodes sit on an ellipse around the centre, angle
`-90° + i × 360°/n`, positions set as CSS custom properties (`--x`, `--y` in %) computed on
the server from the count; connector lines drawn in one decorative SVG behind the nodes.
At ≤ 52rem the map becomes a vertical list: the centre node becomes a small header row, nodes
become full-width cards (min 44 px tall; actual ≈ 64 px), and connectors become a vertical
rail. The panel follows the list (phones) or spans below the map (tablet, ≤ 68rem).

## Flow content

**Decision**: New `src/content/systems.ts`: `systemFlows: Partial<Record<ProjectSlug,
SystemFlow>>` and `projectAccents`. Each step has `label`, `detail`, `evidence` (claim IDs),
and optional `status` (`ClaimStatus`). One optional `branch` (alternate path) per flow.
Flows (all from the register):

- **Resume Analyzer**: PDF upload (RA-01) → Text extraction (RA-02) → Cleanup (RA-02) →
  AI parsing via the Groq API (RA-03, RA-L1) → Structured record in PostgreSQL (RA-06) →
  Search and filters (RA-07, RA-08, RA-09); branch from AI parsing: Basic fallback parser
  (RA-04, RA-L2), status implemented-code-path.
- **Notification Platform**: API gateway (NP-01) → Kafka topics (NP-D1, NP-06) → Router
  stores pending record (NP-02, NP-07) → Email / SMS workers (NP-03, NP-04;
  implemented-code-path) → Status recorded in PostgreSQL (NP-03, NP-L3;
  implemented-code-path, detail states the ID mismatch is unexercised); branch: Push worker
  (NP-L1, unfinished). Retry/dead-letter mentioned in the worker step detail (NP-05, NP-L2).
- **HRMS Backend**: Tenant-scoped data (HR-02) → HR module, e.g. leave or attendance
  (HR-01, HR-03, HR-04) → Shared approval workflow, team-built (HR-D2, HR-L1) → Audit and
  PostgreSQL via TypeORM (HR-10, HR-01) → Email notification with retries (HR-08, HR-D3).
- **Meridian Assistant**: Discord slash command (MA-01) → Actor check, one brand per user
  (MA-02, MA-06) → Brand-filtered retrieval, top 5 (MA-03) → Answer only with retrieved
  sources (MA-04); branch: Proposal estimate → stored approval → DOCX render (MA-07, MA-08,
  MA-09).

The prompt's "tenant request → … → response" for HRMS is narrowed to what HR-xx records; a
"response" step is not claimed. The panel label: "Explanatory diagram from the reviewed
source — not live system data." `check-evidence-ids.mjs` already scans every
`evidence: [...]` array in `src/content`, so flows are covered.

## Accents

**Decision**: `projectAccents: Record<ProjectSlug, Accent>` with `Accent = "teal" | "cobalt" |
"copper" | "sand"`: Resume Analyzer teal, Notification Platform cobalt, HRMS copper, Meridian
sand, User Management API teal (unused while draft). Fixed per project (not by index) so a
project keeps its colour when others change. Names always shown (no colour-only meaning).

## Trace flow

**Decision**: A user-driven trace: "Trace flow" highlights step 1 and its connector; each
press advances ("Next step"); at the end "Restart". The live message names the step. With
motion allowed the connector into the current step animates (stroke-dashoffset, 400 ms,
once); with reduced motion the highlight is immediate. No timers, so nothing moves on its own
(WCAG 2.2.2) and no continuous animation (FR-017).

## Case-study enhancements

**Decision**:

- `CaseStudyNav` (client, small): renders the system summary — flow step list (static) and
  section links Problem … Limitations — and marks the section in view with `aria-current="true"`
  via `IntersectionObserver`. Without JS the links still work. On wide screens it sits in a
  sticky second column; on narrow screens it renders once after the header (FR-015).
- `Reveal` (client wrapper, children pass through from the server per the docs' `children`
  pattern): content is visible by default; after hydration, if motion is allowed and the
  element starts below the viewport, it is set to a hidden state and revealed (opacity +
  12 px translate, 300 ms) on intersection. Transform/opacity do not shift layout (FR-016).
- Claims, labels, and diagram markup are unchanged; only styles change.

## Work previews

**Decision**: Restyle `ProjectStory`/`SelectedWork` and `/work`: title, summary, stack chips,
evidence note, the existing explanatory preview diagram, and "Open case study". Evidence note
derived from data, not written by hand: "Public source · reviewed at <short commit>" or
"Private source · reviewed read-only", plus "Includes unfinished parts" when any claim or
component is `unfinished`, or "Some paths not run end to end" when any is
`implemented-code-path`.

## Generated assets

**Decision**: `og.png` redrawn: canvas `#0d1116`, faint grid lines, "AKASH / SYSTEMS LAB",
name, role, headline one sentence per line, teal rule; fonts read once at module scope (per
the `ImageResponse` docs). `icon.svg` redrawn: dark rounded square, teal "AK" node ring with
three small accent dots (paths and circles only).

## Verification

Reuse 005's tooling (`%TEMP%\akash-portfolio-qa-tools`: playwright-core 1.64.1, axe-core
4.14.0, lighthouse 13.5.0; Chrome 156). New `specs/006-systems-lab-redesign/verification/`:

- `run-browser-checks.mjs`: 005's script adapted (5 nav items, no Approach section) plus
  `constellation` (pointer, Enter, Space, touch tap; `aria-pressed`; live message; panel
  link; trace), `mobileMap` (cards stacked, ≥ 44 px), `caseStudyNav` (sticky on desktop,
  `aria-current` changes on scroll), reveal visibility with and without motion.
- `check-content-preserved.mjs`: every `text:`/`responsibility:` string in
  `src/content/case-studies/*.ts` (published projects) appears in its rendered case study;
  every experience highlight, skill, and contact link appears on the homepage (SC-008).
- 005's `check-metadata.mjs`, `check-served-output.mjs`, `check-evidence-ids.mjs`, and 003's
  confidentiality script re-run unchanged (SC-009).
- Lighthouse home mobile/desktop once, as a regression signal only.
