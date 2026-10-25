# Toolchain and local integration inspection

Observed 2026-10-25 in `C:\Users\HP\Desktop\akash-portfolio`. These are local command/file observations, not an assertion that tools are current globally or compatible with an unselected Next.js release.

## Installed versions

| Tool or artifact | Actual observed version | Evidence |
| --- | --- | --- |
| Specify CLI | `1.2.3` | `specify version` |
| Codex integration | `1.2.3` | `.specify/integration.json`, `.specify/integrations/codex.manifest.json` |
| Spec Kit core files | `1.2.3` | `.specify/integrations/speckit.manifest.json`, `.specify/init-options.json` |
| Bundled Full SDD Cycle workflow | `1.0.1` | `.specify/workflows/workflow-registry.json`, `.specify/workflows/speckit/workflow.yml` |
| Git | `2.37.1.windows.1` | `git --version` |
| Node.js | `24.12.0` | `node --version` |
| npm | `11.6.2` | `npm --version` |
| Python | `3.14.7` | `python --version`, `specify version` |
| uv | `0.12.23` | `uv --version` (build `46b84fd0b`, 2026-10-03) |
| Codex CLI | `0.164.0-alpha.11.1` | `codex --version` |
| PowerShell | `7.6.5` | `$PSVersionTable.PSVersion.ToString()` |

The guide's pinned Spec Kit version matches the installed CLI and integration. Portfolio target release versions (`0.1.0` through `1.0.0`) are separate and have not been released.

## Integration health and isolation

`specify integration status` exited 0 and reported OK: default/installed integration `codex`, multi-install safe yes, shared templates aligned to codex, **0 modified managed files, 0 missing managed files, 0 invalid manifest paths, 0 unchecked manifests**. Initialization settings use PowerShell (`ps`), skills mode, sequential feature numbering, and hyphen invocation separator.

Ten local skill directories are installed under `.agents/skills/`: constitution, specify, clarify, plan, checklist, tasks, analyze, implement, converge, and deprecated taskstoissues. Use `$speckit-...` chat invocations and the guide's expanded workflow; no integration reinstall or upgrade was needed or performed.

Local inspection found no active `.specify/feature.json`, no `specs/`, no `.specify/extensions.yml`, no presets, and no template overrides. `.specify/memory/constitution.md` still contains generic placeholders; it has not been ratified. `SPECIFY_INIT_DIR`, `SPECIFY_FEATURE_DIRECTORY`, and `SPECIFY_FEATURE` were unset; the shared resolver returned this exact workspace root. `SPECIFY_REPO_ROOT` was also unset (not the root override used by the inspected resolver). No HRMS-specific state was found in the inspected portfolio files and no external project state was imported.

The installed resolver prefers `SPECIFY_INIT_DIR` for project root and `SPECIFY_FEATURE_DIRECTORY` over `.specify/feature.json` for feature directory. `SPECIFY_FEATURE` supplies a context label, not proof of the actual Git branch. Use the read-only `check-prerequisites.ps1 -PathsOnly -Json` after feature creation and compare with `git branch --show-current`. No feature-prerequisite check was run because there is no feature yet.

## Limits and prerequisites

- `git status --short` exited 1: `fatal: not a git repository (or any of the parent directories): .git`. No `.git` entry exists here, so no branch, dirty-state inventory, or tested commit can be reported. Git initialization is outstanding before branch-based feature work; it was not performed in this documentation step.
- `codex --version` returned its version with warnings about denied stale-temp cleanup and PATH alias creation under the user's Codex temp directory. No repair was attempted; integration status itself succeeded. Revisit only if execution is affected.
- No `package.json`, application dependencies, lockfile, or app source exists. Next.js/Tailwind/React/TypeScript package versions remain unselected. Check compatibility with installed Node during feature planning/implementation and record the actual chosen versions.
- No application build, lint/type checks, browser tests, project demo checks, accessibility audit, or performance measurement ran. Documentation checks do not establish application readiness.

Preserve the guide, installed managed files, and constitution scaffold. [Roadmap](roadmap.md) describes the next constitution and feature steps; [content needed](content-needed.md) separates missing personal inputs from workflow prerequisites.

## Preparation verification

All 31 pre-existing files matched their pre-edit SHA-256 hashes. Only the six planning documents and root `AGENTS.md` were added. All relative links in those seven documents resolved. Integration status was rechecked with the same OK/zero-change result. `resolve-template.ps1 constitution-template -Json` successfully returned the placeholder scaffold without ratifying or modifying it. No app source, package manifest, active feature, or Git entry was created.
