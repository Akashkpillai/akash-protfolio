# Project evidence register

Recorded 2026-10-25. **Provenance:** project observations below are transcribed from [portfolio-build-guide.md](portfolio-build-guide.md), planning edition 1.0, whose review date is 2026-10-25. This planning pass inspected only this local workspace and its Spec Kit installation. It did not fetch project repositories, run their applications, inspect credentials, verify demos, or independently audit security.

Source branches are mutable; no reviewed commit hashes were supplied. Before detailed case-study copy or publication, inspect relevant source again and record reviewer/date, actual commit, evidence paths, user-confirmed contribution, approved assets, and actual demo-check result. A listed repository link is guide-supplied, not a fresh link check.

## 01 — Resume Analyzer — AI Document Processing

- Source: [Akashkpillai/resume-analyzer](https://github.com/Akashkpillai/resume-analyzer). Default branch/commit not recorded in the guide.
- Guide evidence: `backend/src/resume/resume-parser.service.ts`, `backend/src/resume/resume.service.ts`, frontend pages, Prisma schema, auth module.
- Supported stack from that review: NestJS, React, TypeScript, PostgreSQL, Prisma, Groq, PDF extraction.
- Supported story: PDF upload/extraction, text cleanup, structured AI parsing, basic fallback parsing, and user-scoped persistence/retrieval. Parser strips null characters before persistence; service scopes list/detail lookups to a user. These observations do not establish a complete security assessment.
- Discrepancies: README says TypeORM; reviewed resume service uses Prisma. Parser calls Groq using `openai/gpt-oss-20b`; avoid the README's older model description and keep model names out of the headline.
- Limits: AI prompt receives the first 4,000 characters; fallback extraction is basic. No exhaustive parsing, validated hiring accuracy, or invented metrics.
- Demo candidate: [repository-listed deployment](https://resume-analyzer-rosy.vercel.app), **unverified end to end**. Omit Live Demo until checked; record date and meaningful tested flow before enabling it.
- Visual: approved sanitized screenshot or a labeled explanatory pipeline; fictional sample résumés only.
- Pending: current commit/source review, contribution confirmation, approved screenshot, and optional demo verification.

## 02 — Notification Platform — Event-Driven Backend

- Source: [Akashkpillai/notificationservice](https://github.com/Akashkpillai/notificationservice), guide-reported default branch `master`. This is distinct from `notification_service`; do not substitute it.
- Guide evidence: `apps/notification-services/src/notification-router.service.ts`, email/SMS service implementations, shared Kafka topics/contracts, Prisma schema.
- Supported stack: NestJS, Kafka, PostgreSQL, Prisma; email and Twilio SMS integration code.
- Supported story: channel routing, delivery-state persistence, and failure handling. Worker code includes sent-status checks, retry-event publishing, and a dead-letter threshold.
- Limits: describe these as **implemented code paths**, pending complete workflow execution. Push service returns `Hello World!`; push delivery is unfinished. No working FCM/APNs claim, proven exactly-once delivery, or production reliability claim.
- Demo: none supplied; omit demo action.
- Visual: explanatory gateway/broker/router/workers/database diagram. Label failure/retry paths accurately; separate future work.
- Pending: reviewed commit, confirmed contribution, exercised happy/failure/retry paths if runtime claims are desired, and diagram accuracy review. Record actual retry threshold only after reading source.

## 03 — User Management API — Roles & Relational Data

- Source: [Akashkpillai/user-management-with-prisma](https://github.com/Akashkpillai/user-management-with-prisma), guide-reported default branch `master`.
- Guide evidence: authentication/authorization guards, role decorator, user/country/state/city modules, Prisma schema, generated Compodoc documentation.
- Supported stack: NestJS, TypeScript, Prisma, PostgreSQL.
- Supported story: user management, role-based authorization, relational modeling, and API documentation.
- Limits: README is largely Nest starter material. Project-specific setup, example requests, role behavior, schema explanation, and limitations need improvement before heavy promotion. This portfolio task does not edit that repository. No independently verified security or scalability guarantees.
- Demo: none supplied; omit demo action.
- Visual: compact entity relationship diagram or a request/response example with fictional data, checked against source.
- Pending: reviewed commit, contribution confirmation, accurate role/schema examples, documentation cleanup or candid limitation notes.

## Unpublished candidates and supporting work

| Project | Current disposition | Evidence or condition needed |
| --- | --- | --- |
| Meridian | Draft; excluded from public pages, routes, indexes, metadata, sitemap | Repository or approved screenshots, architecture notes, contribution/scope, limitations, and demo evidence; review before publication. No identifiable public repository was found in the guide's returned list; do not fabricate a URL. |
| Company HRMS assistant | Possible future experience/sanitized case study | Shareable evidence, employer permission, confirmed contribution and dates; no private code or borrowed feature/configuration/constitution |
| [Elbow-Grease](https://github.com/Akashkpillai/Elbow-Grease) | Earlier-work candidate, outside initial three | README describes MERN bookings, user/admin/expert flows, JWT/email verification, Stripe; explicitly in development. Check actual flows and clean documentation before promotion. |
| [mayaNetz](https://github.com/Akashkpillai/mayaNetz) | Secondary UI candidate | Next.js cybersecurity marketing frontend; README says backend APIs unbuilt and contact simulated. Retain those limitations. |
| [Microservice-with-Redis-in-NestJS](https://github.com/Akashkpillai/Microservice-with-Redis-in-NestJS) | Learning work; not featured | Incomplete setup documentation; completeness review and private credential hygiene check needed |
| [microservice](https://github.com/Akashkpillai/microservice) | Supporting learning work | Public structure includes auth/reservation services; scope and documentation need strengthening |

Exclude clones, starter login/todo apps, DSA exercises, and the old Personal-Website from the main selection.

The guide reports tracked `server/.env` in Elbow-Grease and `server/match-service/.env` in Microservice-with-Redis-in-NestJS. Values were not opened. Before prominently linking those projects, the owner should privately check them, revoke/rotate real credentials if present, and remove tracked content/history as appropriate. Deleting a file alone does not revoke credentials. No such inspection or remediation occurred in this task.

## Publication record required later

For each selected case study, retain: status; exact repository and reviewed commit; evidence paths and claim mapping; checked date; confirmed personal contribution; limitations; approved asset provenance; optional demo URL plus tested outcome/date. All three selected projects remain planned content here. Unverified demos stay absent, screenshots must be genuine and sanitized, and drafts remain excluded from every public discovery surface. Unknown/draft direct routes return 404.
