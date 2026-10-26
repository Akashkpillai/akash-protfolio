"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

// Restrained card tilt (feature 007 FR-016; feature 008 Revision 1, FR-025): a fine pointer that
// can hover tilts the card by at most ±2°, with no spotlight or scaling. Touch and coarse pointers,
// reduced motion, and the motion pause leave the card flat; keyboard focus never tilts it.
// Decorative only — nothing depends on it. Children stay server-rendered.
const MAX_DEGREES = 2;
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const { active } = useMotion();

  function reset() {
    window.cancelAnimationFrame(frame.current);
    frame.current = 0;
    const element = ref.current;
    if (!element) return;
    element.style.removeProperty("--tilt-x");
    element.style.removeProperty("--tilt-y");
    delete element.dataset.tilting;
  }

  // Pausing motion (or reduced motion) mid-tilt settles the card at once.
  useEffect(() => {
    if (!active) reset();
  }, [active]);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!active || event.pointerType === "touch" || !window.matchMedia(FINE_POINTER).matches) return;
    const { clientX, clientY } = event;
    if (frame.current) return;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
      element.style.setProperty("--tilt-x", `${((0.5 - y) * 2 * MAX_DEGREES).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${((x - 0.5) * 2 * MAX_DEGREES).toFixed(2)}deg`);
      element.dataset.tilting = "true";
    });
  }

  return (
    <div ref={ref} className={className ? `tilt ${className}` : "tilt"} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </div>
  );
}
