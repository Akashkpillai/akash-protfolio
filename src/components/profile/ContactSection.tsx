import { contactLinks, email } from "@/content/contact";
import { CopyEmailButton } from "@/components/profile/CopyEmailButton";
import { ResumeLink } from "@/components/profile/ResumeLink";

export function ContactSection() {
  const others = contactLinks.filter((link) => link.kind !== "email");

  return (
    <section className="profile-section profile-section-contact" id="contact" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="site-shell">
        <p className="eyebrow">07 / Contact</p>
        <h2 id="contact-title">Get in touch</h2>
        <div className="contact-grid">
          <div className="contact-email">
            <p className="contact-label">Email</p>
            <a className="contact-address" href={`mailto:${email}`}>
              {email}
            </a>
            <CopyEmailButton email={email} />
          </div>
          <ul className="contact-links">
            {others.map((link) => (
              <li key={link.kind}>
                <a href={link.href} rel="me">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
            <li>
              <ResumeLink />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
