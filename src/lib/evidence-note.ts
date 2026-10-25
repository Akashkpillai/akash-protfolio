import type { ClaimStatus, Project } from "@/content/projects";

// A short, derived note on how a project was reviewed (feature 006 FR-013). Built from the
// project record, never written by hand, so it cannot drift from the case study.
export type EvidenceNote = {
  source: "public" | "private";
  commit: string;
  unfinished: boolean;
  notRunEndToEnd: boolean;
};

function statuses(project: Project): ClaimStatus[] {
  const { caseStudy } = project;
  const claims = [
    ...caseStudy.problem,
    ...caseStudy.contribution,
    ...caseStudy.implementation,
    ...caseStudy.decisions,
    ...caseStudy.tradeoffs,
    ...caseStudy.limitations,
  ];
  return [
    ...claims.map((claim) => claim.status),
    ...caseStudy.architecture.components.map((component) => component.status),
    ...caseStudy.architecture.links.map((link) => link.status),
  ].filter((status): status is ClaimStatus => status !== undefined);
}

export function evidenceNote(project: Project): EvidenceNote {
  const found = statuses(project);
  return {
    source: project.source.kind,
    commit: project.reviewedCommit.slice(0, 7),
    unfinished: found.includes("unfinished"),
    notRunEndToEnd: found.includes("implemented-code-path"),
  };
}

export function evidenceNoteText(note: EvidenceNote): string[] {
  return [
    `${note.source === "public" ? "Public" : "Private"} source, reviewed at ${note.commit}`,
    ...(note.unfinished ? ["Includes unfinished parts"] : []),
    ...(note.notRunEndToEnd ? ["Some paths not run end to end"] : []),
  ];
}
