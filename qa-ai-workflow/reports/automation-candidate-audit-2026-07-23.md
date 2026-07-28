# Automation Candidate Audit - 2026-07-23

## Snapshot

| Metric | Count |
| --- | ---: |
| Total testcase | 400 |
| Testcase with direct automation status | 152 |
| Testcase covered by split automation mapping | 1 |
| Remaining without automation result | 247 |
| Remaining marked `Automation Candidate = Yes` | 137 |
| Remaining marked `Automation Candidate = Later` | 60 |
| Remaining marked `Automation Candidate = Manual only` | 50 |

This audit classifies the remaining non-automated testcases by practical automation readiness.

## Tom Tat Tieng Viet

Bo testcase hien tai co `400` case. Trong do co `152` case da co trang thai auto truc tiep, `1` case duoc cover bang split coverage, va `247` case chua co ket qua auto.

Trong `247` case con lai:

| Nhom | So luong | Y nghia |
| --- | ---: | --- |
| `Automation Candidate = Yes` | 137 | Nen dua vao backlog auto. Tuy nhien khong phai case nao cung chay ngay duoc; nhieu case can fixture, data, role account, API hook, hoac approve thao tac co thay doi du lieu. |
| `Automation Candidate = Later` | 60 | Co the auto trong tuong lai, nhung hien tai thuong bi chan boi san pham chua support, data chua on dinh, hoac can moi truong rieng. |
| `Automation Candidate = Manual only` | 50 | Khong nen auto bang UI Playwright thong thuong. Mot so case co the chuyen sang API/backend/security harness sau nay, nhung khong nen ep vao luong UI. |

Ket luan thuc te: nhom nen lam tiep ngay khong phai la toan bo `137` case `Yes`, ma nen bat dau tu cac case UI/read-only it rui ro: onboarding, ingest-mode UI, catalog read-only, public/search boundary, creator console read-only, sau do moi den cac case crawl/AI/security can fixture.

## Automation Result Breakdown

| Current status bucket | Count | Meaning |
| --- | ---: | --- |
| `Auto PASS` | 115 | Da co automation va dang pass. |
| `Auto PARTIAL PASS` | 17 | Da cover duoc mot phan luong, nhung con chan o OAuth, mailbox, backend hook, hoac fixture. |
| `Auto EXPECTED FAIL` | 11 | Automation da chay va bat duoc hanh vi staging khac expected result. |
| `Auto BLOCKED` | 3 | Automation khong the di tiep vi chan moi truong/ben thu ba. |
| `Auto SKIP` | 3 | Dang skip vi dieu kien test chua san sang. |
| `Auto FAIL` | 2 | Da co automation nhung fail that, can triage/sua app hoac sua expected step. |
| `Split coverage` | 1 | Case duoc tach cover bang cac testcase con lien quan. |
| `Auto PARTIAL` | 1 | Co automation mot phan nhung chua dat partial pass ro rang. |

## Candidate Field Index

### Non-Automated But Marked `Yes`

