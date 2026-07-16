# QA AI Workflow

Thư mục này là nơi lưu toàn bộ artifact của quy trình AI testing: PRD source, requirement, test plan, test case, automation, bug report, test report, traceability và prompt.

## Cấu trúc

```text
qa-ai-workflow/
  prd-sources/
  requirements/
  test-plans/
  test-cases/
  automation/
  bug-reports/
  reports/
  traceability/
  prompts/
  templates/
  docs/
```

## Nguyên tắc vận hành

1. GitHub PRD là nguồn sự thật ban đầu.
2. AI chỉ tạo bản nháp; QA review là gate bắt buộc.
3. Mọi artifact phải có ID ổn định.
4. Mọi test case phải trace về ít nhất một requirement.
5. Mọi bug phải trace về test case hoặc requirement liên quan.
6. Khi PRD thay đổi, không update thủ công mù mờ; phải tạo impact analysis trước.

## Vai trò AI nên tách nhỏ

| Vai trò | Nhiệm vụ |
| --- | --- |
| Requirement Analyst | Đọc PRD, chuẩn hóa requirement, phát hiện thiếu/không rõ |
| Test Planner | Tạo test strategy, scope, risk, estimation |
| Test Designer | Sinh test case manual và gợi ý automation candidate |
| Automation Assistant | Đề xuất hoặc viết automation cho case ổn định |
| Bug Assistant | Chuẩn hóa bug report, reproduction step, expected/actual |
| Report Assistant | Tổng hợp test execution, coverage, defect, risk |
| Change Impact Analyst | So sánh PRD mới/cũ và đề xuất artifact cần update |

## Quy trình POC khuyến nghị

Chọn một feature nhỏ, ví dụ Login hoặc Search.

1. Lưu PRD gốc vào `prd-sources/`.
2. Tạo `requirements/<feature>.requirements.yaml`.
3. Tạo `test-plans/<feature>.test-plan.md`.
4. Tạo `test-cases/<feature>.test-cases.yaml`.
5. Tạo `traceability/<feature>.traceability.md`.
6. QA review và chỉnh lại artifact.
7. Chọn vài test case stable/high-value để automation.
8. Khi PRD đổi, chạy prompt change impact và tạo PR update artifact.

## Definition of Done cho mỗi feature

- Requirement đã có ID và trạng thái rõ ràng.
- Test plan đã xác định scope, out-of-scope, risk, environment.
- Test case có priority, type, step, expected result.
- Traceability map đầy đủ từ requirement đến test case.
- Automation candidate được đánh dấu nhưng chưa bắt buộc phải automate.
- Bug/report theo template thống nhất.
- Mọi thay đổi từ PRD mới được review trước khi merge.

