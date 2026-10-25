import { useId } from "react";
import type { Project } from "@/content/projects";
import { CompactDiagram } from "@/components/diagrams/DiagramCanvas";

const kindLabels = {
  pipeline: "Pipeline",
  architecture: "Architecture",
  "data-model": "Data model",
  workflow: "Workflow",
  "module-map": "Module map",
} as const;

// Static compact preview for every kind, so the homepage adds no client JavaScript.
export function ProjectPreview({ project }: { project: Project }) {
  const id = useId().replace(/:/g, "");
  const { architecture } = project.caseStudy;

  return (
    <div className={`project-preview project-preview-${project.preview.kind}`}>
      <p className="project-preview-kind">{kindLabels[project.preview.kind]}</p>
      <CompactDiagram
        architecture={architecture}
        idPrefix={id}
        caption={project.preview.caption}
      />
    </div>
  );
}