| Section | IDs |
| --- | --- |
| P0: AI Extraction, Citation, And Re-extraction | `TC-AI-002`, `TC-AI-007`, `TC-AI-008`, `TC-AI-009`, `TC-AI-010`, `TC-AI-011`, `TC-AI-012`, `TC-AI-013`, `TC-AI-015`, `TC-AI-016`, `TC-AI-017`, `TC-AI-018`, `TC-AI-019`, `TC-AI-020`, `TC-AI-022`, `TC-AI-025`, `TC-AI-031`, `TC-AI-034`, `TC-AI-035` |
| P0: Controlled Ingestion - Catalog | `TC-CATALOG-003`, `TC-CATALOG-006`, `TC-CATALOG-007`, `TC-CATALOG-009`, `TC-CATALOG-011`, `TC-CATALOG-012`, `TC-CATALOG-016` |
| P0: Controlled Ingestion - Crawl And Processing | `TC-CRAWL-003`, `TC-CRAWL-004`, `TC-CRAWL-005`, `TC-CRAWL-009`, `TC-CRAWL-011`, `TC-CRAWL-016` |
| P0: Controlled Ingestion - Ingest Mode | `TC-INGEST-MODE-001`, `TC-INGEST-MODE-002`, `TC-INGEST-MODE-003`, `TC-INGEST-MODE-004`, `TC-INGEST-MODE-005`, `TC-INGEST-MODE-009`, `TC-INGEST-MODE-012`, `TC-INGEST-MODE-013`, `TC-INGEST-MODE-016` |
| P0: Foundation Smoke - Authentication And Source Connection | `TC-AUTH-005`, `TC-AUTH-006`, `TC-AUTH-016`, `TC-AUTH-017`, `TC-AUTH-021`, `TC-SOURCE-005`, `TC-SOURCE-006`, `TC-SOURCE-012`, `TC-SOURCE-019`, `TC-SOURCE-032`, `TC-SOURCE-035`, `TC-SOURCE-046` |
| P0: Ingestion Pipeline | `TC-INGEST-001`, `TC-INGEST-002`, `TC-INGEST-003`, `TC-INGEST-004`, `TC-INGEST-005`, `TC-INGEST-009`, `TC-INGEST-010`, `TC-INGEST-012` |
| P0: Search And Public Site | `TC-PUBLIC-004`, `TC-PUBLIC-008`, `TC-PUBLIC-012`, `TC-PUBLIC-015`, `TC-PUBLIC-017`, `TC-SEARCH-003` |
| P0: Tenant Security | `TC-TENANT-001`, `TC-TENANT-002`, `TC-TENANT-003`, `TC-TENANT-004`, `TC-TENANT-005`, `TC-TENANT-006`, `TC-TENANT-007`, `TC-TENANT-010`, `TC-TENANT-011`, `TC-TENANT-012`, `TC-TENANT-013`, `TC-TENANT-014`, `TC-TENANT-015` |
| P1: Creator Console | `TC-CONSOLE-001`, `TC-CONSOLE-002`, `TC-CONSOLE-008`, `TC-CONSOLE-010`, `TC-CONSOLE-015`, `TC-CONSOLE-016`, `TC-CONSOLE-017`, `TC-CONSOLE-018`, `TC-CONSOLE-021`, `TC-CONSOLE-022`, `TC-CONSOLE-027`, `TC-CONSOLE-028`, `TC-CONSOLE-029`, `TC-CONSOLE-030`, `TC-CONSOLE-031`, `TC-CONSOLE-032`, `TC-CONSOLE-033`, `TC-CONSOLE-034`, `TC-CONSOLE-035`, `TC-CONSOLE-036`, `TC-CONSOLE-037`, `TC-CONSOLE-038`, `TC-CONSOLE-039`, `TC-CONSOLE-040` |
| P1: Theme Customization | `TC-THEME-005`, `TC-THEME-006`, `TC-THEME-008`, `TC-THEME-009`, `TC-THEME-010`, `TC-THEME-011`, `TC-THEME-013`, `TC-THEME-014` |
| P2: Site Builder And Onboarding Regression | `TC-BUILDER-001`, `TC-BUILDER-002`, `TC-BUILDER-003`, `TC-BUILDER-004`, `TC-BUILDER-005`, `TC-BUILDER-006`, `TC-BUILDER-007`, `TC-BUILDER-008`, `TC-BUILDER-011`, `TC-BUILDER-014`, `TC-BUILDER-017`, `TC-BUILDER-043`, `TC-BUILDER-044`, `TC-BUILDER-045`, `TC-BUILDER-046`, `TC-ONBOARD-001`, `TC-ONBOARD-002`, `TC-ONBOARD-003`, `TC-ONBOARD-004`, `TC-ONBOARD-005`, `TC-ONBOARD-008`, `TC-ONBOARD-009`, `TC-ONBOARD-010`, `TC-ONBOARD-011`, `TC-ONBOARD-012` |

### Non-Automated Marked `Later`

