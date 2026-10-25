"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

const MAX_DEGREES = 6;

// Pointer tilt and spotlight for cards (feature 007 FR-016). Mouse and pen only, motion on;
// decorative — nothing depends on it. Children stay server-rendered.
export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const { active } = useMotion();

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!active || event.pointerType === "touch") return;
    const { clientX, clientY } = event;
    if (frame.current) return;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      element.style.setProperty("--tilt-x", `${((0.5 - y) * MAX_DEGREES).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${((x - 0.5) * MAX_DEGREES).toFixed(2)}deg`);
      element.style.setProperty("--card-spot-x", `${(x * 100).toFixed(1)}%`);
      element.style.setProperty("--card-spot-y", `${(y * 100).toFixed(1)}%`);
      element.dataset.tilting = "true";
    });
  }

  function leave() {
    window.cancelAnimationFrame(frame.current);
    frame.current = 0;
    const element = ref.current;
    if (!element) return;
    element.style.removeProperty("--tilt-x");
    element.style.removeProperty("--tilt-y");
    delete element.dataset.tilting;
  }

  return (
    <div ref={ref} className={className ? `tilt ${className}` : "tilt"} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}
