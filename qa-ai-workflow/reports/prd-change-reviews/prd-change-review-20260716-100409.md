# PRD Change Update Review: 20260716-100409

## Source

| Field | Value |
| --- | --- |
| Update request | `qa-ai-workflow/prd-sources/change-reports/ai-update-request-20260716-100409.md` |
| Impact classification | `qa-ai-workflow/reports/prd-change-reviews/impact-classification-20260716-100409.md` |
| Change report | `qa-ai-workflow/prd-sources/change-reports/issue-change-impact-20260716-100409.md` |
| Snapshot | `qa-ai-workflow/prd-sources/snapshots/issues-20260716-100409.json` |
| Update status | `Draft updated for QA review` |

## Summary

AI updated the impacted QA artifacts after the 2026-07-16 PRD intake. The update adds newly detected PRD behavior from issues `#66` to `#72`, moves closed issues `#18` to `#32`, `#34`, `#45`, `#51`, and `#59` into regression baseline coverage, and keeps unresolved areas as review questions instead of silently approving them.

| Artifact Area | Result |
| --- | --- |
| Requirements | Updated from `64` to `74` included product requirements. |
| Test plan | Updated scope, coverage summary, execution order, module plans, datasets, and risks. |
| Test cases | Updated from `236` to `276` execution-level draft cases. |
| Traceability | Updated coverage audit to `74/74` requirements and `276` cases. |
| QA approval | Still required. This update is not an approval gate. |

## Requirements Updated

| File | Update |
| --- | --- |
| `qa-ai-workflow/requirements/riffables-master.requirements.yaml` | Updated source date, counts, scope split, impacted issue mapping, and added `REQ-CONSOLE-007` to `REQ-CONSOLE-012`, `REQ-BUILDER-006`, `REQ-ONBOARD-003`, `REQ-PUBLIC-005`, and `REQ-PUBLIC-006`. |
| `qa-ai-workflow/requirements/creator-console.requirements.yaml` | Added pipeline card visibility, password visibility, Google OAuth frontend/provider/callback requirements, and console backend API wiring. |
| `qa-ai-workflow/requirements/site-builder-onboarding.requirements.yaml` | Added site-editor Assistant previewable diff requirement and onboarding consent requirement. |
| `qa-ai-workflow/requirements/search-public-site.requirements.yaml` | Added real public label requirement and audience chat real-agent requirement. |
| `qa-ai-workflow/requirements/controlled-ingestion.requirements.yaml` | Marked latest PRD intake and clarified `#18` to `#32` are now P0 regression baseline. |
| `qa-ai-workflow/requirements/accessibility-ux.requirements.yaml` | Marked latest PRD intake and clarified `#45` is now accessibility regression baseline. |

## Test Plan Updated

| Area | Update |
| --- | --- |
| Scope | Updated to `33` release-scope requirements and `41` regression-baseline requirements. |
| Foundation/auth | Added password visibility and Google OAuth start/provider/callback readiness. |
| Controlled ingestion | Reclassified as P0 regression baseline while keeping all executable behavior. |
| Public site | Added real labels and audience chat real-agent coverage. |
| Creator console | Added pipeline visibility and backend API wiring coverage. |
| Site builder/onboarding | Added site-editor Assistant diff coverage and onboarding consent coverage. |
| Test data plan | Added Google OAuth environment, public label, audience chat, Assistant prompt, and onboarding consent datasets. |

## Test Cases Added

| Group | Added IDs | Coverage |
| --- | --- | --- |
| Auth | `TC-AUTH-013` to `TC-AUTH-022` | Password visibility, accessibility, Google OAuth start/error/callback/new user/existing user/cancel/config/account-linking security. |
| Public site | `TC-PUBLIC-014` to `TC-PUBLIC-021` | Real labels, missing labels, tenant label isolation, interaction regression, audience chat non-Echo response, chat tenant scope, safe chat errors, chat citations. |
| Creator console | `TC-CONSOLE-015` to `TC-CONSOLE-022` | Pipeline card visibility, metric integrity, backend hybrid search, schedules, site lifecycle, article editing, job status, fake route removal. |
| Site builder Assistant | `TC-BUILDER-012` to `TC-BUILDER-019` | Supported diff, accept/reject, ambiguous/unsupported prompts, malicious prompt, tenant/field boundaries, large/conflicting prompts. |
| Onboarding | `TC-ONBOARD-007` to `TC-ONBOARD-012` | First-visit consent, new-user flow, returning-user flow, dismiss/re-offer, grandfathered user, editor honoring consent. |

## Traceability Updated

| File | Update |
| --- | --- |
| `qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md` | Updated counts, module coverage, and added a `2026-07-16 PRD Update Coverage` table mapping issue IDs to requirement IDs and testcase IDs. |
| `qa-ai-workflow/test-cases/riffables-master.test-cases.md` | Metadata updated to `74/74` requirements and `276` test cases with consistent execution schema. |

## QA Review Needed

| Area | Question |
| --- | --- |
| Site-editor Assistant `#66` | Confirm supported edit operations, allowed diff fields, and the pass/fail oracle for generated diffs. |
| Google OAuth `#70` to `#72` | Confirm whether full Google OAuth round-trip is testable now while backend issue `#71` was still open in the latest intake. |
| Google OAuth environment | Confirm callback host, OAuth secrets, `BETTER_AUTH_URL`, trusted origins, and expected session cookie domain. |
| Public labels and chat `#59` | Confirm source fields for guest/show/bio labels and the QA oracle for real audience chat responses. |
| Pipeline card `#67` | Confirm the standard desktop viewport used for above-fold validation. |
| Console backend wiring `#51` | Confirm exact UI ownership for job/queue status and schedules. |

## Decision

Do not mark the updated artifacts as approved yet. They are ready for QA/Product/Engineering review and can be used as the next draft input for formal requirement approval and test execution planning.
