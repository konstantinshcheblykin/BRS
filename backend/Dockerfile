FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    netcat-openbsd \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for dependency caching
COPY composer.json composer.lock* ./

# Install dependencies (will be cached if composer files don't change)
RUN composer install --no-interaction --prefer-dist --no-scripts --no-dev || true

# Copy existing application directory permissions
RUN chown -R www-data:www-data /var/www/html

# Install curl for healthcheck (already installed, but keeping for clarity)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Expose port 8000
EXPOSE 8000
