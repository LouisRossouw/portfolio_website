FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    imagemagick \
    git \
    dos2unix \
 && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Add gunicorn to path of executed python environment
RUN pip install gunicorn

# Copy project files
COPY . /app/

# Fix Windows CRLF line endings and make the entrypoint script executable
RUN dos2unix /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Expose port 8000
EXPOSE 8000

# Start script
ENTRYPOINT ["/app/entrypoint.sh"]
