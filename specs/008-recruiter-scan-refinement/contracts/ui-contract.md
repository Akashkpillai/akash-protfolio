# UI Contract: Recruiter-Scan Refinement

Visitor-facing surface that tests and links depend on. Anything not listed is unchanged from
feature 007.

## Homepage anchors

| id | Element | Note |
| --- | --- | --- |
| `systems` | hero section | unchanged |
| `project-map` | map section | unchanged |
| `architecture-panel` | selected-project summary section | nodes' `aria-controls` target |
| `work` | selected work | target of "View selected work" |
| `experience`, `skills`, `about` | profile sections | unchanged |
| `contact` | the only contact section | |
| `message` | form block inside `#contact` | focusable (`tabindex="-1"`) |

## Hero

- `h1#lab-title` = profile name; `.lab-kicker` = role; `.lab-copy` = intro sentence.
- `.lab-actions`: `a.lab-button-primary[href="#work"]` "View selected work";
  `a[download][href="/resume/Akash_K_Pillai_Resume.pdf"]` "Resume PDF" (only when the file
  exists); `button.lab-button-ask` "Ask the lab" (hydrated only).
- No `.lab-headline`, no `.lab-focus` in the hero.

## Selected-project summary (`#architecture-panel`)

- `h3#lab-panel-title` (project name), `.lab-panel-summary`.
- `details.lab-architecture` > `summary` "Explore architecture"; closed on load.
  Inside: `.lab-panel-label` (explanatory, not live data), `ol.lab-flow > li.lab-step#lab-step-N`,
  optional `.lab-branch`, `.lab-panel-actions button` (Trace flow / Next step / Restart trace).
- `a.lab-panel-link` "Open case study" outside the disclosure.

## Project cards (`/` and `/work`)

- `article.project-story.project-story-featured | .project-story-compact`.
- `dl.story-facts` with `dt` "The problem", "What it does", "My contribution" in that order.
- `ul.stack-list`, `.project-preview` (diagram + caption), `ul.evidence-note`,
  `a.project-story-link`.

## Contact (`#contact`)

- `h2#contact-title` "Get in touch"; email link, `.copy-email-button`, LinkedIn, GitHub,
  résumé download; `#message` block with `h3` "Send a message", note naming the visitor's
  email app, `form.message-form`, `button.message-send` "Compose email".

## Ask the lab (`dialog#ask-lab`)

- `.ask-lab-suggestions` shows 4 buttons initially; `button.ask-lab-more[aria-expanded]`
  "More questions" controls `#ask-lab-more`; scripted note `.ask-lab-note` unchanged.

## Probe events

- Unchanged event names (`lab:focus`, `lab:orbit`, `lab:celebrate`, `lab:ask`,
  `lab:ask-state`, `lab:intro-end`). `lab:focus` with a null or unresolvable selector docks,
  unless a wandering trip is due later (Revision 1).
- Revision 1: `.probe[data-mode]` gains no new values; a wandering trip shows as `travelling`
  then `perched`. `.probe[data-wander="true"]` marks a wandering spot (for tests).

## Card tilt (Revision 1)

- `.project-tilt` wrapper around each `article.project-story`; `data-tilting` present only while
  a fine pointer moves over it; `--tilt-x`/`--tilt-y` within ±2deg.
