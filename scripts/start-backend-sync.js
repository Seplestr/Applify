#!/usr/bin/env node
/**
 * This script is used to start the backend server before the frontend dev server.
 * It waits for the backend to be ready before starting the frontend.
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const backendDir = path.join(__dirname, '../backend');
const venvDir = path.join(backendDir, 'venv');
const pythonExecutable = process.platform === 'win32'
  ? path.join(venvDir, 'Scripts', 'python.exe')
  : path.join(venvDir, 'bin', 'python');

// Start the backend server
const env = Object.assign({}, process.env);
// Ensure Python can import top-level backend packages (core, api, etc.)
env.PYTHONPATH = path.join(backendDir, 'src');

const backend = spawn(pythonExecutable, ['-m', 'uvicorn', 'src.main:app', '--host', '127.0.0.1', '--port', '8000'], {
  cwd: backendDir,
  stdio: 'inherit',
  env,
});

// Function to check if the backend is ready
function checkBackendReady(callback) {
  const maxAttempts = 30;
  let attempts = 0;
  let resolved = false;

  const tryConnect = () => {
    if (resolved) return;

    const req = http.get('http://127.0.0.1:8000/docs', (res) => {
      res.resume(); // Consume response data to free up socket
      if (res.statusCode === 200) {
        if (!resolved) {
          resolved = true;
          console.log('Backend is ready!');
          callback(null);
        }
      } else {
        retry();
      }
    });

    req.on('error', () => {
      retry();
    });
  };

  const retry = () => {
    if (resolved) return;
    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(tryConnect, 1000);
    } else {
      if (!resolved) {
        resolved = true;
        callback(new Error('Backend did not start in time.'));
      }
    }
  };

  tryConnect();
}

// Wait for the backend to be ready
checkBackendReady((err) => {
  if (err) {
    console.error(err.message);
    backend.kill();
    process.exit(1);
  }
});