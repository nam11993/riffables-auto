# Source Automation Flow Mapping

## Purpose

This document maps Sources/YouTube automation flows back to testcase IDs in `qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

The testcase file remains the system of record for testcase details and per-case automation status. This file explains what Playwright currently verifies, which checks are expected-fail on current staging, and where Google owner OAuth or controlled source fixtures are still required.

## Script

```text
automation/tests/sources/youtube-source.spec.ts
```

## Latest Staging Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-17` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Fixture | No-source workspace, source candidate `@nhnbaohan` |
| Result | `11 no-source tests run: 6 active pass checks, 3 expected-fail validation checks, 2 skipped gated/fixture checks. Full connect attempt is blocked by Google OAuth automation security when explicitly enabled.` |
| Manual OAuth handoff check | `TC-SOURCE-014 rerun after source connection: 1 passed. @nhnbaohan is visible as an active Auto connected source in the selected workspace.` |

## Latest Connected Source No-Data Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-17` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Fixture | Connected YouTube source, no approved crawl/catalog data mutation |
| Command | `npm run test:sources:connected-no-data` |
| Result | `7 passed in 1.4m` |
| Covered cases | `TC-SOURCE-024`, `TC-SOURCE-025`, `TC-SOURCE-026`, `TC-SOURCE-031`, `TC-SOURCE-036`, `TC-SOURCE-037`, `TC-SOURCE-039`, `TC-SOURCE-040`, `TC-SOURCE-041`, `TC-SOURCE-043` |
| Mutation boundary | This read-only run did not submit `Run crawl`, `Backfill`, `Create schedule`, `Refresh catalog`, `Ingest selected`, `Delete`, or `Switch to manual`. The no-data action variants were run separately in the action no-data suite below. |

## Latest Connected Source Action No-Data Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-17` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Fixture | Connected YouTube source with no approved crawl/catalog data before the run |
| Command | `npm run test:sources:action-no-data` with `SOURCE_ACTION_NO_DATA=true` |
| Result | `4 Playwright checks passed in 44.0s; per-case QA status is partial because backend job/content counts were not observable in this run.` |
| Covered cases | `TC-SOURCE-034A`, `TC-SOURCE-038A`, `TC-SOURCE-042A`, `TC-SOURCE-045A` |

## Latest Connected Source Crawl-Data Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-17` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Fixture | Connected YouTube source `@nhnbaohan` with catalog rows `test 3`, `test 2`, and `test 1` |
| Command | `npm run test:sources:crawl-data` with `SOURCE_CRAWL_DATA=true` and `SOURCE_CRAWL_MUTATION=true` |
| Result | `6 Playwright checks run: 5 passed, 1 failed.` |
| Passed cases | `TC-SOURCE-042`, `TC-SOURCE-043`, `TC-SOURCE-044` partial, `TC-SOURCE-045` partial, `TC-CATALOG-001`, `TC-CATALOG-010`, `TC-CATALOG-013`, `TC-CATALOG-014`, `TC-CATALOG-017`, `TC-CATALOG-019` partial, `TC-CATALOG-020`, `TC-CRAWL-013`, `TC-INGEST-016`, `TC-INGEST-020` |
| Failed cases | `TC-SOURCE-034`, `TC-CRAWL-002`, `TC-CRAWL-010`, `TC-INGEST-018` |
| Failure reason | Full Run crawl success expected a complete multi-item crawl, but the earlier audio fixture `test 2` returned provider `Video unavailable`. Selected-ingest success is now covered by `test 3`. |

## Latest Successful Audio-Content Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-17` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Fixture | Newly posted audio clip `test 3` on `@nhnbaohan` |
| Command | `npm run test:sources:crawl-success` with `SOURCE_CRAWL_DATA=true` |
| Result | `1 passed` |
| Covered cases | `TC-INGEST-018`, `TC-CRAWL-013` |
| Observed states | `Queued` -> `Transcribing` -> `Extracting` -> content row with `TRANSCRIPT Available`, `No riffables`, and `1 with transcript`. |

## Latest Exact Selected Two-Video Run

