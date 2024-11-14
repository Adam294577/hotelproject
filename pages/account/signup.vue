<script setup>
import FormField from "@/components/bootstrap/FormField.vue";
// composables
import { useDateOption } from "@/composables/dateOption";
import { useAddressOption } from "@/composables/addressOption";

const SignupModel = ref({
  // step1
  email: null,
  pwd: null,
  pwdAgain: null,
  // step2
  name: null,
  phone: null,
  birthDate: null,
  address: null,
  zip: null,
  addressDetail: null,
  Terms: null,
});
// 日期處理
const { yearOpt, monthOpt, dayOpt, updateDayOpt } = useDateOption();
const birthDate = ref({
  year: yearOpt.value[0],
  month: monthOpt.value[0],
  day: 1,
});
const formatBirthDate = () => {};
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
const vaildateStep1 = () => {};
const vaildateStep2 = () => {};
const modelValue = ref(null);
const isEmailAndPasswordValid = ref(false);
</script>
<template>
  <div class="p-5 px-md-0 py-md-30" style="min-width: 400px">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">立即註冊</h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': isEmailAndPasswordValid }"
            class="step p-2 bg-primary-100 rounded-circle"
            >1</span
          >
          <Icon
            :class="{ 'd-none': !isEmailAndPasswordValid }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            name="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

        <div
          :class="{
            'text-neutral-0': isEmailAndPasswordValid,
            'text-neutral-60': !isEmailAndPasswordValid,
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': isEmailAndPasswordValid,
              'bg-transparent border border-neutral-60':
                !isEmailAndPasswordValid,
            }"
            class="step p-2 rounded-circle"
            >2</span
          >
          <p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
        </div>
      </div>
    </div>

    <div class="mb-4 row">
      <form :class="{ 'd-none': isEmailAndPasswordValid }" class="mb-4">
        <FormField
          :id="'email'"
          :label="'電子信箱'"
          :wrapperClass="'mb-4 fs-8 fs-md-7'"
          :labelClass="'mb-2 text-neutral-0 fw-bold'"
          :inputClass="'form-control p-4 text-neutral-100 fw-medium border-neutral-40'"
          :type="'email'"
          :placeholder="'hello@exsample.com'"
          :status="''"
          :feedback="''"
          v-model="modelValue"
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
          :status="''"
          :feedback="''"
          v-model="modelValue"
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
          :status="''"
          :feedback="''"
          v-model="modelValue"
        >
        </FormField>
        <button
          class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
          type="button"
          @click="isEmailAndPasswordValid = true"
        >
          下一步
        </button>
      </form>
      <form :class="{ 'd-none': !isEmailAndPasswordValid }" class="mb-4">
        <FormField
          :id="'confirmPassword'"
          :label="'姓名'"
          :wrapperClass="'mb-4 fs-8 fs-md-7'"
          :labelClass="'mb-2 text-neutral-0 fw-bold'"
          :inputClass="'form-control p-4 text-neutral-100 fw-medium border-neutral-40'"
          :type="'text'"
          :placeholder="'請輸入姓名'"
          :status="''"
          :feedback="''"
          v-model="modelValue"
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
          :status="''"
          :feedback="''"
          v-model="modelValue"
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
        <div class="mb-4 fs-8 fs-md-7">
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
                v-model="SignupModel.zip"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              >
                <option
                  v-for="list in zoneOpt"
                  :key="list.zip"
                  :value="list.zip"
                >
                  {{ list.area }}
                </option>
              </select>
            </div>
            <input
              id="address"
              type="text"
              class="form-control p-4 rounded-3"
              placeholder="請輸入詳細地址"
            />
          </div>
        </div>

        <div
          class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0"
        >
          <input
            id="agreementCheck"
            class="form-check-input"
            type="checkbox"
            value=""
          />
          <label class="form-check-label fw-bold" for="agreementCheck">
            我已閱讀並同意本網站個資使用規範
          </label>
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="button"
        >
          完成註冊
        </button>
      </form>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
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

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>
