# Akash Portfolio — Codex + Spec Kit Build Guide

Planning edition 1.0 · 25 October 2026

This is a build plan and prompt pack. No website has been implemented or deployed. Repository assessment is based on public metadata, README files, file trees, and selected implementation files; the applications were not run or comprehensively audited.

## 1. Product direction

Build a distinctive portfolio for Akash K Pillai, a backend developer building AI applications. Primary audiences: recruiters assessing fit and engineers evaluating implementation depth. Visitors should immediately understand the role, see credible projects, and reach the résumé or contact options.

Working concept: **The Engineering Journal**. Present the portfolio like a beautifully typeset collection of engineering work, with small interactive explanations of how systems operate.

Suggested headline: **Backend systems. Practical AI. Thoughtfully built.**

Supporting identity: **Akash K Pillai — Backend & AI Developer — Alappuzha, Kerala, India.** Verify final professional copy and employment dates against the current résumé before publishing. Do not infer professional Python experience from learning goals.

## 2. Project selections and evidence

The public GitHub API returned 30 repositories for Akashkpillai during this review. Eight promising repositories received a closer file-tree review. Selection favors relevance, identifiable engineering decisions, and complementary stories rather than repository count or stars.

### Feature first: Resume Analyzer

- Repository: https://github.com/Akashkpillai/resume-analyzer
- Portfolio title: **Resume Analyzer — AI Document Processing**
- Evidence: `backend/src/resume/resume-parser.service.ts`, `backend/src/resume/resume.service.ts`, frontend page structure, Prisma schema, auth module.
- Supported stack: NestJS, React, TypeScript, PostgreSQL, Prisma, Groq, PDF extraction.
- Story: PDF upload and extraction, text cleanup, structured AI parsing, fallback parsing, and user-scoped persistence/retrieval.
- Useful engineering detail: the parser strips null characters before persistence. The service scopes list/detail lookups to a user. These are implementation observations, not a complete security assessment.
- The README says TypeORM, but the current resume service uses Prisma. The parser calls Groq using `openai/gpt-oss-20b`; avoid reproducing the README's older model description. Keep model names out of the headline.
- Be candid about current limits: the AI prompt takes the first 4,000 characters of resume text; fallback extraction is basic. Do not claim exhaustive parsing or validated hiring accuracy.
- Repository homepage advertises https://resume-analyzer-rosy.vercel.app — a listed deployment URL, not a verified working end-to-end demo. Verify before displaying a Live Demo action.
- Suggested visual: a sanitized screenshot, plus a PDF → extraction → parsing → structured record diagram. Use fictional sample resumes for demonstrations.

### Feature second: Notification Platform

- Repository: https://github.com/Akashkpillai/notificationservice (default branch `master`). This is distinct from `notification_service`.
- Portfolio title: **Notification Platform — Event-Driven Backend**
- Evidence: `apps/notification-services/src/notification-router.service.ts`, email and SMS service implementations, shared Kafka topics/contracts, Prisma schema.
- Supported stack: NestJS, Kafka, PostgreSQL, Prisma; email and Twilio SMS integration code.
- Story: routing notification requests to channel workers, persisting delivery state, and handling delivery failures.
- Email/SMS worker code contains sent-status checks, retry-event publishing, and a dead-letter threshold. Describe these as implemented code paths until the complete workflow has been exercised.
- The push service currently returns `Hello World!`. Push delivery is unfinished. Do not advertise working FCM/APNs integration, proven exactly-once delivery, or production reliability.
- Suggested visual: a clickable architecture diagram with the gateway, broker, router, workers, and database. Failure/retry labels must distinguish implemented paths from future work.

### Feature third: User Management API

- Repository: https://github.com/Akashkpillai/user-management-with-prisma (default branch `master`).
- Portfolio title: **User Management API — Roles & Relational Data**
- Evidence: authentication/authorization guards, role decorator, user/country/state/city modules, Prisma schema, generated Compodoc documentation.
- Supported stack: NestJS, TypeScript, Prisma, PostgreSQL.
- Story: user management, role-based authorization, relational modeling, and API documentation.
- The README is mostly Nest starter material. Replace it with project-specific setup, example requests, role behavior, schema explanation, and limitations before promoting it heavily.
- Suggested visual: a compact entity relationship diagram or an API request/response excerpt using fictional data.
- Avoid unverified security or scalability guarantees.

