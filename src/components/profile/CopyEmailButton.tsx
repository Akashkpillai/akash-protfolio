"use client";

import { useState, useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function CopyEmailButton({ email }: { email: string }) {
  const enhanced = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  if (!enhanced) {
    return null;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="copy-email">
      <button className="copy-email-button" type="button" onClick={copy}>
        Copy email
      </button>
      <p className="copy-email-status" aria-live="polite" aria-atomic="true">
        {state === "copied" && "Email copied"}
      </p>
      {state === "failed" && (
        <label className="copy-email-fallback">
          Copy the address manually:
          <input
            readOnly
            value={email}
            onFocus={(event) => event.currentTarget.select()}
            ref={(input) => input?.select()}
          />
        </label>
      )}
    </div>
  );
}
