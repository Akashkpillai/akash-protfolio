# UI Contract: Lab Companion, Ask the Lab, Motion, and Messages

Adds to [006's UI contract](../../006-systems-lab-redesign/contracts/ui.md); everything there
still holds except where noted (006 FR-017's ban on continuous motion is relaxed for the
pausable ambient background only).

## Global

- `<html data-motion="on|paused">`; inline head script applies a saved `paused` before paint.
- Header: `button.motion-toggle` (≥ 44 × 44 px), accessible name "Pause motion",
  `aria-pressed="true"` when paused; visible icon changes (pause bars ↔ play triangle) and a
  visible "Motion off" text when paused. Present on every page, desktop and mobile.
- `div.ambient` (`aria-hidden`, fixed, behind content): grid, two aurora glows, six signals,
  pointer spotlight. Animates only with motion active.
- `div.scroll-progress` (`aria-hidden`, fixed top, 2 px teal) where scroll-driven animations
  are supported.
- Probe: `button.probe` "Ask the lab", fixed; docked bottom-right (24 px insets, 52 px orb, 44 px
  minimum hit area) unless travelling/perched; `data-mode` reflects state; tip bubble
  `aria-hidden`. Not rendered before hydration. Hidden while the dialog is open.

## Ask the lab dialog

- `dialog#ask-lab[aria-labelledby]` opened with `showModal()`.
- Heading "Ask the lab"; footnote "Answers are scripted from this site's content — no AI
  service is used yet."; Close button.
- Suggested questions: buttons, one per topic (6 general + 1 per published project).
- Conversation: `div[role="log"][aria-live="polite"]`, newest last, scrolls internally; each
  lab answer: paragraphs + links; typing indicator `div.typing` (three dots, `aria-hidden`)
  while waiting (700 ms with motion active, none otherwise).
- Form: label "Ask a question", `input` (maxlength 300), Send button; empty input does nothing
  but shows "Type a question first." politely.
- Escape/Close closes and focuses the opener.

## Homepage additions

- Hero actions gain "Ask the lab" (`button`, hydration-only) after Resume.
- Sections carry `data-probe-section` and their intro paragraph `data-probe-tip`.
- Order: Systems → 02 Work → 03 Experience → 04 Skills → 05 About → **06 Message** → 07 Contact.
- Experience role list shows a vertical timeline rail with dots.

## Message section (`section#message`)

- Label "06 / Message"; `h2` "Send a message"; intro: "Your message opens in your own email app,
  ready to send. This site doesn't store or send anything."
- `form` (`noValidate`, fallback `action="mailto:…" method="post" encType="text/plain"`):
  Name (`autocomplete="name"`), Email (`type="email" autocomplete="email"`), Topic (`select`),
  Message (`textarea`, maxlength 2000, live count "n / 2000" announced only from 1,800).
- Errors: `p.field-error#<field>-error` with `aria-invalid="true"` on the field; summary
  `p[role="status"]`; focus first invalid field.
- Success: status "Your email app should open with the message ready to send." + "Copy message"
  button (copies subject and body) + plain address link.
- Without JS: form posts to `mailto:`; address link visible.

## Motion inventory (all off with reduced motion; ambient/decorative off when paused)

| Effect | Trigger | Duration |
| --- | --- | --- |
| Aurora drift, grid signals | always (ambient) | 40–60 s / 8–14 s loops |
| Pointer spotlight | fine-pointer move | per frame |
| Scroll progress | scroll | scroll-linked |
| Section reveals (up/left/right/scale/clip) | enters view | 300–450 ms |
| Timeline rail draw + dots | experience enters view | 900 ms |
| Card/panel tilt + spotlight | fine-pointer move | per frame, ≤ 6° |
| Packet along spoke | node selected | 450 ms once |
| Panel step stagger | selection | 260 ms + 45 ms × index |
| Probe travel/perch/rest/celebrate | events, scroll, 30 s idle | spring ~0.6–1.2 s |
| Typing indicator | waiting for an answer | 700 ms |
