import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { watchEffect } from 'vue'

// Lazy load components
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const NoteEditor = () => import('../views/NoteEditor.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/note/:id?',
    name: 'NoteEditor',
    component: NoteEditor,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, loading } = useAuth()

  // Wait for Firebase Auth to determine the authentication state
  if (loading.value) {
    // Wait for loading to finish
    await new Promise((resolve) => {
      const stopWatching = watchEffect(() => {
        if (!loading.value) {
          stopWatching()
          resolve()
        }
      })
    })
  }

  // Now proceed with navigation logic
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
