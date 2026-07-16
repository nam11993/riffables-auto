# AI Impact Classification Request From PRD Sync

Use this immediately after PRD sync and before updating requirements, test plans, test cases, automation, or traceability.

## Input Files

| Input | Path |
| --- | --- |
| Sync change report | `qa-ai-workflow/prd-sources/change-reports/issue-change-impact-20260713-093244.md` |
| Manual inventory comparison | `qa-ai-workflow/prd-sources/change-reports/manual-inventory-vs-sync-20260713-093244.md` |
| Latest impact JSON | `qa-ai-workflow/prd-sources/latest-issue-impact.json` |
| Latest issues snapshot | `qa-ai-workflow/prd-sources/latest-issues.json` |
| Current timestamped snapshot | `qa-ai-workflow/prd-sources/snapshots/issues-20260713-093244.json` |

## Output File To Create

```text
qa-ai-workflow/reports/prd-change-reviews/impact-classification-20260713-093244.md
```

## Task

1. Read the input files.
2. Use the manual inventory comparison because this sync run created the first machine snapshot.
3. Classify newly seen issues `#49` to `#65`.
4. Classify status changes for `#17`, `#46`, `#47`, and `#48`.
5. Classify title-only change for `#35`.
6. Do not update requirements, test plans, test cases, or traceability in this step.
7. Write the classification report to the output file above.

## Classification Values

```text
no-impact
requirement-impact
test-plan-impact
test-case-impact
automation-impact
needs-human-clarification
```

