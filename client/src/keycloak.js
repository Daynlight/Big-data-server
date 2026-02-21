import Keycloak from 'keycloak-js'

// [TODO] Note change to docker env variable
const keycloak = new Keycloak({
  url: "https://auth.daynlight.pl",
  realm: "Big-data-server-users",
  clientId: 'frontend'
})

export default keycloak