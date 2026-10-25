"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MOTION_KEY } from "@/lib/motion";

// Site-wide motion preference (feature 007 FR-014, FR-015). "paused" is remembered; reduced
// motion always wins. The choice is mirrored on <html data-motion> so CSS-only animations obey
// it too (the inline head script in the root layout applies a saved pause before first paint).

type Motion = { active: boolean; paused: boolean; setPaused: (paused: boolean) => void };

const MotionContext = createContext<Motion>({ active: false, paused: false, setPaused: () => {} });

export function useMotion() {
  return useContext(MotionContext);
}

function readSaved(): boolean {
  try {
    return (localStorage.getItem(MOTION_KEY) ?? sessionStorage.getItem(MOTION_KEY)) === "paused";
  } catch {
    return false;
  }
}

function save(paused: boolean) {
  const value = paused ? "paused" : "on";
  try {
    localStorage.setItem(MOTION_KEY, value);
  } catch {
    try {
      sessionStorage.setItem(MOTION_KEY, value);
    } catch {
      // Storage unavailable: the choice lasts for this page only.
    }
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPausedState] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    // Deferred so the first client render matches the server (no motion until known).
    const frame = window.requestAnimationFrame(() => {
      setPausedState(readSaved());
      sync();
      setLoaded(true);
    });
    query.addEventListener("change", sync);
    return () => {
      window.cancelAnimationFrame(frame);
      query.removeEventListener("change", sync);
    };
  }, []);

  const setPaused = useCallback((next: boolean) => {
    setPausedState(next);
    save(next);
  }, []);

  // Written only once the saved choice is known, so the head script's pause is never undone.
  useEffect(() => {
    if (loaded) {
      document.documentElement.dataset.motion = paused ? "paused" : "on";
    }
  }, [paused, loaded]);

  const active = loaded && !paused && !reduced;

  // Soft background spotlight that follows a fine pointer (decorative, motion only).
  useEffect(() => {
    if (!active || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    let frame = 0;
    let x = 0;
    let y = 0;
    const root = document.documentElement;
    function apply() {
      frame = 0;
      root.style.setProperty("--spot-x", `${x}px`);
      root.style.setProperty("--spot-y", `${y}px`);
    }
    function move(event: PointerEvent) {
      x = event.clientX;
      y = event.clientY;
      if (!frame) {
        frame = window.requestAnimationFrame(apply);
      }
    }
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.cancelAnimationFrame(frame);
    };
  }, [active]);

  const value = useMemo(() => ({ active, paused, setPaused }), [active, paused, setPaused]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
