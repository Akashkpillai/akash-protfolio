import type { CSSProperties } from "react";

// Decorative ambient layer behind every page (feature 007 FR-013): the lab grid, two slowly
// drifting glows, signals travelling along grid lines, and a pointer spotlight. Pure markup;
// all motion is CSS, gated by reduced motion and the pause toggle. Feature 008 FR-014: three
// signals (was six) and no scan line, so fewer effects run at once.
const signals = [
  { axis: "x", line: 3, delay: 0 },
  { axis: "y", line: 14, delay: 5 },
  { axis: "x", line: 9, delay: 10 },
] as const;

export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="ambient-glow ambient-glow-teal" />
      <div className="ambient-glow ambient-glow-cobalt" />
      <div className="ambient-spotlight" />
      {signals.map((signal) => (
        <span
          key={`${signal.axis}-${signal.line}`}
          className={`ambient-signal ambient-signal-${signal.axis}`}
          style={{ "--line": signal.line, "--delay": `${signal.delay}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}
