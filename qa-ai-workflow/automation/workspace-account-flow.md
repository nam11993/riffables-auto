# Workspace And Account Automation Flow Mapping

## Purpose

This document maps Home sidebar workspace/account automation flows back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for testcase details and per-case automation status. This file only explains how Playwright executes the related workspace and account flows.

## Script

```text
automation/tests/console/workspace-account.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-16` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Result | `4 automated tests passed` |

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| Home workspace menu lists workspaces and account actions | `TC-AUTH-049` | `Auto PASS 2026-07-16` | Opens Home, clicks the sidebar workspace/account button, then verifies workspace rows, `Create workspace`, and `Account settings`. |
| Account Settings opens from Home workspace menu | `TC-AUTH-050` | `Auto PASS 2026-07-16` | Opens `Account settings` from the workspace menu and verifies `/settings`, account headings, sign-in methods, Email, Password, and `Change password`. |
| Create workspace modal validates blank input and auto-generates slug | `TC-AUTH-051` | `Auto PASS 2026-07-16` | Verifies blank submit is disabled, workspace name auto-generates slug, invalid slug disables submit, and cancel closes the modal. |
| Created workspace becomes active and selectable after login | `TC-AUTH-052` | `Auto PASS 2026-07-16` | Creates a real staging workspace, verifies it becomes active, signs out and signs in again, then selects the created workspace from `/setup-organization`. |

## Execution Notes

The suite runs in serial mode with one shared authenticated browser context to avoid excessive repeated login attempts against staging.

`TC-AUTH-052` creates a real staging workspace on the configured account so it can verify persistence across sign-out and sign-in. Use a dedicated QA account for repeatable regression runs.

Keep real credentials in environment variables only. Do not commit `.env` files.
