# Implementation Plan: Professional Profile

**Branch**: `main` (actual Git branch; create `feat/004-professional-profile` before implementation) | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-professional-profile/spec.md`

## Summary

Add Experience, Skills, About, and Contact sections to the homepage, a `/changelog` page,
a site footer showing the package version, and a résumé download served from the
project's own public files. Content comes from the owner's résumé and chat confirmations,
with the clarified wording for employers, HRMS work, and dates. The package moves to
0.3.0 at acceptance, and the changelog records 0.1.0, 0.2.0, and 0.3.0, closing the
release gap deferred by feature 002. No new dependency.

## Technical Context

**Language/Version**: Strict TypeScript `6.0.3`; Node.js `24.12.0` (unchanged)

**Primary Dependencies**: Existing pins only; `package.json` read as a JSON module.

**Storage**: Typed local content in `src/content/`; résumé PDF in `public/resume/`.

**Testing**: lint, typecheck, build (including a version-mismatch build failure check);
`curl` against `next start`; Playwright browser checks reusing 003's tooling; manual
content review against the spec's owner-supplied facts.

**Target Platform**: Modern browsers; Node.js 20.9+

**Project Type**: Single Next.js App Router website

**Performance Goals**: Unchanged; the only new client code is the copy-email button.

**Constraints**: No phone number or town on pages or metadata (FR-008, FR-015, SC-006);
IITIL entry does not name or link the HRMS case study (FR-003); download only with the
corrected PDF (FR-007); footer, package, and changelog versions agree (FR-011).

**Scale/Scope**: 4 homepage sections, 1 route, 1 footer, 1 asset, 6 navigation items.

## Constitution Check

| Principle | Pre-research gate | Post-design review |
| --- | --- | --- |
| I. Evidence-based content | Pass: résumé and chat confirmations recorded in the spec; résumé/evidence conflicts resolved by clarification | Pass: each field maps to an owner-supplied fact; HRMS wording matches the case study |
| II. Distinct visual identity | Pass | Pass: reuses tokens and editorial numbering; no new motif |
| III. Accessible, immediate content | Pass | Pass: server-rendered text; copy button is an enhancement; native controls |
| IV. Simple implementation | Pass | Pass: no dependency; typed content; one small Client Component |
| V. Specification-led | Pass: 16/16 checklist, 3 clarifications | Pass: FR→design mapping below |
| VI. Honest verification | Pass | Pass: quickstart lists concrete checks |
| VII. Release discipline | Pass: target 0.3.0 | Pass: version, footer, and changelog tied together; build fails on mismatch; 0.2.0 recorded as history |
| VIII. Safe publication | Pass | Pass: phone and town only inside the owner-approved PDF; check on all pages and metadata |

No violations. This feature also closes 001's open gate on the provisional role and
headline: the résumé confirms the role.

## Design Decisions

See [research](research.md) for rationale.

- **Content**: `experience.ts`, `skills.ts`, `contact.ts`, `changelog.ts`; `profile.ts`
  gains `about` and `location`, and loses its provisional comment.
- **Components** (`src/components/profile/`): `ExperienceSection`, `SkillsSection`,
  `AboutSection`, `ContactSection` (server), `CopyEmailButton` (client),
  `ResumeLink` (server; renders only if the PDF exists, via `src/lib/resume.ts`).
- **Layout**: `src/components/layout/Footer.tsx` added to `src/app/layout.tsx`; navigation
  items extended; hero gains `ResumeLink`.
- **Route**: `src/app/changelog/page.tsx`.
- **Homepage**: `src/app/page.tsx` adds the four sections and renumbers Approach to 06.
- **Version**: `package.json` → `0.3.0` in the acceptance task, with the changelog date.

### Requirement mapping

| Requirements | Design |
| --- | --- |
| FR-001, FR-002, FR-003, FR-004, FR-005 | `experience.ts` + `ExperienceSection` |
| FR-006 | `skills.ts` + `SkillsSection` via `publishedProjects` |
| FR-007 | `public/resume/…pdf`, `src/lib/resume.ts`, `ResumeLink` |
| FR-008 | `contact.ts`, `ContactSection`, `CopyEmailButton` |
| FR-009 | `profile.about`, `AboutSection` |
| FR-010, FR-011 | `changelog.ts` with build assertion, `/changelog`, `Footer` |
| FR-012 | `navigation.ts`, `MobileNav` (unchanged logic) |
| FR-013, FR-014, FR-015 | Existing tokens; metadata review; browser checks |

## Project Structure

```text
public/resume/Akash_K_Pillai_Resume.pdf     # corrected PDF, when supplied
src/
  app/
    layout.tsx                              # adds Footer
    page.tsx                                # adds sections, renumbers Approach
    changelog/page.tsx                      # new
    globals.css                             # appended styles
  components/
    layout/Footer.tsx                       # new
    layout/Hero.tsx                         # adds ResumeLink
    profile/ExperienceSection.tsx           # new
    profile/SkillsSection.tsx               # new
    profile/AboutSection.tsx                # new
    profile/ContactSection.tsx              # new
    profile/CopyEmailButton.tsx             # new, "use client"
    profile/ResumeLink.tsx                  # new
  content/
    profile.ts experience.ts skills.ts contact.ts changelog.ts navigation.ts
  lib/resume.ts                             # new, server-only file check
package.json                                # version 0.3.0 at acceptance
```

## Complexity Tracking

No constitution violations.
