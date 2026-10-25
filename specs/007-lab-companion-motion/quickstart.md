# Quickstart: Validate Feature 007

Expected behaviour: [UI contract](contracts/ui.md), [data model](data-model.md). Record
outcomes in `verification.md`; unrun checks are recorded as not run.

## Build

```powershell
npm run lint; npm run typecheck
$env:SITE_URL = "https://portfolio.example"; npm run build
npm run start -- -p 3100
```

## Content integrity

```powershell
$env:BASE_URL = "http://127.0.0.1:3100"; $env:SITE_URL = "https://portfolio.example"
node specs/007-lab-companion-motion/verification/check-lab-knowledge.mjs
node specs/006-systems-lab-redesign/verification/check-content-preserved.mjs
node specs/005-launch-readiness/verification/check-evidence-ids.mjs
node specs/005-launch-readiness/verification/check-metadata.mjs
node specs/005-launch-readiness/verification/check-served-output.mjs
```

## Browser

```powershell
node specs/007-lab-companion-motion/verification/run-browser-checks.mjs
```

All 006 checks plus `probe`, `askLab`, `motionPause`, `messageForm`, `scrollProgress`.
Review screenshots and a short manual pass: watch the Probe follow a selection and a trace,
scroll the homepage, drag the Probe, open Ask the lab, toggle motion, send a test message
(cancel in the email app).

## Performance

Lighthouse home mobile and desktop with motion on: performance ≥ 85 mobile, CLS < 0.1.
