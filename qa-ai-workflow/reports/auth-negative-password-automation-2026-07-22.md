# Auth Negative And Password UX Automation Report - 2026-07-22

## Scope

Focused auth negative, password UI, and signed-out account-route coverage.

Command:

```powershell
pnpm run test:auth:negative -- --reporter=line
```

Runtime:

```text
BASE_URL=https://riffables.speedrunlabs.ai
SMOKE_EMAIL=<direct email/password QA account>
Browser=Playwright Chromium
```

## Result

```text
7 Playwright checks
7 passed
0 failed
0 skipped
```

## Passed

| Test case(s) | Result |
| --- | --- |
| `TC-AUTH-002`, `TC-AUTH-008` | Wrong password and generated unknown email both return generic `Invalid email or password`, do not create a session, and protected `/sources` remains gated. |
| `TC-AUTH-009` | Email-step `Continue` is disabled while blank; password-step `Sign in` is disabled while blank; password-only submission is not available from the email step. |
| `TC-AUTH-013` | `Show password` changes the field from masked to visible text and `Hide password` returns it to masked without changing typed value or submitting. |
| `TC-AUTH-014` | After revealing password, `Back to email` and continuing again resets the password field to masked state with `aria-pressed=false`. |
| `TC-AUTH-015` | Password toggle is keyboard-operable with `Enter`/`Space`, has `Show password`/`Hide password` labels, updates `aria-pressed`, and meets 24x24 px pointer target baseline. |
| `TC-AUTH-034` | Forgot-password request for a generated unknown email returns generic reset-link confirmation without account-existence leak and without session creation. |
| `TC-AUTH-043` | Signed-out `/settings` redirects/gates to `/sign-in`; Account Settings and `Change password` action are unavailable. |

## Notes

- The suite intentionally avoids successful login and does not use the real password.
- `TC-AUTH-034` uses a generated `example.com` unknown email. The current staging behavior shows the entered email in the generic confirmation, which is acceptable because it does not reveal whether the address exists in Riffables.
- A transient staging shell error (`This page couldn't load`) appeared once during the first run. The spec now retries `/sign-in` load once before asserting the email field.
