import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import keycloak from './keycloak'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

keycloak.init({
  onLoad: 'check-sso',
  checkLoginIframe: false
})

const app = createApp(App)
app.config.globalProperties.$keycloak = keycloak
app.use(router)
app.mount('#app')