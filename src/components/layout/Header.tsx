import Link from "next/link";
import { navigationItems } from "@/content/navigation";
import { profile } from "@/content/profile";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-shell header-inner">
        <Link className="brand" href="/" aria-label={`${profile.name}, Home`}>
          <span className="brand-name">{profile.name}</span>
          <span className="brand-note">The Engineering Journal</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav items={navigationItems} />
      </div>
    </header>
  );
}
