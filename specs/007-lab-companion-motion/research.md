# Research: Lab Companion, Ask the Lab, Motion, and Messages

Research date: 2026-10-26. Stack unchanged (`next@16.4.3`, `react@19.3.1`, TypeScript
`6.0.3`); no new dependency. Builds on feature 006's implementation.

## delin.dev techniques (reference, not copied)

Read from its public bundle (`/static/js/main.ae09d92b.js`, `/static/css/main.aeca65c2.css`):
a React app with Framer Motion (`layoutId`, `whileHover`); a hand-drawn SVG robot "pet"
driven by a `requestAnimationFrame` loop (pointer capture drag, airborne/dropping physics,
squash and stretch, perching via a `data-pet-perch` attribute on page elements, moods
idle/happy/curious, CSS keyframes `pet-blink`, `pet-breathe`, `pet-doze`, `pet-wave`),
disabled for coarse pointers and reduced motion; CSS keyframes `reveal-up/left/right/scale/
blur/clip`, `scroll-progress-grow`, `timeline-grow`, `typing-bounce`; pointer tilt on cards
(mouse only, reduced-motion aware). No AI service is called.

**Decision**: borrow the techniques (perch-and-spring companion, reveal variants, scroll
progress, timeline draw, typing indicator, pointer tilt); do not borrow the robot character,
its purple palette, the terminal desktop, windows, or any visual design (constitution II).

## Motion preference and the pause control

**Decision**: `MotionProvider` (client, in the root layout) owns the preference: `on` or
`paused`, saved in `localStorage` (`lab-motion`), session fallback. It writes
`data-motion="on|paused"` on `<html>`; a tiny inline head script applies a saved `paused`
before first paint so paused visitors never see motion start. Reduced motion always wins via
`prefers-reduced-motion` media queries. CSS gates every ambient and decorative animation with
`@media (prefers-reduced-motion: no-preference)` **and** `:root:not([data-motion="paused"])`.
`MotionToggle` (header button, `aria-pressed`) flips it. Components read `useMotion()` →
`{ active, paused, setPaused }`.

**Rationale**: WCAG 2.2.2 requires a pause for auto-moving content lasting over five seconds;
one attribute lets CSS-only animations obey it without JavaScript per effect.

## Ambient background

**Decision**: `AmbientBackground` (server markup, `aria-hidden`, fixed, `z-index: -1`,
`pointer-events: none`): the existing faint grid moves here; two slow "aurora" glows (teal,
cobalt) drifting via `transform` over 40–60 s alternating; six "signals" (short bright
gradients) travelling along grid lines with staggered delays (8–14 s); a pointer spotlight
(radial gradient at `--spot-x/--spot-y`, updated by `MotionProvider` on fine-pointer move
through `requestAnimationFrame`). Only `transform`/`opacity` animate (compositor-only; no
layout). Signals hidden below 46rem to save mobile CPU.

**Alternatives**: canvas particle field (continuous JS, battery cost); WebGL (dependency,
weight).

## Scroll progress

**Decision**: CSS scroll-driven animation (`animation-timeline: scroll(root)`) on a fixed 2 px
teal bar, inside `@supports (animation-timeline: scroll())`; unsupported browsers show nothing.
No JavaScript.

## Reveals, timeline, tilt, packet, stagger

- `Reveal` gains `variant` (`up | left | right | scale | clip`) and `delay`; it reads
  `useMotion().active` instead of the media query alone. Applied to homepage section headings,
  work cards (alternating left/right), experience roles, skill groups, about, message.
- Timeline: the experience role list gets a vertical rail (`::before`) that scales from 0 to 1
  when its `Reveal` reveals; role dots light in sequence.
- `Tilt` (client wrapper, children pass through): fine pointer + motion active only; sets
  `--tilt-x/--tilt-y` (≤ 6°) and `--spot-x/--spot-y` on pointer move via `requestAnimationFrame`;
  resets on leave. Used on work cards and the architecture panel; nodes get the spotlight only.
- Packet: on each selection the constellation renders an extra spoke overlay keyed by a
  selection counter; CSS animates `stroke-dashoffset` once (450 ms).
- Stagger: panel steps get `--i`; `.lab-panel-enter .lab-step` animates with
  `animation-delay: calc(var(--i) * 45ms)`.

## Probe companion

