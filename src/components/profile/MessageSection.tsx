import { email } from "@/content/contact";
import { Reveal } from "@/components/lab/Reveal";
import { MessageForm } from "@/components/profile/MessageForm";

// Message section (feature 007 US3): composed in the visitor's own email app; nothing stored.
export function MessageSection() {
  return (
    <section
      className="profile-section message-section"
      id="message"
      aria-labelledby="message-title"
      tabIndex={-1}
      data-probe-section="message"
    >
      <div className="site-shell message-layout">
        <div>
          <p className="eyebrow" data-probe-tip="Send a message">
            06 / Message
          </p>
          <h2 id="message-title">Send a message</h2>
          <p className="profile-intro">
            Your message opens in your own email app, ready to send. This site doesn&apos;t store or send
            anything.
          </p>
          <p className="message-direct">
            Prefer to write directly? <a href={`mailto:${email}`}>{email}</a>
          </p>
        </div>
        <Reveal variant="up">
          <MessageForm to={email} />
        </Reveal>
      </div>
    </section>
  );
}
