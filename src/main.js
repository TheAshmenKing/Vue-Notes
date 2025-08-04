import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { setupErrorHandling } from './utils/errorHandling.js'

const app = createApp(App)

// Setup global error handling for production
setupErrorHandling(app)

app.use(router)
app.mount('#app')
