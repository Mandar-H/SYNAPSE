# 🚀 Quick Start Guide

## Start Everything with One Command

Choose the script for your operating system:

### Windows Users

**Option 1: Double-click `start.bat`**
- Just double-click the file in Windows Explorer
- Or run from Command Prompt: `start.bat`

**Option 2: PowerShell**
```powershell
.\start.ps1
```

### Linux/Mac Users

```bash
chmod +x start.sh
./start.sh
```

### Cross-Platform (Node.js)

```bash
node start.js
```

### Using npm

From the root directory:
```bash
npm start
```

From SYNAPSE directory:
```bash
cd SYNAPSE
npm run start:all
```

## What Happens When You Run the Script?

1. ✅ **Checks** if Python and Node.js are installed
2. ✅ **Creates** Python virtual environment (if needed)
3. ✅ **Installs** all dependencies automatically
4. ✅ **Starts** backend server on port 8000
5. ✅ **Starts** frontend server on port 3000
6. ✅ **Opens** your browser automatically (frontend)

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## First Time Setup

On first run, the script will:
- Download Python packages (~500MB)
- Download NLP models (~100MB)
- Install Node.js packages (~200MB)

This may take 5-10 minutes depending on your internet speed.

## Stopping the Application

Press `Ctrl+C` in the terminal where you ran the script, or close the terminal windows.

## Troubleshooting

### "Python not found"
- Install Python 3.8+ from https://www.python.org/
- Make sure to check "Add Python to PATH" during installation

### "Node.js not found"
- Install Node.js 14+ from https://nodejs.org/
- Restart your terminal after installation

### "Port already in use"
- Close other applications using ports 3000 or 8000
- Or change ports in the configuration files

### "MongoDB connection failed"
- Check your internet connection
- Verify MongoDB Atlas is accessible
- Check firewall settings

## Manual Start (If Scripts Don't Work)

### Terminal 1 - Backend
```bash
cd summarize
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
```

### Terminal 2 - Frontend
```bash
cd SYNAPSE
npm install
npm start
```

## Need Help?

- Check `README.md` for detailed documentation
- Check `SETUP.md` for setup instructions
- Check `IMPLEMENTATION_SUMMARY.md` for technical details
- View API docs at http://localhost:8000/docs (when backend is running)

---

**That's it! You're ready to upload and summarize documents! 🎉**

