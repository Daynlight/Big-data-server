import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/Auth', component: Auth }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router