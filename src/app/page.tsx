import { Hero } from "@/components/layout/Hero";
import { FlowDiagram } from "@/components/diagrams/FlowDiagram";
import { SelectedWork } from "@/components/work/SelectedWork";

export default function HomePage() {
  return (
      <main id="main-content" tabIndex={-1}>
      <Hero />
      <SelectedWork />
      <section className="approach-section" id="approach" aria-labelledby="approach-title" tabIndex={-1}>
        <div className="site-shell">
          <p className="eyebrow">03 / Approach</p>
          <h2 id="approach-title">How systems fit together</h2>
          <p className="approach-intro">
            A clear view of the steps behind a system, with the full explanation
            available alongside the illustration.
          </p>
          <FlowDiagram />
        </div>
      </section>
    </main>
  );
}
