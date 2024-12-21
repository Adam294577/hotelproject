<script setup>
import FormField from "@/components/bootstrap/FormField.vue";
// composables
import { useDateOption } from "@/composables/dateOption";
import { useAddressOption } from "@/composables/addressOption";
// zod
import { z } from "zod";
import { validateSchema } from "@/utils/zod/validateSchema";
const config = useRuntimeConfig();
const { $api } = useNuxtApp();
// 標題
const signupTitle = computed(() => {
  return signupStep.value === 3 ? "註冊成功" : "立即註冊";
});

const signupStep = ref(1);
const SignupModel = ref({
  // step1
  email: "",
  password: "",
  confirmPassword: "",
  // step2
  name: "",
  phone: "",
  address: "",
  zone: {
    zip: "",
    area: "",
  },
  addressDetail: "",
  term: false,
});
// 日期處理
const { yearOpt, monthOpt, dayOpt, updateDayOpt } = useDateOption();
const birthDate = ref({
  year: yearOpt.value[0],
  month: monthOpt.value[0],
  day: 1,
});
const formatBirthDate = () => {
  const y = birthDate.value.year;
  const m = String(birthDate.value.month).padStart(2, "0");
  const d = String(birthDate.value.day).padStart(2, "0");
  const formattedDate = `${y}/${m}/${d}`; // 組成 YYYY/mm/dd 格式
  return formattedDate;
};
const ChangeDate = () => {
  updateDayOpt(birthDate.value.month, birthDate.value.year);
  if (birthDate.value.day > dayOpt.value.length) birthDate.value.day = 1;
};
onMounted(() => {
  ChangeDate();
});
// 地址
const { data: AddressData } = await useFetch("/api/zipcode");
const { cityOpt, zoneOpt, updateZoneOpt } = useAddressOption(
  AddressData.value,
  SignupModel.value
);
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
// 註冊驗證 (step1)
const Step1form = ref(null);
useEventListener(Step1form, "input", (e) => InputClearErrorMsg(e, step1Error));
const Step1Schema = z
  .object({
    email: z.string().email("請輸入有效的電子信箱"),
    password: z
      .string()
      .min(8, "密碼至少需要8位數")
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/, "密碼必須包含英數混合"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "確認密碼必須和密碼相同",
      });
    }
  });
