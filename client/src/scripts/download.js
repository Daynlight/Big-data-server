import { ref } from "vue";
import file from "./file";
import requests from "./requests";
import keycloak from "./keycloak";







const saveToDisk = (fileData, filename = "downloaded_file") => {
  if (!fileData) return;

  const blob = new Blob([fileData]);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};




const downloadRequest = async (idf, chunkid, iter = 10) => {
  if(iter < 0) return;

  let respond = await requests.postRequest(
    requests?.backend_server_url + "/download_chunk",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      idf: idf,
      chunkid: chunkid
    });

  const compare = await file?.compareHashes(respond.message.data, respond.message.hash);
  if(!compare)
    return downloadRequest(idf, chunkid, iter - 1);

  return respond.message;
};




const verifyDownloadRequest = async (idf, chunkid, hash, iter = 10) => {
  if(iter < 0) return;

  let respond = await requests.postRequest(
    requests?.backend_server_url + "/verify_download_chunk",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      idf: idf,
      chunkid: chunkid,
      hash: hash
    });

  return respond.message;
};




const download = async (idf, files_list, res_chunks) => {
  const file_from_list = files_list.find(f => f.idf === idf);
  const chunks = file_from_list.chunks;
  
  for(let i = 0; i < chunks; i++){
    let update = true;
    
    if(res_chunks[i]){
      let res = await verifyDownloadRequest(idf, i, res_chunks[i].hash)
      if(res == 0)
        update = false;
    };

    if(update){
      let temp = await downloadRequest(idf, i);
      if(!temp) return;

      res_chunks[i] = temp;
    };
  };
  
  let merge_chunks = [];
  for(let i = 0; i < chunks; i++){
    merge_chunks[i] = res_chunks[i].data;
  };

  let merged = file.mergeChunks(merge_chunks)
  let decompressed = await file?.decompressFile(merged);
  
  saveToDisk(decompressed, file_from_list.name);

  return res_chunks;
};







export default {
  download
};