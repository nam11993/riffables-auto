param(
  [string]$RepoOwner = "speedrun-labs",
  [string]$RepoName = "riffables-prd",
  [string]$Branch = "main",
  [string]$TargetDir = "issues",
  [string]$TestPlanPath = "qa-ai-workflow/test-plans/riffables-master.test-plan.md",
  [string]$TestCasesPath = "qa-ai-workflow/test-cases/riffables-master.test-cases.md",
  [string]$CommitMessage = "",
  [string]$Token = "",
  [switch]$DryRun,
  [switch]$ShowHelp
)

$ErrorActionPreference = "Stop"

function Show-Usage {
  Write-Host "Publish QA artifacts to the PRD GitHub repo."
  Write-Host ""
  Write-Host "Uploads these local files as one commit:"
  Write-Host "  qa-ai-workflow/test-plans/riffables-master.test-plan.md"
  Write-Host "  qa-ai-workflow/test-cases/riffables-master.test-cases.md"
  Write-Host ""
  Write-Host "Default target:"
  Write-Host "  speedrun-labs/riffables-prd:main/issues/"
  Write-Host ""
  Write-Host "Examples:"
  Write-Host "  powershell -ExecutionPolicy Bypass -File .\scripts\publish-qa-artifacts-to-prd.ps1 -DryRun"
  Write-Host "  `$env:GH_TOKEN = '<token-with-contents-write>'"
  Write-Host "  powershell -ExecutionPolicy Bypass -File .\scripts\publish-qa-artifacts-to-prd.ps1"
  Write-Host ""
  Write-Host "Options:"
  Write-Host "  -RepoOwner speedrun-labs"
  Write-Host "  -RepoName riffables-prd"
  Write-Host "  -Branch main"
  Write-Host "  -TargetDir issues"
  Write-Host "  -Token <token>  Optional. Defaults to GH_TOKEN or GITHUB_TOKEN."
}

if ($ShowHelp) {
  Show-Usage
  exit 0
}

$RepoRoot = Split-Path -Parent $PSScriptRoot

function Resolve-WorkspacePath {
  param([string]$Path)

  if ([System.IO.Path]::IsPathRooted($Path)) {
    $resolved = $Path
  } else {
    $resolved = Join-Path $RepoRoot $Path
  }

  if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
    throw "Local artifact not found: $resolved"
  }

  return (Resolve-Path -LiteralPath $resolved).Path
}

function Join-GitHubPath {
  param(
    [string]$Dir,
    [string]$FilePath
  )

  $cleanDir = ($Dir -replace "\\", "/").Trim("/")
  $fileName = [System.IO.Path]::GetFileName($FilePath)

  if ([string]::IsNullOrWhiteSpace($cleanDir)) {
    return $fileName
  }

  return "$cleanDir/$fileName"
}

$resolvedTestPlan = Resolve-WorkspacePath $TestPlanPath
$resolvedTestCases = Resolve-WorkspacePath $TestCasesPath

$artifacts = @(
  @{
    Source = $resolvedTestPlan
    Target = Join-GitHubPath -Dir $TargetDir -FilePath $resolvedTestPlan
  },
  @{
    Source = $resolvedTestCases
    Target = Join-GitHubPath -Dir $TargetDir -FilePath $resolvedTestCases
  }
)

Write-Host "PRD artifact publish target:"
Write-Host "  Repo:   $RepoOwner/$RepoName"
Write-Host "  Branch: $Branch"
Write-Host "  Dir:    $TargetDir"
Write-Host ""
Write-Host "Artifacts:"
foreach ($artifact in $artifacts) {
  $size = (Get-Item -LiteralPath $artifact.Source).Length
  Write-Host "  $($artifact.Source) -> $($artifact.Target) ($size bytes)"
}

if ($DryRun) {
  Write-Host ""
  Write-Host "DryRun only. No GitHub changes were made."
  exit 0
}

if ([string]::IsNullOrWhiteSpace($Token)) {
  if (-not [string]::IsNullOrWhiteSpace($env:GH_TOKEN)) {
    $Token = $env:GH_TOKEN
  } elseif (-not [string]::IsNullOrWhiteSpace($env:GITHUB_TOKEN)) {
    $Token = $env:GITHUB_TOKEN
  }
}

if ([string]::IsNullOrWhiteSpace($Token)) {
  throw "Missing GitHub token. Set GH_TOKEN or GITHUB_TOKEN with contents write permission for $RepoOwner/$RepoName."
}

if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
  $CommitMessage = "docs: update QA test plan and test cases"
}

$headers = @{
  Authorization = "Bearer $Token"
  Accept = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
  "User-Agent" = "riffables-qa-ai-publisher"
}

$apiBase = "https://api.github.com/repos/$RepoOwner/$RepoName"

function Invoke-GitHubApi {
  param(
    [string]$Method,
    [string]$Uri,
    $Body = $null
  )

  if ($null -eq $Body) {
    return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $headers
  }

  $json = $Body | ConvertTo-Json -Depth 20
  return Invoke-RestMethod -Method $Method -Uri $Uri -Headers $headers -ContentType "application/json" -Body $json
}

Write-Host ""
Write-Host "Reading branch reference..."
$ref = Invoke-GitHubApi -Method "Get" -Uri "$apiBase/git/ref/heads/$Branch"
$headSha = $ref.object.sha
$headCommit = Invoke-GitHubApi -Method "Get" -Uri "$apiBase/git/commits/$headSha"
$baseTreeSha = $headCommit.tree.sha

$treeEntries = @()
foreach ($artifact in $artifacts) {
  $bytes = [System.IO.File]::ReadAllBytes($artifact.Source)
  $base64 = [System.Convert]::ToBase64String($bytes)
  $blob = Invoke-GitHubApi -Method "Post" -Uri "$apiBase/git/blobs" -Body @{
    content = $base64
    encoding = "base64"
  }

  $treeEntries += @{
    path = $artifact.Target
    mode = "100644"
    type = "blob"
    sha = $blob.sha
  }
}

Write-Host "Creating tree..."
$newTree = Invoke-GitHubApi -Method "Post" -Uri "$apiBase/git/trees" -Body @{
  base_tree = $baseTreeSha
  tree = $treeEntries
}

if ($newTree.sha -eq $baseTreeSha) {
  Write-Host "No remote file changes detected. Nothing to commit."
  exit 0
}

Write-Host "Creating commit..."
$newCommit = Invoke-GitHubApi -Method "Post" -Uri "$apiBase/git/commits" -Body @{
  message = $CommitMessage
  tree = $newTree.sha
  parents = @($headSha)
}

Write-Host "Updating branch..."
Invoke-GitHubApi -Method "Patch" -Uri "$apiBase/git/refs/heads/$Branch" -Body @{
  sha = $newCommit.sha
  force = $false
} | Out-Null

Write-Host ""
Write-Host "Published QA artifacts."
Write-Host "Commit: $($newCommit.sha)"
Write-Host "URL: https://github.com/$RepoOwner/$RepoName/commit/$($newCommit.sha)"
