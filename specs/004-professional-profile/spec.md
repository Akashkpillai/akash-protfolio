# Feature Specification: Professional Profile

**Feature Branch**: not yet created (Git is on `main`; no branch hook is configured)

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Professional profile feature (roadmap 'professional profile', target v0.3.0): add Experience, About, grouped Skills, Contact, a résumé download, a /changelog page, and the site version from package metadata; make homepage anchors work from other routes. Source of truth is the owner's résumé (supplied 2026-10-25) plus owner-confirmed contacts: email, LinkedIn, GitHub. Feature 002 deferred the changelog and v0.2.0 version bump to this feature."

## Owner-supplied facts (2026-10-25)

Recorded here so every public statement can be traced. The owner said: "if you need any
other information take it from my resume."

- Name and positioning: Akash K Pillai — Backend Developer | AI Developer; summary states
  3+ years building REST APIs and backend applications.
- Contacts confirmed in chat: email `akashkpillai55@gmail.com`, LinkedIn
  `https://www.linkedin.com/in/akash-k-pillai/`, GitHub `https://github.com/Akashkpillai`.
  The résumé also lists a phone number, a home town, and a different LinkedIn URL.
- Experience (résumé): Software Developer, IITIL (Innovative Information Technologies India
  Limited), remote, July 2026 – Present; Backend Developer, InFineIT Global Services LLP,
  Surat, March 2023 – July 2026 (corrected résumé; the first PDF said "Present"), with projects
  FineOne (2025 – present on the résumé) and FineStar (2023 – 2025).
- Skills (résumé): six groups — Languages & Backend; AI & Retrieval; Databases &
  Architecture; Quality & Security; Tools & Integrations; Frontend.
- Education: B.Sc. Physics, NSS College, Kerala University, 2018 – 2021.
- Languages: English (fluent), Hindi (intermediate), Malayalam (native).
- Résumé file (2026-10-25): supplied from the owner's Downloads folder. The owner accepts
  that the downloadable PDF contains their phone number and home town (Alappuzha, Kerala,
  India); neither appears on any page. The owner states that InFineIT "Present" in the PDF
  is a mistake they will correct.

## Clarifications

### Session 2026-10-25

- Q: May Experience name IITIL and InFineIT, and may the IITIL role link to the HRMS case
  study? → A: Name both employers; the IITIL entry describes the work generically and does
  not link to or name the HRMS case study.
- Q: Which wording should Experience use for the HRMS work? → A: The approved case-study
  wording — the owner built most of the HR modules in a backend developed by a small team.
- Q: Are both roles current? → A: No. InFineIT ended June 2026: March 2023 – June 2026.
  IITIL is July 2026 – Present. (Superseded 2026-10-25 by the corrected résumé PDF: InFineIT ended July 2026.)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand who the owner is and their experience (Priority: P1)

A recruiter reads the homepage or follows the Experience link and learns the owner's
current roles, dates, responsibilities, skills, and education, then can tell which case
studies show that work.

**Why this priority**: Experience and skills are what recruiters screen first; the case
studies alone do not show career history.

**Independent Test**: Open the homepage and the Experience and About sections at 390,
768, and 1440 px with and without JavaScript; every role, date, skill group, and education
entry matches the résumé, and nothing appears that the résumé or owner did not supply.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** the visitor reaches Experience, **Then** each role shows
   title, organization (per FR-003), location or "Remote", dates, and responsibilities taken
   from the résumé.
2. **Given** the Skills section, **When** it is read, **Then** skills appear in the résumé's
   six groups, and skills demonstrated in a published case study link to it.
3. **Given** the About section, **When** it is read, **Then** it states the physics degree and
   the move into backend development using only résumé facts, with no invented motives.

---

### User Story 2 - Contact the owner or download the résumé (Priority: P1)

A recruiter wants to email the owner, open their LinkedIn or GitHub, or download the
résumé.

**Why this priority**: A portfolio without a working contact path fails its main purpose.

**Independent Test**: Activate every contact action and the résumé download by pointer and
keyboard; each reaches the right destination; copying the email works when no mail app is
configured.

