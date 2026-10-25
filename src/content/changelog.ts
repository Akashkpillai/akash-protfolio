import { version } from "../../package.json";

export type Release = {
  version: string;
  date: string;
  summary: string;
  changes: readonly string[];
  features: readonly string[];
};

// Newest first. The newest entry must match package.json (constitution VII); a mismatch
// fails the build below rather than reaching visitors.
export const releases: readonly Release[] = [
  {
    version: "0.3.0",
    date: "2026-10-25",
    summary: "Professional profile: experience, skills, about, contact, résumé, and this changelog.",
    changes: [
      "Experience for both roles, skills in six groups, an About section, and contact links with a copy-email action.",
      "Résumé download served from the site.",
      "This changelog and the version in the footer.",
    ],
    features: ["004"],
  },
  {
    version: "0.2.0",
    date: "2026-10-25",
    summary: "Engineering case studies with evidence-traced claims and diagrams.",
    changes: [
      "Selected work on the homepage and a work index.",
      "Case studies for HRMS Backend, Meridian Assistant, Notification Platform, and Resume Analyzer.",
      "Labels for unfinished parts and code paths not run end to end; a not-found page for unknown addresses.",
    ],
    features: ["002", "003"],
  },
  {
    version: "0.1.0",
    date: "2026-10-25",
    summary: "Portfolio foundation.",
    changes: [
      "Hero, navigation with a mobile menu, and an illustrative flow diagram.",
    ],
    features: ["001"],
  },
];

export const currentVersion: string = version;

if (releases[0]?.version !== currentVersion) {
  throw new Error(
    `Changelog newest version ${releases[0]?.version} does not match package.json version ${currentVersion}.`,
  );
}
