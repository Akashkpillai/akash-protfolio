import { useId } from "react";
import type { ArchitectureExplanation } from "@/content/projects";
import {
  CompactDiagram,
  ComponentText,
  ConnectionList,
  DiagramCaption,
  DiagramSvg,
} from "@/components/diagrams/DiagramCanvas";

type DataModelDiagramProps = {
  architecture: ArchitectureExplanation;
  compact?: boolean;
  caption?: string;
};

export function DataModelDiagram({ architecture, compact, caption }: DataModelDiagramProps) {
  const id = useId().replace(/:/g, "");

  if (compact) {
    return <CompactDiagram architecture={architecture} idPrefix={id} caption={caption ?? ""} />;
  }

  return (
    <div className="diagram">
      <p className="eyebrow">Data model</p>
      <h3>{architecture.title}</h3>
      <DiagramCaption />
      <p className="diagram-summary">{architecture.summary}</p>
      <DiagramSvg architecture={architecture} idPrefix={id} className="diagram-visual-narrow" />
      <ol className="diagram-list" aria-label="Entities and their fields">
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
