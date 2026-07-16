# PRD Impact Classification: 20260716-100409

## Source

| Field | Value |
| --- | --- |
| Repository | `speedrun-labs/riffables-prd` |
| Source method | `github-web-browser-session` |
| Change report | `qa-ai-workflow\prd-sources\change-reports\issue-change-impact-20260716-100409.md` |
| Previous snapshot | `qa-ai-workflow\prd-sources\snapshots\issues-20260713-093244.json` |
| Current snapshot | `qa-ai-workflow\prd-sources\snapshots\issues-20260716-100409.json` |
| Impact JSON | `qa-ai-workflow\prd-sources\latest-issue-impact.json` |

## Summary

This classification was generated after the PAT API path returned `401 Bad credentials`; the PRD was read through the logged-in GitHub browser session. To avoid false positives from API raw Markdown versus browser-rendered text, this run treats only new issues, removed issues, title changes, and state changes as reportable changes.

| Metric | Count |
| --- | ---: |
| Previous snapshot issues | 64 |
| Current synced issues | 71 |
| Open issues | 21 |
| Closed issues | 50 |
| Newly seen issues | 7 |
| State/title changed issues | 19 |
| Removed issues | 0 |
| No-impact issues | 0 |
| Requirement-impact issues | 26 |
| Test-plan-impact issues | 26 |
| Test-case-impact issues | 26 |
| Automation-impact issues | 26 |
| Needs clarification | 2 |

## Issue Classification

| Issue | Change Summary | Classification | Impacted Artifact Types | Recommended Action |
| --- | --- | --- | --- | --- |
| `#66` | New open task: site editor Assistant should accept natural-language edit requests and propose previewable diffs for public-site editing. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact`, `needs-human-clarification` | Requirements, test plan, test cases, automation, traceability | Add/expand site-editor AI assistant requirements and detailed AI validation cases; confirm supported edit operations and pass/fail oracle for generated diffs. |
| `#67` | New closed task: Pipeline status card must move above the fold/right column for visibility. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Add dashboard layout/visibility regression coverage for pipeline health card. |
| `#68` | New closed task: first-time users must be asked before onboarding tours auto-run. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Add onboarding consent, first-login, returning-user, storage/reset, and accessibility cases. |
| `#69` | New closed task: sign-in/sign-up password field has show/hide toggle with accessibility requirements. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Add auth password visibility positive, negative, keyboard, screen-reader, reset, and privacy cases. |
| `#70` | New closed infra task: deployed Google OAuth callback must make Continue with Google complete real sign-in. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact`, `needs-human-clarification` | Requirements, test plan, test cases, automation, environment checklist | Add Google OAuth callback/environment readiness coverage; confirm status because backend wiring #71 is still open. |
| `#71` | New open backend task: BetterAuth Google social provider must be wired in service-api for operator login. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, automation, security | Add backend social login, callback, session, error, tenant/operator security coverage. |
| `#72` | New closed frontend task: Continue with Google button must call BetterAuth social sign-in instead of being decorative. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, automation, security | Add frontend OAuth start, redirect, cancel/error, disabled/config-missing, and regression cases. |
| `#18` | Existing issue changed from open to closed: Vision: Controlled ingestion for large channels. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#19` | Existing issue changed from open to closed: Epic: Ingest mode selection (auto vs manual). | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#20` | Existing issue changed from open to closed: Epic: Channel video catalog & curation. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#21` | Existing issue changed from open to closed: Task: Fix Sources Page Crawl Feedback UI. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move UI improvement to regression baseline and add/confirm UI visibility/filter cases. |
| `#22` | Existing issue changed from open to closed: Epic: Crawl progress, cancellation, and fair processing. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#23` | Existing issue changed from open to closed: Task: Creator picks ingest mode when connecting a channel. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#24` | Existing issue changed from open to closed: Task: Manual-mode channel refuses every automatic ingest. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#25` | Existing issue changed from open to closed: Task: Creator switches a channel between auto and manual. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#26` | Existing issue changed from open to closed: Task: Connecting a channel builds a browsable video catalog. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#27` | Existing issue changed from open to closed: Task: Catalog shows each video's ingest state. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#28` | Existing issue changed from open to closed: Task: Creator selects catalog videos and ingests just those. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#29` | Existing issue changed from open to closed: Task: Refreshing the catalog picks up new uploads. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#30` | Existing issue changed from open to closed: Task: Live progress for a running crawl. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#31` | Existing issue changed from open to closed: Task: Creator cancels a running crawl. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#32` | Existing issue changed from open to closed: Task: Large backfill runs in bounded batches without blocking fresh videos. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move from active/open work to regression baseline; keep existing behavioral requirement but update status/risk and ensure execution-level cases exist. |
| `#34` | Existing issue changed from open to closed: Task: Redesign Content Page Filter UI. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move UI improvement to regression baseline and add/confirm UI visibility/filter cases. |
| `#45` | Existing issue changed from open to closed: Epic: Console UX & accessibility hardening. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move console accessibility hardening to regression baseline and ensure a11y regression coverage remains explicit. |
| `#51` | Existing issue changed from open to closed: Epic: Console — wire the remaining backend APIs. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move console backend API wiring epic to regression baseline and make API integration coverage explicit. |
| `#59` | Existing issue changed from open to closed: Task: Replace the synthetic guest/show labels on the audience site. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Move public-site data correctness fix to regression baseline and add/confirm real creator/tenant label cases. |