| Section | IDs |
| --- | --- |
| P0: AI Extraction, Citation, And Re-extraction | `TC-AI-004`, `TC-AI-006`, `TC-AI-014`, `TC-AI-021`, `TC-AI-026`, `TC-AI-027`, `TC-AI-028`, `TC-AI-029`, `TC-AI-032`, `TC-AI-033`, `TC-AI-036` |
| P0: Controlled Ingestion - Catalog | `TC-CATALOG-002`, `TC-CATALOG-008`, `TC-CATALOG-015` |
| P0: Controlled Ingestion - Crawl And Processing | `TC-CRAWL-012`, `TC-CRAWL-014`, `TC-CRAWL-015` |
| P0: Controlled Ingestion - Ingest Mode | `TC-INGEST-MODE-008`, `TC-INGEST-MODE-010`, `TC-INGEST-MODE-017` |
| P0: Foundation Smoke - Authentication And Source Connection | `TC-AUTH-026`, `TC-AUTH-027`, `TC-AUTH-028`, `TC-AUTH-029`, `TC-AUTH-030`, `TC-AUTH-031`, `TC-AUTH-032`, `TC-AUTH-033`, `TC-AUTH-035`, `TC-AUTH-036`, `TC-AUTH-037`, `TC-AUTH-038`, `TC-AUTH-039`, `TC-AUTH-040`, `TC-AUTH-041`, `TC-AUTH-042`, `TC-SOURCE-010`, `TC-SOURCE-011` |
| P0: Ingestion Pipeline | `TC-INGEST-013`, `TC-INGEST-014`, `TC-INGEST-015`, `TC-INGEST-017`, `TC-INGEST-019` |
| P0: Search And Public Site | `TC-PUBLIC-013`, `TC-PUBLIC-020`, `TC-SEARCH-012`, `TC-SEARCH-014` |
| P1: Accessibility And UX | `TC-A11Y-003` |
| P1: Creator Console | `TC-CONSOLE-004`, `TC-CONSOLE-005`, `TC-CONSOLE-006`, `TC-CONSOLE-007`, `TC-CONSOLE-012`, `TC-CONSOLE-013`, `TC-CONSOLE-014` |
| P1: Theme Customization | `TC-THEME-001`, `TC-THEME-003`, `TC-THEME-012` |
| P2: Site Builder And Onboarding Regression | `TC-BUILDER-010`, `TC-ONBOARD-006` |

### Non-Automated Marked `Manual only`

| Section | IDs |
| --- | --- |
| P0: AI Extraction, Citation, And Re-extraction | `TC-AI-001`, `TC-AI-003`, `TC-AI-005`, `TC-AI-023`, `TC-AI-024`, `TC-AI-030` |
| P0: Controlled Ingestion - Catalog | `TC-CATALOG-004` |
| P0: Controlled Ingestion - Crawl And Processing | `TC-CRAWL-001`, `TC-CRAWL-006`, `TC-CRAWL-007`, `TC-CRAWL-008`, `TC-CRAWL-017` |
| P0: Foundation Smoke - Authentication And Source Connection | `TC-AUTH-018`, `TC-AUTH-019`, `TC-AUTH-020`, `TC-AUTH-022`, `TC-SOURCE-020`, `TC-SOURCE-021`, `TC-SOURCE-028`, `TC-SOURCE-038` |
| P0: Ingestion Pipeline | `TC-INGEST-006`, `TC-INGEST-007`, `TC-INGEST-008`, `TC-INGEST-011` |
| P0: Search And Public Site | `TC-PUBLIC-006`, `TC-PUBLIC-018`, `TC-PUBLIC-019`, `TC-PUBLIC-021`, `TC-SEARCH-002`, `TC-SEARCH-005`, `TC-SEARCH-007`, `TC-SEARCH-008`, `TC-SEARCH-009`, `TC-SEARCH-010` |
| P0: Tenant Security | `TC-TENANT-008`, `TC-TENANT-009`, `TC-TENANT-016` |
| P1: Creator Console | `TC-CONSOLE-019`, `TC-CONSOLE-020` |
| P1: Theme Customization | `TC-THEME-002`, `TC-THEME-004`, `TC-THEME-007` |
| P2: Site Builder And Onboarding Regression | `TC-BUILDER-009`, `TC-BUILDER-012`, `TC-BUILDER-013`, `TC-BUILDER-015`, `TC-BUILDER-016`, `TC-BUILDER-018`, `TC-BUILDER-019`, `TC-BUILDER-028` |

## Recommended Next Automation Order

