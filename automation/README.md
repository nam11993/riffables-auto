# Riffables Automation

This folder contains executable Playwright automation derived from the QA AI workflow test cases.

Flow-to-testcase mapping is tracked in:

```text
qa-ai-workflow/automation/smoke-flow.md
qa-ai-workflow/automation/auth-account-flow.md
qa-ai-workflow/automation/setup-organization-flow.md
```

## Current Smoke Scope

The first smoke flow covers:

| Test Case ID | Coverage |
| --- | --- |
| `TC-AUTH-003` | Unauthenticated user cannot open protected console route. |
| `TC-AUTH-001` | Valid creator login reaches authenticated console/workspace. |
| `TC-CONSOLE-011` | Core console navigation loads. |
| `TC-SOURCE-007` | Source connection entry point opens when present. |
| `TC-AUTH-004` | Sign out blocks protected route again. |
| `TC-PUBLIC-009` | Published public site loads when `PUBLIC_SITE_URL` is provided. |

## Setup

Install dependencies:

```powershell
npm install
npx playwright install chromium
```

Create a local `.env` from `.env.example` or set the same variables in your shell.

Required:

```text
BASE_URL
SMOKE_EMAIL
SMOKE_PASSWORD
```

Recommended:

```text
LOGIN_PATH
PROTECTED_PATH
CONSOLE_PATH
AUTH_STORAGE_STATE
PUBLIC_SITE_URL
TENANT_EXPECTED_TEXT
SOURCE_EXPECTED_CHOICES
```

The sign-in page also has a `Continue with Google` option, but this smoke suite prioritizes the direct email/password form submit. If a future account is routed through Google OAuth, Playwright may be blocked by Google's browser automation protections. In that case the authenticated smoke tests are skipped with an explicit reason. To run that OAuth variant, provide one of these:

- A non-Google QA email/password login.
- An app-supported QA auth bypass for staging.
- A pre-captured Playwright storage state path through `AUTH_STORAGE_STATE`.
- A test session cookie/token that can be loaded before the smoke flow.

Selector overrides are optional and should only be used if the default accessible label/placeholder detection does not work:

```text
SELECTOR_EMAIL
SELECTOR_PASSWORD
SELECTOR_SUBMIT
SELECTOR_SIGN_OUT
```

## Run

All automated tests:

```powershell
npm test
```

Latest full staging check:

```text
11 passed
1 skipped
```

The skipped test is `TC-PUBLIC-009`, which requires `PUBLIC_SITE_URL`.

Smoke only:

```powershell
npm run test:smoke
```

Auth account flows:

```powershell
npm run test:auth
```

Latest smoke staging check:

```text
3 passed
1 skipped
```

The skipped test is `TC-PUBLIC-009`, which requires `PUBLIC_SITE_URL`.

Latest auth account staging check:

```text
8 tests passed
```

The auth account suite covers `TC-AUTH-023`, `TC-AUTH-024`, `TC-AUTH-025`, and setup-organization cases `TC-AUTH-044` through `TC-AUTH-048`. Password reset/change completion cases are split into `TC-AUTH-026` through `TC-AUTH-043` and require mailbox or reset-link capture before they can be automated.

Headed mode:

```powershell
npm run test:smoke:headed
```

Debug mode:

```powershell
npm run test:debug
```

Open HTML report:

```powershell
npm run report
```

## Information Needed From QA

Before making the smoke suite stable, provide:

- QA/staging console URL. Current target: `https://riffables.speedrunlabs.ai`.
- Direct email/password staging account. Keep the real credentials in local environment variables only.
- Protected route path, for example `/console/sources`. Current smoke can log in from `/sign-in` and start from `/`.
- Expected tenant/workspace label after login.
- Whether source connection can be opened safely.
- Public tenant site URL if public smoke should run.
- Any selectors for login fields if labels/placeholders are not standard.
