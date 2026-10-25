# UI Contract: Portfolio Foundation

This contract describes observable page behavior for v0.1.0. It exposes no public API.

## Routes and destinations

| Destination | Availability | Expected content |
| --- | --- | --- |
| `/` | Available | Identity, hero, flow, and page shell |
| `/#approach` | Available | Engineering approach and illustrative flow |
| Work, Experience, About, Contact, résumé | Unavailable in v0.1.0 | No visible action or dead destination |

Every visible link lands on content that exists in this release. The brand/Home link
returns to the top of `/`. The hero action `Explore the flow` targets `/#approach`.

## Navigation

- On wide screens, Home and Approach are visible as text links.
- On narrow screens, a native `Menu` disclosure controls a collapsible list of those links.
  Its summary has an accessible name, expanded/collapsed state, and visible focus. The links
  remain available through the disclosure without JavaScript.
- Opening the menu does not move focus unexpectedly. With enhancement active, Escape closes
  it and restores focus to `Menu`; choosing a link closes it and reaches the destination.
  Tab and Shift+Tab follow a logical order without a focus trap.
- The mobile breakpoint is content-driven; verify both sides of it and 390, 768, and
  1440 pixel widths. At 200% zoom, no essential label is clipped.

## Illustrative flow

- The visual and adjacent text carry the visible label `Illustrative flow`. A short
  description states that it explains a possible system pattern, not live telemetry.
- Input, Process, and Result appear in the same order in the visual, static text, and
  step control. Each has a readable responsibility in ordinary page content.
- `Trace the flow` selects Input. `Next step` selects Process, then Result, then Input.
  An individually selectable stage identifies the same active stage. Selected state is
  conveyed by text and programmatic state as well as visual styling.
- The current-stage detail updates when selection changes. The static explanation never
  disappears. Keyboard activation uses native Enter/Space behavior, with no custom
  directional-key requirement.
- With reduced motion, stage changes are immediate. Without JavaScript, the entire
  static explanation and diagram labels remain readable; optional controls may be absent.

## Visual and content constraints

Use the Engineering Journal palette and editorial hierarchy from `docs/design-direction.md`.
Verify actual text, focus, and control contrast against their backgrounds. Essential
content is present in the initial page response. No boot sequence, terminal metaphor,
purple palette, robot, editor windows, file explorer, or custom cursor is permitted.
Public text must not include unsupported personal claims or Meridian material.
