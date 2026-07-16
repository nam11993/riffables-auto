# Riffables Master Requirements Review

Nguồn chính:

```text
qa-ai-workflow/requirements/riffables-master.requirements.yaml
```

## Mục đích

File này giúp QA/Product/Engineering review nhanh bộ requirement thật sự của toàn dự án trước khi viết test plan và test case.

Các file draft theo module vẫn giữ nguyên để chứa acceptance criteria chi tiết. File master là nơi quyết định requirement nào được đưa vào test design.

## Kết luận lọc requirement

| Nhóm | Số lượng | Cách dùng |
| --- | ---: | --- |
| Included requirements | 74 | Dùng để viết test plan/test case |
| Release scope | 33 | Ưu tiên P0/P1 khi viết test plan |
| Regression baseline | 41 | Viết regression/smoke sau release scope |
| Governance requirements | 4 | Không sinh test case trực tiếp |

`REQ-GLOBAL-*` không phải requirement rác, nhưng không nên dùng để sinh test case chi tiết. Nhóm này dùng cho coverage governance và release quality gate.

## Scope theo module

| Priority | Module | Scope | Requirement IDs | Source file |
| --- | --- | --- | --- | --- |
| P0 | Tenant security | Release | `REQ-TENANT-001` to `REQ-TENANT-004` | `tenant-security.requirements.yaml` |
| P0 | Ingestion pipeline | Release | `REQ-INGEST-001` to `REQ-INGEST-006` | `ingestion-pipeline.requirements.yaml` |
| P0 | Controlled ingestion | Regression baseline | `REQ-INGEST-MODE-*`, `REQ-CATALOG-*`, `REQ-CRAWL-*` | `controlled-ingestion.requirements.yaml` |
| P0 | AI extraction/citation | Release | `REQ-AI-001` to `REQ-AI-006` | `ai-extraction-citation.requirements.yaml` |
| P0 | Search/public site | Mixed | `REQ-SEARCH-*`, `REQ-PUBLIC-*` | `search-public-site.requirements.yaml` |
| P1 | Creator console | Mixed | `REQ-CONSOLE-001` to `REQ-CONSOLE-012` | `creator-console.requirements.yaml` |
| P1 | Theme customization | Release | `REQ-THEME-001` to `REQ-THEME-005` | `theme-customization.requirements.yaml` |
| P1 | Accessibility/UX | Regression baseline | `REQ-A11Y-001` to `REQ-A11Y-005` | `accessibility-ux.requirements.yaml` |
| P1/P2 | Site builder/onboarding | Mixed | `REQ-BUILDER-001` to `REQ-BUILDER-006`, `REQ-ONBOARD-001` to `REQ-ONBOARD-003` | `site-builder-onboarding.requirements.yaml` |

## Review checklist trước test plan

- Requirement ID có ổn định và dễ trace không.
- Requirement có mô tả hành vi test được không.
- `must/should/could` có đúng với mức ưu tiên release không.
- Requirement nào cần test data/golden dataset.
- Requirement nào cần API/test hook từ Engineering.
- Open question nào phải resolve trước khi viết test case chi tiết.

## Gợi ý bước tiếp theo

Sau khi chấp nhận file master ở trạng thái draft-for-review, bước tiếp theo là tạo:

```text
qa-ai-workflow/test-plans/riffables-master.test-plan.md
```

Test plan nên viết theo thứ tự:

1. Tenant security
2. Ingestion pipeline
3. Controlled ingestion
4. AI extraction/citation
5. Search/public site
6. Creator console
7. Theme customization
8. Accessibility/UX
9. Site builder/onboarding regression
