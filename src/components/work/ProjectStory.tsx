import Link from "next/link";
import type { Project } from "@/content/projects";
import { projectAccents } from "@/content/systems";
import { Tilt } from "@/components/motion/Tilt";
import { ProjectPreview } from "@/components/work/ProjectPreview";
import { evidenceNote, evidenceNoteText } from "@/lib/evidence-note";

// A project card (feature 006 FR-013, reorganised in feature 008 FR-009): the problem, what the
// project does, and my contribution lead; stack, the explanatory preview, a derived evidence
// note, and the case-study action follow. Every sentence is an existing record, verbatim.
// Featured cards put the preview beside the copy; compact cards put it below. The Tilt wrapper
// (restrained in feature 008 Revision 1) carries the card's grid placement.
export function ProjectStory({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const number = String(project.order).padStart(2, "0");
  const titleId = `story-${project.slug}`;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const { problem, contribution } = project.caseStudy;

  return (
    <Tilt className={`project-tilt project-tilt-${project.layout}`}>
    <article
      className={`project-story project-story-${project.layout} lab-accent-${projectAccents[project.slug]}`}
      aria-labelledby={titleId}
    >
      <div className="project-story-copy">
        <span className="project-story-number" aria-hidden="true">
          {number}
        </span>
        <Heading id={titleId}>
          <Link href={`/work/${project.slug}`}>{project.title}</Link>
        </Heading>
        <dl className="story-facts">
          {problem[0] && (
            <div>
              <dt>The problem</dt>
              <dd>{problem[0].text}</dd>
            </div>
          )}
          <div>
            <dt>What it does</dt>
            <dd>{project.summary}</dd>
          </div>
          {contribution.length > 0 && (
            <div className="story-contribution">
              <dt>My contribution</dt>
              <dd>
                {contribution.map((claim) => (
                  <p key={claim.text}>{claim.text}</p>
                ))}
              </dd>
            </div>
          )}
        </dl>
        <ul className="stack-list" aria-label="Stack">
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <ProjectPreview project={project} />
      <div className="project-story-foot">
        <ul className="evidence-note" aria-label="Evidence">
          {evidenceNoteText(evidenceNote(project)).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <Link className="project-story-link" href={`/work/${project.slug}`}>
          Open case study<span className="visually-hidden">: {project.title}</span>{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
    </Tilt>
  );
}
