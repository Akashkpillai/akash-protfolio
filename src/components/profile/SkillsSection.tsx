import Link from "next/link";
import { Reveal } from "@/components/lab/Reveal";
import { getPublishedProject } from "@/content/projects";
import { skillGroups } from "@/content/skills";

export function SkillsSection() {
  return (
    <section className="profile-section profile-section-alt" id="skills" aria-labelledby="skills-title" tabIndex={-1} data-probe-section="skills">
      <div className="site-shell">
        <p className="eyebrow" data-probe-tip="Linked skills open a case study that shows them in use.">04 / Skills</p>
        <h2 id="skills-title">Tools I work with</h2>
        <p className="profile-intro">
          Grouped as on my résumé. Linked skills open a case study that shows them in use.
        </p>
        <div className="skill-groups">
          {skillGroups.map((group, index) => (
            <Reveal delay={(index % 2) * 90} key={group.name}>
            <section className="skill-group" aria-label={group.name}>
              <h3>{group.name}</h3>
              <ul className="skill-list">
                {group.skills.map((skill) => {
                  const project = skill.caseStudy ? getPublishedProject(skill.caseStudy) : undefined;
                  return (
                    <li key={skill.name}>
                      {project ? (
                        <Link href={`/work/${project.slug}`} title={`See ${project.title}`}>
                          {skill.name}
                        </Link>
                      ) : (
                        skill.name
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
