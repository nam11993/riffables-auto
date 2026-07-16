# Project Context: QA AI Workflow

## Câu hỏi ban đầu

Người dùng muốn xây dựng một quy trình AI testing chuẩn từ đầu đến cuối cho dự án mà tài liệu PRD sẽ nằm trên GitHub công ty:

```text
PRD -> test plan -> test case -> test/automation -> log bug -> report
```

Ngoài ra, người dùng muốn có cách lưu trữ tài liệu và cập nhật mỗi lần có tài liệu mới hoặc PRD thay đổi.

## Định hướng đã thống nhất

Không bắt đầu bằng việc generate automation ngay. Điểm bắt đầu đúng là xây dựng một **QA AI System of Record**.

Hệ thống này cần lưu được:

- PRD source.
- Requirement đã chuẩn hóa.
- Test plan.
- Test case.
- Automation candidate/script.
- Bug report.
- Test report.
- Traceability matrix.
- Prompt chuẩn cho từng vai trò AI.

## Quy trình mục tiêu

```text
GitHub PRD
-> AI đọc và chuẩn hóa requirement
-> Requirement Traceability Matrix
-> Test Plan
-> Test Case
-> QA review/approve
-> Automation hoặc manual checklist
-> Chạy test
-> Log bug
-> Report
-> Khi PRD đổi thì detect impact và update artifacts
```

## Quyết định quan trọng

1. GitHub PRD là nguồn sự thật ban đầu.
2. Mọi requirement/test case/bug phải có ID ổn định.
3. Mọi test case phải trace được về requirement.
4. Mọi bug phải trace được về test case hoặc requirement.
5. AI chỉ tạo draft; QA review là gate bắt buộc.
6. Khi PRD thay đổi, AI cần tạo impact analysis trước khi sửa artifact.
7. Automation chỉ nên áp dụng cho case stable, high-value hoặc regression.

## Chuẩn ID

```text
REQ-<MODULE>-001
TC-<MODULE>-001
BUG-<MODULE>-001
```

Ví dụ:

```text
REQ-AUTH-001
TC-AUTH-001
BUG-AUTH-001
```

## Các vai trò AI

| Vai trò | Trách nhiệm |
| --- | --- |
| Requirement Analyst | Đọc PRD, tách requirement, phát hiện thiếu/không rõ |
| Test Planner | Tạo test plan, scope, risk, strategy |
| Test Designer | Tạo test case và automation candidate |
| Automation Assistant | Hỗ trợ viết automation có kiểm soát |
| Bug Assistant | Chuẩn hóa bug report |
| Report Assistant | Tổng hợp test report |
| Change Impact Analyst | Phân tích impact khi PRD thay đổi |

## POC đầu tiên nên làm

Chọn một feature nhỏ và chạy thử pipeline:

```text
PRD thật trên GitHub
-> requirements.yaml
-> test-plan.md
-> test-cases.yaml
-> traceability.md
```

Sau khi POC ổn mới nối sang automation, bug/report integration và dashboard.

## Việc cần làm tiếp theo

- Chọn một feature thật để làm POC.
- Thêm link PRD vào `qa-ai-workflow/prd-sources/`.
- Tạo requirement đầu tiên bằng prompt `01-requirement-analyst.md`.
- Review requirement cùng QA/Product.
- Sinh test plan và test cases từ artifact đã review.

