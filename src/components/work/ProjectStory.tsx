import Link from "next/link";
import type { Project } from "@/content/projects";
import { ProjectPreview } from "@/components/work/ProjectPreview";

export type StoryLayout = "preview-right" | "preview-left" | "full-width";

export function ProjectStory({ project, layout }: { project: Project; layout: StoryLayout }) {
  const number = String(project.order).padStart(2, "0");
  const titleId = `story-${project.slug}`;

  return (
    <article className={`project-story project-story-${layout}`} aria-labelledby={titleId}>
      <div className="project-story-copy">
        <span className="project-story-number" aria-hidden="true">
          {number}
        </span>
        <h3 id={titleId}>{project.title}</h3>
        <p className="project-story-summary">{project.summary}</p>
        <ul className="stack-list" aria-label="Stack">
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link className="project-story-link" href={`/work/${project.slug}`}>
          Read the case study<span className="visually-hidden">: {project.title}</span>{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ProjectPreview project={project} />
    </article>
  );
}
