# Crawl Data Automation Report - 2026-07-17

## Scope

| Field | Value |
| --- | --- |
| Environment | `https://riffables.speedrunlabs.ai` |
| Account fixture | Existing connected-source QA workspace |
| Source fixture | YouTube channel `@nhnbaohan` |
| Catalog fixture | `video 5` and `video 4` exact-selected guard clips, `Clip 3` unselected guard clip, `chiếc đèn cuối phố` and `Video 1` exact-selected success clips, `test 3` successful audio clip, `test 2` failed audio-intended clip, `test 1` no-audio clip |
| Automation command | `npm run test:sources:crawl-data` with `SOURCE_CRAWL_DATA=true`, `SOURCE_CRAWL_MUTATION=true` |

## Result

| Status | Count |
| --- | ---: |
| Passed | 8 |
| Failed | 1 |
| Total | 9 |

## Passed Checks

| Area | Covered testcase IDs | Result |
| --- | --- | --- |
| Populated catalog refresh | `TC-SOURCE-042`, `TC-CATALOG-001`, `TC-CATALOG-010`, `TC-CATALOG-013`, `TC-CATALOG-014` | `Auto PASS` |
| Populated catalog search | `TC-SOURCE-043`, `TC-CATALOG-017` | `Auto PASS` |
| Current row-state selectability | `TC-SOURCE-044`, `TC-CATALOG-019`, `TC-CATALOG-020` | `Auto PARTIAL PASS` |
| Failed row selected retry | `TC-SOURCE-045`, `TC-CATALOG-020`, `TC-INGEST-016`, `TC-INGEST-020`, `TC-CRAWL-013` | `Auto PASS/PARTIAL PASS` |
| Successful audio selected ingest | `TC-INGEST-018`, `TC-CRAWL-013`, `TC-CATALOG-018` | `Auto PASS` |
| Exact selected two-video ingest | `TC-SOURCE-045`, `TC-CRAWL-002`, `TC-CRAWL-010`, `TC-CRAWL-013`, `TC-INGEST-018` | `Auto PASS/PARTIAL PASS` |
| Exact selected unselected guard | `TC-SOURCE-045`, `TC-CATALOG-005` | `Auto PASS` |
| No-audio content terminal state | `TC-INGEST-020` | `Auto PASS` |

## Failed Check

| Area | Covered testcase IDs | Expected | Actual |
| --- | --- | --- | --- |
| Full populated Run crawl success | `TC-SOURCE-034` | Page-level `Run crawl` should complete all eligible items with done/total consistency. | Selected-ingest success is proven with `test 3`, `chiếc đèn cuối phố`, and `Video 1`. Page-level full Run crawl still needs a fresh eligible set and dedicated rerun. Earlier audio-intended clip `test 2` returned provider `Video unavailable`. |

## Observed UI State

| Screen | Observation |
| --- | --- |
| Sources | Connected YouTube source `@nhnbaohan` is Active and Auto. |
| Videos dialog | Catalog shows `chiếc đèn cuối phố`, `Video 1`, `test 3`, `test 2`, and `test 1`. Before ingest, the two newest rows were enabled/selectable; `test 3` and `test 1` are `No insights` and disabled; `test 2` is `Failed` and selectable. |
| Selected ingest | Selecting `test 2` changes the CTA to `Ingest 1 selected`; after submit the row briefly becomes `Queued`, then terminal failure is visible in recent run/source feedback. |
| Successful selected ingest | Selecting `test 3` changes the CTA to `Ingest 1 selected`; after submit the row becomes `Queued`, then Sources shows Crawl/Transcribe/Extract active states and Recent runs reaches `1/1`. |
| Exact selected ingest | Selecting `chiếc đèn cuối phố` and `Video 1` changes the CTA to `Ingest 2 selected`; after submit both rows become `Queued`, Recent runs reaches `2/2`, and `Last error` is `None`. |
| Content | `Video 1`, `chiếc đèn cuối phố`, and `test 3` appear as `No riffables` with `TRANSCRIPT Available`; `test 1` appears as `No riffables`, `TRANSCRIPT None yet`, duration `31s`. |

## Follow-Up Catalog State - 2026-07-20

| Observation | Result |
| --- | --- |
| Catalog total | `8 videos` |
| Fresh selectable rows | `3` before submit |
| Selected rows | `video 5`, `video 4` |
| Unselected row | `Clip 3` |
| Guard command | Visible in-app browser run |
| Guard result | `Pass`; selected rows queued and Recent run reached `2/2`, while `Clip 3` remained fresh/selectable. |
| Final selected-row state | `No insights` for `video 5` and `video 4` |

This completes the exact-selected/unselected guard for `TC-SOURCE-045` and `TC-CATALOG-005`. `No insights` is a processed terminal state where no riffables/insights were generated; it is acceptable for this selection-scope case, but it does not satisfy a `Riffed` or insight-generation success case. Rerunning this mutating guard requires three new fresh selectable rows.

## Missing Data For Full Crawl Coverage

| Needed fixture | Why it is needed |
| --- | --- |
| Public downloadable audio clip that worker can fetch | Covered by `test 3` for selected ingest and transcript success. Still useful to keep another fresh success clip for reruns. |
| Fresh Not ingested video | Covered once by `test 3` before ingest. Rerun now needs a new fresh unprocessed clip. |
| Queued, Processing, and Riffed catalog states | Required to finish `TC-CATALOG-019` and `TC-SOURCE-044` beyond the current No insights disabled check. |
| Long-running crawl fixture | Required for cancellation cases `TC-CRAWL-003`, `TC-CRAWL-004`, `TC-CRAWL-011`, `TC-CRAWL-015`, `TC-CRAWL-016`. |
| Large channel/backfill fixture over batch size | Required for bounded batch and fairness cases `TC-CRAWL-001`, `TC-CRAWL-006`, `TC-CRAWL-007`, `TC-CRAWL-012`, `TC-CRAWL-017`. |
| Controlled transient failure fixture | Required for retry policy cases `TC-INGEST-009`, `TC-INGEST-012`, `TC-INGEST-019`. |

## QA Notes

- The current no-audio clip is useful and should be kept. It covers the no-transcript/no-riff terminal path.
- The current failed audio-intended clip is useful for failed retry and terminal failure coverage, but it does not satisfy successful audio crawl coverage.
- `test 3` now satisfies selected-ingest audio success and transcript availability. Because it has been ingested, a new fresh clip is needed to rerun Not ingested/selectability from a clean state.
- `video 5` and `video 4` plus unselected `Clip 3` satisfy the exact-selected/unselected guard. Because `video 5` and `video 4` are now processed, rerunning this mutating guard requires three new fresh eligible clips.
