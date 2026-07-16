[CmdletBinding()]
param(
    [string]$Owner = "speedrun-labs",
    [string]$Repo = "riffables-prd",
    [ValidateSet("all", "open", "closed")]
    [string]$State = "all",
    [string]$WorkflowRoot = "qa-ai-workflow",
    [switch]$ShowHelp
)

$ErrorActionPreference = "Stop"

function Write-Usage {
    @"
Usage:
  powershell -ExecutionPolicy Bypass -File .\scripts\sync-prd-issues.ps1

Private repo:
  `$env:GITHUB_TOKEN = "<token-with-repo-read>"
  powershell -ExecutionPolicy Bypass -File .\scripts\sync-prd-issues.ps1

Options:
  -Owner <owner>          Default: speedrun-labs
  -Repo <repo>            Default: riffables-prd
  -State all|open|closed  Default: all
  -WorkflowRoot <path>    Default: qa-ai-workflow
  -ShowHelp               Print this help

What this command does:
  1. Reads all GitHub issues from the PRD repo.
  2. Saves a timestamped JSON snapshot.
  3. Compares with the previous snapshot.
  4. Writes a change impact report.
  5. Maps changed issues to local requirements, test plans, test cases, and traceability files.
  6. Writes an AI classification request before the AI update request.

What this command does NOT do:
  It does not blindly overwrite requirements, test plans, or test cases.
  Use the generated classification request first, then the update request.
"@ | Write-Host
}

if ($ShowHelp) {
    Write-Usage
    exit 0
}

function New-DirectoryIfMissing {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

function ConvertTo-Array {
    param($Value)
    if ($null -eq $Value) {
        return @()
    }
    if ($Value -is [System.Array]) {
        return $Value
    }
    return @($Value)
}

function Get-Sha256Text {
    param([string]$Text)
    if ($null -eq $Text) {
        $Text = ""
    }
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
        return ([System.BitConverter]::ToString($sha.ComputeHash($bytes))).Replace("-", "").ToLowerInvariant()
    }
    finally {
        $sha.Dispose()
    }
}

function Get-LabelNames {
    param($Issue)
    $names = @()
    foreach ($label in (ConvertTo-Array $Issue.labels)) {
        if ($null -ne $label.name -and [string]$label.name -ne "") {
            $names += [string]$label.name
        }
    }
    return @($names | Sort-Object)
}

function Get-NormalizedIssue {
    param($Issue)
    $labels = Get-LabelNames -Issue $Issue
    $body = ""
    if ($null -ne $Issue.body) {
        $body = [string]$Issue.body
    }
    $title = [string]$Issue.title
    $stateText = [string]$Issue.state
    $hashInput = $title + "`n" + $stateText + "`n" + ($labels -join ",") + "`n" + $body

    [ordered]@{
        number       = [int]$Issue.number
        title        = $title
        state        = $stateText
        html_url     = [string]$Issue.html_url
        labels       = $labels
        created_at   = [string]$Issue.created_at
        updated_at   = [string]$Issue.updated_at
        closed_at    = [string]$Issue.closed_at
        author       = if ($null -ne $Issue.user.login) { [string]$Issue.user.login } else { "" }
        body         = $body
        body_hash    = Get-Sha256Text -Text $body
        content_hash = Get-Sha256Text -Text $hashInput
    }
}

function Get-GitHubIssues {
    param(
        [string]$Owner,
        [string]$Repo,
        [string]$State,
        [string]$Token
    )

    $allIssues = @()
    $page = 1

    do {
        $uri = "https://api.github.com/repos/$Owner/$Repo/issues?state=$State&per_page=100&page=$page"
        $headers = @{
            "User-Agent"           = "riffables-qa-ai-sync"
            "Accept"               = "application/vnd.github+json"
            "X-GitHub-Api-Version" = "2022-11-28"
        }
        if (-not [string]::IsNullOrWhiteSpace($Token)) {
            $headers["Authorization"] = "Bearer $Token"
        }

        try {
            $pageItems = Invoke-RestMethod -Uri $uri -Method Get -Headers $headers
        }
        catch {
            $message = $_.Exception.Message
            throw "Could not read GitHub issues for $Owner/$Repo. If this is a private repo, set GITHUB_TOKEN or GH_TOKEN with repo read access. Original error: $message"
        }

        $pageItems = ConvertTo-Array $pageItems
        foreach ($item in $pageItems) {
            if ($null -eq $item.pull_request) {
                $allIssues += $item
            }
        }
        $page += 1
    } while ($pageItems.Count -eq 100)

    return $allIssues
}

