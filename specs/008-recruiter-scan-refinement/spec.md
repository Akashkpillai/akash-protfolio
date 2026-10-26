# Feature Specification: Recruiter-Scan Refinement

**Feature Branch**: `feat/008-recruiter-scan-refinement` (created from `main` = `b6bcb35`; no branch hook)

**Created**: 2026-10-26

**Status**: Draft

**Input**: Owner request (2026-10-26): "Make the portfolio more attractive and easier for
recruiters to scan, while keeping useful engineering depth for technical visitors." Seven
areas: simplify the hero; improve project presentation; refine motion; improve content
hierarchy; unify contact; simplify Ask the lab; validate. Retain the Systems Lab identity,
the project constellation, and the Probe; refine rather than replace. Do not copy text,
technology labels, diagrams, or claims from the owner's reference image without repository
evidence. (The reference image was not received in this session; the written brief is the
only input.)

## Starting state (observed 2026-10-26)

- Root `C:\Users\HP\Desktop\akash-portfolio`; `main`, `feat/005-launch-readiness`, and
  `codex-sug` all at `b6bcb35`; working tree clean; `SPECIFY_*` overrides unset;
  `.specify/feature.json` pointed at `specs/005-launch-readiness` before this spec.
- Feature 005 (launch readiness, `1.0.0`) is **prepared — blocked** on owner inputs
  (production domain, LinkedIn manual check, evidence-register review, release-candidate
  commit, fresh-install test). Its open tasks stay in 005; this feature does not close,
  re-scope, or mark any of them complete. 005's UI checks are re-run against the result of
  this feature before `1.0.0` (or a later release) is published.
- Package and displayed version `1.0.0`; changelog newest entry `1.0.0` (unreleased).
- Homepage today: three-part hero (intro with headline, orbit map, a permanently expanded
  architecture panel), a "current focus" strip, "Systems, explained from their source"
  project cards that lead with review wording, experience, skills, about, a separate
  "Send a message" section, a separate "Get in touch" section. Ask the lab shows ten
  suggestion buttons at once. The Probe roams between headings every 6–11 seconds; the
  ambient layer runs glows, six grid signals, a scan line, and a pointer spotlight; cards tilt
  under the pointer.

## Clarifications

### Session 2026-10-26

Resolved by default under the owner's instruction to resolve routine choices independently
(recorded here so the plan and tasks can cite them):

- Hero introduction uses the owner's suggested sentence, which restates the owner-confirmed
  About text (feature 004): "I build backend systems with Node.js, NestJS, and PostgreSQL,
  and AI features using retrieval and tool calling."
- The headline "Backend systems. Practical AI. Thoughtfully built." leaves the hero but stays
  the site's default description; the "current focus" statements move into About unchanged.
- "My contribution" text is the existing owner-confirmed contribution claims, verbatim; no
  new contribution wording is written. HRMS keeps its team-attribution sentence.
- "The problem" text is each case study's existing first problem claim, verbatim.
- Featured layout: HRMS Backend and Meridian Assistant; compact layout: Notification
  Platform and Resume Analyzer. Published order is unchanged.
- No screenshots: none are approved, so every project keeps its labelled explanatory diagram.
- Version: this feature does not change the package version or changelog. The release that
  carries it (e.g. `1.1.0` after `1.0.0`, or folded into the first public release) is the
  owner's decision at acceptance.
- Q (clarify pass, self-resolved): Do section tips count as Probe movement "without a visitor
  action"? → A: A tip is shown only for a section that comes into view after the visitor
  scrolls; sections already in view on load get no tip. SC-005 is measured after the
  first-visit entrance has finished.

### Revision 1 (owner, 2026-10-26)

The owner asked for calmer motion that keeps the portfolio's playful character: "I wanted less
excessive roaming, not its complete removal." This revision replaces "no card tilt" and "no timed
roaming" with restrained versions (FR-013, FR-014, FR-025, SC-005, SC-008). All other 008
refinements are unchanged.

