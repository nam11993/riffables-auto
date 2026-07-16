# PRD Impact Classification: 20260713-093244

## Source

| Field | Value |
| --- | --- |
| Repository | `speedrun-labs/riffables-prd` |
| Sync report | `qa-ai-workflow/prd-sources/change-reports/issue-change-impact-20260713-093244.md` |
| Manual comparison report | `qa-ai-workflow/prd-sources/change-reports/manual-inventory-vs-sync-20260713-093244.md` |
| Previous source | `qa-ai-workflow/prd-sources/riffables-issues-inventory.md` |
| Current snapshot | `qa-ai-workflow/prd-sources/snapshots/issues-20260713-093244.json` |
| Impact JSON | `qa-ai-workflow/prd-sources/latest-issue-impact.json` |

## Summary

The sync run created the first machine snapshot, so the sync script reported no previous snapshot. This classification uses the earlier manual inventory from `2026-07-09` as the comparison baseline.

| Metric | Count |
| --- | ---: |
| Previously inventoried issues | 47 |
| Current synced issues | 64 |
| Newly seen issues | 17 |
| Removed issues | 0 |
| Existing status changes | 4 |
| Title-only changes | 1 |
| No-impact issues | 1 |
| Requirement-impact issues | 17 |
| Test-plan-impact issues | 20 |
| Test-case-impact issues | 20 |
| Automation-impact issues | 13 |
| Needs clarification | 2 |

## Issue Classification

| Issue | Change Summary | Classification | Impacted Artifact Types | Recommended Action |
| --- | --- | --- | --- | --- |
| `#49` | New closed task: CI guard prevents committed template `styles.css` drifting from source. | `test-case-impact`, `automation-impact` | Test cases, automation, regression report | Add regression/automation candidate for CSS build drift guard; no product requirement unless QA tracks build governance requirements. |
| `#50` | New open issue titled `Testcase` with attached test case file only. | `needs-human-clarification` | Report only until clarified | Ask whether this issue is an official PRD source, imported QA artifact, or should be ignored. |
| `#51` | New open epic: console must wire remaining backend APIs: hybrid search, schedules, site lifecycle, article editing, job status. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, automation, traceability | Add/update console backend API requirements and detailed test coverage. |
| `#52` | New closed task: Content search should use backend hybrid search instead of client-side filtering. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression | Update console search expectations and regression cases. |
| `#53` | New closed task: operators can create/manage recurring crawl schedules from console. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression | Add schedule UI and schedule CRUD coverage under ingestion/console. |
| `#54` | New closed task: operators can unpublish, discard draft changes, and delete a site. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression | Add site lifecycle requirements and tests. |
| `#55` | New closed task: operators can edit article content via existing backend APIs. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression | Add article edit/review coverage in creator console. |
| `#56` | New closed task: console surfaces job/queue status from backend. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression | Add job/queue visibility coverage and automation candidate. |
| `#57` | New closed task: remove orphan `/sites/temp` and `/sites/configuration` routes. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression | Add negative navigation/404 regression cases for orphan routes. |
| `#58` | New open epic: audience site must not show placeholder identity or stubbed chat. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, traceability | Add public audience identity/chat requirements and tests. |
| `#59` | New open task: replace synthetic guest/show labels with real creator/tenant data or omit them. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases | Add public site data correctness cases. |
| `#60` | New open task: wire real audience chat instead of `Echo` stub. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact`, `needs-human-clarification` | Requirements, test plan, test cases, automation | Add chat behavior coverage, but confirm oracle for real agent response quality. |
| `#61` | New closed task: published site can move to distinct `unpublished` state and be restored. | `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact` | Requirements, test plan, test cases, regression | Add public site lifecycle state requirements and tests. |
| `#62` | New open bug: backend semantic/hybrid search returns 500 while keyword works. | `test-plan-impact`, `test-case-impact`, `automation-impact` | Test plan risks, test cases, known issues, automation | Add known risk and negative/bug regression coverage for semantic/hybrid search. Existing search requirement remains valid. |
| `#63` | New closed task: editor cross-panel hover highlighting. | `requirement-impact`, `test-plan-impact`, `test-case-impact` | Requirements, test plan, test cases, regression | Add editor UX regression coverage. |
| `#64` | New closed task: inspector field hover/focus highlights matching canvas text. | `requirement-impact`, `test-plan-impact`, `test-case-impact` | Requirements, test plan, test cases, regression | Add inspector-to-canvas highlight regression coverage. |
| `#65` | New closed task: merge Hero tagline/count line and align inspector defaults. | `requirement-impact`, `test-plan-impact`, `test-case-impact` | Requirements, test plan, test cases, regression | Add editor inspector defaults/regression coverage. |
| `#17` | Existing issue changed from open to closed: published public site fix is now done. | `requirement-impact`, `test-plan-impact`, `test-case-impact` | Requirements, test plan, test cases | Move from open release risk to regression baseline/smoke coverage. |
| `#46` | Existing issue changed from open to closed: 24px tap target fix is now done. | `requirement-impact`, `test-plan-impact`, `test-case-impact` | Requirements, test plan, test cases | Move from open accessibility work to regression baseline. |
| `#47` | Existing issue changed from open to closed: View live site after publish is now done. | `requirement-impact`, `test-plan-impact`, `test-case-impact` | Requirements, test plan, test cases | Move from open publish UX work to regression baseline. |
| `#48` | Existing issue changed from open to closed: dashboard/editor heading structure is now done. | `requirement-impact`, `test-plan-impact`, `test-case-impact` | Requirements, test plan, test cases | Move from open accessibility work to regression baseline. |
| `#35` | Existing title changed only from hyphen to em dash. | `no-impact` | None | No artifact update needed unless normalizing title text. |

