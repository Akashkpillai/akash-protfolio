# Research: Launch Readiness

Research date: 2026-10-25. Stack unchanged from 001–004 (`next@16.4.3`, `react@19.3.1`,
`tailwindcss@4.3.3`, TypeScript `6.0.3`, Node.js `24.12.0`, npm `11.6.2`); no new
application dependency. Starting commit `0e1cd5f`.

## Production address setting

**Decision**: One build-time environment variable, `SITE_URL`, read and validated in a
new `src/lib/site.ts`, which exports the normalized origin and an `absoluteUrl(path)`
helper. Every canonical, sharing, sitemap, and robots value goes through it (FR-017).

- `next build` / `next start` (`NODE_ENV=production`): missing or invalid `SITE_URL`
  throws while pages prerender, so the build stops with a message naming the variable and
  the rule broken. Valid means: absolute `https:` URL; no path other than `/`, query,
  fragment, or credentials; host not `localhost`, a loopback address, or `0.0.0.0`.
- `next dev` only: falls back to `http://localhost:3000`. Dev output is never deployed.
- Root `metadataBase` is always set from `site.ts`, so Next.js's own localhost fallback
  for metadata never applies.
- Verification builds use `SITE_URL=https://portfolio.example` (`.example` is reserved by
  RFC 2606 and cannot be a real site). The readiness report marks any build whose host ends
  in `.example`, `.invalid`, `.test`, or `.localhost` **not releasable**; the release build
  must be rebuilt with the owner's domain.
- `.env.example` documents the variable with an empty value (allowed by `.gitignore`).

**Rationale**: Meets the clarification (domain undecided, one setting filled later) and the
edge case (no guessed or local address in output). Build-time failure is the simplest way
to prevent a canonical pointing at the wrong place. All routes are static, so the value is
baked in at build; changing the domain means rebuilding, recorded in the deployment
contract.

**Alternatives considered**: A constant in `src/content/` (needs a code change per domain;
easy to forget); a host-specific variable such as `VERCEL_URL` (ties the site to a host
before one is chosen); a silent localhost fallback (forbidden by the edge case);
validation in `next.config.ts` (would duplicate the rules, since pages need the value too).

## Page metadata

**Decision**: A helper `pageMetadata({ path, title, description })` in
`src/lib/metadata.ts` returns the full Metadata object for one public page: `title`,
`description`, `alternates.canonical`, `openGraph` (title, description, url, siteName,
type `website`, images), and `twitter` (`summary_large_image`, title, description, images).
Each public route calls it. The root layout sets only `metadataBase`, the default title and
description, and `applicationName`, never a canonical, so nothing page-specific is
inherited by the 404 page.

Titles and descriptions (each from visible content, FR-011):

| Route | Title | Description source |
| --- | --- | --- |
| `/` | `Akash K Pillai \| Backend & AI Developer` | `profile.role` + `profile.intro` |
| `/work` | `Work \| Akash K Pillai` | the work index intro sentence |
| `/work/<slug>` | `<project.title> \| Akash K Pillai` | `project.summary` |
| `/changelog` | `Changelog \| Akash K Pillai` | changelog intro text added to the page |
| 404 | `Page not found \| Akash K Pillai` | the 404 explanation; no canonical, no sharing tags |

The work index intro moves into a shared constant so page and description cannot drift.
The changelog page gains a one-sentence intro ("Releases of this portfolio, newest first.")
so its existing description becomes visible content.

**Rationale**: Next.js merges `openGraph` shallowly, so a child that sets `openGraph`
replaces the parent's; building the whole object per page avoids silently losing the image
or URL. Next.js adds `noindex` to not-found responses automatically; the check confirms it.

**Alternatives considered**: Defining Open Graph in the root layout and overriding pieces
(lost-field risk above); a separate `og:type` of `article` for case studies (needs a
published time the content does not record).

## Sharing image

