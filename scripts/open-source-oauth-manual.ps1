param(
  [string]$BaseUrl = "https://riffables.speedrunlabs.ai",
  [string]$ProfileDir = ".auth\chrome-oauth-profile"
)

$ErrorActionPreference = "Stop"

$chromeCandidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)

$browserPath = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browserPath) {
  throw "Could not find Chrome or Edge. Install Chrome, or pass through the Sources flow manually in an existing browser."
}

$resolvedProfile = Join-Path (Get-Location) $ProfileDir
New-Item -ItemType Directory -Path $resolvedProfile -Force | Out-Null

$targetUrl = $BaseUrl.TrimEnd("/") + "/sources"
$arguments = @(
  "--user-data-dir=$resolvedProfile",
  "--no-first-run",
  "--new-window",
  $targetUrl
)

Start-Process -FilePath $browserPath -ArgumentList $arguments

Write-Host "Opened browser: $browserPath"
Write-Host "Profile: $resolvedProfile"
Write-Host "URL: $targetUrl"
Write-Host ""
Write-Host "Manual steps:"
Write-Host "1. Sign in to Riffables with the no-source QA account."
Write-Host "2. Open Sources if it is not already open."
Write-Host "3. Enter the YouTube handle and click Verify with Google."
Write-Host "4. Complete Google owner consent in this real browser window."
Write-Host "5. Return here and run the connected-source verification."
