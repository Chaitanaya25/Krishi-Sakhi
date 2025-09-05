@echo off
echo ========================================
echo    Krishi Sakhi Project Startup
echo ========================================
echo.

echo Starting Backend Server (Port 8000)...
echo Backend will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo Interactive API Docs: http://localhost:8000/redoc
echo.

echo Starting Frontend Server (Port 3000)...
echo Frontend will be available at: http://localhost:3000
echo.

echo ========================================
echo    Starting Servers...
echo ========================================
echo.

REM Start backend in a new window
start "Krishi Sakhi Backend" cmd /k "cd backend && start.bat"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
start "Krishi Sakhi Frontend" cmd /k "cd web && start.bat"

echo.
echo ========================================
echo    Servers Starting...
echo ========================================
echo.
echo Backend API:     http://localhost:8000
echo API Docs:        http://localhost:8000/docs
echo Interactive Docs: http://localhost:8000/redoc
echo Frontend:        http://localhost:3000
echo.
echo Both servers are starting in separate windows.
echo Check the windows for any error messages.
echo.
pause
