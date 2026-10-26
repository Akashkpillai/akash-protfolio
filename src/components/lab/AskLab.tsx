"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useMotion } from "@/components/motion/MotionProvider";
import { createScriptedSource, type LabAnswer } from "@/lib/lab-answer";
import type { LabParagraph, LabTopic } from "@/lib/lab-knowledge";

// Ask the lab (feature 007 FR-007–FR-012): a modal dialog that answers from the site's own
// content through a replaceable AnswerSource. Opened by a "lab:ask" event from the Probe or the
// hero button; focus returns to whichever opened it.

type Entry = { id: number; from: "visitor" | "lab"; text?: string; answer?: LabAnswer };

const MAX_ENTRIES = 20;
const greeting: LabAnswer = {
  topicId: "greeting",
  paragraphs: [{ text: "Hi — ask about Akash's projects, experience, stack, or how to get in touch. I answer only from what's on this site." }],
  links: [],
};

function Paragraph({ paragraph }: { paragraph: LabParagraph }) {
  return (
    <div className="lab-answer-paragraph">
      {(paragraph.label || paragraph.note || paragraph.status) && (
        <p className="lab-answer-label">
          {paragraph.label}
          {paragraph.note && <span> · {paragraph.note}</span>}
          {paragraph.status && <span className="lab-answer-status"> {paragraph.status}</span>}
        </p>
      )}
      {paragraph.text && <p>{paragraph.text}</p>}
      {paragraph.items && (
        <ul>
          {paragraph.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AskLab({ topics }: { topics: readonly LabTopic[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const nextId = useRef(1);
  const { active } = useMotion();
  const source = useMemo(() => createScriptedSource(topics), [topics]);
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, from: "lab", answer: greeting }]);
  const [typing, setTyping] = useState(false);
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  // Four starter questions; the rest on request (feature 008 FR-021).
  const [moreOpen, setMoreOpen] = useState(false);
  const initialTopics = topics.filter((topic) => topic.initial);
  const moreTopics = topics.filter((topic) => !topic.initial);

  useEffect(() => {
    function open(event: Event) {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      openerRef.current = (event as CustomEvent<{ opener?: HTMLElement }>).detail?.opener ?? null;
      dialog.showModal();
      window.dispatchEvent(new CustomEvent("lab:ask-state", { detail: { open: true } }));
    }
    window.addEventListener("lab:ask", open);
    return () => window.removeEventListener("lab:ask", open);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function closed() {
      window.dispatchEvent(new CustomEvent("lab:ask-state", { detail: { open: false } }));
      // Next frame: the Probe is hidden while the dialog is open and must re-render visible
      // before it can take focus back.
      window.requestAnimationFrame(() => openerRef.current?.focus());
    }
    dialog.addEventListener("close", closed);
    return () => dialog.removeEventListener("close", closed);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [entries, typing]);

  async function ask(text: string) {
    const trimmed = text.trim().slice(0, 300);
    if (!trimmed) {
      setHint("Type a question first.");
      return;
    }
    setHint("");
    setQuestion("");
    const visitor: Entry = { id: nextId.current++, from: "visitor", text: trimmed };
    setEntries((current) => [...current, visitor].slice(-MAX_ENTRIES));
    setTyping(true);
    const [answer] = await Promise.all([
      source.answer(trimmed),
      new Promise((resolve) => setTimeout(resolve, active ? 700 : 0)),
    ]);
    setTyping(false);
    setEntries((current) => [...current, { id: nextId.current++, from: "lab" as const, answer }].slice(-MAX_ENTRIES));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  return (
    <dialog className="ask-lab" id="ask-lab" ref={dialogRef} aria-labelledby="ask-lab-title">
      <div className="ask-lab-head">
        <div>
          <p className="lab-label">Systems Lab guide</p>
          <h2 id="ask-lab-title">Ask the lab</h2>
        </div>
        <button className="ask-lab-close" type="button" onClick={() => dialogRef.current?.close()}>
          Close
        </button>
      </div>

      <div className="ask-lab-log" ref={logRef} role="log" aria-live="polite" aria-label="Conversation">
        {entries.map((entry) =>
          entry.from === "visitor" ? (
            <p className="ask-lab-entry ask-lab-visitor" key={entry.id}>
              <span className="visually-hidden">You asked: </span>
              {entry.text}
            </p>
          ) : (
            <div className="ask-lab-entry ask-lab-reply" key={entry.id}>
              <span className="visually-hidden">The lab answered: </span>
              {entry.answer?.paragraphs.map((paragraph, index) => (
                <Paragraph key={index} paragraph={paragraph} />
              ))}
              {entry.answer && entry.answer.links.length > 0 && (
                <ul className="ask-lab-links">
                  {entry.answer.links.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("/") ? (
                        <Link href={link.href} onClick={() => dialogRef.current?.close()}>
                          {link.label}
                        </Link>
                      ) : (
                        <a href={link.href}>{link.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        )}
        {typing && (
          <div className="ask-lab-typing" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className="ask-lab-suggestions" role="group" aria-label="Suggested questions">
        {initialTopics.map((topic) => (
          <button key={topic.id} type="button" onClick={() => void ask(topic.label)} disabled={typing}>
            {topic.label}
          </button>
        ))}
        {moreTopics.length > 0 && (
          <button
            className="ask-lab-more"
            type="button"
            aria-expanded={moreOpen}
            aria-controls="ask-lab-more"
            onClick={() => setMoreOpen((open) => !open)}
          >
            {moreOpen ? "Fewer questions" : "More questions"}
          </button>
        )}
        <div className="ask-lab-more-list" id="ask-lab-more" hidden={!moreOpen}>
          {moreTopics.map((topic) => (
            <button key={topic.id} type="button" onClick={() => void ask(topic.label)} disabled={typing}>
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      <form className="ask-lab-form" onSubmit={submit}>
        <label htmlFor="ask-lab-input">Ask a question</label>
        <div className="ask-lab-row">
          <input
            id="ask-lab-input"
            type="text"
            maxLength={300}
            value={question}
            autoComplete="off"
            onChange={(event) => setQuestion(event.target.value)}
          />
          <button className="lab-button lab-button-primary" type="submit" disabled={typing}>
            Send
          </button>
        </div>
        <p className="ask-lab-hint" aria-live="polite">
          {hint}
        </p>
      </form>
      <p className="ask-lab-note">Answers are scripted from this site&apos;s content — no AI service is used yet.</p>
    </dialog>
  );
}
