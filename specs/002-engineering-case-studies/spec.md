# Feature Specification: Engineering Case Studies

**Feature Branch**: `feat/002-engineering-case-studies` (actual Git branch)

**Created**: 2026-10-25

**Status**: Draft

**Input**: Feature 002, targeting v0.2.0, reusing the completed v0.1.0 foundation. Visitors
browse three curated projects — Resume Analyzer, Notification Platform (repository
`notificationservice`), and User Management API — on the homepage and a work index, and
open each case study directly. Copy is evidence-based per `docs/project-evidence.md`;
unverified demos, Meridian, and other drafts stay out of every public surface; unknown
slugs return 404; primary content is readable without JavaScript. Source: build guide
section 10. Refined by owner request: use only evidence and repository links recorded in
`docs/project-evidence.md`; clearly label limitations and unverified claims; exclude
Meridian; specification artifacts only, no component implementation.

## Clarifications

### Session 2026-10-25

- Q: If personal contribution is unconfirmed at v0.2.0 review, what happens to that case
  study? → A: Owner confirmed now: all three projects are solely the owner's work.
- Q: Where should the site's Work navigation link go? → A: The homepage selected-work
  section (`/#work`) from every page; `/work` is reached from a "View all work" link
  there and from case studies.
- Q: Which case studies have a clickable architecture diagram? → A: Notification Platform
  only; Resume Analyzer and User Management API use static labeled visuals.
- Q: Who performs the source review before copy is written? → A: Claude reads the three
  public repositories read-only during implementation and records commit, paths, and
  claim mapping in `docs/project-evidence.md`; the owner reviews the register before
  release.
- Q: Where do the Decisions and Tradeoffs sections get their content? → A: Code first,
  owner adds reasons: each decision states what the reviewed code chose and its observable
  effect; any stated reason is kept only if the owner confirms it in the evidence
  register, otherwise it is removed before release.
- Q: Should `CHANGELOG.md` be created at v0.2.0 acceptance? → A: No; the changelog is
  deferred to feature 003, and v0.2.0 stays unaccepted as a release until then.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read a case study directly (Priority: P1)

A recruiter or engineer opens a shared link such as `/work/notification-platform` and reads
a complete case study: the problem, the author's contribution, how it is built, its
architecture, key decisions, tradeoffs, current limitations, stack, and source link.

**Why this priority**: Case studies are the substantive evidence of engineering ability;
each must stand alone when linked from a résumé or message.

**Independent Test**: Request each published case-study address directly in a fresh
browser session, with and without JavaScript, and read it end to end.

**Acceptance Scenarios**:

1. **Given** a published project's address, **When** it is opened directly, **Then** the
   page shows its title, problem, contribution, implementation, architecture, decisions,
   tradeoffs, limitations, stack, and verified source link without prior navigation.
2. **Given** JavaScript is disabled, **When** the case study loads, **Then** all of the
   sections above, including the architecture explanation text, are readable.
3. **Given** a case study, **When** the visitor reaches its end, **Then** they can return
   to the work index and reach the other published case studies.

---

### User Story 2 - Browse selected work (Priority: P2)

A visitor scans the homepage's selected-work section, sees three numbered project stories
with distinct evidence-based previews, and opens one. They can also visit `/work` to see
every published project in one list.

**Why this priority**: Browsing is the main route into the case studies and conveys
breadth quickly to recruiters.

**Independent Test**: From the homepage and from `/work`, use pointer and keyboard to open
each listed project; each listing reaches the matching case study.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** the visitor reaches selected work, **Then** each
   published project appears as a numbered story with title, one-line summary, stack, and
   a preview whose type differs between the three projects.
2. **Given** any page in this release, **When** the visitor activates Work in the site
   navigation, **Then** they reach the homepage selected-work section, which offers a
   "View all work" link to `/work`.
3. **Given** `/work`, **When** it loads, **Then** it lists exactly the published projects
   in their curated order, each linking to its case study.

