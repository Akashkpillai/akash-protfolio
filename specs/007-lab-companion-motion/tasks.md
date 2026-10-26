---

description: "Implementation tasks for the Probe companion, Ask the lab, motion, and messages"
---

# Tasks: Lab Companion, Ask the Lab, Motion, and Messages

**Input**: Design documents in `specs/007-lab-companion-motion/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [UI contract](contracts/ui.md), [quickstart.md](quickstart.md)

**Tests**: No test suite requested; verification scripts and recorded checks in
`specs/007-lab-companion-motion/verification.md`.

**Organization**: Setup, motion foundation (shared by every story), US1 Probe + Ask the lab
(P1), US2 motion effects (P2), US3 messages (P3), polish.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on another incomplete task in the same phase

---

## Phase 1: Setup

- [X] T001 Verify root, branch, status, `SPECIFY_*` unset, `.specify/feature.json` → `specs/007-lab-companion-motion`; baseline lint/typecheck/build with `SITE_URL`; create `specs/007-lab-companion-motion/verification.md`.

---

## Phase 2: Foundational (Motion system)

- [X] T002 Create `src/components/motion/MotionProvider.tsx` (`"use client"`): context `{ active, paused, setPaused }`; preference `"on" | "paused"` in `localStorage["lab-motion"]` (session fallback); `active = on && !prefers-reduced-motion`; writes `<html data-motion>`; on fine-pointer move (rAF, only when active) sets `--spot-x/--spot-y` on `<html>`; export `useMotion()`.
- [X] T003 [P] Create `src/components/motion/MotionToggle.tsx` (button "Pause motion", `aria-pressed`, icon + visible "Motion off" when paused, ≥ 44 px) and `src/components/motion/AmbientBackground.tsx` (server, `aria-hidden`: grid, two aurora glows, six signals, spotlight) and the scroll-progress bar element.
- [X] T004 Update `src/app/layout.tsx`: inline head script applying a saved `paused` to `<html data-motion>` before paint; wrap body in `MotionProvider`; render `AmbientBackground` and the progress bar; add `MotionToggle` to `src/components/layout/Header.tsx` (desktop and mobile).
- [X] T005 Update `src/components/lab/Reveal.tsx` to take `variant` (`up | left | right | scale | clip`, default `up`) and `delay`, and to use `useMotion().active` (paused or reduced → always shown).
- [X] T006 Append the 007 motion CSS to `src/app/globals.css`: ambient layer (grid moved off `body`, aurora drift 40–60 s, signals 8–14 s, spotlight), scroll progress (`@supports (animation-timeline: scroll())`), reveal variants, all gated by `@media (prefers-reduced-motion: no-preference)` and `:root:not([data-motion="paused"])`; toggle styles.

**Checkpoint**: Ambient background runs, pauses, and persists; reduced motion stops it.

---

## Phase 3: User Story 1 - Ask the lab and meet the Probe (P1) 🎯 MVP

- [X] T007 [P] [US1] Create `src/lib/lab-knowledge.ts` (server): `LabTopic[]` from published content only — about, experience, skills, contact, unfinished (every unfinished / implemented-code-path claim and flow step with labels), one per published project (summary, contribution claim, stack, first limitation, source status); verbatim text, short interface labels only; links to published routes, contact hrefs, résumé.
- [X] T008 [P] [US1] Create `src/lib/lab-answer.ts`: `LabAnswer`, `AnswerSource` interface, `createScriptedSource(topics)` (tokenise, plural folding, keyword scoring, fallback listing topic labels; never mentions drafts).
- [X] T009 [US1] Create `src/components/lab/AskLab.tsx` (`"use client"`): native `<dialog id="ask-lab">` via `showModal()`; listens for `lab:ask`; heading, footnote, Close; suggested-question buttons; `role="log"` polite conversation (latest 20); typing indicator 700 ms when motion active; input 1–300 chars + Send; empty input message; focus returns to opener on close (depends on T007, T008).
- [X] T010 [P] [US1] Create `src/components/lab/AskLabButton.tsx` (hydration-only button dispatching `lab:ask` with itself as opener) and add it to the hero actions in `src/components/layout/SystemsLab.tsx`.
- [X] T011 [US1] Create `src/components/lab/LabProbe.tsx` (`"use client"`): button "Ask the lab" (dispatches `lab:ask`), decorative SVG orb; modes docked/travelling/perched/resting/dragged; spring (170/26) rAF loop only while needed and tab visible; listens to `lab:focus`, `lab:celebrate`; section tips via `IntersectionObserver` over `[data-probe-section]` reading `[data-probe-tip]` text, once per section per visit (`sessionStorage`); placement beside text (Range) else left else docked; drag with pointer capture (> 4 px, suppress click, spring back); travel only for fine pointer + motion active + width ≥ 52rem + no open dialog; orbit dot looks toward pointer; rest after 30 s idle; hidden while the dialog is open.
- [X] T012 [US1] Update `src/components/lab/ProjectConstellation.tsx`: ids `lab-node-<slug>` and `lab-step-<i>`; dispatch `lab:focus` on selection and each trace step; packet overlay keyed by a selection counter; `--i` on steps for stagger. Update `CopyEmailButton` to dispatch `lab:celebrate` on success.
- [X] T013 [US1] Add `data-probe-section` / `data-probe-tip` to the project map, work, experience, skills, about, message, and contact sections (tip = the section's existing intro sentence, or an interface hint for the map: its existing "Select a project…" line); render `LabProbe` and `AskLab` (with `labTopics()` props) in `src/app/layout.tsx`.
- [X] T014 [US1] Append Probe and dialog CSS (orb, ring, orbit dot, modes, tip bubble, celebrate pulse, dialog layout, chips, typing dots) to `src/app/globals.css`.
- [X] T015 [P] [US1] Create `specs/007-lab-companion-motion/verification/check-lab-knowledge.mjs`: reads `verification/lab-answers.json` (every answer, written by the browser script's `askLab` check, T016) and verifies each answer paragraph, with its leading interface label removed, appears verbatim in `src/content/**`; and that no draft slug or title appears in any answer.
- [X] T016 [US1] Create `specs/007-lab-companion-motion/verification/run-browser-checks.mjs` from 006's, adding `probe` and `askLab` (writing all answers to `verification/lab-answers.json` for T015); run; review; record.

---

## Phase 4: User Story 2 - Motion effects (P2)

- [X] T017 [P] [US2] Create `src/components/motion/Tilt.tsx` (`"use client"`, children pass through): fine pointer + motion active only; `--tilt-x/--tilt-y` ≤ 6° and `--spot-x/--spot-y` via rAF; reset on leave.
- [X] T018 [US2] Apply `Reveal` variants and `Tilt`: section headings (up), work cards (alternating left/right, wrapped in `Tilt`), experience role list (timeline), skill groups (scale, staggered), about (clip), architecture panel (`Tilt`), in `SelectedWork.tsx`, `ProjectStory.tsx`, `ExperienceSection.tsx`, `SkillsSection.tsx`, `AboutSection.tsx`, `ProjectConstellation.tsx`.
- [X] T019 [US2] Append CSS: timeline rail + dots draw, tilt transform and spotlight, packet dash animation, panel step stagger, magnetic-free hover polish; all gated as in T006.
- [X] T020 [US2] Extend the browser script with `motionPause` (toggle → 0 running CSS animations, Probe docked, persisted after reload; toggle back resumes) and `scrollProgress`; confirm `reducedMotionAll` and CLS; run; review; record.

---

## Phase 5: User Story 3 - Leave a message (P3)

- [X] T021 [P] [US3] Create `src/lib/message-delivery.ts`: `MessageDraft`, `validateMessage(draft)` (rules in data model), `deliverMessage(draft) → { kind: "mailto", href, text }` with subject `[Portfolio] <topic> — <name>` and body `<message>\n\n— <name>\nReply to: <email>`.
- [X] T022 [US3] Create `src/components/profile/MessageForm.tsx` (`"use client"`, `noValidate`, fallback `action="mailto:…" method="post" encType="text/plain"`): fields, live count (announced from 1,800), field errors with `aria-invalid`/`aria-describedby`, status summary, focus first error, open mailto via a temporary anchor, confirmation + Copy message + address, dispatch `lab:celebrate`.
- [X] T023 [US3] Create `src/components/profile/MessageSection.tsx` (`section#message`, "06 / Message", h2 "Send a message", delivery/privacy intro, address link) and add it before Contact in `src/app/page.tsx`; relabel Contact "07 / Contact"; append form CSS.
- [X] T024 [US3] Extend the browser script with `messageForm` (empty → 4 errors and focus on Name; invalid email → email error; valid → captured mailto equals the expected subject/body; confirmation shown; Copy message copies) and include `/#message` in nav/link checks; run; record.

---

## Phase 6: Polish & Cross-Cutting

- [X] T025 Update `docs/design-direction.md` (Probe, Ask the lab, motion inventory, pause control, messages) and dated status in `docs/roadmap.md`.
- [X] T026 Full verification: lint, typecheck, build, 005 metadata/served-output/evidence scripts, 006 content-preserved, 003 confidentiality, `check-lab-knowledge.mjs`, full browser script, Lighthouse home mobile/desktop; screenshot review; record environment, results, not-run items.
- [X] T027 Reconcile FR-001–FR-025 and SC-001–SC-008 in `verification.md`.
- [ ] T028 Acceptance (owner): with 006, approve; version 0.5.0 + changelog entry; no commit/tag/push/deploy unless asked.

## Phase 7: User Story 4 - 3D orbit and a livelier Probe (Revision 2, P2)

- [X] T029 [US4] Create `src/lib/orbit.ts` (`orbitPoint(angle)` → `{ x, y, depth }` on the tilted ellipse rx 36 %, ry 24 %; `baseAngle(index, count)`), and use it in `src/components/layout/SystemsLab.tsx` for the static (server) positions.
- [X] T030 [US4] Update `src/components/lab/ProjectConstellation.tsx`: rAF orbit (≈ 70 s per revolution) moving node slots by transform from their static positions, scale/brightness/z-order by depth, spokes follow; pause on pointer over the map, focus inside, 10 s after a selection, map off-screen, tab hidden, motion inactive, or below 46rem; `data-moving` on the orbit and a `lab:orbit` event so the Probe can ride along; packet drawn to the selected node's current position.
- [X] T031 [US4] Rebuild the Probe visual in `src/components/lab/LabProbe.tsx` as HTML/CSS 3D (sphere with lighting, ground shadow, tilted ring with a moon passing behind and in front, ping ripple, doze "z" marks, celebrate sparks); add stretch along travel, landing squash, throw velocity, hover hop, pointer-facing highlight, perch on top of nodes, keep running while perched on a moving planet.
- [X] T032 [US4] CSS: sun and planet spheres, tilted orbit rings, depth styling, Probe 3D layers and activity animations — all continuous ones gated by reduced motion and the pause.
- [X] T033 [US4] Update verification: hover the sun before clicking nodes (real visitors pause the orbit the same way), add an `orbit` check (SC-009, SC-010) and Probe 3D/activity assertions; run the full suite, content checks, confidentiality, Lighthouse; review screenshots; record.

## Dependencies & Execution Order

- Setup → Foundational (T002 before T003–T006) → US1 → US2 → US3 → Polish.
- US1: T007, T008, T010 parallel; T009 needs T007–T008; T011 before T013; T016 last.
- US2 and US3 depend on Foundational and the browser script (T016); `globals.css` edits are sequential.

## Notes

- Ask the lab and message delivery each sit behind one replaceable function for the future AI
  service and server-side sender.
