@echo off
REM Force run from script directory
cd /d "%~dp0"

title Synapse - Quick Start
color 0A
cls

echo.
echo   ================================================
echo     SYNAPSE - Document Summarization App
echo   ================================================
echo.
echo   Starting servers...
echo.

REM Try to start backend
echo [1/2] Starting Backend...
if exist "summarize\venv\Scripts\python.exe" (
    start "Synapse Backend Server" cmd /k "title Synapse Backend && cd /d %~dp0summarize && venv\Scripts\python.exe main.py"
    echo     Backend starting in new window...
) else if exist "summarize\main.py" (
    start "Synapse Backend Server" cmd /k "title Synapse Backend && cd /d %~dp0summarize && python main.py"
    echo     Backend starting in new window...
) else (
    echo     [WARNING] Backend files not found
)

timeout /t 4 /nobreak >nul

REM Try to start frontend
echo [2/2] Starting Frontend...
if exist "SYNAPSE\package.json" (
    start "Synapse Frontend Server" cmd /k "title Synapse Frontend && cd /d %~dp0SYNAPSE && npm start"
    echo     Frontend starting in new window...
) else (
    echo     [WARNING] Frontend files not found
)

echo.
echo   ================================================
echo     SERVERS STARTING!
echo   ================================================
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo.
echo   Two windows should have opened above.
echo   Wait 30 seconds for everything to load.
echo.
echo   Press any key to close this window...
pause >nul

