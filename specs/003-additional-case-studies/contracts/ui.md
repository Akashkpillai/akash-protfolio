# UI Contract: Additional Case Studies

Changes to the [002 UI contract](../../002-engineering-case-studies/contracts/ui.md), which
otherwise remains in force.

## Routes

| Route | Status | Content |
| --- | --- | --- |
| `/work/hrms-backend` | 200 once published | Case study |
| `/work/meridian-assistant` | 200 once published | Case study |
| `/work/notification-platform`, `/work/resume-analyzer` | 200 | Unchanged |
| `/work/user-management-api` | 404 | Not-found page (now draft) |

A draft new project returns 404 like any unknown slug.

## Homepage `#work` and `/work`

- Four numbered stories in order: `01` HRMS backend, `02` Meridian Assistant, `03`
  Notification Platform, `04` Resume Analyzer.
- Layouts alternate: preview right, preview left, full width, preview right.
- Previews differ in kind: HRMS (data model or static architecture), Meridian (workflow),
  Notification Platform (architecture), Resume Analyzer (pipeline). Each is labeled as an
  explanatory diagram — or, for Meridian once approved, as a screenshot with fictional
  data.
- Section heading copy must not say "three"; it is reworded for four projects.

## Case study (new projects)

- Same section order, headings, status labels, and label guide as 002.
- Source row reads "Source code is private" with the reviewed short commit; no link.
- No company, employer, client, or interview is mentioned anywhere on the page or in its
  metadata.
- Meridian screenshot, if approved: below the architecture text, with alt text describing
  the captured flow and a caption stating the data shown is fictional.
- Diagrams for both are static; selection buttons appear only on Notification Platform.

## Accessibility and layout

Unchanged from 002: 390/768/1440 px and 200% zoom without horizontal scroll, keyboard,
visible focus, reduced motion, readable without JavaScript.
