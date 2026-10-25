# Quickstart: Validate Launch Readiness

Expected behavior: [site metadata contract](contracts/site-metadata.md),
[deployment contract](contracts/deployment.md), [data model](data-model.md). Record actual
outcomes, environment, and limitations in `verification.md` (the readiness report). A
check not recorded there has not run.

Verification builds use `SITE_URL=https://portfolio.example` and are **not releasable**.

## Prerequisites

- Node.js `24.12.0`, npm `11.6.2`, installed Chrome, Git clean at the commit under test.
- QA tools in `%TEMP%\akash-portfolio-qa-tools` (outside the app):
  `npm install --prefix $env:TEMP\akash-portfolio-qa-tools playwright-core axe-core lighthouse`;
  record the installed versions.
- `private-evidence/terms.txt` present for the confidentiality check.

## 1. Setting behavior

```powershell
Remove-Item Env:SITE_URL -ErrorAction SilentlyContinue; npm run build   # expect failure naming SITE_URL
$env:SITE_URL = "http://portfolio.example"; npm run build               # expect failure: https required
$env:SITE_URL = "https://localhost"; npm run build                      # expect failure: local host
$env:SITE_URL = "https://portfolio.example/path"; npm run build         # expect failure: path
$env:SITE_URL = "https://portfolio.example"
```

## 2. Static checks and build

```powershell
npm run lint; npm run typecheck; npm run build
```

Build lists `/`, `/work`, `/changelog`, four case studies, `/sitemap.xml`, `/robots.txt`,
`/og.png`, `/icon.svg`, `/_not-found`. Changelog/package mismatch still fails the build
(try once, revert).

## 3. Metadata, sitemap, robots, 404 (`npm run start -- -p 3100`)

```powershell
$env:BASE_URL = "http://127.0.0.1:3100"
node specs/005-launch-readiness/verification/check-metadata.mjs
```

Expect exit 0: every public page 200 with unique title, description, canonical
`https://portfolio.example/...`, full sharing tags, icon; `/og.png` 1200×630 PNG; sitemap
equals the public-page canonicals; robots allows `/` and names the sitemap;
`/work/user-management-api`, `/work/meridian`, `/nope` return 404 with `noindex` and no
canonical. Open `/og.png` and the icon and inspect them.

## 4. Served output and confidentiality

```powershell
node specs/005-launch-readiness/verification/check-served-output.mjs
node specs/003-additional-case-studies/verification/check-confidentiality.mjs
node specs/005-launch-readiness/verification/check-evidence-ids.mjs
```

Expect: zero draft markers and zero phone/town terms on the served surface (server-only
chunk counts recorded as informational); feature 003 scope zero; every evidence ID found
in the register.

## 5. Browser checks

```powershell
node specs/005-launch-readiness/verification/run-browser-checks.mjs
```

Every public page and the 404 page: 390/768/1440 px and emulated 200% zoom with
screenshots and no overflow or clipping; keyboard order and visible focus; reduced motion;
JavaScript disabled (essential text, navigation, diagram equivalents); every visible
action; axe at 390 and 1440 px; computed contrast. Inspect every screenshot by eye; try
Chrome's real 200% zoom once, headed.

## 6. Performance

Lighthouse mobile and `--preset=desktop` on `/` and `/work/notification-platform`
against `next start`, JSON into `verification/lighthouse/`. Record scores, LCP, CLS, TBT,
Chrome version, and machine. Investigate if LCP > 2.5 s or CLS > 0.1; no pass threshold.

## 7. Content and actions

Re-read every page against `docs/project-evidence.md`, 004's owner-supplied facts, and the
résumé; log corrections with the date. Fill the action table (destination, method, date,
result). Run the Resume Analyzer demo flow once with a fictional PDF; add the demo link
only if it works. Ask the owner to confirm the LinkedIn link.

## 8. Fresh install of the tested commit

```powershell
$dir = Join-Path $env:TEMP "akash-portfolio-fresh"; git clone --no-local . $dir
git -C $dir checkout <tested-commit>
Push-Location $dir; $env:SITE_URL = "https://portfolio.example"
npm ci; npm run lint; npm run typecheck; npm run build; Pop-Location
```

Expect all to pass on the first attempt with the documented versions; record Node, npm,
commit, and duration.

## 9. Release record

`package.json`, footer, and newest changelog entry read `1.0.0` (SC-007).
`docs/releases/1.0.0.md` names the tested commit, notes, known limitations, and open
blockers; status stays `prepared — blocked` while the production address or any other
blocker is open. `docs/deployment.md` lets the owner deploy, confirm, and roll back
without asking (SC-009). No tag, push, or deployment.
