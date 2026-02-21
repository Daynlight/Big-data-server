import { createApp } from 'vue'
import App from './App.vue'
import router from './scripts/router'
import keycloak from './scripts/keycloak'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const startApp = async () => {
  try {
    await keycloak.init()

    const app = createApp(App)

    app.use(router)
    app.mount('#app')

  } catch (err) {
    console.error("Keycloak init failed:", err)
  }
}

startApp()