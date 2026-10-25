# Contract: Site Metadata and Generated Files

What the production build exposes to browsers, link-preview generators, and search
engines. `<origin>` is the validated `SITE_URL` ([deployment contract](deployment.md)).
Entities: [data model](../data-model.md).

## Every public page

Public pages: `/`, `/work`, `/changelog`, and `/work/<slug>` for each published project
(today `hrms-backend`, `meridian-assistant`, `notification-platform`, `resume-analyzer`).
Status 200. The `<head>` contains exactly one of each:

| Element | Value |
| --- | --- |
| `<title>` | Unique per page ([research](../research.md#page-metadata)) |
| `meta[name=description]` | From visible page content |
| `link[rel=canonical]` | `<origin><path>` (homepage: bare `<origin>`, the form Next.js emits) |
| `meta[property=og:title]`, `og:description` | Same as title and description |
| `meta[property=og:url]` | Same as canonical |
| `meta[property=og:type]` | `website` |
| `meta[property=og:site_name]` | `Akash K Pillai` |
| `meta[property=og:image]` | `<origin>/og.png`, with `og:image:width` 1200, `og:image:height` 630, `og:image:alt` |
| `meta[name=twitter:card]` | `summary_large_image`, with matching `twitter:title`, `twitter:description`, `twitter:image` |
| `link[rel=icon]` | The SVG icon, `type="image/svg+xml"` |

No value contains `localhost`, `127.0.0.1`, a draft slug or title, or a host other than
`<origin>`. No `meta[name=robots]` with `noindex` on public pages.

## Not-found responses

Unknown paths (e.g. `/work/meridian`, `/nope`) and draft slugs (`/work/user-management-api`):
status **404**; title `Page not found | Akash K Pillai`; `meta[name=robots]` includes
`noindex`; no canonical, `og:url`, or `og:image`. Body: explanation plus links to `/` and
`/work` (unchanged from 002).

## `/sitemap.xml`

Status 200, `application/xml`. A `<urlset>` with one `<url><loc>` per public page, equal
to that page's canonical, and nothing else. No draft, unknown, 404, `/og.png`, résumé, or
`localhost` URL.

## `/robots.txt`

Status 200, `text/plain`, with these rules (checked by parsing, not byte equality):

```text
User-Agent: *
Allow: /

Sitemap: <origin>/sitemap.xml
```

## `/og.png`

Status 200, `image/png`, 1200×630. Shows `Akash K Pillai`, `Backend & AI Developer`, and
`Backend systems. Practical AI. Thoughtfully built.` in Manrope, ink `#17212b` on canvas
`#f5f2eb`, one copper `#b44e30` rule. No photograph, logo, or third-party mark. Text
contrast ≥ 4.5:1.

## Icon

Served SVG, square `viewBox`, paths only (no `<text>`, no external reference), colors from
the tokens above, distinguishable at 16×16 px. `/favicon.ico` is not provided (404).

## Visible changes

- `/changelog`: a one-line intro under the heading, used as the page description.
- Resume Analyzer case study: a "Live demo" link beside the source link **only if** the
  demo check passes ([data model](../data-model.md#demo-existing-optional-projectdemo));
  opens the checked URL; keyboard reachable with the existing focus style.
- Footer: `Version 1.0.0` at acceptance (FR-019).
- No other layout, copy, or navigation changes beyond corrections found by the evidence
  re-check (FR-007), each recorded in the verification.

## Unchanged guarantees

From 001–004: skip link and `#main-content` focus target, server-rendered essential text,
static diagram equivalents without JavaScript, reduced-motion styles, `dynamicParams =
false` for case studies, build failure when the changelog and package versions disagree.
