# PRD Impact Classification: 20260728-135317

## Source

| Field | Value |
| --- | --- |
| Repository | `speedrun-labs/riffables-prd` |
| Sync report | `qa-ai-workflow/prd-sources/change-reports/issue-change-impact-20260728-135317.md` |
| Previous snapshot | `qa-ai-workflow/prd-sources/snapshots/issues-previous-for-20260728-135317.json` |
| Current snapshot | `qa-ai-workflow/prd-sources/snapshots/issues-20260728-135317.json` |
| Impact JSON | `qa-ai-workflow/prd-sources/latest-issue-impact.json` |

## Summary

| Metric | Count |
| --- | ---: |
| New issues | 15 |
| Changed issues | 73 |
| Removed issues | 0 |
| No-impact issues | 72 |
| Requirement-impact issues | 16 |
| Test-plan-impact issues | 16 |
| Test-case-impact issues | 15 |
| Automation-impact issues | 16 |
| Needs clarification | 1 |

The previous snapshot was collected from rendered GitHub issue pages and lost Markdown structure, labels, timestamps, diagrams, and some characters. The current run used the GitHub API. That acquisition-format correction made 72 unchanged product issues appear modified. Those false-positive diffs must not trigger bulk artifact rewrites.

The meaningful scope is:

- Fifteen new PRD issues, `#75` through `#89`, covering templates, section styling, editor/public parity, FAQ and podcast links, image selection, first-run checklist, and builder-chat image attachments/vision.
- Issue `#70` changed from open to closed. Google callback/environment wiring is now a regression baseline instead of an open PRD dependency, although each QA environment still needs valid OAuth configuration.

## Issue Classification

| Issue | Change Summary | Classification | Impacted Artifact Types | Recommended Action |
| --- | --- | --- | --- | --- |
| `#70` Task: [infra] Register the BetterAuth Google callback so Continue-with-Google goes live | State changed from open to closed; implementation expectations remain the same. | `requirement-impact`, `test-plan-impact`, `automation-impact` | requirements, test plan, automation, traceability | Mark callback wiring as regression baseline and retain environment readiness checks for full OAuth round-trip execution. |
| `#75` Epic: Canvas site template - operators pick a second template, edit it, and publish it | Adds a two-template lifecycle from rendered selection preview through editor and public publish. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add template selection, persistence, editor/public parity, link, and preset coverage. |
| `#76` Epic: Section-level styling controls in the site editor | Adds scoped color, size, weight, button, default-value, and label behavior per section. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add atomic section-style control cases and isolation checks. |
| `#77` Task: Make a second site template selectable, editable, and rendered publicly | Defines rendered previews, per-template editor schema, persistence, and public rendering. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Cover both templates independently and publish the second-template fixture. |
| `#78` Task: Curated theme presets so the agent restyles with tokens, not free-form styling | Restricts builder-agent styling to named presets and template tokens. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add preset listing/application and free-form style refusal cases. |
| `#79` Task: Fix the shipped template's dead links, placeholder data, and editor-public style drift | Defines regression expectations for valid links, live data, working controls, and parity. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add separate checks for links, catalog data, control effects, and editor/public parity. |
| `#80` Task: Add an FAQ accordion section and per-track podcast links | Adds editable FAQ question/answer pairs, one-open-at-a-time interaction, and track-specific links. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add FAQ interaction/boundary and podcast-link cases. |
| `#81` Task: Follow in-app links in the editor preview instead of 404ing | Defines preview navigation for valid internal, missing internal, external, and edit-mode links. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add one atomic case per link behavior. |
| `#82` Task: Give sections colour, size, weight, and button controls with pre-filled defaults | Specifies real-value defaults and section-scoped style mutation. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Cover control presence, defaults, mutation, and unaffected-section assertions. |
| `#83` Task: Show section colour control labels under their real name, in full | Requires configured human-readable labels without abbreviation or clipping. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add UI and responsive label-visibility coverage. |
| `#84` Task: Pick an uploaded image for a section instead of pasting a URL | Replaces manual URL entry with upload-and-pick behavior in section image fields. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Link existing asset-library coverage to editor image picker cases. |
| `#85` Epic: First-run getting-started checklist for a new tenant | Adds a data-driven three-step checklist, auto-open, dismissal, completion, and per-user-per-tenant state. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add real-state progression and storage-isolation cases separate from product tours. |
| `#86` Task: Getting-started checklist on the console home | Implements the checklist by reusing home snapshot state without new polling. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add Home UI, routing, async queue completion, and no-extra-polling checks. |
| `#87` Epic: Attach an image to a builder-agent chat turn | Adds attach/paste/thumbnail/remove/image-only/send-wait/sent-message/place-image behavior. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add composer attachment lifecycle and asset-library integration cases. |
| `#88` Epic: The builder agent can see the images an operator attaches | Adds image understanding and action while enforcing conversation and tenant isolation. Transport is not finalized. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact`, `needs-human-clarification` | requirements, test plan, test cases, automation, traceability | Document expected behavior now; gate full automation on a stable image-read transport and deterministic visual fixtures. |
| `#89` Task: Attach and paste images in the assistant composer | Defines the shipped console composer implementation and reuse of asset upload constraints. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | requirements, test plan, test cases, automation, traceability | Add UI/API cases using PNG/JPEG/WebP/GIF and 10 MiB limits from `#74`. |

