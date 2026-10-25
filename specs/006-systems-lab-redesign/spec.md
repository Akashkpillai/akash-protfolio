# Feature Specification: Systems Lab Redesign

**Feature Branch**: not created (Git is on `feat/005-launch-readiness`; no branch hook is configured)

**Created**: 2026-10-26

**Status**: Draft

**Input**: User description: "Redesign the existing portfolio as 'Akash / Systems Lab' — an interactive developer workspace where visitors explore how real backend and AI systems work. Dark graphite interface, warm off-white text, electric teal, cobalt blue, and restrained copper accents, thin grid lines, sparing glow; original, no copying of delin.dev; no robot mascot, fake terminal boot, purple cyberpunk, fake metrics, or invented screenshots. Homepage: compact navigation, hero, interactive project constellation around an 'AK' node, dynamic architecture panel, current-focus strip, work section of interactive system previews; restyled case studies with section reveals, sticky architecture summary, scroll-based highlighting; experience, skills, about, contact kept. Purposeful animation with reduced-motion fallbacks. Responsive at 390/768/1440 and 200% zoom. Preserve evidence-backed content, routes, résumé, contacts, metadata, draft exclusion, and accessibility. No deploy, publish, tag, push, or release." (Full brief supplied by the owner on 2026-10-26.)

## Starting state (observed 2026-10-26)

- Feature 005 (launch readiness) is **paused** with uncommitted work in the working tree:
  the production-address setting, per-page metadata, sitemap, robots, sharing card, icon,
  content corrections, and accessibility fixes. This feature keeps all of it.
- The owner has started a prototype: a Systems Lab homepage component and styles that
  replace the hero. It is the starting point, not the finished design; its introduction
  sentence ("reliable backend systems … that solve real problems") is not supported by
  reviewed evidence and must be replaced.
- Published projects (from the evidence register): HRMS Backend, Meridian Assistant,
  Notification Platform, Resume Analyzer. User Management API is a draft.
- The ratified constitution (principle II) and `docs/design-direction.md` require the warm
  ivory "Engineering Journal" identity. This redesign replaces that identity.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand who Akash is and explore his systems from the homepage (Priority: P1)

A recruiter or engineer lands on the homepage. Within the first screen they see the name,
role, headline, an honest one-paragraph introduction, and a map of the published projects
arranged around an "AK" node. They select a project with a mouse, finger, or keyboard and an
architecture panel shows that project's summary and an explanatory flow of how its system
works, with a link to the full case study.

**Why this priority**: The homepage is the first impression and the core of the new
concept; without it there is no redesign.

**Independent Test**: Open the homepage at 1440, 768, and 390 px; select every project node
by pointer, touch emulation, and keyboard; confirm the panel updates, is announced, and links
to the right case study; repeat with reduced motion and with JavaScript disabled.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** it loads, **Then** the name, role, headline,
   introduction, "Explore systems" action, and (when the résumé exists) a "Resume" action
   are visible without scrolling at 1440 px and without any intro animation.
2. **Given** the project map, **When** a visitor activates a project node by click, tap,
   Enter, or Space, **Then** that node shows a visible selected state, every other node
   shows unselected, and the architecture panel shows the selected project's name, summary,
   flow steps, explanatory label, and case-study link.
3. **Given** a screen-reader user, **When** they change the selected project, **Then** the
   change is announced once, and each node exposes its name and selected state.
4. **Given** reduced motion is requested, **When** a project is selected or a flow is
   traced, **Then** the result appears immediately without animated movement.
5. **Given** JavaScript is disabled or fails, **When** the homepage is read, **Then** every
   published project's name, summary, flow steps, and case-study link are still present as
   static content.
6. **Given** any flow step shown in the panel, **When** it is compared with the evidence
   register, **Then** it is supported by a cited claim, and unfinished or unexercised steps
   carry the same status labels as the case study.
7. **Given** a phone-width screen, **When** the visitor reaches the project map, **Then** the
   projects appear as large selectable cards in a vertical list, each target at least 44 by
   44 px, with the panel directly below the cards and no horizontal scrolling. (The brief
   asked for the panel below the selected project; placing one panel there would make the
   visual order differ from the keyboard order, so it follows the card list instead.)

