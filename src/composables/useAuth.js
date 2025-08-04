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
      error.value = err.message
      throw err
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
      error.value = err.message
      throw err
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
      error.value = err.message
      throw err
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
