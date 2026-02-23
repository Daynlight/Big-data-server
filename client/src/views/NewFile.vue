<script setup>
import { onMounted, ref, watch } from 'vue';
import Navbar from '../components/Navbar.vue'
import keycloak from '../scripts/keycloak'
import requests from '../scripts/requests'
import router from '../scripts/router';
import cookies from '../scripts/cookies';
import file from '../scripts/file';

const name = ref('')
const file_data = ref(null)






const handleFileChange = (event) => {
  file_data.value = event.target.files[0]
};

watch(name, (val) =>{
  if(name.value) cookies?.setCookie("uploadName", val);
});

onMounted(() => {
  const uploadName = cookies?.getCookie("uploadName");
  if(uploadName) name.value = uploadName;
});





const uploadFile = async () => {
  if(!name || !file) return

  let compressed_file = await file?.compressFile(file_data.value);
  let file_chunks = file?.splitFile(compressed_file);
  let hashes = []
  let chunks = file_chunks.length;

  for (let i = 0; i < chunks; i++)
    hashes.push(await file?.generateHash(file_chunks[i]));

  if(await createRequest(chunks) === -1) return;
  
  for(let i = 0; i < chunks; i++){
    if(await verifyChunkRequest(i, hashes[i]) == -1)
      await uploadChunkRequest(i, hashes[i], file_chunks[i]);
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

const verifyChunkRequest = async (chunkid, hash, iter = 10) =>{
  if(iter < 0) return -1;

  const respond = ref(null)

  respond.value = await requests.postRequest(
    requests?.backend_server_url + "/verify_chunk",
    {
      Authorization: `Bearer ${keycloak?.state.token}`
    },{
      name: name.value,
      chunkid: chunkid,
      hash: hash,
    })

    if(!respond || respond.value.message == -1)
      return -1;
    return 0;
};

const createRequest = async (chunks) => {
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