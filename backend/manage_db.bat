@echo off
echo Krishi Sakhi Database Management
echo ================================
echo.

if "%1"=="" (
    echo Available commands:
    echo   reset     - Reset database and recreate tables
    echo   inspect   - Inspect database schema and data
    echo   help      - Show help information
    echo.
    echo Usage: manage_db.bat [command]
    echo Example: manage_db.bat reset
    pause
    exit /b
)

REM Activate virtual environment
call .venv\Scripts\activate

REM Run the database management script
python manage_db.py %*

pause
