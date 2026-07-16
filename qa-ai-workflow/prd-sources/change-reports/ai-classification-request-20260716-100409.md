# AI Impact Classification Request From PRD Sync

Use this before updating requirements, test plans, test cases, automation, or traceability.

Input files:

- Change report: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\change-reports\issue-change-impact-20260716-100409.md`
- Latest impact JSON: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-issue-impact.json`
- Latest issues snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-issues.json`
- Previous issues snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\snapshots\issues-20260713-093244.json`
- Current timestamped snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\snapshots\issues-20260716-100409.json`

Output file to create:

- Impact classification report: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\reports\prd-change-reviews\impact-classification-20260716-100409.md`

Task:

1. Read the change report and impact JSON.
2. Compare previous and current snapshots for every new, changed, or removed issue.
3. Explain what changed in product behavior, acceptance criteria, scope, priority, risk, data, environment, wording, or implementation signal.
4. Classify each issue using one or more of: no-impact, requirement-impact, test-plan-impact, test-case-impact, automation-impact, needs-human-clarification.
5. Do not update requirements, test plans, test cases, or traceability in this classification step.
6. Add a Vietnamese translation section at the bottom using heading `## Bản dịch tiếng Việt`.
7. The Vietnamese section must translate the summary, issue classification, affected areas, automation impact, clarification questions, no-impact decisions, and recommended update order.

Current run summary:

- New issues: 7
- Changed issues: 19
- Removed issues: 0
