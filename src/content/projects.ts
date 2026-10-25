import { notificationPlatform } from "@/content/case-studies/notification-platform";
import { resumeAnalyzer } from "@/content/case-studies/resume-analyzer";
import { userManagementApi } from "@/content/case-studies/user-management-api";
import type { ClaimStatus } from "@/content/claim-status";

export type { ClaimStatus } from "@/content/claim-status";

export type ProjectSlug =
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

export type DiagramKind = "pipeline" | "architecture" | "data-model";

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

export type Project = {
  slug: ProjectSlug;
  order: 1 | 2 | 3;
  status: "draft" | "published";
  title: string;
  summary: string;
  stack: readonly string[];
  repositoryUrl: string;
  reviewedCommit: string;
  demo?: { url: string; checkedOn: string; flowChecked: string };
  preview: { kind: DiagramKind; caption: string };
  caseStudy: CaseStudy;
};

const projects: readonly Project[] = [
  {
    slug: "resume-analyzer",
    order: 1,
    status: "published",
    title: "Resume Analyzer — AI Document Processing",
    summary:
      "A full-stack app that turns uploaded PDF résumés into structured, searchable records, with a basic fallback when AI parsing fails.",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "Groq API", "pdf-parse", "React", "Vite"],
    repositoryUrl: "https://github.com/Akashkpillai/resume-analyzer",
    reviewedCommit: "e0d61a854566aff4f3256e5b68d3957f06dc49bd",
    preview: {
      kind: "pipeline",
      caption: "Explanatory pipeline diagram drawn from the reviewed source, not a screenshot.",
    },
    caseStudy: resumeAnalyzer,
  },
  {
    slug: "notification-platform",
    order: 2,
    status: "published",
    title: "Notification Platform — Event-Driven Backend",
    summary:
      "A NestJS microservices backend that accepts notification requests over HTTP and routes them through Kafka to email and SMS workers.",
    stack: ["NestJS", "Apache Kafka", "PostgreSQL", "Prisma", "Nodemailer", "Twilio"],
    repositoryUrl: "https://github.com/Akashkpillai/notificationservice",
    reviewedCommit: "f202b4837fb2ff4fd96dcdcde3497e7a44c2f01a",
    preview: {
      kind: "architecture",
      caption: "Explanatory architecture diagram drawn from the reviewed source, not a screenshot.",
    },
    caseStudy: notificationPlatform,
  },
  {
    slug: "user-management-api",
    order: 3,
    status: "published",
    title: "User Management API — Roles & Relational Data",
    summary:
      "A NestJS and Prisma REST API for managing users with admin and user roles and a country, state, and city data model.",
    stack: ["NestJS", "TypeScript", "Prisma", "PostgreSQL", "JWT", "Swagger", "Compodoc"],
    repositoryUrl: "https://github.com/Akashkpillai/user-management-with-prisma",
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

export function repositoryName(project: Project): string {
  return new URL(project.repositoryUrl).pathname.split("/").filter(Boolean).at(-1) ?? "";
}