- Card tilt returns on desktop only (hover and fine pointer), at most about ±2°, smooth follow and a
  gentle return to neutral; no scaling, no moving spotlight, modest perspective; never on touch,
  with reduced motion, or with motion paused; keyboard focus never tilts a card.
- Probe wandering returns as occasional slow trips between safe spots (beside a visible section
  heading or a project-card title) with long rests; it never wanders while the visitor types, Ask
  the lab is open, the Probe is dragged, or a selection or traced flow holds its attention, and
  never on touch, with reduced motion, motion paused, or a hidden tab.
- Defaults chosen (owner gave no numbers): first trip no sooner than 12 s after the Probe last
  settled; rests of 18–30 s between trips; wandering speed at most 200 px/s (reactions keep the
  450 px/s cap); the existing 30 s doze still stops wandering until the visitor is active again.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A recruiter understands fit within one screen (Priority: P1)

A recruiter opens the homepage on a laptop or phone. Without scrolling far they see the
name, the role, one plain sentence on what Akash builds, and two clear actions — view
selected work, or download the résumé. A compact project map beside the introduction shows
the published projects; selecting one shows a short summary, and "Explore architecture"
opens the step-by-step flow for anyone who wants depth.

**Why this priority**: The hero decides whether a recruiter keeps reading.

**Independent Test**: Load `/` at 1440, 768, and 390 px; read the hero; activate "View
selected work", "Resume PDF", and "Ask the lab"; select each project; open and close
"Explore architecture"; trace a flow; repeat by keyboard and with JavaScript disabled.

**Acceptance Scenarios**:

1. **Given** a 1440 px window, **When** the homepage loads, **Then** the hero is two columns —
   introduction and actions on one side, the project map with a selected-project summary on
   the other — and the architecture flow is collapsed.
2. **Given** the hero, **When** the visitor activates "View selected work", **Then** the page
   moves to the selected-work section; **When** they activate "Resume PDF", **Then** the
   approved résumé downloads.
3. **Given** a project is selected, **When** the visitor activates "Explore architecture",
   **Then** the flow steps, labels for unfinished or unexercised steps, any branch, and the
   trace control appear; tracing moves step by step as before.
4. **Given** a 390 px phone, **When** the homepage loads, **Then** projects are offered as
   compact, accessible selectors (not a long list of large cards), the architecture flow is
   collapsed, and the selected-work section starts sooner than before this feature.
5. **Given** JavaScript is disabled, **When** the homepage loads, **Then** the introduction,
   actions that work without scripts, project links, and every project's flow are readable.

---

### User Story 2 - Projects read as problems solved, with my part clear (Priority: P1)

A visitor scrolls to "Built to solve real problems" and, for each project, reads what problem
it addresses, what it does, and what Akash personally built — with team attribution where
others built parts. HRMS Backend and Meridian Assistant are presented prominently; Notification
Platform and Resume Analyzer are compact. Evidence labels and limitation markers remain where
they matter, and each card opens its case study.

**Why this priority**: Projects are the main evidence of skill for both audiences.

**Independent Test**: Read the section at three widths; compare every visible problem,
summary, and contribution sentence with the case-study records; confirm review-process
wording no longer opens the section; open each case study.

**Acceptance Scenarios**:

1. **Given** the selected-work section, **When** it renders, **Then** its heading is "Built to
   solve real problems" and its introduction does not describe the review process.
2. **Given** any project card, **When** it renders, **Then** it shows the problem, what the
   project does, a "My contribution" summary drawn from approved evidence, the stack, a
   labelled explanatory diagram, and its evidence label (source type, reviewed commit, and
   unfinished / not-run-end-to-end markers when they apply).
3. **Given** the HRMS card, **When** it renders, **Then** the contribution states that
   teammates built authentication, tenancy, the shared workflow engine, and billing.
4. **Given** a wide screen, **When** the section renders, **Then** HRMS and Meridian use a
   larger featured layout and the other two a compact layout side by side.

---

### User Story 3 - One place to get in touch (Priority: P2)

