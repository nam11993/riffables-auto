# Source Management / Mode Switch Automation Report - 2026-07-23

## Scope

This run covers connected-source management and ingest-mode switching for the Riffables creator console.

Test fixture:

```text
Environment: https://riffables.speedrunlabs.ai
Workspace/account fixture: Baohan QA creator workspace
Connected source: @nhnbaohan
Browser: Playwright Chromium
```

## Command

```powershell
npm run test:sources:management -- --reporter=line
```

Local execution note: this machine's shell did not have `npm`/`pnpm` on `PATH`, so the run used Codex's bundled `pnpm.cmd` to execute the same package script.

Runtime flags used:

```text
SOURCE_MODE_MUTATION_ENABLED=true
SOURCE_MODE_RESTORE_TARGET=Auto
SOURCE_MANUAL_SCHEDULE_GAP=true
```

## Result

```text
4 Playwright checks run
3 normal pass checks
1 expected-fail check
0 unexpected failures
Overall result: passed
```

Post-run restore verification:

```text
npm run test:sources:connected -- --reporter=line
1 passed
```

The restore check confirms `@nhnbaohan` was left in Auto mode with connected-source crawl controls visible.

## Covered Testcases

| Testcase ID | Automation result | Notes |
| --- | --- | --- |
| `TC-INGEST-MODE-011` | Auto PASS | Connect form shows `Auto crawl` and `Manual selection`; Auto is selected by default before and after entering `@nhnbaohan`. |
| `TC-SOURCE-027` | Auto PASS | Delete confirmation identifies `@nhnbaohan`; cancel/close preserves source, mode, run count, and pipeline state. |
| `TC-SOURCE-029` | Auto PASS | Auto source can switch to Manual without creating a new recent run. |
| `TC-SOURCE-030` | Auto PASS | Manual source can switch back to Auto; `Run crawl`, `Backfill`, and `Schedule` return. |
| `TC-INGEST-MODE-006` | Auto PASS | Source card shows current mode and updates controls after mode switches. |
| `TC-INGEST-MODE-007` | Auto PARTIAL PASS | Idle mode switching does not start/cancel work. Active running-crawl behavior still needs a long-running crawl fixture. |
| `TC-INGEST-MODE-014` | Auto PASS | Manual mode hides `Run crawl`. |
| `TC-INGEST-MODE-015` | Auto PASS | Manual mode hides `Backfill`. |
| `TC-SOURCE-033` | Auto EXPECTED FAIL | Current staging still exposes `Schedule` in Manual mode and opens the recurring schedule dialog. |

## Product Gap

`TC-SOURCE-033` expects Manual-mode sources to fail closed for automatic scheduling. The current staging UI still displays `Schedule` after switching `@nhnbaohan` to Manual mode. The automation keeps this as an expected-fail assertion until the UI and API behavior are confirmed fixed.

## Automation Files

| File | Change |
| --- | --- |
| `automation/tests/sources/youtube-source.spec.ts` | Added `@source-management` tests for delete cancel, mode switching, Auto preselection, Manual Run/Backfill hiding, and Manual Schedule expected-fail. |
| `package.json` | Added `test:sources:management`. |
| `qa-ai-workflow/test-cases/riffables-master.test-cases.md` | Updated per-case automation status and actual execution steps. |
| `qa-ai-workflow/automation/source-flow.md` | Added flow-to-testcase mapping for the latest run. |
