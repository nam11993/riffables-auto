# PRD Change QA Review: 20260728-135317

## Source

| Field | Value |
| --- | --- |
| Repository | `speedrun-labs/riffables-prd` |
| Sync report | `qa-ai-workflow/prd-sources/change-reports/issue-change-impact-20260728-135317.md` |
| Previous snapshot | `qa-ai-workflow/prd-sources/snapshots/issues-previous-for-20260728-135317.json` |
| Current snapshot | `qa-ai-workflow/prd-sources/snapshots/issues-20260728-135317.json` |
| Impact JSON | `qa-ai-workflow/prd-sources/latest-issue-impact.json` |
| Classification | `qa-ai-workflow/reports/prd-change-reviews/impact-classification-20260728-135317.md` |

## Summary

| Metric | Count |
| --- | ---: |
| New issues | 15 |
| Changed issues | 73 |
| Removed issues | 0 |
| Product/QA artifact files updated | 9 |
| Requirements added | 10 |
| Existing requirements materially changed | 2 |
| Test cases added | 48 |
| Existing test case rows changed | 2 |
| Total included requirements after update | 88 |
| Total test cases after update | 466 |
| Items needing clarification | 6 |

## Issue Impact Analysis

| Issue | Change Summary | Classification | Decision |
| --- | --- | --- | --- |
| `#70` | OAuth callback issue moved from open to closed. | requirement, test plan, automation | Updated requirement assumptions/status and OAuth regression wording; no execution pass inferred. |
| `#75` to `#84` | New shipped site-template, template-integrity, FAQ/podcast, navigation, section-style, preset, and image-picker behavior. | requirement, test plan, test case, automation | Added detailed builder requirements and atomic test cases. |
| `#85`, `#86` | New open data-driven Home checklist behavior. | requirement, test plan, test case, automation | Added checklist requirement, fixtures, and eight atomic cases. |
| `#87`, `#89` | New shipped builder-composer image attachment behavior. | requirement, test plan, test case, automation | Added attachment lifecycle/validation requirements and eight executable draft cases. |
| `#88` | New V1.1 builder-agent image-understanding behavior with undefined transport. | requirement, test plan, test case, automation, needs clarification | Added requirement and four detailed cases; full execution remains blocked pending transport/oracle. |
| Other changed issues | Snapshot source changed from rendered GitHub pages to GitHub API. | no-impact | No bulk rewrite; product behavior did not change. |

## Requirements Updated

| Requirement ID | Action | Source Issue | Notes |
| --- | --- | --- | --- |
| `REQ-CONSOLE-009` | changed | `#70`, `#72` | Assumption now treats Google frontend/provider/callback issues as closed regression baseline. |
| `REQ-CONSOLE-011` | changed | `#70` | Status changed from `needs_confirmation` to `regression_baseline_draft`; QA environment questions remain. |
| `REQ-BUILDER-007` | added | `#75`, `#77` | Two rendered templates, schema selection, and persistence. |
| `REQ-BUILDER-008` | added | `#75`, `#79`, `#81` | Template data/link/control/editor-public parity and preview navigation. |
| `REQ-BUILDER-009` | added | `#80` | FAQ accordion and per-track podcast links. |
| `REQ-BUILDER-010` | added | `#76`, `#82`, `#83` | Per-section style controls, prefill, isolation, tokens, and full labels. |
| `REQ-BUILDER-011` | added | `#74`, `#84` | Operator-scoped image picker instead of manual URL. |
| `REQ-BUILDER-012` | added | `#75`, `#78` | Named preset/token-only builder-agent styling. |
| `REQ-BUILDER-013` | added | `#87`, `#89` | Attach/paste/thumbnail/remove/image-only/sent-message lifecycle. |
| `REQ-BUILDER-014` | added | `#87`, `#89` | Type/size validation, upload completion, asset reuse, dedup, and failure handling. |
| `REQ-BUILDER-015` | added | `#88` | Image-grounded agent behavior and conversation/tenant isolation. |
| `REQ-ONBOARD-004` | added | `#85`, `#86` | Real-state checklist progression, queued-crawl completion, dismiss/reopen, retirement, and isolation. |

## Test Plans Updated

| Test Plan | Action | Source Issue | Notes |
| --- | --- | --- | --- |
| `qa-ai-workflow/test-plans/riffables-master.test-plan.md` | changed | `#70`, `#75` to `#89` | Scope/counts/ranges, execution order, module coverage, data sets, entry criteria, risks, and automation candidates updated. |

## Test Cases Updated

