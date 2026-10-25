# Research: Portfolio Foundation

Research date: 2026-10-25. The exact versions below were verified against official
package/framework sources, installed, and resolved into `package-lock.json`.
`npm ci` succeeded. The installed dependency set is recorded in
`package.json` and the lockfile.

## Framework and runtime

**Decision**: Plan `next@16.4.3`, `react@19.3.1`, and `react-dom@19.3.1`, on the installed
Node.js `24.12.0`. Use App Router, static Server Components for copy and shell, and small
Client Components only for enhanced menu behavior and flow stepping.

**Rationale**: [Next's installation guide](https://nextjs.org/docs/app/getting-started/installation)
requires Node.js 20.9 or newer. [Next 16.4.3 package metadata](https://github.com/vercel/next.js/blob/v16.4.3/packages/next/package.json)
declares React 19 compatibility. The planned patch versions appear in the official
[Next package](https://www.npmjs.com/package/next?activeTab=versions),
[React package](https://www.npmjs.com/package/react?activeTab=versions), and
[React DOM package](https://www.npmjs.com/package/react-dom?activeTab=versions) listings.
The local Node version satisfies the published minimum.

**Alternatives considered**: A multi-app setup or runtime content service adds
complexity without serving this static release; an older framework patch gives no
identified benefit. Installation will recheck package availability and peer resolution.

## Styling and typography

**Decision**: Plan `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`, and
`postcss@8.5.31`; define semantic tokens for canvas `#F5F2EB`, ink `#17212B`,
copper `#B44E30`, quiet surface, and restrained teal `#176B62` for diagrams.
Use Manrope for headings and Source Sans 3 for body, with local/system sans fallbacks,
normal text sizing, generous line height, and a bounded reading width. Load via
`next/font/google` with `display: swap`; it self-hosts fonts in the generated site.

**Rationale**: [Tailwind's Next.js guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
uses the PostCSS plugin. Package versions are listed by
[Tailwind](https://www.npmjs.com/package/tailwindcss?activeTab=versions),
[its PostCSS plugin](https://www.npmjs.com/package/%40tailwindcss/postcss), and
[PostCSS](https://www.npmjs.com/package/postcss?activeTab=versions).
[Next font documentation](https://nextjs.org/docs/app/api-reference/components/font)
describes build-time download and self-hosting. Manrope and Source Sans 3 have
[open font licenses](https://github.com/google/fonts/blob/main/ofl/manrope/METADATA.pb)
and [Source Sans 3 metadata](https://github.com/google/fonts/blob/main/ofl/sourcesans3/METADATA.pb).
The build needs font download access; if unavailable, use checked-in, licensed font
assets or system fallbacks rather than making runtime browser font requests.

**Alternatives considered**: A UI component kit and animation package are unnecessary.
Pure system fonts remove the build download but give less reliable editorial hierarchy.
Copper is an accent, not assumed to be accessible small text; verify contrast in context.

## Type safety and linting

**Decision**: Use `typescript@6.0.3`, `@types/react@19.3.0`,
`@types/react-dom@19.3.0`, `@types/node@24.19.2`, `eslint@10.13.0`, and
`eslint-config-next@16.4.3`. Enable strict TypeScript and use the ESLint CLI.

**Rationale**: [Next's package](https://github.com/vercel/next.js/blob/v16.4.3/packages/next/package.json)
uses TypeScript 6 internally. [Next maintainers](https://github.com/vercel/next.js/discussions/95633)
describe TypeScript 7 support as experimental, so the newer major is deferred. The
[ESLint support table](https://eslint.org/version-support/) marks ESLint 9 end-of-life
on 2026-08-06; use the current `eslint@10.13.0`. Next.js 16.4's
[ESLint configuration](https://nextjs.org/docs/app/api-reference/config/eslint)
supports ESLint 10, though some bundled plugin peer ranges may still emit warnings.
`npm ci` succeeds with npm peer override warnings for bundled `eslint-plugin-import`,
`eslint-plugin-jsx-a11y`, and `eslint-plugin-react` peer ranges; the project's ESLint
configuration runs successfully with ESLint 10. Versions appear in the official
[TypeScript](https://www.npmjs.com/package/typescript?activeTab=versions),
[ESLint](https://github.com/eslint/eslint/releases),
[React types](https://www.npmjs.com/package/%40types/react?activeTab=versions),
[React DOM types](https://www.npmjs.com/package/%40types/react-dom?activeTab=versions), and
[Node types](https://www.npmjs.com/package/%40types/node?activeTab=versions) listings.

**Alternatives considered**: TypeScript 7 requires compatibility work not justified
by this feature. Do not add a test runner solely to mirror static copy; use build,
type, lint, and meaningful browser checks.

## Navigation, diagram, and no-JavaScript behavior

**Decision**: Use a native mobile disclosure for Home and Approach, enhanced by a small
Client Component to close on Escape and after link selection. Render links in its HTML
so the disclosure still works without JavaScript. Use a small Client Component for
diagram selection and an explicit `Trace the flow` / `Next step` control. Render all
stage labels and responsibilities as ordinary text in initial HTML. Represent the
illustration with SVG/HTML and use short CSS transitions, disabled under reduced motion.

**Rationale**: Native controls give keyboard and no-JavaScript behavior. Static text
preserves the explanation if optional stepping fails. Three generic stages—Input,
Process, Result—avoid unverified claims about any featured project. The control has
selected state in words and accessibility semantics, not color alone.

**Alternatives considered**: A full-screen mobile overlay, scripted navigation-only
rendering, or an animation library adds failure modes and unnecessary dependency cost.

## Verification approach

**Decision**: During implementation, use `npm ci`, lint, strict typecheck, and a
production build, then manually check real navigation, diagram states, no-JavaScript
content, keyboard focus, reduced motion, contrast, 200% zoom, and 390/768/1440 pixel
layouts. Record actual results and limitations in the feature review.

**Rationale**: These checks directly exercise the specification's acceptance criteria;
automated accessibility reports alone cannot establish usability or visual distinction.

**Alternatives considered**: Unit tests that restate static configuration would add
maintenance without proving visitor behavior. Add targeted automation only if a
meaningful failure pattern warrants it.