---

### User Story 3 - Understand an architecture explanation (Priority: P3)

An engineer reads an architecture diagram in a case study, can tell which paths are
implemented, unfinished, or illustrative, and — in the Notification Platform case study,
the only interactive diagram — may select a component to read its responsibility.

**Why this priority**: Diagrams show system thinking, but the text already carries the
essential explanation, so interaction is an enhancement.

**Independent Test**: Read each diagram's static explanation, then operate any interactive
component selection by keyboard and pointer, and compare both to the evidence register.

**Acceptance Scenarios**:

1. **Given** a case-study diagram, **When** it is read without interaction, **Then** every
   component and its responsibility is available as text in a meaningful order.
2. **Given** the Notification Platform diagram, **When** a component is selected by keyboard or
   pointer, **Then** the selection and its responsibility are identified by text and
   state, not only by color or motion.
3. **Given** the Notification Platform diagram, **When** it is read, **Then** push delivery
   is shown as unfinished and retry/dead-letter paths are described as implemented code
   paths, not proven runtime behavior.

---

### User Story 4 - Drafts and unknown projects stay private (Priority: P1)

A visitor or crawler tries a draft or unknown project address (for example a Meridian
slug) or inspects the site's public listings; nothing about draft projects is exposed.

**Why this priority**: Constitution principles I and VIII make publication safety
non-negotiable.

**Independent Test**: Request draft and invented slugs directly; inspect homepage, `/work`,
page metadata, generated routes, and any sitemap for draft names or slugs.

**Acceptance Scenarios**:

1. **Given** a draft or unknown slug under `/work/`, **When** it is requested, **Then** the
   site returns a not-found response with a useful not-found page.
2. **Given** a draft project exists in the content source, **When** any public surface is
   produced, **Then** its name, slug, and content appear nowhere in pages, listings,
   generated routes, metadata, or sitemap.

---

### Edge Cases

- A project has no approved screenshot: its preview is a clearly labeled explanatory
  diagram or fictional example, never an invented product screen.
- A project's image fails to load: surrounding text still identifies and describes the
  project, and the layout does not collapse or show a broken-image placeholder as content.
- A project has no checked demo (all three at this baseline): no demo button, label, or
  disabled placeholder appears.
- A repository link is not recorded in `docs/project-evidence.md`, or does not resolve when
  checked before release: that link is omitted; no URL is derived or guessed.
- A case study's diagram interaction cannot run (no JavaScript, reduced motion): the full
  static explanation remains and no motion is required.
- At 390, 768, and 1440 pixel widths and at 200% text zoom, project stories, case studies,
  and diagrams remain readable without unintended horizontal scrolling.
- Trailing slashes or mixed-case variants of valid slugs either resolve to the case study
  or return not-found consistently; they never expose a draft.
- Code and README disagree (for example Resume Analyzer's README says TypeORM while the
  service uses Prisma): copy describes the implementation, and the discrepancy is noted
  in the evidence record.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each project MUST have a publication status of draft or published. Only
  published projects appear on any public surface.
- **FR-002**: A project MUST NOT be published until its evidence record contains: exact
  repository, reviewed commit, review date, evidence paths mapped to public claims, known
  limitations, asset provenance (if any asset is used), and personal contribution
  confirmed by the owner. The owner confirmed on 2026-10-25 that all three projects are
  solely their own work. Source review MUST be performed read-only against the recorded
  repository URLs at a pinned commit, with results recorded in `docs/project-evidence.md`;
  claims the reviewed code does not support MUST be dropped or labeled per FR-013. Owner
  review of the updated register is a v0.2.0 acceptance gate.
