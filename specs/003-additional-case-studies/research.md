# Research: Additional Case Studies

Research date: 2026-10-25. Builds on [002 research](../002-engineering-case-studies/research.md);
the installed stack (`next@16.4.3`, `react@19.3.1`, `tailwindcss@4.3.3`, TypeScript
`6.0.3`, Node.js `24.12.0`) and 002's content system are reused unchanged.

## Source availability without a link

**Decision**: Replace `Project.repositoryUrl` with `source`, a union of
`{ kind: "public"; url }` and `{ kind: "private" }`. Private projects render the
statement "Source code is private" where the link would be. The reviewed short commit is
still shown.

**Rationale**: FR-003 forbids guessed URLs and requires the same neutral wording for both
new projects (FR-006 forbids saying why). A union makes a missing link a deliberate type,
not an empty string.

**Alternatives considered**: Optional `repositoryUrl`: an omitted field cannot be told
apart from a forgotten one.

## Where private evidence lives

**Decision**: The committed register (`docs/project-evidence.md`) holds, for HRMS and
Meridian, only publishable evidence: reviewed commit, module-level claim statements with
IDs, limitations, owner confirmations and dates. File-level evidence paths for HRMS are
kept in `private-evidence/hrms.md`, which is added to `.gitignore` and never committed.
Meridian's register section is rewritten to remove background context and the local path.

**Rationale**: Constitution I requires recorded sources; FR-004 and FR-006 forbid
organization or background details in committed files, and file paths from a private
codebase are internal names. Splitting the record keeps claims traceable for the
owner while keeping the repository safe to publish.

**Alternatives considered**: Recording paths in the register (breaks FR-004); recording
nothing below module level (breaks traceability, constitution I).

## Preview and diagram kinds

**Decision**:
- Meridian: new kind `workflow` — an approval-gated flow (slash command → actor check →
  brand-scoped tools → estimate version → stored approval → render), drawn by a new
  static `WorkflowDiagram`. Unfinished or self-reported parts carry claim statuses.
- HRMS: kind chosen from the source review — `data-model` if the backend is primarily
  relational modules (the kind is free now that User Management API is unpublished),
  otherwise a static `architecture` view. It is static either way.
- Notification Platform stays the only interactive diagram (002 FR-012).

**Rationale**: FR-012 requires previews that are not interchangeable. With User
Management API unpublished, the four kinds can be pipeline, architecture, workflow, and
data-model. All diagrams reuse `DiagramCanvas` (grid layout, static text list), so no new
drawing code beyond a thin wrapper.

## Screenshot

**Decision**: Support an optional `screenshot` on `Project`
(`{ src; alt; width; height; provenance; approvedOn }`), rendered with `next/image` from
`public/work/<slug>/`. It is set only after the owner confirms the captures are unedited
and the visible Discord user ID is removed (FR-008). The supplied composite's title banner
is cropped off; only capture panels are used. Until approval the preview stays the labeled
diagram.

**Rationale**: `next/image` is already part of the installed framework (no dependency);
static files avoid any runtime fetch.

## Unpublishing User Management API

**Decision**: Set its `status` to `"draft"`. Content and register section stay.

**Rationale**: 002's selector already removes drafts from every surface, and 002's
T025 check proved it, including client bundles after the `claim-status.ts` fix.

## Ordering

**Decision**: `order` becomes a plain number used only for sorting and display
(`01`–`04`); HRMS 1, Meridian 2, Notification Platform 3, Resume Analyzer 4. User
Management API keeps `order: 5` while draft. Homepage layouts cycle right, left,
full-width, right.

## HRMS source review method

**Decision**: During implementation, read the owner-supplied local copy
in place, read-only: record `git rev-parse HEAD`, branch, and commit authorship counts;
read structure, schema, and module code; never open `.env` or other secret files; never
run, install, or copy anything. Record public-safe claims in the register and file paths
in the private evidence file. If history shows other authors, contribution wording is
limited to what the owner confirms (spec edge case).

**Rationale**: Same method as 002 and Meridian, adapted for a private team codebase.

## Release

**Decision**: Part of v0.2.0 (clarification). No version bump or changelog; those remain
with the professional-profile feature as decided in 002.
