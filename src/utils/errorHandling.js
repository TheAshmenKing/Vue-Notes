// Global error handler for production
import { createApp } from 'vue'

export const setupErrorHandling = (app) => {
  // Global error handler
  app.config.errorHandler = (err, instance, info) => {
    // In production, you might want to send this to a logging service
    if (import.meta.env.PROD) {
      console.error('Global error:', err)
      console.error('Error info:', info)
      // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    } else {
      console.error('Global error:', err, info)
    }
  }

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (import.meta.env.PROD) {
      console.error('Unhandled promise rejection:', event.reason)
      // TODO: Send to error monitoring service
    }
    event.preventDefault()
  })
}
