<script setup>
import Navbar from '../components/Navbar.vue'
import keycloak from "../keycloak"
</script>

<template>
  <Navbar />

  <div class="vh-100 bg-secondary d-flex justify-content-center align-items-center">
    <div class="card shadow text-center p-5 rounded-5">
      <h3>Login</h3>

      <button class="btn btn-primary mb-2" @click="keycloak?.login">
        Login
      </button>

      <button class="btn btn-success" @click="keycloak?.register">
        Register
      </button>
    </div>
  </div>
</template>