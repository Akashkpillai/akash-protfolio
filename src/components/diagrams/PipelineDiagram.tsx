import { useId } from "react";
import type { ArchitectureExplanation } from "@/content/projects";
import {
  CompactDiagram,
  ComponentText,
  ConnectionList,
  DiagramCaption,
  DiagramSvg,
} from "@/components/diagrams/DiagramCanvas";

type PipelineDiagramProps = {
  architecture: ArchitectureExplanation;
  compact?: boolean;
  caption?: string;
};

export function PipelineDiagram({ architecture, compact, caption }: PipelineDiagramProps) {
  const id = useId().replace(/:/g, "");

  if (compact) {
    return <CompactDiagram architecture={architecture} idPrefix={id} caption={caption ?? ""} />;
  }

  return (
    <div className="diagram">
      <p className="eyebrow">Pipeline</p>
      <h3>{architecture.title}</h3>
      <DiagramCaption />
      <p className="diagram-summary">{architecture.summary}</p>
      <DiagramSvg architecture={architecture} idPrefix={id} />
      <ol className="diagram-list" aria-label="Pipeline stages in order">
        {architecture.components.map((component) => (
          <li className="diagram-item" key={component.id}>
            <ComponentText component={component} />
          </li>
        ))}
      </ol>
      <ConnectionList architecture={architecture} />
    </div>
  );
}
