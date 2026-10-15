$port = 5500
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "Local web server running at http://localhost:$port/"
} catch {
    Write-Error "Failed to start listener: $_"
    exit 1
}

$dir = Split-Path -Parent $PSCommandPath
if (-not $dir) { $dir = (Get-Location).Path }

$indexPath = Join-Path $dir "index.html"
$cssPath   = Join-Path $dir "style.css"
$jsPath    = Join-Path $dir "app.js"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.ToLower()

        # Cache prevention
        $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")

        if ($path.EndsWith("style.css")) {
            $bytes = if (Test-Path $cssPath) { [System.IO.File]::ReadAllBytes($cssPath) } else { [byte[]]@() }
            $response.ContentType = "text/css; charset=utf-8"
        } elseif ($path.EndsWith("app.js")) {
            $bytes = if (Test-Path $jsPath) { [System.IO.File]::ReadAllBytes($jsPath) } else { [byte[]]@() }
            $response.ContentType = "application/javascript; charset=utf-8"
        } else {
            # Always fallback to index.html
            $bytes = if (Test-Path $indexPath) { [System.IO.File]::ReadAllBytes($indexPath) } else { [byte[]]@() }
            $response.ContentType = "text/html; charset=utf-8"
        }

        $response.ContentLength64 = $bytes.Length
        if ($request.HttpMethod -ne "HEAD" -and $bytes.Length -gt 0) {
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }

        $response.OutputStream.Close()
        Write-Host "Served: $path"
    } catch {
        Write-Warning "Request handled with error: $_"
    }
}
