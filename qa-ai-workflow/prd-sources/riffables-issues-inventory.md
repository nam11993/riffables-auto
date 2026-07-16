# Riffables PRD Issues Inventory

Nguồn đọc: https://github.com/speedrun-labs/riffables-prd/issues

Ngày đọc: 2026-07-09

## Tóm tắt nhanh

Đã đọc 47 issues:

- 36 open issues.
- 11 closed issues.
- 1 issue đang là Test Plan hiện có: #42.
- Cấu trúc tài liệu đang đi theo dạng `Vision -> Epic -> Task`.

Với mục tiêu xây dựng workflow QA AI, không nên bắt đầu bằng toàn bộ 47 issues. Nên bắt đầu bằng một cụm có đủ Vision, Epic, Task, acceptance criteria và có luồng nghiệp vụ rõ.

## Điểm bắt đầu khuyến nghị

Nên bắt đầu POC với cụm:

```text
Controlled ingestion for large channels
```

Lý do:

- Có Vision rõ: #18.
- Có 3 Epic rõ: #19, #20, #22.
- Có Task con đủ nhỏ để sinh requirement/test case: #23 đến #32.
- Có hành vi test được bằng manual, API và UI.
- Có rủi ro nghiệp vụ thật: không được tự ingest khi manual, không được spend budget ngoài ý muốn, backfill lớn không được block video mới.

## Thứ tự đọc cho POC đầu tiên

1. #18 - Vision: Controlled ingestion for large channels
2. #19 - Epic: Ingest mode selection (auto vs manual)
3. #23 - Task: Creator picks ingest mode when connecting a channel
4. #24 - Task: Manual-mode channel refuses every automatic ingest
5. #25 - Task: Creator switches a channel between auto and manual
6. #20 - Epic: Channel video catalog & curation
7. #26 - Task: Connecting a channel builds a browsable video catalog
8. #27 - Task: Catalog shows each video's ingest state
9. #28 - Task: Creator selects catalog videos and ingests just those
10. #29 - Task: Refreshing the catalog picks up new uploads
11. #22 - Epic: Crawl progress, cancellation, and fair processing
12. #30 - Task: Live progress for a running crawl
13. #31 - Task: Creator cancels a running crawl
14. #32 - Task: Large backfill runs in bounded batches without blocking fresh videos

Sau cụm này mới nối thêm:

- #21 - Task: Fix Sources Page Crawl Feedback UI
- #34 - Task: Redesign Content Page Filter UI
- #45 to #48 - Accessibility/UX hardening

## Nhóm issue theo module

### 0. Global Context / Test Foundation

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #11 Vision: Overview | Open | Product/system overview | Đọc để hiểu toàn bộ architecture và journeys |
| #12 Vision: UI description | Open | UI testing specification | Có matrix UI theo Creator Console và Audience Public Site |
| #42 Test Plan | Open | QA baseline | Test plan hiện có, nên dùng làm baseline cho coverage |

### 1. Ingestion Pipeline V1

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #6 Vision: Pluggable Ingestion Pipeline | Open | Vision | Sync/schedule/import từ YouTube, Spotify, RSS |
| #1 Epic: Automatic Feed Sync & Ingestion | Open | Epic | YouTube/channel import, queued/processing/ready, retry, background jobs |

### 2. Controlled Ingestion For Large Channels

