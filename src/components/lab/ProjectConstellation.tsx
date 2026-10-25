"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { ClaimStatus } from "@/components/work/ClaimStatus";
import type { Accent, SystemFlow } from "@/content/systems";

// Plain, serializable project data built on the server (feature 006). This module imports
// types only from the content files, so no project record or draft reaches the browser.
export type LabProject = {
  slug: string;
  name: string;
  summary: string;
  accent: Accent;
  position: { x: number; y: number };
  flow: SystemFlow | null;
};

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ProjectConstellation({ projects }: { projects: readonly LabProject[] }) {
  // Before hydration (and without JavaScript) nodes are links to the case studies.
  const hydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug);
  const [traceIndex, setTraceIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [selections, setSelections] = useState(0);

  const selected = projects.find((project) => project.slug === selectedSlug) ?? projects[0];
  if (!selected) {
    return null;
  }
  const steps = selected.flow?.steps ?? [];
  const branch = selected.flow?.branch;
  const branchFrom = branch ? steps.findIndex((step) => step.id === branch.from) + 1 : 0;

  function select(project: LabProject) {
    setSelectedSlug(project.slug);
    setTraceIndex(null);
    setSelections((count) => count + 1);
    // The Probe settles beside the chosen node (feature 007 FR-002).
    window.dispatchEvent(new CustomEvent("lab:focus", { detail: { selector: `#lab-node-${project.slug}`, placement: "corner" } }));
    const count = project.flow?.steps.length ?? 0;
    setMessage(`Showing ${project.name}: ${count} ${count === 1 ? "step" : "steps"}.`);
  }

  function trace() {
    const next = traceIndex === null || traceIndex >= steps.length - 1 ? 0 : traceIndex + 1;
    setTraceIndex(next);
    window.dispatchEvent(new CustomEvent("lab:focus", { detail: { selector: `#lab-step-${next}`, placement: "left" } }));
    setMessage(`Step ${next + 1} of ${steps.length}: ${steps[next].label}.`);
  }

  const traceLabel =
    traceIndex === null ? "Trace flow" : traceIndex < steps.length - 1 ? "Next step" : "Restart trace";

  return (
    <div className="lab-stage">
      <section className="lab-map" id="project-map" aria-labelledby="lab-map-title" data-probe-section="map">
        <h2 className="lab-label" id="lab-map-title" data-probe-tip="Select a project to see how its system works.">
          Project systems
        </h2>
        <p className="lab-map-hint">
          Select a project to see how its system works.
        </p>
        <div className="lab-orbit">
          <svg className="lab-orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="50" cy="50" rx="32" ry="38" />
            <ellipse className="lab-orbit-inner" cx="50" cy="50" rx="21" ry="25" />
            {projects.map((project) => (
              <line
                key={project.slug}
                className={`lab-spoke lab-accent-${project.accent}${project.slug === selected.slug ? " lab-spoke-selected" : ""}`}
                x1="50"
                y1="50"
                x2={project.position.x}
                y2={project.position.y}
              />
            ))}
            {/* A signal runs from AK to the newly selected node, once per selection. */}
            {selections > 0 && (
              <line
                key={selections}
                className={`lab-packet lab-accent-${selected.accent}`}
                x1="50"
                y1="50"
                x2={selected.position.x}
                y2={selected.position.y}
                pathLength={100}
              />
            )}
          </svg>
          <span className="lab-core" aria-hidden="true">
            AK
          </span>
          {projects.map((project) => {
            const isSelected = project.slug === selected.slug;
            const style = { "--x": `${project.position.x}%`, "--y": `${project.position.y}%` } as CSSProperties;
            const content = (
              <>
                <span className="lab-node-mark" aria-hidden="true" />
                <span className="lab-node-name">{project.name}</span>
              </>
            );
            return (
              <div className={`lab-node-slot lab-accent-${project.accent}`} id={`lab-node-${project.slug}`} key={project.slug} style={style}>
                {hydrated ? (
                  <button
                    className="lab-node"
                    type="button"
                    aria-pressed={isSelected}
                    aria-controls="architecture-panel"
                    onClick={() => select(project)}
                  >
                    {content}
                  </button>
                ) : (
                  <Link className="lab-node" href={`/work/${project.slug}`}>
                    {content}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section
        className={`lab-panel lab-accent-${selected.accent}`}
        id="architecture-panel"
        aria-labelledby="lab-panel-title"
      >
        <p className="lab-panel-label">
          <span className="lab-dot" aria-hidden="true" />
          Explanatory diagram from the reviewed source — not live system data
        </p>
        {/* Animates only after a visitor's selection (message set), never on page load. */}
        <div className={`lab-panel-body${message ? " lab-panel-enter" : ""}`} key={selected.slug}>
          <h3 id="lab-panel-title">{selected.name}</h3>
          <p className="lab-panel-summary">{selected.summary}</p>
          {steps.length > 0 && (
            <ol className={`lab-flow${traceIndex === null ? "" : " lab-flow-tracing"}`}>
              {steps.map((step, index) => {
                const state =
                  traceIndex === null ? "" : index === traceIndex ? " lab-step-current" : index < traceIndex ? " lab-step-done" : "";
                return (
                  <li
                    className={`lab-step${state}`}
                    id={`lab-step-${index}`}
                    style={{ "--i": index } as CSSProperties}
                    key={step.id}
                    aria-current={index === traceIndex ? "step" : undefined}
                  >
                    <span className="lab-step-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="lab-step-text">
                      <p className="lab-step-label">
                        {step.label} <ClaimStatus status={step.status} />
                      </p>
                      <p className="lab-step-detail">{step.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          {branch && (
            <div className="lab-branch">
              <p className="lab-branch-label">
                {branch.label} <span>(from step {branchFrom})</span>
              </p>
              <ul>
                {branch.steps.map((step) => (
                  <li key={step.id}>
                    <p className="lab-step-label">
                      {step.label} <ClaimStatus status={step.status} />
                    </p>
                    <p className="lab-step-detail">{step.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="lab-panel-actions">
            {hydrated && steps.length > 0 && (
              <button className="lab-button lab-button-ghost" type="button" onClick={trace}>
                {traceLabel}
              </button>
            )}
            <Link className="lab-panel-link" href={`/work/${selected.slug}`}>
              Open case study <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
      <p className="visually-hidden" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
