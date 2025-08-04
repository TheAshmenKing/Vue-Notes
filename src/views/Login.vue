<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <NotebookPen class="logo-icon" />
            <h1>Vue Notes</h1>
          </div>
          <h2>Welcome back</h2>
          <p>Sign in to access your notes</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-input">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
              >
                <Eye v-if="!showPassword" />
                <EyeOff v-else />
              </button>
            </div>
          </div>

          <div v-if="error" class="error-message">
            <AlertCircle class="error-icon" />
            {{ error }}
          </div>

          <button
            type="submit"
            class="btn btn-primary login-btn"
            :disabled="loading"
          >
            <div v-if="loading" class="spinner"></div>
            <LogIn v-else class="btn-icon" />
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <button
            type="button"
            @click="handleGoogleLogin"
            class="btn btn-secondary google-btn"
            :disabled="loading"
          >
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div class="login-footer">
          <p>
            Don't have an account?
            <router-link to="/register" class="auth-link">Sign up</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { 
  NotebookPen, 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-vue-next'

const router = useRouter()
const { login, loginWithGoogle, error, loading } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    console.error('Login failed:', err)
  }
}

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle()
    // Note: If redirect is used, the page will reload and we won't reach this line
    router.push('/dashboard')
  } catch (err) {
    // Error handling is already done in the composable
    console.error('Google login failed:', err)
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/login';
</style>
