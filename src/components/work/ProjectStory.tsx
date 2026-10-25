import Link from "next/link";
import type { Project } from "@/content/projects";
import { projectAccents } from "@/content/systems";
import { Tilt } from "@/components/motion/Tilt";
import { ProjectPreview } from "@/components/work/ProjectPreview";
import { evidenceNote, evidenceNoteText } from "@/lib/evidence-note";

// A system preview card (feature 006 FR-013): title, summary, stack, a derived evidence
// note, the explanatory preview, and the case-study action. Server-rendered; the Tilt wrapper
// (feature 007) only adds a decorative pointer effect around it.
export function ProjectStory({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const number = String(project.order).padStart(2, "0");
  const titleId = `story-${project.slug}`;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Tilt>
    <article className={`project-story lab-accent-${projectAccents[project.slug]}`} aria-labelledby={titleId}>
      <div className="project-story-copy">
        <span className="project-story-number" aria-hidden="true">
          {number}
        </span>
        <Heading id={titleId}>
          <Link href={`/work/${project.slug}`}>{project.title}</Link>
        </Heading>
        <p className="project-story-summary">{project.summary}</p>
        <ul className="stack-list" aria-label="Stack">
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <ul className="evidence-note" aria-label="Evidence">
          {evidenceNoteText(evidenceNote(project)).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <ProjectPreview project={project} />
      <Link className="project-story-link" href={`/work/${project.slug}`}>
        Open case study<span className="visually-hidden">: {project.title}</span>{" "}
        <span aria-hidden="true">→</span>
      </Link>
    </article>
    </Tilt>
  );
}
