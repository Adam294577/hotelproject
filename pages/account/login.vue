<script setup>
// zod
import { z } from "zod";
import { validateSchema } from "@/utils/zod/validateSchema";
// pinia
const userStore = useUserStore();
// Login
const loading = ref(false);
const config = useRuntimeConfig();
const { $api } = useNuxtApp();
useEventListener(document, "keydown", (e) => {
  if (e.key === "Enter") handLogin();
});
const handLogin = async () => {
  const { error, data } = validateSchema(LoginSchema, LoginModel.value);
  if (error) return (LoginError.value = error);

  loading.value = true;
  const res = await $api("/user/login", {
    ...config.public.backendOptions,
    method: "POST",
    body: data,
  });
  if (res.error) {
    LoginError.value = res.error.message;
    loading.value = false;
    return;
  }

  if (res.data) {
    userStore.userData = res.data.result;
    if (userStore.isRemembered) {
      userStore.RememberedAccount = res.data.result.email;
    }
    const userToken = useCookie("userToken", {
      maxAge: 60 * 60 * 24 * 7,
    });
    userToken.value = res.data.token;
    setAuthorization(res.data.token);
    if (userStore.successLoginPath) {
      navigateTo(userStore.successLoginPath);
    } else {
      navigateTo("/");
    }
  }
};
const LoginSchema = z.object({
  email: z.string().email("請輸入有效的電子信箱"),
  password: z
    .string()
    .min(8, "密碼至少需要8位數")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/, "密碼必須包含英數混合"),
});
const LoginFrom = ref(null);
const LoginModel = ref({
  email: "",
  password: "",
});
const LoginError = ref("");
const clearLoginError = (e) => {
  if (e.target.nodeName === "INPUT") LoginError.value = "";
};
useEventListener(LoginFrom, "input", clearLoginError);

onBeforeMount(() => {
  if (!userStore.isRemembered) {
    userStore.RememberedAccount = "";
  } else {
    LoginModel.value.email = userStore.RememberedAccount;
  }
});
</script>

<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="text-neutral-0 fw-bold">立即開始旅程</h1>
    </div>
    <ClientOnly>
      <form class="mb-10" ref="LoginFrom">
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="email">
            電子信箱
          </label>
          <input
            id="email"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            v-focus
            v-model="LoginModel.email"
            placeholder="請輸入信箱"
            type="email"
          />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="password">
            密碼
          </label>
          <input
            id="password"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            v-model="LoginModel.password"
            placeholder="請輸入密碼"
            type="password"
          />
        </div>
        <div
          class="d-flex justify-content-between align-items-center mb-10 fs-8 fs-md-7 position-relative"
        >
          <div class="form-check d-flex align-items-end gap-2 text-neutral-0">
            <input
              id="remember"
              class="form-check-input"
              type="checkbox"
              v-model="userStore.isRemembered"
            />
            <label class="form-check-label fw-bold" for="remember">
              記住帳號
            </label>
          </div>
          <button
            class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
            type="button"
            @click="navigateTo('/account/forget')"
          >
            忘記密碼？
          </button>

          <div
            class="position-absolute top-100 fs-7 fw-bold"
            style="color: #f00; margin-top: 0.3rem"
          >
            {{ LoginError }}
          </div>
        </div>
        <button
          @click="handLogin"
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="button"
          :disabled="loading"
        >
          <span>會員登入</span>
        </button>
      </form>
    </ClientOnly>
    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">沒有會員嗎？</span>
      <NuxtLink
        to="/account/signup"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>前往註冊</span>
      </NuxtLink>
    </p>
  </div>
</template>
<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}
</style>
