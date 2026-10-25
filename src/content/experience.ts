// From the owner's corrected résumé (2026-10-25) and the spec's clarifications:
// both employers named; the IITIL entry uses the HRMS case study's wording but does not
// name or link it (FR-003, FR-004); InFineIT ended July 2026 (FR-005).
export type YearMonth = { year: number; month: number };

export type Role = {
  title: string;
  organization: string;
  location: string;
  start: YearMonth;
  end: YearMonth | "present";
  highlights: readonly string[];
  projects?: readonly { name: string; period: string; summary: string; stack: readonly string[] }[];
};

export const roles: readonly Role[] = [
  {
    title: "Software Developer",
    organization: "IITIL (Innovative Information Technologies India Limited)",
    location: "Remote",
    start: { year: 2026, month: 7 },
    end: "present",
    highlights: [
      "Built most of the HR modules in an HR management backend developed by a small team, using NestJS and PostgreSQL.",
      "Implemented notification services and Nodemailer email delivery, and created Swagger API documentation for frontend integration.",
      "Ran project demonstrations, resolved frontend integration issues, and guided new developers through the codebase and API workflows.",
      "Built an OpenAI-powered HR assistant for employee information, date-specific leave enquiries, and upcoming holidays.",
    ],
  },
  {
    title: "Backend Developer",
    organization: "InFineIT Global Services LLP",
    location: "Surat, Gujarat, India",
    start: { year: 2023, month: 3 },
    end: { year: 2026, month: 7 },
    highlights: [
      "Built and maintained REST APIs and backend services with Node.js, Express.js, NestJS, and Sails.js for production web applications.",
      "Led backend development with NestJS, Prisma, and PostgreSQL, including schema design, database integration, and API architecture.",
      "Optimized API performance and database queries, tested services with Postman and Jest, and resolved critical production bugs.",
      "Mentored 2 junior developers on backend practices, code quality, and Git workflows.",
    ],
    projects: [
      {
        name: "FineOne — Unified Diamond Platform",
        period: "2025 – 2026",
        summary:
          "Backend modules and REST APIs, Redis caching across microservices, a notification service, relational schemas and raw PostgreSQL queries, code reviews, unit testing, and internal technical learning sessions.",
        stack: ["NestJS", "PostgreSQL", "Prisma", "Redis", "Kafka", "Microservices", "Docker"],
      },
      {
        name: "FineStar — Diamond Stock Management Platform",
        period: "2023 – 2025",
        summary:
          "Role-based APIs for stock filtering and user analytics, a bidding system with validation and scheduled bidding windows, scheduled email notifications with EJS templates, and MongoDB aggregation queries for reporting.",
        stack: ["Sails.js", "Node.js", "MongoDB", "Mongoose", "Nodemailer"],
      },
    ],
  },
];
