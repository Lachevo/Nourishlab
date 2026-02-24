---
description: Comprehensive deployment guide for NourishLab on Render.com
---

Follow these steps to deploy the entire NourishLab ecosystem to production.

### Phase 1: Deploying the Backend & Frontend (Unified)
This service will host your **Database, API, and the Main Application**.

1. **Create a Web Service on Render**:
   - Connect your GitHub repository.
   - **Environment**: `Python 3`.
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && cd frontend && npm install && npm run build && cd .. && python manage.py collectstatic --noinput
     ```
   - **Start Command**: `gunicorn nourishlab.wsgi:application`
   - **Environment Variables**:
     - `DATABASE_URL`: (Render will provide this if you add a Blueprint or Database).
     - `SECRET_KEY`: A long, random string.
     - `DEBUG`: `False`.
     - `ALLOWED_HOSTS`: `your-app-name.onrender.com`.

---

### Phase 2: Deploying the Landing Page (Static Site)
This is your **Marketing Page** (the one we just redesigned).

1. **Create a Static Site on Render**:
   - Connect your GitHub repository.
   - **Root Directory**: `landing`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables (CRITICAL)**:
     - `VITE_APP_URL`: Set this to the URL of your **Phase 1** deployment (e.g., `https://nourishlab-app.onrender.com`).

---

### Phase 3: Final Connection
1. Once both services are "Live":
   - Visit your **Landing Page URL**.
   - Click "Login" or "Get Started".
   - It should now automatically redirect to your **Main Application** URL on Render.

---

### Troubleshooting Deployment
| Problem | Solution |
| :--- | :--- |
| **Assets not loading** | Ensure `STATICFILES_STORAGE` is set to WhiteNoise in `settings.py`. |
| **White Page (App)** | Ensure you ran `npm run build` inside the `frontend` folder during the build command. |
| **CORS Errors** | Add the Landing Page domain to `CORS_ALLOWED_ORIGINS` in your Backend settings. |
