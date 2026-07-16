# PRD Source: Controlled Ingestion POC

## Source Issues

Main source:

- #18 Vision: Controlled ingestion for large channels  
  https://github.com/speedrun-labs/riffables-prd/issues/18

Epics:

- #19 Epic: Ingest mode selection (auto vs manual)  
  https://github.com/speedrun-labs/riffables-prd/issues/19
- #20 Epic: Channel video catalog & curation  
  https://github.com/speedrun-labs/riffables-prd/issues/20
- #22 Epic: Crawl progress, cancellation, and fair processing  
  https://github.com/speedrun-labs/riffables-prd/issues/22

Tasks:

- #23 Creator picks ingest mode when connecting a channel  
  https://github.com/speedrun-labs/riffables-prd/issues/23
- #24 Manual-mode channel refuses every automatic ingest  
  https://github.com/speedrun-labs/riffables-prd/issues/24
- #25 Creator switches a channel between auto and manual  
  https://github.com/speedrun-labs/riffables-prd/issues/25
- #26 Connecting a channel builds a browsable video catalog  
  https://github.com/speedrun-labs/riffables-prd/issues/26
- #27 Catalog shows each video's ingest state  
  https://github.com/speedrun-labs/riffables-prd/issues/27
- #28 Creator selects catalog videos and ingests just those  
  https://github.com/speedrun-labs/riffables-prd/issues/28
- #29 Refreshing the catalog picks up new uploads  
  https://github.com/speedrun-labs/riffables-prd/issues/29
- #30 Live progress for a running crawl  
  https://github.com/speedrun-labs/riffables-prd/issues/30
- #31 Creator cancels a running crawl  
  https://github.com/speedrun-labs/riffables-prd/issues/31
- #32 Large backfill runs in bounded batches without blocking fresh videos  
  https://github.com/speedrun-labs/riffables-prd/issues/32

## Why This Is The First POC

This cluster has a complete shape for QA AI workflow:

```text
Vision -> Epic -> Task -> Requirements -> Test Plan -> Test Cases -> Traceability
```

It is also testable across:

- UI behavior.
- API/business rule behavior.
- Background job behavior.
- Regression/fairness behavior.

## Suggested Output Files

```text
qa-ai-workflow/requirements/controlled-ingestion.requirements.yaml
qa-ai-workflow/test-plans/controlled-ingestion.test-plan.md
qa-ai-workflow/test-cases/controlled-ingestion.test-cases.yaml
qa-ai-workflow/traceability/controlled-ingestion.traceability.md
```

