import { ref, computed } from 'vue'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth'
import { auth } from '../firebase/config.js'

const user = ref(null)
const loading = ref(true)
const error = ref(null)

// Helper function for user-friendly error messages
const getFriendlyErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.'
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.'
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups or try again.'
    case 'auth/operation-not-allowed':
      return 'Google Sign-in is not enabled. Please contact support.'
    case 'auth/invalid-api-key':
      return 'Configuration error. Please contact support.'
    case 'auth/app-not-authorized':
      return 'App not authorized for this domain. Please contact support.'
    default:
      return `Authentication error (${errorCode}). Please contact support.`
  }
}

// Auth state listener
onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser
  loading.value = false
})

// Check for redirect result on app load
getRedirectResult(auth).then((result) => {
  if (result?.user) {
    // User successfully signed in via redirect
    console.log('Google sign-in successful via redirect')
  }
}).catch((error) => {
  if (error.code !== 'auth/null-user') {
    console.error('Redirect result error:', error)
    error.value = getFriendlyErrorMessage(error.code)
  }
})

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)

  const login = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      // Provide user-friendly error messages for production
      const friendlyMessage = getFriendlyErrorMessage(err.code)
      error.value = friendlyMessage
      throw new Error(friendlyMessage)
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password) => {
    try {
      error.value = null
      loading.value = true
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err.code)
      error.value = friendlyMessage
      throw new Error(friendlyMessage)
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
    try {
      error.value = null
      loading.value = true
      const provider = new GoogleAuthProvider()
      
      // Add additional scopes
      provider.addScope('email')
      provider.addScope('profile')
      
      try {
        // Try popup first (works better for desktop)
        await signInWithPopup(auth, provider)
      } catch (popupError) {
        // If popup fails (mobile or COOP issues), fall back to redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request' ||
            popupError.message.includes('Cross-Origin-Opener-Policy')) {
          await signInWithRedirect(auth, provider)
          // Note: redirect will reload the page, so we don't reach the finally block
          return
        }
        throw popupError // Re-throw if it's a different error
      }
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err.code)
      error.value = friendlyMessage
      throw new Error(friendlyMessage)
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    login,
    register,
    loginWithGoogle,
    logout
  }
}
