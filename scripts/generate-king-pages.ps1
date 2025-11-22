# Read the kings.json file
$jsonContent = Get-Content "data/kings.json" | Out-String
$kings = $jsonContent | ConvertFrom-Json

# Create the output directory if it doesn't exist
$outputDir = "html-output/kings"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Counter for progress
$count = 0
$total = $kings.Count

# Generate HTML for each king
foreach ($king in $kings) {
    $count++
    $slug = $king.slug
    $name = $king.name
    $reign = $king.reign
    $kingdom = $king.kingdom
    
    # Use biography if it exists, otherwise use placeholder
    if ($king.biography) {
        $biography = $king.biography
    } else {
        $biography = "Historical information coming soon."
    }
    
    # Escape any special characters in the biography
    $biography = $biography -replace '"', '&quot;'
    
    # Create the HTML content
    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$name - Sri Lanka History</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="nav-container">
                <a href="../index.html" class="logo">🏛️ Sri Lanka History</a>
                <div class="nav-links">
                    <a href="../kingdoms.html">Kingdoms</a>
                    <a href="../kings.html">Kings</a>
                    <a href="../sites.html">Sites</a>
                </div>
            </div>
        </nav>
    </header>
    <main>
        <div class="container">
            <div class="breadcrumbs">
                <a href="../index.html">Home</a> / <a href="../kings.html">Kings</a> / $name
            </div>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 40px; border-radius: 12px; margin-bottom: 30px;">
                <h1 style="font-size: 56px; margin-bottom: 15px;">$name</h1>
                <div style="display: flex; gap: 30px; font-size: 16px;">
                    <div><span>👑</span> Reign: $reign</div>
                    <div><span>🏛️</span> Kingdom: $kingdom</div>
                </div>
            </div>
            <div class="content-section">
                <h2>Biography</h2>
                <p>$biography</p>
            </div>
        </div>
    </main>
    <footer>
        <div class="container">
            <p>&copy; 2025 Sri Lanka History Project</p>
        </div>
    </footer>
</body>
</html>
"@
    
    # Write the HTML file
    $filePath = Join-Path $outputDir "$slug.html"
    $html | Out-File -FilePath $filePath -Encoding UTF8
    
    Write-Host "[$count/$total] Created: $slug.html"
}

Write-Host "`nCompleted! Generated $count HTML files for kings."
