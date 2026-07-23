# PRD Impact Classification: 20260723-145842

## Metadata

| Field | Value |
| --- | --- |
| PRD repository | `speedrun-labs/riffables-prd` |
| Intake snapshot | `qa-ai-workflow/prd-sources/snapshots/issues-20260723-145842.json` |
| Impact source | `qa-ai-workflow/prd-sources/latest-issue-impact.json` |
| Generated at | `2026-07-23 14:58:42 +07:00` |
| AI update decision | `Update affected artifacts, then QA review` |

## Classification Summary

| Issue | Change Type | Impact Level | Affected Areas | AI Update Action |
| --- | --- | --- | --- | --- |
| `#66` Site-editor Assistant | State/label change: open to closed | Medium | Site builder, Assistant diff, regression tracking | Update requirement status and audit wording. No new testcase needed. |
| `#70` BetterAuth Google callback | State change: closed/open to open | High | Google OAuth callback, trusted origins, full round-trip readiness | Update open dependency/risk language. Keep full OAuth tests environment-gated. |
| `#71` BetterAuth Google provider | State change: open to closed | Medium | Google OAuth backend provider regression | Move provider requirement to regression baseline. Keep E2E gated by #70. |
| `#73` Password reset/add/change | New closed issue | High | Auth, Account Settings, forgot password, reset token security | Add `REQ-CONSOLE-013`, expand auth test plan, add detailed `TC-AUTH-053` to `TC-AUTH-060`. |
| `#74` Operator image asset library | New open issue | High | Public site/article assets, upload API/library, tenant isolation | Add `REQ-PUBLIC-007` to `REQ-PUBLIC-009`, expand public/site test plan, add `TC-PUBLIC-025` to `TC-PUBLIC-034`. |

## Detailed Classification

### `#66` Site-editor Assistant

The functional scope was already represented by `REQ-BUILDER-006` and existing builder/Assistant cases. The issue moving to closed changes its lifecycle classification from release/draft to regression baseline. The correct update is status/risk wording, not a new testcase set.

Affected artifacts:

- `qa-ai-workflow/requirements/site-builder-onboarding.requirements.yaml`
- `qa-ai-workflow/requirements/riffables-master.requirements.yaml`
- `qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md`

### `#70` Google OAuth Callback

The issue is open in the latest intake, so QA should not mark full Google OAuth round-trip as generally ready from PRD alone. Frontend start/error-state tests and backend provider tests remain valid, but deployed callback/origin confirmation stays an open dependency.

Affected artifacts:

- `qa-ai-workflow/requirements/creator-console.requirements.yaml`
- `qa-ai-workflow/requirements/riffables-master.requirements.yaml`
- `qa-ai-workflow/test-plans/riffables-master.test-plan.md`
- `qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md`

### `#71` Google Provider

The backend provider issue is now closed. `REQ-CONSOLE-010` should be treated as regression baseline, but full E2E OAuth still depends on issue `#70`.

Affected artifacts:

- `qa-ai-workflow/requirements/creator-console.requirements.yaml`
- `qa-ai-workflow/requirements/riffables-master.requirements.yaml`
- `qa-ai-workflow/test-plans/riffables-master.test-plan.md`
- `qa-ai-workflow/test-cases/riffables-master.test-cases.md`
- `qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md`

### `#73` Password Reset, Add Password, Change Password

This is a new closed PRD issue with observable auth/security behavior. Existing forgot/change password cases covered only part of the request and token journey. The update needs a new requirement plus split test cases for Google-only Add password, existing-password Change password, reset-token form behavior, invalid-token state, sign-in-only Forgot password, trusted origins, and no forced password during Google sign-in.

Affected artifacts:

- `qa-ai-workflow/requirements/creator-console.requirements.yaml`
- `qa-ai-workflow/requirements/riffables-master.requirements.yaml`
- `qa-ai-workflow/test-plans/riffables-master.test-plan.md`
- `qa-ai-workflow/test-cases/riffables-master.test-cases.md`
- `qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md`

### `#74` Operator Image Asset Library

This is a new open PRD epic that adds backend/library behavior for operator-owned images used in site and article content. It is not the same as the existing editor media-panel UI baseline. The update needs requirements and API/library/security test cases for upload constraints, public URL, duplicate detection, library listing, labels/alt text, pagination, soft remove, and cross-operator isolation.

Affected artifacts:

- `qa-ai-workflow/requirements/search-public-site.requirements.yaml`
- `qa-ai-workflow/requirements/riffables-master.requirements.yaml`
- `qa-ai-workflow/test-plans/riffables-master.test-plan.md`
- `qa-ai-workflow/test-cases/riffables-master.test-cases.md`
- `qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md`

## Bản Dịch Tiếng Việt

### Tóm tắt phân loại

| Issue | Loại thay đổi | Mức ảnh hưởng | Phạm vi ảnh hưởng | Hành động update |
| --- | --- | --- | --- | --- |
| `#66` Site-editor Assistant | Đổi trạng thái sang closed | Trung bình | Site builder, Assistant diff, regression | Cập nhật status thành regression baseline, không cần thêm testcase mới. |
| `#70` BetterAuth Google callback | Đổi trạng thái thành open | Cao | Google OAuth callback, trusted origins, full round-trip | Cập nhật risk/open dependency, full OAuth vẫn bị gate bởi môi trường. |
| `#71` BetterAuth Google provider | Đổi trạng thái sang closed | Trung bình | Backend Google provider | Chuyển provider requirement thành regression baseline, E2E vẫn phụ thuộc #70. |
| `#73` Password reset/add/change | Issue mới đã closed | Cao | Auth, Account Settings, forgot password, reset token | Thêm `REQ-CONSOLE-013` và `TC-AUTH-053` đến `TC-AUTH-060`. |
| `#74` Operator image asset library | Issue mới đang open | Cao | Asset upload/library, public URL, tenant isolation | Thêm `REQ-PUBLIC-007` đến `REQ-PUBLIC-009` và `TC-PUBLIC-025` đến `TC-PUBLIC-034`. |

### Kết luận tiếng Việt

AI cần tham gia bước Update vì các thay đổi không chỉ là thêm/bớt text. Mỗi thay đổi cần được phân loại xem có ảnh hưởng requirement, test plan, testcase, traceability hay chỉ ảnh hưởng trạng thái/risk. Lần này AI đã xác định:

- `#66` chỉ cần cập nhật trạng thái thành regression baseline.
- `#70` làm Google OAuth full round-trip vẫn chưa được coi là sẵn sàng nếu chưa confirm callback/origin.
- `#71` đã ship backend provider nên cần giữ như regression baseline.
- `#73` cần bổ sung requirement và testcase auth chi tiết.
- `#74` cần bổ sung requirement và testcase backend/library/security cho image asset, không gộp nhầm với UI Media panel trong editor.
