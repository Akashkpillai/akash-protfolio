"use client";

import { useMotion } from "@/components/motion/MotionProvider";

// The pause control for ambient and decorative motion (feature 007 FR-014; WCAG 2.2.2).
export function MotionToggle() {
  const { paused, setPaused } = useMotion();

  return (
    <button
      className="motion-toggle"
      type="button"
      aria-pressed={paused}
      onClick={() => setPaused(!paused)}
    >
      <span className={paused ? "motion-icon motion-icon-play" : "motion-icon motion-icon-pause"} aria-hidden="true" />
      <span className="visually-hidden">Pause motion</span>
      {paused && (
        <span className="motion-toggle-state" aria-hidden="true">
          Motion off
        </span>
      )}
    </button>
  );
}
