import type { Metadata } from "next";
import Link from "next/link";
import { publishedProjects } from "@/content/projects";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: `Work | ${profile.name}`,
  description: "Case studies of three backend projects, written from a review of their public source.",
};

export default function WorkPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <div className="work-index site-shell">
        <p className="eyebrow">Work</p>
        <h1>Selected work</h1>
        <p className="work-index-intro">
          Three backend projects, each described from a read-only review of its public
          repository. Unfinished parts and untested paths are labeled in every case study.
        </p>
        <ol className="work-index-list">
          {publishedProjects.map((project) => (
            <li key={project.slug}>
              <span className="work-index-number" aria-hidden="true">
                {String(project.order).padStart(2, "0")}
              </span>
              <div>
                <h2>
                  <Link href={`/work/${project.slug}`}>{project.title}</Link>
                </h2>
                <p>{project.summary}</p>
                <ul className="stack-list" aria-label="Stack">
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
