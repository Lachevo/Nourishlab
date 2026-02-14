#!/usr/bin/env bash
# exit on error
set -o errexit

# Define python and pip commands (favor virtualenv if it exists)
if [ -d "env" ]; then
    PYTHON="./env/bin/python"
    PIP="./env/bin/pip"
else
    PYTHON="python"
    PIP="pip"
fi

# --- Backend build ---
echo "Installing Python dependencies..."
$PYTHON -m pip install -r requirements.txt

# --- Frontend build ---
if [ -d "frontend" ] && command -v npm >/dev/null 2>&1; then
    echo "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "Skipping frontend build (npm not found or frontend directory missing)"
fi

# --- Django management ---
echo "Collecting static files..."
$PYTHON manage.py collectstatic --no-input

echo "Running migrations..."
$PYTHON manage.py migrate
