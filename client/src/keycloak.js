import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: "auth.daynlight.pl",
  realm: "Big-data-server-users",
  clientId: 'frontend'
})

export default keycloak