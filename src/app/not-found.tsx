import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

// No canonical or sharing fields: not-found pages are never indexed (feature 005 FR-002).
export const metadata: Metadata = {
  title: `Page not found | ${profile.name}`,
  description: "The address may be mistyped, or the page may not be published.",
};

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1}>
      <div className="not-found site-shell">
        <p className="eyebrow">404 / Not found</p>
        <h1>This page isn’t here</h1>
        <p>
          The address may be mistyped, or the page may not be published. The published
          case studies are listed on the work page.
        </p>
        <ul className="not-found-links">
          <li>
            <Link href="/work">See all work</Link>
          </li>
          <li>
            <Link href="/">Go to the homepage</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