---

### User Story 2 - Browse work and read case studies in the new style (Priority: P2)

A visitor scans the work section or the work index, where each project appears as a system
preview, and opens a case study. The case study keeps all reviewed text and labels, and adds
a summary of the system that stays in view on wide screens and highlights the part of the
page being read.

**Why this priority**: Case studies hold the evidence; they must look consistent with the
new homepage and stay as readable and honest as before.

**Independent Test**: Open the work section, `/work`, and each published case study at 390,
768, and 1440 px, by keyboard, with reduced motion, and with JavaScript disabled; compare all
claims and labels with the previous version.

**Acceptance Scenarios**:

1. **Given** the work section or `/work`, **When** it is viewed, **Then** each published
   project shows its title, one-sentence summary, stack, an evidence note, an explanatory
   architecture preview, and an "Open case study" action; no draft project appears.
2. **Given** a case study, **When** it is read, **Then** every section, claim, status label,
   limitation, diagram explanation, and source statement from before this feature is present
   with unchanged wording, except corrections recorded with evidence.
3. **Given** a case study on a wide screen, **When** the visitor scrolls, **Then** a system
   summary stays in view and marks the section currently being read; on narrow screens the
   summary appears once near the top instead.
4. **Given** sections entering the viewport, **When** motion is allowed and JavaScript runs,
   **Then** they reveal with a short transition; otherwise they are simply visible.
5. **Given** a project with a private source, **When** its case study is viewed, **Then** no
   source link appears; only public, register-matched source URLs are linked.

---

### User Story 3 - Read the profile and contact Akash anywhere on the site (Priority: P3)

A visitor reads experience, skills, and about, then emails, copies the email address, opens
LinkedIn or GitHub, or downloads the résumé. Navigation, the 404 page, the changelog, and
link previews all match the new identity.

**Why this priority**: These sections already work; this story restyles them and keeps the
whole site consistent.

**Independent Test**: From every page, use every navigation item and contact action by
pointer and keyboard on desktop and mobile; open the changelog and an unknown address;
inspect the sharing image and icon.

**Acceptance Scenarios**:

1. **Given** any page, **When** the navigation is used, **Then** Work, Experience, About,
   Contact, and (when the PDF exists) Resume reach their destinations; on narrow screens a
   menu button opens and closes the same items by keyboard and touch.
2. **Given** the homepage, **When** experience, skills, about, and contact are read, **Then**
   all owner-confirmed facts and links from feature 004 are present, unchanged.
3. **Given** an unknown or draft address, **When** it is opened, **Then** the 404 page, in
   the new style, links to the homepage and `/work`.
4. **Given** a shared link, **When** a preview is generated, **Then** its image and the site
   icon use the new identity and only owned material.

---

### Edge Cases

- JavaScript disabled or failing: all text, navigation, project flows, and case-study
  content remain readable; interactive-only controls are not shown as dead buttons.
- Reduced motion: no reveal, glow pulse, flow-line travel, or panel slide; state changes are
  immediate.
- The number of published projects changes (a project returns to draft, or one is added):
  the map shows exactly the published projects (one to six) without manual layout edits; a
  draft never appears in the map, panel, previews, or any generated file.
- A project with no flow data: its node still opens its case study; the panel shows its
  summary and a link, without an empty diagram.
- Résumé file missing: no Resume navigation item or button is rendered.
- Keyboard focus is on a node when the panel updates: focus stays on the node; the update
  does not move focus or scroll the page.
- 200% zoom and 390 px: the three-part hero collapses to a single column; long project names
  and the email address wrap without overflow.
- Touch devices: nothing depends on hover; every hover effect has an equivalent focus or
  selected state.
- Colour vision differences: selected state, status, and project identity are conveyed by
  text, shape, or border, not colour alone.
- Visitors arriving at `/#work`, `/#experience`, `/#about`, or `/#contact` from another page
  land on that section.

## Requirements *(mandatory)*

### Functional Requirements

**Identity and navigation**

- **FR-001**: The site MUST present the "Akash / Systems Lab" identity: a dark graphite
  background, warm off-white text, electric teal, cobalt blue, and restrained copper accents,
  thin grid lines, and glow used only for hover, focus, selection, or the central node.
