#!/bin/bash
set -e

echo "Ensuring /assets directory structure..."
mkdir -p /assets/media
mkdir -p /assets/game

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Compressing SCSS/CSS (offline)..."
python manage.py compress --force

echo "Starting Gunicorn server..."
exec gunicorn mysite.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 60 --access-logfile - --error-logfile -