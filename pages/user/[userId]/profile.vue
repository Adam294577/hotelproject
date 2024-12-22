<script setup>
import FormField from "@/components/bootstrap/FormField.vue";
// composables
import { useDateOption } from "@/composables/dateOption";
import { useAddressOption } from "@/composables/addressOption";
import dayjs from "dayjs";
// zod
import { z } from "zod";
import { validateSchema } from "@/utils/zod/validateSchema";

const config = useRuntimeConfig();
const { $api } = useNuxtApp();
const emits = defineEmits(["refreshData"]);
const profileData = defineModel("profileData");

const isEditPassword = ref(false);
const isEditProfile = ref(false);
const EditProfile = () => {
  isEditProfile.value = true;
  birthDate.value.year = Number(
    dayjs(profileData.value.birthday).format("YYYY")
  );
  birthDate.value.month = Number(
    dayjs(profileData.value.birthday).format("MM")
  );
  birthDate.value.day = Number(dayjs(profileData.value.birthday).format("DD"));
  addressModel.value.zone.zip = profileData.value.address.zipcode;
  addressModel.value.address = profileData.value.address.detail.split("-")[0];
  addressModel.value.zone.area = profileData.value.address.detail.split("-")[1];
  addressModel.value.addressDetail =
    profileData.value.address.detail.split("-")[2];
};
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
const addressModel = ref({
  zone: {
    zip: "",
    area: "",
  },
  address: "",
  addressDetail: "",
});
const { data: AddressData } = await useFetch("/api/zipcode");
const { cityOpt, zoneOpt, updateZoneOpt } = useAddressOption(
  AddressData.value,
  addressModel.value
);
// error handle
const ClearErrorMsg = (fieldRefs) => {
  for (const key in fieldRefs.value) {
    fieldRefs.value[key].status = "";
    fieldRefs.value[key].message = "";
  }
};
const InputClearErrorMsg = (e, fieldRefs) => {
  if (e.target.nodeName === "INPUT") ClearErrorMsg(fieldRefs);
};
const MapErrorMsg = (errors, fieldRefs) => {
  ClearErrorMsg(fieldRefs);
  errors.forEach((err) => {
    const key = err.path[0];
    if (fieldRefs.value[key]) {
      fieldRefs.value[key].status = "is-invalid";
      fieldRefs.value[key].message = err.message;
    }
  });
};
// 修改密碼
const changedPasswordForm = ref(null);
useEventListener(changedPasswordForm, "input", (e) =>
  InputClearErrorMsg(e, changedPasswordError)
);
const PasswordUpdated = ref(false);
const changedPasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "密碼至少需要8位數")
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/, "密碼必須包含英數混合"),
    newPassword: z
      .string()
      .min(8, "密碼至少需要8位數")
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/, "密碼必須包含英數混合"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "確認密碼必須和新密碼相同",
      });
    }
  });