| Order | Group | Why next | Candidate IDs |
| ---: | --- | --- | --- |
| 1 | Onboarding regression | Low-risk UI flows, mostly new-account/local-storage state, no source/crawl/site mutation required. | `TC-ONBOARD-008`, `TC-ONBOARD-009`, `TC-ONBOARD-010` |
| 2 | Ingest mode UI completion | Reuses current Sources fixture, can increase coverage without Google OAuth. | `TC-INGEST-MODE-001`, `TC-INGEST-MODE-002`, `TC-INGEST-MODE-008`, `TC-INGEST-MODE-012`; `TC-INGEST-MODE-004` as expected-fail/partial because Manual still exposes Schedule |
| 3 | Catalog read-only/detail coverage | Reuses connected `@nhnbaohan` Videos panel; mostly no mutation if kept read-only. | `TC-CATALOG-002`, `TC-CATALOG-003`, `TC-CATALOG-004`, `TC-CATALOG-011`, `TC-CATALOG-015`, `TC-CATALOG-016` |
| 4 | Public/search boundary coverage | Reuses Sunday/Baohan public URLs; safe to run without creator mutation. | `TC-SEARCH-005`, `TC-SEARCH-007`, `TC-SEARCH-008`, `TC-SEARCH-009`, `TC-SEARCH-010`, `TC-SEARCH-014`, `TC-PUBLIC-006`, `TC-PUBLIC-012`, `TC-PUBLIC-017` |
| 5 | Creator console read-only state | Useful but expected values depend on current Baohan workspace data. | `TC-CONSOLE-001`, `TC-CONSOLE-002`, `TC-CONSOLE-006`, `TC-CONSOLE-008`, `TC-CONSOLE-015`, `TC-CONSOLE-016`, `TC-CONSOLE-021`, `TC-CONSOLE-022`, `TC-CONSOLE-035`, `TC-CONSOLE-036` |
| 6 | Site/editor publish-success gap | Automatable, but needs approval because it may publish or touch live site state. | `TC-A11Y-003`, `TC-BUILDER-006`, `TC-BUILDER-007`, `TC-BUILDER-011` |

## Ready To Automate With Current Fixtures

These should be feasible with Playwright using the current staging app and existing test accounts/URLs.

| Module | IDs | Notes |
| --- | --- | --- |
| Onboarding | `TC-ONBOARD-008`, `TC-ONBOARD-009`, `TC-ONBOARD-010` | Best next batch. Use unique signup accounts or reset browser storage. |
| Onboarding expanded | `TC-ONBOARD-001`, `TC-ONBOARD-002`, `TC-ONBOARD-004`, `TC-ONBOARD-006`, `TC-ONBOARD-011`, `TC-ONBOARD-012` | Feasible after the P1 onboarding batch, but may need new-account fixtures and known grandfathered account state. |
| Ingest mode UI | `TC-INGEST-MODE-001`, `TC-INGEST-MODE-002`, `TC-INGEST-MODE-008`, `TC-INGEST-MODE-012` | Connect form mode controls/copy/default can be automated before OAuth. |
| Ingest mode existing Manual source | `TC-INGEST-MODE-004` | UI portion can be automated now; likely expected-fail/partial because `Schedule` remains visible in Manual mode. |
| Catalog read-only | `TC-CATALOG-002`, `TC-CATALOG-003`, `TC-CATALOG-004`, `TC-CATALOG-011`, `TC-CATALOG-015`, `TC-CATALOG-016` | Open Videos panel, inspect catalog row metadata/state/search/pagination without starting ingest. |
| Public/search read-only | `TC-SEARCH-005`, `TC-SEARCH-007`, `TC-SEARCH-008`, `TC-SEARCH-009`, `TC-SEARCH-010`, `TC-SEARCH-014`, `TC-PUBLIC-006`, `TC-PUBLIC-012`, `TC-PUBLIC-017` | Reuse public site fixtures. Some may become partial if public filter/detail affordances are not implemented. |
| Creator console read-only | `TC-CONSOLE-001`, `TC-CONSOLE-002`, `TC-CONSOLE-006`, `TC-CONSOLE-008`, `TC-CONSOLE-015`, `TC-CONSOLE-016`, `TC-CONSOLE-021`, `TC-CONSOLE-022` | Verify layout/state/labels/route identity without mutating data. |
| Home current-state checks | `TC-CONSOLE-035`, `TC-CONSOLE-036` | Automatable against current Baohan account if expected metrics/content are treated as observed fixture values. |
| Site/editor guarded read-only | `TC-BUILDER-006`, `TC-BUILDER-007`, `TC-BUILDER-011`, `TC-BUILDER-028` | Can be automated in guarded mode; publish-success checks need approval if they mutate live site. |

## Automatable, But Needs Fixture Or Approval

These should not be run casually because they need backend observability, fresh data, role accounts, mailbox access, or explicit mutation approval.

