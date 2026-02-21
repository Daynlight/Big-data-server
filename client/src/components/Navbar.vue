<script setup>
import { computed } from "vue"
import keycloak from "../scripts/keycloak"
const username = computed(() => keycloak.state.username)
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">

      <router-link v-if="username" class="navbar-brand" to="/">
        Hello {{ username }}
      </router-link>
      <router-link v-if="!username" class="navbar-brand" to="/">
        Big data server
      </router-link>

      <div>
        <router-link class="nav-link d-inline text-white me-3" to="/">
          Home
        </router-link>

        <router-link
          v-if="!keycloak?.state.authenticated"
          class="nav-link d-inline text-white me-3"
          to="/auth"
        >
          Login
        </router-link>

        <button
          v-if="keycloak?.state.authenticated"
          class="nav-link d-inline text-white me-3"
          @click="keycloak?.logout"
        >
          Logout
        </button>

      </div>
    </div>
  </nav>
</template>