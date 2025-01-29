# Run this development PowerShell Script at your own discretion
# This script has not gone under rigorous testing

param (
    [String]$firstArg
)

$nodeVersion = node -v 2>$null
if ($nodeVersion) {
    Write-Host "Node.js check. Version: $nodeVersion CLEAR" -ForegroundColor Green
} else {
    Write-Host "Node.js check. Node.js is NOT installed! FAIL" -ForegroundColor Red
}


$npmVersion = npm -v 2>$null
if ($npmVersion) {
    Write-Host "npm check. Version: $npmVersion CLEAR" -ForegroundColor Green
} else {
    Write-Host "npm check. npm is NOT installed! FAIL" -ForegroundColor Red
}

Write-Host "Building Project with 'npm run dev'... "


if ($firstArg){
    npm run dev -- $firstArg
} else {
    npm run dev
}