const changePwdModel = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const changedPasswordError = ref({
  oldPassword: { status: "", message: "" },
  newPassword: { status: "", message: "" },
  confirmPassword: { status: "", message: "" },
});
const changedPasswordLoading = ref(false);
const handChangePwd = async () => {
  const changeData = {
    oldPassword: changePwdModel.value.oldPassword,
    newPassword: changePwdModel.value.newPassword,
    confirmPassword: changePwdModel.value.confirmPassword,
  };
  const { error } = validateSchema(
    changedPasswordSchema,
    changeData,
    "multError"
  );
  if (error) {
    MapErrorMsg(error, changedPasswordError);
    return;
  }
  changedPasswordLoading.value = true;
  const body = {
    userId: profileData.value._id,
    name: profileData.value.name,
    phone: profileData.value.phone,
    birthday: profileData.value.birthday,
    address: {
      zipcode: profileData.value.address.zipcode,
      detail: profileData.value.address.detail,
    },
    oldPassword: changePwdModel.value.oldPassword,
    newPassword: changePwdModel.value.newPassword,
  };
  const res = await $api("user", {
    ...config.public.backendOptions,
    method: "PUT",
    body,
  });
  console.log("res", res);
  PasswordUpdated.value = true;
};
// 基本資料
const UserForm = ref(null);
useEventListener(UserForm, "input", (e) => InputClearErrorMsg(e, UserError));
const UserUpdated = ref(false);
const UserSchema = z.object({
  name: z.string().min(1, { message: "請輸入姓名" }),
  phone: z
    .string()
    .min(1, { message: "請輸入手機號碼" })
    .regex(/^(?:\+886\s?|0)(9\d{2})\s?(\d{3})\s?(\d{3})$/, {
      message: "請輸入有效的手機號碼",
    }),
  addressDetail: z.string().min(1, { message: "請輸入詳細地址" }),
});
const UserModel = ref(structuredClone(toRaw(profileData.value)));
const UserError = ref({
  name: { status: "", message: "" },
  phone: { status: "", message: "" },
  addressDetail: { status: "", message: "" },
});
const userLoading = ref(false);
const handUserModel = () => {
  const changeData = {
    name: UserModel.value.name,
    phone: UserModel.value.phone,
    addressDetail: addressModel.value.addressDetail,
  };
  const { error } = validateSchema(UserSchema, changeData, "multError");
  console.log("error", error);

  if (error) {
    MapErrorMsg(error, UserError);
    return;
  }
  // 確認是否有更改過密碼 ，沒有則要輸入原本密碼才能變更基本資料
  if (!PasswordUpdated.value) {
    passwordCheckDialog.value = true;
  } else {
    changeUserData();
  }
};
const changeUserData = async () => {
  userLoading.value = true;
  const body = {
    userId: profileData.value._id,
    name: UserModel.value.name,
    phone: UserModel.value.phone,
    birthday: formatBirthDate(),
    address: {
      zipcode: addressModel.value.zone.zip,
      detail: `${addressModel.value.address}-${addressModel.value.zone.area}-${addressModel.value.addressDetail}`,
    },
    oldPassword: PasswordUpdated.value
      ? changePwdModel.value.newPassword
      : userPassword.value,
    newPassword: PasswordUpdated.value
      ? changePwdModel.value.newPassword
      : userPassword.value,
  };
  const res = await $api("user", {
    ...config.public.backendOptions,
    method: "PUT",
    body,
  });
  console.log("res", res);
  emits("refreshData");
  userLoading.value = false;
  passwordCheckDialog.value = false;
  UserUpdated.value = true;
};
// 確認使用者密碼
const passwordCheckForm = ref(null);
useEventListener(passwordCheckForm, "input", (e) =>
  InputClearErrorMsg(e, passwordCheckError)
);
const userPassword = ref("");