### Optional supporting work

- **Elbow-Grease:** https://github.com/Akashkpillai/Elbow-Grease — an earlier MERN home-services marketplace. The README describes bookings, user/admin/expert flows, JWT/email verification, and Stripe payments. It explicitly says the application is still in development. Use as an earlier-work case study after checking the actual flows and cleaning documentation.
- **mayaNetz:** https://github.com/Akashkpillai/mayaNetz — a Next.js cybersecurity marketing frontend. Its README states backend APIs are unbuilt and the contact action is simulated. Suitable for a secondary UI example, with those limits explicit.
- **Microservice-with-Redis-in-NestJS:** relevant architecture learning work, but its README setup is incomplete and the public tree includes a tracked environment file. Review implementation completeness before making it a featured case study.
- **microservice:** public structure includes auth and reservation services. Keep as supporting learning work until its scope and documentation are stronger.
- Keep clones, starter login/todo apps, DSA exercises, and the old Personal-Website out of the main featured selection.

### Meridian and HRMS assistant

Neither appeared as an identifiable public repository in the returned list. Prior discussion establishes that you worked on these projects, but their current source was not reviewed here. Meridian is a strong potential AI flagship once you supply the repository or approved screenshots, architecture notes, and demo. Do not fabricate a GitHub URL. Keep a draft content entry excluded from public routes until evidence is available. Company HRMS work can be described in experience or a sanitized case study using material you may share.

### Concrete repository cleanup

The public file trees include `server/.env` in Elbow-Grease and `server/match-service/.env` in Microservice-with-Redis-in-NestJS. Their values were not opened. Check these files privately; if any real credentials are present, revoke/rotate them and remove them from tracked content/history as appropriate. Deleting a file alone does not revoke exposed credentials. Do this before prominently linking those older projects.

## 3. Design brief

The design must have a different composition and visual identity from delin.dev.

| Element | Direction |
| --- | --- |
| Background | Warm ivory `#F5F2EB`, with quiet off-white sections |
| Primary text | Ink `#17212B` |
| Accent | Copper `#B44E30`, with restrained teal `#176B62` for diagrams |
| Typography | Large expressive sans-serif headings; comfortable body sans; monospace only for technical labels/code |
| Composition | Asymmetric hero, generous whitespace, numbered project stories, wide previews |
| Navigation | Simple text navigation: Work, Experience, About, Contact; visible résumé action |
| Signature interaction | Select a node in an architecture diagram to read its responsibility; optional explicit “Trace the flow” control |
| Motion | Short transitions and subtle reveals, honoring reduced motion; essential content visible immediately |
| Mobile | Vertical document flow, stacked diagrams, large touch targets, no horizontal scrolling |

Do not copy delin.dev's terminal desktop, purple palette, robot mascot, overlapping editor windows, file explorer, custom cursor, or boot sequence. Avoid a generic grid of identical cards. Give each featured project a deliberate composition and a distinctive visual based on its actual system.

Hero: left side contains identity, headline, short positioning, and View Work / Résumé actions. Right side contains a lightweight, explanatory system diagram. Label demonstration animation as an illustrative flow; it is not live telemetry.

Main flow: hero → selected work → engineering approach → experience → short personal story → contact → version/changelog footer.

One project preview can be a screenshot, another an architecture diagram, and another a data-model illustration. Missing screenshots should produce honest diagrams, not invented product screens represented as real.

## 4. Scope and architecture

V1 contains a homepage, a work index, three case studies, experience/about/contact content, résumé download when supplied, and a changelog. A project case study contains: problem, personal contribution, implementation, architecture, decisions, tradeoffs, current limitations, and source/demo links.

Suggested routes:

- `/`
- `/work`
- `/work/resume-analyzer`
- `/work/notification-platform`
- `/work/user-management-api`
- `/changelog`
- A proper 404 page.

