@echo off
REM Force script to run from its own directory
cd /d "%~dp0"

echo ========================================
echo   Synapse - Starting Application
echo ========================================
echo.

REM Check Python - try multiple commands
set PYTHON_CMD=
python --version >nul 2>&1 && set PYTHON_CMD=python
if not defined PYTHON_CMD (
    python3 --version >nul 2>&1 && set PYTHON_CMD=python3
)
if not defined PYTHON_CMD (
    py --version >nul 2>&1 && set PYTHON_CMD=py
)

if not defined PYTHON_CMD (
    echo [WARNING] Python not found, but continuing anyway...
    echo You may need to install Python 3.8+ from https://www.python.org/
) else (
    echo [OK] Python found
    %PYTHON_CMD% --version
)

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Node.js not found, but continuing anyway...
    echo You may need to install Node.js 14+ from https://nodejs.org/
) else (
    echo [OK] Node.js found
    node --version
)

echo.
echo [1/4] Setting up backend...
cd /d "%~dp0"
if not exist "summarize" (
    echo [ERROR] summarize directory not found!
    echo Current directory: %CD%
    pause
    exit /b 1
)

cd summarize

REM Create venv if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    if defined PYTHON_CMD (
        %PYTHON_CMD% -m venv venv
    ) else (
        echo [SKIP] Cannot create venv without Python
    )
)

REM Activate venv if it exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    set VENV_ACTIVE=1
) else if exist "venv\bin\activate" (
    call venv\bin\activate
    set VENV_ACTIVE=1
) else (
    echo [WARNING] Virtual environment not found, using system Python
    set VENV_ACTIVE=0
)

REM Check and install requirements
if exist "requirements.txt" (
    python -c "import fastapi" >nul 2>&1
    if errorlevel 1 (
        echo Installing Python dependencies...
        if defined VENV_ACTIVE (
            pip install -r requirements.txt --quiet
        ) else (
            if defined PYTHON_CMD (
                %PYTHON_CMD% -m pip install -r requirements.txt --quiet
            )
        )
    ) else (
        echo [OK] Backend dependencies already installed
    )
) else (
    echo [WARNING] requirements.txt not found
)

cd /d "%~dp0"

echo.
echo [2/4] Setting up frontend...
if not exist "SYNAPSE" (
    echo [ERROR] SYNAPSE directory not found!
    pause
    exit /b 1
)

cd SYNAPSE

if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
    if errorlevel 1 (
        echo [WARNING] npm install had issues, but continuing...
    )
) else (
    echo [OK] Frontend dependencies already installed
)

cd /d "%~dp0"

echo.
echo [3/4] Starting backend server...
if exist "summarize\venv\Scripts\activate.bat" (
    start "Synapse Backend" cmd /k "cd /d %~dp0summarize && call venv\Scripts\activate.bat && python main.py"
) else if exist "summarize\venv\bin\activate" (
    start "Synapse Backend" cmd /k "cd /d %~dp0summarize && source venv/bin/activate && python main.py"
) else (
    start "Synapse Backend" cmd /k "cd /d %~dp0summarize && python main.py"
)

REM Wait for backend
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Starting frontend server...
start "Synapse Frontend" cmd /k "cd /d %~dp0SYNAPSE && npm start"

echo.
echo ========================================
echo   Application Started!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Two new windows should have opened.
echo Close those windows to stop the servers.
echo.
echo This window will close in 10 seconds...
timeout /t 10 /nobreak >nul
