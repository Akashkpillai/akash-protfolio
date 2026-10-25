import { claimStatusLabels, type ClaimStatus } from "@/content/claim-status";
import { contactLinks, email } from "@/content/contact";
import { roles, type YearMonth } from "@/content/experience";
import { profile } from "@/content/profile";
import { publishedProjects, repositoryName } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { systemFlows } from "@/content/systems";
import { hasResume, resumeHref } from "@/lib/resume";

// Ask the lab's knowledge (feature 007 FR-009). Server-only: built from published content,
// passed to the dialog as plain props. `text` and `items` are copied verbatim from
// src/content (checked by specs/007-lab-companion-motion/verification/check-lab-knowledge.mjs);
// `label` is a short interface label or a verbatim name; `note` holds derived dates only.

export type LabParagraph = {
  label?: string;
  text?: string;
  items?: readonly string[];
  note?: string;
  status?: string;
};

export type LabLink = { label: string; href: string };

export type LabTopic = {
  id: string;
  label: string;
  // Strong terms (names) count three times; keywords once.
  strong: readonly string[];
  keywords: readonly string[];
  paragraphs: readonly LabParagraph[];
  links: readonly LabLink[];
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const month = ({ year, month: m }: YearMonth) => `${monthNames[m - 1]} ${year}`;

const shortName = (title: string) => title.split(" — ")[0];
const status = (value?: ClaimStatus) => (value ? claimStatusLabels[value] : undefined);

// Words in project names too generic to identify a project on their own.
const genericWords = new Set(["backend", "platform", "assistant"]);

// Extra match terms per project, from each project's own stack and case study.
const aliases: Record<string, readonly string[]> = {
  "hrms-backend": ["hr", "hrms", "leave", "attendance", "onboarding", "tenant", "payroll", "employee"],
  "meridian-assistant": ["meridian", "discord", "rag", "proposal", "retrieval", "pgvector", "bot", "agent"],
  "notification-platform": ["notification", "notifications", "kafka", "email", "sms", "twilio", "event"],
  "resume-analyzer": ["resume", "analyzer", "pdf", "parse", "parsing", "groq", "cv"],
};

export function labTopics(): LabTopic[] {
  const links = {
    work: { label: "All work", href: "/work" },
    about: { label: "About", href: "/#about" },
    experience: { label: "Experience", href: "/#experience" },
    skills: { label: "Skills", href: "/#skills" },
    message: { label: "Send a message", href: "/#message" },
  };
  const contact = contactLinks.map((link) => ({ label: link.label, href: link.href }));
  const resume = hasResume() ? [{ label: "Download résumé (PDF)", href: resumeHref }] : [];

  const general: LabTopic[] = [
    {
      id: "about",
      label: "Who is Akash?",
      strong: ["akash", "who"],
      keywords: ["about", "background", "physics", "study", "studied", "education", "degree", "introduce", "yourself", "kerala", "language"],
      paragraphs: [
        ...profile.about.map((text) => ({ text })),
        { label: "Location", text: profile.location },
        { label: "Languages", items: profile.languages.map((language) => language.name) },
      ],
      links: [links.about],
    },
    {
      id: "projects",
      label: "What has he built?",
      strong: ["projects", "built"],
      keywords: ["project", "build", "portfolio", "case", "study", "studies", "showcase", "made"],
      paragraphs: publishedProjects.map((project) => ({ label: shortName(project.title), text: project.summary })),
      links: [links.work, ...publishedProjects.map((project) => ({ label: shortName(project.title), href: `/work/${project.slug}` }))],
    },
    {
      id: "experience",
      label: "Where has he worked?",
      strong: ["experience", "worked"],
      keywords: ["job", "jobs", "work", "history", "company", "companies", "role", "career", "years"],
      // No organization names (or terms from private-evidence/terms.txt): this knowledge ships
      // with every page, and case-study pages must name no organization (features 003, 004).
      // Companies are shown in the Experience section.
      paragraphs: roles.map((role) => ({
        label: role.title,
        note: `${month(role.start)} – ${role.end === "present" ? "Present" : month(role.end)}`,
        items: role.highlights,
      })),
      links: [{ label: "Companies and dates in Experience", href: "/#experience" }],
    },
    {
      id: "skills",
      label: "What's his stack?",
      strong: ["stack", "skills"],
      keywords: ["skill", "tech", "technology", "technologies", "tool", "tools", "framework", "language", "database", "know", "nestjs", "node", "typescript", "postgresql", "postgres", "ai", "llm"],
      paragraphs: skillGroups.map((group) => ({ label: group.name, items: group.skills.map((skill) => skill.name) })),
      links: [links.skills],
    },
    {
      id: "unfinished",
      label: "What's unfinished?",
      strong: ["unfinished", "limitations"],
      keywords: ["limitation", "incomplete", "missing", "gap", "gaps", "todo", "weakness", "untested", "unbuilt", "honest"],
      paragraphs: publishedProjects.flatMap((project) => {
        const { caseStudy } = project;
        const claims = [...caseStudy.implementation, ...caseStudy.limitations].filter((claim) => claim.status === "unfinished");
        const steps = (systemFlows[project.slug]?.branch?.steps ?? []).concat(systemFlows[project.slug]?.steps ?? []).filter((step) => step.status === "unfinished");
        const items = [...new Set([...claims.map((claim) => claim.text), ...steps.map((step) => step.detail)])];
        return items.length ? [{ label: shortName(project.title), items, status: claimStatusLabels.unfinished }] : [];
      }),
      links: publishedProjects.map((project) => ({ label: shortName(project.title), href: `/work/${project.slug}#limitations` })),
    },
    {
      id: "contact",
      label: "How can I contact him?",
      strong: ["contact", "email"],
      keywords: ["hire", "reach", "linkedin", "github", "resume", "cv", "message", "talk", "call", "connect", "available", "touch"],
      paragraphs: [{ label: "Email", text: email }],
      links: [links.message, ...contact, ...resume],
    },
  ];

  const projects: LabTopic[] = publishedProjects.map((project) => {
    const { caseStudy } = project;
    const flow = systemFlows[project.slug];
    const limitation = caseStudy.limitations[0];
    const source = repositoryName(project);
    return {
      id: project.slug,
      label: `Tell me about ${shortName(project.title)}`,
      strong: [
        ...shortName(project.title).toLowerCase().split(/\s+/).filter((word) => !genericWords.has(word)),
        ...(aliases[project.slug] ?? []),
      ],
      keywords: project.stack.map((item) => item.toLowerCase()),
      paragraphs: [
        { text: project.summary },
        ...(caseStudy.contribution[0] ? [{ label: "My contribution", text: caseStudy.contribution[0].text }] : []),
        ...(flow ? [{ label: "How it works", items: flow.steps.map((step) => step.label) }] : []),
        { label: "Stack", items: project.stack },
        ...(limitation ? [{ label: "A limitation", text: limitation.text, status: status(limitation.status) }] : []),
      ],
      links: [
        { label: "Open the case study", href: `/work/${project.slug}` },
        ...(project.source.kind === "public" && source ? [{ label: `Source: ${source} on GitHub`, href: project.source.url }] : []),
      ],
    };
  });

  return [...general, ...projects];
}