const step1Error = ref({
  email: { status: "", message: "" },
  password: { status: "", message: "" },
  confirmPassword: { status: "", message: "" },
});
const isLoading = ref(false);
const ToStep2 = async () => {
  const step1Data = {
    email: SignupModel.value.email,
    password: SignupModel.value.password,
    confirmPassword: SignupModel.value.confirmPassword,
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
    body: { email: SignupModel.value.email },
  });
  if (verifyEmail.data.result.isEmailExists) {
    step1Error.value.email.status = "is-invalid";
    step1Error.value.email.message = "此信箱已註冊過";
    isLoading.value = false;
    return;
  }
  isLoading.value = false;
  signupStep.value = 2;
};
// 註冊驗證 (step2)
const Step2form = ref(null);
useEventListener(Step2form, "input", (e) => InputClearErrorMsg(e, step2Error));
const Step2Schema = z.object({
  name: z.string().min(1, { message: "請輸入姓名" }),
  phone: z
    .string()
    .min(1, { message: "請輸入手機號碼" })
    .regex(/^(?:\+886\s?|0)(9\d{2})\s?(\d{3})\s?(\d{3})$/, {
      message: "請輸入有效的手機號碼",
    }),
  addressDetail: z.string().min(1, { message: "請輸入詳細地址" }),
  term: z.boolean().refine((val) => val === true, {
    message: "請勾選條款規範",
  }),
});
const step2Error = ref({
  name: { status: "", message: "" },
  phone: { status: "", message: "" },
  addressDetail: { status: "", message: "" },
  term: { status: "", message: "" },
});
const handSignupData = async () => {
  const step2Data = {
    name: SignupModel.value.name,
    phone: SignupModel.value.phone,
    addressDetail: SignupModel.value.addressDetail,
    term: SignupModel.value.term,
  };
  const { error } = validateSchema(Step2Schema, step2Data, "multError");
  if (error) {
    MapErrorMsg(error, step2Error);
    return;
  }

  isLoading.value = true;
  const postBody = {
    name: SignupModel.value.name,
    email: SignupModel.value.email,
    password: SignupModel.value.password,
    phone: SignupModel.value.phone,
    birthday: formatBirthDate(),
    address: {
      zipcode: SignupModel.value.zone.zip,
      // 有些縣市的區域代碼會重複而無法辨別 (後端api /user 也無法取得)
      // 故 detail 改成post完整地址內容
      detail: `${SignupModel.value.address}-${SignupModel.value.zone.area}-${SignupModel.value.addressDetail}`,
    },
  };
  const { data: signupData } = await useFetch("user/signup", {
    ...config.public.backendOptions,
    method: "POST",
    body: postBody,
  });
  if (signupData.value.status) {
    isLoading.value = false;
    signupStep.value = 3;
  }
};
</script>
<template>
  <div class="p-5 px-md-0 py-md-30" style="min-width: 400px">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">{{ signupTitle }}</h1>

      <div
        class="d-flex align-items-center py-4 gap-2"
        :class="{ 'd-none': signupStep === 3 }"
      >
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': signupStep >= 2 }"
            class="step p-2 bg-primary-100 rounded-circle"
            >1</span
          >
          <Icon
            :class="{ 'd-none': signupStep === 1 }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            name="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

        <div
          :class="{
            'text-neutral-0': signupStep === 2,
            'text-neutral-60': signupStep === 1,
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': signupStep === 2,
              'bg-transparent border border-neutral-60': signupStep === 1,
            }"
            class="step p-2 rounded-circle"
            >2</span
          >
          <p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
        </div>
      </div>
    </div>

    <div class="mb-4 row">
      <form
        ref="Step1form"
        :class="{ 'd-none': signupStep !== 1 }"
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
          v-model="SignupModel.email"
        >
        </FormField>
        <FormField
          :id="'password'"
          :label="'密碼'"
          :wrapperClass="'mb-4 fs-8 fs-md-7'"
          :labelClass="'mb-2 text-neutral-0 fw-bold'"
          :inputClass="'form-control p-4 text-neutral-100 fw-medium border-neutral-40'"
          :type="'password'"
          :placeholder="'請輸入密碼'"
          :status="step1Error.password.status"
          :feedback="step1Error.password.message"
          v-model="SignupModel.password"
        >
        </FormField>
        <FormField
          :id="'confirmPassword'"
          :label="'確認密碼'"
          :wrapperClass="'mb-10 fs-8 fs-md-7'"
          :labelClass="'mb-2 text-neutral-0 fw-bold'"
          :inputClass="'form-control p-4 text-neutral-100 fw-medium border-neutral-40'"
          :type="'password'"
          :placeholder="'請再輸入一次密碼'"
          :status="step1Error.confirmPassword.status"
          :feedback="step1Error.confirmPassword.message"
          v-model="SignupModel.confirmPassword"
        >
        </FormField>
        <button
          class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
          type="button"
          @click="ToStep2()"
          :disabled="isLoading"
        >
          下一步
        </button>
      </form>
      <form
        ref="Step2form"
        :class="{ 'd-none': signupStep !== 2 }"
        class="mb-4"
      >
        <FormField
          :id="'name'"
          :label="'姓名'"
          :wrapperClass="'mb-4 fs-8 fs-md-7'"
          :labelClass="'mb-2 text-neutral-0 fw-bold'"
          :inputClass="'form-control p-4 text-neutral-100 fw-medium border-neutral-40'"
          :type="'text'"
          :placeholder="'請輸入姓名'"
          :status="step2Error.name.status"
          :feedback="step2Error.name.message"
          v-model="SignupModel.name"
        >
        </FormField>
        <FormField
          :id="'phone'"
          :label="'手機號碼'"
          :wrapperClass="'mb-4 fs-8 fs-md-7'"
          :labelClass="'mb-2 text-neutral-0 fw-bold'"
          :inputClass="'form-control p-4 text-neutral-100 fw-medium border-neutral-40'"
          :type="'tel'"
          :placeholder="'請輸入手機號碼'"
          :status="step2Error.phone.status"
          :feedback="step2Error.phone.message"
          v-model="SignupModel.phone"
        >
        </FormField>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="birth"> 生日 </label>
          <div class="d-flex gap-2">
            <select
              @change="ChangeDate"
              v-model="birthDate.year"
              id="birth"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
            >
              <option v-for="year in yearOpt" :key="year" :value="year">
                {{ year }} 年
              </option>
            </select>
            <select
              @change="ChangeDate"
              v-model="birthDate.month"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
            >
              <option v-for="month in monthOpt" :key="month" :value="month">
                {{ month }} 月
              </option>
            </select>
            <select
              v-model="birthDate.day"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
            >
              <option v-for="day in dayOpt" :key="day" :value="day">
                {{ day }} 日
              </option>
            </select>
          </div>
        </div>
        <div class="mb-6 fs-8 fs-md-7">
          <label class="form-label text-neutral-0 fw-bold" for="address">
            地址
          </label>
          <div>
            <div class="d-flex gap-2 mb-2">
              <select
                @change="updateZoneOpt"
                v-model="SignupModel.address"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              >
                <option v-for="list in cityOpt" :key="list" :value="list">
                  {{ list }}
                </option>
              </select>
              <select
                v-model="SignupModel.zone"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              >
                <option v-for="list in zoneOpt" :key="list.zip" :value="list">
                  {{ list.area }}
                </option>
              </select>
            </div>
            <FormField
              :id="'address'"
              :label="''"
              :wrapperClass="''"
              :labelClass="'d-none'"
              :inputClass="'form-control p-4 rounded-3'"
              :type="'text'"
              :placeholder="'請輸入詳細地址'"
              :status="step2Error.addressDetail.status"
              :feedback="step2Error.addressDetail.message"
              v-model="SignupModel.addressDetail"
            >
            </FormField>
          </div>
        </div>
        <FormField
          :id="'agreementCheck'"
          :label="'我已閱讀並同意本網站個資使用規範'"
          :wrapperClass="'d-flex align-items-end gap-2 mb-3  text-neutral-0'"
          :labelClass="'fw-bold'"
          :inputClass="'form-check-input'"
          :type="'checkbox'"
          :status="step2Error.term.status"
          :feedback="step2Error.term.message"
          v-model="SignupModel.term"
        >
        </FormField>

        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold mt-5"
          type="button"
          @click="handSignupData"
        >
          完成註冊
        </button>
      </form>
    </div>

    <p class="mb-0 fs-8 fs-md-7" v-show="signupStep !== 3">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
      </NuxtLink>
    </p>
    <button
      v-show="signupStep === 3"
      @click="navigateTo('login')"
      class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
      type="button"
    >
      <span>會員登入</span>
    </button>
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

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>
