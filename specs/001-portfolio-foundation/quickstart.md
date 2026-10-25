# Quickstart: Validate Portfolio Foundation

Use this guide to validate the implemented foundation. Outcomes from the current
implementation are recorded in [verification.md](verification.md). See [UI contract](contracts/ui.md)
and [data model](data-model.md) for expected behavior.

## Prerequisites

- Work from the project root on `feat/001-portfolio-foundation` with active feature
  `specs/001-portfolio-foundation`.
- Use a Node.js version supported by the selected Next.js release and npm. Record the
  actual versions when implementing.
- Keep `.specify/`, `.agents/`, `docs/`, and `specs/` while scaffolding the app.

## Planned setup and checks

From the project root, run:

```powershell
npm ci
npm run lint
npm run typecheck
npm run build
npm run dev
```

Use the browser to open the local URL printed by the development server. Record any new
results or failures in `verification.md`; existing outcomes there describe only checks
actually performed.

## Browser review

1. At 390, 768, and 1440 pixel widths, confirm name, role, and headline are visible in
   the initial view. Check vertical reading order and absence of horizontal scrolling.
2. At each width and 200% text zoom, follow every displayed link. Home and Approach must
   reach real content; deferred destinations must not appear.
3. Use only the keyboard. Confirm visible focus, logical Tab order, Menu open/close,
   Escape behavior, and every diagram stage and step control. Confirm state is clear
   without color alone.
4. Enable reduced motion. Step through the diagram and confirm the same information is
   available without animated movement.
5. Disable JavaScript. Confirm identity, navigation destinations, diagram labels, and
   complete static explanation remain readable.
6. Inspect real text, focus, and control contrast; inspect narrow layout and visual
   differentiation. Automated accessibility results supplement this review.
7. Review public copy against `docs/project-evidence.md` and obtain confirmation of
   provisional role/headline before publication. Check that no draft, résumé, demo, or
   unavailable destination is presented as a public action.

Record any failure against the corresponding spec requirement and keep it open until
fixed or the specification is explicitly revised.
