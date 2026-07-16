# AI Update Request From PRD Sync

Use this only after the impact classification report exists.

Input files:

- Change report: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\change-reports\issue-change-impact-20260716-100409.md`
- Latest impact JSON: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-issue-impact.json`
- Latest issues snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-issues.json`
- Current timestamped snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\snapshots\issues-20260716-100409.json`
- Latest AI classification request: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-ai-classification-request.md`
- Expected impact classification report: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\reports\prd-change-reviews\impact-classification-20260716-100409.md`

Task:

1. Ensure the impact classification report exists. If it does not, create it from `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-ai-classification-request.md` first.
2. Read the change report, impact JSON, and impact classification report.
3. Update only impacted requirements first.
4. Then update impacted test plans if they exist.
5. Then update impacted test cases if they exist.
6. Then update traceability if impacted.
7. Keep all edits traceable to GitHub issue IDs.
8. Do not rewrite unrelated modules.
9. Create a QA review report at: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\reports\prd-change-reviews\prd-change-review-20260716-100409.md`

Current run summary:

- New issues: 7
- Changed issues: 19
- Removed issues: 0