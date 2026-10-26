import { Reveal } from "@/components/lab/Reveal";
import { profile } from "@/content/profile";
import { focusStatements } from "@/content/systems";

export function AboutSection() {
  return (
    <section className="profile-section" id="about" aria-labelledby="about-title" tabIndex={-1} data-probe-section="about">
      <div className="site-shell about-layout">
        <div>
          <p className="eyebrow" data-probe-tip="From physics to backend systems">05 / About</p>
          <h2 id="about-title">From physics to backend systems</h2>
        </div>
        <Reveal className="about-body">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <dl className="about-facts">
            <div>
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>
                {profile.languages.map((language) => `${language.name} (${language.level.toLowerCase()})`).join(", ")}
              </dd>
            </div>
          </dl>
          {/* Owner-supplied statements, moved here from the hero in feature 008 (FR-006). */}
          <div className="about-focus">
            <p className="about-focus-title">Current focus</p>
            <ul>
              {focusStatements.map((statement) => (
                <li key={statement}>{statement}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
