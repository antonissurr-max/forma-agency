# Removes the OmnidotAutoPull scheduled task (stops the flashing PowerShell window).
# Run in PowerShell:
#   powershell -ExecutionPolicy Bypass -File .\scripts\windows\uninstall-auto-pull.ps1

$ErrorActionPreference = "Stop"
$TaskName = "OmnidotAutoPull"

$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if (-not $existing) {
    Write-Host "No scheduled task named '$TaskName' — already removed."
    exit 0
}

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
Write-Host "Removed scheduled task: $TaskName"
Write-Host "PowerShell will no longer open every 2 minutes for auto-pull."
