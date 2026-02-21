import { createApp } from 'vue'
import Home from './views/Home.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(Home)
  .use(router)
  .mount('#app')
