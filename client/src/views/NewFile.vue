<script setup>
import { ref } from 'vue';
import Navbar from '../components/Navbar.vue'
import keycloak from '../scripts/keycloak'
import requests from '../scripts/requests'
import router from '../scripts/router';

const name = ref('')
const file = ref(null)

const handleFileChange = (event) => {
  file.value = event.target.files[0]
}

const createRequest = async () => {
  if(!name || !file) return

  await requests.postRequest(
    requests?.backend_server_url + "/create",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      name: name.value,
    })

    

    router.push("/")
};

</script>

<template>
  <Navbar />

  <form @submit.prevent="createRequest">
    <div>
      <label>File Name:</label>
      <input
        v-model="name"
        type="text"
        placeholder="Enter file name"
        required
      />
    </div>

    <div>
      <label>Select File:</label>
      <input
        type="file"
        @change="handleFileChange"
        required
      />
    </div>

    <button class="btn" type="submit">
      Create File
    </button>
  </form>
</template>