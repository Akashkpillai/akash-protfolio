import type { Metadata } from "next";
import { releases } from "@/content/changelog";
import { changelogIntro } from "@/content/pages";
import { profile } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/changelog",
  title: `Changelog | ${profile.name}`,
  description: changelogIntro,
});

export default function ChangelogPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <div className="changelog site-shell">
        <p className="eyebrow">Changelog</p>
        <h1>What changed</h1>
        <p className="changelog-intro">{changelogIntro}</p>
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
