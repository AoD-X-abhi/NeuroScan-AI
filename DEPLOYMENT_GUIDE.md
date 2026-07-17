# NeuroScan AI Deployment Guide

This guide details the recommended architecture and steps to deploy the **NeuroScan AI** full-stack medical imaging platform.

---

## ⚠️ Important Architectural Considerations

Before deploying, it is important to understand the platform limitations of serverless environments (like Vercel) regarding our backend stack:

1. **Stateless Filesystem**: Vercel Serverless Functions are stateless and read-only. Any database updates to a local SQLite file (`webapp.db`) or uploaded MRI scans saved in `/static/uploads/` will be discarded immediately.
2. **Package Size Limits**: Vercel has a strict **50MB** zipped package limit for serverless functions. PyTorch, Torchvision, and OpenCV are large libraries totaling several gigabytes, making direct hosting on Vercel functions impossible.

### Recommended Production Architecture:
* **Frontend (React)**: Hosted on **Vercel** (extremely fast global CDN, free, and compiles Vite on-the-fly).
* **Backend (FastAPI)**: Hosted on **Render** or **Railway** (supports persistent disk storage for SQLite, custom Docker containers for large libraries like PyTorch, and continuous server uptimes).

---

## 🌐 Part 1: Deploying the Backend on Render or Railway

### Option A: Render (Free & Persistent Disk Support)
Render is a cloud hosting platform that allows you to attach a **Persistent Disk** to keep your SQLite database and uploaded images safe when the server restarts.

1. **Prepare your Code**:
   Ensure `backend` is committed to a GitHub repository.
2. **Create a Web Service on Render**:
   - Go to [Render](https://render.com/) and link your GitHub account.
   - Click **New +** -> **Web Service** and select your repository.
   - Set the following configuration:
     * **Environment**: `Python 3`
     * **Build Command**: `pip install -r requirements.txt`
     * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
3. **Configure a Persistent Disk**:
   - In Render, go to your service settings, navigate to **Disks**, and click **Add Disk**.
   - Set **Mount Path** to `/opt/backend/data`.
   - Update your backend environment variables in database settings to point your SQLite DB URL to the disk mount:
     * `DATABASE_URL=sqlite:////opt/backend/data/webapp.db`
     * Also update the image upload directory in `main.py` to save to `/opt/backend/data/uploads` instead of the local static folder.

### Option B: Railway (Highly Recommended for PyTorch)
Railway supports custom Docker builds, giving you complete control over libraries like PyTorch.
1. Install the Railway CLI or link your Github repository.
2. Attach a **Volume** (disk) to your service and mount it to save your SQLite DB and uploads.

---

## 🎨 Part 2: Deploying the Frontend on Vercel

Vercel is the ideal host for the React Vite SPA.

### Step 1: Parameterize the API Endpoint URL
Currently, the API endpoint is hardcoded to `http://localhost:8000` in `frontend/src/utils/api.ts`. We need to make this dynamic using Vite environment variables.

1. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
2. Create a `.env.production` file (for Vercel builds):
   ```env
   VITE_API_URL=https://your-backend-service-url.onrender.com
   ```
3. Update [api.ts](file:///d:/Semester's%20Notes/My%20Projects/SmartMRI%20AI%20Medical%20Imaging%20Analysis%20System/frontend/src/utils/api.ts) to read this variable:
   ```typescript
   const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
   ```

### Step 2: Configure Vercel Routes (`vercel.json`)
Since this is a Single Page Application (SPA), we need to ensure that refreshing the browser doesn't return a `404 Not Found` error. Add a `vercel.json` file in the `frontend` directory:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Step 3: Trigger the Deploy
1. Install Vercel CLI (`npm install -g vercel`) or sign in to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Point the **Root Directory** of the Vercel project to `frontend`.
3. Vercel automatically detects the Vite framework and runs:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set the environment variable `VITE_API_URL` in the Vercel Dashboard to point to your live Render/Railway URL.