function Get-IssueMap {
    param($Issues)
    $map = @{}
    foreach ($issue in (ConvertTo-Array $Issues)) {
        $map[[int]$issue.number] = $issue
    }
    return $map
}

function Get-ChangedFields {
    param($Previous, $Current)

    $fields = @()
    if ([string]$Previous.title -ne [string]$Current.title) {
        $fields += "title"
    }
    if ([string]$Previous.state -ne [string]$Current.state) {
        $fields += "state"
    }
    if ((ConvertTo-Array $Previous.labels) -join "," -ne (ConvertTo-Array $Current.labels) -join ",") {
        $fields += "labels"
    }
    if ([string]$Previous.body_hash -ne [string]$Current.body_hash) {
        $fields += "body"
    }
    if ([string]$Previous.updated_at -ne [string]$Current.updated_at -and $fields.Count -eq 0) {
        $fields += "updated_at"
    }
    return $fields
}

function Get-ArtifactFiles {
    param([string]$WorkflowPath)

    $dirs = @(
        (Join-Path $WorkflowPath "requirements"),
        (Join-Path $WorkflowPath "test-plans"),
        (Join-Path $WorkflowPath "test-cases"),
        (Join-Path $WorkflowPath "traceability")
    )

    $files = @()
    foreach ($dir in $dirs) {
        if (Test-Path -LiteralPath $dir) {
            $files += Get-ChildItem -LiteralPath $dir -Recurse -File | Where-Object {
                $_.Extension -in @(".md", ".yaml", ".yml", ".json")
            }
        }
    }
    return $files
}

function Find-ArtifactsForIssue {
    param(
        [int]$IssueNumber,
        $ArtifactFiles
    )

    $pattern = "(?<!\d)#$IssueNumber(?!\d)|issues/$IssueNumber(?!\d)"
    $matches = @()
    foreach ($file in $ArtifactFiles) {
        if (Select-String -LiteralPath $file.FullName -Pattern $pattern -Quiet) {
            $matches += $file.FullName
        }
    }
    return $matches
}

$repoRoot = (Get-Location).Path
$workflowPath = Join-Path $repoRoot $WorkflowRoot
if (-not (Test-Path -LiteralPath $workflowPath)) {
    throw "Workflow root not found: $workflowPath"
}

$prdSourcesPath = Join-Path $workflowPath "prd-sources"
$snapshotPath = Join-Path $prdSourcesPath "snapshots"
$reportPath = Join-Path $prdSourcesPath "change-reports"
New-DirectoryIfMissing -Path $snapshotPath
New-DirectoryIfMissing -Path $reportPath

