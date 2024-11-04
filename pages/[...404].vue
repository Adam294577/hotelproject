<script setup>
const router = useRouter();
const ToHome = () => {
  router.push("/");
};
</script>
<template>
  <div>找不到頁面</div>
  <button @click="ToHome">回首頁</button>
</template>

<style lang="scss" scoped></style>
