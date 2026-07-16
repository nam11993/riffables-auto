# Home Automation Flow Mapping

## Purpose

This document maps Home/Overview console automation flows back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for testcase details and per-case automation status. This file only explains how Playwright executes the related Home flows.

## Script

```text
automation/tests/console/home.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-16` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Result | `8 automated tests passed` |

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
| First Home onboarding consent | `TC-ONBOARD-007` | `Auto PASS 2026-07-16` | Creates a new creator and organization, lands on Home, and verifies the first-visit onboarding consent prompt and choices. |

## Execution Notes

The existing-account Home Overview cases run in serial mode with one shared authenticated browser context to avoid excessive repeated login attempts against staging.

`TC-ONBOARD-007` creates a real staging account and organization so it can verify the first authenticated Home visit for a new creator. Use a plus-addressable QA mailbox prefix for repeatable runs.

## Pending Dynamic Overview Coverage

The following Home Overview cases are intentionally not automated yet because they require controlled workspace fixtures or backend state transitions:

```text
TC-CONSOLE-027
TC-CONSOLE-028
TC-CONSOLE-029
TC-CONSOLE-030
TC-CONSOLE-031
TC-CONSOLE-032
TC-CONSOLE-033
TC-CONSOLE-034
TC-CONSOLE-035
TC-CONSOLE-036
TC-CONSOLE-037
TC-CONSOLE-038
TC-CONSOLE-039
TC-CONSOLE-040
```

Automation for these cases should start only after QA has at least one stable fixture/workspace for each relevant state: empty, source connected, crawl processing, content ready for review, article generated, site draft, site published, failed crawl, and multi-workspace isolation.

Keep real credentials in environment variables only. Do not commit `.env` files.