- **FR-002**: The site MUST NOT use a robot mascot, terminal boot sequence, purple palette,
  overlapping editor windows, file explorer, custom cursor, browser frame, fake metrics, or
  invented screenshots, and MUST NOT copy delin.dev's layout or styling.
- **FR-003**: The top navigation MUST show the brand "AKASH / SYSTEMS LAB" and the items
  Work, Experience, About, Contact, and Resume (Resume only when the approved PDF exists),
  and MUST work from every page; on narrow screens the items MUST be in an accessible menu
  with a visible open/closed state.

**Homepage**

- **FR-004**: The hero MUST show the name, the role, the headline "Backend systems. Practical
  AI. Thoughtfully built.", a short introduction built only from owner-confirmed facts, an
  "Explore systems" action that moves to the project map, and a "Resume" action when the PDF
  exists.
- **FR-005**: The project map MUST show every published project, and only published
  projects, as nodes connected to a central "AK" node, each with its name visible as text
  and its own accent colour.
- **FR-006**: Each project node MUST be operable by pointer, touch, and keyboard (Tab to
  reach, Enter or Space to select), expose its selected state to assistive technology, and
  show a visible selected state that does not rely on colour alone.
- **FR-007**: Selecting a node MUST update the architecture panel to show the project name,
  its one-sentence summary, its explanatory flow steps in order, a link to its case study,
  and the label "Explanatory diagram — not live system data" (or equivalent wording).
- **FR-008**: Panel updates MUST be announced politely to assistive technology and MUST NOT
  move keyboard focus or scroll the page.
- **FR-009**: Each flow step MUST be traceable to one or more claim IDs in
  `docs/project-evidence.md`; steps describing unfinished or unexercised code MUST show the
  same status labels used in the case studies; no step may imply live status, production
  reliability, delivery guarantees, or tested behaviour beyond the evidence.
