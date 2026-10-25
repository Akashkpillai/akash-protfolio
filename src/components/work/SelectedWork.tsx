import Link from "next/link";
import { publishedProjects } from "@/content/projects";
import { ProjectStory, type StoryLayout } from "@/components/work/ProjectStory";

const layouts: readonly StoryLayout[] = ["preview-right", "preview-left", "full-width"];

export function SelectedWork() {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title" tabIndex={-1}>
      <div className="site-shell">
        <p className="eyebrow">02 / Selected work</p>
        <h2 id="work-title">Three systems, explained from their source</h2>
        <p className="work-intro">
          Each project is described from a read-only review of its public repository, with
          unfinished parts and untested paths marked.
        </p>
        <div className="project-stories">
          {publishedProjects.map((project, index) => (
            <ProjectStory
              key={project.slug}
              project={project}
              layout={layouts[index % layouts.length]}
            />
          ))}
        </div>
        <Link className="work-all-link" href="/work">
          View all work <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
