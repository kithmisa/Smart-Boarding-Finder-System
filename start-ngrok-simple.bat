@echo off
echo Starting ngrok for PayHere testing...
echo.

echo IMPORTANT: First, get your auto-generated domain from ngrok dashboard:
echo 1. Go to https://dashboard.ngrok.com/
echo 2. Go to "Universal Gateway" -^> "Domains"
echo 3. Copy your auto-generated domain (e.g., abc123def456.ngrok-free.app)
echo 4. Replace "YOUR_DOMAIN" below with your auto-generated domain
echo.

echo Step 1: Starting frontend ngrok (port 3000)...
start "Frontend ngrok" cmd /k "cd /d C:\ngrok && C:\ngrok\ngrok.exe http 3000 --domain=untrepanned-kinley-raspingly.ngrok-free.app"

echo.
echo Your stable URL will be:
echo Frontend: https://untrepanned-kinley-raspingly.ngrok-free.app
echo.
echo For backend, we'll use a regular ngrok URL (changes each time)
echo Start backend ngrok separately: ngrok http 5000
echo.
echo Update your .env file with the frontend URL.
echo Register the frontend URL with PayHere.
echo.
echo Press any key to continue...
pause
