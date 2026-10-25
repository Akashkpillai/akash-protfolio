import type { ClaimStatus } from "@/content/claim-status";
import type { ProjectSlug } from "@/content/projects";

// Systems Lab content (feature 006). Server-only: client components receive plain props
// built from these records, never this module, so draft entries cannot reach the browser.

export type Accent = "teal" | "cobalt" | "copper" | "sand";

// Fixed per project, so a project keeps its colour when others are published or drafted.
export const projectAccents: Record<ProjectSlug, Accent> = {
  "resume-analyzer": "teal",
  "notification-platform": "cobalt",
  "hrms-backend": "copper",
  "meridian-assistant": "sand",
  "user-management-api": "teal",
};

// Every step cites claim IDs from docs/project-evidence.md (FR-009). `status` repeats the
// case study's label for unfinished or unexercised code.
export type FlowStep = {
  id: string;
  label: string;
  detail: string;
  evidence: readonly string[];
  status?: ClaimStatus;
};

export type SystemFlow = {
  steps: readonly FlowStep[];
  branch?: { from: string; label: string; steps: readonly FlowStep[] };
};

export const systemFlows: Partial<Record<ProjectSlug, SystemFlow>> = {
  "resume-analyzer": {
    steps: [
      {
        id: "upload",
        label: "PDF upload",
        detail: "Accepts up to 20 PDF files per request, 10 MB each, and rejects other file types.",
        evidence: ["RA-01"],
      },
      {
        id: "extract",
        label: "Text extraction",
        detail: "Reads each PDF's text with pdf-parse.",
        evidence: ["RA-02"],
      },
      {
        id: "cleanup",
        label: "Cleanup",
        detail: "Strips null characters and trailing whitespace from the extracted text.",
        evidence: ["RA-02"],
      },
      {
        id: "parse",
        label: "AI parsing",
        detail: "Sends the first 4,000 characters to a model through the Groq API and asks for structured JSON.",
        evidence: ["RA-03", "RA-L1"],
      },
      {
        id: "store",
        label: "Structured record",
        detail: "Stores the raw text and parsed JSON in PostgreSQL through Prisma, linked to the user.",
        evidence: ["RA-06"],
      },
      {
        id: "query",
        label: "Search and filters",
        detail: "Text search, skill filters, pagination, and skill statistics, scoped to the signed-in user.",
        evidence: ["RA-07", "RA-08", "RA-09"],
      },
    ],
    branch: {
      from: "parse",
      label: "If AI parsing fails",
      steps: [
        {
          id: "fallback",
          label: "Basic fallback parser",
          detail: "A regex parser extracts email, phone, links, and listed skills, so the upload still produces a record.",
          evidence: ["RA-04", "RA-L2"],
          status: "implemented-code-path",
        },
      ],
    },
  },
  "notification-platform": {
    steps: [
      {
        id: "gateway",
        label: "API gateway",
        detail: "Authenticates and rate-limits POST /notifications, adds an event ID, and publishes without waiting for delivery.",
        evidence: ["NP-01", "NP-D2"],
      },
      {
        id: "kafka",
        label: "Kafka topics",
        detail: "The services are separate applications that communicate only through Kafka topics.",
        evidence: ["NP-D1", "NP-06"],
      },
      {
        id: "router",
        label: "Router",
        detail: "Stores a pending Notification record and republishes the event to the email, SMS, or push topic.",
        evidence: ["NP-02"],
      },
      {
        id: "workers",
        label: "Email and SMS workers",
        detail: "Send through Nodemailer or Twilio; failed sends publish retry or dead-letter events, which nothing consumes yet.",
        evidence: ["NP-03", "NP-04", "NP-05", "NP-L2"],
        status: "implemented-code-path",
      },
      {
        id: "record",
        label: "Status in PostgreSQL",
        detail: "Workers record sent, failed, or dead, but look records up by the event ID rather than the stored ID; this has not been run to confirm.",
        evidence: ["NP-03", "NP-05", "NP-L3"],
        status: "implemented-code-path",
      },
    ],
    branch: {
      from: "router",
      label: "Push channel",
      steps: [
        {
          id: "push",
          label: "Push worker",
          detail: "A placeholder that does not consume the push topic.",
          evidence: ["NP-L1"],
          status: "unfinished",
        },
      ],
    },
  },
  "hrms-backend": {
    steps: [
      {
        id: "tenant",
        label: "Tenant-scoped data",
        detail: "Most records carry a tenant identifier, and scheduled jobs run once per tenant.",
        evidence: ["HR-02"],
      },
      {
        id: "module",
        label: "HR module",
        detail: "One of about 37 feature modules, such as leave or attendance, applies its HR rules.",
        evidence: ["HR-01", "HR-03", "HR-04"],
      },
      {
        id: "workflow",
        label: "Approval workflow",
        detail: "Approvals go to one shared workflow engine, built by teammates.",
        evidence: ["HR-D2", "HR-L1"],
      },
      {
        id: "audit",
        label: "Audit and storage",
        detail: "Modules record changes through their own audit services and store data in PostgreSQL.",
        evidence: ["HR-10", "HR-01"],
      },
      {
        id: "email",
        label: "Email notification",
        detail: "Templated emails with a send log; failed sends retry with exponential backoff.",
        evidence: ["HR-08", "HR-D3"],
      },
    ],
  },
  "meridian-assistant": {
    steps: [
      {
        id: "command",
        label: "Discord command",
        detail: "A slash command such as /ask or /propose arrives; every reply is visible only to the requester.",
        evidence: ["MA-01"],
      },
      {
        id: "actor",
        label: "Actor check",
        detail: "Unknown users get only a needs-approval reply; tools use the approved user's one brand and ignore brand or role arguments.",
        evidence: ["MA-02", "MA-06"],
      },
      {
        id: "retrieve",
        label: "Brand-filtered retrieval",
        detail: "The brand and confidentiality filter runs in SQL before pgvector similarity picks the top five sections.",
        evidence: ["MA-03"],
      },
      {
        id: "answer",
        label: "Source-backed answer",
        detail: "A claim is kept only if its document and section were retrieved on that run; otherwise the library cannot answer.",
        evidence: ["MA-04"],
      },
    ],
    branch: {
      from: "actor",
      label: "Proposal workflow",
      steps: [
        {
          id: "estimate",
          label: "Estimate versions",
          detail: "Each edit inserts a new version; database triggers keep versions immutable.",
          evidence: ["MA-07"],
        },
        {
          id: "approve",
          label: "Stored approval",
          detail: "Approval locks the chain and approves only the latest version, owned by the approver in their brand.",
          evidence: ["MA-08"],
        },
        {
          id: "render",
          label: "DOCX render",
          detail: "A DOCX renders only when a stored approval exists for that user and version.",
          evidence: ["MA-09"],
        },
      ],
    },
  },
};

// Owner-supplied statements (2026-10-26); shown as statements, not status or monitoring data.
export const focusStatements = [
  "Building useful backend systems",
  "Exploring practical AI applications",
  "Making complexity easier to understand",
] as const;
