# UI Contract: Professional Profile

Extends the 001–003 contracts, which remain in force.

## Routes

| Route | Status | Content |
| --- | --- | --- |
| `/` | 200 | Hero, Selected work, Experience, Skills, About, Approach, Contact |
| `/changelog` | 200 | Releases newest first |
| `/resume/Akash_K_Pillai_Resume.pdf` | 200 when the approved PDF is present | PDF download |

## Homepage sections

| Eyebrow | Id | Content |
| --- | --- | --- |
| 02 / Selected work | `#work` | Unchanged |
| 03 / Experience | `#experience` | Roles newest first: title, organization, location, dates, highlights; InFineIT projects nested |
| 04 / Skills | `#skills` | Six groups; linked skills go to published case studies |
| 05 / About | `#about` | Education and path, languages, "Kerala, India" |
| 06 / Approach | `#approach` | Unchanged content; eyebrow renumbered |
| 07 / Contact | `#contact` | Email link + visible address + "Copy email" (after hydration), LinkedIn, GitHub, résumé download (if present) |

Dates render as "Jul 2026 – Present" and "Mar 2023 – Jul 2026" with `<time>` elements.

## Navigation

- Items: Home `/`, Work `/#work`, Experience `/#experience`, About `/#about`, Approach
  `/#approach`, Contact `/#contact`; desktop and mobile menus.
- Hero: keeps "Explore the flow" and "View selected work"; adds "Download résumé" only if
  the PDF is present.

## Footer (every page)

- "Version X.Y.Z" linking to `/changelog`; the owner's name. No phone or town.

## `/changelog`

- One `h1`; each release an `h2` with version and `<time>` date, a one-line summary, and a
  list of changes. Newest first; newest equals the footer version.

## Copy email

- Native button "Copy email"; on success a polite live region reads "Email copied"; on
  failure the address is shown selected for manual copy. Absent without JavaScript; the
  address text and mail link remain.

## Constraints

No phone number or home town on any page or metadata. 390/768/1440 px and 200% zoom
without horizontal scroll; keyboard; visible focus; reduced motion; readable without
JavaScript.
