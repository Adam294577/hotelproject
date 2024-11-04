<script setup>
const route = useRoute();
console.log("route", route);
</script>
<template>
  <div>
    <div>預定資訊確認: {{ route.params.roomId }}</div>
  </div>
</template>

<style lang="scss" scoped></style>
