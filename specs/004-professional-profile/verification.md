# Verification: Professional Profile

Actual outcomes only. A check not listed as run here has not been run.

## T001 Context and baseline (2026-10-25)

- Root `C:\Users\HP\Desktop\akash-portfolio`; Git branch `feat/004-resume` (created by the
  owner); `SPECIFY_*` overrides unset; `.specify/feature.json` →
  `specs/004-professional-profile`. Spec checklist 16/16.
- Baseline `npm run lint`, `npm run typecheck`, `npm run build`: pass; routes `/`,
  `/_not-found`, `/work`, four case studies.
- Spec updated before coding: the owner's corrected résumé PDF shows InFineIT as
  **March 2023 – July 2026** (not June 2026 as first answered) and the LinkedIn URL
  `linkedin.com/in/akash-k-pillai`; the PDF is followed. The PDF still says "Led end-to-end
  backend development" for the HR system; per FR-004 the site uses the case-study wording.

## T002–T004 Shared content

`profile.ts` (provisional comment removed; `location`, `about`, `languages` from the
résumé), `contact.ts` (three owner-confirmed links), `navigation.ts` (six items). Header and
MobileNav render them without code changes.

**001 gate closed:** the provisional role/headline from feature 001 is confirmed by the
résumé ("Backend Developer | AI Developer" → "Backend & AI Developer").

## T005–T012 Experience, Skills, About

- Experience: IITIL, "Software Developer", Remote, Jul 2026 – Present; highlights use the
  case-study wording ("built most of the HR modules in an HR management backend developed
  by a small team") and neither name nor link the HRMS case study. InFineIT Global
  Services LLP, "Backend Developer", Surat, Mar 2023 – Jul 2026 (corrected PDF); FineOne
  shown as 2025 – 2026 (the PDF still says "Present" for FineOne although the role ended),
  FineStar 2023 – 2025. "Mentored 2 junior developers" and "3+ years" are résumé facts.
- Skills: six résumé groups in résumé order. Links only where register evidence shows the
  skill. "Token/cost tracking" left unlinked: register MA-05 records a run log without
  naming token or cost fields.
- About: degree, institution, years, start of backend work (March 2023), current focus,
  languages, "Kerala, India". No motives or anecdotes.
- Field-by-field review against the spec's owner-supplied facts: all match (SC-001), no
  contradiction with case studies (SC-007).

## T013–T019 Contact and résumé

- T013: copied `C:\Users\HP\Downloads\Akash_K_Pillai_Classic_Resume (1).pdf` (79,919 bytes,
  saved 2026-10-25 20:57, sha256 prefix `91d96d1cfd7a9d83`, `%PDF-1.3`) to
  `public/resume/Akash_K_Pillai_Resume.pdf`. Identified as the corrected PDF by name and date
  (its text is font-encoded and could not be extracted); its contents match the attachment
  the owner sent: InFineIT March 2023 – July 2026, LinkedIn `linkedin.com/in/akash-k-pillai`.
  Contains phone and home town — owner-accepted. Still says "Led end-to-end backend
  development" (site uses the case-study wording, FR-004).
- Résumé URL: 200, `application/pdf`; "Download résumé" appears in the hero and Contact.
- Mail link, LinkedIn, GitHub: exact owner-confirmed values. Copy email (keyboard Enter):
  live region "Email copied"; clipboard contains the address.
- Phone (`73563`, `7356344191`, `44191`) and town names (`Alappuzha`, `Pandalam`,
  `Pathanamthitta`) on all 8 pages: **0 matches** (SC-006).

## T020–T023 Changelog and version

- `package.json` and lockfile set to `0.3.0` with `npm version 0.3.0
  --no-git-tag-version` (needed for the build assertion). Changelog: 0.3.0, 0.2.0, 0.1.0,
  all dated 2026-10-25 from commit history.
- Footer on `/`, `/work`, `/changelog`, and all four case studies reads "Version 0.3.0";
  newest changelog entry "Version 0.3.0". **Pass (SC-003).**
- Mismatch test: newest entry set to 0.3.9 → `npm run build` exit 1 with "Changelog newest
  version … does not match package.json version"; restored; build passes.

## T024–T025 Browser checks

`verification/run-browser-checks.mjs` (from 003, extended), `next start` port 3100:
responsive (390/768/1440, emulated 200% zoom, incl. `/changelog`), noJavaScript,
keyboardNavigation, diagramSelection, reducedMotion, links, regression001 (now six nav
items), profile (36 nav activations: six items × three starting routes × desktop and mobile;
contact; copy email; résumé; footer versions) — **all PASS**.

- Checker fixes during the run: `mailto:` links are validated by value, not fetched;
  LinkedIn answers automated requests with status 999 (a plain request gets 301), recorded
  as `blockedByBotCheck` and accepted for linkedin.com only. The profile itself was not
  verified by a person.
- Visual review (`home-1440.png`, `changelog-1440.png`): new sections fit the Journal
  style; footer name and version were misaligned → `align-items: center` added; rebuilt.

## T026 Confidentiality (case-study scope)

`check-confidentiality.mjs` with `PAGES` = four case studies: case-study pages 0, register
0, `.next/static` 0. Expected hits only from the intentional employer name in Experience:
`src/content/experience.ts` and the homepage build output. Case studies still name no
organization.

## T027 Docs

`docs/roadmap.md` and `docs/content-needed.md` gain dated status sections; originals kept as
history.

## T028 Acceptance — **awaiting owner**

Reconciliation (2026-10-25): FR-001–FR-015 and SC-001–SC-007 pass as recorded above.
Unrun: Chrome's real 200% zoom setting; a person checking the LinkedIn profile and the
visuals. Version is 0.3.0 in the package, footer, and changelog. No tag, push, or
deployment. Owner confirmation of the 0.3.0 release closes T028.
