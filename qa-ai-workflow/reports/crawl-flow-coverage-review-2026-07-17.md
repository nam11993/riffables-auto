# Crawl Flow Coverage Review - 2026-07-17

## Scope

Checked the crawl-related requirements, current testcase suite, automation mapping, and observed Sources UI behavior.

Artifacts reviewed:

```text
qa-ai-workflow/requirements/ingestion-pipeline.requirements.yaml
qa-ai-workflow/requirements/controlled-ingestion.requirements.yaml
qa-ai-workflow/requirements/creator-console.requirements.yaml
qa-ai-workflow/test-plans/riffables-master.test-plan.md
qa-ai-workflow/test-cases/riffables-master.test-cases.md
qa-ai-workflow/automation/source-flow.md
qa-ai-workflow/reports/source-connected-no-data-automation-2026-07-17.md
automation/tests/sources/youtube-source.spec.ts
```

## Actual Sources Flow Observed

| Area | Actual observed flow |
| --- | --- |
| Connected source card | Auto YouTube source shows active state, handle, metadata, `Details`, `Videos`, `Schedule`, `Run crawl`, `Backfill`, `Force rerun`, `Last run`, `Last error`, Pipeline, and Recent runs. |
| Read-only connected no-data flow | Details, content navigation, schedule review, page refresh, Pipeline visibility, Videos empty/search/pagination were automated and passed. |
| Action no-data flow | `Run crawl`, `Backfill`, catalog `Refresh`, and `Ingest 0 selected` were clicked/submitted in automation and the UI stayed stable. |
| Current evidence limit | Action no-data automation does not yet compare backend job, queue, catalog, or content counts before/after each action. Therefore these are partial QA passes, not full requirement passes. |
| Data-dependent flow | Positive crawl with eligible videos, selected video ingestion, row state transitions, cancel, failure, batch size, fairness, and restart recovery still need controlled data and/or backend observability. |

## Requirement Coverage Matrix

