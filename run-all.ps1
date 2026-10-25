# Run-all wrapper for Windows PowerShell
# This script runs the unified Node starter (start.js) which sets up and launches
# the backend and frontend. Run this from the repository root.

param(
    [string]$MongoUrl = $null,
    [string]$ApiUrl = $null
)

# Optionally accept env overrides
if ($MongoUrl) { $env:MONGODB_URL = $MongoUrl }
if ($ApiUrl) { $env:REACT_APP_API_URL = $ApiUrl }

Write-Host "Starting Synapse full-stack application..."
Write-Host "REACT_APP_API_URL = $($env:REACT_APP_API_URL)"

# Use node to run the starter (reads/creates virtualenv and runs servers)
node .\start.js

Write-Host "start.js exited"
