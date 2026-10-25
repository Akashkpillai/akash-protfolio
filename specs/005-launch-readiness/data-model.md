# Data Model: Launch Readiness

Typed site data lives in `src/`; release records are Markdown in `specs/` and `docs/`.
No database.

## SiteConfig (`src/lib/site.ts`)

The single production address (spec entity "Production address").

| Field | Type | Rule |
| --- | --- | --- |
| `origin` | `string` | From `SITE_URL`; normalized to `https://host[:port]`, no trailing slash |
| `absoluteUrl(path)` | `(path: string) => string` | `origin` for `/`, otherwise `new URL(path, origin).href`; `path` must start with `/` |

Validation (production build and start): `SITE_URL` present; parses as a URL; protocol
`https:`; pathname `/` or empty; no search, hash, username, or password; host not
`localhost`, `127.0.0.0/8`, `::1`, or `0.0.0.0`. Failure throws
`SITE_URL …: <rule>` and stops the build. Development only: absent → `http://localhost:3000`.

Releasability (checked by the readiness report, not the build): host must not end in
`.example`, `.invalid`, `.test`, or `.localhost`, and must equal the owner-confirmed domain.

## PublicPage (derived per route)

| Field | Source | Rule |
| --- | --- | --- |
| `path` | route | One of `/`, `/work`, `/changelog`, `/work/<published slug>` |
| `title` | page metadata | Unique across public pages |
| `description` | visible page content | Non-empty; true of the page; no draft or private term |
| `canonical` | `absoluteUrl(path)` | Equals the sitemap entry for the same page |
| `image` | `absoluteUrl("/og.png")` | Same for every page; 1200×630 PNG |
| `inSitemap` | always `true` | Public pages only |

Published slugs come only from `publishedProjects` (`status === "published"`). The
`ProjectSlug` union and `Project.status` are unchanged; a draft (`user-management-api`) has
no route, no metadata, and no sitemap entry.

**NotFoundPage**: title `Page not found | Akash K Pillai`, status 404, `noindex`, no
canonical, no sharing tags, not in the sitemap. Applies to unknown paths and draft slugs.

## SitemapEntry (`src/app/sitemap.ts`)

`{ url: absoluteUrl(path) }` for each PublicPage, in the order `/`, `/work`, case studies
in `order`, `/changelog`. No `lastModified`, `priority`, or `changeFrequency`.

## RobotsRules (`src/app/robots.ts`)

`{ rules: [{ userAgent: "*", allow: "/" }], sitemap: absoluteUrl("/sitemap.xml") }`.

## SharingCard (`src/app/og.png/route.tsx`)

Fixed 1200×630 PNG rendered at build from `profile.name`, `profile.role`, and
`profile.headline`, using committed Manrope static TTFs (`src/assets/fonts/`, OFL-1.1).
Contains no photograph, logo, or third-party mark.

## Demo (existing optional `Project.demo`)

`{ url, checkedOn, flowChecked }` — set for Resume Analyzer only if the end-to-end check
passes with fictional data. When present, the case-study header renders "Live demo" next
to the source link; when absent, nothing renders.

## ActionCheck (readiness report row)

| Field | Values |
| --- | --- |
| `page` | Where the action appears |
| `action` | Label as shown (e.g. "Download résumé", "Source: notificationservice on GitHub") |
| `destination` | Exact URL or `mailto:` value |
| `method` | `automated` \| `manual` \| `automated + manual` |
| `date` | ISO date of the check |
| `result` | `pass` \| `fail` \| `unconfirmed` (e.g. bot-blocked; must become `pass` by a manual check before release) |

## ReadinessCheck (readiness report row)

| Field | Rule |
| --- | --- |
| `name` | One of FR-020's checks |
| `environment` | OS, Node, npm, Chrome, tool and version, `SITE_URL` used, commit |
| `date` | ISO date |
| `result` | `pass` \| `fail` \| `unrun` |
| `measurements` | Raw values where applicable (scores, ratios, counts) |
| `limitations` | Required, even if "none known" |

State: `unrun → pass | fail`; `fail → pass` only after a fix and a re-run on the new
commit. A check run on a commit other than the tested commit is re-run or marked stale.

## ReleaseBlocker

`{ id, description, owner action, status: open | resolved, resolved on }`. Initial open
blockers are listed in [research](research.md#release-blockers-known-at-planning).

## ReleaseRecord (`docs/releases/1.0.0.md`)

| Field | Rule |
| --- | --- |
| `version` | `1.0.0`, equal to `package.json`, footer, and newest changelog entry |
| `testedCommit` | Full SHA of the commit the readiness checks ran on |
| `notes` | From the 1.0.0 changelog entry and the readiness report |
| `knownLimitations` | Every unrun check and recorded limitation |
| `blockers` | ReleaseBlocker list |
| `status` | `prepared — blocked` → `prepared — ready` (no open blockers, owner accepted) → `published` (owner's separate action, outside this feature) |

`prepared — ready` requires every ReadinessCheck to be `pass` or an `unrun` that the
owner has accepted as a known limitation, and no `fail` or `unconfirmed` result.
