# Feature Specification: Additional Case Studies — Meridian Assistant and HRMS Backend

**Feature Branch**: not yet created (Git is on `feat/002-engineering-case-studies`; no branch hook is configured)

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description (summarized; the owner asked that no organization or background context be recorded): "Add two more engineering case studies: Meridian Assistant (private repository; Discord RAG and proposal-approval agent; evidence in docs/project-evidence.md section 04, reviewed at commit 22ca5b0; no public source link; owner-supplied screenshot needs approval and sanitization) and an HRMS backend (private source; owner has permission to describe it publicly; sanitized case study with no code, no source link, no confidential details). Reuse the feature 002 case-study system (typed content, claim statuses, evidence IDs, diagrams, /work routes, publication gate). Meridian stays excluded until this feature's evidence gate is met."

Owner statements recorded 2026-10-25: both repositories are private; the owner has permission to describe the HRMS backend publicly.

Owner decision 2026-10-25: "remove the userManagement from the work and add these two" — User Management API is unpublished; the published set becomes Resume Analyzer, Notification Platform, Meridian Assistant, and HRMS backend.

## Clarifications

### Session 2026-10-25

- Q: What order do the four projects appear in? → A: HRMS backend, Meridian Assistant,
  Notification Platform, Resume Analyzer.
- Q: May any organization be named? → A: No. Public text names no organization and
  gives no background beyond the project itself; it presents each as a system the owner
  built. It does not claim either was a personal side project or the owner's product.
- Q: Where does this feature go in the roadmap? → A: Part of the v0.2.0 case-studies
  release; the professional profile remains the roadmap's next feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the Meridian Assistant case study (Priority: P1)

A recruiter or engineer opens `/work/meridian-assistant` from a shared link and reads how
the owner built a Discord assistant that answers from a brand-scoped document library with
sources and drafts proposal estimates that render only after an explicit stored approval.
The page explains why there is no source link.

**Why this priority**: The owner considers Meridian their main project; it shows applied
AI work (retrieval, agent limits, approval integrity) that the existing three case
studies do not.

**Independent Test**: Request the address directly with and without JavaScript; read all
sections end to end and trace each claim to the Meridian evidence record.

**Acceptance Scenarios**:

1. **Given** the Meridian case study is published, **When** it is opened directly, **Then**
   it shows the same sections as the existing case studies, with a source statement that
   the repository is private instead of a link.
2. **Given** the repository reports test or evaluation results that were not re-run,
   **When** those results are mentioned, **Then** the text attributes them to the
   project's own report and does not present them as independently verified.
3. **Given** a screenshot is shown, **When** a visitor views it, **Then** it is a genuine
   capture approved by the owner, contains only fictional data, and shows no real account
   identifiers.

---

### User Story 2 - Read the HRMS backend case study (Priority: P1)

A recruiter opens `/work/hrms-backend` and learns what HR problems the backend handles,
the owner's role as its backend developer, how it is structured, the decisions and
tradeoffs, and its limitations — without seeing anything confidential.

**Why this priority**: It is the owner's main professional work and the only case study
from employment; it carries the most weight with recruiters.

**Independent Test**: Request the address directly; confirm every section is present,
that no source link, code, internal name, or personal data appears, and that the owner
has signed off the exact public text.

**Acceptance Scenarios**:

1. **Given** the HRMS case study is published, **When** it is opened, **Then** it states
   that the source is not public and what the owner built, and names no company or
   employer.
2. **Given** any HRMS public text or diagram, **When** it is reviewed against the
   confidentiality rules, **Then** it contains no source code, file paths, repository
   name, internal hostnames or URLs, credentials, customer or employee names or data, or
   business figures.
3. **Given** the HRMS text has not been approved by the owner word for word, **When** the
   site is built, **Then** the project stays draft and appears nowhere.

---

### User Story 3 - Browse all selected work (Priority: P2)

A visitor scans the homepage and `/work` and can reach all four published case studies;
User Management API is no longer listed.

**Why this priority**: Browsing is how most visitors find case studies, but each case
study is already reachable by direct link.

**Independent Test**: From the homepage and `/work`, by pointer and keyboard, open every
listed project; each reaches its case study.

