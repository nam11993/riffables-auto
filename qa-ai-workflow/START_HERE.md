# Bắt Đầu Từ Link PRD

Bạn chỉ cần đi theo file này trước. Các thư mục khác để dùng dần sau.

## Hiện đang ở bước nào?

Hiện tại workflow đang ở bước:

```text
PRD issues -> curated master requirements -> QA review -> test plan -> test cases
```

File requirement chính để đi tiếp là:

```text
qa-ai-workflow/requirements/riffables-master.requirements.yaml
```

Các file requirement theo module vẫn dùng để đọc acceptance criteria chi tiết, nhưng file master là nơi quyết định requirement nào được đưa vào test plan/test case.

## Bạn đang có gì?

Bạn đang có link:

```text
https://github.com/speedrun-labs/riffables-prd/issues
```

Đây là link danh sách issue. Trong workflow này, mỗi issue có thể là một PRD hoặc một phần requirement.

## Với project Riffables này, bắt đầu ở đâu?

Mình đã đọc và sắp xếp issues thành inventory tại:

```text
qa-ai-workflow/prd-sources/riffables-issues-inventory.md
```

POC đầu tiên nên dùng cụm:

```text
Controlled ingestion for large channels
```

File nguồn POC:

```text
qa-ai-workflow/prd-sources/controlled-ingestion-poc.prd.link.md
```

Thứ tự đọc:

```text
#18 -> #19/#20/#22 -> #23-#32
```

## Trước khi review requirement: sync PRD mới nhất

Trước mỗi vòng review requirement/test plan/test case, chạy:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-prd-issues.ps1
```

Nếu repo GitHub private, set token trước:

```powershell
$env:GITHUB_TOKEN = "<github-token-with-repo-read>"
powershell -ExecutionPolicy Bypass -File .\scripts\sync-prd-issues.ps1
```

Script sẽ tạo change impact report trong:

```text
qa-ai-workflow/prd-sources/change-reports/
```

Sau đó AI dùng prompt này để phân tích và update tài liệu bị ảnh hưởng:

```text
qa-ai-workflow/prompts/08-impact-update-assistant.md
```

AI sẽ tạo QA review report tại:

```text
qa-ai-workflow/reports/prd-change-reviews/
```

Đọc thêm:

```text
qa-ai-workflow/docs/prd-sync-command.md
```

## Bước 1: Chọn một issue cụ thể

Mở link trên và chọn một issue cần test trước.

Ưu tiên chọn:

- Feature nhỏ.
- Requirement rõ.
- Ít phụ thuộc module khác.
- Có thể test manual trước.

Ví dụ link cần có dạng:

```text
https://github.com/speedrun-labs/riffables-prd/issues/1
```

## Bước 2: Lưu link issue vào `prd-sources`

Tạo file:

```text
qa-ai-workflow/prd-sources/<feature-name>.prd.link.md
```

Nội dung:

```md
# PRD: <Feature Name>

- PRD link: <github-issue-url>
- Feature: <feature-name>
- Source: GitHub Issue
- Status: Draft
```

## Bước 3: Tạo requirements

Dùng prompt:

```text
qa-ai-workflow/prompts/01-requirement-analyst.md
```

Input cho AI:

- Link issue PRD.
- Nội dung issue PRD.
- Tên feature.

Output lưu vào:

```text
qa-ai-workflow/requirements/<feature-name>.requirements.yaml
```

## Bước 4: QA review requirements

Trước khi tạo test case, kiểm tra:

- Requirement có đúng với PRD không.
- Requirement có thiếu acceptance criteria không.
- Có requirement nào mơ hồ không.
- ID đã đúng format chưa, ví dụ `REQ-AUTH-001`.

## Bước 5: Tạo test plan và test cases

Sau khi requirements ổn mới đi tiếp:

```text
qa-ai-workflow/test-plans/<feature-name>.test-plan.md
qa-ai-workflow/test-cases/<feature-name>.test-cases.yaml
qa-ai-workflow/traceability/<feature-name>.traceability.md
```

## Tạm thời chỉ cần nhớ

```text
Issue PRD cụ thể
-> requirements.yaml
-> QA review
-> test-plan.md
-> test-cases.yaml
-> traceability.md
```
