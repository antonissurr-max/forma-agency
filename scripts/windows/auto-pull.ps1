# Quiet auto-sync: pulls latest main when the working tree is clean.
# Installed as a Scheduled Task by install-auto-pull.ps1

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$LogDir = Join-Path $env:LOCALAPPDATA "OmnidotSync"
$LogFile = Join-Path $LogDir "auto-pull.log"

function Write-Log([string]$Message) {
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    $line = "{0:yyyy-MM-dd HH:mm:ss}  {1}" -f (Get-Date), $Message
    Add-Content -Path $LogFile -Value $line -Encoding UTF8
}

try {
    Set-Location $RepoRoot

    $git = Get-Command git -ErrorAction SilentlyContinue
    if (-not $git) {
        Write-Log "SKIP: git not found on PATH"
        exit 0
    }

    $status = & git status --porcelain
    if ($LASTEXITCODE -ne 0) {
        Write-Log "ERROR: git status failed"
        exit 1
    }
    if ($status) {
        Write-Log "SKIP: local changes present (not pulling)"
        exit 0
    }

    & git fetch origin main 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Log "ERROR: git fetch failed"
        exit 1
    }

    $local = (& git rev-parse HEAD).Trim()
    $remote = (& git rev-parse origin/main).Trim()
    if ($local -eq $remote) {
        Write-Log "OK: already up to date ($($local.Substring(0,7)))"
        exit 0
    }

    & git pull --ff-only origin main 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Log "ERROR: git pull --ff-only failed"
        exit 1
    }

    $after = (& git rev-parse HEAD).Trim()
    Write-Log "UPDATED: $($local.Substring(0,7)) -> $($after.Substring(0,7))"
    exit 0
}
catch {
    Write-Log ("ERROR: " + $_.Exception.Message)
    exit 1
}
