@echo off
echo Starting localtunnel for PayHere testing...
echo.

echo Step 1: Installing localtunnel (if not already installed)...
npm install -g localtunnel

echo.
echo Step 2: Starting frontend tunnel (port 3000)...
start "Frontend Tunnel" cmd /k "lt --port 3000 --subdomain smartboarding"

echo Step 3: Starting backend tunnel (port 5000)...
start "Backend Tunnel" cmd /k "lt --port 5000 --subdomain smartboarding-backend"

echo.
echo Your stable URLs will be:
echo Frontend: https://smartboarding.loca.lt
echo Backend: https://smartboarding-backend.loca.lt
echo.
echo Update your .env file with these URLs.
echo Register smartboarding.loca.lt with PayHere.
echo.
echo Press any key to continue...
pause