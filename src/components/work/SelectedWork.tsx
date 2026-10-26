import Link from "next/link";
import { publishedProjects } from "@/content/projects";
import { Reveal } from "@/components/lab/Reveal";
import { ProjectStory } from "@/components/work/ProjectStory";

// Problem-first project cards (feature 008 FR-008–FR-010): featured cards first, then the
// compact pair. Review details stay on each card's evidence line and in the case studies.
export function SelectedWork() {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title" tabIndex={-1} data-probe-section="work">
      <div className="site-shell">
        <p className="eyebrow" data-probe-tip="What each project solves, and what I built.">02 / Selected work</p>
        <h2 id="work-title">Built to solve real problems</h2>
        <p className="work-intro">
          What each project solves, what it does, and what I built. Each case study goes deeper,
          including the parts that are unfinished.
        </p>
        <div className="project-stories">
          {publishedProjects.map((project) => (
            <Reveal className={`project-slot project-slot-${project.layout}`} key={project.slug}>
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