- **FR-003**: The homepage MUST present published projects as large numbered stories in
  the order Resume Analyzer, Notification Platform, User Management API, each with title,
  one-line summary, stack, a preview, and a link to its case study, followed by a "View
  all work" link to `/work`. The section MUST be the target of Work navigation. The three previews
  MUST differ in kind (e.g. pipeline diagram, architecture diagram, data model or request
  example) and MUST NOT be an interchangeable card grid.
- **FR-004**: `/work` MUST list exactly the published projects in curated order, each
  linking to its case study.
- **FR-005**: The addresses `/work/resume-analyzer`, `/work/notification-platform`, and
  `/work/user-management-api` MUST each serve the corresponding published case study when
  requested directly.
- **FR-006**: Each case study MUST contain: problem, personal contribution,
  implementation, architecture, decisions, tradeoffs, current limitations, stack, and
  source link(s). A demo link appears only when FR-010 is met. The contribution section
  MAY state sole authorship (FR-002); claims about what the software does still require
  reviewed source evidence. Decisions and tradeoffs MUST state what the reviewed code
  chose and its observable effect; a stated reason or motive MAY appear only when the
  owner has confirmed it in `docs/project-evidence.md`. Unconfirmed reasons MUST be
  removed before release and MUST never be shown as placeholders on a public page.
- **FR-007**: Requests for draft or unknown `/work/` slugs MUST return a not-found status
  and a not-found page that offers a way back to the work index.
- **FR-008**: Draft projects, including Meridian, MUST be absent from all public pages,
  listings, generated routes, page metadata, and sitemap.
- **FR-009**: All primary project content (story text, case-study sections, diagram
  explanations, links) MUST be present in the initial page response and readable with
  JavaScript disabled.
- **FR-010**: A demo action MUST appear only when a demo URL has a recorded meaningful
  flow check and date. A repository homepage URL MUST be treated as unverified. No
  disabled or placeholder demo action may appear.
- **FR-011**: Previews and illustrations MUST be either genuine approved sanitized
  screenshots or explanatory visuals explicitly labeled as such. Examples MUST use
  fictional data. Missing images MUST NOT leave broken or empty preview areas.
- **FR-012**: Each architecture diagram MUST have a complete static text equivalent.
  Only the Notification Platform diagram offers interactive component selection; Resume
  Analyzer uses a static labeled pipeline and User Management API a static data model or
  fictional request example. The interactive selection MUST be keyboard operable, expose its accessible
  name and selected state, show visible focus, and not rely on hover, color, or motion
  alone.
- **FR-013**: Case-study text and diagrams MUST visibly distinguish claim status wherever
  a claim is not plainly established, using consistent wording that visitors can read
  without JavaScript or color: *implemented code path* (present in reviewed source, not
  exercised end to end), *unfinished*, and *illustrative*. Unfinished parts (Notification
  Platform push delivery) MUST be marked unfinished; retry and dead-letter paths MUST be
  labeled implemented code paths. Each case study's limitations section MUST be visible
  without interaction and MUST list every limitation recorded for that project.
- **FR-014**: Case-study copy MUST be limited to claims recorded in
  `docs/project-evidence.md` (as updated by source review per FR-002):
  - Resume Analyzer: Prisma persistence, AI parsing via Groq with a basic fallback, the
    first-4,000-character input limit stated as a limitation; no model name in the
    headline; no accuracy or hiring-outcome claims.
  - Notification Platform: email/SMS integration code, routing, delivery-state
    persistence; push unfinished; no exactly-once, production-reliability, or working
    FCM/APNs claims.
  - User Management API: role guards and relational user/country/state/city modules,
    API documentation; no independently verified security or scalability claims.
  No invented metrics, testimonials, employment details, or demo results anywhere.
  Source links MUST use only the repository URLs recorded in the register
  (`resume-analyzer`, `notificationservice`, `user-management-with-prisma`); the similarly
  named `notification_service` repository MUST NOT be linked or cited.
