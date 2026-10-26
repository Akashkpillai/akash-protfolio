import type { CSSProperties } from "react";
import Link from "next/link";
import { ClaimStatus } from "@/components/work/ClaimStatus";
import { AskLabButton } from "@/components/lab/AskLabButton";
import { ProjectConstellation, type LabProject } from "@/components/lab/ProjectConstellation";
import { publishedProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { projectAccents, systemFlows } from "@/content/systems";
import { baseAngle, orbitPoint } from "@/lib/orbit";
import { hasResume, resumeHref } from "@/lib/resume";

// The Systems Lab hero (feature 006), started from the owner's prototype (snapshot in
// specs/006-systems-lab-redesign/prototype/), simplified to two columns in feature 008.
// Server component: the résumé check and the project records stay on the server; the map
// receives plain data.

// Planets start evenly spaced on the tilted orbit, the first at the top (far side).
const labProjects: LabProject[] = publishedProjects.map((project, index) => ({
  slug: project.slug,
  name: project.title.split(" — ")[0],
  summary: project.summary,
  accent: projectAccents[project.slug],
  position: orbitPoint(baseAngle(index, publishedProjects.length)),
  flow: systemFlows[project.slug] ?? null,
}));

// Inline spans (not inline-block) so the heading still reads as one name; spaces stay plain text.
function letters(text: string) {
  let index = 0;
  return text.split(/(\s+)/).map((part, partIndex) =>
    /^\s+$/.test(part)
      ? part
      : [...part].map((letter) => (
          <span className="intro-letter" key={`${partIndex}-${index}`} style={{ "--i": index++ } as CSSProperties}>
            {letter}
          </span>
        )),
  );
}

export function SystemsLab() {
  const resume = hasResume();

  return (
    <section className="systems-lab" id="systems" aria-labelledby="lab-title" tabIndex={-1}>
      <div className="site-shell lab-hero">
        <div className="lab-intro">
          <p className="lab-kicker">
            <span aria-hidden="true" />
            {profile.role}
          </p>
          <h1 id="lab-title">{letters(profile.name)}</h1>
          <p className="lab-copy">{profile.intro}</p>
          {/* Two primary actions for a quick scan; Ask the lab is secondary (feature 008 FR-002). */}
          <div className="lab-actions">
            <a className="lab-button lab-button-primary" href="#work">
              View selected work <span aria-hidden="true">↓</span>
            </a>
            {resume && (
              <a className="lab-button lab-button-ghost lab-button-resume" href={resumeHref} download>
                Resume PDF
              </a>
            )}
            <AskLabButton className="lab-button-text lab-button-ask" />
          </div>
        </div>

        <ProjectConstellation projects={labProjects} />
      </div>

      <noscript>
        <div className="site-shell lab-static">
          <h2 className="lab-label">All project systems</h2>
          <ol>
            {labProjects.map((project) => (
              <li key={project.slug}>
                <h3>
                  <Link href={`/work/${project.slug}`}>{project.name}</Link>
                </h3>
                <p>{project.summary}</p>
                {project.flow && (
                  <ol>
                    {project.flow.steps.map((step) => (
                      <li key={step.id}>
                        <strong>{step.label}</strong> <ClaimStatus status={step.status} /> {step.detail}
                      </li>
                    ))}
                  </ol>
                )}
                {project.flow?.branch && (
                  <p>
                    <strong>{project.flow.branch.label}:</strong>{" "}
                    {project.flow.branch.steps.map((step) => `${step.label} — ${step.detail}`).join(" ")}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </noscript>
    </section>
  );
}
