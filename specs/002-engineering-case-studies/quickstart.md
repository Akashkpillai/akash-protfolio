# Quickstart: Validate Engineering Case Studies

Validation guide for the implemented feature. Expected behavior is in the
[UI contract](contracts/ui.md) and [data model](data-model.md). Record actual outcomes in
`verification.md`; only checks that actually ran may be reported as passed.

## Prerequisites

- Project root, Git branch `feat/002-engineering-case-studies`, active feature
  `specs/002-engineering-case-studies`.
- `docs/project-evidence.md` updated with reviewed commits and claim IDs for all three
  projects, and reviewed by the owner.

## Build and static checks

```powershell
npm ci
npm run lint
npm run typecheck
npm run build
```

The build output should list `/work` and exactly three `/work/[slug]` paths.

## HTTP checks (production server)

```powershell
npm run start
```

In another terminal:

```bash
for p in / /work /work/resume-analyzer /work/notification-platform /work/user-management-api \
         /work/meridian /work/not-a-project /work/Resume-Analyzer /work/resume-analyzer/; do
  printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "http://127.0.0.1:3000$p"
done
```

Expected: 200 for the first five, 404 for the next three, 308 for the trailing slash.

## Content and draft checks

- Fetch each case study's raw HTML (`curl -s`) and confirm all nine sections, the
  diagram's component list, status labels, and the source link are present.
- Search the build output and fetched HTML for `meridian` (case-insensitive) and for
  `notification_service`; expect no matches.
- For each case study, compare every claim against `docs/project-evidence.md` using its
  claim IDs; every recorded limitation must appear.

## Browser checks

Run `node specs/002-engineering-case-studies/verification/run-browser-checks.mjs` (same
tooling setup as 001) to cover:

- 390 / 768 / 1440 px and 200% zoom on `/`, `/work`, and each case study:
  `scrollWidth <= innerWidth`; screenshots saved for visual review.
- JavaScript disabled: case-study text and diagram lists readable; no selection buttons.
- Keyboard: Work in desktop and mobile nav reaches `/#work` from a case study; homepage to
  any case study in at most two activations; Notification diagram buttons toggle
  `aria-pressed` and update the live region.
- Reduced-motion emulation: no transition on selection.
- Every visible link on all new pages returns a non-error destination.

## Regression

Re-run 001's checks for the hero, navigation disclosure, and illustrative flow to confirm
FR-018: behavior unchanged apart from the new nav items, hero link, and section numbers.
