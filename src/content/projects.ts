import { hrmsBackend } from "@/content/case-studies/hrms-backend";
import { meridianAssistant } from "@/content/case-studies/meridian-assistant";
import { notificationPlatform } from "@/content/case-studies/notification-platform";
import { resumeAnalyzer } from "@/content/case-studies/resume-analyzer";
import { userManagementApi } from "@/content/case-studies/user-management-api";
import type { ClaimStatus } from "@/content/claim-status";

export type { ClaimStatus } from "@/content/claim-status";

export type ProjectSlug =
  | "hrms-backend"
  | "meridian-assistant"
  | "resume-analyzer"
  | "notification-platform"
  | "user-management-api";

// `evidence` holds claim IDs from docs/project-evidence.md. It is never rendered.
// A claim that states a reason must cite an owner-confirmed rationale ID (e.g. RA-R01).
export type Claim = {
  text: string;
  status?: ClaimStatus;
  evidence: readonly string[];
};

export type DiagramKind = "pipeline" | "architecture" | "data-model" | "workflow" | "module-map";

export type DiagramComponent = {
  id: string;
  name: string;
  shortName?: string;
  responsibility: string;
  status?: ClaimStatus;
  evidence: readonly string[];
  grid: { column: number; row: number };
};

export type DiagramLink = {
  from: string;
  to: string;
  label: string;
  status?: ClaimStatus;
};

export type ArchitectureExplanation = {
  kind: DiagramKind;
  interactive: boolean;
  title: string;
  summary: string;
  components: readonly DiagramComponent[];
  links: readonly DiagramLink[];
};

export type CaseStudy = {
  problem: readonly Claim[];
  contribution: readonly Claim[];
  implementation: readonly Claim[];
  architecture: ArchitectureExplanation;
  decisions: readonly Claim[];
  tradeoffs: readonly Claim[];
  limitations: readonly Claim[];
  // Internal record of README/code disagreements; not rendered.
  discrepancies: readonly string[];
};

// Public URLs must equal the register URL. Private sources render no link.
export type ProjectSource = { kind: "public"; url: string } | { kind: "private" };

// Set only after owner approval and sanitization (feature 003 FR-008).
export type ProjectScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  provenance: string;
  approvedOn: string;
};

// Card layout on the homepage and /work (feature 008 FR-010); presentation only.
export type ProjectLayout = "featured" | "compact";

export type Project = {
  slug: ProjectSlug;
  order: number;
  layout: ProjectLayout;
  status: "draft" | "published";
  title: string;
  summary: string;
  stack: readonly string[];
  source: ProjectSource;
  reviewedCommit: string;
  demo?: { url: string; checkedOn: string; flowChecked: string };
  preview: { kind: DiagramKind; caption: string };
  screenshot?: ProjectScreenshot;
  caseStudy: CaseStudy;
};

const projects: readonly Project[] = [
  {
    slug: "hrms-backend",
    order: 1,
    layout: "featured",
    status: "published", // Owner approved the exact text 2026-10-25 (feature 003 T020).
    title: "HRMS Backend — Multi-Tenant HR Platform",
    summary:
      "A multi-tenant HR management backend where I built most of the HR modules: leave, attendance, onboarding, documents, scheduling, and more.",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "TypeORM", "JWT", "AWS S3", "Nodemailer", "Jest"],
    source: { kind: "private" },
    reviewedCommit: "9456d56a73564ae56ca9538e0b13bf8e7a5040c7",
    preview: {
      kind: "module-map",
      caption: "Explanatory module map drawn from the reviewed source, not a screenshot.",
    },
    caseStudy: hrmsBackend,
  },
  {
    slug: "meridian-assistant",
    order: 2,
    layout: "featured",
    status: "published", // Owner approved 2026-10-25 (feature 003 T013).
    title: "Meridian Assistant — Discord RAG and Proposal Agent",
    summary:
      "A Discord assistant that answers from a brand-scoped document library with sources, and drafts proposal estimates that render only after an explicit stored approval.",
    stack: ["TypeScript", "Node.js", "Discord.js", "PostgreSQL", "pgvector", "OpenAI API", "Docker Compose"],
    source: { kind: "private" },
    reviewedCommit: "22ca5b01c5934c521e769776ab96b2035c4e33bf",
    preview: {
      kind: "workflow",
      caption: "Explanatory workflow diagram drawn from the reviewed source, not a screenshot.",
    },
    caseStudy: meridianAssistant,
  },
  {
    slug: "resume-analyzer",
    order: 4,
    layout: "compact",
    status: "published",
    title: "Resume Analyzer — AI Document Processing",
    summary:
      "A full-stack app that turns uploaded PDF résumés into structured, searchable records, with a basic fallback when AI parsing fails.",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Groq API", "pdf-parse", "React", "Vite"],
    source: { kind: "public", url: "https://github.com/Akashkpillai/resume-analyzer" },
    reviewedCommit: "e0d61a854566aff4f3256e5b68d3957f06dc49bd",
    preview: {
      kind: "pipeline",
      caption: "Explanatory pipeline diagram drawn from the reviewed source, not a screenshot.",
    },
    caseStudy: resumeAnalyzer,
  },
  {
    slug: "notification-platform",
    order: 3,
    layout: "compact",
    status: "published",
    title: "Notification Platform — Event-Driven Backend",
    summary:
      "A NestJS microservices backend that accepts notification requests over HTTP and routes them through Kafka to email and SMS workers.",
    stack: ["NestJS", "Apache Kafka", "PostgreSQL", "Prisma", "Nodemailer", "Twilio"],
    source: { kind: "public", url: "https://github.com/Akashkpillai/notificationservice" },
    reviewedCommit: "f202b4837fb2ff4fd96dcdcde3497e7a44c2f01a",
    preview: {
      kind: "architecture",
      caption: "Explanatory architecture diagram drawn from the reviewed source, not a screenshot.",
    },
    caseStudy: notificationPlatform,
  },
  {
    slug: "user-management-api",
    order: 5,
    layout: "compact",
    status: "draft", // Unpublished by the owner 2026-10-25 (feature 003 FR-016).
    title: "User Management API — Roles & Relational Data",
    summary:
      "A NestJS and Prisma REST API for managing users with admin and user roles and a country, state, and city data model.",
    stack: ["NestJS", "TypeScript", "Prisma", "PostgreSQL", "JWT", "Swagger", "Compodoc"],
    source: { kind: "public", url: "https://github.com/Akashkpillai/user-management-with-prisma" },
    reviewedCommit: "97603df57820c47d0dc0256aa031ef26aadddc7b",
    preview: {
      kind: "data-model",
      caption: "Explanatory data-model diagram drawn from the reviewed source, not a screenshot.",
    },
    caseStudy: userManagementApi,
  },
];

export const publishedProjects: readonly Project[] = projects
  .filter((project) => project.status === "published")
  .sort((a, b) => a.order - b.order);

export function getPublishedProject(slug: string): Project | undefined {
  return publishedProjects.find((project) => project.slug === slug);
}

export function repositoryName(project: Project): string | undefined {
  if (project.source.kind !== "public") {
    return undefined;
  }
  return new URL(project.source.url).pathname.split("/").filter(Boolean).at(-1);
}