**Decision**: `LabProbe` (client, in the root layout): a fixed `button` named "Ask the lab"
containing a decorative SVG orb (ring, core, orbiting dot). Modes: `docked` (bottom-right),
`travelling`, `perched`, `resting` (after 30 s idle: dimmed), `dragged`.

- Travel is a critically damped spring (stiffness 170, damping 26) in one
  `requestAnimationFrame` loop that runs only while moving or anchored, and stops when the tab
  is hidden.
- Targets arrive as DOM events so the Probe stays decoupled: `lab:focus` (`{ selector, tip? }`)
  from `ProjectConstellation` (selected node `#lab-node-<slug>`, traced step `#lab-step-<i>`),
  `lab:celebrate` from `CopyEmailButton` and `MessageForm`. Section tips come from its own
  `IntersectionObserver` over `[data-probe-section]` elements; the tip text is the section's
  own intro sentence read from the page (`[data-probe-tip]`), so it never states anything new;
  seen sections are stored in `sessionStorage`.
- Placement: beside the target's text box (a DOM `Range` over the label gives the text's right
  edge), else left of the target, else docked if the target is off-screen or the result would
  overlap the main column.
- Drag: pointer capture; > 4 px movement starts a drag and suppresses the click; release
  springs back to the current target.
- Allowed to travel only with `(hover: hover) and (pointer: fine)`, motion active, width ≥
  52rem, and no open dialog; otherwise docked. Rendered only after hydration (no dead button
  without JavaScript).
- Accessibility: the tip bubble is `aria-hidden` (it repeats on-page text); the button name is
  constant; movement never moves focus.

## Ask the lab

**Decision**:

- Knowledge built on the server in `src/lib/lab-knowledge.ts` from published content only:
  `LabTopic { id, label, keywords, paragraphs, links }`. Topics: `about` (profile about),
  `experience` (roles: title, organization, dates), `skills` (groups), `contact` (email,
  LinkedIn, GitHub, résumé), `unfinished` (every unfinished/implemented-code-path claim and
  flow step across published projects, with labels), one per published project (summary,
  contribution claim, stack, first limitation, source status). Text is copied verbatim from
  content; only short interface labels ("Stack:", "Unfinished:") are added.
- Answer source interface `AnswerSource { answer(question: string): Promise<LabAnswer> }`;
  `createScriptedSource(topics)` scores keyword hits (tokenised, lower-cased, simple plural
  folding) and returns the best topic or a fallback listing topic labels. A future AI source
  implements the same interface (e.g. calling a server route) — `AskLab` does not change.
- `AskLab` (client): native `<dialog>` with `showModal()` (inert background, Escape closes);
  focus returns to the opener explicitly; suggested-question buttons; a labelled input (1–300
  characters) and Send; conversation `role="log"` + polite live region; typing indicator for
  700 ms when motion is active; keeps the latest 20 messages; footnote "Answers are scripted
  from this site's content — no AI service is used yet."
- Openers dispatch `lab:ask` (`{ opener }`): the Probe and an `AskLabButton` in the hero
  (hydration-only).

## Message section

**Decision**: `MessageSection` (server, `#message`, label "06 / Message") with `MessageForm`
(client). Fields per FR-018 with `noValidate` and custom validation (`aria-invalid`,
`aria-describedby` errors, focus first error, polite error summary). Delivery through
`src/lib/message-delivery.ts`: `deliverMessage(draft) → { kind: "mailto", href, text }`
building `mailto:<email>?subject=…&body=…` (encoded); the form opens it via a temporary
anchor click, then shows a confirmation with Copy message and the plain address. A future
`kind: "sent"` server implementation can replace it. No-JS fallback: the form's `action` is the
same `mailto:` with `method="post"` and `encType="text/plain"`, plus the visible address link.
Nothing is sent to any server.

## Verification

Extend 006's browser script with: `probe` (desktop: docked on load, travels to the selected
node within 1.5 s, moves for trace steps, drag and settle; touch/reduced/paused: docked),
`askLab` (open by Probe click, hero button, Enter; every suggested question answered with a
link; typed match; fallback; Escape returns focus; no draft text), `motionPause` (toggle →
0 running ambient animations, Probe docked, persisted after reload), `messageForm`
(invalid → errors + focus; valid → exact mailto captured via an init-script hook on anchor
clicks; confirmation), `scrollProgress` (bar present when supported). New
`check-lab-knowledge.mjs`: every answer sentence appears verbatim in `src/content`, no draft
slug or title. Re-run all 005/006 checks and Lighthouse.
