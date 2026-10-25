@echo off
REM Ultra-simple runner - just starts everything
cd /d "%~dp0"

echo Starting Synapse...
echo.

REM Start backend
if exist "summarize\venv\Scripts\python.exe" (
    start "Backend" cmd /k "cd /d %~dp0summarize && venv\Scripts\python.exe main.py"
) else if exist "summarize\main.py" (
    start "Backend" cmd /k "cd /d %~dp0summarize && python main.py"
)

timeout /t 3 >nul

REM Start frontend
if exist "SYNAPSE\package.json" (
    start "Frontend" cmd /k "cd /d %~dp0SYNAPSE && npm start"
)

echo.
echo Started! Check the new windows.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause

