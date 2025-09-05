@echo off
echo Testing Krishi Sakhi AI Endpoints...
echo.

REM Activate virtual environment
call .venv\Scripts\activate

REM Run the AI test script
python test_ai.py

pause