**Decision**: One site-wide 1200×630 PNG card served at `/og.png` from a route handler
`src/app/og.png/route.tsx` using `ImageResponse` from `next/og` (bundled with Next.js),
with `dynamic = "force-static"` so it is rendered once at build. The card shows the name,
role, and headline from `src/content/profile.ts` in ink on the ivory canvas with a copper
rule — no photograph, logo, or third-party mark (FR-014). Every page references it
explicitly through `pageMetadata`.

Fonts: `ImageResponse` needs TTF/OTF data (not the WOFF2 that `next/font` downloads, and
variable fonts are unreliable), so two static Manrope instances (OFL-1.1) are committed to
`src/assets/fonts/` with the license text, and read at build. Source: the Manrope upstream
static TTFs; record URL, file size, and SHA-256 in the verification. If static instances
are unavailable, produce them from the Google Fonts variable file with `fontTools`
`varLib.instancer` (Python is installed) and record that instead. Files in `src/assets/`
are not served.

**Rationale**: Reproducible from source at every build, no manual export step, no new
dependency (constitution IV). A stable explicit URL avoids depending on how file-based
`opengraph-image` inheritance interacts with per-page `openGraph` objects.

**Alternatives considered**: File convention `app/opengraph-image.tsx` (generated URL
includes a hash and inheritance with per-page `openGraph` is a merge risk); a PNG
screenshotted with Playwright and committed to `public/` (manual step that drifts from
`profile.ts`); per-page cards (more surface, no stated need: titles and descriptions
already vary per page); SVG `og:image` (not accepted by major preview generators).

## Site icon

**Decision**: `src/app/icon.svg` (Next.js file convention, emitted on every page): a
geometric monogram drawn with paths only — no `<text>` and no font — in ink and copper on
the ivory canvas, legible at 16 px. No `favicon.ico` or Apple touch icon; browsers that
only request `/favicon.ico` get a 404, recorded as a known limitation.

**Rationale**: Owned material only, one small file, no raster pipeline.

## Sitemap and robots

**Decision**: `src/app/sitemap.ts` lists `/`, `/work`, `/changelog`, and one entry per
`publishedProjects` item, all through `absoluteUrl`; no `lastModified` (no reliable
per-page date is recorded, so none is invented). `src/app/robots.ts` returns
`allow: "/"` for all agents and `sitemap: absoluteUrl("/sitemap.xml")`. Both are
statically generated at build.

**Rationale**: The sitemap and the case-study routes read the same `publishedProjects`
list, so a draft cannot appear in one without the other (FR-015, SC-005). Draft and unknown
slugs already return 404 through `dynamicParams = false`.

## Draft exclusion in generated output

**Decision**: Check the **served surface** — every prerendered HTML and RSC payload,
`.next/static`, `/sitemap.xml`, `/robots.txt`, `/og.png` metadata, and `public/` — for draft
markers (`user-management-api`, `User Management API`, `user-management-with-prisma`):
expect zero. Server-only chunks in `.next/server` may contain the draft record because
`projects.ts` imports it; they are not reachable over HTTP. The report records that count
as informational, not as a pass/fail item.

**Rationale**: Client Components import only types from `@/content/projects`
(`ArchitectureDiagram`), so draft text cannot reach browser bundles today; the check proves
it rather than assuming it. Restructuring content imports is out of scope (the spec adds no
new sections and requires only public surfaces to be clean).

## Deployment target and runtime

**Decision**: Keep the default Next.js server output: `npm ci`, `npm run build`,
`npm run start` on Node.js `24.12.0` (tested; `engines` stays `>=20.9.0`) with npm
`11.6.2`. Add `.nvmrc` containing `24.12.0`, which many hosts read. Deployment docs are
host-neutral (clarification): required settings, build and start commands, port, how to
confirm, how to roll back.

**Rationale**: `next start` returns a true 404 status for unknown and draft routes on any
Node host; static export depends on host-specific 404 handling. No server code is added.

