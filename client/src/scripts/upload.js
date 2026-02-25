import keycloak from '../scripts/keycloak';
import requests from '../scripts/requests';
import router from '../scripts/router';
import file from "./file";
import cookies from './cookies';







const uploadFile = async (name, file_data) => {
  if(!name || !file) return;

  let compressed_file = await file?.compressFile(file_data);
  let file_chunks = file?.splitFile(compressed_file);
  let hashes = [];
  let chunks = file_chunks.length;

  for (let i = 0; i < chunks; i++)
    hashes.push(await file?.generateHash(file_chunks[i]));

  if(await createRequest(name, chunks) === -1) return;
  
  for(let i = 0; i < chunks; i++){
    if(await verifyChunkRequest(name, i, hashes[i]) == -1)
      await uploadChunkRequest(name, i, hashes[i], file_chunks[i]);
  };

  cookies?.deleteCookie("uploadName");
  router.push("/");
};




const uploadChunkRequest = async (name, chunkid, hash, data, iter = 10) =>{
  if(iter < 0) return;

  let respond = await requests.postRequest(
    requests?.backend_server_url + "/upload_chunk",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      name: name,
      chunkid: chunkid,
      hash: hash,
      data: data
    });

    if(!respond || respond.message == -1)
      return await uploadChunkRequest(chunkid, hash, data, iter - 1);
    return;
};




const verifyChunkRequest = async (name, chunkid, hash, iter = 10) =>{
  if(iter < 0) return -1;

  let respond = await requests.postRequest(
    requests?.backend_server_url + "/verify_chunk",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      name: name,
      chunkid: chunkid,
      hash: hash,
    });

    if(!respond || respond.message == -1)
      return -1;
    return 0;
};




const createRequest = async (name, chunks) => {
  if(!chunks) return;

  let respond = await requests.postRequest(
    requests?.backend_server_url + "/create",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      name: name,
      chunks: chunks,
    });

    if(!respond || respond.message == -1)
      return -1;
    return 0;
};







export default {
  uploadFile
};