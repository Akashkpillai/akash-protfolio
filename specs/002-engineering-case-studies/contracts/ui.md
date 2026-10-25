# UI Contract: Engineering Case Studies

Observable behavior for v0.2.0. Extends the [001 UI contract](../../001-portfolio-foundation/contracts/ui.md),
which remains in force for the hero, Approach section, and illustrative flow. No public API.

## Routes

| Route | Status | Content |
| --- | --- | --- |
| `/` | 200 | Hero, new `#work` selected-work section, Approach (`#approach`) |
| `/work` | 200 | Published projects in curated order, each linking to its case study |
| `/work/resume-analyzer` | 200 | Case study |
| `/work/notification-platform` | 200 | Case study |
| `/work/user-management-api` | 200 | Case study |
| `/work/<draft or unknown>`, e.g. `/work/meridian` | 404 | Not-found page linking to `/work` and `/` |
| `/work/Resume-Analyzer` (mixed case) | 404 | Same not-found page |
| `/work/resume-analyzer/` | 308 to `/work/resume-analyzer` | Framework default |

All routes are prerendered; the full text of every page is in the initial HTML.

## Navigation

- Items: Home (`/`), Work (`/#work`), Approach (`/#approach`); brand links to `/`.
  Experience, About, Contact, and résumé remain absent.
- Desktop links and the native mobile `Menu` disclosure keep 001's behavior on every route.
- The hero keeps "Explore the flow" and adds "View selected work" → `/#work`.

## Homepage selected work (`#work`)

- Heading with eyebrow "02 / Selected work"; Approach's eyebrow becomes "03 / Approach".
- Three numbered stories (`01`–`03`), each with title, one-line summary, stack, compact
  preview, and a "Read the case study" link. Compositions alternate (preview left/right or
  full width); not a uniform card grid.
- Previews: Resume Analyzer pipeline, Notification Platform architecture, User Management
  data model. Each carries a visible caption labeling it an explanatory diagram, not a
  screenshot.
- Ends with a "View all work" link to `/work`.

## `/work`

- Page heading, short intro, ordered list of published projects with number, title,
  summary, stack, and case-study link. No previews required.

## Case study

Section order: title and summary → stack and source link → Problem → My contribution →
Implementation → Architecture → Decisions → Tradeoffs → Limitations → links to `/work` and
to the other published case studies.

- One `h1` (title); each section an `h2`.
- Claim statuses appear as visible text labels next to the claim ("Implemented code path",
  "Unfinished", "Illustrative"), not color alone.
- Limitations are a plain visible list, never collapsed.
- Source link text names the repository (e.g. "Source: notificationservice on GitHub").
  No demo action in v0.2.0.
- Page `<title>` and description come from the published project only.

## Diagrams

- Every diagram has a visible title, a caption saying it explains the reviewed source and
  is not a live view, an SVG with `role="img"` plus `<title>`/`<desc>`, and an ordered text
  list of every component and its responsibility. The SVG is hidden below the mobile
  breakpoint if it can't stay legible; the list always shows.
- Notification Platform only: after hydration, each component in the list gets a
  "Show <name>" button (`aria-pressed`). Selecting one highlights it in the SVG and list
  and updates a polite live region "Selected: <name>. <responsibility>". Native
  Enter/Space; visible focus; no hover-only content; no directional-key requirement.
  Without JavaScript the buttons are absent and all text remains.
- Push delivery is shown with an "Unfinished" label and a dashed edge; retry and
  dead-letter paths carry "Implemented code path".
- Reduced motion: selection changes are immediate.

## Layout and accessibility

- No horizontal scroll at 390, 768, 1440 px or at 200% zoom; long titles and repository
  names wrap.
- Reuse existing tokens and type scale from `src/app/globals.css`; check contrast of any
  new text/background or status-label pairing.
- No prohibited delin.dev motifs; no invented screenshots.
