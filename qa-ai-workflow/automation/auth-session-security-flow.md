# Auth Session Security Automation Flow Mapping

## Purpose

This document maps auth session and protected-route security automation back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for detailed steps and per-case status. This file explains how Playwright executes the related auth session checks.

## Script

```text
automation/tests/auth/auth-session-security.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-23` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Result | `4 automated tests passed` |

Command:

```powershell
pnpm run test:auth:session -- --reporter=line
```

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| Creator valid login with tenant shell | `TC-AUTH-007` | `Auto PASS 2026-07-23` | Logs in from a clean session, selects/dismisses setup surfaces if present, and verifies console nav, workspace switch, and `Sign out`. |
| Protected route signed-out gate then authenticated access | `TC-AUTH-010` | `Auto PASS 2026-07-23` | Verifies signed-out `/sources` is gated, then authenticated state can access `/sources` with console actions visible. |
| Sign out invalidates back/direct/refresh access | `TC-AUTH-011` | `Auto PASS 2026-07-23` | Signs out from `/sources`, checks browser Back, direct `/sources`, and refresh remain gated. |
| Removed local session handling | `TC-AUTH-012` | `Auto PARTIAL PASS 2026-07-23` | Clears cookies/localStorage/sessionStorage and verifies protected route gates. Server-side expired/revoked token simulation is still gated. |

## Execution Notes

The suite logs in once and stores Playwright storage state for the remaining checks. This keeps the regression faithful to authenticated-session behavior while avoiding repeated staging auth requests that can trigger rate limiting.

Screenshots, video, and traces are disabled for this spec because auth failure artifacts can include sensitive form state in the DOM snapshot.
