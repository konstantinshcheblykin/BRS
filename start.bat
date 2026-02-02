@echo off
chcp 65001 >nul
echo ========================================
echo   Запуск приложения BRS
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Docker не запущен или не установлен!
    echo.
    echo Пожалуйста:
    echo 1. Убедитесь, что Docker Desktop установлен
    echo 2. Запустите Docker Desktop
    echo 3. Дождитесь полного запуска Docker
    echo 4. Попробуйте снова
    echo.
    pause
    exit /b 1
)

echo [1/3] Проверка Docker... OK
echo.

REM Check if docker-compose is available
docker compose version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Docker Compose не найден!
    echo.
    echo Убедитесь, что установлена последняя версия Docker Desktop
    echo.
    pause
    exit /b 1
)

echo [2/3] Проверка Docker Compose... OK
echo.

REM Start containers
echo [3/3] Запуск приложения...
echo.
echo Это может занять несколько минут при первом запуске...
echo Пожалуйста, подождите...
echo.

docker compose up -d

if errorlevel 1 (
    echo.
    echo [ОШИБКА] Не удалось запустить приложение!
    echo.
    echo Проверьте логи командой:
    echo   docker compose logs
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Приложение успешно запущено!
echo ========================================
echo.
echo Подождите 1-2 минуты для полной инициализации...
echo.
echo Приложение будет доступно по адресам:
echo   - Frontend:    http://localhost:3000
echo   - Backend API: http://localhost:8000/api/notes
echo   - Документация: http://localhost:8000/api/documentation
echo.
echo Для проверки статуса выполните:
echo   docker compose ps
echo.
echo Для просмотра логов выполните:
echo   docker compose logs -f
echo.
echo Для остановки приложения выполните:
echo   docker compose stop
echo.
pause
