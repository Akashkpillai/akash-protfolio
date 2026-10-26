# Design direction — Akash / Systems Lab

Current direction, adopted 2026-10-26 at the owner's request (feature 006; constitution
2.0.0, principle II). It replaces "The Engineering Journal" direction of 2026-10-25, which
features 001–005 followed; their specs keep that history.

## Concept

An interactive developer workspace where visitors explore how real backend and AI systems
work. It must feel original and personal: identity comes from the projects' real
architecture, explained honestly, not from decoration.

## Visual language

| Role | Direction |
| --- | --- |
| Canvas | Deep graphite / near-black `#0D1116`; surfaces `#131A21`, `#18212A` |
| Primary text | Warm off-white `#F1EBE2` |
| Secondary text | `#AAB4BC`; labels `#8695A0` |
| Accents | Electric teal `#2FD3C4`, cobalt `#6F9BFF`, restrained copper `#DE8A5F`; a fourth, sand `#D9C27A`, only to tell projects apart |
| Geometry | Thin grid lines, orbit and connector lines from system diagrams |
| Glow | Sparing: hover, focus, selection, and the central "AK" node only |
| Type | Manrope (display, uppercase tracked labels), Source Sans 3 (body) |
| Theme | Dark only |

Values are tokens in `src/app/globals.css`; contrast is checked on the rendered pages, not
assumed from the palette.

## Composition

- Navigation: brand "AKASH / SYSTEMS LAB"; Work, Experience, About, Contact, and Resume when
  the approved PDF exists. Accessible disclosure menu on narrow screens.
- Hero (two columns on wide screens since feature 008): role, name, one plain sentence on
  what Akash builds, "View selected work" and "Resume PDF" (primary) and "Ask the lab"
  (secondary); beside it the map of published projects around an "AK" node, above a compact
  selected-project summary whose flow opens from "Explore architecture" (collapsed on load).
  The headline "Backend systems. Practical AI. Thoughtfully built." remains the site's default
  description, not hero text.
- The owner's "current focus" statements sit in About — never presented as monitoring data.
- Work as "Built to solve real problems": each card leads with the problem, what the project
  does, and "My contribution" (existing records, verbatim); HRMS and Meridian featured,
  Notification Platform and Resume Analyzer compact; evidence line and explanatory preview
  kept. Experience, skills, about, and one contact section (links and the message form)
  follow.
- Case studies: a sticky system summary that marks the section being read; sections may
  reveal gently.

## Honesty rules for diagrams

Every flow step cites evidence in [project evidence](project-evidence.md). Panels and
previews are labelled explanatory, not live data. Unfinished or unexercised paths carry the
same labels as the case studies. No fake metrics, live-status indicators, invented
screenshots, or demo buttons without a checked flow.

## Motion

Purposeful only: node hover and focus glow, selection and panel transitions, user-driven flow
tracing, section reveals, small hover transitions. The only continuous motion is the pausable
ambient background (feature 007); nothing blocks reading or shifts layout. Reduced motion removes all of it; every state has a static
equivalent, and essential text is present without JavaScript.

### Added in feature 007 (2026-10-26)

- **Probe**: an orb companion (teal ring, core, one orbiting dot; no face or robot features)
  that settles on the selected project, follows a traced flow, visits section labels once per
  visit with a tip taken from the page, can be dragged, rests after 30 s, and opens Ask the
  lab. It travels only with a fine pointer, motion on, and a wide screen; otherwise it is a
  docked button.
- **Ask the lab**: a dialog answering from the site's own published content (no AI service
  yet; the answer source is replaceable). It names no organization, because it ships with
  case-study pages.
- **Ambient background**: drifting glows, signals along the grid, a pointer spotlight. It runs
  continuously, so a visible **Pause motion** control (remembered) is required (WCAG 2.2.2);
  reduced motion removes it entirely.
- **Effects**: scroll progress, varied reveals, timeline draw, card tilt and spotlight, packet
  along the selected spoke, staggered panel steps, typing indicator.
- **Messages**: a form that composes an email in the visitor's own app; nothing is stored or
  sent by the site (a server sender can replace it later).

- **3D orbit (Revision 2)**: the AK node is a sun and projects are planets revolving on a tilted
  orbit (nearer = larger); it holds still under the pointer, with focus inside, after a
  selection, and with motion paused or reduced. The Probe is a lit CSS 3D sphere with a ring and
  moon, and floats, pings, hops, stretches, squashes, can be thrown, dozes, and rides planets.
- **Robot-eye Probe (Revision 3, owner request)**: the orb became a single mechanical eye (lens,
  copper bezel, teal aperture iris, shutter lids) that blinks at random, looks where it travels
  or at the pointer, glides at no more than 450 px/s, and roams between headings in view instead
  of waiting in the corner. No face, body, or limbs. Docked behaviour is unchanged.
- **Entrance (Revision 4)**: on the first homepage view per session, with motion on, the real
  page "powers on" in about 2.5 s: scan line and grid draw, the name lights letter by letter,
  the sun and planets power on, the eye opens large at the centre and glides off. No overlay,
  splash screen, or skip button: everything is usable from the first frame; text never starts
  fully transparent; reduced motion, the pause, and no-JavaScript skip it.

### Calmer motion (feature 008, 2026-10-26)

- The Probe wanders only occasionally (Revision 1, owner request): after a long rest (first
  trip 12–16 s after it settles, then 18–30 s) it drifts at no more than 200 px/s to a free spot
  beside a visible heading or project-card title, never over text, links, or controls. It does not
  wander while the visitor types, while Ask the lab is open, while it is dragged, while a selection
  or traced step holds its attention (and 15 s after), while it dozes, or in a hidden tab; never on
  touch, with reduced motion, or with motion paused. It still follows selections and traces, shows
  each section's tip once per visit (only for sections the visitor scrolls to), can be dragged,
  blinks, and opens Ask the lab.
- Project cards tilt subtly under a mouse (Revision 1): at most ±2°, deep perspective, quick
  follow and a gentle settle; no scaling or spotlight; never on touch, with reduced motion, with
  motion paused, or from keyboard focus.
- Removed: the card spotlight, the entrance scan line, three of the six grid signals, and the
  varied reveal styles (one gentle rise remains). Kept: orbit, glows, pointer spotlight, scroll
  progress, timeline draw, packet, flow-step stagger, typing indicator, the entrance, and the
  pause control.

Borrowed from delin.dev as techniques only; its robot, terminal, windows, cursor, and palette
remain excluded.

## Responsive behaviour

Desktop: two-column hero (introduction; map above the summary). Tablet: introduction across
the top, then map beside summary. Phone: single column, projects as four compact selectors in
two columns, summary below with the flow collapsed, no horizontal scrolling, targets at least
44 px. Verified at 390, 768, 1440 px (feature 008; 200% zoom last checked in features 005/007).

## Explicit differentiation

Do not copy delin.dev or any other site. No terminal desktop or boot sequence, purple
cyberpunk palette, robot mascot, overlapping editor windows, file explorer, custom cursor,
browser frame, generic dashboard look, or cluttered code-editor windows.
