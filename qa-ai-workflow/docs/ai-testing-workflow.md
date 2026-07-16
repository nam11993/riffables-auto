# Quy Trình AI Testing Từ PRD Đến Report

Tài liệu này ghi lại nội dung định hướng từ đoạn chat khởi tạo project.

## 1. Không bắt đầu bằng automation

Điểm bắt đầu đúng là xây dựng một hệ thống lưu vết cho QA, gọi là **QA AI System of Record**.

Nếu đi thẳng từ PRD sang automation, rủi ro thường gặp là:

- Requirement chưa rõ nhưng test đã được sinh ra.
- Test case không trace được về PRD.
- PRD đổi nhưng automation không biết cần đổi gì.
- Bug report thiếu context.
- QA team không kiểm soát được artifact do AI tạo.

Vì vậy, thứ tự nên là:

```text
PRD -> Requirements -> Traceability -> Test Plan -> Test Cases -> Review -> Execution/Automation -> Bug -> Report
```

## 2. Luồng end-to-end

1. PRD được lưu trên GitHub.
2. AI đọc PRD và chuẩn hóa requirement.
3. AI tạo requirement list có ID.
4. AI tạo Requirement Traceability Matrix.
5. AI tạo test plan.
6. AI tạo test case.
7. QA review và approve.
8. AI hoặc QA chọn automation candidate.
9. Test được chạy manual hoặc automation.
10. Bug được log theo template.
11. Report được tổng hợp.
12. Khi PRD đổi, AI detect thay đổi, phân tích impact và đề xuất update artifact.

## 3. Artifact cần lưu

| Artifact | Nơi lưu | Mục đích |
| --- | --- | --- |
| PRD source | `prd-sources/` | Lưu link hoặc snapshot PRD |
| Requirement | `requirements/` | Chuẩn hóa yêu cầu từ PRD |
| Test plan | `test-plans/` | Strategy, scope, risk, effort |
| Test cases | `test-cases/` | Manual cases và automation candidates |
| Automation | `automation/` | Script hoặc hướng dẫn automation |
| Bug report | `bug-reports/` | Bug theo format thống nhất |
| Test report | `reports/` | Kết quả test theo milestone/build |
| Traceability | `traceability/` | Map requirement-test-bug |
| Prompts | `prompts/` | Prompt chuẩn cho từng vai trò AI |
| Templates | `templates/` | Form mẫu để tạo artifact |

## 4. Chuẩn ID

Chuẩn ID cần được đặt ngay từ đầu:

```text
REQ-<MODULE>-001
TC-<MODULE>-001
BUG-<MODULE>-001
```

Ví dụ cho module Authentication:

```text
REQ-AUTH-001
TC-AUTH-001
BUG-AUTH-001
```

Mỗi bug nên map được:

```text
BUG-AUTH-001 -> TC-AUTH-003 -> REQ-AUTH-001
```

## 5. Human review gate

AI nên hỗ trợ tạo draft, không tự approve.

Các gate nên có:

- Requirement review
- Test plan review
- Test case review
- Automation review
- Bug report review nếu bug được AI draft
- Report review trước khi gửi stakeholder

## 6. Khi PRD thay đổi

GitHub nên là trigger chính.

Khi PRD có commit/PR mới:

1. Detect changed sections.
2. Compare với phiên bản trước.
3. Xác định requirement bị ảnh hưởng.
4. Xác định test case cần thêm/sửa/xóa.
5. Xác định automation bị ảnh hưởng.
6. Tạo change impact report.
7. Tạo PR update artifact để QA review.

Không nên để AI tự ghi đè toàn bộ test case cũ nếu chưa có review.

## 7. Automation strategy

Chỉ nên automation khi test case:

- Stable.
- High-value.
- Lặp lại thường xuyên.
- Thuộc regression.
- Có expected result rõ.
- Có test data/environment kiểm soát được.

Không nên automation các case còn thay đổi liên tục hoặc phụ thuộc nhiều vào judgment thủ công.

## 8. POC đầu tiên

POC nên nhỏ:

```text
1 feature nhỏ
1 PRD thật trên GitHub
1 file requirements.yaml
1 file test-plan.md
1 file test-cases.yaml
1 file traceability.md
```

Mục tiêu của POC là chứng minh:

- AI đọc PRD được.
- Requirement có ID rõ.
- Test case trace được về requirement.
- PRD đổi thì phát hiện được impact.
- QA review được output thay vì phải làm lại từ đầu.

