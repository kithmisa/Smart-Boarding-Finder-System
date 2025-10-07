@echo off
echo Starting ngrok for PayHere testing...
echo.

echo IMPORTANT: First, get your auto-generated domain from ngrok dashboard:
echo 1. Go to https://dashboard.ngrok.com/
echo 2. Go to "Universal Gateway" -^> "Domains"
echo 3. Copy your auto-generated domain (e.g., abc123def456.ngrok-free.app)
echo 4. Replace "YOUR_DOMAIN" below with your auto-generated domain
echo.

echo Step 1: Starting backend ngrok (port 5000)...
start "Backend ngrok" cmd /k "cd /d C:\ngrok && ngrok http 5000 --domain=YOUR_DOMAIN.ngrok-free.app"

echo Step 2: Starting frontend ngrok (port 3000)...
start "Frontend ngrok" cmd /k "cd /d C:\ngrok && ngrok http 3000 --domain=YOUR_DOMAIN.ngrok-free.app"

echo.
echo Your stable URLs will be:
echo Frontend: https://YOUR_DOMAIN.ngrok-free.app
echo Backend: https://YOUR_DOMAIN.ngrok-free.app
echo.
echo Update your .env file with these URLs.
echo.
echo Press any key to continue...
pause
