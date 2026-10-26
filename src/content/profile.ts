// Confirmed against the owner's résumé (2026-10-25): "Backend Developer | AI Developer".
// Every value traces to specs/004-professional-profile/spec.md "Owner-supplied facts".
export const profile = {
  name: "Akash K Pillai",
  role: "Backend & AI Developer",
  headline: "Backend systems. Practical AI. Thoughtfully built.",
  // Restates the owner-confirmed About text below, about[1] (feature 008 FR-001; feature 004).
  intro:
    "I build backend systems with Node.js, NestJS, and PostgreSQL, and AI features using retrieval and tool calling.",
  location: "Kerala, India",
  about: [
    "I studied physics, completing a B.Sc. at NSS College, Kerala University, in 2021, and have worked as a backend developer since March 2023.",
    "My work is building REST APIs and backend services with Node.js, NestJS, and PostgreSQL, and more recently AI features: LLM integration, retrieval with vector search, and tool calling.",
  ],
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Intermediate" },
    { name: "Malayalam", level: "Native" },
  ],
} as const;
