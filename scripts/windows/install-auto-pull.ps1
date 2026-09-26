# One-time setup: Scheduled Task that auto-pulls Omnidot every 2 minutes.
# Run from an elevated or normal PowerShell:
#   powershell -ExecutionPolicy Bypass -File .\scripts\windows\install-auto-pull.ps1

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$PullScript = Join-Path $PSScriptRoot "auto-pull.ps1"
$TaskName = "OmnidotAutoPull"

if (-not (Test-Path $PullScript)) {
    throw "Missing auto-pull script: $PullScript"
}

$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    throw "Git is not installed or not on PATH. Install Git for Windows first."
}

# Unregister previous task if present
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

$arg = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$PullScript`""
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arg -WorkingDirectory $RepoRoot
# Once + long repetition (MaxValue / Daily.RepetitionInterval break on Windows PowerShell)
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) `
  -RepetitionInterval (New-TimeSpan -Minutes 2) `
  -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Auto git pull for Omnidot Desktop folder" | Out-Null

# Run once immediately so the first sync doesn't wait
Start-ScheduledTask -TaskName $TaskName

Write-Host ""
Write-Host "Installed scheduled task: $TaskName"
Write-Host "Repo: $RepoRoot"
Write-Host "Interval: every 2 minutes (skips if you have local unsaved/uncommitted edits)"
Write-Host "Log: $env:LOCALAPPDATA\OmnidotSync\auto-pull.log"
Write-Host ""
Write-Host "To remove later:"
Write-Host "  powershell -ExecutionPolicy Bypass -File .\scripts\windows\uninstall-auto-pull.ps1"
Write-Host "  # or: Unregister-ScheduledTask -TaskName $TaskName -Confirm:`$false"
Write-Host ""
