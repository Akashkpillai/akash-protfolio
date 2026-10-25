import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section className="hero site-shell" aria-labelledby="hero-title" id="home" tabIndex={-1}>
      <div className="hero-copy">
        <p className="eyebrow">The Engineering Journal</p>
        <p className="hero-name">{profile.name}</p>
        <p className="hero-role">{profile.role}</p>
        <h1 id="hero-title">{profile.headline}</h1>
        <p className="hero-intro">{profile.intro}</p>
        <a className="hero-action" href="#approach">
          Explore the flow <span aria-hidden="true">↓</span>
        </a>
      </div>
      <aside className="hero-aside" aria-label="Journal introduction">
        <span className="hero-aside-number" aria-hidden="true">
          01
        </span>
        <p className="hero-aside-label">A considered view of the work</p>
        <p className="hero-aside-copy">
          Systems are easier to trust when their parts and trade-offs are clear.
        </p>
        <span className="hero-aside-rule" aria-hidden="true" />
        <p className="hero-aside-foot">Notes on building, one decision at a time.</p>
      </aside>
    </section>
  );
}