## Requirement Areas Likely Affected

| Area | Issues | Action |
| --- | --- | --- |
| Authentication / Google OAuth / BetterAuth | `#69`, `#70`, `#71`, `#72` | Add or expand auth requirements for password visibility, Google OAuth start/callback/provider/session, config errors, and security boundaries. |
| Creator Console onboarding and UX | `#67`, `#68`, `#45` | Add/adjust requirements for pipeline card visibility, onboarding consent, and accessibility baseline. |
| Ingestion mode, catalog, crawl progress, cancellation, and batching | `#18`-`#32`, `#34` | Move previously open ingestion/catalog work to completed regression scope; ensure requirements and test cases remain executable. |
| Console backend API wiring | `#51` | Move console backend API coverage from open risk to regression/integration baseline. |
| Public site/editor AI assistant | `#66` | Add site-editor conversational assistant requirements, including previewable diff, accept/reject, safety constraints, and failure states. |
| Public audience data correctness | `#59` | Move real creator/tenant label behavior to regression baseline. |

## Test Plan / Test Case Impact

- Add or expand auth module coverage for email/password visibility and Google OAuth login.
- Add site-editor AI assistant module coverage with positive, negative, boundary, security, and AI validation cases.
- Reclassify ingestion/catalog/crawl items that are now closed as regression baseline, not open implementation risk.
- Add dashboard UX cases for pipeline card above-fold visibility and onboarding consent.
- Add/update public-site data correctness cases for real labels replacing synthetic placeholders.

## Automation Impact

- Playwright UI automation candidates: password visibility toggle, Continue with Google start/error states, onboarding consent, pipeline card visibility, public-site labels, site-editor assistant accept/reject flow.
- API/integration candidates: BetterAuth Google provider config, callback handling, session creation, tenant/operator isolation, ingestion catalog/crawl state APIs.
- AI validation candidates: site-editor Assistant natural-language request -> previewable diff -> accept/reject behavior; malicious or unsupported edit requests should be refused or safely constrained.

## Needs Confirmation

| Issue | Question |
| --- | --- |
| `#66` | What exact edit operations are in scope for the site-editor Assistant, and what is the QA oracle for an acceptable generated diff? |
| `#70`/`#71` | `#70` is closed but `#71` is open. Is Google OAuth testable in the deployed QA environment now, or should it remain blocked until backend provider wiring lands on main? |

