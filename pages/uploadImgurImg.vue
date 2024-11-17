<script setup>
definePageMeta({
  middleware: "dev-only",
});
const loading = ref(false);
async function uploadImages() {
  if (loading.value) return;
  loading.value = true;

  try {
    const result = await $fetch("/api/Imgur/uploadImages");
    console.log("Upload results:", result);
  } catch (error) {
    console.error("Error uploading images:", error);
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div>上傳public/images資料夾所有圖片至Imgur</div>
  <button @click="uploadImages()">上傳</button>
</template>

<style lang="scss" scoped></style>
