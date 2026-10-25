# Verification: Additional Case Studies

Actual outcomes only. A check not listed as run here has not been run.

## T001 Context (2026-10-25)

- Owner approved committing feature 002 and creating a 003 branch.
- Register section 04 scrubbed of background context and local path before that commit
  (T004 done first so the context never entered history).
- Feature 002 committed as `ae63bbd` on `feat/002-engineering-case-studies`; feature 003
  planning files left out of that commit.
- Now on `feat/003-additional-case-studies`. `SPECIFY_*` overrides unset;
  `.specify/feature.json` → `specs/003-additional-case-studies`.

## T002 Baseline

`npm run lint`, `npm run typecheck`: pass. `npm run build`: pass, three case-study paths
(`resume-analyzer`, `notification-platform`, `user-management-api`).

## T003 Private evidence

`.gitignore` gains `private-evidence/`. `git check-ignore -v private-evidence/hrms.md` →
`.gitignore:67:private-evidence/`. **Pass.**

## T004 Register section 04

Background context, local path, and remote URL removed; MA-L6 reworded. Done before the
002 commit, so the context is not in Git history.

## T005–T008 Model and components

`source` union, numeric `order`, new slugs, `workflow` kind, optional `screenshot`;
private source row; `WorkflowDiagram`; preview label. Lint, typecheck, build: pass; the
three existing case studies unchanged.

## T009–T012 Meridian content

Case study written from MA- IDs; record added as draft. **T011: no screenshot used** —
the owner has not confirmed the captures are unedited, and the visible Discord user ID is
not yet removed. The labeled workflow diagram is the preview.

## T013 Owner review of Meridian — **OPEN**

Meridian stays `draft` until the owner reviews register section 04 and the page text
(including the AI-tools wording in "My contribution").

## T014 Meridian page check (temporarily published, then restored to draft)

- Build listed `/work/meridian-assistant`; HTTP 200. Raw HTML: one `h1`, all seven
  section headings, "Source code is private", workflow step list, status labels, no
  `github.com` link. **Pass (SC-001).**
- Leak search of all pages and `.next/static` for User Management, background terms,
  HRMS, and evidence IDs: 0. **Pass.**
- Browser checks (`verification/run-browser-checks.mjs`, run from PowerShell with
  `CASE_STUDIES` set to the three published-for-test projects): responsive (390/768/1440,
  emulated 200% zoom), noJavaScript (private source shows statement, no link),
  keyboardNavigation, diagramSelection, reducedMotion, links, regression001 — **all PASS**.
  Git Bash rewrote `/work/...` env values into Windows paths on the first run; re-run from
  PowerShell.
- Visual review of `home-1440.png` and `work-meridian-assistant-1440.png`: workflow diagram
  legible, four distinct preview kinds pending HRMS, no clipping. Homepage numbering
  currently starts at 02 because HRMS (01) is unpublished.

## T015 HRMS source review — done; **contribution finding**

Read in place, read-only; `.env` not opened. File-level details are in gitignored
`private-evidence/hrms.md` only. Findings safe to state here:

- HEAD is on a feature branch, not the default branch.
- Commit history has several authors; the owner authored about 41% of commits.
- The owner first added and wrote most commits in the large majority of HR-domain modules;
  another author started the project skeleton and the auth, tenancy, workflow, billing,
  and platform modules.
- So "I built the whole backend" is **not supported** by the history. T016–T021 are
  paused until the owner confirms contribution wording (spec edge case).

## T016–T021 HRMS — **BLOCKED** on owner contribution wording and text approval

## T022–T025 Confidentiality and draft checks

- T022: terms list in gitignored `private-evidence/terms.txt` (14 terms: org identifier,
  collaborator names, context words, local folder names). It does not yet include HRMS
  product, client, or host names beyond these; extend it when section 05 is written.
- T023–T024: `verification/check-confidentiality.mjs` — first run: 1 match, in the old
  HRMS placeholder row of the register; row replaced with neutral wording; re-run:
  **0 matches** across pages, `.next/server`, `.next/static`, `src/content`, register.
- T025: with Meridian draft, `/work/meridian-assistant` → 404, no "meridian" in any page
  or `.next/static` file, no prerendered file. **Pass.**
- Note: the removed register row ("employer permission") exists in Git history from the
  baseline commit `37f75a6`; it names no company.

## T026–T029 Browse

- Orders: meridian-assistant 2, notification-platform 3, resume-analyzer 4,
  user-management-api 5 (`draft`). HRMS will be 1.
