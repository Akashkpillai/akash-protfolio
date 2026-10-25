# Feature Specification: Lab Companion, Ask the Lab, Motion, and Messages

**Feature Branch**: not created (Git is on `feat/005-launch-readiness`; no branch hook is configured)

**Created**: 2026-10-26

**Status**: Draft

**Input**: User description: "Make the companion the original probe orb and make sure it does some activities in the website. Ask the lab: make it scripted right now; in the future I will convert it into real AI. Also add some animation to make the website look cool instead of minimal — borrow some from delin.dev. Make sure the background has some animations, and add a message section to the portfolio." (Owner, 2026-10-26, after the delin.dev review.)

## Starting state (observed 2026-10-26)

- Feature 006 (Systems Lab) is implemented and verified; only owner acceptance (T028) is
  open. This feature builds on it. Feature 005 remains paused.
- delin.dev review (read-only, from its public bundle): its "bot" is a scripted SVG robot pet
  (pointer-drag physics, perching on page elements, moods, blink/breathe/wave), with no AI
  service; motion comes mostly from CSS (six section-reveal styles, scroll-progress bar,
  timeline draw, typing indicator, pointer tilt). Constitution 2.0.0 forbids copying its
  robot mascot, terminal desktop, overlapping windows, custom cursor, boot sequence, and
  purple palette; techniques may be borrowed, characters and looks may not.
- 006 FR-017 forbade continuous motion; the owner now asks for an animated background.

## Clarifications

### Session 2026-10-26

- Companion: the original **Probe orb** (no face, not a robot).
- Ask the lab: **scripted** now, built so a real AI service can replace the answer source
  later without changing the interface.
- Message delivery (decided by default, owner informed): no email service exists or may be
  added under the product brief, so the message is composed on the page and handed to the
  visitor's own email app; nothing is sent or stored by the site. Delivery is isolated so a
  server-side sender can replace it later.
- Background motion is allowed to run continuously only with a visible, remembered pause
  control and never when reduced motion is requested (supersedes 006 FR-017 for the
  background only).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask the lab and meet the Probe (Priority: P1)

A visitor notices a small glowing orb — the Probe — that moves around the page in response
to what they do: it settles on the project they select, follows a traced flow step by step,
and points out sections as they scroll. Activating it opens "Ask the lab", where the visitor
picks a suggested question or types one and gets an answer drawn only from the portfolio's
own reviewed content, with links to the source page.

**Why this priority**: It is the new signature interaction and the owner's main request.

**Independent Test**: On desktop, select projects, trace a flow, scroll the homepage, drag the
Probe, and open Ask the lab by click and keyboard; ask every suggested question and a few
typed ones; repeat on a touch phone, with reduced motion, and with the motion pause on.

**Acceptance Scenarios**:

1. **Given** the homepage on a desktop with a fine pointer and motion allowed, **When** the
   visitor selects a project, **Then** the Probe travels to that project's node and stays
   there; **When** they trace the flow, **Then** it moves to the current step.
2. **Given** the visitor scrolls to a homepage section for the first time in a visit,
   **When** the section comes into view, **Then** the Probe moves beside its label and shows a
   short tip, at most once per section per visit, without covering text.
3. **Given** the Probe, **When** the visitor drags it and lets go, **Then** it follows the
   pointer and settles back to where it belongs; dragging never selects text or scrolls.
4. **Given** the Probe or the "Ask the lab" button, **When** activated by click, tap, Enter,
   or Space, **Then** the Ask the lab dialog opens with focus inside it, suggested questions,
   and a text field; Escape or Close returns focus to what opened it.
5. **Given** a suggested or typed question, **When** it is sent, **Then** a brief typing
   indicator appears (none with reduced motion) and the answer appears in the conversation,
   is announced politely, and links to the page it came from.
6. **Given** a question the lab cannot match, **When** it is sent, **Then** the answer says so
   plainly and lists the topics it can answer; it never guesses.
7. **Given** a touch device, reduced motion, or the motion pause, **When** the page is used,
   **Then** the Probe stays docked in the corner as a button that opens Ask the lab, and does
   not travel.

---

### User Story 2 - A livelier lab: background and page motion (Priority: P2)

The page feels alive: a slow ambient background of drifting light and signals travelling
along the grid, a soft glow that follows the pointer, a progress line while scrolling,
sections and cards that reveal in varied ways, cards that tilt slightly under the pointer, a
signal that runs from the AK node to the chosen project, and an experience timeline that
draws itself — all of it pausable and absent with reduced motion.

**Why this priority**: The owner wants the site to look less minimal; motion supports, but
does not carry, the content.

**Independent Test**: Load each page with motion allowed, scroll through, hover cards, select
projects; then toggle Pause motion and reload; then request reduced motion; confirm content is
readable in every state and nothing shifts the layout.

**Acceptance Scenarios**:

1. **Given** motion allowed, **When** any page is open, **Then** the background shows slow
   ambient motion behind the content, never over text, with no effect on layout.
