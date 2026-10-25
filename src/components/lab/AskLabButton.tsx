"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

// Hydration-only: without JavaScript there is no dialog to open, so no dead button renders.
export function AskLabButton({ className }: { className?: string }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  if (!hydrated) return null;

  return (
    <button
      className={className}
      type="button"
      onClick={(event) => window.dispatchEvent(new CustomEvent("lab:ask", { detail: { opener: event.currentTarget } }))}
    >
      Ask the lab
    </button>
  );
}
