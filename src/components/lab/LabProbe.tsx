"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

// The Probe (feature 007 FR-001–FR-006, Revision 2 FR-030–FR-031, Revision 3 FR-032–FR-036): a
// single mechanical eye (lens, aperture iris, shutter lids) that blinks, reacts to site activity,
// and opens Ask the lab. No face, body, or limbs.
// It travels only with a fine pointer, motion on, a wide screen, and no open dialog; otherwise it
// stays docked as a plain button. With nothing to attend to, it roams between headings in view.
// Targets arrive as window events:
//   lab:focus     { selector, placement: "top" | "left" | "text", tip? }  (null selector = roam)
//   lab:orbit     the planets started moving (ride along when perched on one)
//   lab:celebrate brief celebration
//   lab:ask-state { open }                                              (dim while the dialog is open)
// Section tips come from [data-probe-section] / [data-probe-tip] text already on the page.

type Placement = "top" | "left" | "text";
type Target = { selector: string; placement: Placement } | null;
type Roam = { element: HTMLElement; placement: Placement } | null;
type Spot = { x: number; y: number };
type FocusDetail = { selector: string | null; placement?: Placement; tip?: string };

const SIZE = 52;
const MARGIN = 24;
const STIFFNESS = 30;
const DAMPING = 11;
const MAX_SPEED = 450;
const MAX_THROW = 2400;
const HOLD_MS = 15000;
const SEEN_KEY = "lab-probe-seen";
const ROAM_SELECTOR = "main h2, main h3, [data-probe-tip]";
// Roaming spots must sit over empty space, not over text or controls.
const BUSY = "a, button, input, textarea, select, label, p, li, dt, dd, h1, h2, h3, h4, h5, h6, img, svg, code, pre, figure, table, blockquote";

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

function dock(): Spot {
  return { x: window.innerWidth - MARGIN - SIZE, y: window.innerHeight - MARGIN - SIZE };
}

// Where the eye should sit beside an element, or null if the element is off-screen or no spot fits.
function place(element: HTMLElement, placement: Placement): Spot | null {
  const rect = element.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight || rect.width === 0) return null;
  const fits = (x: number, y: number) =>
    x >= 8 && x + SIZE <= window.innerWidth - 8 && y >= 8 && y + SIZE <= window.innerHeight - 8;

  if (placement === "text") {
    const range = document.createRange();
    range.selectNodeContents(element);
    const text = range.getBoundingClientRect();
    const y = text.top + text.height / 2 - SIZE / 2;
    for (const x of [text.right + 14, text.left - SIZE - 14]) {
      if (fits(x, y)) return { x, y };
    }
    return null;
  }
  if (placement === "left") {
    const panel = element.closest<HTMLElement>(".lab-panel")?.getBoundingClientRect() ?? rect;
    const y = rect.top + Math.min(rect.height, 48) / 2 - SIZE / 2;
    for (const x of [panel.left - SIZE - 12, rect.right + 12]) {
      if (fits(x, y)) return { x, y };
    }
    return null;
  }
  // Perched on top of the element, like sitting on a ledge.
  const top = { x: rect.left + rect.width / 2 - SIZE / 2, y: rect.top - SIZE + 12 };
  return fits(top.x, top.y) ? top : null;
}

function resolve(target: Target): Spot | null {
  if (!target) return null;
  const element = document.querySelector<HTMLElement>(target.selector);
  return element ? place(element, target.placement) : null;
}

// True when nothing but the element itself (or plain layout) lies under the spot.
function clear(spot: Spot, element: HTMLElement, probe: HTMLElement) {
  return [
    [0.5, 0.5],
    [0.15, 0.15],
    [0.85, 0.15],
    [0.15, 0.85],
    [0.85, 0.85],
  ].every(([fx, fy]) => {
    const under = document
      .elementsFromPoint(spot.x + SIZE * fx, spot.y + SIZE * fy)
      .find((candidate) => !probe.contains(candidate));
    return !under || under.contains(element) || !under.closest(BUSY);
  });
}

// A heading or section label in view, other than the current one, with empty space beside it.
function pickRoam(current: HTMLElement | null, probe: HTMLElement): Roam {
  const options: HTMLElement[] = [];
  for (const element of document.querySelectorAll<HTMLElement>(ROAM_SELECTOR)) {
    if (element === current || element.closest("dialog")) continue;
    const rect = element.getBoundingClientRect();
    if (rect.top < 96 || rect.bottom > window.innerHeight - 72) continue;
    const spot = place(element, "text");
    if (spot && clear(spot, element, probe)) options.push(element);
  }
  if (!options.length) return null;
  return { element: options[Math.floor(Math.random() * options.length)], placement: "text" };
}

// Riding along: perched on a planet while the orbit is moving.
function riding(target: Target) {
  return Boolean(
    target?.selector.startsWith("#lab-node-") &&
      document.querySelector<HTMLElement>(".lab-orbit")?.dataset.moving === "true",
  );
}