**Acceptance Scenarios**:

1. **Given** the Contact section, **When** the visitor activates email, **Then** a mail link
   opens with the confirmed address, and a separate "Copy email" action copies it and
   confirms by visible text.
2. **Given** the résumé action, **When** activated, **Then** the approved PDF downloads; if
   no approved PDF is present, the action does not appear at all.
3. **Given** LinkedIn and GitHub links, **When** activated, **Then** they open the
   owner-confirmed URLs.

---

### User Story 3 - See what changed and which version is live (Priority: P2)

A visitor or reviewer opens `/changelog` and sees each release with its date and
changes, and the site footer shows the current version.

**Why this priority**: Constitution VII requires the displayed version, package version,
and changelog to agree for an accepted release; v0.2.0 is waiting on this.

**Independent Test**: Compare the footer version, the package version, and the newest
changelog entry; all three agree. Every listed release matches a recorded verification.

**Acceptance Scenarios**:

1. **Given** `/changelog`, **When** it loads, **Then** it lists 0.1.0, 0.2.0, and 0.3.0
   (newest first) with dates and a short summary each, drawn from the features' records.
2. **Given** any page, **When** the footer is read, **Then** it shows the same version as the
   package metadata and the newest changelog entry.

---

### User Story 4 - Navigate the whole site from any page (Priority: P2)

A visitor on a case study or `/changelog` uses the navigation to reach Work, Experience,
About, Contact, or Approach on the homepage.

**Why this priority**: New sections must not create dead links (constitution, SC-004 of
002).

**Independent Test**: From every route, activate every navigation item by pointer and
keyboard, including the mobile menu; each reaches its section.

**Acceptance Scenarios**:

1. **Given** any route, **When** a navigation item is activated, **Then** the visitor reaches
   that homepage section or route, and focus moves to it.

---

### Edge Cases

- The résumé and owner disagree (LinkedIn URL): the owner's chat confirmation wins; the
  difference is recorded and the owner is told the PDF shows a different URL.
- Résumé claims that reviewed evidence describes differently (HRMS scope): handled by
  FR-004; the site never shows two contradictory statements.
- The résumé PDF still shows InFineIT as "Present" and the "led end-to-end" wording: the
  site follows FR-004/FR-005; the owner is told the PDF differs before approving it.
- Feature 003's confidentiality term list includes the employer's short name; for this
  feature that name is intentionally public in Experience, so the check is rescoped to
  case-study pages only (case studies still name no organization).
- Phone number and home town: not shown on any page; the downloadable PDF still contains
  them, which the owner accepts by approving the PDF (FR-007).
- No approved PDF yet: the résumé action is omitted, never disabled or broken.
- JavaScript disabled: all text and the mail link work; "Copy email" may be absent.
- 200% zoom and 390 px: long organization names and skill lists wrap without horizontal
  scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The homepage MUST gain Experience, Skills, About, and Contact sections,
  numbered in the existing editorial style after Selected work, with every fact traceable
  to the owner-supplied facts above.
- **FR-002**: Experience MUST list each role with title, organization, location or remote,
  start and end dates, and responsibility bullets condensed from the résumé without adding
  metrics, customers, or achievements the résumé does not state.
- **FR-003**: Experience MUST name both employers — IITIL (Innovative Information
  Technologies India Limited) and InFineIT Global Services LLP. The IITIL entry MUST
  describe the work generically and MUST NOT link to or name the HRMS case study, and no
  case study gains an organization name.
- **FR-004**: Experience MUST describe the HR-system work with the approved case-study
  wording — the owner built most of the HR modules in a backend developed by a small team
  — not the résumé's "led end-to-end backend development". No page may contradict another.
- **FR-005**: Dates MUST be shown as: IITIL, July 2026 – Present; InFineIT, March 2023 –
  July 2026 (owner-corrected résumé PDF, 2026-10-25; supersedes the earlier "June 2026" answer).
- **FR-006**: Skills MUST appear in the résumé's six groups. A skill demonstrated in a
  published case study links to that case study; skills are not ranked or rated.
