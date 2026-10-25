import type { CaseStudy } from "@/content/projects";

// Every claim cites IDs from the HRMS Backend section of docs/project-evidence.md
// (reviewed commit 9456d56). Described at module level only: no code, internal names,
// or people's data. Decision reasons appear only when owner-confirmed.
export const hrmsBackend: CaseStudy = {
  problem: [
    {
      text: "An HR team needs one backend for the whole employee lifecycle — from joining, through leave, attendance, and scheduling, to leaving — with approvals, documents, and notifications, for several organizations kept separate from each other.",
      evidence: ["HR-01", "HR-02"],
    },
  ],
  contribution: [
    {
      text: "I built most of the HR modules — leave, attendance, onboarding, documents, scheduling and more — in a multi-tenant backend developed by a small team.",
      evidence: ["HR-L1"],
    },
    {
      text: "Teammates built the platform layer: authentication, tenancy, the shared workflow engine, and billing.",
      evidence: ["HR-L1"],
    },
  ],
  implementation: [
    {
      text: "The backend is a modular NestJS service with about 37 feature modules on PostgreSQL through TypeORM. Data is scoped by tenant, and scheduled jobs run once per tenant.",
      evidence: ["HR-01", "HR-02"],
    },
    {
      text: "Leave covers categories, balances kept as a transaction history, carry-forward, encashment, and a leave calendar. A daily scheduled job accrues leave per tenant.",
      status: "implemented-code-path",
      evidence: ["HR-03"],
    },
    {
      text: "Leave requests go through multi-level approval in the shared workflow engine; when a level has no workflow configured, the request falls back to the next level.",
      status: "implemented-code-path",
      evidence: ["HR-03", "HR-D2"],
    },
    {
      text: "Attendance handles records, policies, regularization with approval, and reports, reading approved leave and holidays through adapter services.",
      evidence: ["HR-04", "HR-D1"],
    },
    {
      text: "Onboarding runs from the offer and candidate joining form through document verification, identity-document extraction, asset requests, and induction, to creating the employee record and account.",
      evidence: ["HR-05"],
    },
    {
      text: "Shift rosters and workforce scheduling cover roster generation, rotation, swaps, weekly offs, coverage rules, conflict checks, and schedule change requests with approval.",
      evidence: ["HR-06"],
    },
    {
      text: "Documents support folders, versions, approvals, expiry, e-signature, sharing, and permissions, with files kept in S3 storage and served through signed URLs.",
      evidence: ["HR-07"],
    },
    {
      text: "Email notifications use branded templates and a send log; a failed send is retried with exponential backoff.",
      status: "implemented-code-path",
      evidence: ["HR-08"],
    },
    {
      text: "Further modules cover probation, overtime with compensatory off and payroll data, timesheets, salary structures, offboarding with asset return and letters, and employment documents. Each module records changes in its own audit trail.",
      evidence: ["HR-09", "HR-10"],
    },
    {
      text: "The repository holds about 250 unit test files and 200 integration test files, and keeps schema changes as per-module migrations. This review did not run the tests.",
      evidence: ["HR-11", "HR-L3"],
    },
  ],
  architecture: {
    kind: "module-map",
    interactive: false,
    title: "HR modules and shared services",
    summary:
      "Requests pass through a shared API layer that handles sign-in, permissions, and tenant scope. HR modules own their own data in PostgreSQL, share approvals through one workflow engine, and read each other's data through adapters. The diagram shows a selection of the modules.",
    components: [
      {
        id: "employee",
        name: "Employee records",
        responsibility: "Employee profiles and records that most other modules read.",
        evidence: ["HR-01"],
        grid: { column: 0, row: 0 },
      },
      {
        id: "api",
        name: "API layer (team)",
        shortName: "API layer",
        responsibility: "Sign-in with JSON Web Tokens, role permissions, and tenant scope for every request. Built by teammates.",
        evidence: ["HR-02", "HR-L1"],
        grid: { column: 2, row: 0 },
      },
      {
        id: "onboarding",
        name: "Onboarding",
        responsibility: "Offer, joining form, document and identity checks, asset requests, and induction, ending in a new employee record and account.",
        evidence: ["HR-05"],
        grid: { column: 0, row: 1 },
      },
      {
        id: "leave",
        name: "Leave",
        responsibility: "Categories, balances with a transaction history, daily accrual, carry-forward, encashment, and multi-level approval.",
        evidence: ["HR-03"],
        grid: { column: 1, row: 1 },
      },
      {
        id: "attendance",
        name: "Attendance",
        responsibility: "Records, policies, regularization with approval, and reports.",
        evidence: ["HR-04"],
        grid: { column: 2, row: 1 },
      },
      {
        id: "scheduling",
        name: "Rosters and scheduling",
        shortName: "Scheduling",
        responsibility: "Shift rosters, rotation, swaps, coverage rules, conflict checks, and schedule change requests.",
        evidence: ["HR-06"],
        grid: { column: 3, row: 1 },
      },
      {
        id: "offboarding",
        name: "Offboarding",
        responsibility: "Exit approvals, asset return, and letters.",
        evidence: ["HR-09"],
        grid: { column: 4, row: 1 },
      },
      {
        id: "documents",
        name: "Documents",
        responsibility: "Folders, versions, approvals, expiry, e-signature, and permissions; files in S3 storage behind signed URLs.",
        evidence: ["HR-07"],
        grid: { column: 0, row: 2 },
      },
      {
        id: "workflow",
        name: "Workflow engine (team)",
        shortName: "Workflow engine",
        responsibility: "Shared approval workflows used across modules. Built by teammates.",
        evidence: ["HR-D2", "HR-L1"],
        grid: { column: 2, row: 2 },
      },
      {
        id: "email",
        name: "Email notifications",
        shortName: "Email",
        responsibility: "Branded templates, a send log, and retries with exponential backoff.",
        status: "implemented-code-path",
        evidence: ["HR-08"],
        grid: { column: 4, row: 2 },
      },
    ],
    links: [
      { from: "api", to: "attendance", label: "Authenticated, tenant-scoped requests reach every module" },
      { from: "onboarding", to: "employee", label: "Creates the employee record and account" },
      { from: "onboarding", to: "documents", label: "Verifies candidate documents" },
      { from: "attendance", to: "leave", label: "Reads approved leave through an adapter" },
      { from: "leave", to: "workflow", label: "Multi-level approvals" },
      { from: "attendance", to: "workflow", label: "Regularization approvals" },
      { from: "scheduling", to: "workflow", label: "Schedule change approvals" },
      { from: "offboarding", to: "email", label: "Exit notifications" },
    ],
  },
  decisions: [
    {
      text: "Modules read each other's data through adapter services instead of querying another module's tables.",
      evidence: ["HR-D1"],
    },
    {
      text: "Approvals in every module go through one shared workflow engine, with each approval level mapped to a configured workflow.",
      evidence: ["HR-D2"],
    },
    {
      text: "Each email retry re-reads the send and its attachments from the database instead of carrying them in a queued job.",
      evidence: ["HR-D3", "HR-08"],
    },
    {
      text: "Scheduled jobs such as leave accrual run once per tenant.",
      evidence: ["HR-02", "HR-03"],
    },
  ],
  tradeoffs: [
    {
      text: "Adapters keep each module's tables private to it, at the cost of an extra layer for every cross-module read.",
      evidence: ["HR-D1"],
    },
    {
      text: "One workflow engine gives every module the same approval behavior, but each module depends on it and on its configuration.",
      evidence: ["HR-D2"],
    },
    {
      text: "Re-reading state on each email attempt lets a retry pick up current data, with an extra database read per attempt.",
      evidence: ["HR-D3"],
    },
    {
      text: "Keeping about 37 modules in one service means one deployment and shared tooling, but every module ships together.",
      evidence: ["HR-01"],
    },
  ],
  limitations: [
    {
      text: "This was built by a small team; authentication, tenancy, the workflow engine, billing, and the platform modules are my teammates' work.",
      evidence: ["HR-L1"],
    },
    {
      text: "The source is private and was reviewed at a development-branch commit; no production usage or performance figures are claimed.",
      evidence: ["HR-L2"],
    },
    {
      text: "The tests were not run for this review.",
      evidence: ["HR-L3"],
    },
    {
      text: "No independent security review has been done, and no security or scalability guarantee is made.",
      evidence: ["HR-L4"],
    },
  ],
  discrepancies: [],
};
