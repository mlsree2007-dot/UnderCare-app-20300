@echo off
title Undercare Health System
echo =====================================================
echo   STARTING UNDERCARE APP (Frontend + Backend + DB)
echo =====================================================
echo.
echo Launching browser...
timeout /t 3 >nul
start http://localhost:3000

echo Starting server...
npm run dev
pause
