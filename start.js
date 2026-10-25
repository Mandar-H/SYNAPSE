/**
 * Synapse - Unified Startup Script
 * Starts both backend and frontend servers together
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command) {
  return new Promise((resolve) => {
    const process = spawn(command, ['--version'], { stdio: 'ignore' });
    process.on('close', (code) => resolve(code === 0));
    process.on('error', () => resolve(false));
  });
}

async function checkDependencies() {
  log('\n========================================', 'cyan');
  log('  Synapse - Starting Application', 'cyan');
  log('========================================\n', 'cyan');

  log('Checking dependencies...', 'yellow');
  
  const hasPython = await checkCommand('python');
  const hasNode = await checkCommand('node');

  if (!hasPython) {
    log('[ERROR] Python is not installed or not in PATH', 'red');
    log('Please install Python 3.8 or higher', 'yellow');
    process.exit(1);
  }
  log('[OK] Python found', 'green');

  if (!hasNode) {
    log('[ERROR] Node.js is not installed or not in PATH', 'red');
    log('Please install Node.js 14 or higher', 'yellow');
    process.exit(1);
  }
  log('[OK] Node.js found', 'green');
}

function setupBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = path.join(__dirname, 'summarize');
    const venvPath = path.join(backendPath, 'venv');
    const requirementsPath = path.join(backendPath, 'requirements.txt');

    log('\n[1/4] Setting up backend...', 'yellow');

    // Check if venv exists
    if (!fs.existsSync(venvPath)) {
      log('Creating Python virtual environment...', 'yellow');
      const venvProcess = spawn('python', ['-m', 'venv', 'venv'], {
        cwd: backendPath,
        stdio: 'inherit'
      });

      venvProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Failed to create virtual environment'));
          return;
        }
        checkBackendDeps(backendPath, resolve, reject);
      });
    } else {
      checkBackendDeps(backendPath, resolve, reject);
    }
  });
}

function checkBackendDeps(backendPath, resolve, reject) {
  const isWindows = process.platform === 'win32';
  const pythonCmd = isWindows 
    ? path.join(backendPath, 'venv', 'Scripts', 'python.exe')
    : path.join(backendPath, 'venv', 'bin', 'python');

  const checkProcess = spawn(pythonCmd, ['-c', 'import fastapi'], {
    cwd: backendPath,
    stdio: 'ignore'
  });

  checkProcess.on('close', (code) => {
    if (code === 0) {
      log('[OK] Backend dependencies installed', 'green');
      resolve();
    } else {
      log('Installing Python dependencies...', 'yellow');
      const pipCmd = isWindows
        ? path.join(backendPath, 'venv', 'Scripts', 'pip.exe')
        : path.join(backendPath, 'venv', 'bin', 'pip');

      const installProcess = spawn(pipCmd, ['install', '-r', 'requirements.txt'], {
        cwd: backendPath,
        stdio: 'inherit'
      });

      installProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Failed to install Python dependencies'));
        } else {
          log('[OK] Backend dependencies installed', 'green');
          resolve();
        }
      });
    }
  });
}

function setupFrontend() {
  return new Promise((resolve, reject) => {
    const frontendPath = path.join(__dirname, 'SYNAPSE');
    const nodeModulesPath = path.join(frontendPath, 'node_modules');

    log('\n[2/4] Setting up frontend...', 'yellow');

    if (!fs.existsSync(nodeModulesPath)) {
      log('Installing Node.js dependencies...', 'yellow');
      const installProcess = spawn('npm', ['install'], {
        cwd: frontendPath,
        stdio: 'inherit'
      });

      installProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Failed to install Node.js dependencies'));
        } else {
          log('[OK] Frontend dependencies installed', 'green');
          resolve();
        }
      });
    } else {
      log('[OK] Frontend dependencies installed', 'green');
      resolve();
    }
  });
}

function startBackend() {
  return new Promise((resolve) => {
    log('\n[3/4] Starting backend server...', 'yellow');
    
    const backendPath = path.join(__dirname, 'summarize');
    const isWindows = process.platform === 'win32';
    
    let pythonCmd;
    if (isWindows) {
      pythonCmd = path.join(backendPath, 'venv', 'Scripts', 'python.exe');
    } else {
      pythonCmd = path.join(backendPath, 'venv', 'bin', 'python');
    }

    const backendProcess = spawn(pythonCmd, ['main.py'], {
      cwd: backendPath,
      stdio: 'inherit'
    });

    backendProcess.on('error', (err) => {
      log(`[ERROR] Failed to start backend: ${err.message}`, 'red');
    });

    // Wait a bit for backend to start
    setTimeout(() => {
      resolve(backendProcess);
    }, 3000);
  });
}

function startFrontend() {
  return new Promise((resolve) => {
    log('\n[4/4] Starting frontend server...', 'yellow');
    
    const frontendPath = path.join(__dirname, 'SYNAPSE');
    
    const frontendProcess = spawn('npm', ['start'], {
      cwd: frontendPath,
      stdio: 'inherit',
      env: { ...process.env, BROWSER: 'none' } // Don't auto-open browser
    });

    frontendProcess.on('error', (err) => {
      log(`[ERROR] Failed to start frontend: ${err.message}`, 'red');
    });

    resolve(frontendProcess);
  });
}

async function main() {
  try {
    await checkDependencies();
    await setupBackend();
    await setupFrontend();

    // Ensure important env vars are set for child processes
    if (!process.env.MONGODB_URL) {
      log('[WARN] MONGODB_URL not set - database persistence is disabled', 'yellow');
    }

    // REACT_APP_API_URL: used by the frontend dev server to call backend
    if (!process.env.REACT_APP_API_URL) {
      process.env.REACT_APP_API_URL = 'http://localhost:8000';
      log('[INFO] REACT_APP_API_URL not set - defaulting to http://localhost:8000', 'yellow');
    }

    const backendProcess = await startBackend();
    // Pass updated env vars to the frontend process so it can pick up REACT_APP_API_URL
    const frontendProcess = await startFrontend();

    log('\n========================================', 'cyan');
    log('  Application Started Successfully!', 'green');
    log('========================================\n', 'cyan');
    log('Backend:  http://localhost:8000', 'yellow');
    log('Frontend: http://localhost:3000', 'yellow');
    log('\nPress Ctrl+C to stop all servers...\n', 'gray');

    // Handle cleanup on exit
    process.on('SIGINT', () => {
      log('\n\nStopping servers...', 'yellow');
      backendProcess.kill();
      frontendProcess.kill();
      log('Servers stopped.', 'green');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });

  } catch (error) {
    log(`\n[ERROR] ${error.message}`, 'red');
    process.exit(1);
  }
}

main();