| Requirement | Testcase coverage exists | Current automation/actual status | Coverage verdict |
| --- | --- | --- | --- |
| `REQ-INGEST-001` source registration | `TC-SOURCE-001` to `TC-SOURCE-023`, `TC-INGEST-001`, `TC-INGEST-002` | YouTube source UI and invalid-input checks are automated; full Google owner callback is blocked by OAuth automation; Spotify/RSS are blocked as `Crawling soon`. | Partial. Good UI coverage, but full source creation and non-YouTube source acceptance remain gated. |
| `REQ-INGEST-002` automatic import/sync | `TC-INGEST-003`, `TC-INGEST-004`, `TC-INGEST-013` to `TC-INGEST-015`, `TC-SOURCE-031`, `TC-SOURCE-032` | Schedule modal review is automated; actual scheduled/fresh-content enqueue is not verified. | Gap. Needs source with known new content plus queue/job observability. |
| `REQ-INGEST-003` Queued/Processing/Ready/Failed states | `TC-INGEST-005`, `TC-INGEST-016` to `TC-INGEST-018`, `TC-CATALOG-003`, `TC-SOURCE-039`, `TC-CONSOLE-021` | Pipeline UI presence is automated; row/item state transitions are still draft. | Gap. Needs data fixture with observable item states. |
| `REQ-INGEST-004` large media handling | `TC-INGEST-006`, `TC-INGEST-007` | Manual/draft only. | Gap. Needs synthetic/real long-media or worker mock strategy. |
| `REQ-INGEST-005` speaker separation | `TC-INGEST-008`, `TC-INGEST-011` | Manual/draft only. | Out of crawl UI scope, but still ingestion pipeline gap. |
| `REQ-INGEST-006` retry/failure errors | `TC-SOURCE-035`, `TC-INGEST-009`, `TC-INGEST-010`, `TC-INGEST-012`, `TC-INGEST-019`, `TC-INGEST-020` | No failure fixture has been run. | Gap. Needs failure simulation/test hook. |
| `REQ-INGEST-MODE-001` to `REQ-INGEST-MODE-006` Auto/Manual modes | `TC-SOURCE-003`, `TC-SOURCE-008`, `TC-SOURCE-029`, `TC-SOURCE-030`, `TC-SOURCE-033`, `TC-INGEST-MODE-*` | Pre-OAuth Manual selection is automated; actual saved Manual source, mode switch, and server-side Manual refusal are draft. | Partial. Needs connected Manual fixture or API/staging bypass. |
| `REQ-CATALOG-001` metadata-only catalog | `TC-SOURCE-041`, `TC-SOURCE-042A`, `TC-CATALOG-001`, `TC-CATALOG-010`, `TC-CATALOG-013` to `TC-CATALOG-015` | Empty/partial Videos panel is automated; metadata rows/title/date/count are not verified with populated data. | Partial. Needs populated catalog fixture. |
| `REQ-CATALOG-002` browse/search | `TC-SOURCE-043`, `TC-CATALOG-002`, `TC-CATALOG-016`, `TC-CATALOG-017` | Empty/no-match search and pagination are automated; populated search/pagination is draft. | Partial. Needs multi-row or multi-page catalog. |
| `REQ-CATALOG-003` catalog row states | `TC-SOURCE-044`, `TC-CATALOG-003` | Draft only. | Gap. Needs rows in Not ingested, Queued, Processing, Riffed, Failed states. |
| `REQ-CATALOG-004` selectability | `TC-SOURCE-044`, `TC-CATALOG-004`, `TC-CATALOG-018` to `TC-CATALOG-020` | Zero-selected case is partially automated; positive/negative row selectability with real states is draft. | Gap. Needs catalog state fixture. |
| `REQ-CATALOG-005` exact selected ingest | `TC-SOURCE-045`, `TC-SOURCE-045A`, `TC-CATALOG-005` to `TC-CATALOG-007`, `TC-CATALOG-011`, `TC-CATALOG-020` | `Ingest 0 selected` UI/action path is partially automated; exact selected IDs are not verified. | Gap. Needs eligible videos plus backend queue assertion. |
| `REQ-CATALOG-006` catalog refresh | `TC-SOURCE-042`, `TC-SOURCE-042A`, `TC-CATALOG-008`, `TC-CATALOG-012` | Empty/provider-zero refresh is partially automated; new-upload refresh and no re-ingest of known videos are draft. | Partial. Needs new-upload or mocked provider fixture. |
| `REQ-CRAWL-001` bounded batches | `TC-SOURCE-036`, `TC-SOURCE-038`, `TC-SOURCE-038A`, `TC-CRAWL-001`, `TC-CRAWL-012` | Backfill no-data UI/action path is partially automated; batch size and duplicate prevention are not verified. | Gap. Needs queue/log/API observability. |
| `REQ-CRAWL-002` live progress | `TC-SOURCE-034`, `TC-SOURCE-034A`, `TC-SOURCE-039`, `TC-CRAWL-002`, `TC-CRAWL-010`, `TC-CRAWL-013`, `TC-CRAWL-014` | No-data Run crawl UI/action path is partially automated; real done/total progress is draft. | Gap. Needs eligible crawl with multiple items. |
| `REQ-CRAWL-003` cancellation | `TC-CRAWL-003`, `TC-CRAWL-004`, `TC-CRAWL-011`, `TC-CRAWL-015`, `TC-CRAWL-016` | Not observed in current no-data flow; all draft. | Gap. Needs cancellable running crawl fixture. |
| `REQ-CRAWL-004` per-source lock | `TC-CRAWL-005` | Draft only. | Gap. Needs at least two sources and one long-running crawl. |
| `REQ-CRAWL-005` priority/fairness | `TC-SOURCE-032`, `TC-SOURCE-036`, `TC-SOURCE-038`, `TC-CRAWL-006`, `TC-CRAWL-007`, `TC-CRAWL-017` | Draft/manual only. | Gap. Needs controlled queue setup across work types and/or tenants. |
| `REQ-CRAWL-006` restart recovery | `TC-SOURCE-038`, `TC-CRAWL-008` | Draft/manual only. | Gap. Needs controlled worker/service restart. |
| `REQ-CONSOLE-004` crawl feedback UI | `TC-SOURCE-024`, `TC-SOURCE-034`, `TC-SOURCE-034A`, `TC-SOURCE-035`, `TC-CONSOLE-006` | Connected source feedback areas and no-data action path are automated; real running/success/failure states are not fully verified. | Partial. Needs eligible success and failure fixtures. |
| `REQ-CONSOLE-005` Last run/Last error | `TC-SOURCE-024`, `TC-SOURCE-034`, `TC-SOURCE-034A`, `TC-SOURCE-035`, `TC-SOURCE-039`, `TC-SOURCE-040`, `TC-CONSOLE-007`, `TC-CONSOLE-010` | Fields are visible; backend values, success update, failure update, and clearing policy are draft. | Partial. Needs crawl history data contract. |
| `REQ-CONSOLE-007` Pipeline above fold/metrics | `TC-SOURCE-039`, `TC-CONSOLE-015`, `TC-CONSOLE-016` | Pipeline presence is automated; viewport position and backend metric accuracy are draft. | Partial. |
| `REQ-CONSOLE-012` backend schedule/job wiring | `TC-CONSOLE-018`, `TC-CONSOLE-021` | Draft only. | Gap. Needs schedule API and job status endpoint confirmation. |

## Main Findings

1. Crawl testcase coverage exists, but it is split across three layers:

| Layer | Testcase groups | Role |
| --- | --- | --- |
| UI/source workflow | `TC-SOURCE-*` | What the creator clicks and sees on `/sources`. |
| Pipeline semantics | `TC-CRAWL-*`, `TC-INGEST-*` | Queue, batches, progress, retry, cancellation, fairness, restart. |
| Catalog semantics | `TC-CATALOG-*` | Metadata-only catalog, row state, selectability, selected ingest exactness. |

