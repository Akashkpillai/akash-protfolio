"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import { useMotion } from "@/components/motion/MotionProvider";

// The Probe (feature 007 FR-001–FR-006, Revision 2 FR-030–FR-031, Revision 3 FR-032–FR-036): a
// single mechanical eye (lens, aperture iris, shutter lids) that blinks, reacts to site activity,
// and opens Ask the lab. No face, body, or limbs.
// It travels only with a fine pointer, motion on, a wide screen, and no open dialog; otherwise it
// stays docked as a plain button. With nothing to attend to it wanders only occasionally (feature
// 008 Revision 1, FR-013): after a long rest it drifts slowly to a free spot beside a visible
// heading or project-card title, never while the visitor types, drags it, or is following a
// selection or trace; otherwise it rests at its dock. Section tips wait for the visitor to scroll.
// Targets arrive as window events:
//   lab:focus     { selector, placement: "top" | "left" | "text", tip? }  (null selector = dock)
//   lab:orbit     the planets started moving (ride along when perched on one)
//   lab:celebrate brief celebration
//   lab:ask-state { open }                                              (dim while the dialog is open)
// Section tips come from [data-probe-section] / [data-probe-tip] text already on the page.

type Placement = "top" | "left" | "text";
type Target = { selector: string; placement: Placement } | null;
type Spot = { x: number; y: number };
type FocusDetail = { selector: string | null; placement?: Placement; tip?: string };

const SIZE = 52;
const MARGIN = 24;
const STIFFNESS = 30;
const DAMPING = 11;
const MAX_SPEED = 450;
const MAX_THROW = 2400;
const SEEN_KEY = "lab-probe-seen";
// Occasional wandering (feature 008 Revision 1): slow trips after long rests.
const WANDER_SPEED = 200;
const FIRST_REST_MS = [12000, 16000] as const;
const REST_MS = [18000, 30000] as const;
const HOLD_MS = 15000;
const TYPING_MS = 5000;
const WANDER_SELECTOR = "main h2, .project-story h2, .project-story h3";
// Wandering spots must sit over empty space, not over text, links, controls, or diagrams.
const BUSY =
  "a, button, input, textarea, select, label, summary, form, nav, header, p, li, dt, dd, h1, h2, h3, h4, h5, h6, img, svg, code, pre, figure, table, blockquote, .project-preview, .lab-orbit, .lab-panel";
const TEXT_FIELD = "input, textarea, select, [contenteditable]";

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

// A heading or card title in view, other than the current one, with empty space beside its text,
// clear of the header and the dock.
function pickWander(current: HTMLElement | null, probe: HTMLElement): HTMLElement | null {
  const options: HTMLElement[] = [];
  for (const element of document.querySelectorAll<HTMLElement>(WANDER_SELECTOR)) {
    if (element === current || element.closest("dialog")) continue;
    const rect = element.getBoundingClientRect();
    if (rect.top < 96 || rect.bottom > window.innerHeight - 96) continue;
    const spot = place(element, "text");
    if (spot && clear(spot, element, probe)) options.push(element);
  }
  return options.length ? options[Math.floor(Math.random() * options.length)] : null;
}