2. **Given** the motion toggle, **When** the visitor pauses motion, **Then** all ambient and
   decorative motion stops immediately, the Probe docks, and the choice is remembered on later
   visits; **When** they resume it, motion returns.
3. **Given** reduced motion is requested, **When** any page is open, **Then** no ambient,
   decorative, reveal, tilt, or travel motion runs, regardless of the toggle.
4. **Given** the visitor scrolls, **When** content enters the viewport, **Then** headings,
   cards, and diagrams reveal with short varied transitions; content is visible by default and
   without JavaScript.
5. **Given** a fine pointer, **When** it moves over a project card or node, **Then** the card
   tilts by at most a few degrees and a soft spotlight follows the pointer; nothing depends on
   this to be understood.

---

### User Story 3 - Leave a message (Priority: P3)

A recruiter fills in a short message form — name, email, topic, message — sees clear
validation, and sends it; their email app opens with the message ready, addressed to Akash.

**Why this priority**: A direct way to start a conversation; email links already exist.

**Independent Test**: Submit empty, invalid, and valid forms by keyboard and pointer; confirm
the composed message, the confirmation and copy fallback, and that nothing is sent elsewhere.

**Acceptance Scenarios**:

1. **Given** the message section, **When** it is viewed, **Then** it has labelled fields for
   name, email, topic, and message, says how the message is delivered, and says the site
   stores nothing.
2. **Given** missing or invalid fields, **When** the form is submitted, **Then** each problem
   is shown next to its field and announced, and focus moves to the first problem.
3. **Given** a valid form, **When** it is submitted, **Then** the visitor's email app opens
   with the owner's address, a subject naming the topic and sender, and the message body; the
   page confirms what happened and offers to copy the message if no email app opened.
4. **Given** JavaScript is unavailable, **When** the section is viewed, **Then** the owner's
   email address and a direct email link are shown.

---

### Edge Cases

- Tab hidden or page in the background: all animation loops pause.
- Window resized or zoomed to 200%: the Probe recomputes its position and never sits
  off-screen or over the main text column; at narrow widths it docks.
- A selected node or traced step scrolls out of view: the Probe docks rather than chasing it
  off-screen.
- The visitor opens Ask the lab repeatedly or asks many questions: the conversation keeps the
  latest exchanges, scrolls within the dialog, and never grows the page.
- Very long typed question (over 300 characters) or empty question: trimmed or ignored with a
  short message.
- A question naming the draft project: answered with "not published" style fallback; no draft
  content is revealed.
- Message longer than the limit (2,000 characters): a live count warns before the limit; the
  field stops accepting more.
- Email app missing: the confirmation offers Copy message and the plain address.
- Local storage unavailable: the motion choice and seen tips fall back to the session.

## Requirements *(mandatory)*

### Functional Requirements

**Probe companion**

- **FR-001**: The site MUST show the Probe: a small orb in the Systems Lab style (teal ring,
  core, one orbiting dot), with no face, eyes, limbs, or robot features.
- **FR-002**: With a fine pointer, motion allowed, and motion not paused, the Probe MUST
  respond to site activity: settle beside the selected project node; move to the current step
  while a flow is traced; move beside a homepage section label the first time that section is
  viewed in a visit and show a one-sentence tip; turn its orbiting dot toward the pointer;
  dim and rest after 30 seconds without interaction; brighten when a message is composed or the
  email is copied.
- **FR-003**: The Probe MUST be draggable with the pointer and settle to its resting place on
  release, without selecting text or scrolling the page.
- **FR-004**: The Probe MUST be a keyboard-operable button named "Ask the lab"; its movement
  MUST NOT move keyboard focus, cover the main text column, or appear over open dialogs.
- **FR-005**: On touch devices, with reduced motion, with motion paused, or below 52rem wide,
  the Probe MUST stay docked in a screen corner as the Ask the lab button and MUST NOT travel.
- **FR-006**: Probe tips MUST be short, drawn from existing page content or interface hints,
  shown at most once per section per visit, and MUST NOT state anything not on the page.

**Ask the lab**

- **FR-007**: Ask the lab MUST open as a dialog from the Probe and from a visible "Ask the lab"
  button in the hero, trap focus while open, close with Escape or a Close button, and return
  focus to its opener.
- **FR-008**: It MUST offer suggested questions covering: who Akash is, each published
  project, what is unfinished, the stack and skills, experience, and how to get in touch; and a
  text field for typed questions (1–300 characters).
- **FR-009**: Every answer MUST be composed only from existing published content (profile,
  experience, skills, contact, project summaries, case-study claims and limitations, flow
  steps) with their status labels, and MUST link to the page it came from; no draft project
  content may be included.
- **FR-010**: Unmatched questions MUST receive a plain "I can't answer that from this site"
  reply listing answerable topics.
- **FR-011**: A typing indicator (three dots, under one second) MUST precede each answer when
  motion is allowed; answers MUST be announced politely; the conversation MUST scroll inside the
  dialog and keep the latest 20 messages.
