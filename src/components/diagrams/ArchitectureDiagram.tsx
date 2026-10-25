"use client";

import { useId, useState, useSyncExternalStore } from "react";
import type { ArchitectureExplanation } from "@/content/projects";
import {
  CompactDiagram,
  ComponentText,
  ConnectionList,
  DiagramCaption,
  DiagramSvg,
} from "@/components/diagrams/DiagramCanvas";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

type ArchitectureDiagramProps = {
  architecture: ArchitectureExplanation;
  compact?: boolean;
  caption?: string;
};

export function ArchitectureDiagram({ architecture, compact, caption }: ArchitectureDiagramProps) {
  const id = useId().replace(/:/g, "");
  const enhanced = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (compact) {
    return <CompactDiagram architecture={architecture} idPrefix={id} caption={caption ?? ""} />;
  }

  const interactive = enhanced && architecture.interactive;
  const selected = architecture.components.find((c) => c.id === selectedId);

  return (
    <div className="diagram">
      <p className="eyebrow">Architecture</p>
      <h3>{architecture.title}</h3>
      <DiagramCaption />
      <p className="diagram-summary">{architecture.summary}</p>
      <DiagramSvg architecture={architecture} idPrefix={id} selectedId={selectedId} />
      <ol className="diagram-list" aria-label="Components and their responsibilities">
        {architecture.components.map((component) => (
          <li
            className={
              selectedId === component.id ? "diagram-item diagram-item-selected" : "diagram-item"
            }
            key={component.id}
          >
            <ComponentText component={component} />
            {interactive && (
              <button
                className="diagram-select"
                type="button"
                aria-pressed={selectedId === component.id}
                onClick={() => setSelectedId(component.id)}
              >
                Show {component.name}
              </button>
            )}
          </li>
        ))}
      </ol>
      {architecture.interactive && (
        <p className="diagram-current" aria-live="polite" aria-atomic="true">
          {selected
            ? `Selected: ${selected.name}. ${selected.responsibility}`
            : "Every component is described above."}
        </p>
      )}
      <ConnectionList architecture={architecture} />
    </div>
  );
}
