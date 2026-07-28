param(
  [string]$InputPath = "qa-ai-workflow/test-cases/riffables-master.test-cases.md",
  [string]$OutputPath = "qa-ai-workflow/test-cases/exports/riffables-master.test-cases.vi.xlsx"
)

$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$DefaultNode = Join-Path $env:USERPROFILE ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe"
$DefaultNodeModules = Join-Path $env:USERPROFILE ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"

$NodeExe = $env:CODEX_NODE_EXE
if (-not $NodeExe) {
  if (Test-Path $DefaultNode) {
    $NodeExe = $DefaultNode
  } else {
    $NodeCommand = Get-Command node -ErrorAction SilentlyContinue
    if ($NodeCommand) {
      $NodeExe = $NodeCommand.Source
    }
  }
}

if (-not $NodeExe -or -not (Test-Path $NodeExe)) {
  throw "Cannot find Node.js. Set CODEX_NODE_EXE or run inside the Codex runtime."
}

$ArtifactNodeModules = $env:CODEX_NODE_MODULES
if (-not $ArtifactNodeModules) {
  $ArtifactNodeModules = $DefaultNodeModules
}

if (-not (Test-Path (Join-Path $ArtifactNodeModules "@oai/artifact-tool"))) {
  throw "Cannot find @oai/artifact-tool. Set CODEX_NODE_MODULES to the bundled node_modules path."
}

Push-Location $RepoRoot
try {
  & $NodeExe `
    (Join-Path $PSScriptRoot "export-testcases-excel-vi.mjs") `
    "--input" $InputPath `
    "--output" $OutputPath `
    "--artifact-node-modules" $ArtifactNodeModules
} finally {
  Pop-Location
}

