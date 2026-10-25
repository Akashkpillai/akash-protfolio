import type { Metadata } from "next";
import { ProjectStory } from "@/components/work/ProjectStory";
import { workIntro } from "@/content/pages";
import { publishedProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/work",
  title: `Work | ${profile.name}`,
  description: workIntro,
});

export default function WorkPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <div className="work-index site-shell">
        <p className="eyebrow">Work</p>
        <h1>Selected work</h1>
        <p className="work-index-intro">{workIntro}</p>
        <div className="project-stories">
          {publishedProjects.map((project) => (
            <ProjectStory key={project.slug} project={project} headingLevel={2} />
          ))}
        </div>
      </div>
    </main>
  );
}
