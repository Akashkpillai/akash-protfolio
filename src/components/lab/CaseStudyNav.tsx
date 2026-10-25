"use client";

import { useEffect, useState } from "react";
import { ClaimStatus } from "@/components/work/ClaimStatus";
import type { ClaimStatus as Status } from "@/content/claim-status";

type Props = {
  sections: readonly { id: string; label: string }[];
  steps: readonly { label: string; status?: Status }[];
};

// Case-study system summary (feature 006 FR-015): the project's flow and links to each
// section. Plain links without JavaScript; with it, the section being read is marked.
export function CaseStudyNav({ sections, steps }: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    // The active section is the last heading above the reading line (35% down the viewport).
    // At the bottom of the page the last section is active, because a short final section
    // can never scroll up to the line.
    function update() {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = sections[0]?.id ?? null;
      for (const { id } of sections) {
        const heading = document.getElementById(id);
        if (heading && heading.getBoundingClientRect().top <= line) {
          current = id;
        }
      }
      setActive(atBottom ? (sections.at(-1)?.id ?? current) : current);
    }
    function schedule() {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav className="case-nav" aria-label="Case study sections">
      {steps.length > 0 && (
        <>
          <p className="lab-label">System summary</p>
          <ol className="case-nav-flow">
            {steps.map((step, index) => (
              <li key={step.label}>
                <span className="case-nav-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  {step.label} <ClaimStatus status={step.status} />
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
      <p className="lab-label">Sections</p>
      <ul className="case-nav-sections">
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} aria-current={active === section.id ? "true" : undefined}>
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