- **FR-012**: Answering MUST go through one replaceable answer source, so a future AI service
  can be substituted without changing the dialog; the dialog MUST state that answers are
  scripted from the site's content.

**Motion**

- **FR-013**: Pages MUST have an ambient background (slowly drifting light and signals moving
  along the grid) drawn behind content, decorative, with no layout effect.
- **FR-014**: A visible "Pause motion" toggle (with pressed state) MUST be available from every
  page; pausing MUST stop ambient and decorative motion immediately and dock the Probe; the
  choice MUST be remembered across visits.
- **FR-015**: With reduced motion requested, no ambient, reveal, tilt, travel, or decorative
  motion may run, whatever the toggle says.
- **FR-016**: The site MUST add: a scroll-progress line; varied section reveals (rise, slide,
  scale, clip) on homepage sections and cards; an experience timeline that draws as it enters
  view; pointer tilt (≤ 6°) and spotlight on project cards and nodes for fine pointers; a
  signal that runs from the AK node to a newly selected node; staggered step entry in the
  architecture panel.
- **FR-017**: Motion MUST NOT hide content by default, block reading, shift layout (CLS under
  0.1), or use a custom cursor, boot sequence, terminal desktop, overlapping windows, robot
  mascot, or purple palette; all loops MUST pause when the tab is hidden.

**Messages**

- **FR-018**: The homepage MUST include a message section with labelled fields: name (1–80
  characters), email (valid address), topic (Job opportunity, Project, Question, Other), and
  message (10–2,000 characters with a live count).
- **FR-019**: Submitting MUST validate each field, show and announce errors beside fields, and
  move focus to the first error.
- **FR-020**: A valid submission MUST open the visitor's email app addressed to the owner's
  confirmed email with subject "[Portfolio] <topic> — <name>" and a body containing the
  message, name, and reply address; the page MUST confirm this and offer Copy message and the
  plain address as a fallback.
- **FR-021**: The section MUST state that the message is sent from the visitor's own email app
  and that the site does not store it; the site MUST NOT transmit form data anywhere.
- **FR-022**: Delivery MUST go through one replaceable function so a server-side sender can be
  substituted later.

**Preservation and process**

- **FR-023**: Every 005/006 guarantee MUST hold: metadata, sitemap, robots, 404, draft
  exclusion, evidence-backed content, keyboard access, contrast, no-JS readability, and the
  existing browser checks.
- **FR-024**: Any new dependency MUST be justified in the plan; none is expected.
- **FR-025**: No deploy, publish, tag, push, or commit; version moves to 0.5.0 only at owner
  acceptance.

### Key Entities

- **Probe state**: resting place (dock or a page anchor), mode (docked, travelling, perched,
  resting, dragged), current tip, seen sections (per visit).
- **Lab topic**: an answerable topic with keywords, an answer built from published content, a
  source link, and status labels.
- **Lab message**: one conversation entry (visitor or lab), with optional links.
- **Motion preference**: on or paused, remembered; overridden by reduced motion.
- **Message draft**: name, email, topic, message, validation state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On desktop with motion allowed, the Probe ends beside the selected node within
  1.5 s of every selection and beside the current step during every trace step.
- **SC-002**: 100% of suggested questions return an answer with at least one link to a published
  page; 100% of answer sentences are found in the site's published content; 0 answers mention
  the draft project.
- **SC-003**: Ask the lab is fully operable by keyboard: open, ask, read, close, with focus
  returned to the opener, in 100% of attempts.
- **SC-004**: With motion paused or reduced motion, 0 elements keep running ambient or
  decorative animation; the Probe is docked; the pause persists after reload.
- **SC-005**: Lighthouse mobile performance on the homepage stays at or above 85 and CLS
  under 0.1 with all motion enabled.
- **SC-006**: 0 axe violations and 0 text-contrast failures on every page, with the dialog
  open and closed.
- **SC-007**: 100% of invalid message submissions show field errors and focus the first; 100%
  of valid ones compose the exact subject and body defined in FR-020.
- **SC-008**: All 006 browser checks, the content-preserved check, and the 005 metadata,
  served-output, and evidence checks still pass.

## Assumptions

- The Probe's travel uses a small spring animation written for the site; no animation
  library is needed.
- "Activities" are the reactions in FR-002; the Probe does not chat by itself or move on a
  timer.
- Tips are short interface hints and section summaries already on the page (for example, "Tap
  a node to see how it works" or the section's intro sentence).
- Ask the lab keeps no history between visits and sends nothing over the network.
- The message section sits between About and Contact as section 06; Contact becomes 07.
- A hero "Ask the lab" button gives a second, non-floating way in.
- Ambient background motion counts as decorative under WCAG 2.2.2 and is given a pause
  control.
- Feature 006's owner acceptance is still pending; 007 builds on its implementation, and
  both can be accepted together (0.5.0 would then include 0.4.0's work).