**Acceptance Scenarios**:

1. **Given** `/work`, **When** it loads, **Then** it lists exactly the published projects
   in curated order, each linking to its case study.
2. **Given** the homepage, **When** the visitor reaches selected work, **Then** it shows
   the four published projects as numbered stories per FR-009, and every published
   project is reachable from the homepage in at most two activations.
3. **Given** `/work/user-management-api`, **When** it is requested, **Then** the
   not-found page is returned and User Management API appears on no public surface.

---

### User Story 4 - Private material stays private (Priority: P1)

A visitor or crawler inspects pages, metadata, generated files, and the published
repository; nothing confidential and no draft
content is exposed.

**Why this priority**: Constitution principles I and VIII and the owner's publication
permission make this non-negotiable.

**Independent Test**: Search every public page, page metadata, generated asset, and the
committed evidence register for the confidentiality terms list (FR-004) and for draft
project text.

**Acceptance Scenarios**:

1. **Given** either project is draft, **When** any public surface is produced, **Then**
   its name, slug, and text appear nowhere, including in client-side files.
2. **Given** the evidence register is committed to the repository, **When** it is read,
   **Then** the HRMS entry contains only material that is itself safe to publish.

---

### Edge Cases

- The HRMS repository contains secrets or environment files: they are never opened; only
  variable names may be noted if needed.
- The HRMS commit history shows other authors: the contribution statement is limited to
  what the owner confirms and the history supports; the difference is recorded.
- Code and documentation disagree: copy follows the code; the discrepancy is recorded
  internally, as in feature 002.
- The Meridian local copy changes after review: it is re-reviewed at the new commit
  before publication.
- The owner withdraws publication permission or screenshot approval: the project or asset
  returns to draft and disappears at the next build.
- The supplied screenshot is a composite with a promotional title: the title wording is
  not reused as a claim; only the approved captures may be shown.
- No screenshot is approved: a labeled explanatory diagram is used, with no empty
  preview area.
- 390, 768, 1440 px and 200% zoom: new pages stay readable without horizontal scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Two projects MUST be added with the same case-study structure as feature
  002 (problem, contribution, implementation, architecture, decisions, tradeoffs,
  limitations, stack, source statement) and the same claim-status labels, evidence IDs,
  and draft/published status.
- **FR-002**: A project MUST NOT be published until its evidence record contains:
  reviewed commit, review date, reviewer, evidence mapped to public claims, limitations,
  owner-confirmed contribution, asset provenance (if any), and owner review of the
  record. Source review MUST be read-only from the owner-supplied local copy; nothing is
  installed or executed, and secrets files are not opened. Meridian's record (register
  section 04, commit `22ca5b0`) is reused unless the code has changed.
- **FR-003**: Where no public source exists, the source section MUST state why instead of
  linking, using the same neutral wording for both: the source code is private. No URL
  is derived or guessed.
- **FR-004**: HRMS public text, diagrams, metadata, and its evidence-register entry MUST
  NOT contain source code, file or folder paths, repository or service names internal to
  the codebase, hostnames, URLs, credentials, customer, employee, or candidate names or
  data, or business figures. Architecture is described at component level. The register
  entry MUST hold only material that is safe to publish, because the register is
  committed.
- **FR-005**: The HRMS case study MUST be published only after the owner approves its
  exact public text and diagram, with the approval date recorded. Permission to publish
  (owner-confirmed 2026-10-25) is recorded in the register.
- **FR-006**: Public text, metadata, and the committed evidence register MUST NOT name or
  describe any company, employer, client, or interview, and MUST NOT reproduce any
  project brief. Neither project is described as a personal side project or as the
  owner's product.
- **FR-007**: Results the project reports about itself (tests, evaluation scores) MUST be
  attributed to the project's own report unless re-run; claims not exercised end to end
  carry the existing "Implemented code path" label.
- **FR-008**: A screenshot MAY be shown only when the owner confirms it is an unedited
  capture, all real account identifiers are removed, all data shown is fictional, and
  its provenance is recorded. Otherwise the preview is a labeled explanatory diagram.
