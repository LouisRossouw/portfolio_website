#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn server..."
exec gunicorn mysite.wsgi:application --bind 0.0.0.0:8000 --workers 3
