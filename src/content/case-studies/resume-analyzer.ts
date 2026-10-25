import type { CaseStudy } from "@/content/projects";

// Every claim cites IDs from the Resume Analyzer section of docs/project-evidence.md
// (reviewed commit e0d61a8). Decision reasons appear only when owner-confirmed.
export const resumeAnalyzer: CaseStudy = {
  problem: [
    {
      text: "A PDF résumé is easy for a person to read but hard to search or filter. This project turns each uploaded PDF into a structured record — contact details, skills, experience, education, projects, and links — that its owner can search and filter by skill.",
      evidence: ["RA-01", "RA-03", "RA-08"],
    },
  ],
  contribution: [
    {
      text: "I designed and built the whole project myself: the NestJS API, the Prisma data model, the parsing pipeline, and the React dashboard.",
      evidence: [],
    },
  ],
  implementation: [
    {
      text: "The upload endpoint accepts PDF files only — up to 20 per request, 10 MB each — and is rate-limited.",
      evidence: ["RA-01"],
    },
    {
      text: "Text is extracted with pdf-parse and cleaned of null characters and trailing whitespace before it is stored.",
      evidence: ["RA-02"],
    },
    {
      text: "The cleaned text is sent to a model through the Groq API with a prompt asking for JSON: name, contact details, skills, experience, education, projects, and links. Links are normalized to include a protocol and tagged by site.",
      evidence: ["RA-03", "RA-05"],
    },
    {
      text: "If the API key is missing, the call fails, or the response is not valid JSON, a basic regex parser runs instead, so the upload still produces a record.",
      status: "implemented-code-path",
      evidence: ["RA-04"],
    },
    {
      text: "Each résumé is stored through Prisma in PostgreSQL with its raw text and parsed JSON. Every list, detail, delete, and statistics query is scoped to the signed-in user.",
      evidence: ["RA-06", "RA-07"],
    },
    {
      text: "Users can search raw text, filter by skill, page through results, and see how often each skill appears across their uploads.",
      evidence: ["RA-08", "RA-09"],
    },
    {
      text: "Accounts use bcrypt-hashed passwords and JSON Web Tokens, and a global rate limit applies to the API.",
      evidence: ["RA-10"],
    },
    {
      text: "A React and Vite dashboard covers upload, search, skill filters, and matching résumés against required and optional skills in the browser.",
      evidence: ["RA-11"],
    },
  ],
  architecture: {
    kind: "pipeline",
    interactive: false,
    title: "Résumé processing pipeline",
    summary:
      "An upload moves through text extraction and AI parsing into storage, where it becomes searchable. If AI parsing cannot produce valid JSON, a basic parser takes over before storage.",
    components: [
      {
        id: "upload",
        name: "Upload",
        responsibility: "Accepts up to 20 PDF files per request, 10 MB each, and rejects other file types.",
        evidence: ["RA-01"],
        grid: { column: 0, row: 0 },
      },
      {
        id: "extract",
        name: "Text extraction",
        responsibility: "Reads the PDF with pdf-parse and strips null characters and trailing whitespace.",
        evidence: ["RA-02"],
        grid: { column: 1, row: 0 },
      },
      {
        id: "parse",
        name: "AI parsing",
        responsibility: "Sends the first 4,000 characters to a model through the Groq API and expects structured JSON back.",
        evidence: ["RA-03", "RA-L1"],
        grid: { column: 2, row: 0 },
      },
      {
        id: "fallback",
        name: "Basic fallback",
        responsibility: "Regex parsing for email, phone, links, and a fixed list of skills when AI parsing fails.",
        status: "implemented-code-path",
        evidence: ["RA-04"],
        grid: { column: 2, row: 1 },
      },
      {
        id: "store",
        name: "Storage (PostgreSQL via Prisma)",
        shortName: "Storage",
        responsibility: "Saves the file details, raw text, and parsed JSON, linked to the user.",
        evidence: ["RA-06"],
        grid: { column: 3, row: 0 },
      },
      {
        id: "query",
        name: "Search and filters",
        responsibility: "User-scoped text search, skill filtering, pagination, and skill statistics.",
        evidence: ["RA-07", "RA-08", "RA-09"],
        grid: { column: 4, row: 0 },
      },
    ],
    links: [
      { from: "upload", to: "extract", label: "PDF file" },
      { from: "extract", to: "parse", label: "Cleaned text" },
      { from: "parse", to: "store", label: "Parsed JSON" },
      {
        from: "parse",
        to: "fallback",
        label: "When the key is missing, the call fails, or the JSON is invalid",
        status: "implemented-code-path",
      },
      { from: "fallback", to: "store", label: "Basic result", status: "implemented-code-path" },
      { from: "store", to: "query", label: "User-scoped records" },
    ],
  },
  decisions: [
    {
      text: "Parsing lives in its own service, separate from storage and queries.",
      evidence: ["RA-D1"],
    },
    {
      text: "A failed AI call falls back to basic parsing instead of failing the upload.",
      evidence: ["RA-D2"],
    },
    {
      text: "Both the raw text and the parsed JSON are stored: text search runs on the raw text, while skill filters and statistics use the parsed JSON.",
      evidence: ["RA-D3"],
    },
    {
      text: "Skill filtering runs in application code after loading the user's résumés. A comment in the code gives the reason: Prisma's JSON filtering is limited for case-insensitive searches inside arrays.",
      evidence: ["RA-D4"],
    },
  ],
  tradeoffs: [
    {
      text: "The fallback keeps uploads working without the AI service, but those records hold only contact details, links, and keyword-matched skills.",
      evidence: ["RA-D2", "RA-L2"],
    },
    {
      text: "In-memory skill filtering gives case-insensitive matching inside skill lists, but every résumé for the user is loaded before the page of results is cut.",
      evidence: ["RA-D4", "RA-L3"],
    },
    {
      text: "Keeping raw text alongside parsed JSON stores more data per résumé, and keeps text search working when parsing returns little.",
      evidence: ["RA-D3"],
    },
  ],
  limitations: [
    {
      text: "Only the first 4,000 characters of a résumé are sent to the AI parser, so longer résumés are only partly parsed.",
      evidence: ["RA-L1"],
    },
    {
      text: "Fallback parsing is basic: it finds email, phone, links, and skills from a fixed list, and returns no experience, education, or projects.",
      evidence: ["RA-L2"],
    },
    {
      text: "Skill filtering loads all of a user's résumés into memory before paginating.",
      evidence: ["RA-L3"],
    },
    {
      text: "Uploaded files are saved to a local folder on the server.",
      evidence: ["RA-L4"],
    },
    {
      text: "The repository has no automated tests.",
      evidence: ["RA-L5"],
    },
    {
      text: "Parsing accuracy has not been measured, and no accuracy or hiring-outcome claim is made.",
      evidence: ["RA-L6"],
    },
  ],
  discrepancies: [
    "README says TypeORM; the code uses Prisma.",
    "README names GPT-3.5-turbo; the code calls openai/gpt-oss-20b through Groq.",
  ],
};