## Requirements Likely Affected

| Issue | Requirement Area | Action |
| --- | --- | --- |
| `#70` | `REQ-CONSOLE-009` to `REQ-CONSOLE-011` | Change issue-state assumptions from open dependency to closed regression baseline. |
| `#75` to `#84` | `REQ-BUILDER-*` | Add atomic requirements for multi-template, parity, links, FAQ/podcast, section styling, image picker, and token-only presets. |
| `#85`, `#86` | `REQ-ONBOARD-*` | Add a separate data-driven getting-started checklist requirement. |
| `#87`, `#89` | `REQ-BUILDER-*` | Add attachment composer lifecycle and validation/transport requirements. |
| `#88` | `REQ-BUILDER-*`, `REQ-TENANT-*` | Add image-understanding behavior and conversation/tenant isolation requirement with an implementation question. |

## Test Plan Likely Affected

| Issue | Test Plan Area | Action |
| --- | --- | --- |
| `#70` | Authentication/OAuth risk and regression scope | Move from open-PRD blocker to environment-dependent regression validation. |
| `#75` to `#84` | Site Builder, Assistant, And Onboarding Regression | Expand to multi-template, section styling, template integrity, preview navigation, FAQ/podcast, and image picker. |
| `#85`, `#86` | Onboarding | Add empty-tenant checklist fixtures and per-user-per-tenant state. |
| `#87` to `#89` | AI-assisted editing and security | Add attachment fixtures, upload boundaries, image-only turns, visual golden fixtures, and isolation. |

## Test Cases Likely Affected

| Issue | Test Case Area | Action |
| --- | --- | --- |
| `#75` to `#84` | `TC-BUILDER-*` | Append detailed cases without renumbering or moving existing cases. |
| `#85`, `#86` | `TC-ONBOARD-*` | Append checklist cases separate from tour-consent cases. |
| `#87` to `#89` | `TC-BUILDER-*` | Append composer attachment and vision cases with per-case automation status. |

## Automation Impact

| Issue | Area | Impact | Recommended Action |
| --- | --- | --- | --- |
| `#70` | Auth suite | Full OAuth callback can move to regression when environment secrets/redirect URI are available. | Keep environment guard; do not infer pass from issue closure. |
| `#75` to `#84` | Site/editor/public UI | New selectors, two-template fixtures, draft cleanup, publish fixture, and cross-surface assertions are required. | Automate stable read-only and reversible cases first; isolate publish mutation. |
| `#85`, `#86` | Home/onboarding UI | Requires empty, partial, queued, completed, dismissed, user-switched, and tenant-switched fixtures. | Seed or intercept the home snapshot and inspect localStorage keys/request count. |
| `#87`, `#89` | Builder composer + asset API | Requires valid/invalid image files, clipboard injection, upload waits, and sent-message assertions. | Reuse asset fixtures and clean up disposable uploads. |
| `#88` | Multimodal agent | Requires deterministic visual golden images and an observable image-read transport. | Keep full result evaluation gated until Engineering confirms transport and logs/API oracle. |

