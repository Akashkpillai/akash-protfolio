"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  MESSAGE_LIMIT,
  deliverMessage,
  messageTopics,
  validateMessage,
  type Delivery,
  type MessageDraft,
  type MessageErrors,
  type MessageField,
} from "@/lib/message-delivery";

const fields: readonly MessageField[] = ["name", "email", "topic", "message"];

// Message form (feature 007 FR-018–FR-022). Without JavaScript the form still posts to the
// visitor's email app (mailto action); with it, fields are validated and the message is
// composed through deliverMessage.
export function MessageForm({ to }: { to: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<MessageDraft>({ name: "", email: "", topic: "Job opportunity", message: "" });
  const [errors, setErrors] = useState<MessageErrors>({});
  const [summary, setSummary] = useState("");
  const [sent, setSent] = useState<Delivery | null>(null);
  const [copied, setCopied] = useState(false);

  function update<K extends MessageField>(field: K, value: MessageDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateMessage(draft);
    setErrors(found);
    const first = fields.find((field) => found[field]);
    if (first) {
      const count = fields.filter((field) => found[field]).length;
      setSummary(`${count} ${count === 1 ? "field needs" : "fields need"} attention.`);
      formRef.current?.querySelector<HTMLElement>(`#message-${first}`)?.focus();
      return;
    }
    setSummary("");
    const delivery = deliverMessage(draft, to);
    // Opens the visitor's email app; nothing is sent from this page.
    const link = document.createElement("a");
    link.href = delivery.href;
    link.click();
    setSent(delivery);
    setCopied(false);
    window.dispatchEvent(new CustomEvent("lab:celebrate"));
  }

  async function copy() {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`To: ${to}\nSubject: ${sent.subject}\n\n${sent.body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const length = draft.message.length;
  const describedBy = (field: MessageField, extra?: string) =>
    [errors[field] ? `message-${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  return (
    <form
      ref={formRef}
      className="message-form"
      action={`mailto:${to}`}
      method="post"
      encType="text/plain"
      noValidate
      onSubmit={submit}
    >
      <div className="message-row">
        <div className="message-field">
          <label htmlFor="message-name">Name</label>
          <input
            id="message-name"
            name="name"
            autoComplete="name"
            maxLength={80}
            value={draft.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            onChange={(event) => update("name", event.target.value)}
          />
          {errors.name && <p className="field-error" id="message-name-error">{errors.name}</p>}
        </div>
        <div className="message-field">
          <label htmlFor="message-email">Email</label>
          <input
            id="message-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={draft.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            onChange={(event) => update("email", event.target.value)}
          />
          {errors.email && <p className="field-error" id="message-email-error">{errors.email}</p>}
        </div>
      </div>
      <div className="message-field">
        <label htmlFor="message-topic">Topic</label>
        <select
          id="message-topic"
          name="topic"
          value={draft.topic}
          aria-invalid={errors.topic ? true : undefined}
          aria-describedby={describedBy("topic")}
          onChange={(event) => update("topic", event.target.value as MessageDraft["topic"])}
        >
          {messageTopics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
        {errors.topic && <p className="field-error" id="message-topic-error">{errors.topic}</p>}
      </div>
      <div className="message-field">
        <label htmlFor="message-message">Message</label>
        <textarea
          id="message-message"
          name="message"
          rows={6}
          maxLength={MESSAGE_LIMIT}
          value={draft.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", "message-count")}
          onChange={(event) => update("message", event.target.value)}
        />
        <p className="message-count" id="message-count" aria-live={length >= MESSAGE_LIMIT - 200 ? "polite" : "off"}>
          {length} / {MESSAGE_LIMIT}
        </p>
        {errors.message && <p className="field-error" id="message-message-error">{errors.message}</p>}
      </div>
      <p className="message-summary" role="status">
        {summary}
      </p>
      <button className="lab-button lab-button-primary message-send" type="submit">
        Compose email <span aria-hidden="true">→</span>
      </button>
      {sent && (
        <div className="message-sent" role="status">
          <p>Your email app should open with the message ready to send.</p>
          <p>
            If it didn&apos;t, copy the message and send it to <a href={`mailto:${to}`}>{to}</a>.
          </p>
          <button className="lab-button lab-button-ghost" type="button" onClick={copy}>
            {copied ? "Message copied" : "Copy message"}
          </button>
        </div>
      )}
    </form>
  );
}
