"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

// The Probe (feature 007 FR-001–FR-006, Revision 2 FR-029–FR-031): a lit 3D orb with a tilted
// ring and moon that reacts to site activity and opens Ask the lab. No face, eyes, or limbs.
// It travels only with a fine pointer, motion on, a wide screen, and no open dialog; otherwise it
// stays docked as a plain button. Targets arrive as window events:
//   lab:focus     { selector, placement: "top" | "left" | "text", tip? }  (null selector = dock)
//   lab:orbit     the planets started moving (ride along when perched on one)
//   lab:celebrate brief celebration
//   lab:ask-state { open }                                              (dim while the dialog is open)
// Section tips come from [data-probe-section] / [data-probe-tip] text already on the page.

type Placement = "top" | "left" | "text";
type Target = { selector: string; placement: Placement } | null;
type FocusDetail = { selector: string | null; placement?: Placement; tip?: string };

const SIZE = 52;
const MARGIN = 24;
const STIFFNESS = 170;
const DAMPING = 26;
const MAX_THROW = 2400;
const SEEN_KEY = "lab-probe-seen";

function subscribe() {
  return () => {};
}

function readSeen(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

function markSeen(seen: Set<string>) {
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
  } catch {
    // Storage unavailable: tips may repeat on the next page.
  }
}

function dock() {
  return { x: window.innerWidth - MARGIN - SIZE, y: window.innerHeight - MARGIN - SIZE };
}

// Where the orb should sit for a target, or the dock if the target is missing or off-screen.
function resolve(target: Target) {
  if (!target) return dock();
  const element = document.querySelector<HTMLElement>(target.selector);
  if (!element) return dock();
  const rect = element.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight || rect.width === 0) return dock();
  const fits = (x: number, y: number) =>
    x >= 8 && x + SIZE <= window.innerWidth - 8 && y >= 8 && y + SIZE <= window.innerHeight - 8;

  if (target.placement === "text") {
    const range = document.createRange();
    range.selectNodeContents(element);
    const text = range.getBoundingClientRect();
    const y = text.top + text.height / 2 - SIZE / 2;
    for (const x of [text.right + 14, text.left - SIZE - 14]) {
      if (fits(x, y)) return { x, y };
    }
    return dock();
  }
  if (target.placement === "left") {
    const panel = element.closest<HTMLElement>(".lab-panel")?.getBoundingClientRect() ?? rect;
    const y = rect.top + Math.min(rect.height, 48) / 2 - SIZE / 2;
    for (const x of [panel.left - SIZE - 12, rect.right + 12]) {
      if (fits(x, y)) return { x, y };
    }
    return dock();
  }
  // Perched on top of the element, like sitting on a ledge.
  const top = { x: rect.left + rect.width / 2 - SIZE / 2, y: rect.top - SIZE + 12 };
  return fits(top.x, top.y) ? top : dock();
}

// Riding along: perched on a planet while the orbit is moving.
function riding(target: Target) {
  return Boolean(
    target?.selector.startsWith("#lab-node-") &&
      document.querySelector<HTMLElement>(".lab-orbit")?.dataset.moving === "true",
  );
}