- **FR-010**: A visitor MUST be able to trace the selected flow step by step (a "Trace
  flow" control), with the current step identified in text, not only by highlight.
- **FR-011**: A "current focus" strip MUST show the owner-supplied statements "Building
  useful backend systems", "Exploring practical AI applications", and "Making complexity
  easier to understand", presented as statements, not as status or monitoring data.
- **FR-012**: The homepage MUST keep the work, experience, skills, about, and contact
  sections, reachable through navigation and in-page links.

**Work and case studies**

- **FR-013**: The work section and `/work` MUST present each published project with title,
  one-sentence summary, stack, an evidence note (such as source status or the presence of
  unfinished parts), an explanatory architecture preview, and an "Open case study" action.
- **FR-014**: Case-study pages MUST keep their routes, every section, claim, status label,
  limitation, and diagram explanation, with wording unchanged except recorded corrections,
  and MUST link a source only when it is public and matches the evidence register.
- **FR-015**: On wide screens a case study MUST keep a system summary in view that
  identifies the section currently being read; on narrow screens the summary MUST appear
  once near the top and not overlap content.
- **FR-016**: Case-study sections MAY reveal with a short transition as they enter view, but
  only as an enhancement: their content MUST be visible by default and without JavaScript.

**Motion**

- **FR-017**: Motion MUST be limited to: node hover and focus glow, selection and panel
  transitions, flow tracing, section reveals, and small hover transitions on actions. No
  motion may loop continuously, block content, or shift layout.
- **FR-018**: When reduced motion is requested, all transitions, reveals, and flow-line
  movement MUST be removed, with every state change applied immediately.

**Preservation**

- **FR-019**: All routes, page titles, descriptions, canonical addresses, sharing tags,
  sitemap, robots rules, draft exclusion, and 404 behaviour from features 002–005 MUST be
  preserved; descriptions MUST still be drawn from visible content.
- **FR-020**: Owner-confirmed profile content, experience, skills, contact details, the
  résumé file, and every evidence ID and case-study claim MUST be preserved; no new
  personal detail, metric, demo, or screenshot may be added.
- **FR-021**: The sharing image and site icon MUST be redrawn in the Systems Lab identity
  from owned material only (the site's own typography, colours, and text).

**Accessibility and responsiveness**

- **FR-022**: Text and interface colours MUST meet WCAG 2.2 AA contrast (4.5:1 for body
  text, 3:1 for large text, focus indicators, and essential interface boundaries).
- **FR-023**: Every interactive element MUST be keyboard reachable in reading order with a
  visible focus indicator; the skip link MUST remain; no information may be available only
  on hover.
- **FR-024**: Layout MUST be: three columns (introduction, project map, panel) on wide
  desktops; two columns with the panel below the map on tablets; a single column with large
  selectable project cards and the panel directly after the cards on phones; with no
  unintended horizontal scrolling at 390, 768, or 1440 px or at 200% zoom.
- **FR-025**: Touch targets for project nodes, navigation, and primary actions MUST be at
  least 44 by 44 CSS pixels.
- **FR-026**: Every diagram (project map, flows, previews, case-study architecture) MUST
  have an equivalent text explanation available without interaction.

**Process**

- **FR-027**: This feature MUST NOT deploy, publish, tag, push, or create a release; the
  package version moves to 0.4.0 only at owner acceptance, with the footer and changelog in
  agreement.

### Key Entities

- **Published project**: an existing project record with status "published"; supplies the
  node name, accent, summary, stack, source status, and case-study link.
- **System flow**: an ordered list of explanatory steps for one project, each with a short
  label, a one-sentence explanation, cited evidence IDs, and an optional status (unfinished,
  or implemented but not run end to end); may include one alternate path (for example, a
  fallback).
- **Accent**: one of the identity's accent colours assigned to a project for its node,
  preview, and panel, always paired with the project's name.
- **Focus statement**: one of the three owner-supplied "current focus" sentences.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 1440 px, the name, role, headline, both hero actions, and the project map
  are visible in the first screen on 100% of loads, with no intro animation.
- **SC-002**: 100% of published projects appear in the map, previews, and `/work`; 0 draft
  projects appear in any page, panel, metadata, sitemap, or generated file.
- **SC-003**: Every project node can be selected by keyboard alone in at most 2 key presses
  after reaching it, and 100% of selections update the panel and its announcement.
- **SC-004**: 100% of flow steps cite at least one evidence ID that exists in the register.
- **SC-005**: 0 public pages show unintended horizontal scrolling or clipped content at 390,
  768, 1440 px, or 200% zoom, confirmed by inspected screenshots.
- **SC-006**: 0 automated accessibility violations and 0 text-contrast failures on every
  public page and the 404 page; focus indicators measure at least 3:1.
- **SC-007**: With reduced motion, 0 elements keep a transition or animation; with
  JavaScript disabled, 100% of homepage project flows and case-study sections are readable.
- **SC-008**: 100% of case-study claims, labels, and evidence IDs present before this
  feature remain, apart from recorded corrections; 100% of owner-confirmed profile facts
  and contact links remain.
- **SC-009**: The metadata, sitemap, robots, and 404 checks from feature 005 pass unchanged.

## Assumptions

- The owner's brief (2026-10-26) is the instruction to replace the Engineering Journal
  identity; constitution principle II and `docs/design-direction.md` are amended to the
  Systems Lab identity before implementation, with the delin.dev prohibitions kept.
- Feature 005 resumes after this feature and re-runs its browser, accessibility, and
  performance checks on the new design before release 1.0.0.
- This redesign is released as 0.4.0 (pre-1.0, materially changed design); feature 004's
  0.3.0 acceptance remains the owner's separate step.
- The site is dark-only; no light theme is offered in this feature.
- "Scroll-based highlighting of system steps" means the case-study summary marks the section
  being read; flow steps themselves are highlighted by selection or tracing, not by scroll.
- The previous homepage "Approach" section and its illustrative flow are replaced by the
  project map and panel; the navigation no longer lists Home or Approach (the brand links
  home).
- The optional command-style navigation mentioned in the brief is out of scope.
- The introduction sentence is drawn from the owner-confirmed About text (backend services
  with Node.js, NestJS, and PostgreSQL, and AI features).
- Project accents: three identity accents plus one additional restrained accent so four
  published projects can be told apart; names are always shown, so colour is never the only
  cue.
- No new runtime dependency is expected; any added font or animation library must be
  justified in the plan.