## No-Impact Decisions

| Issue | Reason |
| --- | --- |
| `#1` to `#69`, excluding `#33` and `#70` | Product behavior is unchanged. The current API snapshot restored Markdown, tables, diagrams, labels, timestamps, checkbox formatting, Unicode, and source links that the previous rendered-page snapshot lost. |
| `#71` to `#74` | Product behavior is unchanged. Differences are snapshot normalization only; these issues were already incorporated in the 2026-07-23 requirements, test plan, and test cases. |
| `#42` Test Plan and `#50` Testcase | These administrative issues reflect uploaded QA artifacts and formatting, not new product behavior. The local QA artifacts remain the system of record and are updated only from product-impacting issues. |

## Needs Human Clarification

| Issue | Question | Owner | Blocking |
| --- | --- | --- | --- |
| `#88` | What API/tool transports image bytes to the text-only builder-agent runtime, and what observable response/log proves the assistant read the attached image rather than guessed from text? | Engineering/Product | Yes, for full automation only |

## Recommended Update Order

1. Update Google OAuth issue-state assumptions in creator-console requirements.
2. Add builder and onboarding requirements for `#75` to `#89`.
3. Update the master requirement catalog and QA review summary.
4. Expand the master test plan, data, risks, and automation candidates.
5. Append atomic `TC-BUILDER-*` and `TC-ONBOARD-*` cases in the existing tables.
6. Update traceability coverage and create the QA review report.

---

## Bản dịch tiếng Việt

### Tóm tắt

Lần quét này tìm thấy 15 issue mới, 73 issue được báo thay đổi và không có issue bị xóa. Trong 73 issue cũ, 72 issue là diff giả do snapshot trước đọc từ giao diện GitHub nên mất Markdown, nhãn, thời gian cập nhật, sơ đồ và một số ký tự. Snapshot mới đọc bằng GitHub API nên đầy đủ hơn. Không được dùng 72 diff giả này để sửa hàng loạt requirement, test plan hay testcase.

Phạm vi thay đổi thật gồm:

- Các issue mới `#75` đến `#89`: template thứ hai, style theo từng section, đồng bộ editor với public site, FAQ, podcast link, image picker, checklist cho tenant mới, đính kèm ảnh trong Builder chat và khả năng AI nhìn ảnh.
- Issue `#70` đã chuyển từ open sang closed. Google OAuth callback trở thành regression baseline, nhưng mỗi môi trường QA vẫn phải có secret, trusted origin và redirect URI hợp lệ trước khi chạy full round-trip.

### Phân loại issue

