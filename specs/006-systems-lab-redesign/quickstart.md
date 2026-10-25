# Quickstart: Validate the Systems Lab Redesign

Expected behaviour: [UI contract](contracts/ui.md), [data model](data-model.md). Record
actual outcomes in `verification.md`; a check not recorded there has not run.

## Prerequisites

- Node.js `24.12.0`, npm `11.6.2`, Chrome installed.
- QA tools in `%TEMP%\akash-portfolio-qa-tools` (playwright-core, axe-core, lighthouse) from
  feature 005; if missing, browser checks are recorded as **not run**.
- `private-evidence/terms.txt` and `personal-terms.txt` for confidentiality checks.

## 1. Static checks and build

```powershell
npm run lint; npm run typecheck
$env:SITE_URL = "https://portfolio.example"; npm run build
```

Same route list as 005 (`/`, `/work`, `/changelog`, four case studies, `/og.png`,
`/icon.svg`, `/robots.txt`, `/sitemap.xml`, `/_not-found`).

## 2. Content and evidence (`npm run start -- -p 3100`)

```powershell
$env:BASE_URL = "http://127.0.0.1:3100"
node specs/005-launch-readiness/verification/check-evidence-ids.mjs
node specs/006-systems-lab-redesign/verification/check-content-preserved.mjs
node specs/005-launch-readiness/verification/check-metadata.mjs
node specs/005-launch-readiness/verification/check-served-output.mjs
```

Expect: 0 missing evidence IDs (flows included); every case-study claim and profile fact
present; 116 metadata assertions pass; served surface 0 draft, 0 personal.

## 3. Browser checks

```powershell
node specs/006-systems-lab-redesign/verification/run-browser-checks.mjs
```

Responsive (390/768/1440/zoom200) with screenshots; constellation (pointer, Enter, Space,
touch; `aria-pressed`; live message; panel link; trace); mobile map targets ≥ 44 px; focus
walk; reduced motion; no JavaScript (noscript flows, nav, case studies); axe and computed
contrast; links; case-study summary `aria-current` on scroll; profile actions.

Inspect screenshots by eye: identity, no forbidden motifs, no clipping, readable contrast.

## 4. Confidentiality and performance

003's `check-confidentiality.mjs` (case-study pages: 0). Lighthouse home mobile and desktop,
recorded as a regression signal only (005 owns release measurements).
