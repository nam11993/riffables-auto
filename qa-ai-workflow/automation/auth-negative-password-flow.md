# Auth Negative And Password UX Automation Flow Mapping

## Purpose

This document maps auth negative and password UI/UX automation back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for detailed steps and per-case status. This file explains how Playwright executes the related auth checks.

## Script

```text
automation/tests/auth/auth-negative-password.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-22` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Result | `7 automated tests passed` |

Command:

```powershell
pnpm run test:auth:negative -- --reporter=line
```

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| Wrong password and unknown email rejection | `TC-AUTH-002`, `TC-AUTH-008` | `Auto PASS 2026-07-22` | Verifies generic `Invalid email or password`, no account-existence copy, no authenticated session, and protected route remains gated. |
| Blank/incomplete sign-in validation | `TC-AUTH-009` | `Auto PASS 2026-07-22` | Verifies email-step `Continue` disabled while blank and password-step `Sign in` disabled while password is blank. |
| Password show/hide toggle | `TC-AUTH-013` | `Auto PASS 2026-07-22` | Verifies field switches between masked password and visible text without changing the typed value or submitting the form. |
| Password reveal resets after email-step navigation | `TC-AUTH-014` | `Auto PASS 2026-07-22` | Verifies returning to email step and continuing again resets the password field to masked state with `aria-pressed=false`. |
| Password toggle accessibility | `TC-AUTH-015` | `Auto PASS 2026-07-22` | Verifies keyboard operation, `Show password`/`Hide password` labels, `aria-pressed`, and 24x24 px target baseline. |
| Forgot-password unknown email safety | `TC-AUTH-034` | `Auto PASS 2026-07-22` | Uses a generated unknown email and verifies generic reset-link confirmation without account-existence leak or session creation. |
| Signed-out settings gate | `TC-AUTH-043` | `Auto PASS 2026-07-22` | Opens `/settings` signed out, verifies redirect/gate to `/sign-in`, and confirms `Change password` is unavailable. |

## Execution Notes

The suite does not hard-code real credentials. It only needs `BASE_URL` and `SMOKE_EMAIL` for the password-step checks. `SMOKE_PASSWORD` is not used by this suite because it intentionally avoids successful login.

`TC-AUTH-034` sends a forgot-password request for a generated unknown `example.com` email. The current staging behavior intentionally shows a generic "We sent a link" confirmation for both known and unknown addresses, which is acceptable for account-enumeration resistance.