Use one Next.js App Router application, TypeScript strict mode, Tailwind CSS with semantic CSS tokens, local typed content, and locally authored Markdown/MDX for long case studies. Prefer CSS transitions; add a small animation library only if needed. Use SVG/HTML for exact diagrams. Keep rendering on the server where suitable and client components small and purposeful. No database is needed for V1. Use an email link and copy-email control for contact, with a failure fallback.

Suggested source organization:

| Path | Purpose |
| --- | --- |
| `src/app/` | Routes, layouts, metadata, sitemap, robots, 404 |
| `src/components/layout/` | Header, navigation, footer |
| `src/components/work/` | Project sections and case-study components |
| `src/components/diagrams/` | Accessible SVG/HTML architecture illustrations |
| `src/content/profile.ts` | Verified identity and contact fields |
| `src/content/projects.ts` | Project metadata and publication status |
| `src/content/case-studies/` | Case-study documents |
| `src/content/releases.ts` | Changelog data; current version from package metadata |
| `docs/` | Brief, design decisions, sources, roadmap, toolchain versions |
| `specs/` | Spec Kit feature artifacts |
| `public/projects/` | Approved, optimized screenshots |
| `public/resume/` | User-supplied current PDF |

Project metadata should distinguish `draft` and `published`, verified repository URLs, optional checked demo URLs, evidence links, date checked, and limitations. Keep evidence notes out of marketing UI unless helpful to a visitor. Drafts must be excluded from indexes, generated routes, metadata, and the sitemap. The site must render its public content without a runtime GitHub API dependency.

Use browser testing for meaningful flows, schema checks for content, a production build, lint/type checks, and accessibility review. Target WCAG 2.2 AA; automated checks alone do not prove conformance. Record real performance measurements rather than promised scores.

## 5. Releases and specifications

| Feature | Release | Deliverable |
| --- | --- | --- |
| 001 — portfolio foundation | `0.1.0` | Design tokens, responsive navigation, hero, illustrative flow, reusable layout |
| 002 — engineering case studies | `0.2.0` | Three evidence-based projects, work index, direct case-study routes |
| 003 — professional profile | `0.3.0` | Experience/about, contact, supplied résumé, changelog |
| 004 — launch readiness | `1.0.0` | Correct content, metadata, responsive and accessibility review, tested release build |
| Later | `1.1.0+` | Meridian case study after verification, optional writing section, richer diagrams |

Treat patch as corrections, minor as added functionality, and major as a substantial redesign or material navigation change. This is the portfolio's documented release convention. Spec Kit's own version is independent.

Use one repository, a stable `main`, and one feature branch per change. Create local annotated tags only for accepted releases; publish them with release notes when ready. Record the tested commit so a release can be reproduced. A tag does not preserve a hosted website automatically; retain a known-good deployment for rollback. Browsable historical designs can be added later as archived deployments with an explicit old-version banner.

Keep living feature specifications. Change intended behavior in the spec first, align plan/tasks, and commit code and documentation together. Git retains historical intent. Small typo fixes do not need a large specification ceremony.

Spec Kit currently records the active feature in `.specify/feature.json`; switching Git branches alone does not necessarily switch the active spec. Ask Codex to confirm both the working branch and active feature before each phase.

## 6. Local setup

Assumption: you are using Codex locally in your project folder on Windows. Install Git, a Node.js LTS version supported by your selected Next.js release, Python/uv, and Codex CLI first if absent. Use the official installation guides in the source list. The setup below uses PowerShell scripts; for WSL/Linux use `--script sh` instead.

Spec Kit release `1.2.3` was returned by GitHub Releases and PyPI during this review. Pinning it keeps this guide reproducible; record toolchain versions, and review changes before upgrading.

Run in your terminal:

```powershell
uv tool install specify-cli==1.2.3
specify version
specify init akash-portfolio --integration codex --script ps
cd akash-portfolio
specify integration status
codex
```

Place this guide in the new repository as `docs/portfolio-build-guide.md` before the first prompt. If Codex was already open when skills were installed, restart the session so it discovers the project skills.

For an existing project, inspect it first and use the documented existing-project initialization workflow instead of overwriting its configuration. Do not run `create-next-app` blindly over Spec Kit files; have Codex scaffold into the prepared repository during implementation while preserving existing files.

