# AI Impact Classification Request From PRD Sync

Use this immediately after running `.\scripts\sync-prd-issues.ps1` and before updating requirements, test plans, test cases, or traceability.

Input files:

- Change report: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\change-reports\issue-change-impact-20260728-135317.md`
- Latest impact JSON: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-issue-impact.json`
- Latest issues snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-issues.json`
- Previous issues snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\snapshots\issues-previous-for-20260728-135317.json`
- Current timestamped snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\snapshots\issues-20260728-135317.json`

Output file to create:

- Impact classification report: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\reports\prd-change-reviews\impact-classification-20260728-135317.md`

Task:

1. Read the change report and impact JSON.
2. Compare previous and current snapshots for every new, changed, or removed issue.
3. Explain what changed in product behavior, acceptance criteria, scope, priority, risk, data, environment, wording, or implementation signal.
4. Classify each issue using one or more of: no-impact, requirement-impact, test-plan-impact, test-case-impact, automation-impact, needs-human-clarification.
5. Identify impacted local artifacts from latest-issue-impact.json and from source issue references.
6. Do not update requirements, test plans, test cases, or traceability in this classification step.
7. Write the classification report to the output path above.

Current run summary:

- New issues: 15
- Changed issues: 73
- Removed issues: 0

Classification report must include:

- Issue number and title.
- Change summary.
- Impact classification.
- Impacted artifact types: requirements, test plan, test cases, automation, traceability, report only, or none.
- Recommended action.
- Needs confirmation questions.
- Explicit no-impact decisions.
- A Vietnamese translation section at the bottom using heading: `## Bản dịch tiếng Việt`.
- The Vietnamese section must translate the summary, issue classification, affected areas, automation impact, clarification questions, no-impact decisions, and recommended update order.
