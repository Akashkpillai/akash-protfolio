import { existsSync } from "node:fs";
import { join } from "node:path";

// The résumé is served from the site's own public files (feature 004 FR-007).
export const resumeHref = "/resume/Akash_K_Pillai_Resume.pdf";

// Checked when pages are prerendered, so a missing file renders no action at all.
export function hasResume(): boolean {
  return existsSync(join(process.cwd(), "public", resumeHref));
}
