# Onboarding Automation Flow Mapping

## Mục đích

Tài liệu này ánh xạ từng test automation onboarding về đúng ID trong
`qa-ai-workflow/test-cases/riffables-master.test-cases.md`.

Testcase master vẫn là system of record cho test steps, expected result và trạng thái từng case.
File này chỉ mô tả cách Playwright tổ chức flow và fixture.

## Scripts

```text
automation/tests/console/home.spec.ts
automation/tests/console/onboarding.spec.ts
```

## Lệnh chạy

```powershell
pnpm run test:onboarding
```

## Kết quả staging gần nhất

| Trường | Giá trị |
| --- | --- |
| Ngày chạy | `2026-07-28` |
| Môi trường | `https://riffables.speedrunlabs.ai` |
| Browser | `Playwright Chromium` |
| Tổng | `20 testcase` |
| PASS thực tế | `11` |
| EXPECTED FAIL | `5` |
| BLOCKED/SKIPPED | `4` |
| Runner result | `16 passed, 4 skipped, 0 unexpected failed` |

## Mapping theo testcase

| Testcase | Kết quả | Flow đã chạy |
| --- | --- | --- |
| `TC-ONBOARD-001` | PASS | Chọn new-user, kiểm tra tour first-visit riêng cho Sources, Home, Content và Sites. |
| `TC-ONBOARD-002` | EXPECTED FAIL | Help replay hoạt động; đóng tour bằng X nhưng seen state không được giữ khi reload/revisit. |
| `TC-ONBOARD-003` | EXPECTED FAIL | Đi đủ 6 bước editor và Help replay; completion không được giữ sau reload. |
| `TC-ONBOARD-004` | PASS | Kiểm tra `1 of N` -> Next -> `2 of N` -> Back -> `1 of N`. |
| `TC-ONBOARD-005` | EXPECTED FAIL | Tạo Creator A/B trong cùng browser context; identity flow chạy được nhưng Creator A bị tour nag lại. |
| `TC-ONBOARD-006` | EXPECTED FAIL | Tour first-visit hiển thị nhưng tự mở lại sau khi đóng, revisit và refresh. |
| `TC-ONBOARD-007` | PASS | Tạo account/organization mới, xử lý checklist overlay và xác nhận consent có hai lựa chọn. |
| `TC-ONBOARD-008` | EXPECTED FAIL | Sau khi đóng checklist, consent không ổn định trên Home nên new-user tour không luôn chạy ngay tại màn hiện tại. |
| `TC-ONBOARD-009` | PASS | Returning-user chặn auto tour trên bốn màn và editor; Help replay vẫn hoạt động. |
| `TC-ONBOARD-010` | PASS | Đóng consent không chọn, reload và consent được hỏi lại. |
| `TC-ONBOARD-011` | BLOCKED | Cần browser fixture có completed Home-tour key từ trước consent rule. |
| `TC-ONBOARD-012` | PASS | Editor tuân theo returning-user decision và vẫn cho replay bằng Help. |
| `TC-ONBOARD-013` | PASS | Tenant mới `0 source / 0 riff / 0 site` tự mở checklist `0 of 3 done`. |
| `TC-ONBOARD-014` | PASS | Ba bước đúng thứ tự; Connect a source đi tới `/sources`; click không làm step tự complete. |
| `TC-ONBOARD-015` | BLOCKED | Cần tenant có thể chuyển trạng thái empty -> source -> site và cleanup an toàn. |
| `TC-ONBOARD-016` | BLOCKED | Cần source đã connect, còn video fresh eligible và được phép queue crawl. |
| `TC-ONBOARD-017` | PASS | Maybe later/Close lưu dismissal; Getting started mở lại đúng progress. |
| `TC-ONBOARD-018` | PASS | Workspace Baohan đã hoàn tất ba signal không tự mở checklist sau load/reload. |
| `TC-ONBOARD-019` | BLOCKED | Cần Operator A ở hai tenant và Operator B cùng truy cập Tenant A. |
| `TC-ONBOARD-020` | PASS | Checklist giữ nguyên progress qua Help tour và không tạo request polling riêng có tên onboarding/checklist. |

## Fixture và mutation guard

Các case tạo creator mới dùng:

```text
HOME_SIGNUP_EMAIL_PREFIX
HOME_SIGNUP_EMAIL_DOMAIN
HOME_SIGNUP_PASSWORD
```

Các case transition/queue/tenant isolation chỉ chạy khi đủ fixture và cờ mutation tương ứng:

```text
ONBOARD_PARTIAL_EMAIL
ONBOARD_PARTIAL_PASSWORD
ONBOARD_STATE_MUTATION_ENABLED
ONBOARD_GRANDFATHERED_EMAIL
ONBOARD_GRANDFATHERED_PASSWORD
ONBOARD_GRANDFATHERED_CONFIRMED
ONBOARD_QUEUED_EMAIL
ONBOARD_QUEUED_PASSWORD
ONBOARD_CRAWL_MUTATION_ENABLED
ONBOARD_COMPLETED_EMAIL
ONBOARD_COMPLETED_PASSWORD
ONBOARD_MULTI_TENANT_EMAIL
ONBOARD_MULTI_TENANT_PASSWORD
ONBOARD_SECOND_OPERATOR_EMAIL
ONBOARD_SECOND_OPERATOR_PASSWORD
```

`ONBOARD_CONSENT_EXPECTED_XFAIL` và `ONBOARD_TOUR_SEEN_EXPECTED_XFAIL` giữ các lỗi staging hiện tại ở trạng thái expected-fail. Khi sản phẩm sửa xong, đặt cờ thành `false`; nếu behavior đã pass, Playwright sẽ báo unexpected pass để QA gỡ baseline lỗi.
