"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

export type RevealVariant = "up" | "left" | "right" | "scale" | "clip";

// Gentle reveal (features 006 FR-016, 007 FR-016). Content is visible on the server, without
// JavaScript, with reduced motion or motion paused, and above the fold; only an element that
// starts below the viewport is hidden after hydration and shown as it scrolls into view.
// Children stay server-rendered: they pass through this client boundary as rendered output.
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { active } = useMotion();
  const [state, setState] = useState<"shown" | "waiting" | "revealed">("shown");

  useEffect(() => {
    const element = ref.current;
    if (!element || !active || !("IntersectionObserver" in window)) {
      return;
    }
    if (element.getBoundingClientRect().top < window.innerHeight) {
      return;
    }
    // Deferred so the hide happens after paint, outside the effect body.
    const frame = window.requestAnimationFrame(() => setState("waiting"));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("revealed");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [active]);

  // Pausing motion mid-page shows anything still waiting.
  const shown = !active && state === "waiting" ? "shown" : state;

  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      data-reveal={shown}
      data-variant={variant}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
