# Crawl Exact Selected Automation Report - 2026-07-20

## Scope

| Field | Value |
| --- | --- |
| Environment | `https://riffables.speedrunlabs.ai` |
| Source fixture | YouTube channel `@nhnbaohan` |
| Fresh selected clips | `chiếc đèn cuối phố`, `Video 1` |
| Selection count | `Ingest 2 selected` |
| Run result | `2/2` |
| Content result | `Showing 4 of 4 · 0 extracted · 3 with transcript` |

## Execution Timeline

| Step | Observed result |
| --- | --- |
| Refresh catalog | Catalog showed 5 videos. The two newest rows were `chiếc đèn cuối phố` and `Video 1`. |
| Select rows | Both newest rows were enabled and selectable. |
| Submit ingest | CTA changed to `Ingest 2 selected`; after submit both rows changed to `Queued`. |
| Crawl progress | Source Recent runs started at `0/2`, then completed at `2/2`. |
| Processing states | Content showed `Transcribing`, then `Extracting`, then final `No riffables`. |
| Final content | Both selected videos showed `TRANSCRIPT Available`. |

## Covered Testcases

| Testcase ID | Status | Evidence |
| --- | --- | --- |
| `TC-SOURCE-045` | `Auto PASS 2026-07-20` | First exact-selected run queued and completed two selected rows. Follow-up unselected guard selected `video 5` and `video 4`, left `Clip 3` unselected/fresh, and completed Recent run `2/2`. Final selected-row state was `No insights`, which is accepted for exact-selection coverage only. |
| `TC-CRAWL-002` | `Auto PASS 2026-07-20` | Progress showed done/total and final `2/2`. |
| `TC-CRAWL-010` | `Auto PASS 2026-07-20` | Expected selected total 2 matched final run total. |
| `TC-CRAWL-013` | `Auto PASS 2026-07-20` | `Ingest 2 selected` matched Recent run `2/2`. |
| `TC-INGEST-018` | `Auto PASS 2026-07-20` | Both new clips reached content rows with `TRANSCRIPT Available`. |

## Remaining Data Gaps

| Gap | Why it remains |
| --- | --- |
| Riffed row state | The processed clips ended as `No riffables`, not `Riffed`; still need a clip/content path that produces insights/riffs. |
| Long-running cancellable fixture | The two new clips completed normally; still need a long-running job to test cancel behavior. |
| Large/backfill fixture | Still need a larger set of older videos for batch, fairness, and restart coverage. |

## Follow-Up Unselected Guard Check

| Field | Value |
| --- | --- |
| Run time | 2026-07-20 |
| Command | Visible in-app browser run |
| Result | `Pass` |
| Catalog total | `8 videos` |
| Fresh selectable rows found | `3` |
| Selected rows | `video 5`, `video 4` |
| Unselected row | `Clip 3` |
| Run result | `2/2` |
| Last error | `None` |
| Final selected-row state | `No insights` |

The follow-up run completed the missing unselected-row guard. `video 5` and `video 4` moved to `Queued`, Recent runs reached `2/2`, and `Clip 3` remained fresh/selectable after completion. `No insights` means the selected videos were processed but did not generate extractable riffables/insights; it does not invalidate this exact-selection testcase, but it also does not satisfy a `Riffed` or insight-generation success testcase.

Observation: the fresh row is enabled but the UI does not visibly print a `Not ingested` state label; it appears as title plus publish date only. The PRD expects catalog rows to display ingest state, so this should be reviewed as either an intentional UI convention or a catalog state-display defect.
