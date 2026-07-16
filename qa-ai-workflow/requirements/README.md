# Requirements

Lưu requirement đã chuẩn hóa từ PRD.

## File chính để đi tiếp

Từ bước này, dùng file sau làm master requirement catalog cho toàn bộ dự án:

```text
qa-ai-workflow/requirements/riffables-master.requirements.yaml
```

File này không thay thế các file theo module. Nó dùng để:

- lọc requirement thật sự dùng được cho test plan/test case;
- loại `REQ-GLOBAL-*` khỏi nguồn sinh test case chi tiết vì đó là governance/quality gate;
- chia requirement thành release scope, regression baseline, và item cần confirm;
- chỉ rõ file module nào cần đọc để lấy acceptance criteria đầy đủ.

Bản review dễ đọc cho QA/Product:

```text
qa-ai-workflow/requirements/riffables-master.review.md
```

## Current Status

Toàn bộ PRD issues đã được tách thành requirement draft theo module.

| Module | File | Source issues | Status |
| --- | --- | --- | --- |
| Global context / QA baseline | `global-context.requirements.yaml` | #11, #12, #42 | Draft |
| Ingestion Pipeline V1 | `ingestion-pipeline.requirements.yaml` | #6, #1 | Draft |
| Controlled Ingestion POC | `controlled-ingestion.requirements.yaml` | #18, #19, #20, #22, #23-#32 | Draft |
| AI extraction / citation / re-extraction | `ai-extraction-citation.requirements.yaml` | #7, #2, #3 | Draft |
| Search / Public audience site | `search-public-site.requirements.yaml` | #8, #4, #16, #14, #17 | Draft |
| Creator console / curation UI | `creator-console.requirements.yaml` | #15, #13, #21, #34 | Draft |
| Site builder / onboarding regression | `site-builder-onboarding.requirements.yaml` | #35-#41, #43, #44 | Draft |
| Accessibility / UX hardening | `accessibility-ux.requirements.yaml` | #45-#48 | Draft |
| Theme customization | `theme-customization.requirements.yaml` | #9, #5 | Draft |
| Tenant security | `tenant-security.requirements.yaml` | #10 | Draft |

## Next Step

Review requirement draft trước khi tạo test case:

1. Confirm requirement ID/module naming.
2. Resolve `open_questions`.
3. Mark approved requirements.
4. Generate test plan and test cases from approved requirements.
