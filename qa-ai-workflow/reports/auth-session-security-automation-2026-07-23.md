# Auth Session Security Automation Report - 2026-07-23

## Scope

Focused auth session, protected-route, logout, and removed-session coverage.

Command:

```powershell
pnpm run test:auth:session -- --reporter=line
```

Runtime:

```text
BASE_URL=https://riffables.speedrunlabs.ai
SMOKE_EMAIL=<direct email/password QA account>
Browser=Playwright Chromium
```

## Result

```text
4 Playwright checks
4 passed
0 failed
0 skipped
```

## Passed And Partial

| Test case(s) | Result |
| --- | --- |
| `TC-AUTH-007` | Pass. Valid creator login reaches authenticated console context with navigation, workspace switch, and `Sign out` visible. |
| `TC-AUTH-010` | Pass. Signed-out `/sources` is gated to sign-in; authenticated state can access `/sources` with console controls visible. |
| `TC-AUTH-011` | Pass. After sign out, browser Back, direct `/sources`, and refresh remain gated and do not expose protected data. |
| `TC-AUTH-012` | Partial pass. Removed local session through cookie/localStorage/sessionStorage clearing is safely gated on refresh and direct route. Server-side expired/revoked token simulation is still not automated. |

## Notes

- The first run hit staging auth rate limiting after repeated UI logins. The spec now logs in once and reuses Playwright storage state for the remaining session checks.
- The suite disables screenshots, video, and trace artifacts to avoid preserving sensitive auth form state in failure output.
