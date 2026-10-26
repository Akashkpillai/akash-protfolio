# UX Requirements Quality Checklist: Recruiter-Scan Refinement

**Purpose**: Unit tests for the requirements' wording — hero, project cards, motion, contact,
Ask the lab, accessibility, and evidence honesty
**Created**: 2026-10-26
**Feature**: [spec.md](../spec.md)

**Ownership note**: Reviewer-owned. `[x]` means the reviewer judged the requirement wording
satisfactory; it does not mean the implementation is done. `$speckit-implement` reads these
markers but does not change them.

## Requirement Completeness

- [ ] CHK001 Are the hero's contents and their order specified for each breakpoint (wide, tablet, phone)? [Completeness, Spec §FR-001, §FR-005]
- [ ] CHK002 Is the hero's behaviour defined when the résumé file is absent? [Completeness, Spec §Edge Cases]
- [ ] CHK003 Are all blocks of a project card and their reading order specified? [Completeness, Spec §FR-009]
- [ ] CHK004 Is the source of each card sentence (problem, summary, contribution) defined so no new claim is introduced? [Completeness, Spec §Clarifications, §FR-009]
- [ ] CHK005 Are the contents of the merged contact section enumerated, including the form's disclosure text? [Completeness, Spec §FR-019, §FR-020]
- [ ] CHK006 Is the set of four initial Ask the lab questions named explicitly? [Completeness, Spec §FR-021]

## Requirement Clarity

- [ ] CHK007 Is "selected work appears sooner" expressed as a measurable comparison with a stated baseline? [Clarity, Spec §FR-007, §SC-002]
- [ ] CHK008 Is "more prominent" for HRMS and Meridian defined by layout rather than adjectives? [Clarity, Spec §FR-010]
- [ ] CHK009 Is "reduce simultaneous decorative effects" defined as a concrete list of removed and retained effects? [Clarity, Spec §FR-014]
- [ ] CHK010 Is "more breathing room" in Ask the lab tied to identifiable properties (log height, dialog width)? [Clarity, Spec §FR-022]
- [ ] CHK011 Is "readable line length" quantified? [Clarity, Spec §FR-017]

## Requirement Consistency

- [ ] CHK012 Do the motion requirements (no roaming) agree with retained Probe behaviours (section tips, entrance, trace follow) and with SC-005? [Consistency, Spec §FR-013, §SC-005, §Clarifications]
- [ ] CHK013 Are project-card requirements consistent between the homepage and the `/work` index? [Consistency, Spec §FR-012]
- [ ] CHK014 Does removing the hero headline and focus strip conflict with the design direction or metadata requirements? [Consistency, Spec §FR-006, §FR-024]

## Acceptance Criteria Quality

- [ ] CHK015 Can card-text fidelity be verified objectively (exact match to records)? [Measurability, Spec §SC-003]
- [ ] CHK016 Is the performance criterion stated with a threshold and measuring environment? [Measurability, Spec §SC-006]

## Scenario and Edge-Case Coverage

- [ ] CHK017 Are no-JavaScript requirements stated for the hero disclosure, Ask the lab, copy email, and the form? [Coverage, Spec §US1-5, §Edge Cases]
- [ ] CHK018 Is behaviour defined when a project is changed while the architecture is expanded or a trace is in progress? [Edge Case, Spec §Edge Cases]
- [ ] CHK019 Are old `#message` and `#contact` links covered, including from other routes? [Coverage, Spec §US3]
- [ ] CHK020 Is the behaviour defined when reveal or observation logic fails? [Exception Flow, Spec §FR-015]

## Non-Functional: Accessibility and Honesty

- [ ] CHK021 Are keyboard, focus, target-size, and non-colour selected-state requirements defined for the mobile selectors and disclosures? [Accessibility, Spec §FR-003, §FR-005]
- [ ] CHK022 Are expanded/collapsed states required to be exposed to assistive technology for both new disclosures? [Accessibility, Spec §FR-003, §FR-021]
- [ ] CHK023 Is it explicit that diagrams remain labelled explanatory and that no screenshot or generated image may stand in as evidence? [Honesty, Spec §FR-011]
- [ ] CHK024 Are evidence labels and limitation markers required to remain visible after review wording leaves the introduction? [Honesty, Spec §FR-008, §FR-009]

## Dependencies and Assumptions

- [ ] CHK025 Is the relationship to paused feature 005 (no task closed, UI checks re-run later) documented? [Assumption, Spec §Starting state]
- [ ] CHK026 Is the version/changelog decision assigned to an owner and moment? [Dependency, Spec §Clarifications, §FR-023]

## Notes

- Generated 2026-10-26, depth standard, audience: owner as reviewer before implementation.
- Requirements review (agent, 2026-10-26, advisory only — markers left for the owner): every
  item has a matching spec passage cited above; one gap found and fixed before tasks —
  CHK014: design direction still describes the three-part hero and headline; FR-024 already
  requires updating it, so no spec change was needed. No conflicts found.
