# PRD Issue Change Impact Report

- Synced at: 2026-07-23 14:58:42 +07:00
- Repository: speedrun-labs/riffables-prd
- Current snapshot: `qa-ai-workflow/prd-sources/snapshots/issues-20260723-145842.json`
- Previous snapshot: `qa-ai-workflow/prd-sources/snapshots/issues-previous-for-20260723-145842.json`
- Previous snapshot found: true

## Summary

| Type | Count |
| --- | ---: |
| Total issues | 73 |
| Open issues | 21 |
| Closed issues | 52 |
| New issues | 2 |
| Changed issues | 3 |
| Removed issues | 0 |

## Browser Intake Normalization

This run used the authenticated browser session because GitHub token/API access was unavailable. The diff ignores GitHub UI-only lines (`Create sub-issue`, `Last edited by ...`) and whitespace-only rendering changes so formatting noise does not become requirement churn.

## New Issues

| Issue | State | Title |
| --- | --- | --- |
| [#73](https://github.com/speedrun-labs/riffables-prd/issues/73) | closed | Task: [frontend] Set or reset a password — account Settings + forgot-password |
| [#74](https://github.com/speedrun-labs/riffables-prd/issues/74) | open | Epic: Operator image asset library — images for site & article content |

## Changed Issues

| Issue | State | Changed fields | Title |
| --- | --- | --- | --- |
| [#66](https://github.com/speedrun-labs/riffables-prd/issues/66) | closed | state, labels | Task: Conversationally edit the public site with the builder agent (wire the site-editor Assistant) |
| [#70](https://github.com/speedrun-labs/riffables-prd/issues/70) | open | state | Task: [infra] Register the BetterAuth Google callback so Continue-with-Google goes live |
| [#71](https://github.com/speedrun-labs/riffables-prd/issues/71) | closed | state | Task: [backend] Wire BetterAuth Google social provider (socialProviders.google) for operator login |

## Impacted Local Artifacts

| Issue | Local files to review |
| --- | --- |
| #66 Task: Conversationally edit the public site with the builder agent (wire the site-editor Assistant) | qa-ai-workflow/requirements/riffables-master.requirements.yaml<br>qa-ai-workflow/requirements/site-builder-onboarding.requirements.yaml<br>qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md |
| #70 Task: [infra] Register the BetterAuth Google callback so Continue-with-Google goes live | qa-ai-workflow/requirements/creator-console.requirements.yaml<br>qa-ai-workflow/requirements/riffables-master.requirements.yaml<br>qa-ai-workflow/test-plans/riffables-master.test-plan.md<br>qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md |
| #71 Task: [backend] Wire BetterAuth Google social provider (socialProviders.google) for operator login | qa-ai-workflow/requirements/creator-console.requirements.yaml<br>qa-ai-workflow/requirements/riffables-master.requirements.yaml<br>qa-ai-workflow/test-plans/riffables-master.test-plan.md<br>qa-ai-workflow/test-cases/riffables-master.test-cases.md<br>qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md |
| #73 Task: [frontend] Set or reset a password — account Settings + forgot-password | _No current local artifact references this issue._ |
| #74 Epic: Operator image asset library — images for site & article content | _No current local artifact references this issue._ |

## Recommended Update Order

1. Review changed GitHub issues.
2. Update impacted requirement files first.
3. Update impacted test plans next.
4. Update impacted test cases after requirements and test plan are stable.
5. Update traceability last.

Do not overwrite approved artifacts without review.

---

## Bản dịch tiếng Việt

### Tóm tắt

- Thời điểm đồng bộ: 2026-07-23 14:58:42 +07:00
- Repository: speedrun-labs/riffables-prd
- Snapshot hiện tại: `qa-ai-workflow/prd-sources/snapshots/issues-20260723-145842.json`
- Snapshot trước đó: `qa-ai-workflow/prd-sources/snapshots/issues-previous-for-20260723-145842.json`
- Có snapshot trước đó: true

| Loại | Số lượng |
| --- | ---: |
| Tổng số issue | 73 |
| Issue đang mở | 21 |
| Issue đã đóng | 52 |
| Issue mới | 2 |
| Issue có thay đổi | 3 |
| Issue bị xóa/không còn thấy | 0 |

### Ghi chú chuẩn hóa browser intake

Lần chạy này dùng session browser đã đăng nhập vì token/API GitHub không truy cập được. Diff đã bỏ qua dòng chỉ thuộc UI GitHub (`Create sub-issue`, `Last edited by ...`) và các khác biệt chỉ do whitespace/rendering, để tránh biến nhiễu format thành thay đổi requirement.

### Issue mới

| Issue | Trạng thái | Tiêu đề |
| --- | --- | --- |
| [#73](https://github.com/speedrun-labs/riffables-prd/issues/73) | closed | Task: [frontend] Set or reset a password — account Settings + forgot-password |
| [#74](https://github.com/speedrun-labs/riffables-prd/issues/74) | open | Epic: Operator image asset library — images for site & article content |

### Issue có thay đổi

| Issue | Trạng thái | Trường thay đổi | Tiêu đề |
| --- | --- | --- | --- |
| [#66](https://github.com/speedrun-labs/riffables-prd/issues/66) | closed | state, labels | Task: Conversationally edit the public site with the builder agent (wire the site-editor Assistant) |
| [#70](https://github.com/speedrun-labs/riffables-prd/issues/70) | open | state | Task: [infra] Register the BetterAuth Google callback so Continue-with-Google goes live |
| [#71](https://github.com/speedrun-labs/riffables-prd/issues/71) | closed | state | Task: [backend] Wire BetterAuth Google social provider (socialProviders.google) for operator login |

### Thứ tự update khuyến nghị

1. Review các GitHub issue đã thay đổi.
2. Update requirement trước.
3. Update test plan sau requirement.
4. Update test case sau khi requirement và test plan ổn định.
5. Update traceability cuối cùng.

Không ghi đè tài liệu đã approve nếu chưa review.