# Roadmap and Spec Kit workflow

Baseline: 2026-10-25. This workspace contains the guide and Spec Kit installation; no application, package manifest, feature spec, or release exists. Preparation is documentation only.

## Status update (2026-10-25)

The section below describes the original preparation baseline and is kept as history.
Since then: constitution 1.0.0 ratified; Git `main` established; features 001–004 built.

| Spec folder | Roadmap feature | Status |
| --- | --- | --- |
| `specs/001-portfolio-foundation` | 001 portfolio foundation | Merged; recorded as 0.1.0 |
| `specs/002-engineering-case-studies` | 002 engineering case studies | Merged; recorded as 0.2.0 |
| `specs/003-additional-case-studies` | Part of 002 (HRMS and Meridian case studies; User Management API unpublished) | Merged; part of 0.2.0 |
| `specs/004-professional-profile` | 003 professional profile | Built on `feat/004-resume`; package at 0.3.0; changelog and footer added |

Meridian was published in spec folder 003 after evidence review, earlier than "Later"
below. Next: launch readiness (`1.0.0`).

## Current state and next step (preparation baseline, historical)

- Confirmed root: `C:\Users\HP\Desktop\akash-portfolio`.
- Spec Kit CLI and Codex integration: **1.2.3**; bundled Full SDD Cycle workflow: **1.0.1**. See [toolchain](toolchain.md).
- `.specify/memory/constitution.md` is an unratified placeholder template, preserved unchanged.
- `.specify/feature.json` and `specs/` do not exist; no active feature.
- No Git repository: `git status --short` reports “not a git repository”. No branch, main, history, or tested commit exists. Git was not initialized by this planning task.
- No project extensions, presets, or template overrides were found. Relevant Spec Kit environment overrides are unset. No HRMS artifacts were imported.

**Next skill: `$speckit-constitution`**, using this portfolio's [product brief](product-brief.md), [design direction](design-direction.md), and build-guide section 8. No missing personal asset blocks drafting the constitution. Before the branch-based feature workflow, establish Git with a stable `main` and preserve a baseline of the current work. The constitution itself does not require an active feature.

Constitution inputs already supplied by the guide: evidence-backed claims; Engineering Journal identity; immediately available accessible content; one simple app with typed local content; one specified feature at a time; meaningful checks with truthful results; private material/credential protection; aligned release version, changelog, and tested commit. Ratification and constitution version belong to the constitution step, not this preparation.

## Planned releases — none completed

| Feature | Target | Scope and completion direction |
| --- | --- | --- |
| 001 — portfolio foundation | `0.1.0` | Semantic tokens, responsive navigation/layout, asymmetric hero, illustrative flow with static equivalent, keyboard/reduced-motion states. No dead links to later sections; omit résumé action until real PDF exists. |
| 002 — engineering case studies | `0.2.0` | Three selected stories, `/work`, direct case-study routes, evidence-based copy and varied visuals, draft exclusion/404, content readable without JavaScript. Reuse foundation. |
| 003 — professional profile | `0.3.0` | Confirmed experience/about/grouped skills/contact, supplied résumé, `/changelog`; functional homepage anchors from other routes, copy-email fallback, version from package metadata. |
| 004 — launch readiness | `1.0.0` | Verified copy/actions/assets, metadata/domain/sitemap/robots, fresh install and production build, lint/types, direct routes/404, responsive/keyboard/reduced-motion/accessibility/performance review, deployment/rollback instructions. Publication remains a separate user action. |
| Later | `1.1.0+` | Meridian only after evidence review; optional writing, richer diagrams, possible historical deployment archive |

## Installed workflow, one feature at a time

Use the installed chat skills in `.agents/skills/`; these are not PowerShell commands. After the constitution, follow the guide's expanded sequence, reviewing each output:

`$speckit-specify` → `$speckit-clarify` → `$speckit-plan` → `$speckit-checklist` → requirements review → `$speckit-tasks` → `$speckit-analyze` → resolve artifact conflicts → `$speckit-implement` → `$speckit-converge`.

Resolve remaining implementation/verification gaps and repeat within the active feature. Keep intended behavior in the spec first, then align plan/tasks/code. Checklist completion needs cited requirements; it cannot be marked complete simply to bypass a gate. The bundled workflow YAML is a shorter specify/plan/tasks/implement sequence with review gates; it does not replace the guide's additional phases. No workflow phase was executed in this preparation.

Before each phase confirm the root, `git status --short`, `git branch --show-current`, and active feature. Check `SPECIFY_INIT_DIR`, `SPECIFY_FEATURE_DIRECTORY`, and `SPECIFY_FEATURE` for cross-project overrides. Resolve the active directory from the explicit feature-directory override first, otherwise `.specify/feature.json`'s `feature_directory`; reject an unexpected location outside this project. Read its `spec.md` and relevant plan/tasks, and confirm they match the intended feature and working branch. Branch and spec directory names are independent; compare intent rather than assuming identical names.

For read-only path resolution after a feature exists, use `.\.specify\scripts\powershell\check-prerequisites.ps1 -PathsOnly -Json`. Its `BRANCH` field comes from Spec Kit context/fallback, not necessarily Git: verify the actual Git branch separately. Switching Git branches does not switch the persisted feature. If no active state exists, use `$speckit-specify` at the appropriate step; do not select another project's feature or invent state during preparation. No Git branch hook is configured in this installation; do not assume specify creates a branch automatically.

## Verification and releases

Feature plans choose compatible stable packages, record actual versions, use npm and a committed lockfile, and preserve `.specify/` and `.agents/` when scaffolding. Source layout follows build-guide section 4. No database or runtime GitHub API is needed.

Validation includes content/schema integrity, meaningful user flows, production build, lint/types, direct routes, 404 and draft exclusion, desktop/mobile screenshot inspection, keyboard/focus, reduced motion, and actual link/PDF/contact checks. Launch review includes 390/768/1440 pixel widths and no unintended horizontal scroll. Record accessibility/performance measurements with environment and limits; never report unrun checks as passing.

The portfolio release convention is patch for corrections, minor for added functionality, major for substantial redesign/material navigation change. It is independent of Spec Kit's version. Record real completed changelog entries, package/display version, checks, and tested commit. Create local annotated tags only for accepted releases; publish tags/release notes when ready. Tags do not preserve hosted deployments: retain a known-good deployment and rollback instructions. No release, tag, push, or deployment is authorized by this planning step.
