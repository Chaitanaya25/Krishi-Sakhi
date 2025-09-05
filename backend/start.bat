@echo off
echo Starting Krishi Sakhi Backend...
echo.

REM Activate virtual environment
call .venv\Scripts\activate

REM Install dependencies if needed
echo Installing/updating dependencies...
pip install -r requirements.txt

REM Start FastAPI server
echo.
echo Starting FastAPI server...
echo Backend will be available at: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
