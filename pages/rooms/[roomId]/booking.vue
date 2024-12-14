<script setup>
import FormField from "@/components/bootstrap/FormField.vue";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
dayjs.locale("zh-tw");
// composables
import { useAddressOption } from "@/composables/addressOption";
// zod
import { z } from "zod";
import { validateSchema } from "@/utils/zod/validateSchema";

const config = useRuntimeConfig();
const { $api } = useNuxtApp();
const emits = defineEmits(["back"]);
const route = useRoute();
const goBack = async () => {
  emits("back");
  navigateTo(`/rooms/${route.params.roomId}`);
};
const userStore = useUserStore();
const { userData } = storeToRefs(userStore);
const query = defineModel("query");
const discount = 1000;
const _amenityInfo = computed(() => {
  return query.value.roomDetail?.amenityInfo.filter((i) => i.isProvide) || [];
});
const _facilityInfo = computed(() => {
  return query.value.roomDetail?.facilityInfo.filter((i) => i.isProvide) || [];
});
const _layoutInfo = computed(() => {
  return query.value.roomDetail?.layoutInfo.filter((i) => i.isProvide) || [];
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
// booking model
const bookingForm = ref(null);
useEventListener(bookingForm, "input", (e) =>
  InputClearErrorMsg(e, bookingErrors)
);
const bookingModel = ref({
  roomId: query.value.roomId,
  checkInDate: query.value.checkInDate,
  checkOutDate: query.value.checkOutDate,
  peopleNum: query.value.peopleNum,
  userInfo: {
    address: {
      zipcode: 0,
      detail: "",
    },
    name: "",
    phone: "",
    email: "",
  },
});
const bookingSchema = z.object({
  name: z.string().min(1, { message: "請輸入姓名" }),
  phone: z
    .string()
    .min(1, { message: "請輸入手機號碼" })
    .regex(/^(?:\+886\s?|0)(9\d{2})\s?(\d{3})\s?(\d{3})$/, {
      message: "請輸入有效的手機號碼",
    }),
  email: z.string().email("請輸入有效的電子信箱"),
  addressDetail: z.string().min(1, { message: "請輸入詳細地址" }),
});
const bookingErrors = ref({
  name: { status: "", message: "" },
  phone: { status: "", message: "" },
  email: { status: "", message: "" },
  addressDetail: { status: "", message: "" },
});
// error handle
const ClearErrorMsg = (ErrorRef) => {
  for (const key in ErrorRef.value) {
    ErrorRef.value[key].status = "";
    ErrorRef.value[key].message = "";
  }
};
const InputClearErrorMsg = (e, ErrorRef) => {
  if (e.target.nodeName === "INPUT") ClearErrorMsg(ErrorRef);
};
const MapErrorMsg = (errors, ErrorRef) => {
  ClearErrorMsg(ErrorRef);
  errors.forEach((err) => {
    const key = err.path[0];
    if (ErrorRef.value[key]) {
      ErrorRef.value[key].status = "is-invalid";
      ErrorRef.value[key].message = err.message;
    }
  });
};
const scrollToErrorElement = () => {
  const element = bookingForm.value;
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

const SetUserInfo = () => {
  const data = structuredClone(toRaw(userData.value));
  bookingModel.value.userInfo.name = data.name;
  bookingModel.value.userInfo.email = data.email;
  bookingModel.value.userInfo.phone = data.phone;
  addressModel.value.zone.zip = data.address.zipcode;
  addressModel.value.address = data.address.detail.split("-")[0];
  addressModel.value.zone.area = data.address.detail.split("-")[1];
  addressModel.value.addressDetail = data.address.detail.split("-")[2];
  ClearErrorMsg(bookingErrors);
};

const isLoading = ref(false);
const confirmBooking = async () => {
  const checkData = {
    name: bookingModel.value.userInfo.name,
    phone: bookingModel.value.userInfo.phone,
    email: bookingModel.value.userInfo.email,
    addressDetail: addressModel.value.addressDetail,
  };
  const { error } = validateSchema(bookingSchema, checkData, "multError");
  if (error) {
    MapErrorMsg(error, bookingErrors);
    scrollToErrorElement();
    return;
  }
  bookingModel.value.userInfo.address.zipcode = addressModel.value.zone.zip;
  bookingModel.value.userInfo.address.detail = `${addressModel.value.address}-${addressModel.value.zone.area}-${addressModel.value.addressDetail}`;

  isLoading.value = true;
  const { data } = await $api("/orders", {
    ...config.public.backendOptions,
    method: "POST",
    body: bookingModel.value,
  });
  if (data.status) {
    isLoading.value = false;
    await navigateTo(`/booking/${data.result._id}`);
  }
};
</script>
<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="goBack"
        >
          <Icon class="fs-5 text-neutral-100" name="mdi:keyboard-arrow-left" />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">確認訂房資訊</h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">選擇房型</h3>
                    <p class="mb-0 fw-medium">尊爵雙人房</p>
                  </div>
                  <!-- <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button> -->
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">訂房日期</h3>
                    <p class="mb-2 fw-medium">
                      入住：{{
                        dayjs(query.checkInDate).format("MM月DD日 dddd")
                      }}
                    </p>
                    <p class="mb-0 fw-medium">
                      退房：{{
                        dayjs(query.checkOutDate).format("MM月DD日 dddd")
                      }}
                    </p>
                  </div>
                  <!-- <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button> -->
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">房客人數</h3>
                    <p class="mb-0 fw-medium">
                      {{ bookingModel.peopleNum }} 人
                    </p>
                  </div>
                  <!-- <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button> -->
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <div
                class="d-flex justify-content-between align-items-center mb-10"
              >
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button"
                  @click="SetUserInfo"
                >
                  套用會員資料
                </button>
              </div>

              <form
                ref="bookingForm"
                class="d-flex flex-column gap-6 position-relative"
              >
                <FormField
                  :id="'name'"
                  :label="'姓名'"
                  :wrapperClass="''"
                  :labelClass="'fs-8 fs-md-7 fw-bold'"
                  :inputClass="'form-control p-4 fs-8 fs-md-7 rounded-3'"
                  :type="'text'"
                  :placeholder="'請輸入姓名'"
                  :status="bookingErrors.name.status"
                  :feedback="bookingErrors.name.message"
                  v-model="bookingModel.userInfo.name"
                >
                </FormField>
                <FormField
                  :id="'phone'"
                  :label="'手機號碼'"
                  :wrapperClass="''"
                  :labelClass="'fs-8 fs-md-7 fw-bold'"
                  :inputClass="'form-control p-4 fs-8 fs-md-7 rounded-3'"
                  :type="'tel'"
                  :placeholder="'請輸入手機號碼'"
                  :status="bookingErrors.phone.status"
                  :feedback="bookingErrors.phone.message"
                  v-model="bookingModel.userInfo.phone"
                >
                </FormField>

                <FormField
                  :id="'email'"
                  :label="'電子信箱'"
                  :wrapperClass="''"
                  :labelClass="'fs-8 fs-md-7 fw-bold'"
                  :inputClass="'form-control p-4 fs-8 fs-md-7 rounded-3'"
                  :type="'email'"
                  :placeholder="'請輸入電子信箱'"
                  :status="bookingErrors.email.status"
                  :feedback="bookingErrors.email.message"
                  v-model="bookingModel.userInfo.email"
                >
                </FormField>

                <div class="text-neutral-100">
                  <label for="address" class="form-label fs-8 fs-md-7 fw-bold"
                    >地址</label
                  >
                  <div class="d-flex gap-2 mb-2">
                    <select
                      @change="updateZoneOpt"
                      v-model="addressModel.address"
                      class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                    >
                      <option v-for="list in cityOpt" :key="list" :value="list">
                        {{ list }}
                      </option>
                    </select>
                    <select
                      v-model="addressModel.zone"
                      class="form-select p-4 text-neutral-80 fw-medium rounded-3"
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
                    :status="bookingErrors.addressDetail.status"
                    :feedback="bookingErrors.addressDetail.message"
                    v-model="addressModel.addressDetail"
                  >
                  </FormField>
                </div>
              </form>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        name="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ query.roomDetail.areaInfo }}
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        name="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ query.roomDetail.bedInfo }}
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        name="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        2-{{ query.roomDetail.maxPeople }} 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房間格局
                  </h3>
                  <ul
                    class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4 p-6 mt-2 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled"
                  >
                    <li
                      class="col d-flex align-items-center gap-2 mt-md-0"
                      v-for="list in _layoutInfo"
                      :key="list.title"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        name="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ list.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房內設備
                  </h3>
                  <ul
                    class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-2 p-6 mb-0 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled"
                  >
                    <li
                      class="col d-flex align-items-center gap-2 mt-md-0"
                      v-for="list in _facilityInfo"
                      :key="list.title"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        name="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ list.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    備品提供
                  </h3>
                  <ul
                    class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-2 p-6 mb-0 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled"
                  >
                    <li
                      class="col d-flex align-items-center gap-2 mt-md-0"
                      v-for="list in _amenityInfo"
                      :key="list.title"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        name="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ list.title }}
                      </p>
                    </li>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
            >
              <img
                class="img-fluid rounded-3"
                :src="query.roomDetail.imageUrl"
                alt="room-a"
              />

              <div>
                <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <div
                    class="d-flex align-items-center text-neutral-100 fw-medium"
                  >
                    <span>{{ formatMoney(query.roomDetail.price) }}</span>
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      name="material-symbols:close"
                    />
                    <span class="text-neutral-80">{{ query.days }} 晚</span>
                  </div>
                  <span class="fw-medium">
                    {{ formatMoney(query.roomDetail.price * query.days) }}
                  </span>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center fw-medium"
                >
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100">
                    {{ formatMoney(discount) }}
                  </span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40" />
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold"
                >
                  <p class="d-flex align-items-center mb-0">總價</p>
                  <span>
                    {{
                      formatMoney(
                        query.roomDetail.price * query.days - discount
                      )
                    }}
                  </span>
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="button"
                @click="confirmBooking()"
              >
                確認訂房
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BookingLoading v-if="isLoading" />
  </main>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #bf9d7d;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>
