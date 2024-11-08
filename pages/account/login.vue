<script setup>
const router = useRouter();
const testLogin = () => {
  localStorage.setItem("tk", "123");
  router.push("/");
};
</script>

<template>
  <div>登入頁面</div>
  <button @click="testLogin" type="button" class="btn btn-primary">登入</button>
</template>

<style lang="scss" scoped></style>
