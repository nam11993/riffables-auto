# A11Y Baseline Automation Report - 2026-07-23

## Scope

This run covers accessibility baseline regression for the creator console and site editor.

Test fixture:

```text
Environment: https://riffables.speedrunlabs.ai
Workspace/account fixture: Baohan QA creator workspace
Connected source: @nhnbaohan
Browser: Playwright Chromium
```

Scoped surfaces:

```text
Home
Sources
Content
Sites
Site Editor
Sign-in validation error
Sources Channel Videos dialog
```

## Command

```powershell
npm run test:a11y -- --reporter=line
```

Local execution note: this machine's shell did not have `npm`/`pnpm` on `PATH`, so the run used Codex's bundled `pnpm.cmd` to execute the same package script.

## Result

```text
7 Playwright checks run
4 normal pass checks
3 expected-fail checks
0 unexpected failures
Overall result: passed
```

## Covered Testcases

| Testcase ID | Automation result | Notes |
| --- | --- | --- |
| `TC-A11Y-001` | Auto EXPECTED FAIL | Current staging has editor `Open the live site` at `171x20`, below the 24px target-size baseline. |
| `TC-A11Y-002` | Auto EXPECTED FAIL | Actual clickable target measurement also fails for `Open the live site`. |
| `TC-A11Y-004` | Auto PASS | Invalid publish/domain path does not expose a live-site success action; no publish mutation was made. |
| `TC-A11Y-006` | Auto PASS | Site Editor exposes `Page sections`, `Section settings`, Preview, Publish, and navigation landmark structure. |
| `TC-A11Y-007` | Auto EXPECTED FAIL | Sources backfill date input `#since-*` has no accessible name in current staging. |
| `TC-A11Y-008` | Auto EXPECTED FAIL | Keyboard focus is reachable, but core console focus stops lack a measurable visible focus indicator. |
| `TC-A11Y-009` | Auto PASS | Wrong-password error uses alert/live semantics and focus remains keyboard-usable after the error. |
| `TC-A11Y-010` | Auto PASS | Icon-only buttons and representative editor controls expose accessible names. |
| `TC-A11Y-011` | Auto EXPECTED FAIL | Critical target-size check fails on the editor `Open the live site` action. |
| `TC-A11Y-012` | Auto PASS | Keyboard can reach core console controls and open the Sources Channel Videos dialog without ingestion. |

`TC-A11Y-005` remains covered by the existing Home automation run from 2026-07-16.

## Product Gaps Found

| Gap | Impacted testcases | Evidence |
| --- | --- | --- |
| Editor `Open the live site` action is below the 24px target-size baseline. | `TC-A11Y-001`, `TC-A11Y-002`, `TC-A11Y-011` | Playwright measured the rendered target as `171x20`. |
| Sources backfill date input has no accessible name. | `TC-A11Y-007` | Playwright found visible unnamed control `#since-*` on Sources. |
| Core console focus stops lack measurable visible focus indicator. | `TC-A11Y-008` | Tab reached Home/Sources/Content/Sites controls, but outline/box-shadow/underline checks did not find visible indicators. |

## Remaining Coverage

`TC-A11Y-003` still needs an approved publish-success fixture or mutation run to verify the immediate post-publish `View live site` action from the editor.

Color contrast is noted in `REQ-A11Y-005`, but this Playwright baseline does not calculate contrast ratios. Keep that as manual or add a dedicated accessibility scanner later.