A visitor who wants to reach Akash finds a single Contact section with the email address, a
copy-email action, LinkedIn, GitHub, the résumé, and the message form whose "Compose email"
button opens their own email app. Old links to `#message` and `#contact` still land there.

**Why this priority**: Two near-duplicate sections split attention at the end of the page.

**Independent Test**: Follow `/#contact` and `/#message` from another page; use every
contact action; submit the form empty, with a bad email, and valid.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** the visitor reaches the end, **Then** exactly one contact
   section exists, containing email, copy email, LinkedIn, GitHub, résumé, and the form.
2. **Given** a link to `/#message`, **When** followed, **Then** the browser lands on the form
   inside that section.
3. **Given** the form, **When** read, **Then** it states that "Compose email" opens the
   visitor's email app and that the site stores and sends nothing.

---

### User Story 4 - Calmer motion that never gets in the way (Priority: P2)

The orbit still revolves and the Probe still blinks, reacts to selections and traces, and
opens Ask the lab. It wanders only occasionally and slowly, resting for long periods, and never
over text or controls. Project cards tilt very slightly under a mouse. Fewer decorative effects
run at once. Pause and reduced motion behave as before. (Revision 1.)

**Why this priority**: Motion is the signature, but too much of it competes with reading.

**Independent Test**: On a desktop, rest on the homepage for 45 seconds with light pointer
activity and watch the Probe; type in the message form; select a project and trace; hover and
leave a project card; tab through a card; repeat on a touch phone, with reduced motion, and with
motion paused.

**Acceptance Scenarios**:

1. **Given** no selection or trace on a desktop with motion on, **When** the visitor stays on a
   page, **Then** the Probe occasionally travels slowly to a safe spot beside a visible heading or
   card title and rests there for a long time before any further trip.
2. **Given** a project selection or a trace step, **When** it happens, **Then** the Probe goes
   to it when a spot is free, and returns to its dock otherwise; it does not wander while that
   target holds its attention.
3. **Given** the visitor is typing, Ask the lab is open, or the Probe is being dragged, **Then**
   it does not wander.
4. **Given** a mouse over a project card, **When** the pointer moves, **Then** the card tilts by
   at most about 2° and settles back smoothly when the pointer leaves; keyboard focus shows the
   border glow without any tilt.
5. **Given** motion is paused or reduced, or a touch device, **Then** the Probe stays docked, no
   card tilts, no ambient or decorative animation runs (none on touch beyond the ambient layer),
   and all content is visible.
6. **Given** reveal or observation logic fails or never runs, **Then** all content is visible.

---

### User Story 5 - Ask the lab is easier to start (Priority: P3)

Opening Ask the lab shows four useful questions, with "More questions" revealing the rest.
The conversation and input have more room. Answers remain scripted from site content, with
source links, the same focus handling, and the same keyboard behaviour.

**Why this priority**: Ten buttons at once crowd the dialog; the feature itself is unchanged.

**Independent Test**: Open the dialog by keyboard; ask each initial question; reveal and ask
a further question; type a question; close with Escape and confirm focus returns.

**Acceptance Scenarios**:

1. **Given** the dialog opens, **Then** exactly four suggestions show and a "More questions"
   control (state exposed to assistive technology) reveals the remaining ones.
2. **Given** any answer, **Then** source links and the scripted-answer disclosure remain.

### Edge Cases

- Résumé file missing: no résumé action renders anywhere (existing rule), and the hero shows
  "View selected work" and "Ask the lab" only.
- JavaScript disabled: hero project items are links to case studies; Ask the lab and copy
  email do not render; the form still opens the email app via its mailto action.
- Selecting another project while the architecture is expanded keeps it expanded for the
  new project and resets any trace.
- A trace step off-screen or with no free spot: the Probe docks instead of roaming.
- A wandering spot scrolls out of view: the Probe returns to its dock; it does not pick a new
  spot until its next scheduled trip.
- No safe spot is visible when a trip is due: the Probe stays where it is and tries again after
  the next rest.
