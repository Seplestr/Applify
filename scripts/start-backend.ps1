# Start BACKEND ONLY for development on Windows PowerShell
# This script is called by dev.bat and starts the Python backend
# The frontend is started separately by the npm dev script

set-StrictMode -Version Latest

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path "$PSScriptRoot\.."; $repoRoot = $repoRoot.Path

# 1) Find Python 3.10 explicitly. Prefer the Windows py launcher with -3.10.
$pythonCmd = $null
try {
  $v = & py -3.10 -c "import sys; print(sys.version)" 2>$null
  if ($LASTEXITCODE -eq 0 -and $v -match '^3\.10') { $pythonCmd = 'py -3.10' }
} catch { }

if (-not $pythonCmd) {
  try {
    $v = & python3.10 -c "import sys; print(sys.version)" 2>$null
    if ($LASTEXITCODE -eq 0 -and $v -match '^3\.10') { $pythonCmd = 'python3.10' }
  } catch { }
}

if (-not $pythonCmd) {
  try {
    $v = & python -c "import sys; print(sys.version)" 2>$null
    if ($LASTEXITCODE -eq 0 -and $v -match '^3\.10') { $pythonCmd = 'python' }
  } catch { }
}

if (-not $pythonCmd) {
  Write-Host "Python 3.10 was not found. Please install Python 3.10 and ensure 'py -3.10' or 'python3.10' is available." -ForegroundColor Red
  exit 1
}

Write-Host "Using Python command: $pythonCmd"

# Normalize to executable + args to avoid cmd quoting issues
$pythonExe = $null
$pythonArg = $null
if ($pythonCmd -eq 'py -3.10') { $pythonExe = 'py'; $pythonArg = '-3.10' }
elseif ($pythonCmd -eq 'python3.10') { $pythonExe = 'python3.10'; $pythonArg = '' }
elseif ($pythonCmd -eq 'python') { $pythonExe = 'python'; $pythonArg = '' }

# 2) Create virtualenv in backend/venv if needed
$venvPath = Join-Path $repoRoot 'backend\venv'
if (!(Test-Path $venvPath)) {
  Write-Host "Creating virtual environment at $venvPath"
  $venvArgs = @()
  if ($pythonArg -and $pythonArg.Length -gt 0) { $venvArgs += $pythonArg }
  $venvArgs += '-m'
  $venvArgs += 'venv'
  $venvArgs += "$venvPath"
  & $pythonExe $venvArgs
}

# Get venv python path
$venvPython = Join-Path $venvPath 'Scripts\python.exe'
if (!(Test-Path $venvPython)) {
  Write-Host "Virtualenv python not found at $venvPython" -ForegroundColor Red
  exit 1
}

# 3) Install backend requirements using venv python
Write-Host "Installing backend Python dependencies..."
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install -r "$repoRoot\backend\requirements.txt"

# 4) Ensure backend logs directory
$logsDir = Join-Path $repoRoot 'backend\logs'
New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
$backendOut = Join-Path $logsDir 'backend.out.log'
$backendErr = Join-Path $logsDir 'backend.err.log'
$backendLog = Join-Path $logsDir 'backend.log'

# 5) Start backend in background using venv python and uvicorn
Write-Host "Starting backend in background..."
Write-Host "Backend logs: $backendLog"

# Set PYTHONPATH so backend.src modules can be imported
$pythonPath = Join-Path $repoRoot 'backend\src'

# Start the backend as a background job
$scriptBlock = {
  param($venvPythonPath, $workDir, $pythonPath, $outPath, $errPath)
  $env:PYTHONPATH = $pythonPath
  Set-Location $workDir
  & $venvPythonPath -m uvicorn backend.src.main:app --host 127.0.0.1 --port 8000 > $outPath 2> $errPath
}

Start-Job -ScriptBlock $scriptBlock -ArgumentList $venvPython, $repoRoot, $pythonPath, $backendOut, $backendErr | Out-Null

# Merge logs and display
Start-Sleep -Seconds 2
Get-Content -Path $backendOut -ErrorAction SilentlyContinue | Out-File -FilePath $backendLog -Encoding UTF8
Get-Content -Path $backendErr -ErrorAction SilentlyContinue | Out-File -FilePath $backendLog -Append -Encoding UTF8

# Show startup output
Write-Host "Backend startup log (last 20 lines):"
Get-Content -Path $backendLog -Tail 20 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_ }

Write-Host "Backend started successfully on http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Frontend will be started by npm dev server..." -ForegroundColor Green
