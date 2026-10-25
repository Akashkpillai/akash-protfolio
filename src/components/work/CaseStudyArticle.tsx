import Image from "next/image";
import Link from "next/link";
import type {
  ArchitectureExplanation,
  Claim,
  Project,
  ProjectScreenshot,
} from "@/content/projects";
import { publishedProjects, repositoryName } from "@/content/projects";
import { ArchitectureDiagram } from "@/components/diagrams/ArchitectureDiagram";
import { DataModelDiagram } from "@/components/diagrams/DataModelDiagram";
import { ModuleMapDiagram } from "@/components/diagrams/ModuleMapDiagram";
import { PipelineDiagram } from "@/components/diagrams/PipelineDiagram";
import { WorkflowDiagram } from "@/components/diagrams/WorkflowDiagram";
import { ClaimList } from "@/components/work/ClaimList";

function Diagram({ architecture }: { architecture: ArchitectureExplanation }) {
  switch (architecture.kind) {
    case "pipeline":
      return <PipelineDiagram architecture={architecture} />;
    case "architecture":
      // Client Component props are serialized into the page; evidence IDs stay server-side.
      return (
        <ArchitectureDiagram
          architecture={{
            ...architecture,
            components: architecture.components.map((c) => ({ ...c, evidence: [] })),
          }}
        />
      );
    case "data-model":
      return <DataModelDiagram architecture={architecture} />;
    case "workflow":
      return <WorkflowDiagram architecture={architecture} />;
    case "module-map":
      return <ModuleMapDiagram architecture={architecture} />;
  }
}

function Screenshot({ screenshot }: { screenshot: ProjectScreenshot }) {
  return (
    <figure className="case-screenshot">
      <Image
        src={screenshot.src}
        alt={screenshot.alt}
        width={screenshot.width}
        height={screenshot.height}
        sizes="(min-width: 76rem) 76rem, 100vw"
      />
      <figcaption>
        Screenshot of the running project. All names and data shown are fictional test data.
      </figcaption>
    </figure>
  );
}

function Section({ id, title, claims }: { id: string; title: string; claims: readonly Claim[] }) {
  return (
    <section className="case-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <ClaimList claims={claims} />
    </section>
  );
}

export function CaseStudyArticle({ project }: { project: Project }) {
  const { caseStudy } = project;
  const others = publishedProjects.filter((other) => other.slug !== project.slug);
  const repo = repositoryName(project);

  return (
    <article className="case-study site-shell">
      <header className="case-header">
        <p className="eyebrow">Case study {String(project.order).padStart(2, "0")}</p>
        <h1>{project.title}</h1>
        <p className="case-summary">{project.summary}</p>
        <dl className="case-meta">
          <div>
            <dt>Stack</dt>
            <dd>
              <ul className="stack-list">
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>
              {project.source.kind === "public" ? (
                <a href={project.source.url}>Source: {repo} on GitHub</a>
              ) : (
                <span className="case-source-private">Source code is private</span>
              )}
              <span className="case-commit">
                Reviewed at commit <code>{project.reviewedCommit.slice(0, 7)}</code>; read,
                not run.
              </span>
            </dd>
          </div>
        </dl>
        <aside className="label-guide" aria-label="How to read the labels">
          <p>Labels mark claims that are not plainly established by the reviewed source:</p>
          <ul>
            <li>
              <span className="claim-status claim-status-implemented-code-path">
                Implemented code path
              </span>{" "}
              present in the source but not run end to end.
            </li>
            <li>
              <span className="claim-status claim-status-unfinished">Unfinished</span> not
              built yet.
            </li>
            <li>
              <span className="claim-status claim-status-illustrative">Illustrative</span> an
              example, not real data.
            </li>
          </ul>
        </aside>
      </header>

      <Section id="problem" title="Problem" claims={caseStudy.problem} />
      <Section id="contribution" title="My contribution" claims={caseStudy.contribution} />
      <Section id="implementation" title="Implementation" claims={caseStudy.implementation} />
      <section className="case-section" aria-labelledby="architecture">
        <h2 id="architecture">Architecture</h2>
        <Diagram architecture={caseStudy.architecture} />
        {project.screenshot && <Screenshot screenshot={project.screenshot} />}
      </section>
      <Section id="decisions" title="Decisions" claims={caseStudy.decisions} />
      <Section id="tradeoffs" title="Tradeoffs" claims={caseStudy.tradeoffs} />
      <Section id="limitations" title="Limitations" claims={caseStudy.limitations} />

      <nav className="case-footer" aria-label="More work">
        <Link className="case-back" href="/work">
          <span aria-hidden="true">←</span> All work
        </Link>
        <div>
          <p className="case-footer-label">Other case studies</p>
          <ul>
            {others.map((other) => (
              <li key={other.slug}>
                <Link href={`/work/${other.slug}`}>{other.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </article>
  );
}
