# Clipix - GitHub Repository Setup Guide

This guide will help you push the backend and frontend to separate GitHub repositories.

## Repository Structure

```
clipix-backend/       (Backend Repository)
clipix-frontend/      (Frontend Repository)
```

---

## Step 1: Create GitHub Repositories

1. Go to [GitHub](https://github.com) and create two new repositories:
   - `clipix-backend` (or your preferred name)
   - `clipix-frontend` (or your preferred name)

2. Keep them **public** or **private** based on your preference
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)

---

## Step 2: Push Backend to GitHub

### From the backend directory:

```bash
# Navigate to backend directory
cd /app/backend

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Clipix AI Video Editor Backend"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/clipix-backend.git

# Push to GitHub
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 3: Push Frontend to GitHub

### From the frontend directory:

```bash
# Navigate to frontend directory
cd /app/frontend

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Clipix AI Video Editor Frontend"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/clipix-frontend.git

# Push to GitHub
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 4: Update Environment Variables (IMPORTANT!)

### Backend `.env` file
Before pushing, ensure your `.env` file is listed in `.gitignore` (already done).

After cloning, create a new `.env` file with:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="clipix_db"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=your_actual_key_here
```

### Frontend `.env` file
After cloning, create a new `.env` file with:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

**Production**: Update `REACT_APP_BACKEND_URL` to your deployed backend URL.

---

## Step 5: Setting Up After Clone

### Backend Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/clipix-backend.git
cd clipix-backend

# Install dependencies
pip install -r requirements.txt

# Install emergentintegrations
pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/

# Install FFmpeg (if not already installed)
# Ubuntu/Debian:
sudo apt-get install ffmpeg

# macOS:
brew install ffmpeg

# Create .env file (see Step 4)
nano .env

# Create uploads directory
mkdir uploads

# Run server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/clipix-frontend.git
cd clipix-frontend

# Install dependencies
yarn install

# Create .env file (see Step 4)
nano .env

# Run development server
yarn start
```

---

## Step 6: Future Updates

### Updating Backend
```bash
cd /app/backend
git add .
git commit -m "Your commit message"
git push origin main
```

### Updating Frontend
```bash
cd /app/frontend
git add .
git commit -m "Your commit message"
git push origin main
```

---

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

### Backend
```bash
cd /app/backend
git init
git add .
git commit -m "Initial commit: Clipix Backend"
gh repo create clipix-backend --public --source=. --remote=origin --push
```

### Frontend
```bash
cd /app/frontend
git init
git add .
git commit -m "Initial commit: Clipix Frontend"
gh repo create clipix-frontend --public --source=. --remote=origin --push
```

---

## Deployment Recommendations

### Backend Deployment Options:
1. **Railway**: Easy deployment with automatic HTTPS
2. **Render**: Free tier available
3. **AWS EC2**: Full control
4. **DigitalOcean App Platform**: Managed deployment
5. **Heroku**: Simple deployment (paid)

### Frontend Deployment Options:
1. **Vercel**: Optimized for React, automatic deployments
2. **Netlify**: Easy setup with GitHub integration
3. **AWS Amplify**: AWS-native hosting
4. **GitHub Pages**: Free static hosting
5. **Cloudflare Pages**: Fast CDN-based hosting

---

## Repository Structure Overview

### Backend Repository (`clipix-backend/`)
```
clipix-backend/
├── .gitignore              # Git ignore rules
├── README.md               # Backend documentation
├── requirements.txt        # Python dependencies
├── server.py              # Main FastAPI app
├── video_processor.py     # Video processing logic
├── caption_generator.py   # AI caption generation
├── .env                   # Environment variables (not in git)
└── uploads/               # Video storage (not in git)
```

### Frontend Repository (`clipix-frontend/`)
```
clipix-frontend/
├── .gitignore             # Git ignore rules
├── README.md              # Frontend documentation
├── package.json           # Node dependencies
├── public/                # Static assets
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── App.js           # Main app
│   └── index.js         # Entry point
├── tailwind.config.js    # Tailwind config
├── craco.config.js       # CRACO config
└── .env                  # Environment variables (not in git)
```

---

## Security Notes

1. **Never commit** `.env` files to GitHub
2. **Never commit** API keys or secrets
3. Use GitHub Secrets for CI/CD pipelines
4. Update CORS_ORIGINS in production to specific domains
5. Consider using environment-specific `.env` files

---

## Troubleshooting

### "Remote origin already exists"
```bash
git remote remove origin
git remote add origin YOUR_NEW_URL
```

### "Failed to push"
```bash
git pull origin main --rebase
git push origin main
```

### "Permission denied (publickey)"
Set up SSH keys or use HTTPS with Personal Access Token.

---

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

---

## Support

If you encounter any issues:
1. Check the README files in each repository
2. Review the troubleshooting section
3. Open an issue on the respective GitHub repository

---

**Happy Coding! 🚀**
