import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import NewFile from '../views/NewFile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/auth', component: Auth },
  { path: '/new_file', component: NewFile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router