- Homepage and `/work` copy no longer say "three" or "public repository".
- `/work/user-management-api` → 404; "User Management" in pages and `.next/static`: 0.
- `/work` order with Meridian published: meridian-assistant, notification-platform,
  resume-analyzer. **Pass.**

## T031 Claim trace (Meridian)

21 MA- IDs cited, 0 missing from the register, 0 register IDs uncited, limitations 6/6,
only the contribution statement has no evidence (owner-confirmed). HRMS: pending.

## Open gates

- T013 owner review of Meridian; T016–T021 HRMS (contribution wording, then text
  approval); screenshot confirmation (optional); final full run of T030–T032 once HRMS is
  published.

## T013 Owner approval of Meridian — done

Owner message 2026-10-25: "approved start the build". Recorded in register section 04;
`meridian-assistant` set to `published`; removed from the unpublished table. No
screenshot (captures not confirmed).

## T016–T019 HRMS content

- Owner approved the suggested contribution wording ("most of the HR modules … in a
  multi-tenant backend developed by a small team") in the same message.
- Register section 05 added: module-level claims HR-01–HR-11, design choices HR-D1–HR-D3,
  limitations HR-L1–HR-L4; no paths, branch name, organization, or people. HR-D3 narrowed
  after re-reading the email queue (it keeps a small in-process guard).
- T017 diagram choice: neither `data-model` (the review did not focus on entities) nor
  `architecture` (already Notification Platform's preview kind, and FR-012 needs distinct
  previews). Added a static `module-map` kind (`ModuleMapDiagram`). Every edge was checked
  against module imports.
- Record added with `order: 1`, `source: private`, status draft.

## T020 Owner approval of the exact HRMS text — **OPEN**

## T021 / T030 Full check with HRMS temporarily published (restored to draft after)

- Lint, typecheck: pass. Build: exactly four case-study paths.
- Browser checks with all four case studies (default `CASE_STUDIES`): responsive,
  noJavaScript, keyboardNavigation, diagramSelection, reducedMotion, links, regression001 —
  **all PASS**. `/work` order: hrms-backend, meridian-assistant, notification-platform,
  resume-analyzer.
- Confidentiality search: **0 matches** across all pages, `.next/server`, `.next/static`,
  `src/content`, and the register.
- Visual review (`home-1440.png`, `work-hrms-backend-1440.png`): four distinct preview kinds
  (module map, workflow, architecture, pipeline), numbered 01–04, alternating layouts; HRMS
  diagram legible, no crossing edges; no clipping.

## T031 Claim trace (HRMS)

18 HR- IDs cited, 0 missing, 0 uncited, limitations 4/4, no claim without evidence.

## T032 Reconciliation (2026-10-25)

| Item | Result |
| --- | --- |
| FR-001, FR-012 new case studies with static diagrams | Pass |
| FR-002 evidence records | Pass (sections 04, 05) |
| FR-003 private source statement | Pass |
| FR-004 HRMS confidentiality | Pass (term search 0; module-level register) |
| FR-005 HRMS text approval | **Open (T020)** |
| FR-006 no company/employer/interview | Pass (term search 0) |
| FR-007 self-reported results attributed | Pass |
| FR-008 screenshot only when approved | Pass (none used) |
| FR-009 order | Pass (with HRMS published for test) |
| FR-010 routes and drafts | Pass |
| FR-011 contribution wording | Pass (owner-approved) |
| FR-013, FR-014 regression, accessibility, layout | Pass (zoom emulated) |
| FR-015 no version/changelog change | Pass |
| FR-016 User Management API unpublished | Pass |
| SC-001–SC-006 | Pass |
| SC-007 owner approvals recorded | Meridian yes; HRMS **open** |

Unrun: Chrome's real 200% zoom; human visual review. The confidentiality terms list
covers organization, collaborator, and context names found so far; it would not catch a
product or client name that was not identified.

## T020 Owner approval of HRMS — done

Owner message 2026-10-25: "approve hrms". Recorded in register section 05;
`hrms-backend` set to `published`; removed from the unpublished table.

## Final check (all four published)

Lint, typecheck: pass. Build: `/work/hrms-backend`, `/work/meridian-assistant`,
`/work/notification-platform`, `/work/resume-analyzer`. Browser checks: all 7 PASS.
Confidentiality search: 0 matches. `/work/user-management-api` and `/work/meridian`: 404.
No open owner gates remain for feature 003; the screenshot stays optional.
