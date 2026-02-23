---
description: How to run the NourishLab ecosystem (Backend, Frontend, and Landing Page)
---

Follow these steps to get the entire NourishLab project running on your local machine.

### 1. Prerequisities
- Python 3.12+ 
- Node.js 22+
- `npm` or `pnpm`

### 2. Backend Setup (Django)
Open a terminal in the root directory:
```bash
# Create and activate virtual environment
python -m venv env
source env/bin/activate  # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run migrations and setup
python manage.py migrate
python manage.py create_default_superuser
python manage.py setup_social_auth

# Start the Django server
python manage.py runserver 8000
```
> [!NOTE]
> The backend will be available at [http://localhost:8000](http://localhost:8000).

### 3. Landing Page Setup (React)
Open a NEW terminal in the `landing` directory:
```bash
cd landing
npm install
npm run dev
```
> [!NOTE]
> The landing page will be available at [http://localhost:3000](http://localhost:3000).

### 4. Frontend Application Setup (React SPA)
Open a NEW terminal in the `frontend` directory:
```bash
cd frontend
npm install

# Option A: Standalone Dev (Fast HMR)
npm run dev # Available at http://localhost:5173

# Option B: Integrated Deployment (Required for port 8000)
npm run build
```
> [!IMPORTANT]
> To access the application through the **unified portal** (port 8000), you **must** run `npm run build` in the `frontend` directory first. This correctly maps the assets for Django.

---

### Summary of URLs
| Service | URL | Role |
| :--- | :--- | :--- |
| **Landing Page** | [http://localhost:3000](http://localhost:3000) | Public marketing site |
| **Main App (Dev)** | [http://localhost:5173](http://localhost:5173) | Direct access to React app |
| **Unified Portal** | [http://localhost:8000](http://localhost:8000) | Integrated Landing + App (Production Feel) |

---

### Verification
1. Open the **Landing Page** (3000).
2. Click **"Get Started"** or **"Log In"**.
3. You should be redirected to the **Main App** (either 5173 or 8000 depending on environment).
