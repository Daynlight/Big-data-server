import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: "https://" + import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: 'frontend'
})

export default keycloak