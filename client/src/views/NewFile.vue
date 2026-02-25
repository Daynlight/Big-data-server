<script setup>
import { onMounted, ref, watch } from 'vue';
import Navbar from '../components/Navbar.vue';
import cookies from '../scripts/cookies';
import upload from '../scripts/upload';




const name = ref('');
const file_data = ref(null);







const handleFileChange = (event) => {
  file_data.value = event.target.files[0];
  if(name.value == '')
    name.value = event.target.files[0].name;
};




watch(name, (val) =>{
  if(name.value) cookies?.setCookie("uploadName", val);
});




const uploadFile = async() =>{
  await upload.uploadFile(name.value, file_data.value);
};




onMounted(() => {
  const uploadName = cookies?.getCookie("uploadName");
  if(uploadName) name.value = uploadName;
});
</script>




<template>
  <Navbar />

  <form @submit.prevent="uploadFile">
    <div>
      <div>
        <label>Select File:</label>
        <input
          type="file"
          @change="handleFileChange"
          required
        />
      </div>

      <label>File Name:</label>
      <input
        v-model="name"
        type="text"
        placeholder="Enter file name"
        required
      />
    </div>

    <button class="btn" type="submit">
      Create File
    </button>
  </form>
</template>