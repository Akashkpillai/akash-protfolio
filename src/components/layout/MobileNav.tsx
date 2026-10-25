"use client";

import { useRef, type KeyboardEvent, type MouseEvent } from "react";
import Link from "next/link";
import type { NavigationItem } from "@/content/navigation";

type MobileNavProps = {
  items: readonly NavigationItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const disclosureRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key === "Escape" && disclosureRef.current?.open) {
      event.preventDefault();
      disclosureRef.current.open = false;
      summaryRef.current?.focus();
    }
  }

  function closeAfterNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (disclosureRef.current) {
      disclosureRef.current.open = false;
    }

    const targetId = new URL(event.currentTarget.href).hash.slice(1);
    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.focus({ preventScroll: true });
    });
  }

  return (
    <details
      className="mobile-nav"
      ref={disclosureRef}
      onKeyDown={handleKeyDown}
    >
      <summary className="mobile-nav-summary" ref={summaryRef}>
        <span>Menu</span>
        <span className="menu-indicator" aria-hidden="true" />
      </summary>
      <nav className="mobile-nav-panel" aria-label="Mobile primary">
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={closeAfterNavigation}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