| Issue | Tóm tắt thay đổi | Phân loại impact | Tài liệu bị ảnh hưởng | Hành động khuyến nghị |
| --- | --- | --- | --- | --- |
| `#70` | Callback Google OAuth đã đóng. | requirement, test plan, automation | requirement, test plan, traceability | Chuyển giả định từ issue đang mở sang regression baseline; vẫn kiểm tra cấu hình môi trường. |
| `#75`, `#77` | Cho phép chọn một trong hai template, sửa và publish đúng template đã chọn. | requirement, test plan, testcase, automation | builder artifacts | Bổ sung case cho preview, chọn template, lưu lựa chọn, mở lại editor và publish. |
| `#76`, `#82`, `#83` | Thêm style theo từng section, giá trị mặc định thật và nhãn đầy đủ. | requirement, test plan, testcase, automation | builder artifacts | Tách case cho từng control, prefill, phạm vi ảnh hưởng và hiển thị nhãn. |
| `#78` | Builder agent chỉ được dùng preset/token, không được style tự do. | requirement, test plan, testcase, automation | builder/theme artifacts | Test list/apply preset và từ chối free-form style. |
| `#79`, `#81` | Sửa dead link, placeholder, style drift và điều hướng trong preview. | requirement, test plan, testcase, automation | builder/public artifacts | Test riêng internal link, missing link, external link, edit mode, data thật và editor/public parity. |
| `#80` | Thêm FAQ accordion và link riêng cho từng podcast track. | requirement, test plan, testcase, automation | builder/public artifacts | Test CRUD dữ liệu FAQ, hành vi mở một answer và link track. |
| `#84` | Chọn ảnh đã upload thay vì nhập URL. | requirement, test plan, testcase, automation | builder/image artifacts | Liên kết asset library với image picker trong section. |
| `#85`, `#86` | Checklist ba bước dựa trên trạng thái thật của tenant. | requirement, test plan, testcase, automation | onboarding/home artifacts | Test auto-open, tiến độ, queued crawl, dismiss/reopen, hoàn tất và cách ly user/tenant. |
| `#87`, `#89` | Attach/paste/remove/send ảnh trong Builder composer. | requirement, test plan, testcase, automation | builder/asset artifacts | Test thumbnail, upload, image-only turn, validation, chờ upload và hiển thị message đã gửi. |
| `#88` | Builder agent phải thật sự đọc được ảnh và giữ cách ly conversation/tenant. | requirement, test plan, testcase, automation, cần làm rõ | builder/tenant artifacts | Viết requirement/testcase ngay; tạm chặn full automation đến khi có transport và oracle ổn định. |

### Khu vực requirement bị ảnh hưởng

- Cập nhật `REQ-CONSOLE-009` đến `REQ-CONSOLE-011` theo trạng thái closed của `#70`.
- Mở rộng `REQ-BUILDER-*` cho template, parity, link, FAQ/podcast, section style, image picker, preset, attachment và image vision.
- Mở rộng `REQ-ONBOARD-*` cho checklist khởi tạo tenant mới.
- Dùng `REQ-TENANT-*` làm ràng buộc bảo mật cho attachment và image vision.

### Khu vực test plan/testcase bị ảnh hưởng

- Test plan cần thêm fixture hai template, FAQ/podcast, style section, checklist, attachment và golden image.
- Testcase mới được nối tiếp trong chính bảng `TC-BUILDER-*` và `TC-ONBOARD-*`; không tách addendum và không đổi ID cũ.
- Mỗi case có precondition, test data, step, expected result, priority, automation candidate và status riêng.

### Ảnh hưởng automation

- Nhóm template/editor/public cần selector ổn định, fixture hai template và cleanup draft/publish.
- Nhóm checklist cần fixture tenant rỗng, tenant đang làm dở, crawl đã queued, tenant hoàn tất, nhiều user và nhiều tenant.
- Nhóm attachment cần file ảnh hợp lệ/không hợp lệ, thao tác clipboard, chờ upload và kiểm tra message sau khi gửi.
- Nhóm AI nhìn ảnh cần golden image cố định và một API/log chứng minh AI đã đọc ảnh. Chưa có hai điều này thì chỉ thiết kế case, chưa được đánh pass automation.

### Cần hỏi lại con người

`#88`: Engineering/Product cần xác nhận image transport nào đưa dữ liệu ảnh vào agent runtime dạng text-only và oracle nào chứng minh AI đã đọc ảnh thay vì đoán.

### Quyết định không ảnh hưởng

Các issue cũ `#1` đến `#69` (trừ `#33` không tồn tại và `#70`) cùng `#71` đến `#74` không có thay đổi hành vi sản phẩm. Diff chỉ do chuyển từ snapshot giao diện web sang GitHub API. Issue `#42` và `#50` là tài liệu QA hành chính, không phải requirement sản phẩm mới.

### Thứ tự update khuyến nghị

1. Cập nhật giả định Google OAuth.
2. Thêm requirement builder/onboarding.
3. Cập nhật master requirement và bản review.
4. Cập nhật test plan.
5. Thêm testcase theo đúng bảng và số thứ tự hiện có.
6. Cập nhật coverage/traceability và tạo báo cáo QA review.
