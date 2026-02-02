@echo off
chcp 65001 >nul
echo ========================================
echo   Остановка приложения BRS
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Docker не запущен!
    echo.
    pause
    exit /b 1
)

echo Остановка контейнеров...
docker compose stop

if errorlevel 1 (
    echo.
    echo [ОШИБКА] Не удалось остановить приложение!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Приложение остановлено
echo ========================================
echo.
echo Для полного удаления контейнеров выполните:
echo   docker compose down
echo.
echo Для удаления всего, включая данные БД:
echo   docker compose down -v
echo.
pause
