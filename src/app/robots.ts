import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Feature 005 FR-016.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
