<template>
    <div v-if="show" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-1/3">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Enter Image URL</h2>
          <button @click="closeModal" class="text-red-600">&times;</button>
        </div>
        <input v-model="uploadPost.url" type="text" placeholder="Enter image URL" class="mb-4 w-full border p-2 rounded" />
        <div v-if="uploadPost.url" class="mb-4">
          <img :src="uploadPost.url" alt="Image Preview" class="w-full h-auto" />
        </div>
        <div class="flex justify-end">
          <button @click="submitUrl" class="bg-blue text-white py-2 px-4 rounded mr-2">Submit</button>
          <button @click="closeModal" class="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    show: Boolean
  });
  
  const emit = defineEmits(['close', 'upload']);
  
  // const imageUrl = ref('');

  import { uploadPost } from '@/scripts/firebaseScripts';
  
  const submitUrl = () => {
    emit('upload', uploadPost.url)
    console.log(uploadPost.url);
    closeModal();
  };
  
  const closeModal = () => {
    emit('close');
  };
  </script>  