## Requirements Likely Affected

| Issue | Requirement Area | Action |
| --- | --- | --- |
| `#51` | `REQ-CONSOLE-*`, `REQ-SEARCH-*`, `REQ-PUBLIC-*`, ingestion schedule/job status | Add or expand console backend API requirements. |
| `#52` | Console/content search and search behavior | Add console-specific backend search requirement or extend search/public-site requirements. |
| `#53` | Ingestion schedules / creator console source management | Add recurring schedule requirements. |
| `#54`, `#61` | Public/site lifecycle | Add unpublish/discard/delete/unpublished state requirements. |
| `#55` | Creator console article editing | Add article edit requirements. |
| `#56` | Job/queue status visibility | Add console job status requirements. |
| `#57` | Console navigation/site routes | Add orphan route negative requirement or regression baseline. |
| `#58`, `#59`, `#60` | Public audience site and audience chat | Add public identity and real chat requirements. |
| `#62` | Search known issue | No new requirement unless tracking known defect state; keep existing search requirement. |
| `#63`, `#64`, `#65` | Site editor UX regression | Add editor UX regression requirements or extend builder requirements. |
| `#17`, `#46`, `#47`, `#48` | Existing public/a11y requirements | Update scope/status from active open work to regression baseline where appropriate. |

## Test Plan Likely Affected

| Issue | Test Plan Area | Action |
| --- | --- | --- |
| `#51` | Creator console, backend API wiring, automation candidates | Add new console backend API coverage. |
| `#52`, `#62` | Search strategy, risks, known issues, automation | Add console backend search and semantic/hybrid failure risk. |
| `#53`, `#56` | Ingestion/source management, environment/observability | Add schedules and job/queue status coverage. |
| `#54`, `#61` | Public site lifecycle | Add site lifecycle state coverage. |
| `#55` | Creator console curation/content editing | Add article editing coverage. |
| `#57` | Console navigation negative regression | Add orphan route 404 coverage. |
| `#58`, `#59`, `#60` | Public audience site, chat, data correctness | Add identity/chat coverage and clarify chat oracle. |
| `#63`, `#64`, `#65` | Site builder/editor regression | Add editor UX regression coverage. |
| `#17`, `#46`, `#47`, `#48` | Regression scope | Move closed tasks into regression baseline. |

## Test Cases Likely Affected

