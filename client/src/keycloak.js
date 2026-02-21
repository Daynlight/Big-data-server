import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: "https://" + import.meta.env.VITE_KEYCLOAK_URL,
  realm: "Big-data-server-users",
  clientId: 'frontend'
})

export default keycloak