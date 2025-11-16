# 🔧 FIX: Render Detecting Wrong Environment

## ❌ PROBLEM
Render is detecting your **Python backend** as a **Node.js** project.

## ✅ SOLUTION

### Step 1: Push Latest Changes

```bash
cd /app/backend
git push origin main --force
```

This will push the new `runtime.txt` file.

---

### Step 2: DELETE the Existing Render Service

1. Go to your Render Dashboard: https://dashboard.render.com
2. Find your `clipix-backend` service
3. Click on it
4. Go to **Settings** (bottom left)
5. Scroll down to **Danger Zone**
6. Click **Delete Web Service**
7. Confirm deletion

**Don't worry** - you're not losing any code, it's all in GitHub!

---

### Step 3: Create NEW Web Service (Correct Configuration)

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Connect to **GitHub** (if not connected)
5. Find and select: **`njoroge-mary/clipix-backend`**
6. Click **"Connect"**

---

### Step 4: Configure Service Settings

Fill in these **EXACT** settings:

**Basic Settings:**
- **Name**: `clipix-backend`
- **Region**: Choose closest to you (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: *(leave blank)*

**Build & Deploy:**
- **Runtime**: Select **"Python 3"** from dropdown ⚠️ **IMPORTANT!**
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  uvicorn server:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- Select **"Free"** (or paid if you prefer)

---

### Step 5: Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `MONGO_URL` | `your_mongodb_connection_string` |
| `DB_NAME` | `clipix_db` |
| `CORS_ORIGINS` | `*` |
| `EMERGENT_LLM_KEY` | `sk-emergent-c743b6eB02958A6886` |
| `PYTHON_VERSION` | `3.11.0` |

⚠️ **Replace `your_mongodb_connection_string`** with your actual MongoDB URL from MongoDB Atlas.

---

### Step 6: Install FFmpeg

Since Render's free tier doesn't allow custom apt packages, you have **two options**:

#### Option A: Use Render Native Environment (Recommended for testing)

FFmpeg is pre-installed on some Render environments. Try deploying first and see if it works.

#### Option B: Use Docker (Recommended for production)

Create a `Dockerfile` in `/app/backend/`:

```dockerfile
FROM python:3.11-slim

# Install FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

Then in Render settings:
- **Runtime**: Select **"Docker"**
- Build Command: *(leave blank)*
- Start Command: *(leave blank)*

---

### Step 7: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for the build
3. Watch the logs for any errors

---

## 🧪 TESTING

After deployment succeeds, test your API:

```bash
# Replace with your actual Render URL
curl https://clipix-backend.onrender.com/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "service": "clipix-backend",
  "database": "connected",
  "timestamp": "2025-11-16T12:30:00.000000+00:00"
}
```

---

## 🔍 TROUBLESHOOTING

### Still detecting as Node.js?
- Make sure you selected **"Python 3"** in the Runtime dropdown
- Delete and recreate the service
- Verify `requirements.txt` exists in your GitHub repo

### FFmpeg not found errors?
- Use the Docker option above
- Or upgrade to a paid Render plan that allows apt packages

### MongoDB connection errors?
- Verify your `MONGO_URL` is correct
- In MongoDB Atlas, go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

### Build taking too long?
- First build takes 5-10 minutes (installing all dependencies)
- Subsequent builds are faster (cached)

### Port errors?
- Make sure you're using `$PORT` in the start command (Render sets this automatically)

---

## 📝 MONGODB ATLAS SETUP (If You Don't Have It)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a **free account**
3. Create a **free cluster** (M0)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Add to Render environment variables

**Example connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## ✅ VERIFICATION CHECKLIST

After successful deployment:

- [ ] Service is running (green status in Render)
- [ ] Health endpoint responds: `/api/health`
- [ ] No errors in Render logs
- [ ] MongoDB is connected
- [ ] Copy your Render URL for frontend deployment

---

## 🚀 NEXT STEPS

Once backend is deployed:

1. Copy your Render URL (e.g., `https://clipix-backend-abc123.onrender.com`)
2. Update frontend `.env`:
   ```
   REACT_APP_BACKEND_URL=https://clipix-backend-abc123.onrender.com
   ```
3. Deploy frontend to Vercel
4. Update backend `CORS_ORIGINS` to your frontend URL

---

## 💡 WHY THIS HAPPENED

Render auto-detects project type by looking at files:
- Sees `yarn.lock` or `package.json` → Thinks it's Node.js
- Sees `requirements.txt` → Thinks it's Python

Your repo might have had frontend files mixed with backend, causing confusion.

**Solution**: Explicitly select **"Python 3"** as runtime when creating the service.

---

**Follow these steps carefully and your backend will deploy successfully! 🎉**
