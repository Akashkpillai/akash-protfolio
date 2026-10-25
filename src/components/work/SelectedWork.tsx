import Link from "next/link";
import { publishedProjects } from "@/content/projects";
import { Reveal } from "@/components/lab/Reveal";
import { ProjectStory } from "@/components/work/ProjectStory";

export function SelectedWork() {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title" tabIndex={-1} data-probe-section="work">
      <div className="site-shell">
        <p className="eyebrow" data-probe-tip="Each project is described from a read-only review of its source code.">02 / Selected work</p>
        <h2 id="work-title">Systems, explained from their source</h2>
        <p className="work-intro">
          Each project is described from a read-only review of its source code, with
          unfinished parts and untested paths marked.
        </p>
        <div className="project-stories">
          {publishedProjects.map((project, index) => (
            <Reveal variant={index % 2 ? "right" : "left"} key={project.slug}>
              <ProjectStory project={project} />
            </Reveal>
          ))}
        </div>
        <Link className="work-all-link" href="/work">
          View all work <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