| Module | IDs | Needed before automation |
| --- | --- | --- |
| Source destructive/schedule/backfill | `TC-SOURCE-028`, `TC-SOURCE-032`, `TC-SOURCE-035`, `TC-SOURCE-038`, `TC-SOURCE-046` | Disposable source, schedule cleanup policy, failing crawl fixture, real backfill data, and approval to mutate source/jobs. |
| Crawl/worker behavior | `TC-CRAWL-001`, `TC-CRAWL-003`, `TC-CRAWL-004`, `TC-CRAWL-005`, `TC-CRAWL-008`, `TC-CRAWL-011`, `TC-CRAWL-012`, `TC-CRAWL-014`, `TC-CRAWL-015`, `TC-CRAWL-016`, `TC-CRAWL-017` | Fresh eligible items, long-running crawl, cancelable job, worker restart/backfill fixture, and queue observability. |
| Catalog mutation/fresh upload | `TC-CATALOG-007`, `TC-CATALOG-008`, `TC-CATALOG-009`, `TC-CATALOG-012` | Fresh upload/catalog rows, stale-selection simulation, provider ceiling/backfill fixture. |
| Ingestion processing | `TC-INGEST-003`, `TC-INGEST-004`, `TC-INGEST-005`, `TC-INGEST-006`, `TC-INGEST-009`, `TC-INGEST-010`, `TC-INGEST-012`, `TC-INGEST-013`, `TC-INGEST-017`, `TC-INGEST-019` | Worker state hooks or stable media fixtures for queued/processing/failed/retry/long-media behavior. |
| Ingest mode backend/API | `TC-INGEST-MODE-003`, `TC-INGEST-MODE-005`, `TC-INGEST-MODE-009`, `TC-INGEST-MODE-013`, `TC-INGEST-MODE-016`, `TC-INGEST-MODE-017` | OAuth/bypass or API client, queue inspection, Manual-source API refusal, running-crawl fixture. |
| Site/editor mutation | `TC-A11Y-003`, `TC-BUILDER-043`, `TC-BUILDER-044`, `TC-BUILDER-045`, `TC-BUILDER-046` | Publish approval, stable drag/drop selectors, disposable media files, invalid upload fixtures, cleanup plan. |
| Theme/Assistant | `TC-THEME-001` to `TC-THEME-014`, `TC-BUILDER-012` to `TC-BUILDER-019` | Assistant mutation fixture or mocked AI response, safe prompt corpus, draft diff verification, security prompt expectations. |
| AI extraction/citation | `TC-AI-001` to `TC-AI-036` | Golden transcript, known exact/near/unsupported quotes, generated Riffed content, citation timestamp fixture, re-extraction API/job observability. |
| Tenant/security | `TC-TENANT-001` to `TC-TENANT-016`, `TC-AUTH-005`, `TC-AUTH-006`, `TC-AUTH-022`, `TC-CONSOLE-048` | Tenant B account/site/data, lower-role accounts, API auth tokens, direct-resource IDs, role matrix. |
| Auth reset/Google OAuth | `TC-AUTH-016` to `TC-AUTH-021`, `TC-AUTH-026` to `TC-AUTH-042`, `TC-SOURCE-020`, `TC-SOURCE-021` | Google OAuth test bypass/storage state, mailbox/reset-link capture, safe password-rotation fixture. |

## Currently Blocked Or Low Value For Automation

| Area | Reason |
| --- | --- |
| Spotify/RSS source connection (`TC-SOURCE-010`, `TC-SOURCE-011`) | Current staging marks these source types as `Crawling soon`, so full connection is blocked until product support exists. |
| Full Google OAuth completion | Google blocks normal Playwright automated browsers; use manual handoff, storage state, or staging OAuth bypass. |
| Password reset/change completion | Requires mailbox/reset-link capture and safe password restore policy. |
| AI hallucination/citation verification | Should not be automated without deterministic golden data or a mock harness; otherwise results are too variable for regression. |
| Cross-tenant/direct API negative tests | High security value, but they need controlled tenant/role fixtures to avoid false positives and unsafe probing. |

## Practical Next Pick

The best next implementation batch is:

```text
TC-ONBOARD-008
TC-ONBOARD-009
TC-ONBOARD-010
```

After that, run:

```text
TC-INGEST-MODE-001
TC-INGEST-MODE-002
TC-INGEST-MODE-008
TC-INGEST-MODE-012
TC-CATALOG-002
TC-CATALOG-003
TC-CATALOG-004
TC-CATALOG-011
TC-CATALOG-015
TC-CATALOG-016
```
