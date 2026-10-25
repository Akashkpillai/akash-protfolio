# Data Model: Professional Profile

Typed local content in `src/content/`. Every value traces to the spec's
"Owner-supplied facts" and clarifications.

## Role (`src/content/experience.ts`)

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | From the résumé |
| `organization` | string | "IITIL (Innovative Information Technologies India Limited)" or "InFineIT Global Services LLP" (FR-003) |
| `location` | string | "Remote" or "Surat, Gujarat, India" |
| `start` | `{ year; month }` | IITIL 2026-07; InFineIT 2023-03 |
| `end` | `{ year; month } \| "present"` | IITIL `"present"`; InFineIT 2026-07 (FR-005) |
| `highlights` | string[] | Condensed from résumé bullets; IITIL uses the case-study wording (FR-004) and does not name or link the HRMS case study (FR-003); no new metrics |
| `projects` | `{ name; period; summary; stack[] }[]` | InFineIT only: FineOne, FineStar from the résumé |

Order: newest first.

## SkillGroup (`src/content/skills.ts`)

| Field | Type | Rules |
| --- | --- | --- |
| `name` | string | One of the résumé's six group names, in résumé order |
| `skills` | `{ name; caseStudy?: ProjectSlug }[]` | Résumé order; `caseStudy` only where that case study's evidence shows the skill; rendered as a link only if the project is published |

## ContactLink (`src/content/contact.ts`)

| Field | Type | Rules |
| --- | --- | --- |
| `kind` | `"email" \| "linkedin" \| "github"` | No phone, address, or form (FR-008) |
| `label` | string | Visible text |
| `href` | string | `mailto:akashkpillai55@gmail.com`, `https://www.linkedin.com/in/akash-k-pillai/`, `https://github.com/Akashkpillai` |

## Profile additions (`src/content/profile.ts`)

- `role` confirmed as "Backend & AI Developer" (résumé: "Backend Developer | AI
  Developer"); the provisional comment is removed.
- `about`: short paragraphs from résumé facts only — B.Sc. Physics (NSS College, Kerala
  University, 2018–2021), backend development since March 2023, current focus on backend
  and AI work, languages spoken. No motives or anecdotes (FR-009).
- `location`: "Kerala, India" (no town).

## Release (`src/content/changelog.ts`)

| Field | Type | Rules |
| --- | --- | --- |
| `version` | string | Semantic version |
| `date` | string (ISO date) | From commit history or acceptance |
| `summary` | string | One sentence |
| `changes` | string[] | Short bullets from the feature specs |
| `features` | string[] | e.g. `"002"`, `"003"` |

Newest entry's `version` MUST equal `package.json` `version`; a mismatch throws at build.

## Résumé asset

- Path: `public/resume/Akash_K_Pillai_Resume.pdf` (served at `/resume/Akash_K_Pillai_Resume.pdf`).
- Provenance and approval date recorded in `specs/004-professional-profile/verification.md`.
- The download action renders only if the file exists at build time.
