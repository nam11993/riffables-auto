# Source Connected Screen Review - 2026-07-17

## Scope

Reviewed the Sources screen after a YouTube channel is connected. The review focused on testcase completeness only; no new automation was added.

## Observed UI

| Area | Observed controls/data |
| --- | --- |
| Connect source form | Source type selector, YouTube handle/channel URL input, Auto crawl, Manual selection, Verify with Google. |
| Connected source card | YouTube channel, Active status, Auto mode, source handle, Created, Last run, Last error. |
| Source actions | Details, Delete, Videos, Switch to manual, Schedule, Run crawl. |
| Crawl modifiers | Force rerun, Backfill since date, Limit, Backfill. |
| Details modal | Source metadata, provider config, created/updated timestamps, last run/error, View crawled content, Close. |
| Videos modal | Channel videos, Refresh, search title, Prev, Next, Ingest selected, empty/partial catalog state, Close. |
| Schedule modal | Recurring crawl cadence options: Every hour, Every 6 hours, Every 12 hours, Daily, Weekly, Create schedule, Close. |
| Pipeline | Crawl, Transcribe, Extract, Embed active/waiting/failed counts. |
| Recent runs | Source type, source handle, progress count, relative timestamp. |

## Actions Performed

| Action | Result |
| --- | --- |
| Opened Sources | Connected-source screen loaded successfully. |
| Opened Details | Details modal displayed source metadata and backend config. Closed without changing state. |
| Opened Videos | Channel videos modal displayed empty/partial catalog state and catalog controls. Closed without refreshing catalog. |
| Opened Schedule | Recurring crawl modal displayed cadence choices. Closed without creating schedule. |
| Inspected Pipeline | Queue stage cards and recent run row were visible. |

## Actions Not Executed

| Action | Reason |
| --- | --- |
| Delete | Destructive source action. Requires disposable fixture and explicit approval. |
| Switch to manual | Mutates source ingest mode. Should be tested with controlled fixture. |
| Run crawl | Starts real ingestion work. Should be tested with approved source/job fixture. |
| Force rerun + Run crawl | Can reprocess known content. Requires controlled data and duplicate-output checks. |
| Backfill | Starts potentially large work. Requires bounded batch/fairness fixture. |
| Videos Refresh | Updates catalog metadata. Should be tested with controlled catalog fixture. |
| Ingest selected | Starts selected-video ingestion. Requires eligible catalog rows. |

## Testcase Updates

Added `TC-SOURCE-024` through `TC-SOURCE-046` to `qa-ai-workflow/test-cases/riffables-master.test-cases.md`. Later review added no-data action variants `TC-SOURCE-034A`, `TC-SOURCE-038A`, `TC-SOURCE-042A`, and `TC-SOURCE-045A`; their current automation status is partial until backend job/content count assertions are available.

| Range | Coverage |
| --- | --- |
| `TC-SOURCE-024` to `TC-SOURCE-026` | Connected source card, details modal, and details-to-content navigation. |
| `TC-SOURCE-027` to `TC-SOURCE-028` | Delete cancel and approved delete behavior. |
| `TC-SOURCE-029` to `TC-SOURCE-033` | Auto/Manual switching and schedule behavior. |
| `TC-SOURCE-034` to `TC-SOURCE-038`, plus no-data variants | Run crawl, no-data run crawl, failure feedback, force rerun, backfill validation, and no-matching-data backfill behavior. |
| `TC-SOURCE-039` to `TC-SOURCE-040` | Pipeline health, recent runs, and page refresh behavior. |
| `TC-SOURCE-041` to `TC-SOURCE-045`, plus no-data variants | Videos panel, catalog refresh, empty-provider refresh, search/pagination, row states, ingest selected, and zero-selected ingest behavior. |
| `TC-SOURCE-046` | Tenant and role scoping for source management actions. |

## File Count Check

| Item | Result |
| --- | --- |
| Total testcase rows | `362` |
| Execution schema rows | `362/362` |
