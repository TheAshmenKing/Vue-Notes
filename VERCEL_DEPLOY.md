# 🚀 Quick Vercel Deployment Guide

## Option 1: One-Click Deploy (Fastest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/vue-note&env=VITE_FIREBASE_API_KEY,VITE_FIREBASE_AUTH_DOMAIN,VITE_FIREBASE_PROJECT_ID,VITE_FIREBASE_STORAGE_BUCKET,VITE_FIREBASE_MESSAGING_SENDER_ID,VITE_FIREBASE_APP_ID)

## Option 2: Manual Setup (5 minutes)

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Vite settings ✨
6. Add your Firebase environment variables
7. Click Deploy!

### 3. Environment Variables
Add these in Vercel → Project Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefghijk
```

### 4. Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Vercel handles SSL automatically!

## 🎉 Done!
Your app will be live at `https://your-project.vercel.app`

## Auto-Deploy
Every push to `main` branch automatically deploys! 🚀
