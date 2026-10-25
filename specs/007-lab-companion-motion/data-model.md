# Data Model: Lab Companion, Ask the Lab, Motion, and Messages

No database; nothing leaves the browser. Existing content types unchanged.

## MotionPreference (client)

`"on" | "paused"` in `localStorage["lab-motion"]` (fallback `sessionStorage`); default `on`.
Effective motion: `active = preference === "on" && !prefersReducedMotion`.
Reflected as `<html data-motion="on|paused">`.

## LabTopic (`src/lib/lab-knowledge.ts`, server → client props)

| Field | Type | Rule |
| --- | --- | --- |
| `id` | `string` | Unique; `about`, `experience`, `skills`, `contact`, `unfinished`, or a published slug |
| `label` | `string` | Suggested-question text, ≤ 60 characters |
| `keywords` | `readonly string[]` | Lower-case match terms (project names, stack terms, aliases) |
| `paragraphs` | `readonly string[]` | Verbatim published content; may start with a short interface label ("Stack:") |
| `links` | `readonly { label: string; href: string }[]` | ≥ 1; internal published routes, contact hrefs, or the résumé |

Built only from `publishedProjects`; a draft never becomes a topic or appears in text.

## LabAnswer / AnswerSource

`LabAnswer { topicId: string | null; paragraphs: readonly string[]; links: readonly
{ label; href }[] }` (`topicId: null` = fallback).
`AnswerSource { answer(question: string): Promise<LabAnswer> }`; the scripted source resolves
immediately; a future AI source may take longer (the dialog shows typing until it resolves).

## LabMessage (client, conversation)

`{ id: number; from: "visitor" | "lab"; paragraphs: string[]; links?: …[] }`; latest 20 kept.
Question input: trimmed, 1–300 characters.

## ProbeState (client)

| Field | Values |
| --- | --- |
| `mode` | `docked` · `travelling` · `perched` · `resting` · `dragged` |
| `target` | `{ selector: string } \| null` (null = dock) |
| `tip` | `string \| null` (on-page text only) |
| `seen` | section ids, `sessionStorage["lab-probe-seen"]` |
| position/velocity | x, y, vx, vy (viewport px), spring stiffness 170, damping 26 |

Events (DOM `CustomEvent` on `window`): `lab:focus { selector, tip? }`, `lab:celebrate`,
`lab:ask { opener: HTMLElement }`.

## MessageDraft (client)

| Field | Rule |
| --- | --- |
| `name` | trimmed, 1–80 characters |
| `email` | trimmed, matches `^[^\s@]+@[^\s@]+\.[^\s@]+$`, ≤ 254 |
| `topic` | `Job opportunity` · `Project` · `Question` · `Other` (default `Job opportunity`) |
| `message` | trimmed, 10–2,000 characters |

`deliverMessage(draft) → { kind: "mailto"; href; text }`:
subject `[Portfolio] <topic> — <name>`; body `<message>\n\n— <name>\nReply to: <email>`;
`href = mailto:<owner email>?subject=<enc>&body=<enc>`.
