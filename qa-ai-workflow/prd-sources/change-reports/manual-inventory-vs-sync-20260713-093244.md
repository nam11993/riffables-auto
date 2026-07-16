# Manual Inventory vs PRD Sync Comparison

## Metadata

| Field | Value |
| --- | --- |
| Previous local source | `qa-ai-workflow/prd-sources/riffables-issues-inventory.md` |
| Previous read date | `2026-07-09` |
| Current generated source | `qa-ai-workflow/prd-sources/riffables-issues-inventory.generated.md` |
| Current sync timestamp | `2026-07-13 09:32:44 +07:00` |
| Current snapshot | `qa-ai-workflow/prd-sources/snapshots/issues-20260713-093244.json` |

## Summary

The sync script did not calculate a diff because it had no previous machine snapshot. However, the project still has a manual inventory from the earlier PRD read. Comparing that manual inventory with the new generated inventory shows real PRD movement.

| Metric | Previous manual inventory | Current sync |
| --- | ---: | ---: |
| Total issues | 47 | 64 |
| Open issues | 36 | 38 |
| Closed issues | 11 | 26 |
| New issue numbers | 0 | 17 |
| Removed issue numbers | 0 | 0 |
| Status changes on existing issues | 0 | 4 |
| Title-only changes on existing issues | 0 | 1 |

## Issues Read In Previous Manual Inventory

```text
#1, #2, #3, #4, #5, #6, #7, #8, #9, #10,
#11, #12, #13, #14, #15, #16, #17, #18, #19, #20,
#21, #22, #23, #24, #25, #26, #27, #28, #29, #30,
#31, #32, #34, #35, #36, #37, #38, #39, #40, #41,
#42, #43, #44, #45, #46, #47, #48
```

Issue `#33` was not present in either inventory.

## Newly Seen Issues In Current Sync

| Issue | State | Title | Initial Impact Read |
| --- | --- | --- | --- |
| #49 | closed | Task: Guard against template styles.css drifting from source | Likely regression/automation maintenance impact. |
| #50 | open | Testcase | Needs human clarification before using as PRD source. |
| #51 | open | Epic: Console - wire the remaining backend APIs | Requirement/test plan/test case impact for console API wiring. |
| #52 | closed | Task: Use the backend hybrid search instead of client-side filtering | Search requirement/test case impact; likely regression baseline. |
| #53 | closed | Task: Add a UI for recurring crawl schedules | Ingestion/schedule UI requirement and testcase impact. |
| #54 | closed | Task: Wire site unpublish, discard, and delete | Public/site lifecycle requirement and testcase impact. |
| #55 | closed | Task: Let operators edit articles | Console/content editing requirement and testcase impact. |
| #56 | closed | Task: Surface job/queue status in the console | Console ingestion status requirement and testcase impact. |
| #57 | closed | Task: Remove the orphan /sites/temp and /sites/configuration routes | Console navigation regression impact. |
| #58 | open | Epic: Audience site - no placeholder identity or stubbed chat | Public audience site requirement/test plan/test case impact. |
| #59 | open | Task: Replace the synthetic guest/show labels on the audience site | Public site data correctness testcase impact. |
| #60 | open | Task: Wire the real audience chat (replace the Echo stub) | Audience chat requirement/testcase impact. |
| #61 | closed | Task: Operator takes a published site offline with a distinct 'unpublished' state | Site lifecycle regression requirement/testcase impact. |
| #62 | open | Bug: backend semantic/hybrid search returns 500 (keyword works) | Bug/risk impact for search testing; may affect execution report and known issue tracking. |
| #63 | closed | Task: Implement Editor Cross-Panel Highlighting | Editor UX regression testcase impact. |
| #64 | closed | Task: Link inspector fields to their text on the canvas (hover/focus highlight) | Editor/inspector UX regression testcase impact. |
| #65 | closed | Task: Merge the Hero tagline + count line and align inspector defaults | Site editor/inspector regression testcase impact. |

## Existing Issues With Status Changes

| Issue | Previous State | Current State | Title | Initial Impact Read |
| --- | --- | --- | --- | --- |
| #17 | open | closed | Task: Fix Published Public Site | Move from open release risk to regression baseline/public site smoke. |
| #46 | open | closed | Task: Meet the 24px minimum tap-target size | Move accessibility item from open release work to regression baseline. |
| #47 | open | closed | Task: Offer a 'View live site' action right after publishing | Move publish UX item from open release work to regression baseline. |
| #48 | open | closed | Task: Give dashboard screens and the editor a real heading structure | Move heading/a11y item from open release work to regression baseline. |

## Existing Issue With Title-Only Change

| Issue | Previous Title | Current Title | Initial Impact Read |
| --- | --- | --- | --- |
| #35 | Epic: Visual site builder - bind sections to live catalog data | Epic: Visual site builder — bind sections to live catalog data | No behavior impact; punctuation/title formatting only. |

## Recommended Next AI Update Step

Use this report together with:

```text
qa-ai-workflow/prd-sources/latest-issues.json
qa-ai-workflow/prd-sources/latest-issue-impact.json
qa-ai-workflow/prd-sources/change-reports/issue-change-impact-20260713-093244.md
```

Recommended update order:

1. Analyze new issues `#49` to `#65`.
2. Analyze status changes for `#17`, `#46`, `#47`, and `#48`.
3. Classify each item as `no-impact`, `requirement-impact`, `test-plan-impact`, `test-case-impact`, `automation-impact`, or `needs-human-clarification`.
4. Update impacted requirements first.
5. Update impacted test plan next.
6. Update impacted test cases after requirements/test plan are stable.
7. Update traceability and create a QA review report.
