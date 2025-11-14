@echo off
REM Batch file to start the BACKEND ONLY
REM The frontend is started separately by electron-vite

powershell -ExecutionPolicy Bypass -File "%~dp0scripts\start-backend.ps1"