- **FR-007**: The résumé PDF MUST be copied into the project's own public files at a fixed
  address (e.g. `/resume/Akash_K_Pillai_Resume.pdf`) and downloaded from the website,
  never linked to a file on the owner's computer. The "Download résumé" action MUST appear
  only when an owner-approved PDF is in the project, and that PDF MUST show InFineIT as
  ending July 2026 so it does not contradict the site. Until a corrected PDF is supplied,
  the action is omitted — no placeholder, disabled, or broken action. Replacing the PDF
  later needs only the file swapped at the same address.
- **FR-008**: Contact MUST offer a mail link and a "Copy email" action for the confirmed
  address, plus LinkedIn and GitHub links to the confirmed URLs. No phone number, street
  address, or contact form.
- **FR-009**: About MUST state the owner's education and path into backend and AI work
  using résumé facts only, and the languages spoken; no invented motives, anecdotes, or
  personal details.
- **FR-010**: `/changelog` MUST list releases 0.1.0, 0.2.0, and 0.3.0, newest first, each
  with a date and a short summary drawn from the feature specs and verification records.
- **FR-011**: The package version MUST become 0.3.0 at this feature's acceptance; the site
  MUST display the package version (footer), and it MUST equal the newest changelog entry.
- **FR-012**: Navigation MUST include Work, Experience, About, and Contact (plus existing
  Home and Approach), working from every route, in desktop and mobile menus. The hero's
  existing actions keep working; a résumé action may be added per FR-007.
- **FR-013**: All new content MUST be readable without JavaScript, keyboard operable with
  visible focus, honor reduced motion, and stay readable at 390, 768, 1440 px and 200%
  zoom without horizontal scrolling.
- **FR-014**: The Engineering Journal visual language MUST be kept; no prohibited
  delin.dev motif; the hero, case studies, and existing sections keep their accepted
  behavior.
- **FR-015**: Page metadata MAY describe the owner's role and skills; it MUST NOT include
  the phone number or home town.

### Key Entities

- **Role**: title, organization (per FR-003), location or remote, start date, end date or
  "Present", responsibilities, related projects, related case-study links.
- **Skill group**: name and ordered skills; each skill optionally links to case studies.
- **Contact link**: kind (email, LinkedIn, GitHub), label, destination.
- **Release**: version, date, summary, related feature(s).
- **Résumé asset**: file, approval date, provenance.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of roles, dates, skill groups, and education facts on the site match
  the owner-supplied facts; zero facts appear that neither the résumé nor the owner
  supplied.
- **SC-002**: Every contact action and the résumé download (if present) reach their
  destination by pointer and keyboard; zero dead, placeholder, or disabled actions.
- **SC-003**: Footer version, package version, and newest changelog entry agree on every
  page.
- **SC-004**: Every navigation item works from every route in at most one activation.
- **SC-005**: Zero instances of horizontal scrolling or clipped content on new or changed
  pages at 390, 768, 1440 px and 200% zoom.
- **SC-006**: The phone number and home town appear on zero pages and in zero metadata.
- **SC-007**: Zero contradictions between Experience text and published case studies
  (checked by review).

## Assumptions

- Only the contacts confirmed in chat are used; the résumé's older LinkedIn URL is not.
- The current PDF (supplied 2026-10-25) still shows InFineIT as "Present", the "led
  end-to-end" wording, and the older LinkedIn URL. The owner will supply a corrected PDF;
  implementation copies it into the project. If only the current PDF is available at
  implementation, the owner decides whether to ship it or wait.
- FineOne and FineStar appear as projects under the InFineIT role, with the résumé's
  descriptions; they are not case studies.
- The OpenAI-powered HRMS assistant is shown as owner-confirmed experience (résumé); it was
  not part of the reviewed HRMS source.
- v0.2.0 is recorded retroactively in the changelog from features 002 and 003, which were
  merged to `main` on 2026-10-25; this feature accepts both v0.2.0 history and v0.3.0.
- Location on the site, if any, is limited to "Kerala, India".
- No deployment or domain work; that belongs to launch readiness.
- This step produces specification artifacts only.
