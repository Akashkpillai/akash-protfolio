import Link from "next/link";
import { currentVersion } from "@/content/changelog";
import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <p>{profile.name}</p>
        <Link href="/changelog">Version {currentVersion}</Link>
      </div>
    </footer>
  );
}
