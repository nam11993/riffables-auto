# Source Automation Flow Mapping

## Purpose

This document maps Sources/YouTube automation flows back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for testcase details and per-case automation status. This file explains what Playwright currently verifies and where Google owner OAuth is still required.

## Script

```text
automation/tests/sources/youtube-source.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-16` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Result | `2 automated tests passed` |

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| YouTube source form accepts handle and starts Google owner verification | `TC-SOURCE-013` | `Auto PASS 2026-07-16` | Fills `@namnguyen11993`, verifies `Verify with Google` enables, then confirms redirect to Google OAuth for Speedrun Labs. |
| Connected YouTube channel is active with crawl controls | `TC-SOURCE-014` | `Auto PASS 2026-07-16` | Verifies existing connected source `@namnguyen11993` is visible as `YouTube channel`, `Active`, `Auto`, with source and crawl controls. |

## OAuth Boundary

`TC-SOURCE-002` and `TC-SOURCE-008` require completing Google owner consent for the YouTube channel. The current direct Riffables email/password account can reach the Google OAuth handoff, but cannot complete the owner verification step without a Google account/session authorized for the channel or a staging test bypass.

Keep real credentials in environment variables only. Do not commit `.env` files.