**Alternatives considered**: `output: "export"` (404 status and `/og.png` behavior vary by
static host; revisit when a host is chosen); `output: "standalone"` (useful for containers,
not needed until a host is chosen).

## Tested commit and release record

**Decision**: The tested commit is the commit that contains all application changes for
1.0.0, including the version bump. The readiness report, release notes, and docs may follow
in later docs-only commits; the deployment instructions require
`git diff --stat <tested>..<deployed> -- . ":!specs" ":!docs"` to be empty, otherwise the
deployed commit must be re-tested. No tag, push, or deployment is part of this feature
(FR-024).

**Rationale**: Breaks the circularity of recording a commit inside itself without
weakening "deployed equals tested".

## Verification tooling

All QA tools stay outside the application dependency tree, in
`%TEMP%\akash-portfolio-qa-tools` (same location as 001–004's `playwright-core`), driving the
installed Chrome. Each solves one recorded requirement; record exact versions when installed.

| Tool | Requirement | Use |
| --- | --- | --- |
| `playwright-core` (installed) | FR-001–FR-005, FR-008 | Extend 004's browser script to every public page: responsive, keyboard and focus, reduced motion, no JavaScript, links |
| `axe-core` | FR-006, FR-020 | Injected per page at 390 and 1440 px, tags `wcag2a wcag2aa wcag21a wcag21aa wcag22aa`; violations fixed or recorded; "needs review" items checked by hand |
| `lighthouse` CLI | FR-021 | Mobile (default) and `--preset=desktop` runs on `/` and `/work/notification-platform` against `next start`; JSON reports kept in `verification/lighthouse/` |
| Node.js `fetch` (built in) | FR-011–FR-017, FR-002 | `check-metadata.mjs`: per-page title, description, canonical, sharing tags, image response, sitemap vs. published routes, robots, 404 statuses; reusable against the live domain after deployment |

Performance has no pass threshold in the spec. Core Web Vitals "good" limits (LCP ≤ 2.5 s,
CLS ≤ 0.1, TBT as the lab proxy for INP) are used only as triggers to investigate; scores
are reported as measured with machine, Chrome version, throttling, and the limitation that
localhost has no network or CDN.

Accessibility is reported as "automated checks plus manual keyboard, focus, zoom,
reduced-motion, and screenshot review", never as conformance (spec assumption). No screen
reader test is planned; it is listed as unrun. 004 left Chrome's real 200% zoom setting
unrun; try it once headed (Ctrl + +) and record the result, otherwise keep it unrun.

Contrast: 001's computed-contrast routine is reused on every public page in both
viewports, alongside axe.

## Content and evidence re-check

**Decision**: `check-evidence-ids.mjs` confirms every evidence ID in `src/content/`
exists in `docs/project-evidence.md`. Then a dated manual pass reads each rendered page
against the register, the owner-supplied facts in 004's spec, and the résumé, logging each
correction (FR-007). Feature 003's `check-confidentiality.mjs` runs again with the
case-study pages; the phone and town search from 004 runs on every page and generated file.

## Actions and demo

**Decision**: Every visible action is listed in the readiness report with destination,
method, date, and result. `mailto:` is checked by value; LinkedIn's status 999 to
automated requests is recorded as unconfirmed by automation and confirmed by a person (the
owner) before release. The Resume Analyzer deployment
(`https://resume-analyzer-rosy.vercel.app`) gets one end-to-end attempt with a fictional
résumé PDF: upload, parsed record, search. Only if the flow works does the project gain a
`demo` record and a "Live demo" link beside its source link; otherwise nothing is shown and
the result is recorded (FR-009, spec assumption).

## Release blockers known at planning

1. Production address not supplied (FR-012) — blocks release.
2. Feature 004 (0.3.0) owner acceptance, task T028 — must close before 1.0.0 is accepted.
3. LinkedIn link confirmed by a person.
4. Owner approval of the sharing card and icon.

A host choice is required to deploy, not to prepare the release; it is listed as an owner
input in the deployment instructions.
