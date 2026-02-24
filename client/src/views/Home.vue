<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import keycloak from '../scripts/keycloak'
import requests from '../scripts/requests'
import file from '../scripts/file'

const files_list = ref(null)
let respond = ref(null);

const listRequest = async () => {
  files_list.value = await requests.postRequest(
    requests?.backend_server_url + "/list",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      page: 1
    })
};

const compareHahshes = async (data, hash) =>{
  let validate_hash = await file.generateHashFromBufferObject(data);
  return hash == validate_hash;
}

const mergeChunks = (chunks) => {
  if (!chunks || !Array.isArray(chunks)) return null;

  const buffers = chunks.map(chunk => {
    if (chunk instanceof ArrayBuffer) {
      return new Uint8Array(chunk);
    }

    if (chunk.data) {
      return new Uint8Array(chunk.data);
    }

    return new Uint8Array(chunk);
  });

  // Calculate total length
  const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);

  const merged = new Uint8Array(totalLength);

  let offset = 0;
  for (const buf of buffers) {
    merged.set(buf, offset);
    offset += buf.length;
  }

  return merged;
};

const saveToDisk = (fileData, filename = "downloaded_file") => {
  if (!fileData) return;

  const blob = new Blob([fileData]);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // default name
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const download = async (idf) => {
  const file_from_list = files_list.value.message.find(f => f.idf === idf);
  const chunks = file_from_list.chunks
  let res_chunks = []

  for(let i = 0; i < chunks; i++){
    let temp = await downloadRequest(idf, i);
    if(!temp) {
      return;
    };
    res_chunks[i] = temp.data;
  };

  let merged = mergeChunks(res_chunks)
  let decompressed = await file?.decompressFile(merged);

  saveToDisk(decompressed, file_from_list.name)
};

const downloadRequest = async (idf, chunkid, iter = 10) => {
  if(iter < 0) return;

  respond.value = await requests.postRequest(
    requests?.backend_server_url + "/download_chunk",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      idf: idf,
      chunkid: chunkid
    })

  const compare = await compareHahshes(respond.value.message.data, respond.value.message.hash);
  if(!compare)
    return downloadRequest(idf, chunkid, iter - 1);

  return respond.value.message;
};

listRequest();
</script>

<template>
  <Navbar />

  <div v-if="files_list">
    <div
      v-for="file in files_list.message"
      :key="file.idf">
      <div>
        <strong>{{ file.name }}</strong>
      </div>
      
      <div>chunks: {{ file.chunks }}</div>
      
      <button @click="download(file.idf)">
        Download
      </button>
    </div>
  </div>
</template>