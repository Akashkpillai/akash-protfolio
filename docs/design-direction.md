# Design direction — The Engineering Journal

Planning baseline: 2026-10-25, derived from [the build guide](portfolio-build-guide.md). This is an implementation brief, not a claim that a UI has been built or visually tested.

## Visual language

Present an editorial collection of engineering work: expressive headings, comfortable reading, generous space, numbered project stories, and wide previews. Give each story a composition suited to its system; avoid an interchangeable card grid.

| Role | Direction |
| --- | --- |
| Canvas | Warm ivory `#F5F2EB`; quiet off-white sections |
| Primary text | Ink `#17212B` |
| Primary accent | Copper `#B44E30`, used sparingly |
| Diagram accent | Restrained teal `#176B62` |
| Headings | Large expressive sans-serif |
| Body | Comfortable sans-serif with readable line length |
| Technical labels/code | Monospace in limited use |
| Layout | Asymmetric hero, generous whitespace, wide evidence previews |

Translate the palette into semantic CSS tokens. Check actual contrast for each text/background/focus pairing; palette selection does not establish compliance. Choose fonts and confirm licensing and loading strategy during feature planning; no font family is fixed here.

## Composition and navigation

Hero left: identity, “Backend systems. Practical AI. Thoughtfully built.”, short positioning, View Work, and a résumé action only when the real PDF exists. Hero right: a lightweight system-flow explanation labeled **illustrative flow**, never live telemetry.

Simple text navigation: Work, Experience, About, Contact, plus a visible résumé action when available. At each release, render only functional destinations; incomplete sections cannot leave dead anchors. Links from case studies must reach the relevant homepage section. Mobile navigation must remain keyboard operable with clear open/closed states if collapsible navigation is selected in feature 001.

Homepage sequence: hero → selected work → engineering approach → experience → personal story → contact → version/changelog footer. Keep critical content visible immediately with no intro gate.

## Three distinct project stories

1. **Resume Analyzer:** a genuine sanitized screenshot when supplied, or an explicitly explanatory PDF → extraction → cleanup → parsing/fallback → structured record diagram. Use fictional résumé data.
2. **Notification Platform:** a gateway, Kafka broker, router, email/SMS workers, and database diagram. Distinguish implemented retry/dead-letter paths from unverified complete operation. Push is unfinished; never depict it as a working delivery channel.
3. **User Management API:** a compact relational diagram or fictional request/response excerpt. Explain roles and relations without unsupported security guarantees.

Missing screenshots fall back to honest diagrams. Do not invent product screens and present them as captured evidence. See [project evidence](project-evidence.md) for allowed claims.

## Signature interaction and accessibility

Selecting a diagram node reveals its responsibility. An optional explicit “Trace the flow” control steps through an explanation; essential information is also available as static text. Define selected state, keyboard controls, reading order, focus treatment, and accessible names in the feature spec. No hover-only information or color-only meaning.

Use short transitions and subtle reveals. Honor reduced motion with static or immediate state changes that preserve the complete explanation. Essential text remains available if animation or optional JavaScript fails. Avoid automatic motion that competes with reading.

On mobile, use vertical document flow, stacked diagrams, readable labels, large touch targets, and no horizontal scrolling. Review 390, 768, and 1440 pixel widths during launch readiness, plus content-driven breakpoints as needed. Inspect screenshots and real keyboard behavior; do not substitute automated scores for visual/accessibility review.

## Explicit differentiation

Do not copy delin.dev's terminal desktop, purple palette, robot mascot, overlapping editor windows, file explorer, custom cursor, or boot sequence. The portfolio's identity comes from typography, evidence, and explanatory systems diagrams.

## Unresolved design inputs

Current résumé and professional copy, approved screenshots, fonts, precise responsive navigation behavior, and diagram interaction details remain to be supplied or resolved in the appropriate feature spec. Personal images are optional; absence must not block honest layouts. [Content needed](content-needed.md) records publication gates.