The following `$speckit-...` invocations are **Codex chat prompts**, not PowerShell commands. Current Codex integration installs them under `.agents/skills/`. If discovery fails, check the integration status and installed skill files; do not invent alternate command spellings.

## 7. Prompt 0 — Prepare the project context

Paste into Codex chat:

```text
Read docs/portfolio-build-guide.md. We are building Akash K Pillai's portfolio using the installed Spec Kit workflow.

Inspect this repository and the installed Spec Kit integration first. Preserve existing work. Create or update these planning documents from the guide: docs/product-brief.md, docs/design-direction.md, docs/project-evidence.md, docs/roadmap.md, and docs/content-needed.md. Record installed toolchain versions in docs/toolchain.md.

Add a concise AGENTS.md pointing to these documents, the constitution, and the active feature specification. Include only project-specific operating rules. Explain how to determine the active feature and verify it against the working branch.

Use Resume Analyzer, notificationservice, and user-management-with-prisma as the initial public projects. Keep Meridian as an unpublished candidate until source material is supplied. Record unknown contact details, exact employment dates, the current résumé PDF, and project screenshots as missing inputs. Do not invent them or put placeholder personal data on public pages.

This step is planning only. Do not create application components yet. Return the decisions, material gaps, and the next Spec Kit skill to invoke.
```

## 8. Prompt 1 — Constitution

```text
$speckit-constitution

Create the constitution for this portfolio from docs/product-brief.md and docs/design-direction.md.

Principles:
1. Published claims must be supported by reviewed source or user-confirmed evidence. No fabricated results, customers, testimonials, security guarantees, or demo links.
2. The design follows The Engineering Journal: warm ivory, ink, copper, expressive typography, generous space, and purposeful architecture diagrams. Honor the explicit differentiation requirements in the design brief.
3. Critical content and navigation are immediately available. Keyboard access, visible focus, readable contrast, mobile usability, and reduced-motion support are requirements.
4. Maintain a single simple application with typed local content and small interactive components. New dependencies need a concrete purpose.
5. Implement one specified feature at a time. Maintain agreement between spec, plan, tasks, and accepted behavior. Preserve historical decisions in Git.
6. Validate meaningful user flows and content integrity; report commands run and actual results. Never label unrun checks as passed.
7. Keep credentials and private material out of the repository and public output. Publication uses reviewed content and assets.
8. Track release version, changelog, and tested commit consistently. Public deployment is a separate release step.

Express principles as practical, reviewable rules. Keep the document concise.
```

## 9. Prompt 2 — Specify feature 001

```text
$speckit-specify

Create feature 001: portfolio foundation, targeting v0.1.0. Follow docs/product-brief.md and docs/design-direction.md.

A recruiter visiting the homepage can understand Akash's backend and AI focus immediately, navigate to selected work, experience, about, and contact content, and identify the résumé action when a real PDF is available.

Create a responsive visual foundation for The Engineering Journal: warm ivory background, ink typography, copper accents, asymmetric hero, generous spacing, and a small explanatory system-flow visual. The visual can be stepped through with an explicit control and has an equivalent static description. It is an illustrative diagram, not live monitoring.

Specify desktop and mobile behavior, focus and keyboard behavior, reduced motion, and missing-content behavior. No intro blocks access to the page. No broken navigation links or fake downloads. Content sections not delivered yet must not create dead navigation targets.

Keep project case-study content for feature 002, and detailed experience/contact/résumé integration for feature 003. Define testable acceptance criteria and the scope boundary. This step defines behavior, not implementation.
```

Then run these steps **one at a time**, reviewing their output:

```text
$speckit-clarify
Resolve material ambiguities for the active feature. Use the guide's defaults for routine choices. Focus on responsive navigation, diagram controls, reduced motion, and unavailable content.
```

