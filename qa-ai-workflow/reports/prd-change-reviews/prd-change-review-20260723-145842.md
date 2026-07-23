# PRD Change Review: 20260723-145842

## Metadata

| Field | Value |
| --- | --- |
| PRD intake | `qa-ai-workflow/prd-sources/change-reports/issue-change-impact-20260723-145842.md` |
| AI classification | `qa-ai-workflow/reports/prd-change-reviews/impact-classification-20260723-145842.md` |
| Update timestamp | `2026-07-23` |
| Review state | `Draft for QA review` |

## Files Updated By AI

| Artifact | Update Summary |
| --- | --- |
| `qa-ai-workflow/requirements/creator-console.requirements.yaml` | Added `#73`, added `REQ-CONSOLE-013`, changed Google OAuth wording for `#70/#71`, moved `REQ-CONSOLE-010` to regression baseline. |
| `qa-ai-workflow/requirements/search-public-site.requirements.yaml` | Added `#74`, added `REQ-PUBLIC-007` to `REQ-PUBLIC-009` for operator image upload/library/isolation. |
| `qa-ai-workflow/requirements/site-builder-onboarding.requirements.yaml` | Updated `#66` title/status and changed `REQ-BUILDER-006` to regression baseline. |
| `qa-ai-workflow/requirements/riffables-master.requirements.yaml` | Updated intake version/date, scope counts, source issue lists, and master requirement set from `74` to `78`. |
| `qa-ai-workflow/test-plans/riffables-master.test-plan.md` | Added password reset-link and image asset library coverage, datasets, risks, and automation candidates. |
| `qa-ai-workflow/test-cases/riffables-master.test-cases.md` | Added `TC-AUTH-053` to `TC-AUTH-060` and `TC-PUBLIC-025` to `TC-PUBLIC-034`; updated review-note counts to `418` cases. |
| `qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md` | Updated coverage counts, matrix rows, and added `2026-07-23 PRD Update Coverage`. |

## Added Requirements

| Requirement | Source | Purpose |
| --- | --- | --- |
| `REQ-CONSOLE-013` | `#73` | Add/change/forgot password via BetterAuth reset-link flow, including Google-only accounts and trusted origins. |
| `REQ-PUBLIC-007` | `#74` | Supported image uploads return permanent public URLs for site/article content. |
| `REQ-PUBLIC-008` | `#74` | Image library validates files, de-duplicates identical uploads, and supports label/pagination metadata. |
| `REQ-PUBLIC-009` | `#74` | Image library is tenant/operator-isolated and soft remove preserves existing embeds. |

## Added Test Cases

| Range | Count | Coverage |
| --- | ---: | --- |
| `TC-AUTH-053` to `TC-AUTH-060` | 8 | Google-only Add password, password-account Change password, reset token completion, invalid token, Forgot-password visibility, trusted origins, no forced Google password. |
| `TC-PUBLIC-025` to `TC-PUBLIC-034` | 10 | Supported uploads, public URL, embed use, oversize rejection, invalid type/SVG rejection, duplicate upload, newest-first library, label/alt edit, pagination, soft remove, cross-operator isolation. |

## QA Review Checklist

| Review Item | Why It Matters |
| --- | --- |
| Confirm `REQ-CONSOLE-013` wording and test scope. | Existing forgot/change cases existed, but `#73` adds Google-only Add password and reset-token details that should be reviewed before approval. |
| Confirm mailbox/test-token strategy. | Full add/change/forgot password completion cannot be executed without email capture or a controlled token fixture. |
| Confirm `#70` environment status. | `#71` is closed, but full Google OAuth E2E should remain blocked if callback/trusted-origin readiness from `#70` is not confirmed. |
| Confirm image asset API routes and URL pattern. | `#74` is backend/library scope; test cases need stable upload/list/update/remove routes or a UI surface that maps to them. |
| Confirm ownership rule for images. | PRD says per-operator and tenant-isolated; QA needs to know expected behavior for multiple operators inside one tenant. |
| Confirm soft-remove behavior. | Removing from library must not break already-embedded public content, so QA needs a disposable published embed fixture. |

## Ghi Chú Review Tiếng Việt

- Đã chạy xong `Run PRD intake` và phát hiện 2 issue mới (`#73`, `#74`) cùng 3 issue đổi trạng thái (`#66`, `#70`, `#71`).
- Bước `Update` đã được thực hiện: requirement, test plan, testcase và traceability đã được cập nhật để QA review.
- Không tự động approve. Các case mới đang ở `Draft`, QA cần review trước khi đưa vào execution/automation.
- Tổng requirement trong master tăng từ `74` lên `78`.
- Tổng testcase trong unified suite hiện là `418`.
- Phần cần QA/Product/Engineering confirm tiếp: mailbox reset password, Google callback/trusted origins cho `#70`, image asset API route/public URL/ownership rule cho `#74`.
