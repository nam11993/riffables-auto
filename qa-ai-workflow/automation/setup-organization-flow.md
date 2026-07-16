# Setup Organization Automation Flow Mapping

## Purpose

This document maps setup-organization automation flows back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for testcase details and per-case automation status. This file only explains how Playwright executes the related setup-organization flows.

## Script

```text
automation/tests/auth/setup-organization.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-16` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Result | `5 automated tests passed` |

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| Existing creator reaches setup organization selector | `TC-AUTH-044` | `Auto PASS 2026-07-16` | Logs in with an existing creator and verifies `/setup-organization` lists existing organizations and the create-new organization section. |
| Existing creator selects an existing organization | `TC-AUTH-045` | `Auto PASS 2026-07-16` | Clicks an existing organization `Select` action and verifies the tenant-scoped console loads. |
| Blank setup form and name-to-slug behavior | `TC-AUTH-046` | `Auto PASS 2026-07-16` | Verifies blank create is disabled, entering name auto-generates a valid slug, and clearing name disables create again. |
| Invalid organization slug validation | `TC-AUTH-047` | `Auto PASS 2026-07-16` | Enters invalid slug text and verifies validation plus disabled create action. |
| New creator creates an organization | `TC-AUTH-048` | `Auto PASS 2026-07-16` | Creates a unique organization and verifies redirect to the new tenant dashboard. |

## Execution Notes

The suite creates real staging accounts for new-creator setup cases and creates a real staging organization for `TC-AUTH-048`. Use a plus-addressable QA mailbox prefix for repeatable runs.

Keep real credentials in environment variables only. Do not commit `.env` files.
