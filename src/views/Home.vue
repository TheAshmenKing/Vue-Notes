<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Your thoughts, 
            <span class="gradient-text">organized</span>
          </h1>
          <p class="hero-subtitle">
            A beautiful, fast, and secure note-taking app built with Vue.js and Firebase. 
            Capture your ideas, organize your thoughts, and access them anywhere.
          </p>
          <div class="hero-actions">
            <router-link v-if="!isAuthenticated" to="/register" class="btn btn-primary">
              <UserPlus class="btn-icon" />
              Get Started Free
            </router-link>
            <router-link v-if="!isAuthenticated" to="/login" class="btn btn-secondary">
              <LogIn class="btn-icon" />
              Sign In
            </router-link>
            <router-link v-else to="/dashboard" class="btn btn-primary">
              <ArrowRight class="btn-icon" />
              Go to Dashboard
            </router-link>
          </div>
        </div>
        <div class="hero-illustration">
          <div class="floating-cards">
            <div class="note-card card-1">
              <div class="note-header">
                <div class="note-dot"></div>
                <div class="note-dot"></div>
                <div class="note-dot"></div>
              </div>
              <div class="note-content">
                <div class="note-line long"></div>
                <div class="note-line medium"></div>
                <div class="note-line short"></div>
              </div>
            </div>
            <div class="note-card card-2">
              <div class="note-header">
                <div class="note-dot"></div>
                <div class="note-dot"></div>
                <div class="note-dot"></div>
              </div>
              <div class="note-content">
                <div class="note-line medium"></div>
                <div class="note-line long"></div>
                <div class="note-line short"></div>
              </div>
            </div>
            <div class="note-card card-3">
              <div class="note-header">
                <div class="note-dot"></div>
                <div class="note-dot"></div>
                <div class="note-dot"></div>
              </div>
              <div class="note-content">
                <div class="note-line short"></div>
                <div class="note-line medium"></div>
                <div class="note-line long"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="container">
        <h2 class="section-title">Why Choose Vue Notes?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <Zap />
            </div>
            <h3>Lightning Fast</h3>
            <p>Built with Vue.js and optimized for speed. Your notes load instantly, no matter how many you have.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Shield />
            </div>
            <h3>Secure & Private</h3>
            <p>Your notes are encrypted and stored securely with Firebase. Only you can access your thoughts.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Smartphone />
            </div>
            <h3>Cross-Platform</h3>
            <p>Access your notes from any device. Fully responsive design that works on desktop, tablet, and mobile.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Search />
            </div>
            <h3>Smart Search</h3>
            <p>Find any note instantly with our powerful search feature. Search by title, content, or tags.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Tag />
            </div>
            <h3>Organize with Tags</h3>
            <p>Keep your notes organized with a flexible tagging system. Create custom tags for any topic.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <Cloud />
            </div>
            <h3>Cloud Sync</h3>
            <p>Your notes are automatically synced across all your devices in real-time with Firebase.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useAuth.js'
import { 
  UserPlus, 
  LogIn, 
  ArrowRight, 
  Zap, 
  Shield, 
  Smartphone, 
  Search, 
  Tag, 
  Cloud 
} from 'lucide-vue-next'

const { isAuthenticated } = useAuth()
</script>

<style lang="scss" scoped>
@use '../assets/styles/home';
</style>