- **FR-009**: The homepage selected-work section and `/work` MUST present exactly the four
  published projects as numbered stories in this order: 01 HRMS backend, 02 Meridian
  Assistant, 03 Notification Platform, 04 Resume Analyzer. The homepage previews MUST not
  be an interchangeable card grid.
- **FR-016**: User Management API MUST be set to draft: it disappears from the homepage,
  `/work`, cross-links, metadata, generated routes, and client-side files, and
  `/work/user-management-api` returns not-found. Its content and evidence record are
  kept so it can be republished later.
- **FR-010**: The addresses `/work/meridian-assistant` and `/work/hrms-backend` MUST
  serve their published case studies directly; draft or unknown slugs return the existing
  not-found page; draft content appears in no page, metadata, generated route, or
  client-side file.
- **FR-011**: The contribution section MUST state the owner's role as confirmed: sole
  author of Meridian, noting the AI-assisted tools recorded in its evidence; for HRMS,
  the owner-approved wording that they built most of the HR modules in a backend developed
  by a small team (the commit history does not support "the whole backend"). No
  organization is named (FR-006).
- **FR-012**: Each new case study MUST include an architecture explanation with a complete
  static text equivalent, readable without JavaScript, meeting feature 002's diagram
  rules; new previews MUST not be interchangeable with each other or the existing three.
- **FR-013**: The Resume Analyzer and Notification Platform case studies, navigation, and
  v0.1.0 behavior MUST keep their accepted behavior apart from story numbering and
  cross-links; this feature extends but does not rewrite them.
- **FR-014**: New pages MUST meet feature 002's accessibility and layout requirements:
  keyboard operable, visible focus, reduced motion honored, readable at 390, 768, and
  1440 px and 200% zoom without unintended horizontal scrolling.
- **FR-015**: This feature is part of the v0.2.0 case-studies release. It adds no
  version bump or changelog; those stay with the professional-profile feature, as decided
  in feature 002. The roadmap's feature order is unchanged.

### Key Entities

- **Project** (from feature 002): gains a source availability of public link or private.
- **Evidence record**: as in feature 002, plus publication permission and owner text
  approval for HRMS, and screenshot approval and sanitization for Meridian.
- **Asset**: an approved screenshot with provenance, owner confirmation date, and the
  sanitization applied.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both new case-study addresses load directly with all required sections,
  with JavaScript enabled and disabled.
- **SC-002**: Zero matches for the confidentiality terms list across public pages,
  metadata, generated files, and the committed register entry for HRMS.
- **SC-003**: Every public factual claim in the two new case studies maps to an evidence
  record entry; 100% of self-reported results are attributed, and 100% of recorded
  limitations are visible.
- **SC-004**: While a project is draft (including User Management API), zero occurrences
  of its name, slug, or text appear in any public surface, including client-side files.
- **SC-005**: Every published project is reachable from the homepage in at most two
  activations, by pointer and by keyboard.
- **SC-006**: At 390, 768, 1440 px and 200% zoom, zero instances of unintended horizontal
  scrolling on new or changed pages.
- **SC-007**: The owner has approved the HRMS public text and any screenshot, with dates
  recorded, before either is published.

## Assumptions

- Slugs are `meridian-assistant` and `hrms-backend`; neither names an employer or client.
- The owner's publication permission covers describing the backend at component level; it
  does not cover publishing code, screenshots of internal systems, or data.
- No HRMS screenshot is used; the HRMS preview is a labeled explanatory diagram.
- Reading the local HRMS copy read-only during implementation is authorized by the
  owner's request to add the project.
- The existing typed content, claim statuses, diagram components, routes, and not-found
  page from feature 002 are reused without new dependencies.
- No demo is linked for either project.
- Any link already shared to `/work/user-management-api` will reach the not-found page,
  which links to `/work`; no redirect is added.
- Unpublishing User Management API changes feature 002's accepted scope (FR-003/FR-004/
  FR-005 there named three projects); feature 002's artifacts are left as the record of
  that release, and this spec governs the new published set.
- Feature 002's owner review (T041) and acceptance (T043) remain separate and are not
  changed by this feature.
- This step produces specification artifacts only; nothing is implemented until
  `/speckit-implement`.