## Explicit No-Impact Decisions

None. All detected changes either add new behavior or move previously open PRD work into regression baseline.

## Do Not Update Yet

This file is the classification gate only. Requirements, test plan, test cases, and traceability should be updated in the next step using `qa-ai-workflow/prd-sources/latest-ai-update-request.md`.

---

## Bản dịch tiếng Việt

### Tóm tắt

Lần phân loại này được tạo sau khi đường GitHub PAT API trả `401 Bad credentials`; PRD được đọc bằng browser session đã đăng nhập GitHub. Để tránh false positive do khác nhau giữa raw Markdown từ API và text render trên browser, lần này chỉ coi các thay đổi sau là thay đổi chắc chắn: issue mới, issue bị xóa/không còn thấy, đổi title, hoặc đổi trạng thái.

| Chỉ số | Số lượng |
| --- | ---: |
| Issue trong snapshot trước | 64 |
| Issue hiện tại sau sync | 71 |
| Issue đang mở | 21 |
| Issue đã đóng | 50 |
| Issue mới | 7 |
| Issue đổi title/trạng thái | 19 |
| Issue bị xóa/không còn thấy | 0 |
| Issue không ảnh hưởng | 0 |
| Issue ảnh hưởng requirement | 26 |
| Issue ảnh hưởng test plan | 26 |
| Issue ảnh hưởng testcase | 26 |
| Issue ảnh hưởng automation | 26 |
| Issue cần hỏi lại | 2 |

### Phân loại issue mới

| Issue | Tóm tắt thay đổi | Phân loại impact | Tài liệu bị ảnh hưởng | Hành động khuyến nghị |
| --- | --- | --- | --- | --- |
| `#66` | Thêm site-editor Assistant: operator có thể mô tả thay đổi public site bằng ngôn ngữ tự nhiên, AI đề xuất diff để preview và accept. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact`, `needs-human-clarification` | Requirements, test plan, test cases, automation, traceability | Bổ sung requirement và testcase AI validation cho site-editor assistant; cần xác nhận các loại edit được support và tiêu chí pass/fail cho diff do AI sinh. |
| `#67` | Pipeline status card phải được chuyển lên vị trí dễ thấy, trên fold/right column. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Thêm coverage cho layout/visibility của Pipeline Card trên dashboard/sources page. |
| `#68` | Người dùng lần đầu phải được hỏi trước khi onboarding tour tự chạy. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Thêm case cho consent onboarding, first login, returning user, local storage/reset, accessibility. |
| `#69` | Form sign-in/sign-up password có nút show/hide kèm yêu cầu accessibility. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression automation | Thêm positive/negative/keyboard/screen-reader/reset/privacy cases cho password visibility. |
| `#70` | Infra Google OAuth callback phải được cấu hình để Continue with Google đăng nhập thật trên môi trường deploy. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact`, `needs-human-clarification` | Requirements, test plan, test cases, automation, environment checklist | Thêm coverage cho OAuth callback/env readiness; cần xác nhận vì `#70` closed nhưng backend wiring `#71` vẫn open. |
| `#71` | Backend BetterAuth cần bật Google social provider trong service-api cho operator login. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, automation, security | Thêm coverage backend social login, callback, session, error, tenant/operator security. |
| `#72` | Frontend Continue with Google phải gọi BetterAuth social sign-in thay vì chỉ là button trang trí. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, automation, security | Thêm case OAuth start, redirect, cancel/error, config thiếu, disabled state, regression. |

### Issue đổi trạng thái sang closed

Các issue `#18`-`#32`, `#34`, `#45`, `#51`, `#59` đã đổi từ `open` sang `closed`. Chúng vẫn ảnh hưởng requirement/test plan/testcase/automation vì tài liệu QA cần chuyển chúng từ trạng thái rủi ro/đang triển khai sang regression baseline.