- Browser tab hidden: no trip starts and no animation frames run until the tab is visible.
- 200% zoom or 320 px width: no horizontal page scroll; selectors wrap.
- Draft project (User Management API) and unknown slugs: still absent and 404.

## Requirements *(mandatory)*

### Functional Requirements

**Hero**

- **FR-001**: The homepage hero MUST present, on wide screens (≥ 68rem), two columns: (a) role,
  name (the page's only level-1 heading), the introduction sentence, and actions; (b) the
  project map and a selected-project summary.
- **FR-002**: The hero MUST offer "View selected work" (to `#work`) and "Resume PDF" (download,
  only when the approved file exists) as primary actions and "Ask the lab" as a secondary
  action (only with scripts).
- **FR-003**: The selected-project summary MUST show the project name, its published summary,
  an "Explore architecture" disclosure (collapsed by default, state exposed to assistive
  technology), and an "Open case study" link.
- **FR-004**: When expanded, the disclosure MUST show every flow step with its status label,
  any branch, the "explanatory, not live data" label, and the trace control; tracing MUST work
  as in feature 007 (step announcements, Probe follow).
- **FR-005**: Below 46rem the project map MUST present projects as compact selectors (at least
  44 × 44 px targets, keyboard operable, selected state not by colour alone) and MUST NOT
  render the large card list or an expanded flow by default.
- **FR-006**: The "current focus" statements MUST remain on the homepage (moved to About), and
  the hero MUST NOT show the focus strip.
- **FR-007**: The hero MUST be shorter at 390 px than before this feature, so selected work
  starts sooner (measured: top of `#work` at 390 px before vs. after).

**Projects**

- **FR-008**: The selected-work heading MUST be "Built to solve real problems"; its
  introduction MUST NOT describe the review process.
- **FR-009**: Each project card MUST show, in order of reading: title, "The problem" (first
  problem claim, verbatim), "What it does" (published summary), "My contribution" (all
  contribution claims, verbatim), stack, the labelled explanatory diagram, the evidence label,
  and the case-study action.
- **FR-010**: HRMS Backend and Meridian Assistant MUST use a featured layout; Notification
  Platform and Resume Analyzer a compact layout; at wide widths the two compact cards sit side
  by side.
- **FR-011**: No screenshot, recording, or generated image MAY be shown as product evidence;
  diagrams keep their "explanatory, not a screenshot" captions.
- **FR-012**: The `/work` index and case studies MUST keep their content, section navigation,
  and source links; published status and draft exclusion MUST be unchanged.

**Motion**

- **FR-013** (Revision 1): The Probe MAY wander occasionally: after resting (first trip no sooner
  than 12 s after it last settled; then 18–30 s between trips) it travels at no more than 200 px/s
  to a spot beside a visible section heading or project-card title, inside the viewport, where
  nothing under it is text, a link, a form control, or a button. It MUST NOT wander while the
  visitor is typing (focus in a text field, or a key pressed in the last 5 s), while Ask the lab
  is open, while it is dragged, while a selected project or traced step it attends is in view
  (and for 15 s after any selection or trace), while dozing, or while the tab is hidden; it MUST
  NOT wander on touch devices, with reduced motion, or with motion paused (docked accessible
  button). With no target and no wandering spot it rests at its dock; a wandering spot that leaves
  the viewport sends it to the dock. Selections, traces, drag/throw, blinking, section tips (once
  per section per visit, only for sections scrolled into view after load), the entrance, and
  opening Ask the lab remain.
- **FR-014** (Revision 1): Decorative effects MUST be reduced: card tilt only as restrained in
  FR-025, no card spotlight, no ambient scan line, at most three grid signals, and a single reveal
  style. The orbit, the ambient
  glows, the pointer spotlight, scroll progress, the experience timeline draw, the packet along
  the selected spoke, the flow-step stagger, the typing indicator, the first-visit entrance, and
  the pause control remain.
- **FR-015**: Reduced motion MUST remove all ambient and decorative motion; the pause MUST stop
  them; essential content MUST be visible without scripts and if reveal logic fails.
- **FR-016**: No animation dependency MAY be added.
- **FR-025** (Revision 1): Project cards MAY tilt under a hover-capable fine pointer only: rotation
  at most ±2° on each axis, following the pointer smoothly and returning to neutral gently
  (about 0.6 s) on leave; no scaling, no moving spotlight, perspective of at least 1200 px; the
  existing border glow is kept. Tilt MUST be off on touch or coarse pointers, with reduced motion,
  and with motion paused (including a card mid-tilt when the pause is pressed). Keyboard focus
  MUST NOT tilt a card; focus styling stays as it is.

**Hierarchy**

- **FR-017**: Section introductions and body text MUST keep readable line lengths (≤ about 70
  characters for prose) and consistent vertical rhythm between sections.
- **FR-018**: Experience, dates, skills, About, and languages MUST be unchanged in content.

**Contact**

- **FR-019**: The homepage MUST have one contact section (`#contact`) containing the email
  address, copy email, LinkedIn, GitHub, the résumé, and the message form; the form MUST be
  reachable at `#message`.
- **FR-020**: The form MUST keep "Compose email", its validation and fallback, and state that it
  opens the visitor's email app and that the site stores and sends nothing. No email service
  MAY be added.

**Ask the lab**

- **FR-021**: The dialog MUST initially show four suggestions — projects, experience, stack,
  contact — and a "More questions" disclosure revealing the others.
- **FR-022**: The dialog MUST give the conversation more room than before (taller log, wider
  dialog on large screens) and keep the scripted-answer disclosure, answer source links, focus
  on open, focus return on close, Escape to close, and Enter to send. No AI service MAY be
  added.

**General**

- **FR-023**: No new runtime dependency; no change to package version or changelog in this
  feature (see Clarifications).
- **FR-024**: Design direction and roadmap documents MUST describe the refined composition and
  motion rules.

### Key Entities

- **Project card content**: per published project — title, problem claim, summary,
  contribution claims, stack, diagram, evidence note, layout (featured | compact). All derived
  from the existing project records; no new claims.
- **Ask the lab suggestion**: a topic with a label and a flag for whether it is initial.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 1440 px the name, role, introduction, both primary actions, and the project map
  are visible without scrolling.
- **SC-002**: At 390 px the top of the selected-work section is closer to the page top than on
  `b6bcb35` (recorded in pixels before and after).
- **SC-003**: Every visible problem, summary, and contribution sentence matches its case-study
  record exactly (automated comparison, 0 mismatches).
- **SC-004**: The current browser suite passes, with assertions changed only for behaviour this
  spec changes; 0 automated accessibility violations on all public pages; no horizontal
  overflow at 390, 768, and 1440 px.
- **SC-005** (Revision 1): On a 1440 px desktop with motion on, over 45 s with light pointer
  activity and no selection, the Probe makes 1–2 trips, rests at least 18 s between trips,
  travels at most 200 px/s (+5% sampling tolerance) while wandering, and ends each trip fully
  inside the viewport with no text, link, form control, or button under it. It makes 0 trips
  while typing in the message form for 30 s, while a traced step is in view for 20 s, with motion
  paused, with reduced motion, on a touch phone, and while the tab is hidden (0 animation
  frames from the page in 3 s).
- **SC-008** (Revision 1): Under a mouse, a card's tilt never exceeds 2° on either axis and
  returns to no rotation within 1 s of the pointer leaving; on touch, with reduced motion, with
  motion paused, and under keyboard focus, the card's rotation is 0 while focus styling remains.
- **SC-006**: Mobile Lighthouse performance on the production build is recorded for `/` and is
  not lower than 90, with the environment stated.
- **SC-007**: Exactly one element each with id `contact` and id `message` exists on `/`, and
  both are inside the single contact section.

## Assumptions

- The written brief is the complete input; no reference image was received.
- Validation follows features 005/007: production build with `SITE_URL=https://portfolio.example`
  (reserved test host, not releasable), QA tools outside the app, installed Chrome.
- Owner acceptance, the release version, and commit are outside this feature's authority; no
  commit, push, tag, or deployment.
