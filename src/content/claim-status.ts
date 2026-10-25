// Kept free of imports: client components use these labels, and importing
// projects.ts there would ship every project record, drafts included, to the browser.
export type ClaimStatus = "implemented-code-path" | "unfinished" | "illustrative";

export const claimStatusLabels: Record<ClaimStatus, string> = {
  "implemented-code-path": "Implemented code path",
  unfinished: "Unfinished",
  illustrative: "Illustrative",
};
