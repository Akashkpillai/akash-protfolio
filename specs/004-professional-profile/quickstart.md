# Quickstart: Validate Professional Profile

Expected behavior: [UI contract](contracts/ui.md), [data model](data-model.md). Record actual
outcomes in `verification.md`.

## Build and static checks

```powershell
npm ci
npm run lint
npm run typecheck
npm run build
```

Build lists `/changelog`. Changing the newest changelog version away from `package.json`
must fail the build (try once, then revert).

## HTTP checks (`npm run start -- -p 3100`)

- 200 for `/`, `/work`, `/changelog`, the four case studies, and
  `/resume/Akash_K_Pillai_Resume.pdf` (if the PDF is present; check `content-type:
  application/pdf`).
- Homepage HTML contains `#experience`, `#skills`, `#about`, `#contact`, the confirmed
  email, LinkedIn, and GitHub URLs.
- Search all pages and metadata for the phone number (with and without spaces/prefix) and
  the town name: expect zero.
- Footer version on every page equals `package.json` and the newest `/changelog` entry.

## Content review

Compare every role, date, highlight, skill group, and education fact with the spec's
owner-supplied facts and clarifications; confirm the IITIL entry neither names nor links
the HRMS case study and uses the case-study wording.

## Confidentiality (feature 003 scope)

Run `specs/003-additional-case-studies/verification/check-confidentiality.mjs` with
`PAGES` set to the four case studies; expect zero matches on case-study pages,
`src/content/case-studies/`, and the register.

## Browser checks

Extend the 003 browser script: new nav items from every route (desktop and mobile), copy
email (live region text), résumé link, responsive 390/768/1440 and 200% zoom on `/` and
`/changelog`, no-JavaScript content, reduced motion, links, and the 001–003 regressions.
