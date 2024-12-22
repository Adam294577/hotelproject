<script setup>
import FormField from "@/components/bootstrap/FormField.vue";
// zod
import { z } from "zod";
import { validateSchema } from "@/utils/zod/validateSchema";
const config = useRuntimeConfig();
const { $api } = useNuxtApp();
// 標題
const ForgetTitle = computed(() => {
  if (ForgetStep.value === -1) return "變更失敗";
  return ForgetStep.value === 3 ? "密碼已變更" : "忘記密碼";
});
const ForgetStep = ref(1);
const ForgetModel = ref({
  // step1
  email: "",
  code: "",
  // step2
  newPassword: "",
});
// error handle
const ClearErrorMsg = (stepRef) => {
  for (const key in stepRef.value) {
    stepRef.value[key].status = "";
    stepRef.value[key].message = "";
  }
};
const InputClearErrorMsg = (e, stepRef) => {
  if (e.target.nodeName === "INPUT") ClearErrorMsg(stepRef);
};
const MapErrorMsg = (errors, stepRef) => {
  ClearErrorMsg(stepRef);
  errors.forEach((err) => {
    const key = err.path[0];
    if (stepRef.value[key]) {
      stepRef.value[key].status = "is-invalid";
      stepRef.value[key].message = err.message;
    }
  });
};
// 驗證 (step1)
const Step1form = ref(null);
useEventListener(Step1form, "input", (e) => InputClearErrorMsg(e, step1Error));
const Step1Schema = z.object({
  email: z.string().email("請輸入有效的電子信箱"),
  code: z.string().min(1, { message: "請輸入驗證碼" }),
});
const EmailSchema = z.object({
  email: z.string().email("請輸入有效的電子信箱"),
});
const step1Error = ref({
  email: { status: "", message: "" },
  code: { status: "", message: "" },
});
// 驗證碼計時器
const ReGetCodeTimer = ref(0);
const { resume, pause } = useIntervalFn(
  () => {
    ReGetCodeTimer.value--;
    if (ReGetCodeTimer.value === 0) pause();
  },
  1000,
  { immediate: false }
);
const getCode = async () => {
  const EmailData = {
    email: ForgetModel.value.email,
  };
  const { error } = validateSchema(EmailSchema, EmailData, "multError");
  if (error) {
    MapErrorMsg(error, step1Error);
    return;
  }
  const verifyEmail = await $api("verify/email", {
    ...config.public.backendOptions,
    method: "POST",
    body: { email: ForgetModel.value.email },
  });

  if (verifyEmail.data.result.isEmailExists) {
    ReGetCodeTimer.value = 10;
    resume();
    await $api("verify/generateEmailCode", {
      ...config.public.backendOptions,
      method: "POST",
      body: { email: ForgetModel.value.email },
    });
    isLoading.value = false;
    return;
  } else {
    step1Error.value.email.status = "is-invalid";
    step1Error.value.email.message = "此信箱尚未註冊";
    isLoading.value = false;
  }
};
const isLoading = ref(false);
const ToStep2 = async () => {
  const step1Data = {
    email: ForgetModel.value.email,
    code: ForgetModel.value.code,
  };
  const { error } = validateSchema(Step1Schema, step1Data, "multError");
  if (error) {
    MapErrorMsg(error, step1Error);
    return;
  }
  isLoading.value = true;
  const verifyEmail = await $api("verify/email", {
    ...config.public.backendOptions,
    method: "POST",
    body: { email: ForgetModel.value.email },
  });
  if (verifyEmail.data.result.isEmailExists) {
    isLoading.value = false;
    ForgetStep.value = 2;
    return;
  } else {
    step1Error.value.email.status = "is-invalid";
    step1Error.value.email.message = "此信箱尚未註冊";
    isLoading.value = false;
  }
};
// 驗證 (step2)
const Step2form = ref(null);
useEventListener(Step2form, "input", (e) => InputClearErrorMsg(e, step2Error));
const Step2Schema = z.object({
  newPassword: z
    .string()
    .min(8, "密碼至少需要8位數")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/, "密碼必須包含英數混合"),
});
const step2Error = ref({
  newPassword: { status: "", message: "" },
});
const handForgetData = async () => {
  const step2Data = {
    newPassword: ForgetModel.value.newPassword,
  };
  const { error } = validateSchema(Step2Schema, step2Data, "multError");
  if (error) {
    MapErrorMsg(error, step2Error);
    return;
  }
  isLoading.value = true;
  const postBody = {
    email: ForgetModel.value.email,
    code: ForgetModel.value.code,
    newPassword: ForgetModel.value.newPassword,
  };
  const res = await $api("user/Forgot", {
    ...config.public.backendOptions,
    method: "POST",
    body: postBody,
  });
  // console.log("res", res);
  // 就算驗證碼輸入錯的 目前後端一樣會回狀態碼200 且不會變更密碼
  // 暫時畫面模擬 使用者輸入code不等於6個字元時 就會判定變更失敗
  if (res.success && ForgetModel.value.code.length === 6) {
    ForgetStep.value = 3;
  } else {
    ForgetStep.value = -1;
    ForgetModel.value.email = "";
    ForgetModel.value.code = "";
    ForgetModel.value.newPassword = "";
  }
  isLoading.value = false;
};
</script>
<template>
  <ClientOnly>
    <div class="p-5 px-md-0 py-md-30" style="min-width: 400px">
      <div class="mb-10">
        <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
          享樂酒店，誠摯歡迎
        </p>
        <h1 class="mb-4 text-neutral-0 fw-bold">{{ ForgetTitle }}</h1>

        <div
          class="d-flex align-items-center py-4 gap-2"
          :class="{ 'd-none': ForgetStep === 3 || ForgetStep === -1 }"
        >
          <div
            class="d-flex flex-column align-items-center gap-1 text-neutral-0"
          >
            <span
              :class="{ 'd-none': ForgetStep >= 2 }"
              class="step p-2 bg-primary-100 rounded-circle"
              >1</span
            >
            <Icon
              :class="{ 'd-none': ForgetStep === 1 }"
              class="p-2 fs-3 bg-primary-100 rounded-circle"
              name="material-symbols:check"
            />
            <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱</p>
          </div>

          <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

          <div
            :class="{
              'text-neutral-0': ForgetStep === 2,
              'text-neutral-60': ForgetStep === 1,
            }"
            class="d-flex flex-column align-items-center gap-1"
          >
            <span
              :class="{
                'bg-primary-100': ForgetStep === 2,
                'bg-transparent border border-neutral-60': ForgetStep === 1,
              }"
              class="step p-2 rounded-circle"
              >2</span
            >
            <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入新密碼</p>
          </div>
        </div>
      </div>

      <div class="mb-4 row">
        <form
          ref="Step1form"
          :class="{ 'd-none': ForgetStep !== 1 }"
          class="mb-4"
        >
          <FormField
            :id="'email'"
            :label="'電子信箱'"
            :wrapperClass="'mb-4 fs-8 fs-md-7'"
            :labelClass="'mb-2 text-neutral-0 fw-bold'"
            :inputClass="'form-control p-4 text-neutral-100 fw-medium border-neutral-40'"
            :type="'email'"
            :placeholder="'請輸入電子信箱'"
            :status="step1Error.email.status"
            :feedback="step1Error.email.message"
            v-model="ForgetModel.email"
          >
          </FormField>
          <FormField
            :id="'code'"
            :label="'驗證碼'"
            :wrapperClass="'mb-4 fs-8 fs-md-7'"
            :labelClass="'mb-2 text-neutral-0 fw-bold'"
            :inputClass="'form-control p-4 text-neutral-100 fw-medium border-neutral-40 '"
            :type="'text'"
            :placeholder="'請輸入驗證碼'"
            :status="step1Error.code.status"
            :feedback="step1Error.code.message"
            v-model="ForgetModel.code"
          >
          </FormField>
          <button
            class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold mt-6"
            type="button"
            @click="getCode"
            :disabled="ReGetCodeTimer !== 0"
          >
            {{ ReGetCodeTimer === 0 ? "取得驗證碼" : `${ReGetCodeTimer}s` }}
          </button>
          <button
            class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold mt-5"
            type="button"
            @click="ToStep2()"
            :disabled="isLoading"
          >
            下一步
          </button>
        </form>
        <form
          ref="Step2form"
          :class="{ 'd-none': ForgetStep !== 2 }"
          class="mb-4"
        >
          <FormField
            :id="'newPassword'"
            :label="'新密碼'"
            :wrapperClass="'mb-4 fs-8 fs-md-7'"
            :labelClass="'mb-2 text-neutral-0 fw-bold'"
            :inputClass="'form-control p-4 text-neutral-100 fw-medium border-neutral-40'"
            :type="'password'"
            :placeholder="'新密碼'"
            :status="step2Error.newPassword.status"
            :feedback="step2Error.newPassword.message"
            v-model="ForgetModel.newPassword"
          >
          </FormField>
          <button
            class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold mt-5"
            type="button"
            @click="handForgetData"
          >
            變更密碼
          </button>
        </form>
      </div>
      <button
        v-show="ForgetStep === 3"
        @click="navigateTo('login')"
        class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
        type="button"
      >
        <span>會員登入</span>
      </button>
      <button
        v-show="ForgetStep === -1"
        @click="ForgetStep = 1"
        class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
        type="button"
      >
        <span>重新輸入</span>
      </button>
    </div>
  </ClientOnly>
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

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>
