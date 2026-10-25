import type { Metadata } from "next";
import { releases } from "@/content/changelog";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: `Changelog | ${profile.name}`,
  description: "Releases of this portfolio, newest first.",
};

export default function ChangelogPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <div className="changelog site-shell">
        <p className="eyebrow">Changelog</p>
        <h1>What changed</h1>
        <ol className="release-list">
          {releases.map((release) => (
            <li key={release.version}>
              <article className="release" aria-labelledby={`release-${release.version}`}>
                <h2 id={`release-${release.version}`}>
                  Version {release.version}{" "}
                  <time dateTime={release.date}>{release.date}</time>
                </h2>
                <p>{release.summary}</p>
                <ul>
                  {release.changes.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
