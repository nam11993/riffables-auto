# AI Impact Classification Request From PRD Sync
Use this immediately after running `Run PRD intake` and before updating requirements, test plans, test cases, or traceability.
Input files:
- Change report: `qa-ai-workflow/prd-sources/change-reports/issue-change-impact-20260723-145842.md`
- Latest impact JSON: `qa-ai-workflow/prd-sources/latest-issue-impact.json`
- Latest issues snapshot: `qa-ai-workflow/prd-sources/latest-issues.json`
- Previous issues snapshot: `qa-ai-workflow/prd-sources/snapshots/issues-previous-for-20260723-145842.json`
- Current timestamped snapshot: `qa-ai-workflow/prd-sources/snapshots/issues-20260723-145842.json`
Output file to create:
- Impact classification report: `qa-ai-workflow/reports/prd-change-reviews/impact-classification-20260723-145842.md`
Task:
1. Read the change report and impact JSON.
2. Compare previous and current snapshots for every new, changed, or removed issue.
3. Explain what changed in product behavior, acceptance criteria, scope, priority, risk, data, environment, wording, or implementation signal.
4. Classify each issue using one or more of: no-impact, requirement-impact, test-plan-impact, test-case-impact, automation-impact, needs-human-clarification.
5. Identify impacted local artifacts from latest-issue-impact.json and from source issue references.
6. Do not update requirements, test plans, test cases, or traceability in this classification step.
7. Write the classification report to the output path above.
Current run summary:
- New issues: 2
- Changed issues: 3
- Removed issues: 0
Classification report must include:
- Issue number and title.
- Change summary.
- Impact classification.
- Impacted artifact types: requirements, test plan, test cases, automation, traceability, report only, or none.
- Recommended action.
- Needs confirmation questions.
- Explicit no-impact decisions.
- A Vietnamese translation section at the bottom using heading: `## Báº£n dá»‹ch tiáº¿ng Viá»‡t`.
- The Vietnamese section must translate the summary, issue classification, affected areas, automation impact, clarification questions, no-impact decisions, and recommended update order.
