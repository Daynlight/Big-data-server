<script setup>
import Navbar from '../components/Navbar.vue'
import keycloak from '../keycloak'
</script>

<template>
  <Navbar />

  <h2>Username:</h2>
  <h3>{{ keycloak?.state.username }}</h3>

  <h2>Token:</h2>
  <pre>{{ keycloak?.state.token }}</pre>
</template>