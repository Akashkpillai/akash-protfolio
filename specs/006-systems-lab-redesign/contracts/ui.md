# UI Contract: Systems Lab Redesign

Visible structure, semantics, and behaviour every public page must expose. Entities:
[data model](../data-model.md). Metadata, sitemap, robots, sharing tags, and 404 status follow
feature 005's [site metadata contract](../../005-launch-readiness/contracts/site-metadata.md)
unchanged, except the sharing image and icon artwork.

## Global

- Dark-only theme on every page (`body` background is the canvas token). No light-theme
  fallback is promised.
- Skip link "Skip to content" first in tab order, targets `#main-content`.
- Header: brand link "AKASH / SYSTEMS LAB" (accessible name contains that visible text) to
  `/`; `nav[aria-label="Primary"]` with Work `/#work`, Experience `/#experience`, About
  `/#about`, Contact `/#contact`, and Resume (PDF, `download`) only if the file exists.
- ≤ 52rem: the desktop nav is hidden and the existing native disclosure (`details`/`summary`
  "Menu", works without JavaScript) shows the same items; Escape closes it and returns focus
  to the summary (001 behaviour).
- Footer: name and "Version X.Y.Z" link to `/changelog` (unchanged behaviour).
- Focus: every interactive element shows a ≥ 2 px outline or ring with ≥ 3:1 contrast against
  its background.
- Reduced motion: no transition, animation, or smooth scroll anywhere (computed durations
  ≤ 0.01 ms).

## Homepage (`/`)

Order: `#systems` (hero + map + panel + focus strip) → `#work` → `#experience` → `#skills`
→ `#about` → `#contact`.

### Hero (`section#systems`, `aria-labelledby` the `h1`)

- `h1` = "Akash K Pillai" (styled uppercase); role "Backend & AI Developer"; headline
  "Backend systems. Practical AI. Thoughtfully built."; one intro paragraph from About facts.
- Actions: "Explore systems" → `#project-map`; "Resume" (PDF) when available. Each ≥ 44 px
  tall.

### Project map (`#project-map`)

- Heading (visually present): "Project systems"; instruction text: "Select a project to see
  how its system works."
- Central decorative "AK" node (`aria-hidden`).
- One node per published project, in `order`: before hydration an `<a href="/work/<slug>">`,
  after hydration a `<button type="button" aria-pressed>`; same size and position in both.
  Accessible name = the project's short name. Selected node: `aria-pressed="true"`, accent
  border, raised surface, a "Selected" text marker or check shape (not colour alone).
- Wide (> 68rem): nodes on an ellipse around the centre with decorative connector lines.
  Tablet (52–68rem): same map, panel moves below. Phone (≤ 52rem): vertical list of
  full-width cards ≥ 44 px tall, rail instead of connectors, panel directly after the list.

### Architecture panel (`#architecture-panel`, `aria-labelledby` its heading)

- Label "Explanatory diagram from the reviewed source — not live system data".
- `h3` project name; summary; ordered list of flow steps (`ol`), each with number, label,
  one-sentence detail, and status label when present (text "Unfinished" / "Code path not run
  end to end"); optional branch shown as a labelled sub-list ("Alternate path: …").
- "Trace flow" button: first press highlights step 1; label becomes "Next step"; after the
  last step "Restart trace". Current step has `aria-current="step"` and visible highlight.
- "Open case study" link → `/work/<slug>`.
- Visually hidden `p[aria-live="polite"]`: "Showing <name>: <n> steps." on selection;
  "Step <i> of <n>: <label>." while tracing.
- Selection never moves focus or scrolls.

### No JavaScript

- Nodes are links to case studies; the panel shows the first project; a `<noscript>` section
  "All project systems" lists every published project's name, summary, flow steps, and
  case-study link. No "Trace flow" button is rendered before hydration.

### Focus strip

- `aside` (`aria-label="Current focus"`) with the label "Current focus" and the three
  owner statements; no status dots that imply live data (a static decorative mark only).

### Work (`#work`)

- Each published project: number, `h3` title link, summary, stack list, evidence note
  ([data model](../data-model.md#evidencenote-derived-work-previews)), existing explanatory
  preview with its caption, "Open case study" link. "View all work" → `/work`.

### Experience, skills, about, contact

- Same content, headings, ids, and actions as feature 004 (copy email, mail link, LinkedIn,
  GitHub, résumé); restyled only. Section labels renumbered 03–07.

## `/work`

- Same list content as before, presented as system preview cards with the evidence note and
  "Open case study".

## Case study (`/work/<slug>`)

- Header: "Case study 0N", `h1`, summary, stack, source statement/link (public only), back
  link — unchanged content.
- Wide (> 68rem): two columns; the right column is a sticky "System summary" (`nav`,
  `aria-label="Case study sections"`): the project's flow steps (static list) and links to
  Problem, My contribution, Implementation, Architecture, Decisions, Tradeoffs, Limitations;
  the link for the section in view has `aria-current="true"`.
- Narrow: the same summary once below the header, not sticky.
- Sections may reveal (opacity/translate, 300 ms) only after hydration and only with motion
  allowed; visible by default.
- All claims, labels, diagrams, and their text equivalents unchanged.

## 404, changelog

- Same content and links; Systems Lab styling.

## Sharing image and icon

- `/og.png` 1200×630: dark canvas, faint grid, "AKASH / SYSTEMS LAB", name, role, headline
  one sentence per line, teal rule; text ≥ 4.5:1.
- `icon.svg`: dark rounded square, teal ring "node" with small accent dots; paths/circles
  only; legible at 16 px.
