<script setup>
import Navbar from '../components/Navbar.vue'
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const keycloak = proxy.$keycloak

const login = () => {
  keycloak.login()
}

const register = () => {
  keycloak.register()
}
</script>

<template>
  <Navbar />

  <div class="container mt-5">
    <h3>Authentication</h3>

    <button class="btn btn-primary me-2" @click="login">
      Login
    </button>

    <button class="btn btn-success" @click="register">
      Register
    </button>
  </div>
</template>