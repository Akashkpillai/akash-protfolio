# Implementation Plan: Launch Readiness

**Branch**: `main` (actual Git branch; create `feat/005-launch-readiness` before implementation) | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/005-launch-readiness/spec.md`

## Summary

Prepare release 1.0.0 (roadmap feature 004) without publishing it. Add per-page
descriptions, canonical URLs, sharing tags, an owned typographic sharing card, a site icon,
a sitemap, and robots rules, all derived from one build-time `SITE_URL` setting that stops
the build when missing or invalid. Then run and record the full readiness review — fresh
install, lint, types, build, direct routes, 404 and draft exclusion, responsive, keyboard,
reduced motion, no JavaScript, automated accessibility and contrast, Lighthouse
performance, evidence and action checks, confidentiality — and write host-neutral
deployment and rollback instructions and 1.0.0 release notes. The release stays
`prepared — blocked` until the owner supplies the domain. No new application dependency.

## Technical Context

**Language/Version**: Strict TypeScript `6.0.3`; Node.js `24.12.0`, npm `11.6.2` (unchanged)

**Primary Dependencies**: Existing pins only; `next/og` `ImageResponse` and Metadata
file conventions are part of `next@16.4.3`.

**Storage**: Typed local content in `src/content/`; static Manrope TTFs (OFL-1.1) in
`src/assets/fonts/`, read at build only.

**Testing**: lint, typecheck, build (including `SITE_URL` failure cases and the version
assertion); `fetch`-based metadata/sitemap/robots/404 check against `next start`;
Playwright browser checks extended from 004; axe-core; Lighthouse CLI; served-output,
confidentiality, and evidence-ID scripts; fresh clone + `npm ci`; manual content, action,
and screenshot review. QA tools stay outside the app in `%TEMP%\akash-portfolio-qa-tools`.

**Target Platform**: Modern browsers; any Node.js host running `next start` (host not chosen)

**Project Type**: Single Next.js App Router website

**Performance Goals**: Measured, not asserted: Lighthouse mobile and desktop on `/` and
`/work/notification-platform`; LCP > 2.5 s or CLS > 0.1 triggers investigation.

**Constraints**: No guessed or local address in any canonical, sharing, sitemap, or robots
value; drafts absent from the served surface; owned assets only; no tag, push, or deploy;
no unrun check reported as passed; no conformance claim from automation.

**Scale/Scope**: 7 public pages + 404; 4 generated files (`sitemap.xml`, `robots.txt`,
`og.png`, `icon.svg`); 2 owner docs; ~15 readiness checks.

## Constitution Check

| Principle | Pre-research gate | Post-design review |
| --- | --- | --- |
| I. Evidence-based content | Pass: FR-007 re-check; no new claims | Pass: descriptions come from visible content; evidence-ID script plus dated manual pass; demo only after a recorded flow check |
| II. Distinct visual identity | Pass | Pass: sharing card and icon use the Journal tokens and Manrope; no delin.dev motif |
| III. Accessible, immediate content | Pass | Pass: no new interaction; axe, contrast, keyboard, zoom, reduced motion, and no-JS checks on every page |
| IV. Simple implementation | Pass: no dependency planned | Pass: platform `next/og` and Metadata API; two small `src/lib` helpers; QA tools outside the app, each tied to a requirement; font files are assets with license |
| V. Specification-led | Pass: checklist 16/16, 1 clarification | Pass: FR→design mapping below; domain absence is a recorded blocker, not a spec gap |
| VI. Honest verification | Pass | Pass: report records environment, result, and limitations per check; `unrun` and `unconfirmed` states; verification domain marked not releasable |
| VII. Release discipline | Pass: target 1.0.0 | Pass: version in 3 places tied by the existing build assertion; tested-commit rule; deployment prepared separately; no tag/push/deploy |
| VIII. Safe publication | Pass | Pass: draft markers checked on the served surface; phone/town and 003 terms rechecked; no secrets exist; `.env.example` holds no value |

No violations. Note: `AGENTS.md` predates feature 003, where Meridian was published after
its evidence review (constitution I satisfied); User Management API is the current draft.
Feature 004's owner acceptance (T028) remains open and must close before 1.0.0 is accepted.

## Design Decisions

See [research](research.md) for rationale and alternatives.

- **Setting**: `src/lib/site.ts` validates `SITE_URL` and exports `siteOrigin` and
  `absoluteUrl`; `.env.example`, `.nvmrc` (`24.12.0`).
- **Metadata**: `src/lib/metadata.ts` `pageMetadata()` builds title, description,
  canonical, Open Graph, and Twitter fields; root layout sets `metadataBase` and defaults
  only; each public route calls the helper; `not-found.tsx` exports its own title.
- **Generated files**: `src/app/sitemap.ts`, `src/app/robots.ts`,
  `src/app/og.png/route.tsx` (static `ImageResponse`), `src/app/icon.svg`.
- **Content**: work index intro and changelog intro as shared constants so pages and
  descriptions agree; corrections from the evidence re-check only.
- **Demo**: Resume Analyzer `demo` record and "Live demo" link only if the end-to-end check
  passes.
- **Version**: `package.json` → `1.0.0` and changelog 1.0.0 entry in the acceptance
  task; the existing build assertion keeps the footer in step.
- **Verification**: `specs/005-launch-readiness/verification/` — `check-metadata.mjs`
  (also the post-deploy confirmation), `check-served-output.mjs`,
  `check-evidence-ids.mjs`, `run-browser-checks.mjs` (from 004, plus axe and contrast),
  `lighthouse/`; results in `verification.md`.
- **Owner docs**: `docs/deployment.md` (settings, versions, build/start, confirm, rollback,
  owner-only actions); `docs/releases/1.0.0.md` (release record and notes); status updates
  in `docs/roadmap.md`, `docs/content-needed.md`, `docs/toolchain.md`.

### Requirement mapping

| Requirements | Design |
| --- | --- |
| FR-001, FR-002 | Existing static routes and `dynamicParams = false`; `not-found.tsx` title; `check-metadata.mjs` statuses |
| FR-003, FR-004, FR-005 | No layout change planned; `run-browser-checks.mjs` on every page; fixes only for observed failures |
| FR-006 | axe + computed contrast on every page, both viewports |
| FR-007 | `check-evidence-ids.mjs` + dated manual re-read; corrections in content files |
| FR-008, FR-009 | Action table; links check; manual LinkedIn; Resume Analyzer flow check → optional `demo` |
| FR-010 | `check-served-output.mjs`, 003 confidentiality script, phone/town search |
| FR-011, FR-013 | `pageMetadata()` per route; `og.png` |
| FR-012, FR-017 | `src/lib/site.ts` (`SITE_URL`); release blocker until the domain is set |
| FR-014 | `og.png` route and `icon.svg` from profile text, tokens, and OFL Manrope |
| FR-015, FR-016 | `sitemap.ts` from `publishedProjects`; `robots.ts` |
| FR-018 | Fresh clone + `npm ci` + lint/typecheck/build on the tested commit |
| FR-019 | Version bump + changelog entry; existing build assertion |
| FR-020, FR-021 | `verification.md` readiness report; Lighthouse runs |
| FR-022 | `docs/deployment.md` per [deployment contract](contracts/deployment.md) |
| FR-023, FR-024 | `docs/releases/1.0.0.md`; status `prepared — blocked` until blockers close; no tag/push/deploy |

## Project Structure

### Documentation (this feature)

```text
specs/005-launch-readiness/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── site-metadata.md # head tags, sitemap, robots, og.png, icon, 404
│   └── deployment.md    # SITE_URL, runtime, build behavior, confirm, rollback
├── checklists/requirements.md
├── verification.md      # readiness report (implementation)
├── verification/        # scripts, screenshots, Lighthouse JSON (implementation)
└── tasks.md             # $speckit-tasks
```

### Source Code (repository root)

```text
.env.example                              # new: SITE_URL=
.nvmrc                                    # new: 24.12.0
src/
  app/
    layout.tsx                            # metadataBase + defaults
    page.tsx                              # pageMetadata("/")
    work/page.tsx                         # pageMetadata, shared intro
    work/[slug]/page.tsx                  # pageMetadata per project
    changelog/page.tsx                    # pageMetadata, visible intro
    not-found.tsx                         # own title
    sitemap.ts robots.ts icon.svg         # new
    og.png/route.tsx                      # new, static ImageResponse
  assets/fonts/Manrope-*.ttf, OFL.txt     # new, build-time only
  content/changelog.ts                    # 1.0.0 entry at acceptance
  content/projects.ts                     # Resume Analyzer demo only if checked
  components/work/CaseStudyArticle.tsx    # "Live demo" link only if demo set
  lib/site.ts lib/metadata.ts             # new
docs/deployment.md docs/releases/1.0.0.md # new owner docs
package.json package-lock.json            # 1.0.0 at acceptance
```

**Structure Decision**: Same single Next.js app as 001–004; new code is two `src/lib`
helpers and Next.js metadata file conventions under `src/app/`.

## Complexity Tracking

No constitution violations.