- **FR-015**: Site navigation MUST gain a Work item that reaches the homepage
  selected-work section (`/#work`) from every page; each case study MUST link back to
  `/work`. Every visible link
  on homepage, `/work`, case studies, and not-found page MUST reach an available
  destination; Experience, About, Contact, and résumé remain omitted until feature 003.
- **FR-016**: Project stories, `/work`, case studies, and diagrams MUST remain readable
  and operable at 390, 768, and 1440 pixel widths and 200% text zoom without unintended
  horizontal scrolling, and MUST honor reduced-motion preferences.
- **FR-017**: New pages MUST reuse the foundation's Engineering Journal visual language,
  shell, and navigation, and MUST NOT introduce any prohibited delin.dev motif.
- **FR-018**: The v0.1.0 hero and illustrative flow MUST keep their accepted behavior;
  this feature extends but does not rewrite them.

### Key Entities

- **Project**: a curated portfolio entry — slug, title, one-line summary, order,
  publication status, stack, preview, repository link, optional checked demo, and case
  study.
- **Evidence record**: per-project provenance — repository, reviewed commit, review date,
  reviewer, evidence paths mapped to claims, README/code discrepancies, owner contribution
  confirmation and its date,
  limitations, asset provenance, demo check result and date. Kept in planning records;
  not shown to visitors unless useful.
- **Case study**: the long-form document for a project with the sections in FR-006.
- **Architecture explanation**: components with names, responsibilities, and status
  (implemented, implemented code path, unfinished, illustrative), plus its static text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of published case-study addresses load directly in a fresh session and
  show all nine required sections, with JavaScript enabled and disabled.
- **SC-002**: 100% of draft and at least three invented slugs return not-found; zero draft
  names or slugs appear in pages, listings, metadata, or sitemap.
- **SC-003**: Every public factual claim in project copy and diagrams maps to an entry in
  `docs/project-evidence.md` (reviewer can trace each one), and every stated decision
  reason maps to an owner confirmation there; zero unsupported claims remain,
  and 100% of recorded limitations and not-yet-exercised claims carry a visible label.
- **SC-004**: Every visible link and action across homepage, `/work`, case studies, and
  not-found reaches its labeled destination; zero dead, placeholder, or disabled actions.
- **SC-005**: A visitor can go from the homepage to any case study in at most two
  activations, by pointer and by keyboard alone.
- **SC-006**: At 390, 768, and 1440 pixel widths and 200% zoom, zero instances of
  unintended horizontal scrolling or clipped content on the new pages.
- **SC-007**: A reviewer can explain every diagram component from static text alone, and
  the three homepage previews are judged visually distinct in kind.

## Assumptions

- Slugs and titles follow the build guide: `resume-analyzer`, `notification-platform`,
  `user-management-api`; the Notification Platform slug intentionally differs from its
  repository name `notificationservice` (not `notification_service`).
- Before detailed copy is written, Claude reviews each public repository read-only at a
  pinned commit during implementation and updates `docs/project-evidence.md`; the owner
  reviews that register before release. Guide observations alone are not sufficient for
  publication. The three repositories themselves are not modified.
- No approved screenshots exist; labeled explanatory diagrams or fictional examples are
  the default previews. Screenshots can replace them later without spec changes.
- No demo is verified; Resume Analyzer's listed deployment stays unverified unless the
  owner requests a recorded check during this feature.
- Experience, About, Contact, résumé, `/changelog`, and launch metadata/domain belong to
  features 003 and 004. A sitemap is not required to be created here, but if one exists
  it must satisfy FR-008.
- This step produces specification artifacts only; no components, routes, or content
  files are implemented until `$speckit-implement`.
- The release gate for v0.2.0 (version, changelog, tag) follows the roadmap and
  constitution VII; this spec does not authorize publication or deployment. No
  `CHANGELOG.md` is created in this feature; it is deferred to feature 003. Feature 002
  can complete its own acceptance checks, but v0.2.0 is not recorded as an accepted
  release until package version, displayed version, and changelog agree.
