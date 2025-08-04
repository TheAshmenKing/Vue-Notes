# 🔥 Firebase Google Sign-In Setup Guide

## Prerequisites ✅
- Firebase project created
- Web app registered in Firebase

## Step 1: Enable Google Authentication

### Firebase Console Setup:
1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Select your project**
3. **Navigate to "Authentication" → "Sign-in method"**
4. **Find "Google" in the providers list**
5. **Click "Google" to configure**
6. **Toggle "Enable" switch**
7. **Enter project support email** (required)
8. **Click "Save"**

### Important Settings:
- ✅ **Project support email**: Use your email or project email
- ✅ **Project public-facing name**: "Vue Notes" (or your preferred name)
- ✅ **Web SDK configuration**: Auto-generated (no action needed)

## Step 2: Verify Your Environment Variables

Your `.env` file should have these Firebase config values:

```bash
# Get these from Firebase Console → Project Settings → General → Web app config
VITE_FIREBASE_API_KEY=AIzaSyBm...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefgh
```

## Step 3: Test Google Sign-In

### Development Testing:
1. **Start your development server**: `npm run dev`
2. **Go to login/register page**
3. **Click "Continue with Google" button**
4. **Should open Google OAuth popup**
5. **Select your Google account**
6. **Should redirect to dashboard**

### Troubleshooting:

#### Error: "Cross-Origin-Opener-Policy policy would block the window.closed call"
- **Fixed automatically** - App now uses popup + redirect fallback
- **Desktop**: Tries popup first (better UX)
- **Mobile/Blocked**: Falls back to redirect (always works)
- **No action needed** - fallback is transparent to users

#### Error: "This app isn't verified"
- **Normal for development** - Click "Advanced" → "Go to [your-app] (unsafe)"
- **For production**: Submit app for verification in Google Cloud Console

#### Error: "redirect_uri_mismatch"
- **Check authorized domains** in Firebase Auth settings
- **For localhost**: `localhost` should be auto-added
- **For production**: Add your actual domain

#### Error: "popup_closed_by_user"
- **User closed popup** - handled gracefully in code
- **Will automatically try redirect** on next attempt

## Step 4: Production Deployment

### Authorized Domains:
When deploying to production, add your domain:

1. **Firebase Console → Authentication → Settings → Authorized domains**
2. **Click "Add domain"**
3. **Enter your production domain** (e.g., `your-app.vercel.app`)
4. **Save changes**

### Common Production Domains:
- Vercel: `your-app.vercel.app`
- Netlify: `your-app.netlify.app`
- Custom domain: `your-domain.com`

## Step 5: Verify Implementation

Your Vue Notes app already has Google Sign-in implemented! ✅

### Code Location:
- **Auth composable**: `src/composables/useAuth.js`
- **Login page**: `src/views/Login.vue`
- **Register page**: `src/views/Register.vue`

### Features Included:
- ✅ Google OAuth popup
- ✅ Error handling
- ✅ User-friendly messages
- ✅ Automatic redirect after success
- ✅ Loading states

## 🎉 You're All Set!

Google Sign-in should work immediately after:
1. ✅ Enabling Google auth in Firebase Console
2. ✅ Adding your support email
3. ✅ Setting correct environment variables

Test it now by clicking the "Continue with Google" button on your login page!
