import { ref, computed } from 'vue'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
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
    default:
      return 'Something went wrong. Please try again.'
  }
}

// Auth state listener
onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser
  loading.value = false
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
      await signInWithPopup(auth, provider)
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
