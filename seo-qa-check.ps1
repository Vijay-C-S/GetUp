Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$siteFiles = Get-ChildItem -Path $root -Recurse -Filter *.html |
    Where-Object { $_.FullName -notmatch '\\sections\\' }

$missing = New-Object System.Collections.Generic.List[object]

foreach ($file in $siteFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    foreach ($match in [regex]::Matches($content, '(?i)(?:href|src)="([^"]+)"')) {
        $target = $match.Groups[1].Value
        if ($target -match '^(https?:|mailto:|tel:|#|data:|javascript:|//)') {
            continue
        }

        $rawPath = $target.Split('#')[0].Split('?')[0]
        if ([string]::IsNullOrWhiteSpace($rawPath)) {
            continue
        }

        $resolvedPath = if ($rawPath.StartsWith('/')) {
            Join-Path $root ($rawPath.TrimStart('/'))
        } else {
            Join-Path $file.DirectoryName $rawPath
        }

        $resolvedPath = [System.IO.Path]::GetFullPath([Uri]::UnescapeDataString($resolvedPath))

        if (-not (Test-Path -LiteralPath $resolvedPath)) {
            $missing.Add([pscustomobject]@{
                File     = $file.FullName
                Target   = $target
                Resolved = $resolvedPath
            }) | Out-Null
        }
    }
}

if ($missing.Count -gt 0) {
    Write-Host 'FAIL: Broken local references found.' -ForegroundColor Red
    $missing |
        Sort-Object File, Target |
        Format-Table -AutoSize File, Target, Resolved
    exit 1
}

Write-Host 'PASS: Core SEO and technical checks passed.' -ForegroundColor Green