| Field | Value |
| --- | --- |
| Run date | `2026-07-20` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Fixture | Two newest eligible clips: `chiếc đèn cuối phố` and `Video 1` |
| Fresh selection result | Both rows were enabled before ingest and the CTA changed to `Ingest 2 selected`. |
| Mutating run result | Rows changed to `Queued`, source Recent runs reached `2/2`, `Last error` was `None`. |
| Content result | Content showed `Showing 4 of 4 · 0 extracted · 3 with transcript`; both new clips ended as `No riffables` with `TRANSCRIPT Available`. |
| Repeatable command | `npm run test:sources:exact-selected` with `SOURCE_CRAWL_DATA=true` |
| Repeatable result | `1 passed` |

## Latest Unselected Guard Check

| Field | Value |
| --- | --- |
| Run date | `2026-07-20` |
| Environment | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Command | Visible in-app browser run against `@nhnbaohan` |
| Result | `Pass` |
| Catalog total | `8 videos` |
| Selected rows | `video 5`, `video 4` |
| Unselected guard row | `Clip 3` |
| Evidence | `video 5` and `video 4` moved to `Queued`; `Clip 3` remained fresh/selectable; Recent runs reached `2/2`; Last error stayed `None`; after refresh, selected rows ended as `No insights`. |

## Flow-To-Testcase Mapping