| Test Case ID | Action | Source Issue | Notes |
| --- | --- | --- | --- |
| `TC-AUTH-018`, `TC-AUTH-019` | changed | `#70` | Removed stale "blocked until #71" wording; retained QA environment fixture dependency. |
| `TC-BUILDER-047` to `TC-BUILDER-074` | added | `#75` to `#84` | Two-template, integrity, FAQ/podcast, navigation, style, image-picker, and preset coverage. |
| `TC-BUILDER-075` to `TC-BUILDER-082` | added | `#87`, `#89` | Attachment lifecycle, validation, upload resilience, persistence, and placement. |
| `TC-BUILDER-083` to `TC-BUILDER-086` | added | `#88` | Visual grounding, reference action, isolation, and unreadable-image honesty. |
| `TC-ONBOARD-013` to `TC-ONBOARD-020` | added | `#85`, `#86` | Checklist auto-open, sequence, state, queued crawl, dismissal, completion, isolation, tours, and polling. |

No existing test case ID was renumbered, moved to an addendum, or marked Pass/Fail without execution.

## Automation Impact

| Area | Impact | Recommended Action |
| --- | --- | --- |
| Google OAuth | PRD callback issue is closed; existing E2E cases can become regular regression in a configured environment. | Confirm QA callback host, credentials, trusted origins, and disposable Google accounts before execution. |
| Site templates | Requires two versioned template fixtures and disposable create/publish cleanup. | Automate read-only selection/schema/persistence first, then guarded publish parity. |
| Template integrity/navigation | Requires page map, catalog probes, screenshot tolerance, and stable Preview/Edit selectors. | Automate structural/link assertions; approve image tolerance separately. |
| Section styling/image picker | Requires manifest defaults, token map, long labels, asset fixture, and draft cleanup. | Use reversible edits and assert unaffected sections/theme. |
| Checklist | Requires controlled Home snapshots plus scoped localStorage and request counting. | Seed/intercept empty/partial/queued/completed states and test user/tenant switching. |
| Attachments | Requires image fixtures, clipboard injection, delayed/failed uploads, asset-list observation, and cleanup. | Reuse existing asset helper/API and keep one assertion scope per testcase. |
| Image understanding | Requires a confirmed image-read API/tool trace and deterministic visual golden images. | Keep `TC-BUILDER-083` to `086` blocked until Engineering confirms the oracle. |

## No-Impact Decisions

| Issue | Reason |
| --- | --- |
| `#1` to `#69`, excluding `#33` and `#70`; `#71` to `#74` | Differences are caused by rendered-page versus API snapshot normalization. Product behavior and acceptance criteria are unchanged or were already incorporated in the 2026-07-23 update. |
| `#42`, `#50` | Administrative QA artifact issues, not new product requirements. |

## Needs Confirmation

| Question | Owner | Blocking |
| --- | --- | --- |
| Which QA environment/callback host and Google accounts should run full OAuth regression? | QA/Engineering | No for documentation; yes for OAuth execution |
| What are the exact IDs/manifests and named presets for both shipped templates? | Product/Engineering | Yes for deterministic automation |
| What viewports and screenshot tolerance define editor/public parity? | QA/Design | Yes for visual automation |
| What is the attachment upload retry/cancel behavior after failure? | Product/Engineering | No for base validation; yes for final resilience oracle |
| What Home control and localStorage key contract reopen/store checklist state? | Product/Engineering | Yes for stable checklist automation |
| What API/tool transports image bytes to the builder agent, and what trace proves the image was read? | Engineering/Product | Yes for `REQ-BUILDER-015` execution |

## Files Changed

- `qa-ai-workflow/requirements/creator-console.requirements.yaml`
- `qa-ai-workflow/requirements/site-builder-onboarding.requirements.yaml`
- `qa-ai-workflow/requirements/riffables-master.requirements.yaml`
- `qa-ai-workflow/requirements/riffables-master.review.md`
- `qa-ai-workflow/requirements/requirements-status.md`
- `qa-ai-workflow/test-plans/riffables-master.test-plan.md`
- `qa-ai-workflow/test-cases/riffables-master.test-cases.md`
- `qa-ai-workflow/test-cases/README.md`
- `qa-ai-workflow/traceability/riffables-master.testcase-coverage-audit.md`

## QA Review Checklist

- [x] Requirement changes match the classified PRD issue changes.
- [x] No unrelated module was rewritten.
- [x] Existing requirement and test case IDs were preserved.
- [x] Test plan impact is documented.
- [x] Test case impact is documented.
- [x] Open questions are assigned.
- [x] All 88 included requirements are referenced by test cases.
- [x] All 466 test case IDs are unique and continuous within each prefix.
- [ ] QA/Product/Engineering review and approve the new behavior/oracles.
