import { contactLinks, email } from "@/content/contact";
import { Reveal } from "@/components/lab/Reveal";
import { CopyEmailButton } from "@/components/profile/CopyEmailButton";
import { MessageForm } from "@/components/profile/MessageForm";
import { ResumeLink } from "@/components/profile/ResumeLink";

// One contact section (feature 008 FR-019, FR-020): direct links beside the message form, which
// keeps its own #message anchor. The form composes an email in the visitor's own app; nothing
// is stored or sent by this site (feature 007).
export function ContactSection() {
  const others = contactLinks.filter((link) => link.kind !== "email");

  return (
    <section className="profile-section profile-section-contact" id="contact" aria-labelledby="contact-title" tabIndex={-1} data-probe-section="contact">
      <div className="site-shell">
        <p className="eyebrow" data-probe-tip="Get in touch">06 / Contact</p>
        <h2 id="contact-title">Get in touch</h2>
        <p className="profile-intro">Email me directly, connect on LinkedIn or GitHub, or write a message below.</p>
        <div className="contact-layout">
          <div className="contact-direct">
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
          <div className="contact-message" id="message" tabIndex={-1}>
            <h3 id="message-title">Send a message</h3>
            <p className="contact-message-note">
              Compose email opens your own email app with the message ready to send. This site
              doesn&apos;t store or send anything.
            </p>
            <Reveal>
              <MessageForm to={email} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
