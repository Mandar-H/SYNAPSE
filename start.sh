#!/bin/bash

# Synapse - Bash Startup Script
echo "========================================"
echo "  Synapse - Starting Application"
echo "========================================"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo "[WARNING] Python not found, but continuing..."
    PYTHON_CMD=""
fi

if [ ! -z "$PYTHON_CMD" ]; then
    echo "[OK] Python found: $($PYTHON_CMD --version)"
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo "[OK] Node.js found: $(node --version)"
else
    echo "[WARNING] Node.js not found, but continuing..."
fi

echo ""
echo "[1/4] Setting up backend..."
if [ ! -d "summarize" ]; then
    echo "[ERROR] summarize directory not found!"
    exit 1
fi

cd summarize

# Create venv if needed
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    if [ ! -z "$PYTHON_CMD" ]; then
        $PYTHON_CMD -m venv venv
    fi
fi

# Activate venv
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "[OK] Virtual environment activated"
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
    echo "[OK] Virtual environment activated"
fi

# Install requirements if needed
if [ -f "requirements.txt" ]; then
    python -c "import fastapi" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "Installing Python dependencies..."
        pip install -r requirements.txt --quiet
    else
        echo "[OK] Backend dependencies installed"
    fi
fi

cd "$SCRIPT_DIR"

echo ""
echo "[2/4] Setting up frontend..."
if [ ! -d "SYNAPSE" ]; then
    echo "[ERROR] SYNAPSE directory not found!"
    exit 1
fi

cd SYNAPSE

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[WARNING] npm install had issues, but continuing..."
    fi
else
    echo "[OK] Frontend dependencies installed"
fi

cd "$SCRIPT_DIR"

echo ""
echo "[3/4] Starting backend server..."

# Start backend in background
if [ -f "summarize/venv/bin/python" ]; then
    cd summarize
    source venv/bin/activate
    python main.py &
    BACKEND_PID=$!
    cd "$SCRIPT_DIR"
elif [ -f "summarize/venv/Scripts/python.exe" ]; then
    # Windows Git Bash
    start "Synapse Backend" cmd //c "cd /d $SCRIPT_DIR/summarize && venv\\Scripts\\activate.bat && python main.py"
    BACKEND_PID=$!
else
    cd summarize
    python main.py &
    BACKEND_PID=$!
    cd "$SCRIPT_DIR"
fi

echo "Backend starting (PID: $BACKEND_PID)"
sleep 5

echo ""
echo "[4/4] Starting frontend server..."

# Start frontend
cd SYNAPSE
npm start &
FRONTEND_PID=$!
cd "$SCRIPT_DIR"

echo ""
echo "========================================"
echo "  Application Started!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop servers..."

# Wait for interrupt
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