| Automation flow | Testcase ID | Per-case automation status | Notes |
| --- | --- | --- | --- |
| Sources workflow exposes supported source choices | `TC-SOURCE-001`, `TC-SOURCE-007` | `Auto PASS 2026-07-17` | Verifies `/sources`, current source type choices, `Ready to crawl`/`Crawling soon` availability, YouTube input, and mode controls. This case does not require an existing connected source. |
| Empty source workspace shows first-source state and no ingestion runs | `TC-SOURCE-023` | `Auto PASS 2026-07-17` | Verifies `Connect your first source`, first-source helper copy, `Pipeline`, `Recent runs`, and `No ingestion runs yet` for the no-source workspace. |
| Full YouTube channel connection in Auto mode | `TC-SOURCE-002`, `TC-SOURCE-008` | `Auto BLOCKED 2026-07-17` | The Playwright flow reaches Google owner OAuth for `@nhnbaohan`, but Google blocks the automated browser with `This browser or app may not be secure` before consent can be granted. Requires a pre-authorized storage state, manual Google consent handoff, or a staging OAuth bypass. |
| Connected YouTube channel is active with crawl controls | `TC-SOURCE-014` | `Auto PASS 2026-07-17` | Rerun after source connection verified `@nhnbaohan` under connected sources as an active Auto YouTube channel. Mutating actions such as `Run crawl`, `Force rerun`, and `Backfill` are checked for presence but not clicked. |
| Connected source card and pipeline are visible before crawl data exists | `TC-SOURCE-024`, `TC-SOURCE-039` | `Auto PASS 2026-07-17` | Verifies the active YouTube source card, Auto mode, metadata, controls, crawl modifiers, pipeline cards, and recent runs area without submitting crawl/backfill work. |
| Connected source details and content navigation stay tenant-scoped | `TC-SOURCE-025`, `TC-SOURCE-026` | `Auto PASS 2026-07-17` | Opens Details, verifies diagnostic metadata and close behavior, then verifies `View crawled content` keeps the selected source/workspace context when the CTA is available. |
| Recurring schedule modal can be reviewed without creating a schedule | `TC-SOURCE-031` | `Auto PASS 2026-07-17` | Opens Schedule, verifies cadence choices and actions, then closes the modal without saving. |
| Force rerun and backfill controls are visible but not submitted in no-data run | `TC-SOURCE-036`, `TC-SOURCE-037` | `Auto PARTIAL PASS 2026-07-17` | Verifies control visibility and no-submit guard only. Full force-rerun semantics and backfill validation still require approved data and job observability. |
| Run crawl with no eligible data | `TC-SOURCE-034A` | `Auto PARTIAL PASS 2026-07-17` | Clicks `Run crawl` on the connected no-data fixture and verifies the source remains connected, the page exposes source feedback areas, and the UI does not render broken values. Backend job/content counts still need observability. |
| Backfill with no matching eligible data | `TC-SOURCE-038A` | `Auto PARTIAL PASS 2026-07-17` | Submits a bounded valid Backfill request and verifies the source remains connected with stable feedback areas and no broken UI values. Backend job/content counts still need observability. |
| Catalog refresh with empty provider result | `TC-SOURCE-042A` | `Auto PARTIAL PASS 2026-07-17` | Clicks catalog `Refresh`, verifies the Channel Videos panel remains in a no-selected-work state, and reopens the panel to confirm stable empty/no-selection state. Backend job/content counts still need observability. |
| Populated catalog refresh with known videos | `TC-SOURCE-042`, `TC-CATALOG-001`, `TC-CATALOG-010`, `TC-CATALOG-013`, `TC-CATALOG-014` | `Auto PASS 2026-07-17` | Refreshes the Channel Videos panel for `@nhnbaohan` and verifies `test 2`, `test 1`, publish dates, and current states. |
| Populated catalog search | `TC-SOURCE-043`, `TC-CATALOG-017` | `Auto PASS 2026-07-17` | Searches for `test 2`, verifies catalog remains read-only, then clears search. |
| Catalog row state selectability | `TC-SOURCE-044`, `TC-CATALOG-019`, `TC-CATALOG-020` | `Auto PARTIAL PASS 2026-07-17` | Verifies Failed row is selectable and No insights row is disabled. Additional Not ingested, Queued, Processing, and Riffed fixtures are still required. |
| Failed video selected retry | `TC-SOURCE-045`, `TC-CATALOG-020`, `TC-INGEST-016`, `TC-INGEST-020`, `TC-CRAWL-013` | `Auto PASS/PARTIAL PASS 2026-07-17` | Selects one Failed row, submits `Ingest 1 selected`, observes Queued, then terminal provider failure. Full exact-selected coverage still needs at least two fresh eligible rows. |
| Successful audio selected-ingest content | `TC-INGEST-018`, `TC-CRAWL-013` | `Auto PASS 2026-07-17` | Newly posted clip `test 3` was selected and ingested, then appeared in Content with `TRANSCRIPT Available`. |
| Exact selected two-video ingest | `TC-SOURCE-045`, `TC-CRAWL-002`, `TC-CRAWL-010`, `TC-CRAWL-013`, `TC-INGEST-018` | `Auto PASS/PARTIAL PASS 2026-07-20` | Selected `chiếc đèn cuối phố` plus `Video 1`, submitted `Ingest 2 selected`, and verified latest run `2/2` with transcript content. |
| Exact selected unselected-row guard | `TC-SOURCE-045`, `TC-CATALOG-005` | `Auto PASS 2026-07-20` | Selected `video 5` and `video 4`, submitted `Ingest 2 selected`, verified both selected rows queued and Recent run reached `2/2`, while unselected `Clip 3` remained fresh/selectable. Selected rows later ended as `No insights`, which is valid for selection coverage but not proof of generated riffables. |
| Populated Run crawl success contract | `TC-SOURCE-034`, `TC-CRAWL-002`, `TC-CRAWL-010` | `Auto FAIL 2026-07-17` | Full multi-item Run crawl success has not passed yet. Selected-ingest success is covered separately by `test 3`. |
| Sources refresh is read-only against connected configuration | `TC-SOURCE-040` | `Auto PASS 2026-07-17` | Captures source/card baseline, clicks page refresh, and verifies source identity/configuration remains stable with no crawl/backfill/schedule/OAuth side effect. |
| Channel Videos panel supports empty catalog browsing | `TC-SOURCE-041`, `TC-SOURCE-043` | `Auto PASS 2026-07-17` | Opens Videos, verifies empty/partial catalog state and controls, tests search and pagination behavior, then closes without catalog refresh or ingestion. |
| Ingest selected with zero selected or empty catalog | `TC-SOURCE-045A` | `Auto PARTIAL PASS 2026-07-17` | Verifies `Ingest 0 selected` is visible, safely blocked/refused when zero items are selected, and the source context remains stable. Backend job/content counts still need observability. |
| Blank YouTube source input cannot be submitted | `TC-SOURCE-015` | `Auto PASS 2026-07-17` | Verifies `Verify with Google` stays disabled while blank, pressing Enter keeps the user on `/sources`, and no OAuth handoff starts. |
| Manual mode can be selected before owner verification | `TC-SOURCE-003`, `TC-SOURCE-009` | `Auto PARTIAL PASS 2026-07-17` | Selects `Manual selection`, keeps `@nhnbaohan` in the field, and verifies `Verify with Google` remains enabled. Full save/callback remains OAuth-bound. |
| Malformed YouTube handles are rejected before source creation | `TC-SOURCE-016` | `Auto EXPECTED FAIL 2026-07-17` | Current staging enables `Verify with Google` for malformed values such as `@`. The Playwright test is marked expected-fail until validation is fixed. |
| Unsupported external source domains are rejected | `TC-SOURCE-017` | `Auto EXPECTED FAIL 2026-07-17` | Current staging enables `Verify with Google` for unsupported domains such as TikTok/Facebook/example URLs. The Playwright test is marked expected-fail until validation is fixed. |
| Unsupported YouTube URL types are rejected in the channel connector | `TC-SOURCE-018` | `Auto EXPECTED FAIL 2026-07-17` | Current staging enables `Verify with Google` for watch/shorts/playlist/embed URLs in the channel connector. The Playwright test is marked expected-fail until validation is fixed. |
| Source types marked `Crawling soon` cannot be submitted as active sources | `TC-SOURCE-022` | `Auto PASS 2026-07-17` | Verifies future source type selectors keep the user on `/sources`, preserve `Crawling soon`, and expose no enabled connect path without valid supported data. |
| YouTube source form accepts handle and starts Google owner verification | `TC-SOURCE-013` | `Auto PASS 2026-07-17` | Fills `@nhnbaohan`, verifies `Verify with Google` enables, then confirms redirect to Google OAuth for Speedrun Labs. |

