# Deploying the portfolio

How to build, deploy, confirm, and roll back this site. It works with any host that runs
Node.js (for example Vercel, Netlify, Render, or your own server). Host-specific steps will be
added once a host is chosen.

## What you need

| Item | Value |
| --- | --- |
| Node.js | `24.12.0` (tested; see `.nvmrc`). Anything `>=20.9.0` is supported. |
| npm | `11.6.2` (tested) |
| Your domain | For example `https://akashpillai.dev`. Required before release. |

There are no secrets, API keys, analytics, or databases.

## Settings

| Variable | Required | What it does |
| --- | --- | --- |
| `SITE_URL` | Yes, at build time | Your site's address. It goes into every page's canonical link, sharing preview, the sitemap, and robots rules. |
| `PORT` | No | The port `npm run start` listens on (default `3000`). Most hosts set it for you. |

`SITE_URL` rules: it must start with `https://`, be just the domain (no path such as `/portfolio`,
no `?` or `#`), and must not be `localhost`. Because the address is written into the pages when
they are built, **changing `SITE_URL` needs a rebuild**.

What the build does with it:

| `SITE_URL` | Build result |
| --- | --- |
| missing or empty | Stops with an error saying `SITE_URL` is required |
| invalid (`http://…`, `https://example.com/path`, `https://localhost`) | Stops with an error naming the rule |
| a test address (`*.example`, `*.invalid`, `*.test`, `*.localhost`) | Builds, but is **not releasable** (only for checks) |
| your real domain | Builds; releasable once the readiness checks pass |

`npm run dev` works without `SITE_URL` (it uses `http://localhost:3000`); never deploy dev output.

## Build and run

```powershell
npm ci
$env:SITE_URL = "https://<your-domain>"
npm run build
npm run start
```

`npm ci` installs exactly what `package-lock.json` lists; do not use `npm install` for
deployment. On a host, set `SITE_URL` in its environment-variable settings, use `npm ci` as the
install command, `npm run build` as the build command, and `npm run start` as the start command
(hosts with built-in Next.js support usually detect the last two).

## Deploy only the tested commit

The release notes in `docs/releases/1.0.0.md` name the **tested commit** — the exact code that
passed every check. Deploy that commit, or a later one that changes only `specs/` or `docs/`.
To check a later commit `D` against the tested commit `T`:

```powershell
git diff --stat T..D -- . ":!specs" ":!docs"
```

If that prints anything, the code changed and must be tested again before it counts as the
release.

## Confirm the deployment works

1. Run the metadata check against the live site:

   ```powershell
   $env:BASE_URL = "https://<your-domain>"; $env:SITE_URL = "https://<your-domain>"
   node specs/005-launch-readiness/verification/check-metadata.mjs
   ```

   It must end with "all checks passed": every page loads, unknown pages return 404, the
   sitemap and robots rules use your domain, and the sharing image is a 1200 × 630 PNG.
2. Open the site and check by hand: the footer reads `Version 1.0.0`; your host's deployment
   record shows the tested commit; one case study opens; the résumé downloads; the email link
   opens your email app.

## Roll back if something is wrong

- **First launch (nothing deployed before)**: take the site offline — disable or delete the
  deployment, or detach the domain — or, if the problem was a host setting, fix the setting and
  redeploy the tested commit. Fix the code as a `1.0.1` patch release through the usual
  feature workflow.
- **Later releases**: use your host's rollback (or redeploy) to restore the previous good
  deployment, or redeploy the previous release's tested commit with the same `SITE_URL`. Then
  run the confirmation check above.

## Only you can do these

Choose the host and domain, set `SITE_URL` on the host, deploy, create the `v1.0.0` tag, push,
publish the release notes, and announce the site. None of these happen automatically.
