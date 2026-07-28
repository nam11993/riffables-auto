# Home Automation Flow Mapping

## Purpose

This document maps Home/Overview console automation flows back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for testcase details and per-case automation status. This file only explains how Playwright executes the related Home flows.

## Script

```text
automation/tests/console/home.spec.ts
automation/tests/console/home-dynamic.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-28` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Result | `Dynamic Home: 6 actual passes, 1 expected failure, 0 unexpected failures` |

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| Home dashboard workflow links | `TC-CONSOLE-003` | `Auto PASS 2026-07-16` | Verifies Home dashboard cards and top-level workflow navigation to Sources, Content, and Sites, then returns to Home. |
| Top-level section identity after refresh | `TC-CONSOLE-009` | `Auto PASS 2026-07-16` | Opens Home, Sources, Content, and Sites; verifies route identity; refreshes each route and confirms the same section remains loaded. |
| Dashboard heading structure | `TC-A11Y-005` | `Auto PASS 2026-07-16` | Verifies Home, Sources, Content, and Sites each have one visible `h1` and non-skipping visible heading order. |
| Home Overview summary modules show workspace status | `TC-CONSOLE-023` | `Auto PASS 2026-07-16` | Verifies Sources, Riffs, Articles, and Site summary modules are visible and show workspace status text. |
| Home Overview summary modules navigate to target pages | `TC-CONSOLE-024` | `Auto PASS 2026-07-16` | Clicks each Overview summary module and verifies routing to Sources, Content, Content, and Sites without auth redirect. |
| Home Next step CTA routes to Sources | `TC-CONSOLE-025` | `Auto PASS 2026-07-16` | Verifies the `Next step` recommendation and clicks the Sources CTA. |
| Home How it works sequence | `TC-CONSOLE-026` | `Auto PASS 2026-07-16` | Verifies the ordered connect-source, extract-ideas, publish-site workflow copy. |
| First Home onboarding consent | `TC-ONBOARD-007` | `Auto PASS 2026-07-28` | Creates a new creator and organization, closes the zero-source checklist when it overlays Home, and verifies the first-visit onboarding consent prompt and choices. |
| Empty Home state | `TC-CONSOLE-027` | `Auto PASS 2026-07-28` | Creates a real empty workspace and verifies zero/none state, source recommendation, and no Recent content. |
| Empty Site state | `TC-CONSOLE-032` | `Auto PASS 2026-07-28` | Verifies Home Site state routes to setup and remains unchanged. |
| Crawled content ready state | `TC-CONSOLE-030` | `Auto PASS 2026-07-28` | Verifies Baohan returning state, review CTA, counts, and Recent content. |
| Published Site state | `TC-CONSOLE-034` | `Auto PASS 2026-07-28` | Verifies Home, `/sites`, and Baohan live URL agree. |
| Cross-page Overview metrics | `TC-CONSOLE-035` | `Auto PASS 2026-07-28` | Compares Home values with Sources, total Content rows, Articles, and Sites. |
| Latest Recent content | `TC-CONSOLE-036` | `Auto PASS 2026-07-28` | Compares Home rows with the top Content results and verifies ordering/navigation. |
| Workspace Home isolation | `TC-CONSOLE-038` | `Auto EXPECTED FAIL 2026-07-28` | Secondary workspace label changes but primary Baohan data remains exposed on Home. |

## Execution Notes

The existing-account Home Overview cases run in serial mode with one shared authenticated browser context to avoid excessive repeated login attempts against staging.

`TC-ONBOARD-007` creates a real staging account and organization so it can verify the first authenticated Home visit for a new creator. Use a plus-addressable QA mailbox prefix for repeatable runs.

Detailed dynamic-state execution is documented in:

```text
qa-ai-workflow/automation/home-dynamic-flow.md
```

## Pending Dynamic Overview Coverage

The following Home Overview cases are intentionally not automated yet because they require controlled workspace fixtures or backend state transitions:

```text
TC-CONSOLE-028
TC-CONSOLE-029
TC-CONSOLE-031
TC-CONSOLE-033
TC-CONSOLE-037
TC-CONSOLE-039
TC-CONSOLE-040
```

Automation for these cases should start only after QA has a stable fixture for each remaining state: source connected with no output, active processing, generated article, site draft, controlled crawl transition, failed crawl, and numeric/status boundaries.

Keep real credentials in environment variables only. Do not commit `.env` files.
