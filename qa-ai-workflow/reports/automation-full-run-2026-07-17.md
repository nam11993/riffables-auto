# Automation Full Run Report - 2026-07-17

## Summary

| Field | Value |
| --- | --- |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Scope | `automation/tests` |
| Total Playwright tests | `35` |
| Passed | `32` |
| Skipped | `3` |
| Failed | `0` |
| Duration | `4.5m` |

## Passed

| Testcase ID | Area | Result | Notes |
| --- | --- | --- | --- |
| `TC-AUTH-023` | Auth | PASS | New creator signup reaches organization setup. |
| `TC-AUTH-024` | Auth | PASS | Forgot-password request shows reset-link confirmation. |
| `TC-AUTH-025` | Auth | PASS | Authenticated change-password request shows email confirmation. |
| `TC-AUTH-044` | Setup organization | PASS | Existing creator reaches organization selector. |
| `TC-AUTH-045` | Setup organization | PASS | Existing creator selects an existing organization. |
| `TC-AUTH-046` | Setup organization | PASS | Blank organization submit is disabled and name generates slug. |
| `TC-AUTH-047` | Setup organization | PASS | Invalid organization slug is rejected. |
| `TC-AUTH-048` | Setup organization | PASS | New creator creates organization and lands on dashboard. |
| `TC-CONSOLE-003` | Home | PASS | Home dashboard links reach main creator workflows and return Home. |
| `TC-CONSOLE-009` | Home | PASS | Home, Sources, Content, and Site remain identifiable after refresh. |
| `TC-A11Y-005` | Accessibility | PASS | Dashboard screens have one visible H1 and ordered headings. |
| `TC-CONSOLE-023` | Home Overview | PASS | Overview summary modules show workspace status. |
| `TC-CONSOLE-024` | Home Overview | PASS | Overview summary modules navigate to target pages. |
| `TC-CONSOLE-025` | Home Overview | PASS | Next-step CTA routes to Sources. |
| `TC-CONSOLE-026` | Home Overview | PASS | How-it-works sequence is visible. |
| `TC-ONBOARD-007` | Onboarding | PASS | First authenticated Home visit asks whether the user is new. |
| `TC-AUTH-049` | Workspace/account | PASS | Workspace menu lists workspaces and account actions. |
| `TC-AUTH-050` | Workspace/account | PASS | Account settings opens from workspace menu. |
| `TC-AUTH-051` | Workspace/account | PASS | Create workspace modal validates blank and invalid slug input. |
| `TC-AUTH-052` | Workspace/account | PASS | Created workspace becomes active and selectable after sign-in. |
| `TC-AUTH-003` | Smoke | PASS | Signed-out user cannot open protected route. |
| `TC-AUTH-001`, `TC-CONSOLE-011`, `TC-SOURCE-007` | Smoke | PASS | Email/password login, console core routes, and source smoke pass. |
| `TC-AUTH-004` | Smoke | PASS | Sign-out blocks protected route again. |
| `TC-SOURCE-001`, `TC-SOURCE-007` | Sources | PASS | Supported source choices and availability states are visible. |
| `TC-SOURCE-014` | Sources | PASS | Connected YouTube channel is active with crawl controls. |
| `TC-SOURCE-015` | Sources | PASS | Blank YouTube source input cannot be submitted. |
| `TC-SOURCE-003`, `TC-SOURCE-009` | Sources | PASS | Manual mode can be selected before owner verification. |
| `TC-SOURCE-022` | Sources | PASS | Source types marked Crawling soon cannot be submitted. |
| `TC-SOURCE-013` | Sources | PASS | YouTube handle starts Google owner verification. |

## Expected Failures Counted As Passed

| Testcase ID | Area | Result | Notes |
| --- | --- | --- | --- |
| `TC-SOURCE-016` | Sources validation | EXPECTED FAIL | Current staging enables Google verification for malformed handles. |
| `TC-SOURCE-017` | Sources validation | EXPECTED FAIL | Current staging enables Google verification for unsupported external domains. |
| `TC-SOURCE-018` | Sources validation | EXPECTED FAIL | Current staging enables Google verification for unsupported YouTube URL types. |

## Skipped

| Testcase ID | Area | Result | Reason |
| --- | --- | --- | --- |
| `TC-PUBLIC-009` | Public site | SKIPPED | `PUBLIC_SITE_URL` was not provided. |
| `TC-SOURCE-023` | Sources | SKIPPED | Current fixture now has connected source data, so it is no longer a no-source workspace. |
| `TC-SOURCE-002`, `TC-SOURCE-008` | Sources OAuth | SKIPPED | Full mutating Google OAuth flow is gated by `SOURCE_CONNECT_FULL=false`. Google OAuth completion should remain manual handoff, pre-authorized fixture, or staging bypass. |

## Notes

- No failed tests in this run.
- The connected-source verification passed after the manual Google OAuth handoff.
- Do not commit real credentials or local `.auth` browser profiles.