const between = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min);

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
  // Wandering: the heading or card title the eye rests beside, the last selection or trace, the
  // last key press (typing guard), and the eye's mood (no wandering while it dozes).
  const wanderRef = useRef<HTMLElement | null>(null);
  const heldAt = useRef(-Infinity);
  const lastKeyAt = useRef(-Infinity);
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
  // scroll, resize, a new target, a wandering trip, or the orbit starting to move.
  useEffect(() => {
    const button = buttonRef.current;
    if (!hydrated || !button) return;
    const state = physics.current;
    let landingTimer = 0;
    let tripTimer = 0;
    // A trip is under way: the next rest starts only when the eye has settled again.
    let tripPending = false;

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
      wanderRef.current = null;
      delete button.dataset.wander;
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

    // A wandering spot that has left the view is dropped: the eye goes home instead of chasing a
    // new one before its next trip.
    function wanderSpot(): Spot | null {
      const element = wanderRef.current;
      const spot = element && place(element, "text");
      if (!spot) wanderRef.current = null;
      return spot;
    }

    // The current target if it is in view and has room; otherwise a wandering spot; otherwise the dock.
    function goal(): { spot: Spot; wander: boolean } {
      if (introHold.current) return { spot: center(), wander: false };
      const target = resolve(targetRef.current);
      if (target) return { spot: target, wander: false };
      const wander = wanderSpot();
      return wander ? { spot: wander, wander: true } : { spot: dock(), wander: false };
    }

    function step(time: number) {
      frameRef.current = 0;
      if (dragRef.current?.moved) return;
      const dt = Math.min(0.05, state.last ? (time - state.last) / 1000 : 1 / 60);
      state.last = time;
      const { spot, wander } = goal();
      // Wandering drifts slowly; reactions to the visitor keep the faster cap.
      const cap = wander ? WANDER_SPEED : MAX_SPEED;
      if (wander) button!.dataset.wander = "true";
      else delete button!.dataset.wander;
      state.vx += (STIFFNESS * (spot.x - state.x) - DAMPING * state.vx) * dt;
      state.vy += (STIFFNESS * (spot.y - state.y) - DAMPING * state.vy) * dt;
      let speed = Math.hypot(state.vx, state.vy);
      if (state.thrown && speed <= cap) state.thrown = false;
      if (!state.thrown && speed > cap) {
        state.vx *= cap / speed;
        state.vy *= cap / speed;
        speed = cap;
      }
      state.x += state.vx * dt;
      state.y += state.vy * dt;
      position(state.x, state.y);
      state.peak = Math.max(state.peak, speed);
      stretch(state.vx, state.vy);
      if (speed > 40) setLook(button!, Math.atan2(state.vy, state.vx));
      const settled = Math.hypot(spot.x - state.x, spot.y - state.y) < 0.5 && speed < 5;
      const parked = resolve(targetRef.current) || wander ? "perched" : "docked";
      if (settled && !riding(targetRef.current)) {
        state.last = 0;
        if (tripPending) scheduleTrip(false);
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

    // Wandering is allowed only when nothing else needs the eye and the visitor is not busy.
    function mayWander(now: number) {
      const typing =
        document.activeElement?.matches(TEXT_FIELD) === true || now - lastKeyAt.current < TYPING_MS;
      return (
        !document.hidden &&
        !introHold.current &&
        !dragRef.current &&
        !typing &&
        moodRef.current !== "resting" &&
        now - heldAt.current >= HOLD_MS &&
        !resolve(targetRef.current)
      );
    }

    // After a long rest, maybe drift to a new spot; the next rest starts once the eye has landed.
    function scheduleTrip(first: boolean) {
      window.clearTimeout(tripTimer);
      tripPending = false;
      tripTimer = window.setTimeout(() => {
        const next = mayWander(performance.now()) ? pickWander(wanderRef.current, button!) : null;
        if (next) {
          wanderRef.current = next;
          tripPending = true;
          wake();
        } else {
          scheduleTrip(false);
        }
      }, between(first ? FIRST_REST_MS : REST_MS));
    }

    function keyPressed() {
      lastKeyAt.current = performance.now();
    }

    function focus(event: Event) {
      const detail = (event as CustomEvent<FocusDetail>).detail;
      const target = detail.selector ? { selector: detail.selector, placement: detail.placement ?? "top" } : null;
      targetRef.current = target;
      wanderRef.current = null;
      if (!detail.tip) {
        homeRef.current = target;
        // A selection or trace holds the eye's attention; wandering waits a full rest afterwards.
        if (target) {
          heldAt.current = performance.now();
          scheduleTrip(true);
        }
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
    scheduleTrip(true);
    window.addEventListener("keydown", keyPressed);
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
      window.clearTimeout(tripTimer);
      window.removeEventListener("keydown", keyPressed);
      window.removeEventListener("lab:focus", focus);
      window.removeEventListener("lab:orbit", wake);
      window.removeEventListener("lab:intro-end", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [hydrated, canTravel]);

  // Section tips: the first time a section scrolls into view this visit, visit its label for 5 s.
  // Sections already in view before the visitor scrolls get no tip (feature 008 FR-013).
  useEffect(() => {
    if (!canTravel || !("IntersectionObserver" in window)) return;
    const seen = readSeen();
    const skipped = new Set<string>();
    let scrolled = false;
    let timer = 0;
    const markScrolled = () => {
      scrolled = true;
    };
    window.addEventListener("scroll", markScrolled, { passive: true, once: true });
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as HTMLElement;
          const id = section.dataset.probeSection;
          const label = section.querySelector<HTMLElement>("[data-probe-tip]");
          if (!entry.isIntersecting || !id || !label || seen.has(id) || skipped.has(id)) continue;
          if (!scrolled) {
            skipped.add(id);
            continue;
          }
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
      window.removeEventListener("scroll", markScrolled);
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
