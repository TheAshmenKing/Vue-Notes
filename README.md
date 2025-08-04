# Vue Notes App 📝

A beautiful, fast, and secure note-taking application built with Vue.js and Firebase. Organize your thoughts with a professional yet fun interface that works seamlessly across all your devices.

## ✨ Features

- **🔥 Real-time Sync** - Your notes are automatically synced across all devices using Firebase
- **🔐 Secure Authentication** - Email/password and Google sign-in with Firebase Auth
- **🏷️ Smart Organization** - Tag system to categorize and organize your notes
- **🔍 Powerful Search** - Find any note instantly by title, content, or tags
- **🎨 Customizable Colors** - Personalize your notes with color coding
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **⚡ Auto-save** - Never lose your work with automatic saving
- **🌙 Professional UI** - Clean, modern design with smooth animations

## 🚀 Tech Stack

- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Firebase** - Authentication and real-time database
- **Vue Router** - Client-side routing
- **Vite** - Fast build tool and development server
- **Lucide Vue** - Beautiful icons
- **VueUse** - Collection of Vue composition utilities

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vue-note
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your Firebase config to `src/firebase/config.js`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" and "Google"
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in test mode
5. Get your config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click "Web"
   - Copy the config object
6. Update `src/firebase/config.js` with your configuration

## 📱 Usage

1. **Getting Started**
   - Visit the home page and click "Get Started Free"
   - Create an account or sign in with Google
   - Start creating your first note!

2. **Creating Notes**
   - Click "New Note" or the "+" button
   - Add a title and start writing
   - Use tags to organize your notes
   - Choose colors to categorize visually

3. **Organizing Notes**
   - Use the search bar to find specific notes
   - Filter by tags using the sidebar
   - Switch between grid and list views

## 🎨 Features in Detail

### Smart Auto-save
Your notes are automatically saved as you type, with a 1-second delay to avoid excessive API calls.

### Tag System
Add tags to your notes for better organization. Tags are automatically collected and displayed in the sidebar for quick filtering.

### Real-time Updates
Changes are synced in real-time across all your devices using Firebase's real-time capabilities.

### Responsive Design
The app works seamlessly on:
- Desktop computers
- Tablets (iPad, Android tablets)
- Mobile phones (iPhone, Android)

## 🚀 Deployment

### **Quick Deploy Options:**

#### **Vercel (Recommended)**
1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

#### **Netlify**
1. Fork this repository 
2. Connect to [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

#### **Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### **Environment Variables for Production:**
Set these in your hosting platform:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### **Build Commands:**
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Firebase for the backend services
- Lucide for the beautiful icons
- All contributors and users of this app

---

**Happy note-taking! 📝✨** 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
