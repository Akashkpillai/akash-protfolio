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
    version: "1.0.0",
    date: "2026-10-26",
    summary: "Launch readiness: accurate titles, sharing previews, and search-engine files.",
    changes: [
      "Every page has its own title, description, canonical address, and sharing preview.",
      "A sitemap listing exactly the published pages, and robots rules pointing to it.",
      "The site's address comes from one setting, so a build cannot point to a wrong or local address.",
      "Case-study wording corrected where it went beyond the reviewed evidence.",
    ],
    features: ["005"],
  },
  {
    version: "0.5.0",
    date: "2026-10-26",
    summary: "The lab comes alive: the Probe, Ask the lab, motion with a pause control, and messages.",
    changes: [
      "The Probe, a blinking robot eye that follows your selections and traced flows, roams between headings, and opens Ask the lab.",
      "Ask the lab: scripted answers drawn only from this site's published content, with links to their source pages.",
      "A 3D project map (planets orbiting the AK sun), an animated background, section reveals, and a first-visit entrance, all pausable and off with reduced motion.",
      "A message form that composes an email in your own email app; the site stores and sends nothing.",
    ],
    features: ["007"],
  },
  {
    version: "0.4.0",
    date: "2026-10-26",
    summary: "Systems Lab redesign: a dark, interactive workspace for exploring how the projects work.",
    changes: [
      "A new identity: dark graphite, warm off-white text, teal, cobalt, and copper.",
      "A homepage project map with an architecture panel that explains and traces each system's flow.",
      "Restyled case studies with an architecture summary and section navigation, and a new sharing image and icon.",
    ],
    features: ["006"],
  },
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