## OAuth Boundary

`TC-SOURCE-002` and `TC-SOURCE-008` require completing Google owner consent for the YouTube channel. The current Playwright run can reach the Google OAuth screen for `@nhnbaohan`, but Google blocks automated browser sign-in before consent with `This browser or app may not be secure`. `TC-SOURCE-003` and `TC-SOURCE-009` are automated only through pre-OAuth Manual-mode selection.

To complete the full connection in automation, provide one of these:

- A pre-authorized Playwright storage state for the Google owner consent session.
- A staging OAuth bypass/callback fixture that simulates successful owner consent.
- A manual Google consent step outside Playwright, then rerun connected-source verification (`TC-SOURCE-014`).

Current manual handoff command:

```powershell
npm run source:oauth:manual
```

This opens Chrome or Edge with a dedicated local profile at `.auth/chrome-oauth-profile` and navigates to `/sources`. Complete Google owner consent there, then run:

```powershell
npm run test:sources:connected
```

This approach keeps Google OAuth in a real user browser and leaves Playwright responsible for the Riffables-side connected-source verification.

## Remaining Source Coverage

The following Source cases still need additional test data, OAuth setup, or explicit approval before automation can safely complete them:

```text
TC-SOURCE-002
TC-SOURCE-006
TC-SOURCE-008
TC-SOURCE-010
TC-SOURCE-011
TC-SOURCE-012
TC-SOURCE-019
TC-SOURCE-020
TC-SOURCE-021
TC-SOURCE-027
TC-SOURCE-028
TC-SOURCE-029
TC-SOURCE-030
TC-SOURCE-032
TC-SOURCE-033
TC-SOURCE-034
TC-SOURCE-035
TC-SOURCE-038
TC-SOURCE-042
TC-SOURCE-044
TC-SOURCE-045
TC-SOURCE-046
```

Automation should use controlled datasets and avoid creating duplicate real sources unless the run is explicitly intended to mutate staging. Cases involving Google owner mismatch, consent denial, unavailable channels, duplicate source saves, or full channel callback require a Google OAuth test account/session, source fixtures, or a staging OAuth test bypass.

Connected-source cases involving delete, mode switching, schedule creation, crawl execution, failed crawl feedback, real backfill, catalog refresh, row state transitions, selected ingestion, and role/tenant mutation still require approved crawl data or a disposable source fixture.

Keep real credentials in environment variables only. Do not commit `.env` files.
