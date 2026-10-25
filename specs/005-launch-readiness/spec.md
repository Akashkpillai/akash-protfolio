# Feature Specification: Launch Readiness

**Feature Branch**: not yet created (Git is on `main`; no branch hook is configured)

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Launch readiness (roadmap feature 004, target v1.0.0; spec folder 005 because spec folder 003 was an extra case-study feature). Prepare the completed portfolio for a reliable public release: working production build, type/lint checks, direct route access, useful 404, responsive layouts at 390/768/1440 px, keyboard navigation, visible focus, reduced motion, no unintended horizontal scrolling. Check public copy against its evidence and confirm every visible résumé/contact/source/demo action. Add accurate page titles, descriptions, sharing metadata, canonical URLs, sitemap, and robots rules based on the actual deployment domain; exclude drafts; use real owned assets; keep essential text visible if optional JavaScript or animation fails. Record accessibility and performance measurements with environment and limitations; no fabricated scores or full-conformance claims from automation alone. Ensure a fresh install from the lockfile can build. Document deployment variables, Node/package-manager versions, the tested commit, release notes, and rollback procedure. Resolve release-critical personal information/assets before publication. Prepare release v1.0.0; publishing remains an explicit subsequent user action." (Source: `docs/portfolio-build-guide.md` section 12 and `docs/roadmap.md`.)

## Starting state (observed 2026-10-25)

- Package version 0.3.0; features for 0.1.0–0.3.0 are on `main`. Feature 004's acceptance
  (owner confirmation of 0.3.0, task T028) is still open.
- Public routes: `/`, `/work`, four published case studies under `/work/<slug>`,
  `/changelog`, and the 404 page. The résumé PDF is the only public asset.
- Pages have titles; there are no descriptions, sharing metadata, canonical URLs, sitemap,
  robots rules, site icon, or sharing image.
- No deployment domain or hosting provider has been supplied (`docs/content-needed.md`).
- Resume Analyzer's listed deployment has never been checked; no demo action is shown.

## Clarifications

### Session 2026-10-25

- Q: What is the production domain and hosting provider? → A: Not decided yet. Build all
  domain-dependent values from one setting filled in later; the release stays blocked until
  it is set. Deployment and rollback instructions stay host-neutral until a host is chosen.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitors get a complete, working site on every device (Priority: P1)

A recruiter or engineer opens any public page directly — from a shared link, a bookmark, or
a search result — on a phone, tablet, or desktop, using a mouse, touch, or keyboard. Every
page loads, reads well, and every visible action works. A mistyped or draft address shows a
helpful 404 page.

**Why this priority**: A broken link, cut-off layout, or dead action on launch day costs
the visitor's trust; this is the minimum quality bar for 1.0.0.

**Independent Test**: From the production build, open every public route directly at 390,
768, and 1440 px, with keyboard only, with reduced motion, and with JavaScript disabled;
activate every visible action; open an unknown and a draft address.

**Acceptance Scenarios**:

1. **Given** the production build, **When** a visitor opens any public route directly,
   **Then** the page loads with its full essential content and no error.
2. **Given** a 390, 768, or 1440 px viewport, **When** any public page is viewed, **Then**
   no content is cut off and there is no unintended horizontal scrolling.
3. **Given** a keyboard-only visitor, **When** they move through any page, **Then** every
   interactive element is reachable in a logical order with a visible focus indicator.
4. **Given** reduced-motion is requested or JavaScript is disabled, **When** any page is
   viewed, **Then** all essential text and navigation remain visible and usable.
5. **Given** an unknown or draft case-study address, **When** it is opened, **Then** a 404
   page explains the page was not found and links back to the homepage and `/work`.
6. **Given** any visible résumé, email, copy-email, LinkedIn, GitHub, source, or demo
   action, **When** it is activated, **Then** it reaches the intended, working destination.

---

### User Story 2 - Shared links and search results describe the site accurately (Priority: P2)

Someone shares a case-study link in a chat app or on LinkedIn, or finds the site in a search
engine. The preview shows the correct page title, a truthful description, and an owned
sharing image; search engines find every published page and none of the drafts.

**Why this priority**: Sharing links is how a portfolio reaches recruiters, but the site is
usable without previews, so this follows basic quality.

**Independent Test**: Inspect each public page's title, description, canonical address, and
sharing preview; read the sitemap and robots rules; confirm each listed address is
published and reachable and no draft or private address appears anywhere.

**Acceptance Scenarios**:

1. **Given** any public page, **When** its metadata is read, **Then** it has a unique title,
   a description drawn from its published content, and a canonical address on the production
   domain.
2. **Given** a public page link, **When** a sharing preview is generated, **Then** it shows
   that page's title and description and an image made only from owned assets.
3. **Given** the sitemap, **When** it is read, **Then** it lists exactly the published
   public pages on the production domain and nothing else.
