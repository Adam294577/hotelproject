<script setup>
const router = useRouter();
const ToHome = async () => {
  await navigateTo("/");
};
</script>
<template>
  <div>找不到頁面</div>
  <button @click="ToHome">回首頁</button>
</template>

<style lang="scss" scoped></style>
