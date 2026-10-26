<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0 (MAJOR: principle II redefined; the required identity changes)
- Modified principles: II. Distinct Visual Identity — "The Engineering Journal" (warm ivory,
  dark ink, restrained copper) → "Akash / Systems Lab" (dark graphite, warm off-white text,
  electric teal, cobalt blue, restrained copper). All delin.dev prohibitions kept; added
  prohibitions on fake metrics, invented screenshots, and diagrams presented as live telemetry.
- Added sections: none. Removed sections: none.
- Authority: owner-directed amendment from the owner's Systems Lab redesign brief
  (2026-10-26, feature 006). Rationale: the owner chose a new identity for the portfolio.
- Templates: plan/spec/tasks templates read the constitution at runtime; no template edits needed.
- Affected artifacts: docs/design-direction.md and docs/product-brief.md describe the old
  identity (update in feature 006); specs/001–005 keep their history and remain valid records
  of the identity in force when they were accepted; feature 005 re-runs its UI checks.
- Deferred TODOs: none. The owner confirmed this amendment when accepting features 006 and 007
  (2026-10-26).
-->
# Akash K Pillai Portfolio Constitution

## Core Principles

### I. Evidence-Based Content

Every published claim MUST be supported by reviewed project evidence or user-confirmed information.
Reviews MUST record the source and date. Metrics, employment dates, testimonials, personal
contributions, and working demo links MUST NOT be invented. Meridian MUST remain unpublished
until supporting material is supplied and reviewed.

### II. Distinct Visual Identity

The portfolio MUST follow the "Akash / Systems Lab" direction: a dark graphite background,
warm off-white text, electric teal, cobalt blue, and restrained copper accents, thin grid
lines, glow used sparingly, clear typography with readable contrast, and purposeful system
diagrams that explain how real projects work. It MUST NOT copy delin.dev's terminal desktop,
purple palette, robot mascot, overlapping editor windows, file explorer, custom cursor, or
boot sequence. It MUST NOT show fake metrics or invented screenshots, or present a diagram
as live system data. Diagrams MUST explain real system behavior or be labeled illustrative
or explanatory.

### III. Accessible, Immediate Content

Essential content and navigation MUST be available without a blocking intro or animation.
Implemented interactions MUST support keyboard use, visible focus, readable contrast,
responsive layouts, and reduced motion. Essential explanations MUST remain available
without motion or optional interaction.

### IV. Simple, Maintainable Implementation

The portfolio MUST remain a single application with typed local content, reusable components,
and small interactive features. Each new dependency MUST have a documented requirement it
solves. Prefer existing platform capabilities when they meet that requirement.

### V. Specification-Led Development

Work MUST proceed one specified feature at a time. Its intended behavior and testable
acceptance criteria MUST be recorded before implementation. The specification, technical
plan, tasks, and accepted implementation MUST agree; changes in intended behavior MUST be
reflected in those artifacts.

### VI. Honest Verification

Each feature review MUST check meaningful user flows and content integrity against its
acceptance criteria. Reports MUST state which checks ran, their results, and material
limitations. Unrun checks MUST NOT be marked passed, and requirements MUST NOT be weakened
to conceal a failure.

### VII. Release Discipline

Releases MUST follow the stages in `docs/roadmap.md`. For an accepted release, the displayed
version, package version, and changelog MUST agree; record the tested commit and checks.
Specifications and implementation history MUST be preserved in Git. Deployment MUST be
prepared and reviewed separately from feature implementation.

### VIII. Safe Publication

Only approved public content and assets MAY be published. Credentials, private project
material, and unpublished drafts MUST be excluded from public pages, routes, indexes,
metadata, sitemap, and generated assets. Missing evidence or assets MUST result in an
honest omission or clearly labeled explanatory material, never a fabricated substitute.

## Publication Gates

Before publication, review claims against `docs/project-evidence.md` and the missing inputs
in `docs/content-needed.md`. Confirm personal contributions, public contact details, and
asset permissions where used. A demo action requires a checked working flow and date.
Draft or unknown case-study routes MUST return 404. Approved public examples MUST use
sanitized or fictional data.

## Development Workflow

Use the feature order and Spec Kit phases in `docs/roadmap.md`. Before each phase, verify
the workspace root, actual Git branch and status, and active feature context. Review the
feature's specification, plan, tasks, implementation, and validation evidence before
acceptance. Keep a failing criterion open until fixed or explicitly re-scoped through
the specification.

## Governance

This constitution governs portfolio specifications, implementation, review, and publication.
The project owner MUST review and approve amendments. An amendment MUST explain its rationale,
update affected feature artifacts, and record its impact in the Sync Impact Report before
acceptance. Review compliance at each feature acceptance and release decision.

Constitution versions use semantic versioning: MAJOR for incompatible governance changes,
MINOR for new principles or materially expanded rules, and PATCH for clarifications without
changed obligations. Portfolio release versions follow `docs/roadmap.md` independently.
No governance details remain unresolved for this initial adoption.

**Version**: 2.0.0 | **Ratified**: 2026-10-25 | **Last Amended**: 2026-10-26
