import { Reveal } from "@/components/lab/Reveal";
import { roles, type YearMonth } from "@/content/experience";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonth({ year, month }: YearMonth) {
  return `${monthNames[month - 1]} ${year}`;
}

function isoMonth({ year, month }: YearMonth) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function ExperienceSection() {
  return (
    <section className="profile-section" id="experience" aria-labelledby="experience-title" tabIndex={-1} data-probe-section="experience">
      <div className="site-shell">
        <p className="eyebrow" data-probe-tip="Where I have worked">03 / Experience</p>
        <h2 id="experience-title">Where I have worked</h2>
        {/* The timeline rail draws as the list is revealed (feature 007 FR-016). */}
        <Reveal className="timeline">
        <ol className="role-list">
          {roles.map((role) => (
            <li key={role.organization}>
              <article className="role" aria-labelledby={`role-${role.start.year}`}>
                <div className="role-meta">
                  <p className="role-dates">
                    <time dateTime={isoMonth(role.start)}>{formatMonth(role.start)}</time>
                    {" – "}
                    {role.end === "present" ? (
                      "Present"
                    ) : (
                      <time dateTime={isoMonth(role.end)}>{formatMonth(role.end)}</time>
                    )}
                  </p>
                  <p className="role-location">{role.location}</p>
                </div>
                <div className="role-body">
                  <h3 id={`role-${role.start.year}`}>{role.title}</h3>
                  <p className="role-organization">{role.organization}</p>
                  <ul className="role-highlights">
                    {role.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {role.projects && (
                    <div className="role-projects">
                      <h4>Projects</h4>
                      <ul>
                        {role.projects.map((project) => (
                          <li key={project.name}>
                            <p className="role-project-name">
                              {project.name} <span>{project.period}</span>
                            </p>
                            <p>{project.summary}</p>
                            <ul className="stack-list" aria-label="Stack">
                              {project.stack.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>
        </Reveal>
      </div>
    </section>
  );
}
