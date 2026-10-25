import Link from "next/link";
import { navigationItems, type NavigationItem } from "@/content/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { hasResume, resumeHref } from "@/lib/resume";

export function Header() {
  // Checked on the server; MobileNav (a client component) receives plain items only.
  const items: readonly NavigationItem[] = hasResume()
    ? [...navigationItems, { label: "Resume", href: resumeHref, download: true }]
    : navigationItems;

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-shell header-inner">
        <Link className="brand" href="/">
          <span className="brand-name">Akash</span>
          <span className="brand-slash" aria-hidden="true">/</span>
          <span className="brand-note">Systems Lab</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                {item.download ? (
                  <a className="nav-resume" href={item.href} download>
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-tools">
          <MotionToggle />
          <MobileNav items={items} />
        </div>
      </div>
    </header>
  );
}
