# Smoke Automation Flow Mapping

## Purpose

This document describes the automation flow and maps each automated step back to the testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for testcase details and per-case automation status. This document only explains how the Playwright smoke script groups executable steps.

## Script

```text
automation/tests/smoke/main-smoke.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-16` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Result | `3 automated tests passed`, `1 skipped` |

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| Unauthenticated protected route check | `TC-AUTH-003` | `Auto PASS 2026-07-16` | Opens `/sources` from a signed-out session and verifies the user is gated by `/sign-in`. |
| Direct email/password login | `TC-AUTH-001` | `Auto PASS 2026-07-16` | Opens `/sign-in`, submits email/password, selects an existing organization if prompted, and reaches console. |
| Console route smoke | `TC-CONSOLE-011` | `Auto PASS 2026-07-16` | Verifies `/`, `/sources`, `/content`, and `/sites` load in authenticated tenant context. |
| Sources workflow smoke | `TC-SOURCE-007` | `Auto PASS 2026-07-16` | Verifies Sources page, supported source types, existing source area, and crawl/action controls. |
| Sign out and protected route re-check | `TC-AUTH-004` | `Auto PASS 2026-07-16` | Signs out and verifies `/sources` requires authentication again. |
| Published public site smoke | `TC-PUBLIC-009` | `Auto SKIP 2026-07-16 - missing PUBLIC_SITE_URL` | Skipped until a published public tenant URL is provided. |

## Execution Notes

The smoke automation is intentionally allowed to group several testcase IDs into one executable browser flow when that is more efficient. Even when grouped in automation, status updates in the testcase file must remain per testcase ID.

Current browser flow:

```text
/sources while signed out
-> /sign-in
-> enter email
-> Continue
-> enter password
-> Sign in
-> select existing organization if prompted
-> dismiss first-time onboarding if prompted
-> verify /
-> verify /sources
-> verify /content
-> verify /sites
-> verify source types and crawl controls
-> sign out
-> verify /sources is gated again
```
