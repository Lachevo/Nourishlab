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
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# --- Django management ---
echo "Collecting static files..."
$PYTHON manage.py collectstatic --no-input

echo "Running migrations..."
$PYTHON manage.py migrate