$token = ""
if (-not [string]::IsNullOrWhiteSpace($env:GITHUB_TOKEN)) {
    $token = $env:GITHUB_TOKEN
}
elseif (-not [string]::IsNullOrWhiteSpace($env:GH_TOKEN)) {
    $token = $env:GH_TOKEN
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$syncedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
$markdownTick = [char]96
$latestIssuesPath = Join-Path $prdSourcesPath "latest-issues.json"
$latestImpactPath = Join-Path $prdSourcesPath "latest-issue-impact.json"
$generatedInventoryPath = Join-Path $prdSourcesPath "riffables-issues-inventory.generated.md"

Write-Host "Reading GitHub issues from $Owner/$Repo..."
$rawIssues = Get-GitHubIssues -Owner $Owner -Repo $Repo -State $State -Token $token
$normalizedIssues = @($rawIssues | ForEach-Object { Get-NormalizedIssue -Issue $_ } | Sort-Object number)

$currentSnapshotFile = Join-Path $snapshotPath ("issues-$timestamp.json")
$normalizedIssues | ConvertTo-Json -Depth 20 | Set-Content -Path $currentSnapshotFile -Encoding UTF8

$hasPrevious = Test-Path -LiteralPath $latestIssuesPath
$previousIssues = @()
$previousSnapshotFile = ""
if ($hasPrevious) {
    $previousSnapshotFile = Join-Path $snapshotPath ("issues-previous-for-$timestamp.json")
    Copy-Item -LiteralPath $latestIssuesPath -Destination $previousSnapshotFile -Force
    $previousIssues = ConvertTo-Array (Get-Content -LiteralPath $latestIssuesPath -Raw | ConvertFrom-Json)
}

$previousMap = Get-IssueMap -Issues $previousIssues
$currentMap = Get-IssueMap -Issues $normalizedIssues

$newIssues = @()
$removedIssues = @()
$changedIssues = @()

if ($hasPrevious) {
    foreach ($current in $normalizedIssues) {
        $number = [int]$current.number
        if (-not $previousMap.ContainsKey($number)) {
            $newIssues += $current
            continue
        }

        $previous = $previousMap[$number]
        if ([string]$previous.content_hash -ne [string]$current.content_hash -or [string]$previous.updated_at -ne [string]$current.updated_at) {
            $fields = Get-ChangedFields -Previous $previous -Current $current
            $changedIssues += [ordered]@{
                number         = $number
                title          = [string]$current.title
                state          = [string]$current.state
                html_url       = [string]$current.html_url
                changed_fields = $fields
                previous_hash  = [string]$previous.content_hash
                current_hash   = [string]$current.content_hash
                previous_date  = [string]$previous.updated_at
                current_date   = [string]$current.updated_at
            }
        }
    }

    foreach ($previous in $previousIssues) {
        $number = [int]$previous.number
        if (-not $currentMap.ContainsKey($number)) {
            $removedIssues += $previous
        }
    }
}

$artifactFiles = Get-ArtifactFiles -WorkflowPath $workflowPath
$changedNumbers = @()
foreach ($issue in $newIssues) { $changedNumbers += [int]$issue.number }
foreach ($issue in $changedIssues) { $changedNumbers += [int]$issue.number }
foreach ($issue in $removedIssues) { $changedNumbers += [int]$issue.number }
$changedNumbers = @($changedNumbers | Sort-Object -Unique)

$impactedArtifacts = @()
foreach ($number in $changedNumbers) {
    $files = Find-ArtifactsForIssue -IssueNumber $number -ArtifactFiles $artifactFiles
    $issueTitle = ""
    if ($currentMap.ContainsKey($number)) {
        $issueTitle = [string]$currentMap[$number].title
    }
    elseif ($previousMap.ContainsKey($number)) {
        $issueTitle = [string]$previousMap[$number].title
    }

    $impactedArtifacts += [ordered]@{
        issue_number = $number
        issue_title  = $issueTitle
        files        = @($files | ForEach-Object { Resolve-Path -LiteralPath $_ -Relative })
    }
}

$openCount = @($normalizedIssues | Where-Object { $_.state -eq "open" }).Count
$closedCount = @($normalizedIssues | Where-Object { $_.state -eq "closed" }).Count

$inventoryLines = @()
$inventoryLines += "# Riffables Issues Inventory (Generated)"
$inventoryLines += ""
$inventoryLines += "- Synced at: $syncedAt"
$inventoryLines += "- Repository: $Owner/$Repo"
$inventoryLines += "- Total issues: $($normalizedIssues.Count)"
$inventoryLines += "- Open: $openCount"
$inventoryLines += "- Closed: $closedCount"
$inventoryLines += ""
$inventoryLines += "| Issue | State | Title | Labels | Updated |"
$inventoryLines += "| --- | --- | --- | --- | --- |"
foreach ($issue in ($normalizedIssues | Sort-Object number -Descending)) {
    $labels = (ConvertTo-Array $issue.labels) -join ", "
    $title = ([string]$issue.title).Replace("|", "\|")
    $inventoryLines += "| #$($issue.number) | $($issue.state) | $title | $labels | $($issue.updated_at) |"
}
$inventoryLines -join "`r`n" | Set-Content -Path $generatedInventoryPath -Encoding UTF8

$reportFile = Join-Path $reportPath ("issue-change-impact-$timestamp.md")
$reportLines = @()
$reportLines += "# PRD Issue Change Impact Report"
$reportLines += ""
$reportLines += "- Synced at: $syncedAt"
$reportLines += "- Repository: $Owner/$Repo"
$reportLines += "- Current snapshot: ${markdownTick}$currentSnapshotFile${markdownTick}"
if ($hasPrevious) {
    $reportLines += "- Previous snapshot: ${markdownTick}$previousSnapshotFile${markdownTick}"
}
$reportLines += "- Previous snapshot found: $hasPrevious"
$reportLines += ""
$reportLines += "## Summary"
$reportLines += ""
$reportLines += "| Type | Count |"
$reportLines += "| --- | ---: |"
$reportLines += "| Total issues | $($normalizedIssues.Count) |"
$reportLines += "| Open issues | $openCount |"
$reportLines += "| Closed issues | $closedCount |"
$reportLines += "| New issues | $($newIssues.Count) |"
$reportLines += "| Changed issues | $($changedIssues.Count) |"
$reportLines += "| Removed issues | $($removedIssues.Count) |"
$reportLines += ""

if (-not $hasPrevious) {
    $reportLines += "## Baseline"
    $reportLines += ""
    $reportLines += "No previous snapshot was found. This run created the baseline. Run the command again after PRD changes to get a real diff."
    $reportLines += ""
}

if ($newIssues.Count -gt 0) {
    $reportLines += "## New Issues"
    $reportLines += ""
    $reportLines += "| Issue | State | Title |"
    $reportLines += "| --- | --- | --- |"
    foreach ($issue in $newIssues) {
        $reportLines += "| [#$($issue.number)]($($issue.html_url)) | $($issue.state) | $($issue.title) |"
    }
    $reportLines += ""
}

if ($changedIssues.Count -gt 0) {
    $reportLines += "## Changed Issues"
    $reportLines += ""
    $reportLines += "| Issue | State | Changed fields | Title |"
    $reportLines += "| --- | --- | --- | --- |"
    foreach ($issue in $changedIssues) {
        $reportLines += "| [#$($issue.number)]($($issue.html_url)) | $($issue.state) | $((ConvertTo-Array $issue.changed_fields) -join ', ') | $($issue.title) |"
    }
    $reportLines += ""
}

if ($removedIssues.Count -gt 0) {
    $reportLines += "## Removed Issues"
    $reportLines += ""
    $reportLines += "| Issue | Last state | Title |"
    $reportLines += "| --- | --- | --- |"
    foreach ($issue in $removedIssues) {
        $reportLines += "| #$($issue.number) | $($issue.state) | $($issue.title) |"
    }
    $reportLines += ""
}

$reportLines += "## Impacted Local Artifacts"
$reportLines += ""
if ($changedNumbers.Count -eq 0 -or -not $hasPrevious) {
    $reportLines += "No impacted artifacts were calculated for this run."
}
else {
    $reportLines += "| Issue | Local files to review |"
    $reportLines += "| --- | --- |"
    foreach ($impact in $impactedArtifacts) {
        $files = ConvertTo-Array $impact.files
        if ($files.Count -eq 0) {
            $fileText = "_No current local artifact references this issue._"
        }
        else {
            $fileText = ($files -join "<br>")
        }
        $reportLines += "| #$($impact.issue_number) $($impact.issue_title) | $fileText |"
    }
}
$reportLines += ""
$reportLines += "## Recommended Update Order"
$reportLines += ""
$reportLines += "1. Review changed GitHub issues."
$reportLines += "2. Update impacted requirement files first."
$reportLines += "3. Update impacted test plans next."
$reportLines += "4. Update impacted test cases after requirements and test plan are stable."
$reportLines += "5. Update traceability last."
$reportLines += ""
$reportLines += "Do not overwrite approved artifacts without review."
$reportLines += ""
$reportLines += "---"
$reportLines += ""
$reportLines += "## Bản dịch tiếng Việt"
$reportLines += ""
$reportLines += "### Tóm tắt"
$reportLines += ""
$reportLines += "- Thời điểm đồng bộ: $syncedAt"
$reportLines += "- Repository: $Owner/$Repo"
$reportLines += "- Snapshot hiện tại: ${markdownTick}$currentSnapshotFile${markdownTick}"
if ($hasPrevious) {
    $reportLines += "- Snapshot trước đó: ${markdownTick}$previousSnapshotFile${markdownTick}"
}
$reportLines += "- Có snapshot trước đó: $hasPrevious"
$reportLines += ""
$reportLines += "| Loại | Số lượng |"
$reportLines += "| --- | ---: |"
$reportLines += "| Tổng số issue | $($normalizedIssues.Count) |"
$reportLines += "| Issue đang mở | $openCount |"
$reportLines += "| Issue đã đóng | $closedCount |"
$reportLines += "| Issue mới | $($newIssues.Count) |"
$reportLines += "| Issue có thay đổi | $($changedIssues.Count) |"
$reportLines += "| Issue bị xóa/không còn thấy | $($removedIssues.Count) |"
$reportLines += ""

if (-not $hasPrevious) {
    $reportLines += "### Baseline"
    $reportLines += ""
    $reportLines += "Chưa có snapshot trước đó. Lần chạy này tạo baseline ban đầu. Hãy chạy lại sau khi PRD thay đổi để có diff thật."
    $reportLines += ""
}

if ($newIssues.Count -gt 0) {
    $reportLines += "### Issue mới"
    $reportLines += ""
    $reportLines += "| Issue | Trạng thái | Tiêu đề |"
    $reportLines += "| --- | --- | --- |"
    foreach ($issue in $newIssues) {
        $reportLines += "| [#$($issue.number)]($($issue.html_url)) | $($issue.state) | $($issue.title) |"
    }
    $reportLines += ""
}

if ($changedIssues.Count -gt 0) {
    $reportLines += "### Issue có thay đổi"
    $reportLines += ""
    $reportLines += "| Issue | Trạng thái | Trường thay đổi | Tiêu đề |"
    $reportLines += "| --- | --- | --- | --- |"
    foreach ($issue in $changedIssues) {
        $reportLines += "| [#$($issue.number)]($($issue.html_url)) | $($issue.state) | $((ConvertTo-Array $issue.changed_fields) -join ', ') | $($issue.title) |"
    }
    $reportLines += ""
}

if ($removedIssues.Count -gt 0) {
    $reportLines += "### Issue bị xóa/không còn thấy"
    $reportLines += ""
    $reportLines += "| Issue | Trạng thái cuối | Tiêu đề |"
    $reportLines += "| --- | --- | --- |"
    foreach ($issue in $removedIssues) {
        $reportLines += "| #$($issue.number) | $($issue.state) | $($issue.title) |"
    }
    $reportLines += ""
}

$reportLines += "### Thứ tự update khuyến nghị"
$reportLines += ""
$reportLines += "1. Review các GitHub issue đã thay đổi."
$reportLines += "2. Update requirement trước."
$reportLines += "3. Update test plan sau requirement."
$reportLines += "4. Update test case sau khi requirement và test plan ổn định."
$reportLines += "5. Update traceability cuối cùng."
$reportLines += ""
$reportLines += "Không ghi đè tài liệu đã approve nếu chưa review."

$reportLines -join "`r`n" | Set-Content -Path $reportFile -Encoding UTF8

$impactObject = [ordered]@{
    synced_at          = $syncedAt
    repository         = "$Owner/$Repo"
    current_snapshot   = (Resolve-Path -LiteralPath $currentSnapshotFile -Relative)
    previous_snapshot  = if ($hasPrevious) { (Resolve-Path -LiteralPath $previousSnapshotFile -Relative) } else { "" }
    report             = (Resolve-Path -LiteralPath $reportFile -Relative)
    has_previous       = $hasPrevious
    total_issues       = $normalizedIssues.Count
    open_issues        = $openCount
    closed_issues      = $closedCount
    new_issues         = $newIssues
    changed_issues     = $changedIssues
    removed_issues     = $removedIssues
    impacted_artifacts = $impactedArtifacts
}
$impactObject | ConvertTo-Json -Depth 20 | Set-Content -Path $latestImpactPath -Encoding UTF8

$updatePromptFile = Join-Path $reportPath ("ai-update-request-$timestamp.md")
$latestUpdatePromptFile = Join-Path $prdSourcesPath "latest-ai-update-request.md"
$classificationPromptFile = Join-Path $reportPath ("ai-classification-request-$timestamp.md")
$latestClassificationPromptFile = Join-Path $prdSourcesPath "latest-ai-classification-request.md"
$qaReviewReportPath = Join-Path $repoRoot "qa-ai-workflow\reports\prd-change-reviews"
$qaReviewReportFile = Join-Path $qaReviewReportPath ("prd-change-review-$timestamp.md")
$impactClassificationReportFile = Join-Path $qaReviewReportPath ("impact-classification-$timestamp.md")
New-DirectoryIfMissing -Path $qaReviewReportPath

$classificationLines = @()
$classificationLines += "# AI Impact Classification Request From PRD Sync"
$classificationLines += ""
$classificationLines += "Use this immediately after running ${markdownTick}.\scripts\sync-prd-issues.ps1${markdownTick} and before updating requirements, test plans, test cases, or traceability."
$classificationLines += ""
$classificationLines += "Input files:"
$classificationLines += ""
$classificationLines += "- Change report: ${markdownTick}$reportFile${markdownTick}"
$classificationLines += "- Latest impact JSON: ${markdownTick}$latestImpactPath${markdownTick}"
$classificationLines += "- Latest issues snapshot: ${markdownTick}$latestIssuesPath${markdownTick}"
if ($hasPrevious) {
    $classificationLines += "- Previous issues snapshot: ${markdownTick}$previousSnapshotFile${markdownTick}"
}
$classificationLines += "- Current timestamped snapshot: ${markdownTick}$currentSnapshotFile${markdownTick}"
$classificationLines += ""
$classificationLines += "Output file to create:"
$classificationLines += ""
$classificationLines += "- Impact classification report: ${markdownTick}$impactClassificationReportFile${markdownTick}"
$classificationLines += ""
$classificationLines += "Task:"
$classificationLines += ""
$classificationLines += "1. Read the change report and impact JSON."
$classificationLines += "2. Compare previous and current snapshots for every new, changed, or removed issue."
$classificationLines += "3. Explain what changed in product behavior, acceptance criteria, scope, priority, risk, data, environment, wording, or implementation signal."
$classificationLines += "4. Classify each issue using one or more of: no-impact, requirement-impact, test-plan-impact, test-case-impact, automation-impact, needs-human-clarification."
$classificationLines += "5. Identify impacted local artifacts from latest-issue-impact.json and from source issue references."
$classificationLines += "6. Do not update requirements, test plans, test cases, or traceability in this classification step."
$classificationLines += "7. Write the classification report to the output path above."
$classificationLines += ""
$classificationLines += "Current run summary:"
$classificationLines += ""
$classificationLines += "- New issues: $($newIssues.Count)"
$classificationLines += "- Changed issues: $($changedIssues.Count)"
$classificationLines += "- Removed issues: $($removedIssues.Count)"
$classificationLines += ""
$classificationLines += "Classification report must include:"
$classificationLines += ""
$classificationLines += "- Issue number and title."
$classificationLines += "- Change summary."
$classificationLines += "- Impact classification."
$classificationLines += "- Impacted artifact types: requirements, test plan, test cases, automation, traceability, report only, or none."
$classificationLines += "- Recommended action."
$classificationLines += "- Needs confirmation questions."
$classificationLines += "- Explicit no-impact decisions."
$classificationLines += "- A Vietnamese translation section at the bottom using heading: ${markdownTick}## Bản dịch tiếng Việt${markdownTick}."
$classificationLines += "- The Vietnamese section must translate the summary, issue classification, affected areas, automation impact, clarification questions, no-impact decisions, and recommended update order."
$classificationLines -join "`r`n" | Set-Content -Path $classificationPromptFile -Encoding UTF8
$classificationLines -join "`r`n" | Set-Content -Path $latestClassificationPromptFile -Encoding UTF8

$promptLines = @()
$promptLines += "# AI Update Request From PRD Sync"
$promptLines += ""
$promptLines += "Use this after running ${markdownTick}.\scripts\sync-prd-issues.ps1${markdownTick}."
$promptLines += ""
$promptLines += "Input files:"
$promptLines += ""
$promptLines += "- Change report: ${markdownTick}$reportFile${markdownTick}"
$promptLines += "- Latest impact JSON: ${markdownTick}$latestImpactPath${markdownTick}"
$promptLines += "- Latest AI classification request: ${markdownTick}$latestClassificationPromptFile${markdownTick}"
$promptLines += "- Expected impact classification report: ${markdownTick}$impactClassificationReportFile${markdownTick}"
$promptLines += "- Latest issues snapshot: ${markdownTick}$latestIssuesPath${markdownTick}"
if ($hasPrevious) {
    $promptLines += "- Previous issues snapshot: ${markdownTick}$previousSnapshotFile${markdownTick}"
}
$promptLines += "- Current timestamped snapshot: ${markdownTick}$currentSnapshotFile${markdownTick}"
$promptLines += ""
$promptLines += "Task:"
$promptLines += ""
$promptLines += "1. Ensure the impact classification report exists. If it does not, create it from ${markdownTick}$latestClassificationPromptFile${markdownTick} first."
$promptLines += "2. Read the change report, impact JSON, and impact classification report."
$promptLines += "3. Update only impacted requirements first."
$promptLines += "4. Then update impacted test plans if they exist."
$promptLines += "5. Then update impacted test cases if they exist."
$promptLines += "6. Then update traceability if impacted."
$promptLines += "7. Keep all edits traceable to GitHub issue IDs."
$promptLines += "8. Do not rewrite unrelated modules."
$promptLines += "9. Create a QA review report at: ${markdownTick}$qaReviewReportFile${markdownTick}"
$promptLines += ""
$promptLines += "Current run summary:"
$promptLines += ""
$promptLines += "- New issues: $($newIssues.Count)"
$promptLines += "- Changed issues: $($changedIssues.Count)"
$promptLines += "- Removed issues: $($removedIssues.Count)"
$promptLines += ""
$promptLines += "QA review report must include:"
$promptLines += ""
$promptLines += "- Changed issue summary."
$promptLines += "- Impact classification."
$promptLines += "- Files updated."
$promptLines += "- Requirements added/changed/deprecated."
$promptLines += "- Test plan sections changed."
$promptLines += "- Test cases added/changed/deprecated."
$promptLines += "- Items needing QA/Product/Engineering confirmation."
$promptLines += "- Explicit no-impact decisions."
$promptLines -join "`r`n" | Set-Content -Path $updatePromptFile -Encoding UTF8
$promptLines -join "`r`n" | Set-Content -Path $latestUpdatePromptFile -Encoding UTF8

$normalizedIssues | ConvertTo-Json -Depth 20 | Set-Content -Path $latestIssuesPath -Encoding UTF8

Write-Host ""
Write-Host "Sync complete."
Write-Host "Snapshot: $currentSnapshotFile"
Write-Host "Generated inventory: $generatedInventoryPath"
Write-Host "Impact report: $reportFile"
Write-Host "AI classification request: $classificationPromptFile"
Write-Host "Latest AI classification request: $latestClassificationPromptFile"
Write-Host "AI update request: $updatePromptFile"
Write-Host "Latest AI update request: $latestUpdatePromptFile"
Write-Host "Latest impact JSON: $latestImpactPath"
