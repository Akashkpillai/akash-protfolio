# Implementation Plan: Portfolio Foundation

**Branch**: `feat/001-portfolio-foundation` | **Date**: 2026-10-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-portfolio-foundation/spec.md`

**Note**: The setup script reported `001-portfolio-foundation` from Spec Kit context.
The actual Git branch above was independently verified.

## Summary

Plan a single responsive homepage for v0.1.0: immediately readable identity and role,
working Home/Approach navigation, and an explicitly illustrative three-stage system flow
with complete static text. Use Next.js App Router Server Components for the shell, hero,
and content. Keep Client Components small: one for native mobile disclosure enhancement
and one for optional diagram stepping. The design follows The Engineering Journal and
leaves later content and unavailable actions out of this release.

## Technical Context

**Language/Version**: Strict TypeScript `6.0.3`; Node.js `24.12.0` observed locally

**Primary Dependencies**: Planned exact pins: `next@16.4.3`, `react@19.3.1`,
`react-dom@19.3.1`, `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`,
`postcss@8.5.31`, `eslint@10.13.0`, `eslint-config-next@16.4.3`,
`@types/react@19.3.0`, `@types/react-dom@19.3.0`, `@types/node@24.19.2`.
These exact pins are installed and recorded in `package-lock.json`; `npm ci` succeeded.
npm reports peer-range warnings from bundled Next.js ESLint plugins under ESLint 10;
the configured lint command passes. See [research.md](research.md).

**Storage**: Typed local profile and flow data; no database or runtime content service

**Testing**: ESLint CLI, strict typecheck, production build, and browser review of
navigation, static content, keyboard behavior, reduced motion, contrast, and responsive
layouts. Add targeted automation only for behavior that merits it.

**Target Platform**: Modern desktop and mobile browsers; Node.js 20.9+ for build/runtime

**Project Type**: Single Next.js App Router website

**Performance Goals**: Identity and headline visible on first response with no intro;
no dependency on client interaction to read essential content. Keep diagram and client
code small; measure actual results during implementation rather than promise scores.

**Constraints**: No horizontal scrolling at 390/768/1440 pixel widths or 200% zoom;
working visible links only; reduced-motion equivalent; no JavaScript still exposes
identity, links, labels, and all explanations. No database, authentication, CMS, LLM,
or runtime GitHub dependency.

**Scale/Scope**: One homepage and Approach section; no case-study routes, detailed
experience/about/contact, résumé, or deployment in this feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Pre-research gate | Post-design review |
| --- | --- | --- |
| Evidence-based content | Pass: only working identity/role and generic flow planned | Pass: provisional role/headline recorded in [data model](data-model.md); publication confirmation required |
| Distinct visual identity | Pass: Engineering Journal palette and editorial layout planned | Pass: semantic tokens, typography, asymmetry, and prohibited motifs specified |
| Accessible, immediate content | Pass: static content and keyboard requirements in spec | Pass: native disclosure, static flow text, focus, contrast, and reduced motion in [UI contract](contracts/ui.md) |
| Simple implementation | Pass: one app, local content, minimal interaction | Pass: no new service or animation/UI library; dependency purposes in [research](research.md) |
| Specification-led development | Pass: feature spec exists; branch and active feature verified | Pass: requirements map to design and [quickstart](quickstart.md); tasks deferred |
| Honest verification | Pass: measurable success criteria exist | Pass: runnable checks and manual review defined; none claimed as run |
| Release discipline | Pass: v0.1.0 target follows roadmap | Pass: npm lockfile and version alignment planned; no release or deployment implied |
| Safe publication | Pass: missing actions and drafts excluded | Pass: publication gate and no fabricated assets/copy specified |

No gate violation or unresolved technical clarification remains. Public release is
blocked until the owner confirms the provisional professional wording against the
current résumé. The v0.1.0 implementation can proceed as an unpublished preview.

## Design Decisions

### Components and content

`src/app/layout.tsx` stays a Server Component with metadata, fonts, and the shared header.
`src/app/page.tsx` composes the server-rendered hero and Approach section containing the
static explanation and interactive flow. `src/content/profile.ts` holds the single typed
profile record; its role and headline are marked provisional in internal documentation.
`src/content/navigation.ts` holds the shared Home/Approach navigation model, and
`src/content/flow.ts` holds ordered stage names and responsibilities. The same stage
records feed visual labels, static explanations, and interactive details to prevent drift.

`Header.tsx` and `Hero.tsx` render static content. `MobileNav.tsx` is a small Client
Component enhancing a native disclosure: Home and Approach links remain usable without
JavaScript, and enhancement closes on Escape or selection with sensible focus restoration.
`FlowDiagram.tsx` is a small Client Component for stage selection and trace controls. It
renders labels and full explanatory text in initial HTML; controls appear after hydration.
No Client Component wraps the whole page.

### Visual system and responsive behavior

Tailwind v4 semantic tokens name the canvas, surface, ink, copper accent, diagram teal,
focus indicator, spacing, and typography roles. Plan canvas `#F5F2EB`, ink `#17212B`,
copper `#B44E30`, and diagram teal `#176B62`. Check actual contrast for every text,
control, and focus pairing. Use Manrope headings and Source Sans 3 body, both with
system sans fallbacks; load via `next/font/google` with swap. Limit reading width and
keep technical labels in a modest monospace treatment.

