# Home Dynamic Overview Automation

## Purpose

This flow verifies that Home Overview reflects real workspace lifecycle data instead of only checking that the four summary modules exist.

The master testcase file remains the system of record for preconditions, steps, expected results, and per-case automation status.

## Script And Command

```text
automation/tests/console/home-dynamic.spec.ts
```

```powershell
npm run test:home:dynamic
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-28` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Runner result | `7 passed` |
| Product result | `6 actual passes, 1 expected failure, 0 unexpected failures` |

## Fixture Strategy

| Fixture | Used by | State |
| --- | --- | --- |
| Unique plus-addressed creator and newly created organization | `TC-CONSOLE-027`, `TC-CONSOLE-032` | Zero Sources, Riffs, Articles, and no Site |
| Baohan primary workspace | `TC-CONSOLE-030`, `TC-CONSOLE-034`, `TC-CONSOLE-035`, `TC-CONSOLE-036` | One connected YouTube source, seven crawled rows, zero articles, published Baohan site |
| Baohan secondary `Auto Workspace` | `TC-CONSOLE-038` | Distinct workspace label used to test tenant isolation |

The empty-workspace fixture is created by the suite. Credentials and plus-address components are supplied through environment variables and are never stored in the repository.

## Flow-To-Testcase Mapping

| Testcase ID | Automation result | Verified behavior |
| --- | --- | --- |
| `TC-CONSOLE-027` | `Auto PASS 2026-07-28` | New workspace shows `Let's get started`, zero counts, no site, source-connection recommendation, and no Recent content. |
| `TC-CONSOLE-032` | `Auto PASS 2026-07-28` | Empty Site summary routes to `/sites` setup/template state and remains unchanged after returning Home. |
| `TC-CONSOLE-030` | `Auto PASS 2026-07-28` | Baohan Home shows returning state, non-zero Sources/Riffs, zero Articles, review CTA, and Recent content. |
| `TC-CONSOLE-034` | `Auto PASS 2026-07-28` | Home published state matches `baohan.apps.riffables.com`, `/sites`, and its `View live` URL. |
| `TC-CONSOLE-035` | `Auto PASS 2026-07-28` | Home matches one Sources card, seven total crawled rows, zero Articles, and published Sites state after refresh. |
| `TC-CONSOLE-036` | `Auto PASS 2026-07-28` | Recent rows contain title/status/date, are date ordered, match the first five Content results, and navigate to `/content`. |
| `TC-CONSOLE-038` | `Auto EXPECTED FAIL 2026-07-28` | Sidebar changes to the secondary workspace, but Home incorrectly keeps primary metrics, Baohan site identity, and Recent content. |

## Current Product Rule Observed

Home currently displays `Riffs 7 extracted`, while `/content` displays:

```text
Showing 7 of 7 - 0 extracted - 6 with transcript
```

The automation therefore compares Home Riffs with the total crawled row count (`7 of 7`), not the Content sub-count labeled `extracted`. This behavior is recorded explicitly in `TC-CONSOLE-035` so the assertion does not silently change meaning.

## Remaining Fixture-Gated Cases

| Testcase ID | Required state |
| --- | --- |
| `TC-CONSOLE-028` | Connected source with zero crawl output |
| `TC-CONSOLE-029` | Active queued/crawl/transcription state |
| `TC-CONSOLE-031` | At least one generated article |
| `TC-CONSOLE-033` | Draft or unpublished site |
| `TC-CONSOLE-037` | Controlled crawl state transition while Home is observed |
| `TC-CONSOLE-039` | Failed processing state surfaced on Home |
| `TC-CONSOLE-040` | Controlled zero, one, many, large-count, and site-status boundary fixtures |

Do not mark these cases automated until their complete testcase preconditions can be reproduced.

