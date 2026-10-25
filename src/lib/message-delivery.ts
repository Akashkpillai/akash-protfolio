// Message delivery (feature 007 FR-018–FR-022). Today the message is composed for the visitor's
// own email app — nothing is sent or stored by the site. A server-side sender can replace
// deliverMessage later and return { kind: "sent" } without changing the form.

export const messageTopics = ["Job opportunity", "Project", "Question", "Other"] as const;
export type MessageTopic = (typeof messageTopics)[number];

export type MessageDraft = { name: string; email: string; topic: MessageTopic; message: string };
export type MessageField = keyof MessageDraft;
export type MessageErrors = Partial<Record<MessageField, string>>;

export const MESSAGE_LIMIT = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateMessage(draft: MessageDraft): MessageErrors {
  const errors: MessageErrors = {};
  const name = draft.name.trim();
  const email = draft.email.trim();
  const message = draft.message.trim();
  if (!name) errors.name = "Enter your name.";
  else if (name.length > 80) errors.name = "Use 80 characters or fewer.";
  if (!email) errors.email = "Enter your email address so I can reply.";
  else if (email.length > 254 || !EMAIL.test(email)) errors.email = "Enter an email address like name@example.com.";
  if (!messageTopics.includes(draft.topic)) errors.topic = "Choose a topic.";
  if (message.length < 10) errors.message = "Write at least 10 characters.";
  else if (message.length > MESSAGE_LIMIT) errors.message = `Use ${MESSAGE_LIMIT} characters or fewer.`;
  return errors;
}

export type Delivery = { kind: "mailto"; href: string; subject: string; body: string };

export function deliverMessage(draft: MessageDraft, to: string): Delivery {
  const name = draft.name.trim();
  const subject = `[Portfolio] ${draft.topic} — ${name}`;
  const body = `${draft.message.trim()}\n\n— ${name}\nReply to: ${draft.email.trim()}`;
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { kind: "mailto", href, subject, body };
}
