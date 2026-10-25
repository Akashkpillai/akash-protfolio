# Quickstart: Validate Additional Case Studies

Expected behavior is in the [UI contract](contracts/ui.md) and [data model](data-model.md).
Record actual outcomes in `verification.md`; only checks that ran may be reported as
passed.

## Prerequisites

- Active feature `specs/003-additional-case-studies`; actual Git branch recorded.
- Register sections 04 (Meridian) and 05 (HRMS) complete; owner approval of HRMS text and
  of any screenshot recorded.

## Build and static checks

```powershell
npm ci
npm run lint
npm run typecheck
npm run build
```

The build should list exactly `/work/hrms-backend`, `/work/meridian-assistant`,
`/work/notification-platform`, and `/work/resume-analyzer` under `/work/[slug]`.

## HTTP checks

Against `npm run start -- -p 3100`: 200 for `/`, `/work`, and the four case studies; 404
for `/work/user-management-api`, `/work/meridian`, and an invented slug.

## Confidentiality and draft checks

- Build a terms list from the private evidence file (organization, product, client,
  people, host, and repository names) plus generic background terms. Search fetched HTML, `.next/server`, `.next/static`, and
  `docs/project-evidence.md`: expect zero matches.
- Search for `User Management` and `user-management-api` in fetched HTML and
  `.next/static`: expect zero matches.
- Confirm `private-evidence/` is ignored: `git check-ignore private-evidence/hrms.md`.
- Trace every claim in the two new case studies to register IDs; every limitation is
  visible; self-reported results are attributed.

## Browser checks

Extend `specs/002-engineering-case-studies/verification/run-browser-checks.mjs` (or copy
it into this feature's `verification/`) with the new slugs: responsive at 390/768/1440 and
200% zoom, no-JavaScript content, keyboard reach from homepage in one activation, links,
reduced motion, and the 001/002 regression checks.