2. The current automated crawl coverage is mostly no-data UI validation:

| Covered by automation | Strength |
| --- | --- |
| Connected source controls visible | Strong UI coverage. |
| Pipeline/Recent runs visible | UI presence only; not backend consistency. |
| Run crawl on no-data fixture | Partial: action path and UI stability only. |
| Backfill no-matching-data fixture | Partial: action path and UI stability only. |
| Catalog Refresh empty/provider-zero | Partial: UI stability only. |
| Ingest 0 selected | Partial: UI stability only. |

3. The most important missing crawl validation is real data flow:

| Missing flow | Why it matters |
| --- | --- |
| Eligible `Run crawl` with known videos | Required to prove progress done/total, queued/running/completed states, Last run update, and no duplicate output. |
| Selected video ingest with exact IDs | Required to prove only selected videos enter the pipeline. |
| Catalog row state transitions | Required to prove Not ingested, Queued, Processing, Riffed, and Failed are accurate and drive selectability. |
| Failure/retry | Required to prove Last error, retry policy, and terminal failure behavior. |
| Cancellation | Required by `REQ-CRAWL-003` but not observed in the current no-data flow. |
| Batch/fairness/restart | Required by `REQ-CRAWL-001`, `REQ-CRAWL-005`, `REQ-CRAWL-006`; cannot be proven from UI alone. |

4. Some testcase IDs overlap by design and should not be removed, but they need clear ownership:

| Overlap | Recommended interpretation |
| --- | --- |
| `TC-SOURCE-034` vs `TC-CRAWL-002/010/014` | `TC-SOURCE-034` is the user workflow on Sources; `TC-CRAWL-*` verifies the progress contract and counts. |
| `TC-SOURCE-038` vs `TC-CRAWL-001/008` | `TC-SOURCE-038` is the Backfill UI workflow; `TC-CRAWL-*` verifies batch size and recovery semantics. |
| `TC-SOURCE-042` vs `TC-CATALOG-008/012` | `TC-SOURCE-042` is the Videos modal refresh path; `TC-CATALOG-*` verifies new-upload discovery and no re-ingest semantics. |
| `TC-SOURCE-045` vs `TC-CATALOG-005/006/007` | `TC-SOURCE-045` is the UI submit path; `TC-CATALOG-*` verifies exact IDs, authorization, and submit-time revalidation. |

## Recommended Next Crawl Execution Order

| Order | Goal | Candidate cases |
| --- | --- | --- |
| 1 | Add backend/job/content observability to existing no-data action automation. | `TC-SOURCE-034A`, `TC-SOURCE-038A`, `TC-SOURCE-042A`, `TC-SOURCE-045A` |
| 2 | Prepare one small connected YouTube fixture with 1-3 eligible videos. | Supports `TC-SOURCE-034`, `TC-SOURCE-042`, `TC-SOURCE-044`, `TC-SOURCE-045` |
| 3 | Run populated catalog flow. | `TC-CATALOG-001`, `TC-CATALOG-010`, `TC-CATALOG-013`, `TC-CATALOG-014`, `TC-CATALOG-016`, `TC-CATALOG-017` |
| 4 | Run selected ingest exactness. | `TC-SOURCE-045`, `TC-CATALOG-005`, `TC-CATALOG-006`, `TC-CATALOG-007` |
| 5 | Run eligible crawl progress. | `TC-SOURCE-034`, `TC-CRAWL-002`, `TC-CRAWL-010`, `TC-CRAWL-014`, `TC-CONSOLE-006`, `TC-CONSOLE-007` |
| 6 | Add failure and retry hooks. | `TC-SOURCE-035`, `TC-INGEST-009`, `TC-INGEST-010`, `TC-INGEST-012`, `TC-CONSOLE-010` |
| 7 | Add cancellation fixture. | `TC-CRAWL-003`, `TC-CRAWL-004`, `TC-CRAWL-011`, `TC-CRAWL-015`, `TC-CRAWL-016` |
| 8 | Add large/backfill/fairness/restart tests with Engineering observability. | `TC-CRAWL-001`, `TC-CRAWL-006`, `TC-CRAWL-007`, `TC-CRAWL-008`, `TC-CRAWL-012`, `TC-CRAWL-017` |

## QA Decision

The testcase set is broad enough for crawl coverage, but the current automation only proves the first UI layer and no-data action stability. Before calling the crawl flow fully covered, QA needs one of these:

- API access for job, queue, catalog, and content counts.
- A debug endpoint or admin view that exposes source/job state.
- Controlled fixtures for eligible videos, failed videos, queued/processing/riffed states, and long-running cancellable crawls.
- Engineering-supported test hooks for batch size, priority/fairness, retry, and restart recovery.