4. **Given** the robots rules, **When** they are read, **Then** they allow the public pages
   and point to the sitemap.
5. **Given** a draft or unknown case study, **When** the sitemap, metadata, and generated
   files are searched, **Then** it appears in none of them.

---

### User Story 3 - The owner can release, deploy, and roll back with confidence (Priority: P3)

The owner reviews a readiness report showing exactly which checks ran, their results, the
measurements taken, and any blockers. They follow written instructions to deploy the tested
commit as v1.0.0, and to restore the previous good version if the deployment is faulty.

**Why this priority**: Release preparation turns the work into a public launch, but it
depends on the quality and metadata work in Stories 1 and 2.

**Independent Test**: From a clean copy of the tested commit, install from the lockfile and
build using only the written instructions; confirm the version is 1.0.0 everywhere it
appears; read the report, release notes, and rollback steps.

**Acceptance Scenarios**:

1. **Given** a clean copy of the tested commit, **When** the documented install and build
   steps are followed, **Then** they succeed with the recorded runtime and package-manager
   versions.
2. **Given** the release candidate, **When** the package version, footer, and newest
   changelog entry are compared, **Then** all read 1.0.0.
3. **Given** the readiness report, **When** the owner reads it, **Then** every check lists
   its environment, result, and limitations, and every unrun check is marked unrun.
4. **Given** the deployment instructions, **When** the owner follows them, **Then** they
   know every required setting, how to confirm the deployment works, and how to roll back.
5. **Given** an unresolved release blocker, **When** release is considered, **Then** the
   report names the blocker and the release is not marked ready.

---

### Edge Cases

- The production address setting is missing when the site is built: the build MUST either
  stop with a clear message or mark its output as not releasable; it MUST NOT fall back to a
  guessed or local address in canonical, sharing, sitemap, or robots values.
- A source, LinkedIn, or demo destination rejects automated checks or is temporarily down:
  record what the check saw, confirm it manually, and do not mark it passed automatically.
- Resume Analyzer's listed deployment fails or cannot be meaningfully checked: no demo
  action is shown.
- A published claim no longer matches its evidence: correct or remove the claim before
  release; do not weaken the evidence record.
- A page renders differently when JavaScript is disabled or fails partway: essential text,
  navigation, and the static diagram equivalents must still be present.
- Long titles, link text, or the email address at 390 px or 200% zoom: text wraps without
  overflow.
- The deployed version differs from the tested commit: the release is not considered
  tested until that commit is checked.
- A previous deployment does not exist yet (first launch): rollback instructions describe
  taking the site offline or redeploying a known-good commit.

## Requirements *(mandatory)*

### Functional Requirements

**Site quality**

- **FR-001**: Every public route MUST load directly from the production build with its
  essential content, without relying on prior navigation.
- **FR-002**: Unknown and draft case-study addresses MUST show a 404 page with the not-found
  status, a plain explanation, and links to the homepage and `/work`.
- **FR-003**: Every public page MUST display without cut-off content or unintended
  horizontal scrolling at 390, 768, and 1440 px wide, and at 200% zoom on a desktop width.
- **FR-004**: Every interactive element MUST be keyboard reachable in a logical order, show
  a visible focus indicator, and be operable without a mouse.
- **FR-005**: With reduced motion requested, the site MUST not use non-essential motion;
  with JavaScript disabled or failed, all essential text, navigation, and diagram
  explanations MUST remain visible.
- **FR-006**: Text and interface colors MUST meet WCAG 2.2 AA contrast on every public page.

**Content and actions**

- **FR-007**: Every published claim MUST be re-checked against `docs/project-evidence.md`,
  the owner-supplied facts recorded in earlier specs, and the current résumé; unsupported
  claims MUST be corrected or removed, and the review date recorded.
- **FR-008**: Every visible résumé, email, copy-email, LinkedIn, GitHub, source, and demo
  action MUST be checked to reach its intended working destination, with the check date
  recorded; an action that cannot be confirmed MUST be removed or fixed before release.
- **FR-009**: A demo action MUST appear only after a meaningful end-to-end check with
  fictional or sanitized data and a recorded date; otherwise no demo action is shown.
- **FR-010**: Public pages, generated files, and published assets MUST contain no
  credentials, private evidence, unpublished drafts, or personal details the owner has not
  approved for publication.

**Discoverability and sharing**

- **FR-011**: Every public page MUST have a unique title and a description drawn from its
  published content.
- **FR-012**: Every public page MUST declare a canonical address on the production domain.
  The domain and hosting provider are undecided: the site MUST take the production address
  from one setting supplied at deployment time, and the release MUST stay blocked until the
  owner supplies that address and it is checked.
- **FR-013**: Every public page MUST provide sharing metadata (title, description, address,
  and image) so link previews show accurate content.
