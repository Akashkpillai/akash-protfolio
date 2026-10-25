import type { ArchitectureExplanation, DiagramComponent } from "@/content/projects";
import { claimStatusLabels } from "@/content/claim-status";
import { ClaimStatus } from "@/components/work/ClaimStatus";

// Shared drawing and text-equivalent pieces for the three case-study diagrams.
// Hook-free so it renders in both Server and Client Components.

const columnWidth = 200;
const rowHeight = 110;
const nodeWidth = 172;
const nodeHeight = 64;

function centre(component: DiagramComponent) {
  return {
    x: columnWidth / 2 + component.grid.column * columnWidth,
    y: rowHeight / 2 + component.grid.row * rowHeight,
  };
}

type DiagramSvgProps = {
  architecture: ArchitectureExplanation;
  idPrefix: string;
  selectedId?: string | null;
  className?: string;
};

export function DiagramSvg({ architecture, idPrefix, selectedId, className }: DiagramSvgProps) {
  const { components, links } = architecture;
  const columns = Math.max(...components.map((c) => c.grid.column)) + 1;
  const rows = Math.max(...components.map((c) => c.grid.row)) + 1;
  const byId = new Map(components.map((c) => [c.id, c]));
  const titleId = `${idPrefix}-svg-title`;
  const descId = `${idPrefix}-svg-desc`;

  return (
    <svg
      className={className ? `diagram-visual ${className}` : "diagram-visual"}
      viewBox={`0 0 ${columns * columnWidth} ${rows * rowHeight}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{architecture.title}</title>
      <desc id={descId}>
        {`${architecture.summary} Components: ${components.map((c) => c.name).join(", ")}.`}
      </desc>
      {links.map((link) => {
        const from = byId.get(link.from);
        const to = byId.get(link.to);
        if (!from || !to) {
          return null;
        }
        const a = centre(from);
        const b = centre(to);
        return (
          <line
            className={link.status ? `diagram-edge diagram-edge-${link.status}` : "diagram-edge"}
            key={`${link.from}-${link.to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
          />
        );
      })}
      {components.map((component) => {
        const { x, y } = centre(component);
        const selected = selectedId === component.id;
        const classes = ["diagram-node"];
        if (component.status) classes.push(`diagram-node-${component.status}`);
        if (selected) classes.push("diagram-node-selected");
        return (
          <g className={classes.join(" ")} key={component.id}>
            <rect
              x={x - nodeWidth / 2}
              y={y - nodeHeight / 2}
              width={nodeWidth}
              height={nodeHeight}
              rx="4"
            />
            <text className="diagram-node-name" x={x} y={component.status ? y - 4 : y + 6} textAnchor="middle">
              {component.shortName ?? component.name}
            </text>
            {component.status && (
              <text className="diagram-node-status" x={x} y={y + 17} textAnchor="middle">
                {claimStatusLabels[component.status]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function DiagramCaption() {
  return (
    <p className="diagram-caption">
      Explanatory diagram based on the reviewed source. It is not a live view or a
      screenshot.
    </p>
  );
}

export function ComponentText({ component }: { component: DiagramComponent }) {
  return (
    <>
      <div className="diagram-item-topline">
        <h4>{component.name}</h4>
        <ClaimStatus status={component.status} />
      </div>
      <p>{component.responsibility}</p>
    </>
  );
}

export function ConnectionList({ architecture }: { architecture: ArchitectureExplanation }) {
  const names = new Map(architecture.components.map((c) => [c.id, c.name]));
  return (
    <>
      <h4 className="diagram-connections-title">Connections</h4>
      <ul className="diagram-connections">
        {architecture.links.map((link) => (
          <li key={`${link.from}-${link.to}`}>
            {names.get(link.from)} → {names.get(link.to)}: {link.label}
            {link.status && (
              <>
                {" "}
                <ClaimStatus status={link.status} />
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

// Compact homepage preview: the drawing on wider screens, an ordered name list on
// narrow ones, so the preview area is never empty.
export function CompactDiagram({
  architecture,
  idPrefix,
  caption,
}: {
  architecture: ArchitectureExplanation;
  idPrefix: string;
  caption: string;
}) {
  return (
    <figure className="diagram-compact">
      <DiagramSvg architecture={architecture} idPrefix={idPrefix} />
      <ol className="diagram-compact-list" aria-label={`${architecture.title} components`}>
        {architecture.components.map((component) => (
          <li key={component.id}>
            {component.name}
            {component.status && (
              <>
                {" "}
                <ClaimStatus status={component.status} />
              </>
            )}
          </li>
        ))}
      </ol>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
