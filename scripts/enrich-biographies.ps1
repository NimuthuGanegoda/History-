# PowerShell script to merge enriched biographies into HTML pages
# Reads data/kings.json and data/enriched-biographies.json
# Injects enriched biography sections into html-output/kings/*.html

$ErrorActionPreference = "Stop"

# Use resolved paths
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir

$kingsPath = Join-Path $rootDir "data\kings.json"
$enrichedPath = Join-Path $rootDir "data\enriched-biographies.json"
$outputDir = Join-Path $rootDir "html-output\kings"

Write-Host "Working directory: $rootDir" -ForegroundColor Cyan
Write-Host "Loading JSON data..." -ForegroundColor Cyan

if (-not (Test-Path $kingsPath)) {
    Write-Error "Kings JSON not found at: $kingsPath"
    exit 1
}

if (-not (Test-Path $enrichedPath)) {
    Write-Error "Enriched biographies JSON not found at: $enrichedPath"
    exit 1
}

$kings = Get-Content $kingsPath -Raw -Encoding UTF8 | ConvertFrom-Json
$enriched = Get-Content $enrichedPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Build lookup map
$enrichedMap = @{}
foreach ($entry in $enriched) {
    if ($entry.slug -and $entry.biography_enriched) {
        $enrichedMap[$entry.slug] = $entry.biography_enriched.Trim()
    }
}

Write-Host "Found $($enrichedMap.Count) enriched biographies" -ForegroundColor Green
Write-Host "Processing HTML files in: $outputDir`n" -ForegroundColor Cyan

$count = 0
$skipped = 0
foreach ($king in $kings) {
    $slug = $king.slug
    if (-not $enrichedMap.ContainsKey($slug)) {
        continue
    }
    
    $htmlPath = Join-Path $outputDir "$slug.html"
    if (-not (Test-Path $htmlPath)) {
        Write-Warning "[skip] No HTML file for slug '$slug'"
        $skipped++
        continue
    }
    
    $html = Get-Content $htmlPath -Raw -Encoding UTF8
    
    # Check if detailed section already exists
    if ($html -match '<section id="biography"') {
        Write-Host "[skip] Section exists: '$slug'" -ForegroundColor DarkGray
        $skipped++
        continue
    }
    
    # Find placeholder
    $placeholderPattern = '(\s*)<h2>Biography</h2>\s*<p>Historical information coming soon\.</p>'
    if ($html -notmatch $placeholderPattern) {
        Write-Host "[skip] No placeholder: '$slug'" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    # Generate section
    $enrichedText = $enrichedMap[$slug] -replace '"', '&quot;' -replace '<', '&lt;' -replace '>', '&gt;'
    $enrichedText = $enrichedText -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"'
    $name = $king.name
    $reign = $king.reign
    
    $section = @"
            <div class="content-section">
                <h2>Biography</h2>
                <section id="biography" class="biography">
                    <h3>Overview</h3>
                    <p><strong>$name</strong> ($reign) – $enrichedText</p>
                    <div class="notice" style="background:#f5f8ff;border:1px solid #d0daf5;padding:12px;border-radius:8px;font-size:14px;">
                        <strong>Source Note:</strong> Enriched narrative synthesized from early Sri Lankan chronicles (e.g. Mahāvaṃsa) and modern historiographical patterns; phrasing is original and avoids verbatim reproduction.
                    </div>
                </section>
            </div>
"@
    
    # Replace placeholder with full section
    $pattern = '\s*<div class="content-section">\s*<h2>Biography</h2>\s*<p>Historical information coming soon\.</p>\s*</div>'
    $newHtml = $html -replace $pattern, $section
    
    # Write back
    Set-Content -Path $htmlPath -Value $newHtml -NoNewline -Encoding UTF8
    Write-Host "[✓] Updated: $slug" -ForegroundColor Green
    $count++
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Completed!" -ForegroundColor Green
Write-Host "  Updated: $count files" -ForegroundColor Green
Write-Host "  Skipped: $skipped files" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
