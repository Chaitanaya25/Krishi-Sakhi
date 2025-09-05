@echo off
echo Starting Krishi Sakhi Frontend...
echo.

REM Install dependencies if needed
echo Installing/updating dependencies...
npm install

REM Start development server
echo.
echo Starting Next.js development server...
echo Frontend will be available at: http://localhost:3000
echo.
npm run dev

pause
