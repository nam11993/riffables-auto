# AI Update Request From PRD Sync
Use this after running `Run PRD intake`.
Input files:
- Change report: `qa-ai-workflow/prd-sources/change-reports/issue-change-impact-20260723-145842.md`
- Latest impact JSON: `qa-ai-workflow/prd-sources/latest-issue-impact.json`
- Latest AI classification request: `qa-ai-workflow/prd-sources/latest-ai-classification-request.md`
- Expected impact classification report: `qa-ai-workflow/reports/prd-change-reviews/impact-classification-20260723-145842.md`
- Latest issues snapshot: `qa-ai-workflow/prd-sources/latest-issues.json`
- Previous issues snapshot: `qa-ai-workflow/prd-sources/snapshots/issues-previous-for-20260723-145842.json`
- Current timestamped snapshot: `qa-ai-workflow/prd-sources/snapshots/issues-20260723-145842.json`
Task:
1. Ensure the impact classification report exists. If it does not, create it from `qa-ai-workflow/prd-sources/latest-ai-classification-request.md` first.
2. Read the change report, impact JSON, and impact classification report.
3. Update only impacted requirements first.
4. Then update impacted test plans if they exist.
5. Then update impacted test cases if they exist.
6. Then update traceability if impacted.
7. Keep all edits traceable to GitHub issue IDs.
8. Do not rewrite unrelated modules.
9. Create a QA review report at: `qa-ai-workflow/reports/prd-change-reviews/prd-change-review-20260723-145842.md`
Current run summary:
- New issues: 2
- Changed issues: 3
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
