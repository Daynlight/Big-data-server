<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import keycloak from '../scripts/keycloak'
import requests from '../scripts/requests'

const respond_print = ref(null)
const sendRequest = async () => {
  
  respond_print.value = await requests.getRequest(
    'http://localhost:18080',
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    })
};
</script>

<template>
  <Navbar />

  <h2>Token:</h2>
  <pre>{{ keycloak?.state.token }}</pre>

  <button class="btn" @click="sendRequest">
    Send Request
  </button>

  <pre>{{ respond_print }}</pre>
</template>