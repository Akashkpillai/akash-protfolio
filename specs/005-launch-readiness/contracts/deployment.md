# Contract: Build and Deployment Interface

The host-neutral interface between the repository and any Node.js host. The owner-facing
instructions in `docs/deployment.md` follow this contract.

## Runtime

| Item | Value |
| --- | --- |
| Node.js | `24.12.0` tested (`.nvmrc`); `engines.node` `>=20.9.0` |
| Package manager | npm `11.6.2` tested; install only with `npm ci` from `package-lock.json` |
| Build | `npm run build` |
| Start | `npm run start` (`next start`); listens on `PORT` (default 3000) |
| Output | Default Next.js server output in `.next/`; not static export |

## Settings

| Variable | Required | When read | Rule |
| --- | --- | --- | --- |
| `SITE_URL` | Yes, for `build` | Build (baked into pages, sitemap, robots, sharing tags) | Absolute `https://` origin, no path/query/fragment/credentials, not localhost or loopback. Changing it requires a rebuild |
| `PORT` | No | Start | Port for `next start` |
| `NODE_ENV` | No | Set by Next.js | Do not override |

No secrets, analytics, or API keys exist. `.env.example` lists `SITE_URL=` only.

## Build behavior

| `SITE_URL` | `npm run build` result |
| --- | --- |
| unset or empty | Exit ≠ 0; message names `SITE_URL` and says it is required |
| invalid (e.g. `http://…`, `https://x.com/path`, `https://localhost`) | Exit ≠ 0; message names the rule broken |
| reserved test host (`*.example`, `*.invalid`, `*.test`, `*.localhost`) | Exit 0; output is **not releasable** (readiness check, not the build) |
| owner-confirmed domain | Exit 0; releasable if all readiness checks pass |

`npm run dev` without `SITE_URL` uses `http://localhost:3000`; dev output is never deployed.

## Confirming a deployment

Run the metadata check against the live site:

```powershell
$env:BASE_URL = "https://<domain>"; $env:SITE_URL = "https://<domain>"
node specs/005-launch-readiness/verification/check-metadata.mjs
```

Expected: exit 0 — every public page 200 with the contract tags, 404 pages 404, sitemap
and robots as specified, `/og.png` a 1200×630 PNG. Then confirm by hand: footer reads
`Version 1.0.0`; the host's deployment record shows the tested commit (or a docs-only
descendant, below); one case study, the résumé download, and the email link work.

## Tested commit rule

Deploy the tested commit `T` recorded in `docs/releases/1.0.0.md`, or a descendant `D`
where `git diff --stat T..D -- . ":!specs" ":!docs"` prints nothing. Anything else must be
re-tested before it counts as the release.

## Rollback

- **Later releases**: restore the previous known-good deployment through the host's
  rollback or redeploy, or redeploy the previous release's tested commit with the same
  `SITE_URL`; then run the confirmation check.
- **First launch (no previous deployment)**: take the site offline (disable or delete the
  deployment, or detach the domain), or redeploy the tested commit if the fault was in
  host configuration. Fix forward as a patch release (`1.0.1`) through the normal feature
  workflow.

## Owner-only actions (not performed by this feature)

Choosing a host and domain, setting `SITE_URL` there, deploying, creating the annotated
`v1.0.0` tag, pushing, publishing release notes, and announcing (FR-024).
