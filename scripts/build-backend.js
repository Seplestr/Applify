const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const rootDir = path.join(__dirname, '..')
const backendDir = path.join(rootDir, 'backend')
const venvDir = path.join(backendDir, 'venv')

const pythonExecutable =
  process.platform === 'win32' ? path.join(venvDir, 'Scripts', 'python.exe') : path.join(venvDir, 'bin', 'python')

console.log('Building Python backend...')
console.log('Using Python:', pythonExecutable)

if (!fs.existsSync(pythonExecutable)) {
  console.error('Python executable not found in virtual environment. Please run npm run dev or setup first.')
  process.exit(1)
}

// Run PyInstaller on the spec file
const result = spawnSync(pythonExecutable, ['-m', 'PyInstaller', '--clean', 'applify.spec'], {
  cwd: backendDir,
  stdio: 'inherit',
})

if (result.status !== 0) {
  console.error('Failed to build Python backend.')
  process.exit(result.status || 1)
}

console.log('Python backend built successfully!')