Đây là cụm nên làm POC đầu tiên.

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #18 Vision: Controlled ingestion for large channels | Open | Vision | Auto/manual mode, catalog, bounded batches, fairness |
| #19 Epic: Ingest mode selection (auto vs manual) | Open | Epic | Chọn mode khi connect, switch mode, manual không tự ingest |
| #23 Task: Creator picks ingest mode when connecting a channel | Open | Task | Auto default, Manual không ingest khi connect |
| #24 Task: Manual-mode channel refuses every automatic ingest | Open | Task | No teaser crawl, no Run, no Backfill, no schedule |
| #25 Task: Creator switches a channel between auto and manual | Open | Task | Switch là setting change, không tự start/cancel ingest |
| #20 Epic: Channel video catalog & curation | Open | Epic | Catalog metadata-only, search, state, select and ingest |
| #26 Task: Connecting a channel builds a browsable video catalog | Open | Task | Tạo catalog không tạo Riffs, có title/date/search/page |
| #27 Task: Catalog shows each video's ingest state | Open | Task | not ingested, queued, processing, riffed, failed |
| #28 Task: Creator selects catalog videos and ingests just those | Open | Task | Chỉ ingest video được tick, validate video thuộc channel |
| #29 Task: Refreshing the catalog picks up new uploads | Open | Task | Refresh metadata-only, không re-ingest |
| #22 Epic: Crawl progress, cancellation, and fair processing | Open | Epic | Bounded batches, live progress, cancel, priority/fairness |
| #30 Task: Live progress for a running crawl | Open | Task | done/total cập nhật live |
| #31 Task: Creator cancels a running crawl | Open | Task | Stop trong một batch, item chưa xử lý trở lại selectable |
| #32 Task: Large backfill runs in bounded batches without blocking fresh videos | Open | Task | Cross-tenant fairness, resume sau restart, không process double |

### 3. AI Extraction / Citation / Re-extraction

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #7 Vision: Verifiable AI Extraction | Open | Vision | Quote/insight phải trace về transcript |
| #2 Epic: Verifiable Citation & Traceback Validation | Open | Epic | Verbatim match, reject hallucination, timestamp deep link |
| #3 Epic: Self-Serve Re-extraction Console Endpoint | Open | Epic | Re-extract single content/pending queue, role restriction, duplicate prevention |

### 4. Search / Discovery / Public Audience Site

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #8 Vision: Hybrid Discovery Engine | Open | Vision | Keyword + semantic search, RRF/fused result |
| #4 Epic: Hybrid pgvector & RRF Discovery | Open | Epic | Exact/concept search, max result, tenant-scoped result |
| #16 Vision: Public Audience Site | Open | Vision | Hosted tenant site, search, insight cards, media player, audience chat |
| #14 Epic: Public Audience Site | Closed | Epic | Baseline/regression cho public site |
| #17 Task: Fix Published Public Site | Open | Task | Published site URL phải load được |

### 5. Creator Console / Dashboard / Curation UI

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #15 Vision: Creator Console Dashboard | Open | Vision | Console dashboard, sources, curation, site setup, customizer |
| #13 Epic: Creator Console Dashboard | Closed | Epic | Baseline/regression cho dashboard V1 |
| #21 Task: Fix Sources Page Crawl Feedback UI | Open | Task | Running/finished crawl feedback, last run, last error |
| #34 Task: Redesign Content Page Filter UI | Open | Task | Filter UI phải khác visual content cards |

### 6. Visual Site Builder / Live Catalog Binding

Nhóm này đã closed, nên nên dùng làm regression baseline hoặc tham chiếu khi test public site/editor.

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #35 Epic: Visual site builder - bind sections to live catalog data | Closed | Epic | Collection element, field binding, preview/published parity |
| #37 Task: Repeat a section over a collection of catalog data | Closed | Task | Repeated section per catalog item |
| #38 Task: Bind a card's fields to the current item | Closed | Task | Bound field vs static field |
| #39 Task: Guide creators to binding from the inspector's Data tab | Closed | Task | Data tab guidance, valid bindable sources |
| #40 Task: Scroll the editor canvas to a section when picked from the layers list | Closed | Task | Editor navigation |
| #44 Task: Fix the publish domain to a tenant subdomain | Closed | Task | Publish domain format and validation |

### 7. Guided Onboarding

Nhóm này đã closed, nên nên dùng làm regression baseline.

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #36 Epic: Guided onboarding tours for the console | Closed | Epic | Home/Sources/Content/Sites tours |
| #41 Task: Per-screen product tour for new creators | Closed | Task | First-visit coach-mark tour |
| #43 Task: Guided tour for the site editor | Closed | Task | Editor-specific tour |