const userPasswordSchema = z.object({
  userPassword: z
    .string()
    .min(8, "密碼至少需要8位數")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/, "密碼必須包含英數混合"),
});
const passwordCheckError = ref({
  userPassword: { status: "", message: "" },
});
const LoginLoading = ref(false);
const CheckUserPassword = async () => {
  const changeData = {
    userPassword: userPassword.value,
  };
  const { error } = validateSchema(userPasswordSchema, changeData, "multError");
  if (error) {
    MapErrorMsg(error, passwordCheckError);
    return;
  }
  const body = {
    email: profileData.value.email,
    password: userPassword.value,
  };
  LoginLoading.value = true;
  const res = await $api("/user/login", {
    ...config.public.backendOptions,
    method: "POST",
    body,
  });
  if (res.error) {
    passwordCheckError.value.userPassword.status = "is-invalid";
    passwordCheckError.value.userPassword.message = res.error.message;
  } else {
    changeUserData();
  }
  LoginLoading.value = false;
};
const passwordCheckDialog = ref(false);
watch(passwordCheckDialog, (Bool) => {
  if (Bool) {
    document.body.style.overflow = "hidden";
  } else {
    userPassword.value = "";
    ClearErrorMsg(passwordCheckError);
    document.body.style.overflow = "";
  }
});
onMounted(() => {
  emits("refreshData");
});
</script>
<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-5">
      <section
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
      >
        <h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
        <ClientOnly>
          <div class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                >{{ UserModel.email }}</span
              >
            </div>

            <div
              class="d-flex justify-content-between align-items-center"
              :class="{ 'd-none': isEditPassword }"
            >
              <div>
                <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                  密碼
                </label>
                <input
                  class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                  type="password"
                  value="**********"
                />
              </div>

              <button
                class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
                type="button"
                @click="isEditPassword = !isEditPassword"
              >
                重設
              </button>
            </div>
            <ClientOnly>
              <form
                ref="changedPasswordForm"
                class="d-flex flex-column gap-4 gap-md-6 position-relative"
                :class="{ 'd-none': !isEditPassword }"
              >
                <FormField
                  :id="'oldPassword'"
                  :label="'舊密碼'"
                  :wrapperClass="''"
                  :labelClass="'form-label fs-8 fs-md-7 fw-bold'"
                  :inputClass="'form-control p-4 fs-7 rounded-3'"
                  :type="'password'"
                  :placeholder="'請輸入舊密碼'"
                  :status="changedPasswordError.oldPassword.status"
                  :feedback="changedPasswordError.oldPassword.message"
                  v-model="changePwdModel.oldPassword"
                  :disabled="PasswordUpdated"
                >
                </FormField>
                <FormField
                  :id="'newPassword'"
                  :label="'新密碼'"
                  :wrapperClass="''"
                  :labelClass="'form-label fs-8 fs-md-7 fw-bold'"
                  :inputClass="'form-control p-4 fs-7 rounded-3'"
                  :type="'password'"
                  :placeholder="'請輸入新密碼'"
                  :status="changedPasswordError.newPassword.status"
                  :feedback="changedPasswordError.newPassword.message"
                  v-model="changePwdModel.newPassword"
                  :disabled="PasswordUpdated"
                >
                </FormField>
                <FormField
                  :id="'confirmPassword'"
                  :label="'確認新密碼'"
                  :wrapperClass="''"
                  :labelClass="'form-label fs-8 fs-md-7 fw-bold'"
                  :inputClass="'form-control p-4 fs-7 rounded-3'"
                  :type="'password'"
                  :placeholder="'請再輸入一次新密碼'"
                  :status="changedPasswordError.confirmPassword.status"
                  :feedback="changedPasswordError.confirmPassword.message"
                  v-model="changePwdModel.confirmPassword"
                  :disabled="PasswordUpdated"
                >
                </FormField>
              </form>
            </ClientOnly>
            <div class="d-flex align-items-center gap-3">
              <button
                :class="{ 'd-none': !isEditPassword }"
                class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
                type="button"
                :disabled="PasswordUpdated || changedPasswordLoading"
                @click="handChangePwd"
              >
                儲存設定
              </button>
              <div
                class="fw-bold"
                style="color: green"
                v-show="PasswordUpdated"
              >
                變更成功!
              </div>
            </div>
          </div>
        </ClientOnly>
      </section>
    </div>

    <div class="col-12 col-md-7">
      <section
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
      >
        <h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>
        <ClientOnly>
          <from
            ref="UserForm"
            class="d-flex flex-column gap-4 gap-md-6 position-relative"
          >
            <FormField
              :id="'name'"
              :label="'姓名'"
              :wrapperClass="'fs-8 fs-md-7'"
              :labelClass="{
                'form-label fw-bold text-neutral-100': isEditProfile,
                'form-label fw-medium text-neutral-80': !isEditProfile,
              }"
              :inputClass="{
                'pe-none p-0 border-0 fw-bold': !isEditProfile,
                'p-4 fw-bold': isEditProfile,
              }"
              :type="'text'"
              :placeholder="'請輸入姓名'"
              :status="UserError.name.status"
              :feedback="UserError.name.message"
              v-model="UserModel.name"
              :disabled="UserUpdated"
            >
            </FormField>
            <FormField
              :id="'phone'"
              :label="'手機號碼'"
              :wrapperClass="'fs-8 fs-md-7'"
              :labelClass="{
                'form-label fw-bold text-neutral-100': isEditProfile,
                'form-label fw-medium text-neutral-80': !isEditProfile,
              }"
              :inputClass="{
                'pe-none p-0 border-0 fw-bold': !isEditProfile,
                'p-4 fw-bold': isEditProfile,
              }"
              :type="'tel'"
              :placeholder="'請輸入手機號碼'"
              :status="UserError.phone.status"
              :feedback="UserError.phone.message"
              v-model="UserModel.phone"
              :disabled="UserUpdated"
            >
            </FormField>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile,
                }"
                for="birth"
              >
                生日
              </label>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                :class="{ 'd-none': isEditProfile }"
                >{{
                  dayjs(UserModel.birthday).format("YYYY年 MM月 DD日")
                }}</span
              >
              <div class="d-flex gap-2" :class="{ 'd-none': !isEditProfile }">
                <select
                  @change="ChangeDate"
                  v-model="birthDate.year"
                  id="birth"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  :disabled="UserUpdated"
                >
                  <option v-for="year in yearOpt" :key="year" :value="year">
                    {{ year }} 年
                  </option>
                </select>
                <select
                  @change="ChangeDate"
                  v-model="birthDate.month"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  :disabled="UserUpdated"
                >
                  <option v-for="month in monthOpt" :key="month" :value="month">
                    {{ month }} 月
                  </option>
                </select>
                <select
                  v-model="birthDate.day"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  :disabled="UserUpdated"
                >
                  <option v-for="day in dayOpt" :key="day" :value="day">
                    {{ day }} 日
                  </option>
                </select>
              </div>
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile,
                }"
                for="address"
              >
                地址
              </label>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                :class="{ 'd-none': isEditProfile }"
                >{{ UserModel?.address.detail.split("-").join("") || "" }}</span
              >
              <div :class="{ 'd-none': !isEditProfile }">
                <div class="d-flex gap-2 mb-2">
                  <select
                    @change="updateZoneOpt"
                    v-model="addressModel.address"
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                    :disabled="UserUpdated"
                  >
                    <option v-for="list in cityOpt" :key="list" :value="list">
                      {{ list }}
                    </option>
                  </select>
                  <select
                    v-model="addressModel.zone"
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                    :disabled="UserUpdated"
                  >
                    <option
                      v-for="list in zoneOpt"
                      :key="list.zip"
                      :value="list"
                    >
                      {{ list.area }}
                    </option>
                  </select>
                </div>
                <FormField
                  :id="'address'"
                  :label="''"
                  :wrapperClass="''"
                  :labelClass="'d-none'"
                  :inputClass="'form-control p-4 fs-8 fs-md-7 rounded-3'"
                  :type="'text'"
                  :placeholder="'請輸入詳細地址'"
                  :status="UserError.addressDetail.status"
                  :feedback="UserError.addressDetail.message"
                  v-model="addressModel.addressDetail"
                  :disabled="UserUpdated"
                >
                </FormField>
              </div>
            </div>
          </from>
        </ClientOnly>
        <button
          :class="{ 'd-none': isEditProfile }"
          class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
          type="button"
          @click="EditProfile"
        >
          編輯
        </button>
        <div class="d-flex align-items-center gap-3">
          <button
            :class="{ 'd-none': !isEditProfile }"
            class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
            type="button"
            @click="handUserModel"
          >
            儲存設定
          </button>
          <div class="fw-bold" style="color: green" v-show="UserUpdated">
            變更成功!
          </div>
        </div>
      </section>
    </div>
  </div>
  <div class="passwordCheckDialog dialog" v-if="passwordCheckDialog">
    <div class="msg">
      <form ref="passwordCheckForm" class="position-relative">
        <FormField
          :id="'userPassword'"
          :label="'請輸入密碼'"
          :wrapperClass="''"
          :labelClass="'form-label fs-7 px-2 mb-4 fw-bold'"
          :inputClass="'form-control p-4 fs-7 rounded-3'"
          :type="'password'"
          :placeholder="''"
          :status="passwordCheckError.userPassword.status"
          :feedback="passwordCheckError.userPassword.message"
          v-model="userPassword"
        >
        </FormField>
      </form>
      <div class="d-flex gap-3 mt-3">
        <button
          class="btn btn-primary-100 px-8 py-4 text-white fw-bold border-0 rounded-3"
          type="button"
          @click="CheckUserPassword"
          :disable="userLoading"
        >
          變更
        </button>
        <button
          class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
          type="button"
          @click="passwordCheckDialog = false"
          :disable="userLoading"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog {
  background: #0000004a;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  backdrop-filter: blur(5px);
  z-index: 1000;
}
.msg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 1.25rem;
  padding: 1rem;
}

.rounded-3xl {
  border-radius: 1.25rem;
}

input[type="password"] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
