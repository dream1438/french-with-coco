# Opens the Coco web app in your browser through a small local web server
# (YouTube videos need http://, they don't play from a file:// page).
# Run: right-click > Run with PowerShell. Close this window to stop the server.
$root = $PSScriptRoot; $port = 8787
$l = New-Object System.Net.HttpListener; $l.Prefixes.Add("http://localhost:$port/"); $l.Start()
Start-Process "http://localhost:$port/"
Write-Host "Coco app running at http://localhost:$port/  (close this window to stop)"
$types = @{'.html'='text/html; charset=utf-8';'.js'='text/javascript; charset=utf-8';'.css'='text/css; charset=utf-8';'.svg'='image/svg+xml';'.png'='image/png';'.json'='application/json'}
while ($l.IsListening) {
  $c = $l.GetContext(); $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
  if ($p -eq '') { $p = 'index.html' }
  $f = Join-Path $root $p
  if ((Test-Path $f -PathType Leaf) -and ((Resolve-Path $f).Path.StartsWith($root))) {
    $b = [IO.File]::ReadAllBytes($f); $c.Response.ContentType = $types[[IO.Path]::GetExtension($f)]
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
