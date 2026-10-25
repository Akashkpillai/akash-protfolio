"use client";

import { useState, useSyncExternalStore } from "react";
import { flowStages } from "@/content/flow";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function FlowDiagram() {
  const enhanced = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function advance() {
    setActiveIndex((current) =>
      current === null ? 0 : (current + 1) % flowStages.length,
    );
  }

  return (
    <div className="flow-card">
      <div className="flow-heading">
        <div>
          <p className="eyebrow">Illustrative flow</p>
          <h3 id="flow-title">From request to useful result</h3>
        </div>
        <p className="flow-disclaimer">
          A simple example of how a system can handle information. This is not live
          telemetry or a verified project workflow.
        </p>
      </div>

      <svg
        className="flow-visual"
        viewBox="0 0 780 150"
        role="img"
        aria-labelledby="flow-visual-title flow-visual-desc"
      >
        <title id="flow-visual-title">Illustrative three-stage flow</title>
        <desc id="flow-visual-desc">
          Input moves to Process, then to Result. Each stage is explained in the
          text below.
        </desc>
        <path className="flow-line" d="M130 72 H650" />
        {flowStages.map((stage, index) => {
          const x = 130 + index * 260;
          const active = activeIndex === index;
          return (
            <g
              className={active ? "flow-node flow-node-active" : "flow-node"}
              key={stage.id}
            >
              <circle cx={x} cy="72" r="25" />
              <text x={x} y="119" textAnchor="middle">
                {stage.label}
              </text>
            </g>
          );
        })}
      </svg>

      <ol className="flow-stage-list" aria-label="Flow stage explanations">
        {flowStages.map((stage, index) => (
          <li
            className={activeIndex === index ? "flow-stage flow-stage-active" : "flow-stage"}
            key={stage.id}
          >
            <div className="flow-stage-topline">
              <span className="flow-stage-index">0{index + 1}</span>
              <h4>{stage.label}</h4>
            </div>
            <p>{stage.responsibility}</p>
            {enhanced && (
              <button
                className="flow-select"
                type="button"
                aria-pressed={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              >
                Show {stage.label.toLowerCase()} step
              </button>
            )}
          </li>
        ))}
      </ol>

      {enhanced && (
        <div className="flow-controls" aria-label="Flow controls">
          <button
            className="flow-control-secondary"
            type="button"
            onClick={() => setActiveIndex(0)}
          >
            Trace the flow
          </button>
          <button
            className="flow-control-primary"
            type="button"
            onClick={advance}
            disabled={activeIndex === null}
          >
            Next step <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      <p className="flow-current" aria-live="polite" aria-atomic="true">
        {activeIndex === null
          ? "All three stages are explained above."
          : `Current step: ${flowStages[activeIndex].label}. ${flowStages[activeIndex].responsibility}`}
      </p>
    </div>
  );
}
