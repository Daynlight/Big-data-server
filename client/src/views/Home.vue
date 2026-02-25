<script setup>
import { onMounted, ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import download from '../scripts/download';
import list from '../scripts/list';
import cookies from "../scripts/cookies";




const files_list = ref(null);
let res_chunks = [];
let page = 1;







const downloadRequest = async (idf) =>{
  res_chunks = await download.download(idf, files_list.value, res_chunks);
};




const listPage = async(page = 1) =>{
  files_list.value = await list.listPage(page);
  cookies.setCookie("page", page);
};




const nextPage = async() => {
  if(files_list.value.length < 10) return;
  page++;
  listPage(page);
  cookies.setCookie("page", page);
};




const previousPage = async() =>{
  if(page <= 1) return;
  page--;
  listPage(page);
};




onMounted(() => {
  page = cookies.getCookie("page");
  if(!page) page = 1;
  listPage(page);
});
</script>




<template>
  <Navbar />

  <div v-if="files_list">
    <div
      v-for="file in files_list"
      :key="file.idf">
      <div>
        <strong>{{ file.name }}</strong>
      </div>
      
      <div>chunks: {{ file.chunks }}</div>
      
      <button @click="downloadRequest(file.idf)">
        Download
      </button>
    </div>
  </div>

  <button @click="previousPage">previousPage</button>
  <button @click="nextPage">NextPage</button>
</template>