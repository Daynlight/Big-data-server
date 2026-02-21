import { reactive } from "vue"
import Keycloak from "keycloak-js"

let refreshInterval = null

const keycloak = new Keycloak({
  url: "https://auth.daynlight.pl",
  realm: "Big-data-server-users",
  clientId: "frontend"
})

const state = reactive({
  authenticated: false,
  token: null,
  username: null
})

const init = async () => {
  const auth = await keycloak.init({
    onLoad: "check-sso",
    checkLoginIframe: false
  })

  await updateState()
  startAutoRefresh()

  return auth
}

const updateState = async () => {
  state.authenticated = keycloak.authenticated
  if (!keycloak.authenticated) return

  try {
    await keycloak.updateToken(30)

    state.token = keycloak.token
    state.username = keycloak.tokenParsed?.preferred_username

  } catch (err) {
    console.error("Token update failed", err)
  }
}

const startAutoRefresh = () => {
  if (refreshInterval) return

  refreshInterval = setInterval(async () => {
    if (!keycloak.authenticated) return

    try {
      const refreshed = await keycloak.updateToken(30)

      if (refreshed) {
        console.log("Token refreshed automatically")
      }

      state.token = keycloak.token
      state.username = keycloak.tokenParsed?.preferred_username

    } catch (err) {
      console.error("Auto refresh failed", err)
      logout()
    }

  }, 60000)
}

const login = () => {
  keycloak.login({
    redirectUri: window.location.origin + "/"
  })
}

const register = () => {
  keycloak.register({
    redirectUri: window.location.origin + "/"
  })
}

const logout = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
  keycloak.logout({
    redirectUri: window.location.origin + "/auth"
  })
}




export default {
  keycloak,
  state,
  init,
  login,
  register,
  logout
}