The hero is asymmetric on roomy screens: identity/copy left, diagram or explanatory
preview right. On narrow screens it stacks in reading order, with the name and headline
first. Use content-driven breakpoints; review 390, 768, and 1440 pixel widths and 200%
zoom. Mobile navigation is a compact native disclosure with a visible `Menu` summary
and two text links. Desktop displays the links directly. No overlay, boot sequence,
terminal desktop, purple palette, robot, editor windows, file explorer, or custom cursor.

### Flow interaction and accessible states

The generic Input → Process → Result flow is labeled `Illustrative flow` and explicitly
described as an example rather than live telemetry. The static explanation names each
stage and responsibility in source order. Interaction starts idle. `Trace the flow`
selects Input; `Next step` advances Process → Result → Input. Direct selection of a
stage updates the same selected state. State is conveyed by active-stage text and
programmatic selection as well as styling. Native controls support Enter/Space, have
accessible names, and show focus. No essential information depends on hover or color.
CSS transitions are short and nonessential; reduced-motion preference makes changes
immediate. If JavaScript is disabled, labels, links, and all text remain available.

### Scaffolding and release boundaries

During implementation, scaffold into this repository without overwriting `.specify/`,
`.agents/`, `docs/`, `specs/`, or the existing `.gitignore`. Use npm, exact planned
versions, and commit `package-lock.json`; check actual installed versions and peer
resolution. `package.json` may target `0.1.0`, but display a release version only when
package and changelog are consistent with an accepted release. No draft Meridian or
unverified project claim enters routes, metadata, or generated assets. Work, profile,
contact, résumé, and changelog features remain deferred.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-foundation/
  spec.md
  checklists/requirements.md
  plan.md
  research.md
  data-model.md
  contracts/ui.md
  quickstart.md
  tasks.md                 # Later $speckit-tasks output; not created here
```

### Source Code (repository root; planned, not created)

```text
package.json
package-lock.json
postcss.config.mjs
eslint.config.mjs
tsconfig.json
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    layout/
      Header.tsx
      MobileNav.tsx
      Hero.tsx
    diagrams/
      FlowDiagram.tsx
  content/
    profile.ts
    navigation.ts
    flow.ts
```

**Structure Decision**: A single App Router application places verified local content
apart from presentation. Static layout and copy remain server-rendered. Only the menu
enhancement and diagram stepping cross the client boundary. Existing planning and Spec
Kit directories stay at the repository root.
