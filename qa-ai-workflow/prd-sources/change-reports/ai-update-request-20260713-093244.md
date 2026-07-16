# AI Update Request From PRD Sync

Use this after running `.\scripts\sync-prd-issues.ps1`.

Input files:

- Change report: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\change-reports\issue-change-impact-20260713-093244.md`
- Latest impact JSON: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-issue-impact.json`
- Latest issues snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-issues.json`
- Current timestamped snapshot: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\snapshots\issues-20260713-093244.json`
- Latest AI classification request: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-ai-classification-request.md`
- Expected impact classification report: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\reports\prd-change-reviews\impact-classification-20260713-093244.md`

Task:

1. Ensure the impact classification report exists. If it does not, create it from `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\prd-sources\latest-ai-classification-request.md` first.
2. Read the change report, impact JSON, and impact classification report.
3. Update only impacted requirements first.
4. Then update impacted test plans if they exist.
5. Then update impacted test cases if they exist.
6. Then update traceability if impacted.
7. Keep all edits traceable to GitHub issue IDs.
8. Do not rewrite unrelated modules.
9. Create a QA review report at: `C:\Users\namnh189.FSOFT.FPT.VN\Documents\Riffables\qa-ai-workflow\reports\prd-change-reviews\prd-change-review-20260713-093244.md`

Current run summary:

- New issues: 0
- Changed issues: 0
- Removed issues: 0

QA review report must include:

- Changed issue summary.
- Impact classification.
- Files updated.
- Requirements added/changed/deprecated.
- Test plan sections changed.
- Test cases added/changed/deprecated.
- Items needing QA/Product/Engineering confirmation.
- Explicit no-impact decisions.
