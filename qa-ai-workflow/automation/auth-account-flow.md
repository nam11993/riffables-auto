# Auth Account Automation Flow Mapping

## Purpose

This document maps standalone account-management automation flows back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for testcase details and per-case automation status. This file only explains how Playwright executes the related account flows.

## Script

```text
automation/tests/auth/account-flows.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-16` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Result | `3 automated tests passed` |

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| New creator account signup | `TC-AUTH-023` | `Auto PASS 2026-07-16` | Creates a new account through `Create an account`, enters name/email/password, and verifies routing to organization setup. |
| Forgot password reset-link request | `TC-AUTH-024` | `Auto PASS 2026-07-16` | Enters existing account email, clicks `Forgot password?`, and verifies the reset-link sent confirmation. |
| Authenticated change-password link request | `TC-AUTH-025` | `Auto PASS 2026-07-16` | Logs in, opens `/settings`, clicks `Change password`, and verifies the `Check your email` password-change link confirmation. |

## Execution Notes

Signup creates real staging accounts. Use a fresh email address for each successful run. For Gmail accounts, a plus-address can be used for repeatable QA runs while still routing mail to the same inbox.

Forgot password sends a reset link to the target mailbox. Authenticated change password currently requests an email link from Account Settings instead of changing the password inline.

The email-link completion coverage is intentionally split into separate testcase IDs:

- Forgot-password reset completion and related negative/security cases: `TC-AUTH-026` through `TC-AUTH-034`.
- Change-password completion and related negative/security cases: `TC-AUTH-035` through `TC-AUTH-043`.

Until mailbox access or reset-link capture is available, Playwright does not automate those completion cases.
