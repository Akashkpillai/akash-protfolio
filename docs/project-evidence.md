# Project evidence register

First recorded 2026-10-25 from [portfolio-build-guide.md](portfolio-build-guide.md) (planning edition 1.0). **Source review 2026-10-25:** the three selected repositories were reviewed read-only by Claude (feature 002) at the commits recorded below. Each was shallow-cloned into an empty scratchpad directory, read without being installed or executed, and deleted after review. Nothing was run, so every behavioral claim below describes reviewed source, not exercised runtime behavior. No credentials were opened, no demo was checked, and no security audit was performed.

**Owner review of this register: pending** (v0.2.0 acceptance gate, FR-002). Personal contribution: the owner confirmed on 2026-10-25 that all three selected projects are solely their own work.

Claim IDs (`RA-`, `NP-`, `UM-`) are cited by the case-study content in `src/content/case-studies/`. Limitation IDs end in `L#`. A decision reason may appear publicly only when listed in that project's **Owner-confirmed rationale** table, which is filled only from the owner's own words.

## 01 — Resume Analyzer — AI Document Processing

- Source: [Akashkpillai/resume-analyzer](https://github.com/Akashkpillai/resume-analyzer), branch `main`
- Reviewed commit: `e0d61a854566aff4f3256e5b68d3957f06dc49bd` (committed 2026-09-30); reviewer Claude; review date 2026-10-25
- Files read: `backend/src/resume/resume-parser.service.ts`, `backend/src/resume/resume.service.ts`, `backend/src/resume/resume.controller.ts`, `backend/prisma/schema.prisma`, `backend/src/auth/auth.service.ts`, `backend/src/auth/auth.module.ts`, `backend/src/app.module.ts`, `backend/package.json`, `frontend/package.json`, `frontend/src/pages/Dashboard.tsx`, `README.md`
- Supported stack: NestJS, TypeScript, PostgreSQL, Prisma, Groq API, pdf-parse, React, Vite

| ID | Statement | Evidence |
| --- | --- | --- |
| RA-01 | Upload accepts PDF files only, up to 20 per request and 10 MB each, rate-limited to 20 uploads per minute | `resume.controller.ts` |
| RA-02 | Text is extracted with pdf-parse; null characters and trailing whitespace are stripped before storage | `resume-parser.service.ts` (`sanitizeText`) |
| RA-03 | Extracted text is sent to a Groq chat completion that is asked to return JSON with name, contact details, skills, experience, education, projects, and links | `resume-parser.service.ts` (`parseResumeWithAI`) |
| RA-04 | If the API key is missing, the AI call fails, or its JSON cannot be parsed, a basic regex parser runs instead and returns email, phone, links, and skills from a fixed keyword list | `resume-parser.service.ts` (`basicParse`) |
| RA-05 | Extracted links are normalized to include a protocol and classified by site type | `resume-parser.service.ts` |
| RA-06 | Each résumé is stored through Prisma in PostgreSQL with its raw text and parsed result (JSONB), linked to a user with cascade delete | `schema.prisma`, `resume.service.ts` |
| RA-07 | List, detail, delete, and statistics queries are scoped to the signed-in user's ID | `resume.service.ts` |
| RA-08 | Résumés can be searched by raw text (case-insensitive) and filtered by skill, with pagination | `resume.service.ts` (`findAll`) |
| RA-09 | A statistics endpoint counts skill frequency across a user's résumés | `resume.service.ts` (`getStats`) |
| RA-10 | Sign-in uses bcrypt-hashed passwords and JWTs valid for seven days; a global rate limit applies | `auth.service.ts`, `auth.module.ts`, `app.module.ts` |
| RA-11 | A React and Vite dashboard handles upload, search, skill filtering, and client-side matching of required and optional skills | `frontend/src/pages/Dashboard.tsx`, `frontend/package.json` |
| RA-12 | Endpoints are documented with Swagger decorators | `resume.controller.ts` |
| RA-D1 | Design choice: parsing (`ResumeParserService`) is separate from persistence and querying (`ResumeService`) | both services |
| RA-D2 | Design choice: AI parsing failure falls back to basic parsing instead of failing the upload | `resume-parser.service.ts` |
| RA-D3 | Design choice: both raw text and structured JSON are stored; text search uses raw text, skill filtering uses the JSON | `schema.prisma`, `resume.service.ts` |
| RA-D4 | Design choice: skill filtering runs in application memory after loading the user's résumés; a code comment states this is because Prisma's JSONB filtering is limited for case-insensitive array searches | `resume.service.ts` comment |

Limitations:

| ID | Limitation |
| --- | --- |
| RA-L1 | Only the first 4,000 characters of extracted text are sent to the AI parser |
| RA-L2 | Fallback parsing is basic: it finds email, phone, links, and a fixed list of skills, and returns no experience, education, or projects |
| RA-L3 | Skill filtering loads all of a user's résumés into memory before paginating |
| RA-L4 | Uploaded files are written to a local `uploads/` directory on the server |
| RA-L5 | No automated tests are present in the reviewed commit |
| RA-L6 | Parsing accuracy has not been evaluated; no accuracy or hiring-outcome claim is made |

- Discrepancies: README says TypeORM, code uses Prisma. README names GPT-3.5-turbo, code calls `openai/gpt-oss-20b` through Groq. Copy follows the code and keeps model names out of headlines.
- Demo: [repository-listed deployment](https://resume-analyzer-rosy.vercel.app) **not checked**. No demo action.
- Assets: none in v0.2.0; preview is a labeled explanatory pipeline diagram.

Owner-confirmed rationale:

| ID | Explains | Reason (owner's words) | Confirmed |
| --- | --- | --- | --- |
| — | — | None confirmed yet | — |

## 02 — Notification Platform — Event-Driven Backend

- Source: [Akashkpillai/notificationservice](https://github.com/Akashkpillai/notificationservice), branch `master`. Distinct from `notification_service`; never substitute it.
- Reviewed commit: `f202b4837fb2ff4fd96dcdcde3497e7a44c2f01a` (committed 2026-07-01); reviewer Claude; review date 2026-10-25
- Files read: `apps/api-gateway/src/modules/notifications/notification.controller.ts`, `notification.service.ts`, `apps/notification-services/src/notification-router.controller.ts`, `notification-router.service.ts`, `apps/email-services/src/email-services.controller.ts`, `email-services.service.ts`, `apps/sms-services/src/sms-services.service.ts`, `apps/push-services/src/push-services.controller.ts`, `push-services.service.ts`, `libs/common/src/kafka/kafka-topic.ts`, `libs/common/src/enums/*.ts`, `libs/common/src/dto/*.ts`, `prisma/schema.prisma`, `docker-compose.yml`, `README.md`, `PLAN.md`
- Supported stack: NestJS (monorepo with separate apps), Apache Kafka, PostgreSQL, Prisma, Nodemailer (SMTP), Twilio

| ID | Statement | Evidence |
| --- | --- | --- |
| NP-01 | The API gateway exposes `POST /notifications` behind a JWT guard and rate limiter, adds an event ID, timestamp, and retry count of 0, publishes to `notification.requested`, and responds without waiting for delivery | `api-gateway/.../notification.controller.ts`, `notification.service.ts` |
| NP-02 | The router service consumes `notification.requested`, stores a `Notification` record with status `pending`, and publishes to `notification.email`, `notification.sms`, or `notification.push` by type | `notification-router.controller.ts`, `notification-router.service.ts` |
| NP-03 | The email worker sends through SMTP with Nodemailer, skips a notification already marked `sent`, marks a missing recipient `dead`, and records `sent` with a timestamp on success | `email-services.service.ts` |
| NP-04 | The SMS worker sends through Twilio with the same skip, recipient-check, and success-recording steps | `sms-services.service.ts` |
| NP-05 | On a send failure, workers increment the retry count; under three attempts they mark the record `failed` and publish to `notification.retry`; at three they mark it `dead` and publish to `notification.dlq` | `email-services.service.ts`, `sms-services.service.ts` |
| NP-06 | DTOs, enums, topic names, and the Prisma service live in a shared `@app/common` library used by every service | `libs/common/src/` |
| NP-07 | The schema defines `Notification` (status `pending`/`sent`/`failed`/`dead`, retries, error message, sent time, JSON payload), `UserPreference`, and `NotificationTemplate` | `prisma/schema.prisma` |
| NP-D1 | Design choice: request intake, routing, and each delivery channel are separate NestJS applications connected only by Kafka topics | `apps/`, `kafka-topic.ts` |
| NP-D2 | Design choice: the gateway publishes and returns immediately; delivery happens asynchronously in workers | `notification.service.ts` |
| NP-D3 | Design choice: failure handling lives inside each channel worker, with a fixed limit of three attempts | `email-services.service.ts`, `sms-services.service.ts` |

Limitations:

| ID | Limitation |
| --- | --- |
| NP-L1 | Push delivery is unfinished: the push app is a placeholder HTTP controller returning `Hello World!` and nothing consumes `notification.push` |
| NP-L2 | Retry and dead-letter are implemented code paths that publish events, but no consumer for `notification.retry` or `notification.dlq` exists in the reviewed commit, so failed notifications are not re-delivered |
| NP-L3 | The router stores records under a database-generated ID while workers look up and update by the gateway's event ID; the duplicate check and status updates have not been exercised and need this aligned |
| NP-L4 | `UserPreference` and `NotificationTemplate` exist only in the schema; no reviewed code reads them |
| NP-L5 | No flow was run end to end; no exactly-once, production-reliability, or FCM/APNs claim is made |

- Discrepancies: README calls the system "production-grade" and lists push delivery and topics named `notifications.*`; code uses `notification.*` and push is unfinished. `PLAN.md` lists push, the retry consumer, and preferences as open items. Copy follows the code.
- Demo: none supplied; no demo action.
- Assets: none in v0.2.0; preview is a labeled explanatory architecture diagram.

Owner-confirmed rationale:

| ID | Explains | Reason (owner's words) | Confirmed |
| --- | --- | --- | --- |
| — | — | None confirmed yet | — |

## 03 — User Management API — Roles & Relational Data

- Source: [Akashkpillai/user-management-with-prisma](https://github.com/Akashkpillai/user-management-with-prisma), branch `master`
- Reviewed commit: `97603df57820c47d0dc0256aa031ef26aadddc7b` (committed 2025-02-12); reviewer Claude; review date 2026-10-25
- Files read: `prisma/schema.prisma`, `src/decorators/role.decorator.ts`, `src/guard/authentication.guard.ts`, `src/guard/authorization.guard.ts`, `src/interceptor/usersensitive.interceptor.ts`, `src/user/user.controller.ts`, `src/user/user.service.ts`, `src/user/dto/update-user.dto.ts`, `src/user/dto/create-user.dto.ts`, `src/state/state.controller.ts`, `src/country/country.controller.ts`, `src/city/city.controller.ts`, `src/app.module.ts`, `src/main.ts`, `package.json`, `test/app.e2e-spec.ts`, `README.md`, `documentation/` (listing)
- Supported stack: NestJS, TypeScript, Prisma, PostgreSQL, JWT, bcrypt, Swagger, Compodoc

| ID | Statement | Evidence |
| --- | --- | --- |
| UM-01 | Roles are an `ADMIN`/`USER` enum; a `Roles` decorator attaches allowed roles to routes and an authorization guard compares them with the role in the token | `role.decorator.ts`, `authorization.guard.ts`, `schema.prisma` |
| UM-02 | An authentication guard verifies a bearer JWT; tokens carry the user ID and role and expire after one day | `authentication.guard.ts`, `user.service.ts`, `app.module.ts` |
| UM-03 | Passwords are hashed with bcrypt, and an interceptor removes the password field from user responses | `user.service.ts`, `usersensitive.interceptor.ts` |
| UM-04 | Admin-only routes list users (paginated, with country, state, and city included), fetch, delete, and block or unblock a user; blocked users cannot sign in | `user.controller.ts`, `user.service.ts` |
| UM-05 | The schema relates Country → State → City, and each user references a country, state, and city by integer `code` | `schema.prisma` |
| UM-06 | Country, state, and city modules provide admin-only create and list routes | `country.controller.ts`, `state.controller.ts`, `city.controller.ts` |
| UM-07 | Swagger UI is served at `/api`, and Compodoc-generated documentation is committed under `documentation/` | `main.ts`, `documentation/` |
| UM-08 | A global validation pipe, exception filter, and response interceptor are applied | `main.ts` |
| UM-D1 | Design choice: authorization is declarative — routes declare roles with a decorator and one guard enforces them | `role.decorator.ts`, `authorization.guard.ts` |
| UM-D2 | Design choice: relations use a stable integer `code` rather than the UUID primary key | `schema.prisma` |
| UM-D3 | Design choice: list routes use `POST` with pagination in the request body | `user.controller.ts`, `state.controller.ts` |

Limitations:

| ID | Limitation |
| --- | --- |
| UM-L1 | The README is largely the NestJS starter; project setup, example requests, and role behavior are not documented there |
| UM-L2 | Role checks control which routes each role can call, but the public create route and the update route open to `USER` accept a `role` field, and the update route does not check that users change only their own record; authorization needs hardening before real use |
| UM-L3 | State and city names are unique across the whole table, so two cities with the same name cannot both be stored |
| UM-L4 | Only the starter end-to-end test is present |
| UM-L5 | No independent security or scalability review; no such guarantee is made |

- Discrepancies: README describes the NestJS starter, not this project.
- Demo: none supplied; no demo action.
- Assets: none in v0.2.0; preview is a labeled explanatory data-model diagram using fictional example values only.

Owner-confirmed rationale:

| ID | Explains | Reason (owner's words) | Confirmed |
| --- | --- | --- | --- |
| — | — | None confirmed yet | — |

## 04 — Meridian Assistant — Discord RAG and Proposal Agent

**Status: published.** Owner approved this record and the page text, including the AI-tools wording in "My contribution", on 2026-10-25 (feature 003 T013).

- Source: private repository; no public link. Reviewed from an owner-supplied local copy, branch `main`, clean working tree.
- Reviewed commit: `22ca5b01c5934c521e769776ab96b2035c4e33bf` (committed 2026-10-10); reviewer Claude; review date 2026-10-25. Read only; nothing installed or executed; `.env` not opened (variable names read from `.env.example` only).
- Contribution (owner-confirmed 2026-10-25): sole author; all 7 commits are authored by "Akash". The README states Cursor and Spec Kit were used and that AI assistance drafted and revised code, tests, and the README under review.
- Files read: `README.md`, `package.json`, `.env.example` (names only), `src/library/retrieve.ts`, `src/agent/loop.ts`, `src/agent/guard.ts`, `src/agent/tools.ts`, `src/proposals/approve.ts`, `src/proposals/render.ts`, `db/migrations/006_estimates.sql`, file listing including `tests/`, `eval/`, `library/`, `scripts/generate-library/`
- Supported stack: TypeScript, Node.js 22, Discord.js, PostgreSQL 16 with pgvector, OpenAI API (chat and embeddings), docx, mammoth, pdf-parse, Docker Compose

| ID | Statement | Evidence |
| --- | --- | --- |
| MA-01 | A Discord bot with guild slash commands `/ask`, `/approve-user`, `/propose`, `/edit-estimate`, `/approve-estimate`, `/render-estimate`; all replies are ephemeral | `README.md`, `src/discord/commands.ts` (listed) |
| MA-02 | Identity is the Discord user ID; unknown IDs get only a needs-approval reply; admins approve a user for exactly one brand | `README.md`, `src/auth/actor.ts` (listed), `tools.ts` |
| MA-03 | Retrieval applies the brand and confidentiality filter in SQL before pgvector similarity ordering (top 5) | `src/library/retrieve.ts` |
| MA-04 | Answers keep a claim only when its document title and section label were retrieved on that run; otherwise "The library cannot answer." | `src/agent/guard.ts` |
| MA-05 | A hand-written agent loop stops at 10 steps and retries a failing tool at most 3 times, writing one structured run log | `src/agent/loop.ts`, `README.md` |
| MA-06 | Tool arguments named `brand`, `userId`, or `role` are ignored; tools use the loaded actor | `src/agent/tools.ts`, `README.md` |
| MA-07 | Estimate versions, line items, and approvals are immutable via database triggers; edits insert a new version | `db/migrations/006_estimates.sql` |
| MA-08 | Approval locks the chain and approves only the latest version, owned by the approver in their brand | `src/proposals/approve.ts` |
| MA-09 | Render returns a DOCX only when the version matches owner and brand and a stored approval exists for that user and version | `src/proposals/render.ts` |
| MA-10 | Library of 28 synthetic documents (Markdown, DOCX, PDF) generated deterministically by a committed script, with one planted prompt-injection document | `README.md`, `scripts/generate-library/`, `library/manifest.json` (listed) |
| MA-11 | An evaluation suite of 30 cases runs production modules with a scripted model and embedder; the README reports 30/30 passing | `README.md`, `eval/` (listed) — **reported, not re-run by this review** |
| MA-12 | Unit and integration tests are present (23 test files) | `tests/` (listed) — not run |
| MA-D1 | Design choice: authorization and brand scope are SQL predicates and stored rows, never model instructions | `retrieve.ts`, `approve.ts`, `render.ts` |
| MA-D2 | Design choice: no agent framework; the loop is hand-written with fixed step and retry caps | `loop.ts`, `README.md` |
| MA-D3 | Design choice: one chunk per authored section, vector-only retrieval with no rerank | `README.md` |

Limitations (from the README's own "Known limitations" and the review):

| ID | Limitation |
| --- | --- |
| MA-L1 | The evaluation suite uses a scripted model and stand-in embeddings; it does not measure live answer quality or real ranking |
| MA-L2 | Estimate rates in Postgres are separate seed data from the library rate cards and differ from them |
| MA-L3 | The rendered DOCX is a fee summary with no written scope or narrative |
| MA-L4 | `/propose` takes service codes and quantities, not a free-text request |
| MA-L5 | Optional CRM webhook and next-session proposal continuity were not implemented |
| MA-L6 | Tests and evaluation were not run by this review; source is private |

- Data: all brands, clients, documents, and seeded staff IDs are fictional (Meridian, Arc, Foundry).
- Assets: one owner-supplied composite image (2026-10-25) with a title banner and four Discord captures. **Not approved yet**: owner must confirm the captures are unedited, and a real Discord user ID visible in the approval reply must be blurred before use.
- Demo: none; no demo action.
- Screenshot: not used; owner has not confirmed the captures are unedited. Public text names no company or context beyond the project itself.

## 05 — HRMS Backend — Multi-Tenant HR Platform

**Status: published.** Owner approved the exact public text and module map on 2026-10-25 (feature 003 T020). Publishable material only; file-level evidence is held outside the repository.

- Source: private; no public link. Reviewed read-only from an owner-supplied local copy at commit `9456d56a73564ae56ca9538e0b13bf8e7a5040c7` (a feature branch, committed 2026-09-04); reviewer Claude; review date 2026-10-25. Nothing run, installed, or copied; secret files not opened.
- Permission: owner-confirmed 2026-10-25 that the project may be described publicly. No organization is named in any public or committed text.
- Contribution: commit history shows a small team. The owner started and wrote most commits in the large majority of HR-domain modules; teammates built the project skeleton, authentication, tenancy, the workflow engine, billing, and platform modules. Owner-approved wording (2026-10-25): "I built most of the HR modules — leave, attendance, onboarding, documents, scheduling and more — in a multi-tenant backend developed by a small team."
- Supported stack: NestJS 10, TypeScript, PostgreSQL, TypeORM, JWT, AWS S3, Nodemailer with EJS templates, Jest

| ID | Statement (module level) |
| --- | --- |
| HR-01 | A modular NestJS backend with about 37 feature modules covering employee records, organization, onboarding, offboarding, leave, attendance, timesheets, overtime, shift rosters, workforce scheduling, holidays, probation, salary structures, documents, notifications, and employee and manager self-service |
| HR-02 | Data is tenant-scoped (tenant identifier on most entities); scheduled jobs run per tenant |
| HR-03 | Leave: categories, balances with a transaction history, daily scheduled accrual per tenant, carry-forward, encashment, a leave calendar, and multi-level approval through the shared workflow engine, falling back to the next level when a level has no workflow configured |
| HR-04 | Attendance: records, policies, regularization with approval, and reports; approved leave and holidays are read through adapter services |
| HR-05 | Onboarding: from offer and candidate joining form through document verification, identity-document extraction, asset requests, and induction to creating the employee record and account |
| HR-06 | Shift rosters and workforce scheduling: roster generation, rotation, swaps, weekly offs, coverage rules, conflict checks, and schedule change requests with approval |
| HR-07 | Documents: folders, versions, approvals, expiry, e-signature, sharing and permissions; files kept in S3 storage and served through signed URLs |
| HR-08 | Email notifications: templated, branded emails with recipient resolution and a send log; failed sends retry with exponential backoff, re-reading state from the database on each attempt |
| HR-09 | Probation, overtime (with compensatory off and payroll data), timesheets, salary structures, offboarding (asset return, letters), and employment documents |
| HR-10 | Modules record changes through their own audit services |
| HR-11 | About 250 unit test files and about 200 integration test files are present; schema changes are kept as per-module migrations (about 276 files) |
| HR-D1 | Design choice: modules read each other's data through adapter services rather than other modules' tables |
| HR-D2 | Design choice: approvals across modules are delegated to one shared workflow engine, with approval levels mapped to configured workflows |
| HR-D3 | Design choice: each email retry re-reads the send and its attachments from the database instead of carrying them in a queued job |

Limitations:

| ID | Limitation |
| --- | --- |
| HR-L1 | Team-built: authentication, tenancy, the workflow engine, billing, and platform modules are teammates' work |
| HR-L2 | Reviewed at a feature-branch commit; source private; no production usage or performance figures are claimed |
| HR-L3 | Tests were not run by this review |
| HR-L4 | No independent security review; no security or scalability guarantee is made |

- Assets: none; preview is a labeled explanatory module map. Demo: none.

Owner-confirmed rationale:

| ID | Explains | Reason (owner's words) | Confirmed |
| --- | --- | --- | --- |
| — | — | None confirmed yet | — |

## Unpublished candidates and supporting work

| Project | Current disposition | Evidence or condition needed |
| --- | --- | --- |
| [Elbow-Grease](https://github.com/Akashkpillai/Elbow-Grease) | Earlier-work candidate, outside initial three | README describes MERN bookings, user/admin/expert flows, JWT/email verification, Stripe; explicitly in development. Check actual flows and clean documentation before promotion. |
| [mayaNetz](https://github.com/Akashkpillai/mayaNetz) | Secondary UI candidate | Next.js cybersecurity marketing frontend; README says backend APIs unbuilt and contact simulated. Retain those limitations. |
| [Microservice-with-Redis-in-NestJS](https://github.com/Akashkpillai/Microservice-with-Redis-in-NestJS) | Learning work; not featured | Incomplete setup documentation; completeness review and private credential hygiene check needed |
| [microservice](https://github.com/Akashkpillai/microservice) | Supporting learning work | Public structure includes auth/reservation services; scope and documentation need strengthening |

Exclude clones, starter login/todo apps, DSA exercises, and the old Personal-Website from the main selection.

The guide reports tracked `server/.env` in Elbow-Grease and `server/match-service/.env` in Microservice-with-Redis-in-NestJS. Values were not opened. Before prominently linking those projects, the owner should privately check them, revoke/rotate real credentials if present, and remove tracked content/history as appropriate. Deleting a file alone does not revoke credentials. No such inspection or remediation occurred in this task.

## Publication record

For each selected case study the register above now holds: exact repository and reviewed commit, reviewer and date, evidence paths and claim mapping, owner-confirmed contribution (2026-10-25), limitations, asset provenance (none), and demo check (none). Status in site content: published, pending owner review of this register before release. Unverified demos stay absent, screenshots must be genuine and sanitized, and drafts remain excluded from every public discovery surface. Unknown/draft direct routes return 404.
