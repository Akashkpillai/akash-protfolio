# Research: Recruiter-Scan Refinement

All decisions resolved locally; no external research needed. Next.js guidance read from the
installed `node_modules/next/dist/docs/01-app` (server and client components; `Link`
hash scrolling): nothing in this feature needs a new framework API.

## R1 Architecture disclosure

- **Decision**: Native `<details>`/`<summary>` labelled "Explore architecture", with its open
  state mirrored in React (`open` + `onToggle`) so a selection keeps it open and a trace opens it.
- **Rationale**: Works without JavaScript, keyboard operable, exposes expanded state to
  assistive technology natively (FR-003, FR-015).
- **Alternatives**: A button with `aria-expanded` and a hidden region (needs scripts to open;
  rejected); a modal (hides the map; rejected).

## R2 Mobile project selectors

- **Decision**: Below 46rem the four nodes render as a two-column grid of compact toggle
  buttons (`aria-pressed`, ✓ shape when selected, ≥ 44 px tall) instead of full-width cards.
- **Rationale**: Same buttons as the orbit (one code path); shorter hero (FR-005, FR-007).
- **Alternatives**: A `<select>` (hides the project names; weaker for scanning); tabs pattern
  (wrong semantics — the summary is not a tab panel of each).

## R3 Card content source

- **Decision**: Render `caseStudy.problem[0]`, `summary`, and every `caseStudy.contribution`
  claim verbatim; add a presentation-only `layout` field to project records.
- **Rationale**: No new claims to review (constitution I); HRMS team attribution is already
  its second contribution claim. Layout belongs with the record so `/work` and `/` agree.
- **Alternatives**: New shortened card copy (needs owner review; rejected for this scope).

## R4 Motion reduction

- **Decision**: Remove timed roaming and the roaming fallback from the Probe; tips only for
  sections entering view after load; delete the tilt wrapper and ambient scan line; three grid
  signals; one reveal style ("up").
- **Rationale**: Directly answers "reduce simultaneous decorative effects and excessive
  roaming" while keeping orbit, Probe, glows, spotlight, entrance, and pause (FR-013, FR-014).
- **Alternatives**: Slower roaming (still unprompted movement; rejected).

## R5 Contact merge

- **Decision**: One `section#contact` with direct links in one column and the form in a
  `div#message` (focusable, `tabIndex=-1`) in the other; form heading "Send a message".
- **Rationale**: Keeps both anchor targets (FR-019) and the lab's "/#message" link.
- **Alternatives**: Redirect `#message` with script (fails without JS; rejected).

## R6 Ask the lab suggestions

- **Decision**: `initial: true` on the projects, experience, skills, and contact topics; the
  rest render inside a region toggled by a "More questions" button with `aria-expanded`.
- **Rationale**: Topic content and the scripted source are unchanged (FR-021, FR-022).

## R7 Version

- **Decision**: No package/changelog change; owner chooses the release at acceptance.
- **Rationale**: 1.0.0 is prepared but unreleased; constitution VII ties versions to accepted
  releases.

## R8 Revision 1: restrained tilt and wandering (2026-10-26)

- **Decision**: Bring back card tilt at ±2° (was ±6°) without the spotlight, and Probe wandering
  as rare slow trips with long rests and explicit guards, instead of removing both.
- **Rationale**: The owner wants calm motion with the portfolio's playful character. ±2° with a
  1600 px perspective keeps text legible; 200 px/s and 18–30 s rests keep the eye noticeable but
  not busy. The guards cover every case where movement would compete with the visitor (typing,
  dialog, drag, attention on a selection or trace).
- **Alternatives**: Keep both removed (rejected by the owner); restore 007 behaviour unchanged
  (6–11 s roaming at 450 px/s and ±6° tilt with spotlight: the "excessive" baseline).