### 8. Accessibility / UX Hardening

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #45 Epic: Console UX & accessibility hardening | Open | Epic | Post-V1 polish, audit gaps |
| #46 Task: Meet the 24px minimum tap-target size | Open | Task | WCAG 2.2 AA pointer target |
| #47 Task: Offer a 'View live site' action right after publishing | Open | Task | Success publish action |
| #48 Task: Give dashboard screens and the editor a real heading structure | Open | Task | Screen-reader heading outline |

### 9. Conversational Customization / Theme Builder

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #9 Vision: Conversational Customization | Open | Vision | AI chat updates widget style/preview |
| #5 Epic: Conversational Widget Theme Customizer | Open | Epic | Allowed CSS variables, malicious script refusal, save styles |

### 10. Multi-Tenant / Permission / Security

| Issue | Status | Vai trò | Ghi chú QA |
| --- | --- | --- | --- |
| #10 Vision: Multi-Tenant Isolation | Open | Vision | Tenant-scoped DB/API/search/admin behavior |

## Thứ tự triển khai QA artifacts

### Phase A - Inventory and baseline

Input:

- #11
- #12
- #42

Output:

- `requirements/global-context.requirements.yaml`
- `test-plans/riffables-master.test-plan.md`

Không cần viết test case chi tiết ở phase này. Mục tiêu chỉ là xác định module và priority.

### Phase B - POC controlled ingestion

Input:

- #18
- #19, #20, #22
- #23 to #32

Output:

- `requirements/controlled-ingestion.requirements.yaml`
- `test-plans/controlled-ingestion.test-plan.md`
- `test-cases/controlled-ingestion.test-cases.yaml`
- `traceability/controlled-ingestion.traceability.md`

Đây là phase nên làm đầu tiên.

### Phase C - Regression từ closed issues

Input:

- #13, #14
- #35 to #41
- #43, #44

Output:

- Regression checklist cho dashboard, public site, site builder, onboarding.

### Phase D - Open UI/UX polish

Input:

- #21
- #34
- #45 to #48

Output:

- UI regression checklist.
- Accessibility checklist.
- Playwright smoke cho editor/dashboard nếu có app chạy được.

### Phase E - Core AI/search/security modules

Input:

- #2, #3, #4, #5, #7, #8, #9, #10

Output:

- AI validation test cases.
- Search relevance/golden dataset plan.
- Permission/tenant isolation API tests.

## Priority đề xuất cho QA

### P0

- Manual mode không được tự động ingest: #19, #23, #24.
- Catalog selection chỉ ingest đúng video được chọn: #20, #26, #27, #28.
- Bounded batches/fairness không block fresh videos: #22, #30, #31, #32.
- Citation/verbatim/timestamp correctness: #2, #7.
- Tenant isolation: #10.
- Hybrid search tenant-scoped results: #4, #8.
- Published public site load được: #17.

### P1

- Source crawl feedback UI: #21.
- Content filter visual hierarchy: #34.
- Widget/theme customizer: #5, #9.
- Self-serve re-extraction: #3.
- Accessibility hardening: #45 to #48.

### P2 / Regression baseline

- Guided onboarding: #36, #41, #43.
- Visual site builder binding: #35, #37 to #40, #44.
- Closed dashboard/public site baseline: #13, #14.

## Mapping ID gợi ý

Cho POC đầu tiên, dùng module key:

```text
INGEST-MODE
CATALOG
CRAWL
```

Ví dụ:

```text
REQ-INGEST-MODE-001
REQ-CATALOG-001
REQ-CRAWL-001

TC-INGEST-MODE-001
TC-CATALOG-001
TC-CRAWL-001

BUG-INGEST-MODE-001
BUG-CATALOG-001
BUG-CRAWL-001
```

## Next action

Bắt đầu tạo requirement từ cụm controlled ingestion:

```text
#18 -> #19/#20/#22 -> #23-#32
```

Dùng prompt:

```text
qa-ai-workflow/prompts/01-requirement-analyst.md
```

Output đầu tiên nên là:

```text
qa-ai-workflow/requirements/controlled-ingestion.requirements.yaml
```

