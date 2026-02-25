import keycloak from "./keycloak";
import requests from "./requests";







const listPage = async (page = 1) => {
  let respond = await requests.postRequest(
    requests?.backend_server_url + "/list",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      page: page
    });

  return respond.message;
};







export default {
  listPage
};