import type { ProjectSlug } from "@/content/projects";

// The résumé's six groups and order (2026-10-25). `caseStudy` is set only where that case
// study's reviewed evidence shows the skill; links render only for published projects.
export type SkillGroup = {
  name: string;
  skills: readonly { name: string; caseStudy?: ProjectSlug }[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    name: "Languages & Backend",
    skills: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Node.js" },
      { name: "NestJS", caseStudy: "hrms-backend" },
      { name: "Express.js" },
      { name: "Sails.js" },
      { name: "REST APIs" },
    ],
  },
  {
    name: "AI & Retrieval",
    skills: [
      { name: "OpenAI API", caseStudy: "meridian-assistant" },
      { name: "Groq API", caseStudy: "resume-analyzer" },
      { name: "RAG", caseStudy: "meridian-assistant" },
      { name: "pgvector", caseStudy: "meridian-assistant" },
      { name: "Embeddings", caseStudy: "meridian-assistant" },
      { name: "Vector search", caseStudy: "meridian-assistant" },
      { name: "Tool/function calling", caseStudy: "meridian-assistant" },
      { name: "Conversational assistants" },
      { name: "Custom agent workflows", caseStudy: "meridian-assistant" },
    ],
  },
  {
    name: "Databases & Architecture",
    skills: [
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "Prisma", caseStudy: "resume-analyzer" },
      { name: "Mongoose" },
      { name: "Redis" },
      { name: "Kafka", caseStudy: "notification-platform" },
      { name: "Microservices", caseStudy: "notification-platform" },
      { name: "Event-driven architecture", caseStudy: "notification-platform" },
    ],
  },
  {
    name: "Quality & Security",
    skills: [
      { name: "Jest" },
      { name: "API testing" },
      { name: "JWT" },
      { name: "bcrypt" },
      { name: "RBAC" },
      { name: "Deterministic evaluations", caseStudy: "meridian-assistant" },
      { name: "Citation validation", caseStudy: "meridian-assistant" },
      { name: "Bounded retries", caseStudy: "meridian-assistant" },
      { name: "Agent step limits", caseStudy: "meridian-assistant" },
      { name: "Token/cost tracking" },
    ],
  },
  {
    name: "Tools & Integrations",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "Docker" },
      { name: "Docker Compose", caseStudy: "meridian-assistant" },
      { name: "Swagger/OpenAPI" },
      { name: "Postman" },
      { name: "Jira" },
      { name: "Nodemailer", caseStudy: "notification-platform" },
      { name: "EJS" },
      { name: "Razorpay" },
      { name: "PayPal" },
      { name: "Stripe" },
      { name: "Twilio", caseStudy: "notification-platform" },
      { name: "TMDB" },
      { name: "YouTube API" },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "React.js" },
      { name: "HTML" },
      { name: "CSS" },
      { name: "Tailwind CSS" },
      { name: "Material UI" },
    ],
  },
];
