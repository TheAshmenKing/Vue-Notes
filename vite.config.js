import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Enable minification
    minify: 'terser',
    // Generate source maps for production debugging (disabled for smaller bundle)
    sourcemap: false,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'icons': ['lucide-vue-next']
        }
      }
    },
    // Set chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['vue', 'vue-router', 'firebase/app', 'firebase/auth', 'firebase/firestore']
  },
  // Preview configuration for production testing
  preview: {
    port: 4173,
    strictPort: true
  }
})
