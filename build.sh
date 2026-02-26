#!/usr/bin/env bash
# exit on error
set -o errexit

# Define python and pip commands (favor virtualenv if it exists)
if [ -d "venv" ]; then
    PYTHON="./venv/bin/python"
    PIP="./venv/bin/pip"
else
    PYTHON="python3"
    PIP="pip3"
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

# --- Landing build ---
if [ -d "landing" ] && command -v npm >/dev/null 2>&1; then
    echo "Building landing page..."
    cd landing
    npm install
    npm run build
    cd ..
else
    echo "Skipping landing build (npm not found or landing directory missing)"
fi

# --- Django management ---
echo "Collecting static files..."
$PYTHON manage.py collectstatic --no-input

echo "Running migrations..."
$PYTHON manage.py migrate

echo "Creating default superuser if needed..."
$PYTHON manage.py create_default_superuser

echo "Setting up Google Social Auth..."
$PYTHON manage.py setup_social_auth

# Create media directories if they don't exist
echo "Setting up media directories..."
mkdir -p media/food_logs media/lab_results media/recipes media/progress_photos
chmod -R 755 media
