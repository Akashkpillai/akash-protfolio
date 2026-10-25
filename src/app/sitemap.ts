import type { MetadataRoute } from "next";
import { publishedProjects } from "@/content/projects";
import { absoluteUrl } from "@/lib/site";

// Exactly the published public pages (feature 005 FR-015). Built from the same list as the
// case-study routes, so a draft cannot appear here. No dates: none are recorded per page.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/work", ...publishedProjects.map((project) => `/work/${project.slug}`), "/changelog"];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
