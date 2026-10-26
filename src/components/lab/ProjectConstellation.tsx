"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useMotion } from "@/components/motion/MotionProvider";
import { ClaimStatus } from "@/components/work/ClaimStatus";
import type { Accent, SystemFlow } from "@/content/systems";
import { ORBIT, baseAngle, orbitPoint } from "@/lib/orbit";

// One revolution of the planets around the AK sun, in seconds (feature 007 Revision 2).
const REVOLUTION_SECONDS = 70;
// After a selection the system holds still so the visitor can read (FR-027).
const HOLD_AFTER_SELECTION_MS = 10000;

// Plain, serializable project data built on the server (feature 006). This module imports
// types only from the content files, so no project record or draft reaches the browser.
export type LabProject = {
  slug: string;
  name: string;
  summary: string;
  accent: Accent;
  position: { x: number; y: number; depth: number };
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
  const [architectureOpen, setArchitectureOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selections, setSelections] = useState(0);
  const [packetTo, setPacketTo] = useState<{ x: number; y: number } | null>(null);
  const { active } = useMotion();
  const orbitRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef(new Map<string, HTMLDivElement>());
  const spokeRefs = useRef(new Map<string, SVGLineElement>());
  const positions = useRef(new Map<string, { x: number; y: number }>());
  const holdUntil = useRef(0);

  // The orbit: planets revolve around the sun on a tilted ellipse, nearer ones larger and
  // brighter. Transforms only (no layout shift). Holds still under the pointer, with focus
  // inside, after a selection, off-screen, in a hidden tab, with motion off, or below 46rem.
  useEffect(() => {
    const orbit = orbitRef.current;
    const map = orbit?.closest<HTMLElement>(".lab-map");
    if (!orbit || !map) return;
    const wide = window.matchMedia("(min-width: 46rem)");
    let size = { width: 0, height: 0 };
    let phase = 0;
    let frame = 0;
    let last = 0;
    let hovering = false;
    let focused = false;
    let visible = true;
    let wasMoving = false;

    function render() {
      projects.forEach((project, index) => {
        const slot = slotRefs.current.get(project.slug);
        if (!slot) return;
        if (!wide.matches) {
          slot.style.transform = "";
          slot.style.zIndex = "";
          return;
        }
        const point = orbitPoint(baseAngle(index, projects.length) + phase);
        const near = (point.depth + 1) / 2;
        const dx = ((point.x - project.position.x) / 100) * size.width;
        const dy = ((point.y - project.position.y) / 100) * size.height;
        slot.style.transform = `translate(-50%, -50%) translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${(0.82 + 0.26 * near).toFixed(3)})`;
        slot.style.zIndex = point.depth > 0 ? "3" : "1";
        slot.style.setProperty("--near", near.toFixed(2));
        const spoke = spokeRefs.current.get(project.slug);
        spoke?.setAttribute("x2", String(point.x));
        spoke?.setAttribute("y2", String(point.y));
        positions.current.set(project.slug, point);
      });
    }

    function moving(time: number) {
      return active && wide.matches && visible && !document.hidden && !hovering && !focused && time > holdUntil.current;
    }

    function tick(time: number) {
      frame = 0;
      const dt = last ? Math.min(0.1, (time - last) / 1000) : 0;
      last = time;
      const now = moving(performance.now());
      orbit!.dataset.moving = now ? "true" : "false";
      if (now) {
        phase = (phase + (dt * 360) / REVOLUTION_SECONDS) % 360;
        render();
        // Lets the Probe ride along on a perched planet.
        if (!wasMoving) window.dispatchEvent(new Event("lab:orbit"));
      }
      wasMoving = now;
      if (active && wide.matches && visible && !document.hidden) frame = window.requestAnimationFrame(tick);
    }

    function start() {
      last = 0;
      if (!frame && active && wide.matches && visible && !document.hidden) frame = window.requestAnimationFrame(tick);
    }

    const resize = new ResizeObserver(() => {
      const rect = orbit.getBoundingClientRect();
      size = { width: rect.width, height: rect.height };
      render();
    });
    resize.observe(orbit);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    seen.observe(orbit);

    const enter = () => {
      hovering = true;
    };
    const leave = () => {
      hovering = false;
    };
    const press = () => {
      holdUntil.current = performance.now() + HOLD_AFTER_SELECTION_MS;
    };
    const focusIn = () => {
      focused = true;
    };
    const focusOut = (event: FocusEvent) => {
      if (!map.contains(event.relatedTarget as Node | null)) focused = false;
    };
    const change = () => {
      render();
      start();
    };
    orbit.addEventListener("pointerenter", enter);
    orbit.addEventListener("pointerleave", leave);
    orbit.addEventListener("pointerdown", press);
    // Selection by pointer or keyboard (Enter/Space fire click) holds the system still.
    orbit.addEventListener("click", press);
    map.addEventListener("focusin", focusIn);
    map.addEventListener("focusout", focusOut);
    wide.addEventListener("change", change);
    document.addEventListener("visibilitychange", start);
    render();
    start();
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      seen.disconnect();
      orbit.removeEventListener("pointerenter", enter);
      orbit.removeEventListener("pointerleave", leave);
      orbit.removeEventListener("pointerdown", press);
      orbit.removeEventListener("click", press);
      map.removeEventListener("focusin", focusIn);
      map.removeEventListener("focusout", focusOut);
      wide.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", start);
      orbit.dataset.moving = "false";
    };
  }, [active, projects]);

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
    setPacketTo(positions.current.get(project.slug) ?? project.position);
    // The Probe perches on top of the chosen planet (feature 007 FR-002, FR-030).
    window.dispatchEvent(new CustomEvent("lab:focus", { detail: { selector: `#lab-node-${project.slug}`, placement: "top" } }));
    const count = project.flow?.steps.length ?? 0;
    setMessage(`Showing ${project.name}: ${count} ${count === 1 ? "step" : "steps"}.`);
  }

  function trace() {
    const next = traceIndex === null || traceIndex >= steps.length - 1 ? 0 : traceIndex + 1;
    setTraceIndex(next);
    setArchitectureOpen(true);
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
          Select a project for a summary; open its architecture for the full flow.
        </p>
        <div className="lab-orbit" ref={orbitRef}>
          <svg className="lab-orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="50" cy="50" rx={ORBIT.rx} ry={ORBIT.ry} />
            <ellipse className="lab-orbit-inner" cx="50" cy="50" rx={ORBIT.rx * 0.62} ry={ORBIT.ry * 0.62} />
            {projects.map((project) => (
              <line
                key={project.slug}
                ref={(line) => {
                  if (line) spokeRefs.current.set(project.slug, line);
                  else spokeRefs.current.delete(project.slug);
                }}
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
                x2={(packetTo ?? selected.position).x}
                y2={(packetTo ?? selected.position).y}
                pathLength={100}
              />
            )}
          </svg>
          <span className="lab-core" aria-hidden="true">
            <span className="lab-core-corona" />
            <span className="lab-core-label">AK</span>
          </span>
          {projects.map((project) => {
            const isSelected = project.slug === selected.slug;
            const style = {
              "--x": `${project.position.x}%`,
              "--y": `${project.position.y}%`,
              "--near": ((project.position.depth + 1) / 2).toFixed(2),
            } as CSSProperties;
            const content = (
              <>
                <span className="lab-node-mark" aria-hidden="true" />
                <span className="lab-node-name">{project.name}</span>
              </>
            );
            return (
              <div
                className={`lab-node-slot lab-accent-${project.accent}`}
                id={`lab-node-${project.slug}`}
                key={project.slug}
                style={style}
                ref={(slot) => {
                  if (slot) slotRefs.current.set(project.slug, slot);
                  else slotRefs.current.delete(project.slug);
                }}
              >
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

      {/* Selected-project summary (feature 008 FR-003): the flow sits behind a native disclosure,
          so it stays usable without scripts; its open state survives a change of project. */}
      <section
        className={`lab-panel lab-accent-${selected.accent}`}
        id="architecture-panel"
        aria-labelledby="lab-panel-title"
      >
        {/* Animates only after a visitor's selection (message set), never on page load. */}
        <div className={`lab-panel-body${message ? " lab-panel-enter" : ""}`} key={selected.slug}>
          <p className="lab-panel-kicker">Selected project</p>
          <h3 id="lab-panel-title">{selected.name}</h3>
          <p className="lab-panel-summary">{selected.summary}</p>
          <details
            className="lab-architecture"
            open={architectureOpen}
            onToggle={(event) => setArchitectureOpen(event.currentTarget.open)}
          >
            <summary>
              Explore architecture
              {steps.length > 0 && (
                <span className="lab-architecture-count">
                  {steps.length} {steps.length === 1 ? "step" : "steps"}
                </span>
              )}
            </summary>
            <p className="lab-panel-label">
              <span className="lab-dot" aria-hidden="true" />
              Explanatory diagram from the reviewed source — not live system data
            </p>
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
            {hydrated && steps.length > 0 && (
              <div className="lab-panel-actions">
                <button className="lab-button lab-button-ghost" type="button" onClick={trace}>
                  {traceLabel}
                </button>
              </div>
            )}
          </details>
          <Link className="lab-panel-link" href={`/work/${selected.slug}`}>
            Open case study<span className="visually-hidden">: {selected.name}</span> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <p className="visually-hidden" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
