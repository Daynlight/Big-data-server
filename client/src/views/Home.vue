<script setup>
import Navbar from '../components/Navbar.vue'
import keycloak from '../keycloak'
</script>

<template>
  <Navbar />
  
  <h2>Token:</h2>
  <pre>{{ keycloak?.state.token }}</pre>
</template>