| Issue | Test Case Area | Action |
| --- | --- | --- |
| `#51` | `TC-CONSOLE-*`, `TC-SEARCH-*`, `TC-PUBLIC-*`, `TC-INGEST-*` | Add detailed cases for backend API wired UI flows. |
| `#52` | `TC-SEARCH-*`, `TC-CONSOLE-*` | Add console search uses backend hybrid search cases. |
| `#53` | `TC-INGEST-*`, `TC-CONSOLE-*` | Add create/edit/delete recurring schedule cases. |
| `#54`, `#61` | `TC-PUBLIC-*`, `TC-BUILDER-*`, site lifecycle cases | Add unpublish/discard/delete/unpublished/republish cases. |
| `#55` | `TC-CONSOLE-*`, curation/article cases | Add article edit/save/reload/permission cases. |
| `#56` | `TC-CONSOLE-*`, job status cases | Add job/queue status display and error state cases. |
| `#57` | `TC-CONSOLE-*`, route negative cases | Add `/sites/temp` and `/sites/configuration` 404/no fake data cases. |
| `#58`, `#59` | `TC-PUBLIC-*` | Add no placeholder guest/show identity cases. |
| `#60` | `TC-PUBLIC-*`, audience chat cases | Add real chat, no Echo stub, tenant-scoped answer cases. |
| `#62` | `TC-SEARCH-*` | Add bug regression for semantic/hybrid 500 and known risk. |
| `#63`, `#64`, `#65` | `TC-BUILDER-*` | Add editor cross-panel highlight, inspector highlight, hero/default text cases. |
| `#17`, `#46`, `#47`, `#48` | Existing `TC-PUBLIC-*`, `TC-A11Y-*` | Update status/scope to regression baseline. |

## Automation Impact

| Issue | Area | Impact | Recommended Action |
| --- | --- | --- | --- |
| `#49` | CI/build guard | CSS build drift should be enforced by automation. | Add automation candidate or CI check reference. |
| `#51` | Console API wiring | Several UI flows now depend on backend API behavior. | Add UI/API automation candidates per task. |
| `#52`, `#62` | Search API/UI | Search automation needs semantic/hybrid paths and known 500 regression. | Add API tests for keyword/semantic/hybrid and UI wiring checks. |
| `#53` | Schedules API/UI | Schedule CRUD needs API/UI tests. | Add schedule fixture and CRUD automation candidates. |
| `#54`, `#61` | Site lifecycle | Publish/unpublish/discard/delete need state-machine tests. | Add lifecycle API/UI automation candidates. |
| `#55` | Article editing | Edit/save/reload paths need UI/API checks. | Add article edit automation candidate. |
| `#56` | Job status | Queue status may need mocked/controlled backend state. | Add automation later with fixtures or test hooks. |
| `#57` | Routing | Orphan route removal is stable for automation. | Add route 404 smoke. |
| `#58`, `#59`, `#60` | Audience site/chat | Needs UI/API tests, but chat quality oracle must be confirmed. | Automate no-placeholder/no-Echo checks first; keep quality manual or dataset-based. |

## No-Impact Decisions

| Issue | Reason |
| --- | --- |
| `#35` | Title punctuation changed only. Existing behavior and acceptance criteria are unchanged. |

## Needs Human Clarification

| Issue | Question | Owner | Blocking |
| --- | --- | --- | --- |
| `#50` | Is this issue an official PRD source, an imported QA testcase artifact, or should it be ignored by PRD sync? | QA/Product | yes |
| `#60` | What is the minimum pass/fail oracle for "real audience chat" beyond "not Echo"? Should QA use golden questions or only verify service-agent integration? | Product/Engineering/QA | yes |

## Recommended Update Order

1. Update master requirements and module requirement files for new issue groups `#51` to `#65`.
2. Reclassify `#17`, `#46`, `#47`, and `#48` as regression baseline where appropriate.
3. Update the master test plan scope, module coverage, risks, test data, and automation candidates.
4. Update unified execution test cases with new console API, public site/chat, site lifecycle, schedule, article edit, job status, and editor UX cases.
5. Update traceability and coverage audit.
6. Create QA review report documenting all artifact updates and unresolved questions.

