# PRD Sync Command

Muc tieu cua buoc nay la quet lai GitHub PRD issues, tao snapshot, tao change report, roi mo mot AI classification gate truoc khi update requirements, test plan, test cases, automation, hoac traceability.

## Quy uoc goi lenh trong chat

Tu bay gio dung 2 cau lenh chinh:

```text
Run PRD intake
```

AI se thuc hien buoc intake: quet PRD, tao snapshot, so sanh voi snapshot truoc, tao change report, va tao impact classification report. Buoc nay khong update requirements, test plan, test cases, hay traceability.

```text
Update
```

AI se doc update request moi nhat, doc impact classification report moi nhat, roi update theo thu tu: requirements -> test plan -> test cases -> traceability -> QA review report.

Sau khi `Update` xong, neu nguoi dung muon day tai lieu sang PRD repo, chay them buoc publish:

```text
Publish QA artifacts
```

AI se upload dung 2 file hien hanh len repo `speedrun-labs/riffables-prd`, vao thu muc `issues/`, giu nguyen ten file:

```text
qa-ai-workflow/test-plans/riffables-master.test-plan.md
qa-ai-workflow/test-cases/riffables-master.test-cases.md
```

## Command

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-prd-issues.ps1
```

Neu repo private, can token co quyen doc repo:

```powershell
$env:GITHUB_TOKEN = "<token-with-repo-read>"
powershell -ExecutionPolicy Bypass -File .\scripts\sync-prd-issues.ps1
```

Co the dung `GH_TOKEN` thay cho `GITHUB_TOKEN`.

## Output

Script tao cac file:

```text
qa-ai-workflow/prd-sources/snapshots/issues-<timestamp>.json
qa-ai-workflow/prd-sources/latest-issues.json
qa-ai-workflow/prd-sources/latest-issue-impact.json
qa-ai-workflow/prd-sources/riffables-issues-inventory.generated.md
qa-ai-workflow/prd-sources/change-reports/issue-change-impact-<timestamp>.md
qa-ai-workflow/prd-sources/change-reports/ai-classification-request-<timestamp>.md
qa-ai-workflow/prd-sources/latest-ai-classification-request.md
qa-ai-workflow/prd-sources/change-reports/ai-update-request-<timestamp>.md
qa-ai-workflow/prd-sources/latest-ai-update-request.md
```

## Correct Flow

```text
Run sync command
-> Script creates snapshot + change impact report
-> AI reads latest-ai-classification-request.md
-> AI classifies each changed issue
-> AI writes impact classification report
-> QA optionally reviews classification
-> AI reads latest-ai-update-request.md + classification report
-> AI updates impacted requirements first
-> AI updates impacted test plan next
-> AI updates impacted test cases next
-> AI updates traceability last
-> AI creates QA review report
-> AI publishes test plan + test cases to PRD repo issues/ when requested and token with write permission is available
-> QA review/approve
```

## Why Split Classification From Update?

Do not let the script blindly overwrite QA artifacts. PRD changes need judgment.

The script does the mechanical work:

- fetch latest issues,
- save snapshot,
- compare with previous snapshot,
- detect new/changed/removed issues,
- map changed issue numbers to local files,
- create an AI classification request,
- create an AI update request.

The AI classification step decides whether each change is:

```text
no-impact
requirement-impact
test-plan-impact
test-case-impact
automation-impact
needs-human-clarification
```

Only after classification should AI update artifacts.

## AI Classification Step

Prompt:

```text
qa-ai-workflow/prompts/09-impact-classifier.md
```

Input:

```text
qa-ai-workflow/prd-sources/latest-ai-classification-request.md
qa-ai-workflow/prd-sources/latest-issue-impact.json
```

Output:

```text
qa-ai-workflow/reports/prd-change-reviews/impact-classification-<timestamp>.md
```

This step must not update requirements, test plan, test cases, or traceability.

Change report va impact classification report phai co noi dung tieng Anh truoc, sau do them phan `## Bản dịch tiếng Việt` o cuoi file.

## AI Update Step

Prompt:

```text
qa-ai-workflow/prompts/08-impact-update-assistant.md
```

Input:

```text
qa-ai-workflow/prd-sources/latest-ai-update-request.md
qa-ai-workflow/prd-sources/latest-issue-impact.json
qa-ai-workflow/reports/prd-change-reviews/impact-classification-<timestamp>.md
```

Update order:

1. Requirements.
2. Test plan.
3. Test cases.
4. Traceability.
5. QA review report.

## Publish QA Artifacts Step

Sau khi update xong va truoc hoac sau QA review tuy nhu cau, co the upload 2 file output chinh sang PRD repo:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish-qa-artifacts-to-prd.ps1 -DryRun
```

Upload that su can token co quyen ghi contents vao `speedrun-labs/riffables-prd`:

```powershell
$env:GH_TOKEN = "<token-with-contents-write>"
powershell -ExecutionPolicy Bypass -File .\scripts\publish-qa-artifacts-to-prd.ps1
```

Mac dinh script tao mot commit tren:

```text
speedrun-labs/riffables-prd:main/issues/
```

Va upload:

```text
issues/riffables-master.test-plan.md
issues/riffables-master.test-cases.md
```

Neu branch hoac folder khac thi truyen tham so:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish-qa-artifacts-to-prd.ps1 -Branch main -TargetDir issues
```

## Help

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-prd-issues.ps1 -ShowHelp
powershell -ExecutionPolicy Bypass -File .\scripts\publish-qa-artifacts-to-prd.ps1 -ShowHelp
```
