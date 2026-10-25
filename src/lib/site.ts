// The single production address (feature 005 FR-012, FR-017). Every canonical, sharing,
// sitemap, and robots value is built from it. Set SITE_URL before building; see
// docs/deployment.md. Only `next dev` may run without it.
const developmentOrigin = "http://localhost:3000";

function invalid(rule: string): never {
  throw new Error(
    `SITE_URL ${rule}. Set it to the production address, e.g. SITE_URL=https://example.com (see docs/deployment.md).`,
  );
}

function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "0.0.0.0" ||
    hostname === "[::1]" ||
    /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
  );
}

function validOrigin(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    invalid(`"${value}" is not a valid URL`);
  }
  if (url.protocol !== "https:") invalid("must use https://");
  if (url.username || url.password) invalid("must not include credentials");
  if (url.pathname !== "/") invalid("must not include a path");
  if (url.search || url.hash) invalid("must not include a query or fragment");
  if (isLocalHost(url.hostname)) invalid("must not be localhost or a loopback address");
  return url.origin;
}

function readSiteOrigin(): string {
  const value = process.env.SITE_URL?.trim();
  if (!value) {
    if (process.env.NODE_ENV === "production") invalid("is required for production builds");
    return developmentOrigin;
  }
  return validOrigin(value);
}

export const siteOrigin: string = readSiteOrigin();

// The homepage is the bare origin, the form Next.js uses for canonical URLs, so canonical,
// sharing, and sitemap values are spelled identically.
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`absoluteUrl expects a path starting with "/", got "${path}".`);
  }
  return path === "/" ? siteOrigin : new URL(path, siteOrigin).href;
}