| Nhóm ảnh hưởng | Issue | Hành động khuyến nghị |
| --- | --- | --- |
| Ingestion lớn, ingest mode, video catalog, crawl progress, cancellation, bounded batching | `#18`-`#32` | Giữ behavior requirement, cập nhật trạng thái/risk, đảm bảo testcase có thể execute như regression. |
| UI feedback/filter | `#21`, `#34` | Thêm hoặc xác nhận testcase UI visibility/filter. |
| Console UX & accessibility | `#45` | Chuyển sang regression baseline và giữ coverage accessibility rõ ràng. |
| Console backend API wiring | `#51` | Chuyển từ open risk sang regression/integration baseline. |
| Public site label correctness | `#59` | Thêm hoặc xác nhận testcase dùng creator/tenant label thật, không dùng synthetic label. |

### Khu vực requirement có thể bị ảnh hưởng

| Khu vực | Issue | Hành động |
| --- | --- | --- |
| Authentication / Google OAuth / BetterAuth | `#69`, `#70`, `#71`, `#72` | Bổ sung hoặc mở rộng requirement cho password visibility, OAuth start/callback/provider/session, lỗi config, security boundary. |
| Creator Console onboarding và UX | `#67`, `#68`, `#45` | Cập nhật requirement cho pipeline card visibility, onboarding consent, accessibility baseline. |
| Ingestion mode, catalog, crawl progress, cancellation, batching | `#18`-`#32`, `#34` | Chuyển các mục đã closed sang regression scope và đảm bảo testcase vẫn executable. |
| Console backend API wiring | `#51` | Cập nhật coverage API integration của console. |
| Public site/editor AI assistant | `#66` | Thêm requirement cho conversational assistant, previewable diff, accept/reject, safety constraint, failure state. |
| Public audience data correctness | `#59` | Chuyển behavior label thật sang regression baseline. |

### Ảnh hưởng test plan/testcase

- Thêm hoặc mở rộng module auth cho email/password visibility và Google OAuth login.
- Thêm module site-editor AI assistant với positive, negative, boundary, security, AI validation cases.
- Chuyển ingestion/catalog/crawl items đã closed sang regression baseline thay vì open implementation risk.
- Thêm dashboard UX cases cho pipeline card above-fold visibility và onboarding consent.
- Thêm/cập nhật public-site data correctness cases cho label thật thay synthetic placeholder.

### Ảnh hưởng automation

- Playwright UI automation: password visibility toggle, Continue with Google start/error states, onboarding consent, pipeline card visibility, public-site labels, site-editor assistant accept/reject flow.
- API/integration automation: BetterAuth Google provider config, callback handling, session creation, tenant/operator isolation, ingestion catalog/crawl state APIs.
- AI validation automation: site-editor Assistant nhận yêu cầu ngôn ngữ tự nhiên, sinh previewable diff, accept/reject; request độc hại hoặc ngoài scope phải bị từ chối hoặc giới hạn an toàn.

### Cần hỏi lại

| Issue | Câu hỏi |
| --- | --- |
| `#66` | Site-editor Assistant chính thức support những loại edit nào, và tiêu chí QA để đánh giá một generated diff là đúng/chấp nhận được là gì? |
| `#70`/`#71` | `#70` đã closed nhưng `#71` vẫn open. Google OAuth đã test được trên QA/deployed environment chưa, hay vẫn block đến khi backend provider wiring được merge vào main? |

### Quyết định không ảnh hưởng

Không có. Tất cả thay đổi phát hiện được đều thêm behavior mới hoặc chuyển PRD work đang mở sang regression baseline.

### Chưa update tài liệu ở bước này

File này chỉ là cổng phân loại impact. Requirement, test plan, test cases và traceability sẽ được update ở bước tiếp theo bằng `qa-ai-workflow/prd-sources/latest-ai-update-request.md`.
