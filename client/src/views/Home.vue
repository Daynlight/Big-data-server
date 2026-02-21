<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'

const { proxy } = getCurrentInstance()
const keycloak = proxy.$keycloak

const token = ref('')
const username = ref('')

const loadUserData = async () => {
  if (!keycloak) return

  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30)

      token.value = keycloak.token
      username.value = keycloak.tokenParsed?.preferred_username
    } catch (err) {
      console.error('Token update failed', err)
    }
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<template>
  <Navbar />

  <h2>Username:</h2>
  <h3>{{ username }}</h3>

  <h2>Token:</h2>
  <pre>{{ token }}</pre>
</template>