```text
$speckit-plan
Plan the active feature using Next.js App Router, TypeScript strict mode, Tailwind CSS with semantic tokens, typed local content, and local Markdown/MDX for future case studies. Keep public content server-rendered where suitable, with small client components for interaction. Use SVG/HTML for exact diagrams. Prefer CSS motion before adding a library. Use npm and commit its lockfile. Preserve Spec Kit files when scaffolding.

Read the design and source documents. Select compatible stable package versions at implementation time, record them, and define component boundaries, data contracts, routes, meaningful checks, and fallbacks. No database, authentication, CMS, contact email service, or portfolio LLM is needed for V1. Reuse existing infrastructure in later feature plans.
```

```text
$speckit-checklist
Create a concise requirements-quality checklist for the active feature, including clear states, responsive behavior, accessibility, content provenance, and acceptance criteria. These are requirement reviews, not claims that software tests passed.
```

Review that checklist. Ask Codex to help evaluate it and cite the requirement supporting each item; resolve open requirements before implementation. Do not mark an item complete solely to bypass a gate.

```text
$speckit-tasks
Generate dependency-ordered tasks for the active feature, including meaningful verification derived from its acceptance criteria. Each task should produce a reviewable result. Include real screenshot inspection when browser tooling is available and explicitly record any check that cannot run.
```

```text
$speckit-analyze
Check spec, plan, and tasks for conflicts or missing requirements. Report findings before implementation. For intended-behavior changes, revise the spec first, then align downstream artifacts.
```

When the artifacts agree:

```text
$speckit-implement
Implement the active feature according to its accepted artifacts. Preserve unrelated changes. Run applicable checks and inspect the result at desktop and mobile widths. Resolve failures within scope. Report files changed, actual verification results, and remaining limitations. Do not publish the website or push a release as part of this step.
```

```text
$speckit-converge
Compare the implementation with the active feature's spec, plan, and tasks. Record remaining work and distinguish missing implementation from missing verification. Do not weaken requirements merely to match the code.
```

If convergence finds gaps, implement the remaining tasks and check again. A convergence report complements actual browser and code checks; it does not replace them.

## 10. Feature 002 — Case studies

After feature 001 is complete, use this specification prompt and repeat the clarify → plan → checklist → tasks → analyze → implement → converge sequence above for the new active feature.

```text
$speckit-specify
Create feature 002: engineering case studies, targeting v0.2.0. Reuse the completed foundation.

Visitors can browse three curated projects and open each case study directly: Resume Analyzer, Notification Platform (repository notificationservice), and User Management API. Follow docs/project-evidence.md and the build guide. Review relevant source before writing detailed claims; when code and README disagree, document the difference and describe the implementation accurately.

Homepage selected work uses large numbered project stories and varied evidence-based previews. /work lists the published projects. /work/[slug] contains the problem, my contribution, architecture, decisions, tradeoffs, limitations, stack, and source links. Include an accessible architecture explanation where it adds value.

Resume Analyzer uses Prisma and Groq; describe basic parsing fallback and text-length limitations honestly. Notification email/SMS integration code exists; push remains unfinished. User Management has role guards and relational modules; don't claim independently verified security.

Treat a repository's homepage URL as unverified until checked. Omit unavailable demo buttons. Use genuine sanitized screenshots or clearly labeled explanatory diagrams. Keep Meridian and other unverified projects as drafts excluded from pages, generated routes, and sitemap. Unknown slugs return 404. All primary project content remains readable with JavaScript disabled.

Define acceptance criteria for direct navigation, mobile layout, accessible diagrams, draft exclusion, missing images, missing links, and evidence-backed copy.
```

## 11. Feature 003 — Profile and contact

```text
$speckit-specify
Create feature 003: professional profile and contact, targeting v0.3.0.

Add experience, about, grouped skills, contact options, résumé download, and /changelog. Use the supplied current résumé and verified user details for employers, dates, contact links, and education. Ask for missing authoritative input when it is necessary; do not invent it. Show Alappuzha, Kerala, India as the location. Keep learning topics distinct from demonstrated professional experience.

The about section explains the physics-to-software journey in plain language. Skills connect to relevant project evidence. Contact offers a verified email link and a copy action with a fallback when clipboard access fails. Use a functional PDF download only after the real résumé is available; omit that action while the asset is missing.

Read the displayed current version from package metadata. Changelog entries describe actual completed releases, with dates and source links when available. No fake release history or published status. Homepage anchors work from both the homepage and case-study pages.

Define acceptance criteria for missing optional content, contact actions, résumé asset handling, mobile layout, and correct release metadata.
```

