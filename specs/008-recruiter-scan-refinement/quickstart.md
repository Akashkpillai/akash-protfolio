# Quickstart: Validate Recruiter-Scan Refinement

## Prerequisites

- Node `24.12.0`, npm `11.6.2`; dependencies installed with `npm ci` (lockfile unchanged).
- QA tools in `%TEMP%\akash-portfolio-qa-tools` (playwright-core, axe-core, lighthouse) and
  installed Chrome (see `docs/toolchain.md`).

## Static checks

```powershell
npm run lint
npm run typecheck
$env:SITE_URL = "https://portfolio.example"   # reserved test host: not releasable
npm run build
```

## Serve and run checks

```powershell
npx next start -p 3100     # background
node specs/008-recruiter-scan-refinement/verification/run-browser-checks.mjs
node specs/005-launch-readiness/verification/check-metadata.mjs
node specs/005-launch-readiness/verification/check-served-output.mjs
node specs/005-launch-readiness/verification/check-evidence-ids.mjs
node specs/007-lab-companion-motion/verification/check-lab-knowledge.mjs
```

## Manual / scripted scenarios (see spec user stories)

1. Hero at 1440/768/390: two columns at 1440; actions; select each project; "Explore
   architecture" opens/closes by mouse and keyboard; trace steps; JavaScript disabled.
2. Selected work: heading "Built to solve real problems"; card text equals records
   (automated comparison); featured vs compact layouts; case-study links.
3. Contact: one section; `/#contact` and `/#message` from `/work`; copy email; form empty /
   bad email / valid.
4. Motion: idle 30 s after the entrance — Probe position unchanged; selection and trace move
   it; pause and reduced motion stop all decorative animation.
5. Ask the lab: four suggestions, "More questions" reveals the rest, Escape returns focus.
6. Full-page screenshots at 1440 and 390 after scrolling every section.
7. Lighthouse mobile on `/` (and `/work`) against the production server; record scores and
   environment.

Before/after measurement of `#work` top at 390 px uses a build of `b6bcb35` (git worktree in
`%TEMP%`) and the feature build.
