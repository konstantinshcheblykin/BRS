#!/bin/sh

# Wait for MySQL to be ready (max 30 seconds)
echo "Waiting for MySQL..."
timeout=30
while [ $timeout -gt 0 ] && ! nc -z mysql 3306; do
  sleep 1
  timeout=$((timeout-1))
done

if ! nc -z mysql 3306; then
  echo "MySQL is not ready after 30 seconds, continuing anyway..."
else
  echo "MySQL is ready!"
fi

# Install/update dependencies if needed
if [ ! -d vendor ] || [ ! -f vendor/autoload.php ]; then
  echo "Installing dependencies..."
  composer install --no-interaction --prefer-dist
fi

# Setup Laravel (only if needed)
if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate --force
fi

# Run migrations (non-blocking)
php artisan migrate --force || true

# Generate Swagger docs (non-blocking)
php artisan l5-swagger:generate || true

# Start server
echo "Starting Laravel server on http://0.0.0.0:8000"
exec php artisan serve --host=0.0.0.0 --port=8000
