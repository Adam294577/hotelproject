<script setup>
const router = useRouter();
const testLogin = () => {
  localStorage.setItem("tk", "123");
  router.push("/");
};
const toSignup = () => {
  router.push("/account/signup");
};
if (import.meta.client) {
  localStorage.removeItem("tk");
}
</script>

<template>
  <div>登入頁面</div>
  <button @click="testLogin" type="button" class="btn btn-primary">登入</button>
  <button @click="toSignup" type="button" class="btn btn-primary">註冊</button>
</template>

<style lang="scss" scoped></style>
