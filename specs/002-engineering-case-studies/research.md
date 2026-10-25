# Research: Engineering Case Studies

Research date: 2026-10-25. Builds on [001 research](../001-portfolio-foundation/research.md);
the installed stack (`next@16.4.3`, `react@19.3.1`, `tailwindcss@4.3.3`, TypeScript
`6.0.3`, Node.js `24.12.0`) is reused unchanged. Framework behavior below was checked
against the docs bundled with the installed package (`node_modules/next/dist/docs`).

## Case-study content format

**Decision**: Author case studies as typed TypeScript records in `src/content/`, one file
per project, rather than Markdown/MDX. No new dependency.

**Rationale**: The spec fixes nine required sections (FR-006) and per-claim status labels
(FR-013). A typed record makes a missing section or unknown status a type error, and lets
each claim carry evidence IDs for SC-003 traceability. Copy is short-to-medium length, so
MDX's prose ergonomics are not needed. Constitution IV asks each dependency to solve a
documented requirement; none is left for MDX.

**Alternatives considered**: `@next/mdx` with frontmatter (the build guide's suggestion):
adds packages and config, and section/claim structure would need a separate schema check.
Can be revisited if a later writing section needs long prose.

## Routes, 404, and draft exclusion

**Decision**: `src/app/work/[slug]/page.tsx` exports `generateStaticParams()` returning only
published slugs and `export const dynamicParams = false`. The page also calls `notFound()`
if the lookup misses. A root `src/app/not-found.tsx` offers links to `/work` and `/`.

**Rationale**: Per the bundled `generate-static-params.md`, with `dynamicParams = false`
"only paths provided by `generateStaticParams` will be served, and unspecified routes will
404". Drafts are never passed to it, so they are never prerendered or served. `params` is
a `Promise<{ slug: string }>` in Next 16 (`dynamic-routes.md`).

**Slug variants**: Only exact lowercase slugs match. Mixed-case variants are not generated
and return 404. Trailing slashes follow the Next.js default (`trailingSlash: false`): a
permanent redirect to the slash-less path. Neither path can expose a draft. This resolves
the low-impact item left Outstanding by clarify.

**Alternatives considered**: Middleware lowercasing or redirects: extra moving part for a
case no visitor needs.

## Draft projects and Meridian

**Decision**: The `Project` type supports `status: "draft" | "published"`, and every public
surface reads through one `publishedProjects` selector. No Meridian record is added to
source: no reviewed evidence exists (constitution I, VIII), and its absence is the
strongest exclusion.

**Rationale**: Keeping a placeholder record with no evidence adds nothing visitors can see
and risks leaking the name into bundles. The draft path is exercised by type checks and by
requesting `/work/meridian` (404) along with other invented slugs.

## Diagrams

**Decision**:
- Notification Platform: `ArchitectureDiagram` Client Component with component selection,
  reusing `FlowDiagram`'s pattern (server-rendered text, `useSyncExternalStore` to enable
  controls after hydration, `aria-pressed` buttons, polite live region). `FlowDiagram`
  itself is not changed.
- Resume Analyzer: server-rendered static `PipelineDiagram` (SVG + ordered list).
- User Management API: server-rendered static `DataModelDiagram` (SVG + entity list).
- Homepage previews: compact static variants of the same three components, so the three
  previews differ in kind (pipeline, architecture, data model).

**Rationale**: Clarification answer 3. Static diagrams need no client JavaScript; one
interactive diagram keeps the signature interaction while limiting client code. Every
diagram's text equivalent comes from the same data that draws it, so they can't drift.

**Alternatives considered**: A generalized diagram library or graph-layout package:
unnecessary for three hand-laid diagrams. Generalizing `FlowDiagram`: would rewrite
accepted v0.1.0 code (FR-018).

## Navigation across routes

**Decision**: Navigation hrefs become route-absolute: Home `/`, Work `/#work`, Approach
`/#approach`; the brand link becomes `/`. The homepage gains a `#work` section between the
hero and Approach.

**Rationale**: The current `#home`/`#approach` hrefs only work on `/`; on `/work/...` they
would be dead links (FR-015, SC-004). Route-absolute hashes work from every page and still
scroll in place on `/`. `MobileNav`'s focus-after-navigation logic reads the URL hash and
already tolerates a missing target.

## Source review method

**Decision**: During implementation, shallow-clone each recorded repository
(`git clone --depth 1`) into a fresh, empty directory in the session scratchpad. Record
`git rev-parse HEAD` as the reviewed commit, read the relevant files, and update
`docs/project-evidence.md` with commit, date, reviewer, file paths, and claim IDs.
Nothing from the clones is executed, installed, or copied into this repository.

**Rationale**: Clarification answer 4. `gh` is not installed; plain Git is
(`2.37.1.windows.1`). A clone gives an exact commit hash. Treating the clones as untrusted
data, and never running their code, keeps the review read-only.

## Verification tooling

**Decision**: Reuse 001's approach: `playwright-core` installed in a temp tools directory
outside the app, driving the installed Chrome, with a feature script at
`specs/002-engineering-case-studies/verification/run-browser-checks.mjs`. HTTP status
checks use `curl` against `next start`.

**Rationale**: No test dependency enters `package.json` (constitution IV). Status codes
must be checked against a production server, not `next dev`.

## Release and version

**Decision (clarified 2026-10-25)**: No `CHANGELOG.md` is created in this feature; it is
deferred to feature 003. `package.json` stays at `0.1.0` so package version and changelog
do not diverge; feature 002 records its own acceptance, but v0.2.0 is not an accepted
release until version and changelog agree in feature 003. No tag, push, or deployment is
planned here.
