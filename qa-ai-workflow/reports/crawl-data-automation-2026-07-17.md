# Crawl Data Automation Report - 2026-07-17

## Scope

| Field | Value |
| --- | --- |
| Environment | `https://riffables.speedrunlabs.ai` |
| Account fixture | Existing connected-source QA workspace |
| Source fixture | YouTube channel `@nhnbaohan` |
| Catalog fixture | `test 2` audio-intended clip, `test 1` no-audio clip |
| Automation command | `npm run test:sources:crawl-data` with `SOURCE_CRAWL_DATA=true`, `SOURCE_CRAWL_MUTATION=true` |

## Result

| Status | Count |
| --- | ---: |
| Passed | 5 |
| Failed | 1 |
| Total | 6 |

## Passed Checks

| Area | Covered testcase IDs | Result |
| --- | --- | --- |
| Populated catalog refresh | `TC-SOURCE-042`, `TC-CATALOG-001`, `TC-CATALOG-010`, `TC-CATALOG-013`, `TC-CATALOG-014` | `Auto PASS` |
| Populated catalog search | `TC-SOURCE-043`, `TC-CATALOG-017` | `Auto PASS` |
| Current row-state selectability | `TC-SOURCE-044`, `TC-CATALOG-019`, `TC-CATALOG-020` | `Auto PARTIAL PASS` |
| Failed row selected retry | `TC-SOURCE-045`, `TC-CATALOG-020`, `TC-INGEST-016`, `TC-INGEST-020`, `TC-CRAWL-013` | `Auto PASS/PARTIAL PASS` |
| No-audio content terminal state | `TC-INGEST-020` | `Auto PASS` |

## Failed Check

| Area | Covered testcase IDs | Expected | Actual |
| --- | --- | --- | --- |
| Full populated Run crawl success | `TC-SOURCE-034`, `TC-CRAWL-002`, `TC-CRAWL-010`, `TC-INGEST-018` | Two-video crawl should reach `2/2`, no failed latest run, and audio content should produce transcript/content. | Latest run stayed `0/1 · 1 failed`. The audio-intended clip returned provider `Video unavailable`. Content showed only `test 1` with `0 with transcript`. |

## Observed UI State

| Screen | Observation |
| --- | --- |
| Sources | Connected YouTube source `@nhnbaohan` is Active and Auto. |
| Videos dialog | Catalog shows `test 2` as `Failed` and selectable; `test 1` as `No insights` and disabled. |
| Selected ingest | Selecting `test 2` changes the CTA to `Ingest 1 selected`; after submit the row briefly becomes `Queued`, then terminal failure is visible in recent run/source feedback. |
| Content | `test 1` appears as `No riffables`, `TRANSCRIPT None yet`, `ARTICLE None yet`, duration `31s`. |

## Missing Data For Full Crawl Coverage

| Needed fixture | Why it is needed |
| --- | --- |
| Public downloadable audio clip that worker can fetch | Required for `TC-INGEST-018`, successful transcript/content state, and full `Run crawl` success. Current audio-intended clip returns `Video unavailable`. |
| Fresh Not ingested video | Required for `TC-CATALOG-018` and full exact selected-ingest coverage. Current two rows are already Failed/No insights. |
| At least two fresh eligible videos | Required for `TC-SOURCE-045` full exact-selected behavior and unselected item remains Not ingested. |
| Queued, Processing, and Riffed catalog states | Required to finish `TC-CATALOG-019` and `TC-SOURCE-044` beyond the current No insights disabled check. |
| Long-running crawl fixture | Required for cancellation cases `TC-CRAWL-003`, `TC-CRAWL-004`, `TC-CRAWL-011`, `TC-CRAWL-015`, `TC-CRAWL-016`. |
| Large channel/backfill fixture over batch size | Required for bounded batch and fairness cases `TC-CRAWL-001`, `TC-CRAWL-006`, `TC-CRAWL-007`, `TC-CRAWL-012`, `TC-CRAWL-017`. |
| Controlled transient failure fixture | Required for retry policy cases `TC-INGEST-009`, `TC-INGEST-012`, `TC-INGEST-019`. |

## QA Notes

- The current no-audio clip is useful and should be kept. It covers the no-transcript/no-riff terminal path.
- The current failed audio-intended clip is useful for failed retry and terminal failure coverage, but it does not satisfy successful audio crawl coverage.
- Add one new public, short, downloadable clip with clear speech and leave it unprocessed before rerunning the successful crawl suite.
