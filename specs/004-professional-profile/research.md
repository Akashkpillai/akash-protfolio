# Research: Professional Profile

Research date: 2026-10-25. Stack unchanged from 001–003 (`next@16.4.3`, `react@19.3.1`,
`tailwindcss@4.3.3`, TypeScript `6.0.3`, Node.js `24.12.0`); no new dependency.

## Content source

**Decision**: Typed local records — `src/content/experience.ts`, `skills.ts`,
`contact.ts`, `changelog.ts`, and About text added to `src/content/profile.ts` — each
field traceable to the spec's "Owner-supplied facts". Experience wording follows the
clarifications (FR-003–FR-005), not the PDF where they differ.

**Rationale**: Same pattern as case studies (constitution IV); a wrong or missing field is
a type error; one place to review against the résumé.

## Résumé download

**Decision**: Copy the owner's corrected PDF to `public/resume/Akash_K_Pillai_Resume.pdf`.
A small server-only helper checks at build time whether that file exists; the "Download
résumé" action renders only if it does. The link uses the `download` attribute and a
same-origin path.

**Rationale**: FR-007 requires the file be served by the site, and that a missing file
produces no action rather than a broken one. A build-time check needs no runtime fetch.
Swapping the file at the same path updates it.

**Alternatives considered**: A manual boolean flag (can drift from the file); linking to
an external file host (not "in the project").

## Copy email

**Decision**: A small Client Component next to the `mailto:` link, rendered only after
hydration (same `useSyncExternalStore` pattern as `FlowDiagram`), using the Clipboard API
and a polite live region ("Email copied"). If the copy fails, it shows the address
selected for manual copying.

**Rationale**: FR-008 needs a fallback when no mail app is configured; without
JavaScript the mail link and visible address still work.

## Version display

**Decision**: Import `version` from `package.json` (JSON modules are already enabled) in
a new server-rendered `Footer`; the changelog's newest entry must equal it, enforced by a
build-time assertion in `src/content/changelog.ts` that throws if they differ.

**Rationale**: FR-011/SC-003 — a mismatch fails the build instead of reaching visitors.

## Releases and dates

**Decision**: Changelog entries (newest first):
- **0.3.0** — this feature (professional profile). Date set at acceptance.
- **0.2.0** — 2026-10-25: engineering case studies (features 002 and 003, commits
  `ae63bbd`, `e4cc7ff`, `f66e736`).
- **0.1.0** — 2026-10-25: portfolio foundation (commit `b4a8f07`).

The package moves from 0.1.0 directly to 0.3.0; 0.2.0 is recorded as history because its
version bump was deferred (002 decision). The 001 provisional role/headline gate is closed
by the résumé ("Backend Developer | AI Developer"), recorded in verification.

## Navigation and section order

**Decision**: Homepage sections: 01 hero, 02 Selected work, 03 Experience, 04 Skills,
05 About, 06 Approach, 07 Contact. Navigation: Home, Work, Experience, About, Approach,
Contact (route-absolute `/#…`), plus `/changelog` in the footer only. The mobile menu
lists the same items.

**Rationale**: Recruiter reading order; Approach's illustrative flow stays but moves down.
Six nav items still fit at the 52rem desktop breakpoint; checked in browser.

## Skill-to-case-study links

**Decision**: A skill links to a published case study only where that case study's
reviewed evidence shows the skill (e.g. Kafka → Notification Platform; pgvector, RAG →
Meridian; Groq API → Resume Analyzer; NestJS → HRMS). Links resolve through
`publishedProjects` so an unpublished project never gets a link.

## Confidentiality check scope

**Decision**: Feature 003's term search is rerun on case-study pages,
`src/content/case-studies/`, and the register only. The employer's short name is now
expected in Experience and the homepage, so those are excluded from that check; case
studies must still name no organization.