function setLook(button: HTMLElement, angle: number | null) {
  button.style.setProperty("--look-x", angle === null ? "0px" : `${(Math.cos(angle) * 4).toFixed(2)}px`);
  button.style.setProperty("--look-y", angle === null ? "0px" : `${(Math.sin(angle) * 4).toFixed(2)}px`);
}

function center(): Spot {
  return { x: window.innerWidth / 2 - SIZE / 2, y: window.innerHeight / 2 - SIZE / 2 };
}

// The head script marks the first homepage view of a session with data-intro="play" (FR-037).
function introPlaying() {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "play";
}

export function LabProbe() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const { active, paused } = useMotion();
  // Entrance (Revision 4): held at the screen centre, lids closed, until released.
  const introHold = useRef(introPlaying());
  const [introEye, setIntroEye] = useState<"closed" | "open" | null>(() => (introPlaying() ? "closed" : null));
  const buttonRef = useRef<HTMLButtonElement>(null);
  const physics = useRef({ x: 0, y: 0, vx: 0, vy: 0, last: 0, peak: 0, thrown: false });
  const targetRef = useRef<Target>(null);
  const homeRef = useRef<Target>(null);
  const roamRef = useRef<Roam>(null);
  const heldAt = useRef(0);
  const tipActive = useRef(false);
  const moodRef = useRef<"normal" | "resting" | "celebrate">("normal");
  const frameRef = useRef(0);
  const dragRef = useRef<{ id: number; startX: number; startY: number; moved: boolean; samples: { x: number; y: number; t: number }[] } | null>(null);
  const suppressClick = useRef(false);
  const [canTravel, setCanTravel] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"docked" | "travelling" | "perched" | "dragged">("docked");
  const [mood, setMood] = useState<"normal" | "resting" | "celebrate">("normal");
  const [tip, setTip] = useState<string | null>(null);
  // Tips open above the eye, toward the side with more room, so they sit in section padding
  // rather than over text.
  const [tipSide, setTipSide] = useState<"left" | "right">("right");

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

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
  // scroll, resize, a new target, a new roaming spot, or the orbit starting to move.
  useEffect(() => {
    const button = buttonRef.current;
    if (!hydrated || !button) return;
    const state = physics.current;
    let landingTimer = 0;
    let roamTimer = 0;
    let pickFailedAt = -Infinity;

    function position(x: number, y: number) {
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
      Object.assign(state, { x: home.x, y: home.y, vx: 0, vy: 0, peak: 0, thrown: false });
      position(home.x, home.y);
      stretch(0, 0);
      return;
    }

    if (introHold.current) {
      const start = center();
      Object.assign(state, { x: start.x, y: start.y, vx: 0, vy: 0, peak: 0 });
      position(start.x, start.y);
    }

    function roamSpot(): Spot | null {
      const roam = roamRef.current;
      const spot = roam && place(roam.element, roam.placement);
      if (spot || performance.now() - pickFailedAt < 500) return spot;
      roamRef.current = pickRoam(roam?.element ?? null, button!);
      if (!roamRef.current) pickFailedAt = performance.now();
      return roamRef.current && place(roamRef.current.element, roamRef.current.placement);
    }

    // The current target if it is in view; otherwise a roaming spot; the dock only as a last resort.
    function goal(): Spot {
      if (introHold.current) return center();
      return resolve(targetRef.current) ?? roamSpot() ?? dock();
    }

    function step(time: number) {
      frameRef.current = 0;
      if (dragRef.current?.moved) return;
      const dt = Math.min(0.05, state.last ? (time - state.last) / 1000 : 1 / 60);
      state.last = time;
      const spot = goal();
      state.vx += (STIFFNESS * (spot.x - state.x) - DAMPING * state.vx) * dt;
      state.vy += (STIFFNESS * (spot.y - state.y) - DAMPING * state.vy) * dt;
      let speed = Math.hypot(state.vx, state.vy);
      if (state.thrown && speed <= MAX_SPEED) state.thrown = false;
      if (!state.thrown && speed > MAX_SPEED) {
        state.vx *= MAX_SPEED / speed;
        state.vy *= MAX_SPEED / speed;
        speed = MAX_SPEED;
      }
      state.x += state.vx * dt;
      state.y += state.vy * dt;
      position(state.x, state.y);
      state.peak = Math.max(state.peak, speed);
      stretch(state.vx, state.vy);
      if (speed > 40) setLook(button!, Math.atan2(state.vy, state.vx));
      const settled = Math.hypot(spot.x - state.x, spot.y - state.y) < 0.5 && speed < 5;
      const parked = targetRef.current || roamRef.current ? "perched" : "docked";
      if (settled && !riding(targetRef.current)) {
        state.last = 0;
        if (state.peak > 300) land();
        state.peak = 0;
        stretch(0, 0);
        setMode(parked);
        return;
      }
      setMode(settled ? parked : "travelling");
      frameRef.current = window.requestAnimationFrame(step);
    }

    function wake() {
      if (!frameRef.current && !document.hidden) {
        frameRef.current = window.requestAnimationFrame(step);
      }
    }

    // Every 6–11 s, unless held by a recent selection, showing a tip, dragged, or resting,
    // move on to another heading in view.
    function scheduleRoam() {
      roamTimer = window.setTimeout(() => {
        const held = performance.now() - heldAt.current < HOLD_MS;
        if (!dragRef.current && !tipActive.current && !held && moodRef.current !== "resting" && !document.hidden) {
          homeRef.current = null;
          targetRef.current = null;
          roamRef.current = pickRoam(roamRef.current?.element ?? null, button!) ?? roamRef.current;
          wake();
        }
        scheduleRoam();
      }, 6000 + Math.random() * 5000);
    }

    function focus(event: Event) {
      const detail = (event as CustomEvent<FocusDetail>).detail;
      const target = detail.selector ? { selector: detail.selector, placement: detail.placement ?? "top" } : null;
      targetRef.current = target;
      tipActive.current = Boolean(detail.tip);
      if (!detail.tip) {
        homeRef.current = target;
        if (target) heldAt.current = performance.now();
      }
      setTip(detail.tip ?? null);
      setTipSide((resolve(target) ?? dock()).x > window.innerWidth * 0.55 ? "left" : "right");
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
    scheduleRoam();
    window.addEventListener("lab:focus", focus);
    window.addEventListener("lab:orbit", wake);
    window.addEventListener("lab:intro-end", wake);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      window.clearTimeout(landingTimer);
      window.clearTimeout(roamTimer);
      window.removeEventListener("lab:focus", focus);
      window.removeEventListener("lab:orbit", wake);
      window.removeEventListener("lab:intro-end", wake);
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

  // Entrance: open at 0.45 s, look left then right, look ahead, then shrink and glide off at
  // 1.45 s; the page's CSS entrance ends by 2.6 s, when data-intro is removed. Pausing motion
  // ends it at once. Waits while motion is still being determined (not active, not paused).
  useEffect(() => {
    const button = buttonRef.current;
    const root = document.documentElement;
    if (!hydrated || !button || root.dataset.intro !== "play") return;
    const timers: number[] = [];
    const at = (ms: number, run: () => void) => timers.push(window.setTimeout(run, ms));
    function release() {
      introHold.current = false;
      setIntroEye(null);
      window.dispatchEvent(new Event("lab:intro-end"));
    }
    function finish() {
      release();
      delete root.dataset.intro;
    }
    if (paused) {
      at(0, finish);
    } else if (active) {
      at(450, () => setIntroEye("open"));
      at(750, () => setLook(button, Math.PI));
      at(1050, () => setLook(button, 0));
      at(1300, () => setLook(button, null));
      at(1450, release);
      at(2600, finish);
    }
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [hydrated, active, paused]);

  // Blinks at random every 2–6 s (sometimes twice), only while motion is active.
  useEffect(() => {
    const button = buttonRef.current;
    if (!hydrated || !active || !button) return;
    let timer = 0;
    function close(then?: () => void) {
      button!.dataset.blink = "true";
      timer = window.setTimeout(() => {
        delete button!.dataset.blink;
        timer = window.setTimeout(then ?? schedule, then ? 160 : 0);
      }, 130);
    }
    function schedule() {
      timer = window.setTimeout(() => {
        if (document.hidden) return schedule();
        close(Math.random() < 0.2 ? () => close() : undefined);
      }, 2000 + Math.random() * 4000);
    }
    schedule();
    return () => {
      window.clearTimeout(timer);
      delete button.dataset.blink;
    };
  }, [hydrated, active]);

  // The iris looks toward the pointer (unless moving); rests (dozes) after 30 s without
  // interaction; celebrates on request.
  useEffect(() => {
    if (!hydrated) return;
    let idle = window.setTimeout(() => setMood("resting"), 30000);
    let frame = 0;
    let px = 0;
    let py = 0;
    function look() {
      frame = 0;
      const button = buttonRef.current;
      const { vx, vy } = physics.current;
      if (!button || Math.hypot(vx, vy) > 40) return;
      const rect = button.getBoundingClientRect();
      setLook(button, Math.atan2(py - (rect.top + rect.height / 2), px - (rect.left + rect.width / 2)));
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
        thrown: true,
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
      data-intro={introEye ?? undefined}
      data-intro-big={introEye && canTravel ? "true" : undefined}
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
      {/* Decorative robot eye: ground shadow, float, ping, stretch, then a scan halo around a lens
          housing whose iris follows the gaze and whose shutter lids blink. */}
      <span className="probe-body" aria-hidden="true">
        <span className="probe-shadow" />
        <span className="probe-float">
          <span className="probe-ping" />
          <span className="probe-stretch">
            <span className="probe-scene">
              <span className="probe-halo" />
              <span className="probe-eye">
                <span className="probe-iris">
                  <span className="probe-pupil" />
                </span>
                <span className="probe-shine" />
                <span className="probe-lid probe-lid-top" />
                <span className="probe-lid probe-lid-bottom" />
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
      {tip && canTravel && !introEye && (
        <span className="probe-tip" aria-hidden="true">
          {tip}
        </span>
      )}
    </button>
  );
}
