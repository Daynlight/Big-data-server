<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import keycloak from '../scripts/keycloak'
import requests from '../scripts/requests'

const files_list = ref(null)
const listRequest = async () => {
  files_list.value = await requests.getRequest(
    requests?.backend_server_url + "/list",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    })
};

listRequest();
</script>

<template>
  <Navbar />

  <pre v-if="files_list">{{ files_list.message }}</pre>
</template>