# Implementation Plan: Lab Companion, Ask the Lab, Motion, and Messages

**Branch**: `feat/005-launch-readiness` (actual Git branch; 005 paused, 006 awaiting acceptance; all uncommitted — owner decides commits) | **Date**: 2026-10-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/007-lab-companion-motion/spec.md`

## Summary

Add the Probe orb companion that reacts to site activity, a scripted "Ask the lab" dialog
behind a replaceable answer source, a pausable ambient background and a set of delin.dev-style
motion techniques (reveal variants, scroll progress, timeline draw, tilt, packets, staggers),
and a message section that composes an email in the visitor's own app behind a replaceable
delivery function. No new dependency, no network calls, no stored data.

## Technical Context

**Language/Version**: Strict TypeScript `6.0.3`; Node.js `24.12.0`, npm `11.6.2`

**Primary Dependencies**: Existing pins only; native `<dialog>`, `requestAnimationFrame`,
`IntersectionObserver`, CSS scroll-driven animations (progressive).

**Storage**: `localStorage` (motion preference), `sessionStorage` (Probe seen sections);
typed content; knowledge built on the server.

**Testing**: lint, typecheck, build; 005/006 scripts unchanged; new `check-lab-knowledge.mjs`;
browser script extended from 006; Lighthouse; screenshot review.

**Target Platform**: Modern browsers; scroll progress where `animation-timeline` is supported.

**Project Type**: Single Next.js App Router website

**Performance Goals**: Lighthouse mobile ≥ 85 with motion on; CLS < 0.1; animation loops only
while needed; compositor-only ambient animation.

**Constraints**: Reduced motion disables all motion; pause control for ambient motion (WCAG
2.2.2); no custom cursor, robot, terminal, windows, purple; answers only from published
content; nothing transmitted.

**Scale/Scope**: ~9 new components/modules; 1 new homepage section; global layout additions.

## Constitution Check (2.0.0)

| Principle | Pre-research | Post-design |
| --- | --- | --- |
| I. Evidence-based content | Pass: answers and tips reuse content | Pass: knowledge built verbatim from published records; `check-lab-knowledge.mjs` enforces it; no draft |
| II. Visual identity | Pass: techniques only, no delin.dev motifs | Pass: Probe is an orb in project tokens; no robot, cursor, terminal, windows, purple |
| III. Accessible, immediate content | Conditional: continuous background motion | Pass: pause toggle (remembered), reduced motion disables all, content never hidden by default, dialog keyboard-complete, Probe button constant name |
| IV. Simple implementation | Pass: no dependency | Pass: small client components; replaceable source/delivery seams instead of frameworks |
| V. Specification-led | Pass: 006 implemented, awaiting acceptance (recorded); 005 paused | Pass |
| VI. Honest verification | Pass | Pass: quickstart; unrun → not run |
| VII. Release discipline | Pass: 0.5.0 at acceptance | Pass |
| VIII. Safe publication | Pass: nothing transmitted or stored | Pass: mailto only; no draft in knowledge; served-output re-run |

## Design Decisions

See [research](research.md).

- **Motion**: `src/components/motion/MotionProvider.tsx` (context, `data-motion`, spotlight
  vars), `MotionToggle.tsx`, `AmbientBackground.tsx` (server markup), head script in
  `layout.tsx`, `Tilt.tsx`; `Reveal` gains `variant`/`delay` and uses `useMotion()`.
- **Probe**: `src/components/lab/LabProbe.tsx` + DOM events; `ProjectConstellation` dispatches
  `lab:focus`, renders packets and step stagger; ids on nodes and steps.
- **Ask the lab**: `src/lib/lab-knowledge.ts` (server), `src/lib/lab-answer.ts` (`AnswerSource`,
  scripted source), `src/components/lab/AskLab.tsx` (dialog), `AskLabButton.tsx`.
- **Messages**: `src/lib/message-delivery.ts`, `src/components/profile/MessageSection.tsx`,
  `MessageForm.tsx`; Contact relabelled 07.
- **Styles**: one appended "007" block in `globals.css`.

### Requirement mapping

| Requirements | Design |
| --- | --- |
| FR-001–FR-006 | `LabProbe`, events from constellation/copy/message, section tips from page text |
| FR-007–FR-012 | `AskLab`, `AskLabButton`, `lab-knowledge`, `lab-answer` |
| FR-013–FR-017 | `AmbientBackground`, `MotionProvider`, `MotionToggle`, `Reveal`, `Tilt`, CSS |
| FR-018–FR-022 | `MessageSection`, `MessageForm`, `message-delivery` |
| FR-023 | Re-run 005/006 checks |
| FR-024, FR-025 | No dependency; acceptance task |

## Project Structure

```text
specs/007-lab-companion-motion/   plan, research, data-model, quickstart, contracts/ui.md,
                                  checklists/, tasks.md, verification.md, verification/
src/
  app/layout.tsx                  head script, MotionProvider, AmbientBackground, LabProbe, AskLab
  app/page.tsx                    MessageSection
  app/globals.css                 007 block
  components/motion/              MotionProvider, MotionToggle, AmbientBackground, Tilt (new)
  components/lab/                 LabProbe, AskLab, AskLabButton (new); Reveal, ProjectConstellation (updated)
  components/layout/              Header (toggle), SystemsLab (Ask button, probe attrs)
  components/profile/             MessageSection, MessageForm (new); sections (probe attrs, reveals); ContactSection (07)
  components/work/                ProjectStory/SelectedWork (Tilt, reveals)
  lib/                            lab-knowledge, lab-answer, message-delivery (new)
```

## Complexity Tracking

No violations. The continuous background is permitted by constitution III with the pause
control and reduced-motion opt-out; 006 FR-017 is superseded for the background only (spec
clarification).