Repeat the same per-feature workflow.

## 12. Feature 004 — Launch readiness

```text
$speckit-specify
Create feature 004: launch readiness, targeting v1.0.0.

Prepare the completed portfolio for a reliable public release. Require a working production build, type/lint checks, direct route access, useful 404, responsive layouts at 390/768/1440 pixels, keyboard navigation, visible focus, reduced motion, and no unintended horizontal scrolling. Check public copy against its evidence and confirm every visible résumé/contact/source/demo action.

Add accurate page titles, descriptions, sharing metadata, canonical URLs, sitemap, and robots rules based on the actual deployment domain. Exclude drafts. Use real owned assets. Keep essential text visible if optional JavaScript or animation fails. Record accessibility and performance measurements with environment and limitations; don't fabricate scores or claim full conformance from automation alone.

Ensure a fresh install from the lockfile can build. Document deployment variables, Node/package-manager versions, the tested commit, release notes, and rollback procedure. Resolve missing release-critical personal information/assets before publication. Prepare release v1.0.0; publishing remains an explicit subsequent user action.
```

Repeat the workflow. Have Codex inspect screenshots and fix actual problems rather than repeatedly polishing without evidence.

## 13. Useful follow-up prompts

### Visual review

```text
Review the current UI against docs/design-direction.md at mobile and desktop widths. Identify concrete problems in composition, readability, hierarchy, interaction, and spacing. Check that it is visually distinct from delin.dev. Keep the agreed visual language. Fix the highest-impact issues, capture updated views when possible, and report the visible changes. Do not claim a visual review if screenshot/browser tooling is unavailable.
```

### Content review

```text
Audit every published project claim against docs/project-evidence.md and the relevant reviewed source. Flag invented metrics, overstated completion, unsupported technologies, stale links, and draft leakage. Correct the public copy and update evidence notes. Never expose private source or secrets. Do not change the project repositories as part of this portfolio content task.
```

### Resume work in a fresh Codex session

```text
Read AGENTS.md, the constitution, docs/roadmap.md, and the active feature artifacts. Inspect Git status and Spec Kit's active feature state. Summarize what is implemented, what has actually been verified, and the next unfinished task. Continue that task without overwriting unrelated work or restarting completed features.
```

### Release preparation

```text
Prepare the accepted release from the tested commit. Align package version, changelog, and displayed version. Report the exact checks that passed and unresolved release blockers. Prepare a concise GitHub release description and deployment/rollback instructions. Ask for the target version if it is not established. Do not mark the release published until it actually is.
```

## 14. What to supply before launch

Provide the current résumé PDF, confirmed email and LinkedIn URL, exact work dates, and approved project screenshots or demo recordings. Meridian needs its own source material before it becomes a flagship. Content gaps can be recorded while implementation proceeds; required personal claims must be resolved before publication.

## 15. Sources

Repository list: https://api.github.com/users/Akashkpillai/repos?per_page=100&sort=updated

The project links and evidence paths above identify the public sources reviewed. They are snapshots of mutable default branches as of 25 October 2026. Recheck before publishing future claims.

- Spec Kit quickstart: https://github.github.com/spec-kit/quickstart.html
- Codex integration and skill invocation: https://github.github.com/spec-kit/integrations/codex.html
- Full SDD workflow: https://github.github.com/spec-kit/reference/agentic-sdd.html
- Maintaining specifications: https://github.github.com/spec-kit/guides/evolving-specs.html
- Spec Kit release: https://github.com/github/spec-kit/releases/tag/v1.2.3
- Pinned Python package: https://pypi.org/project/specify-cli/1.2.3/
- uv setup: https://docs.astral.sh/uv/getting-started/installation/
- Codex setup: https://developers.openai.com/codex/cli/
- Next.js rendering: https://nextjs.org/docs/app/getting-started/server-and-client-components

Use this guide as the project's proposal. Spec Kit-generated artifacts become the detailed working contract as each feature is clarified and planned.
