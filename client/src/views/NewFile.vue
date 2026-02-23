<script setup>
import { onMounted, ref, watch } from 'vue';
import pako from 'pako';
import Navbar from '../components/Navbar.vue'
import keycloak from '../scripts/keycloak'
import requests from '../scripts/requests'
import router from '../scripts/router';
import cookies from '../scripts/cookies';

const name = ref('')
const file = ref(null)
let compressedFile = "";
let compressedChunks = []
let compressedChunksHashes = []
let chunks = 0;






const handleFileChange = (event) => {
  file.value = event.target.files[0]
};

watch(name, (val) =>{
  if(name.value) cookies?.setCookie("uploadName", val);
});

onMounted(() => {
  const uploadName = cookies?.getCookie("uploadName");
  if(uploadName) name.value = uploadName;
});






const compressFile = async () => {
  const arrayBuffer = await file.value.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  const compressed = pako.gzip(uint8Array)

  let binary = ""
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i])
  }

  compressedFile = btoa(binary);
};

const splitFile = () => {
  compressedChunks.length = 0;

  for (let i = 0; i < compressedFile.length; i += 255) {
    compressedChunks.push(compressedFile.substring(i, i + 255))
  }

  chunks = compressedChunks.length
};

const generateHash = async (data) => {
  const encoder = new TextEncoder()
  const encoded = encoder.encode(data)

  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")

  return hashHex
}

const createHashes = async () =>{
  for (let i = 0; i < chunks; i++) {
    compressedChunksHashes.push(await generateHash(compressedChunks[i]))
  };
};




const uploadFile = async () => {
  if(!name || !file) return

  await compressFile();
  splitFile();
  await createHashes();

  if(await createRequest() === -1) return;
  
  for(let i = 0; i < chunks; i++){
    let passed = await uploadChunkRequest(i, compressedChunksHashes[i], compressedChunks[i]);
  }

  cookies?.deleteCookie("uploadName");
  router.push("/")
};








const uploadChunkRequest = async (chunkid, hash, data, iter = 10) =>{
  if(iter < 0) return -1;

  const respond = ref(null)

  respond.value = await requests.postRequest(
    requests?.backend_server_url + "/upload_chunk",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      name: name.value,
      chunkid: chunkid,
      hash: hash,
      data: data
    })

    if(!respond || respond.value.message == -1)
      return await uploadChunkRequest(chunkid, hash, data, iter - 1);
    return 0;
};

const createRequest = async () => {
  const respond = ref(null)

  respond.value = await requests.postRequest(
    requests?.backend_server_url + "/create",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      name: name.value,
      chunks: chunks,
    })

    if(!respond || respond.value.message == -1)
      return -1;
    return 0;
};
</script>

<template>
  <Navbar />

  <form @submit.prevent="uploadFile">
    <div>
      <label>File Name:</label>
      <input
        v-model="name"
        type="text"
        placeholder="Enter file name"
        required
      />
    </div>

    <div>
      <label>Select File:</label>
      <input
        type="file"
        @change="handleFileChange"
        required
      />
    </div>

    <button class="btn" type="submit">
      Create File
    </button>
  </form>
</template>