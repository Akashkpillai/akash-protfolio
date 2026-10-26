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
- Hero (three parts on wide screens): introduction (name, role, headline "Backend systems.
  Practical AI. Thoughtfully built.", honest intro, "Explore systems", "Resume"); a map of
  published projects around an "AK" node; an architecture panel for the selected project.
- A "current focus" strip of the owner's statements — never presented as monitoring data.
- Work as system previews; experience, skills, about, and contact follow.
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

Borrowed from delin.dev as techniques only; its robot, terminal, windows, cursor, and palette
remain excluded.

## Responsive behaviour

Desktop: three-part hero. Tablet: two columns with the panel below the map. Phone: single
column, projects as large selectable cards, panel below, no horizontal scrolling, targets at
least 44 px. Verified at 390, 768, 1440 px and 200% zoom.

## Explicit differentiation

Do not copy delin.dev or any other site. No terminal desktop or boot sequence, purple
cyberpunk palette, robot mascot, overlapping editor windows, file explorer, custom cursor,
browser frame, generic dashboard look, or cluttered code-editor windows.