- **FR-014**: The sharing image and site icon MUST be made only from owned material — the
  site's own typography, colors, and text — and MUST include no photograph or third-party
  logo unless the owner supplies and approves one.
- **FR-015**: The sitemap MUST list exactly the published public pages on the production
  domain; draft, unknown, and 404 addresses MUST be excluded.
- **FR-016**: Robots rules MUST allow the public pages and reference the sitemap.
- **FR-017**: All domain-dependent values MUST come from one recorded production address,
  so changing the domain changes every canonical, sharing, sitemap, and robots value
  consistently.

**Release preparation**

- **FR-018**: A fresh install from the committed lockfile MUST succeed and produce a working
  production build, with type and lint checks passing.
- **FR-019**: The package version, displayed footer version, and newest changelog entry
  MUST all read 1.0.0, and the 1.0.0 changelog entry MUST describe only completed work.
- **FR-020**: A readiness report MUST record each check run — build, types, lint, direct
  routes, 404 and draft exclusion, responsive screenshots, keyboard and focus, reduced
  motion, JavaScript disabled, contrast and accessibility review, performance, links and
  actions, metadata, and confidentiality — with environment, date, result, and limitations.
  Unrun checks MUST be marked unrun, and automated accessibility results MUST NOT be
  described as full conformance.
- **FR-021**: Performance MUST be measured on the production build for the homepage and one
  case study on both a mobile and a desktop profile, with the tool, environment, and date
  recorded; no score is stated that was not measured.
- **FR-022**: Deployment instructions MUST be host-neutral until a host is chosen, and MUST
  list required settings and variables (including the production address), the
  runtime and package-manager versions, the tested commit, how to confirm a deployment
  works, and how to roll back to the last known-good deployment or commit.
- **FR-023**: Release notes for 1.0.0 MUST be prepared from the changelog and readiness
  report, and MUST list any known limitations.
- **FR-024**: The release MUST be prepared but not published, tagged, pushed, or deployed
  without the owner's explicit, separate instruction; any remaining release blocker MUST be
  listed and the release MUST NOT be marked ready while one remains.

### Key Entities

- **Public page**: A published route — address, title, description, canonical address,
  sharing image, and whether it is listed in the sitemap.
- **Production address**: The single owner-confirmed domain, supplied as one deployment
  setting, that all canonical, sharing, sitemap, and robots values derive from. Not yet
  decided; its absence is a release blocker.
- **Action check**: A visible link or button, its intended destination, the check date,
  the method (automated or manual), and the result.
- **Readiness check**: A named check with environment, date, result (pass, fail, or unrun),
  measurements where applicable, and limitations.
- **Release record**: Version 1.0.0, tested commit, release notes, known limitations,
  blockers, and status (prepared, not published).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of public routes load directly from the production build, and 100% of
  checked unknown and draft addresses show the 404 page with the not-found status.
- **SC-002**: 0 public pages show unintended horizontal scrolling or cut-off content at 390,
  768, and 1440 px or at 200% zoom, confirmed by inspected screenshots.
- **SC-003**: 100% of interactive elements on public pages are reachable and operable by
  keyboard with a visible focus indicator.
- **SC-004**: 100% of visible actions reach their intended working destination on the
  recorded check date; 0 demo actions appear without a recorded end-to-end check.
- **SC-005**: 100% of public pages have a unique title, description, canonical address, and
  sharing preview; the sitemap lists exactly the published pages; 0 draft or private
  addresses appear in any public page, metadata, sitemap, or generated file.
- **SC-006**: A clean copy of the tested commit installs and builds on the first attempt
  using only the written instructions.
- **SC-007**: The version reads 1.0.0 in 3 of 3 places (package, footer, newest changelog
  entry).
- **SC-008**: Every check in the readiness report states its environment, date, and result;
  0 unrun checks are reported as passed.
- **SC-009**: The owner can identify every release blocker, the deploy steps, and the
  rollback steps from the written documents alone, without asking for clarification.

## Assumptions

- Scope is preparation: hosting account setup, deployment, tagging, pushing, and announcing
  are separate owner actions after acceptance (constitution VII).
- Feature 004 (0.3.0) is accepted by the owner before 1.0.0 is accepted; work on this
  feature may proceed in parallel.
- Resume Analyzer shows no demo action at 1.0.0 unless its listed deployment passes a
  meaningful end-to-end check during this feature; a demo can be added in a later release.
- No approved project screenshots exist; the existing labeled diagrams remain the visuals,
  and missing screenshots do not block the release.
- The sharing image is a typographic card in the site's own style, unless the owner
  supplies an approved alternative.
- The published case studies and profile content from features 001–004 are the release
  content; this feature corrects errors but adds no new sections.
- "Accessibility review" means automated checks plus manual keyboard, focus, zoom,
  reduced-motion, and screenshot review; it is not a formal WCAG audit or certification.
- No analytics, cookies, or tracking are added, so no privacy notice is required.
