@echo off
REM SplitBill Application Launcher for Windows
REM This script helps you start the application in different modes

setlocal enabledelayedexpansion

:show_menu
cls
echo.
echo ===============================================
echo    SplitBill Application Launcher
echo ===============================================
echo.
echo 1. Run in LOCAL mode (development)
echo 2. Run in PRODUCTION mode
echo 3. Run Tests (Local Mode)
echo 4. Run Tests (Production Mode)
echo 5. Run Tests Headed (Local Mode - with browser)
echo 6. Run Tests Headed (Production Mode - with browser)
echo 7. View Test Report
echo 8. Exit
echo.
set /p choice="Choose an option (1-8): "

if "%choice%"=="1" goto run_local
if "%choice%"=="2" goto run_production
if "%choice%"=="3" goto run_tests_local
if "%choice%"=="4" goto run_tests_prod
if "%choice%"=="5" goto run_tests_local_headed
if "%choice%"=="6" goto run_tests_prod_headed
if "%choice%"=="7" goto view_report
if "%choice%"=="8" goto exit_script
goto show_menu

:run_local
cls
echo.
echo Starting SplitBill in LOCAL MODE...
echo Backend will run on http://localhost:5001
echo Frontend will run on http://localhost:3000
echo.
echo Open 3 Command Prompts/PowerShell windows and run:
echo.
echo Terminal 1 (Backend):
echo   cd server ^&^& npm run dev:local
echo.
echo Terminal 2 (Frontend):
echo   cd client ^&^& npm run dev:local
echo.
echo Terminal 3 (Tests - optional):
echo   cd playwright-tests ^&^& npm run test:local:headed
echo.
pause
goto show_menu

:run_production
cls
echo.
echo Starting SplitBill in PRODUCTION MODE...
echo Make sure backend is running on production server
echo Frontend will connect to: https://splitbill-api2.onrender.com
echo.
echo Run:
echo   cd client ^&^& npm run dev:prod
echo.
pause
goto show_menu

:run_tests_local
cls
echo.
echo Running tests in LOCAL mode...
cd playwright-tests
call npm run test:local
pause
goto show_menu

:run_tests_prod
cls
echo.
echo Running tests in PRODUCTION mode...
cd playwright-tests
call npm run test:production
pause
goto show_menu

:run_tests_local_headed
cls
echo.
echo Running tests in LOCAL mode with browser...
cd playwright-tests
call npm run test:local:headed
pause
goto show_menu

:run_tests_prod_headed
cls
echo.
echo Running tests in PRODUCTION mode with browser...
cd playwright-tests
call npm run test:prod:headed
pause
goto show_menu

:view_report
cls
echo.
echo Opening test report...
cd playwright-tests
call npm run report
pause
goto show_menu

:exit_script
echo.
echo Goodbye!
exit /b 0
