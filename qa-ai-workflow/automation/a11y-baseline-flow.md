# A11Y Baseline Automation Flow Mapping

## Purpose

This document maps accessibility baseline automation back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for testcase details and per-case automation status. This file explains what Playwright currently verifies, which checks are expected-fail on current staging, and which accessibility checks still need manual or dedicated-tool coverage.

## Script

```text
automation/tests/accessibility/a11y-baseline.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-23` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Command | `npm run test:a11y -- --reporter=line` |
| Result | `7 Playwright checks passed: 4 normal pass checks and 3 expected-fail checks.` |
| Scoped surfaces | Home, Sources, Content, Sites, Site Editor, sign-in validation error, and Sources Channel Videos dialog. |

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| Critical control target-size baseline | `TC-A11Y-001`, `TC-A11Y-002`, `TC-A11Y-011` | `Auto EXPECTED FAIL 2026-07-23` | Measures actual rendered boxes for visible interactive controls. Current staging has editor `Open the live site` at `171x20`, below the 24px height requirement. |
| Publish error does not show live-site success action | `TC-A11Y-004` | `Auto PASS 2026-07-23` | Opens editor publish flow in a guarded invalid-domain path, verifies error/validation copy, and confirms no `View live site`/`Live site` success action is shown. No publish mutation is made. |
| Editor headings and region structure | `TC-A11Y-006` | `Auto PASS 2026-07-23` | Verifies Site Editor exposes `Page sections`, `Section settings`, Preview, Publish, and at least one navigation landmark. |
| Known accessibility baseline: landmarks, names, alt text | `TC-A11Y-007` | `Auto EXPECTED FAIL 2026-07-23` | Console routes keep landmarks and most controls/images are named, but current staging exposes the Sources backfill date input `#since-*` without an accessible name. Color contrast still needs manual or dedicated-tool coverage. |
| Visible keyboard focus indicator | `TC-A11Y-008` | `Auto EXPECTED FAIL 2026-07-23` | Keyboard focus reaches controls, but core console focus stops do not expose a measurable visible indicator via outline, box-shadow, or underline. |
| Validation error alert/live semantics | `TC-A11Y-009` | `Auto PASS 2026-07-23` | Wrong-password sign-in error appears in alert/live semantics and keyboard focus remains usable after the error. |
| Icon-only controls are named | `TC-A11Y-010` | `Auto PASS 2026-07-23` | Verifies visible icon-only buttons have text/ARIA/title/labelling and representative editor controls expose accessible names when focused. |
| Keyboard navigation on core workflow | `TC-A11Y-012` | `Auto PASS 2026-07-23` | Tabs through core console routes, opens Sources `Videos` via keyboard Enter, verifies Channel Videos dialog focus moves to a named control, then closes without ingestion. |
| Dashboard heading structure | `TC-A11Y-005` | `Auto PASS 2026-07-16` | Existing Home automation verifies Home, Sources, Content, and Sites have one visible `h1` and non-skipping heading order. |

## Remaining A11Y Coverage

`TC-A11Y-003` still needs an approved publish-success mutation run or a stable already-successful publish fixture that surfaces the immediate `View live site` action right after publish.

The current Playwright baseline does not run a full screen-reader pass and does not calculate WCAG contrast ratios. Those remain manual or dedicated-tool follow-ups unless an approved accessibility scanner is added to the automation stack.