export function LabProbe() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const { active } = useMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const physics = useRef({ x: 0, y: 0, vx: 0, vy: 0, last: 0, peak: 0 });
  const targetRef = useRef<Target>(null);
  const homeRef = useRef<Target>(null);
  const frameRef = useRef(0);
  const dragRef = useRef<{ id: number; startX: number; startY: number; moved: boolean; samples: { x: number; y: number; t: number }[] } | null>(null);
  const suppressClick = useRef(false);
  const [canTravel, setCanTravel] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"docked" | "travelling" | "perched" | "dragged">("docked");
  const [mood, setMood] = useState<"normal" | "resting" | "celebrate">("normal");
  const [tip, setTip] = useState<string | null>(null);
  // Tips open above the orb, toward the side with more room, so they sit in section padding
  // rather than over text.
  const [tipSide, setTipSide] = useState<"left" | "right">("right");

  // Travel only for a fine pointer, motion on, a wide screen, and no open dialog.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const wide = window.matchMedia("(min-width: 52rem)");
    const update = () => setCanTravel(active && fine.matches && wide.matches && !dialogOpen);
    const frame = window.requestAnimationFrame(update);
    fine.addEventListener("change", update);
    wide.addEventListener("change", update);
    return () => {
      window.cancelAnimationFrame(frame);
      fine.removeEventListener("change", update);
      wide.removeEventListener("change", update);
    };
  }, [active, dialogOpen]);

  // Physics loop: runs while moving or riding a planet; stops once settled; restarted by
  // scroll, resize, a new target, or the orbit starting to move.
  useEffect(() => {
    const button = buttonRef.current;
    if (!hydrated || !button) return;
    const state = physics.current;
    let landingTimer = 0;

    function place(x: number, y: number) {
      button!.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    }

    // Stretch along the direction of travel, proportional to speed.
    function stretch(vx: number, vy: number) {
      const speed = Math.hypot(vx, vy);
      button!.style.setProperty("--stretch", (1 + Math.min(speed / 2600, 0.3)).toFixed(3));
      button!.style.setProperty("--heading", `${((Math.atan2(vy, vx) * 180) / Math.PI).toFixed(1)}deg`);
    }

    function land() {
      button!.dataset.landing = "true";
      window.clearTimeout(landingTimer);
      landingTimer = window.setTimeout(() => delete button!.dataset.landing, 380);
    }

    if (!canTravel) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      const home = dock();
      Object.assign(state, { x: home.x, y: home.y, vx: 0, vy: 0, peak: 0 });
      place(home.x, home.y);
      stretch(0, 0);
      return;
    }

    function step(time: number) {
      frameRef.current = 0;
      if (dragRef.current?.moved) return;
      const dt = Math.min(0.05, state.last ? (time - state.last) / 1000 : 1 / 60);
      state.last = time;
      const goal = resolve(targetRef.current);
      const ax = STIFFNESS * (goal.x - state.x) - DAMPING * state.vx;
      const ay = STIFFNESS * (goal.y - state.y) - DAMPING * state.vy;
      state.vx += ax * dt;
      state.vy += ay * dt;
      state.x += state.vx * dt;
      state.y += state.vy * dt;
      place(state.x, state.y);
      const speed = Math.hypot(state.vx, state.vy);
      state.peak = Math.max(state.peak, speed);
      stretch(state.vx, state.vy);
      const settled = Math.hypot(goal.x - state.x, goal.y - state.y) < 0.5 && speed < 5;
      if (settled && !riding(targetRef.current)) {
        state.last = 0;
        if (state.peak > 300) land();
        state.peak = 0;
        stretch(0, 0);
        setMode(targetRef.current ? "perched" : "docked");
        return;
      }
      setMode(settled ? "perched" : "travelling");
      frameRef.current = window.requestAnimationFrame(step);
    }

    function wake() {
      if (!frameRef.current && !document.hidden) {
        frameRef.current = window.requestAnimationFrame(step);
      }
    }

    function focus(event: Event) {
      const detail = (event as CustomEvent<FocusDetail>).detail;
      const target = detail.selector ? { selector: detail.selector, placement: detail.placement ?? "top" } : null;
      targetRef.current = target;
      if (!detail.tip) homeRef.current = target;
      setTip(detail.tip ?? null);
      setTipSide(resolve(target).x > window.innerWidth * 0.55 ? "left" : "right");
      wake();
    }

    function hidden() {
      if (document.hidden) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
        state.last = 0;
      } else {
        wake();
      }
    }

    wake();
    window.addEventListener("lab:focus", focus);
    window.addEventListener("lab:orbit", wake);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      window.clearTimeout(landingTimer);
      window.removeEventListener("lab:focus", focus);
      window.removeEventListener("lab:orbit", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [hydrated, canTravel]);

  // Section tips: the first time a section is in view this visit, visit its label for 5 s.
  useEffect(() => {
    if (!canTravel || !("IntersectionObserver" in window)) return;
    const seen = readSeen();
    let timer = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as HTMLElement;
          const id = section.dataset.probeSection;
          const label = section.querySelector<HTMLElement>("[data-probe-tip]");
          if (!entry.isIntersecting || !id || !label || seen.has(id)) continue;
          seen.add(id);
          markSeen(seen);
          const text = (label.dataset.probeTip || label.textContent || "").trim();
          const sentence = text.split(/(?<=[.!?])\s/)[0].slice(0, 140);
          window.dispatchEvent(
            new CustomEvent<FocusDetail>("lab:focus", {
              detail: { selector: `[data-probe-section="${id}"] [data-probe-tip]`, placement: "text", tip: sentence },
            }),
          );
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            const home = homeRef.current;
            window.dispatchEvent(
              new CustomEvent<FocusDetail>("lab:focus", { detail: { selector: home?.selector ?? null, placement: home?.placement } }),
            );
          }, 5000);
          break;
        }
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll("[data-probe-section]").forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [canTravel]);

  // The highlight turns toward the pointer; rests (dozes) after 30 s without interaction;
  // celebrates on request.
  useEffect(() => {
    if (!hydrated) return;
    let idle = window.setTimeout(() => setMood("resting"), 30000);
    let frame = 0;
    let px = 0;
    let py = 0;
    function look() {
      frame = 0;
      const button = buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const angle = Math.atan2(py - (rect.top + rect.height / 2), px - (rect.left + rect.width / 2));
      button.style.setProperty("--look-x", `${(Math.cos(angle) * 5).toFixed(2)}px`);
      button.style.setProperty("--look-y", `${(Math.sin(angle) * 5).toFixed(2)}px`);
    }
    function activity(event: Event) {
      window.clearTimeout(idle);
      setMood((current) => (current === "resting" ? "normal" : current));
      idle = window.setTimeout(() => setMood("resting"), 30000);
      if (canTravel && event instanceof PointerEvent) {
        px = event.clientX;
        py = event.clientY;
        if (!frame) frame = window.requestAnimationFrame(look);
      }
    }
    let celebrateTimer = 0;
    function celebrate() {
      setMood("celebrate");
      window.clearTimeout(celebrateTimer);
      celebrateTimer = window.setTimeout(() => setMood("normal"), 1200);
    }
    function dialogState(event: Event) {
      setDialogOpen(Boolean((event as CustomEvent<{ open: boolean }>).detail?.open));
    }
    window.addEventListener("pointermove", activity, { passive: true });
    window.addEventListener("keydown", activity);
    window.addEventListener("scroll", activity, { passive: true });
    window.addEventListener("lab:celebrate", celebrate);
    window.addEventListener("lab:ask-state", dialogState);
    return () => {
      window.clearTimeout(idle);
      window.clearTimeout(celebrateTimer);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", activity);
      window.removeEventListener("keydown", activity);
      window.removeEventListener("scroll", activity);
      window.removeEventListener("lab:celebrate", celebrate);
      window.removeEventListener("lab:ask-state", dialogState);
    };
  }, [hydrated, canTravel]);

  if (!hydrated) return null;

  function pointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!canTravel || event.button !== 0) return;
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      samples: [{ x: event.clientX, y: event.clientY, t: event.timeStamp }],
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    drag.samples = [...drag.samples.slice(-4), { x: event.clientX, y: event.clientY, t: event.timeStamp }];
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 4) return;
    drag.moved = true;
    setMode("dragged");
    const state = physics.current;
    Object.assign(state, { x: event.clientX - SIZE / 2, y: event.clientY - SIZE / 2, vx: 0, vy: 0, last: 0 });
    event.currentTarget.style.transform = `translate3d(${Math.round(state.x)}px, ${Math.round(state.y)}px, 0)`;
  }

  function pointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.moved) {
      suppressClick.current = true;
      // Thrown: keeps the release velocity, then springs back to where it belongs.
      const first = drag.samples[0];
      const lastSample = drag.samples[drag.samples.length - 1];
      const seconds = Math.max(0.016, (lastSample.t - first.t) / 1000);
      const clamp = (value: number) => Math.max(-MAX_THROW, Math.min(MAX_THROW, value));
      Object.assign(physics.current, {
        vx: clamp((lastSample.x - first.x) / seconds),
        vy: clamp((lastSample.y - first.y) / seconds),
        last: 0,
      });
      window.dispatchEvent(
        new CustomEvent<FocusDetail>("lab:focus", {
          detail: { selector: homeRef.current?.selector ?? null, placement: homeRef.current?.placement },
        }),
      );
    }
  }

  return (
    <button
      ref={buttonRef}
      className="probe"
      type="button"
      data-mode={canTravel ? mode : "docked"}
      data-mood={mood}
      data-tip-side={tipSide}
      data-hidden={dialogOpen ? "true" : undefined}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
      onClick={(event) => {
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        window.dispatchEvent(new CustomEvent("lab:ask", { detail: { opener: event.currentTarget } }));
      }}
    >
      {/* Decorative 3D orb: ground shadow, float, ping, stretch, then a preserve-3d scene where the
          tilted ring and moon pass behind and in front of the lit sphere. */}
      <span className="probe-body" aria-hidden="true">
        <span className="probe-shadow" />
        <span className="probe-float">
          <span className="probe-ping" />
          <span className="probe-stretch">
            <span className="probe-scene">
              <span className="probe-sphere">
                <span className="probe-shine" />
              </span>
              <span className="probe-ring">
                <span className="probe-moon" />
              </span>
            </span>
          </span>
          <span className="probe-sparks">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          {mood === "resting" && (
            <span className="probe-z">
              <i>z</i>
              <i>z</i>
              <i>z</i>
            </span>
          )}
        </span>
      </span>
      <span className="visually-hidden">Ask the lab</span>
      {tip && canTravel && (
        <span className="probe-tip" aria-hidden="true">
          {tip}
        </span>
      )}
    </button>
  );
}
