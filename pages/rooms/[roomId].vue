<script setup>
import dayjs from "dayjs";

definePageMeta({
  middleware: "check-room-id",
});
const route = useRoute();

const id = route.params.roomId;
const config = useRuntimeConfig();
const { data: RoomDetail } = await useFetch(`/rooms/${id}`, {
  ...config.public.backendOptions,
  transform: (res) => res.result,
});

const bookingError = ref("");
const checkBooking = () => {
  bookingError.value = "";
  if (daysCount.value <= 0) {
    bookingError.value = "至少入住一晚";
  }
  if (!bookingDate.date.start || !bookingDate.date.end) {
    bookingError.value = "請選擇入住時間";
  }
};

const ToRoomBooking = async () => {
  checkBooking();
  if (!bookingError.value) {
    bookingQuery.value = {
      roomDetail: RoomDetail.value,
      days: daysCount.value,
      roomId: route.params.roomId,
      checkInDate: dayjs(bookingDate.date.start).format("YYYY/MM/DD"),
      checkOutDate: dayjs(bookingDate.date.end).format("YYYY/MM/DD"),
      peopleNum: bookingPeople.value,
    };
    await navigateTo(`/rooms/${route.params.roomId}/booking`);
  }
};
const _amenityInfo = computed(() => {
  return RoomDetail.value?.amenityInfo.filter((i) => i.isProvide) || [];
});
const _facilityInfo = computed(() => {
  return RoomDetail.value?.facilityInfo.filter((i) => i.isProvide) || [];
});
const _layoutInfo = computed(() => {
  return RoomDetail.value?.layoutInfo.filter((i) => i.isProvide) || [];
});
const imageLoading = ref(false);
const _imageUrlList = ref([]);
const updateImageUrlList = () => {
  if (imageLoading.value) return;
  imageLoading.value = true;
  const data = structuredClone(toRaw(RoomDetail.value.imageUrlList));
  const randomData = data.sort(() => Math.random() - 0.5);
  _imageUrlList.value = [];
  randomData.forEach((img, index) => {
    if (index <= 4) {
      _imageUrlList.value.push(img);
    }
  });
  if (_imageUrlList.value.length === 5) {
    // image url資源 載入完畢 才關閉 loading
    LoadImg(_imageUrlList.value, imageLoading);
  }
};

const bookingPeople = ref(1);
const MAX_BOOKING_PEOPLE = RoomDetail.value.maxPeople;

const currentDate = new Date();
const daysFormatOnMobile = (date) => date?.split("-").slice(1, 3).join(" / ");
const handleDateChange = (bookingInfo) => {
  bookingError.value = "";
  const { start, end } = bookingInfo.date;
  bookingDate.date.start = start;
  bookingDate.date.end = end;

  bookingPeople.value = bookingInfo?.people || 1;
  daysCount.value = bookingInfo.daysCount.value;
};
// dateModel
const datePickerModal = ref(null);
const daysCount = ref(0);

const openModal = () => {
  datePickerModal.value.openModal();
};
const bookingDate = reactive({
  date: {
    start: null,
    end: null,
  },
  minDate: new Date(),
  maxDate: new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)),
});

onMounted(() => {
  updateImageUrlList();
});
const introDom = ref(null);
const scrollToDetail = () => {
  setTimeout(() => {
    if (introDom.value) {
      introDom.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 1000);
};
const bookingQuery = ref({});
</script>
<template>
  <main
    class="mt-18 mt-md-30 bg-neutral-100"
    v-show="route.name === 'rooms-roomId'"
  >
    <section class="p-md-20 bg-primary-10">
      <div
        class="d-none d-md-block position-relative w-100"
        style="height: 570px"
      >
        <div class="d-flex gap-2 rounded-3xl overflow-hidden h-100">
          <div style="width: 52.5vw">
            <img
              v-show="!imageLoading"
              class="w-100 object-fit-cover h-100 position-relative z-1"
              :src="_imageUrlList[0]"
            />
            <div v-if="imageLoading" class="Skeleton h-100"></div>
          </div>
          <div class="d-flex flex-wrap gap-md-2" style="width: 42vw">
            <div
              v-if="imageLoading"
              class="d-flex gap-md-2"
              style="height: 50%; width: 100%"
            >
              <div class="Skeleton w-100 h-100 rounded-3xl"></div>
              <div class="Skeleton w-100 h-100 rounded-3xl"></div>
            </div>
            <div
              v-if="imageLoading"
              class="d-flex gap-md-2"
              style="height: 50%; width: 100%"
            >
              <div
                v-if="imageLoading"
                class="Skeleton w-100 h-100 rounded-3xl"
              ></div>
              <div
                v-if="imageLoading"
                class="Skeleton w-100 h-100 rounded-3xl"
              ></div>
            </div>
            <div class="d-flex gap-md-2 w-100">
              <img class="w-50" :src="_imageUrlList[1]" />
              <img class="w-50" :src="_imageUrlList[2]" />
            </div>
            <div class="d-flex gap-md-2 w-100">
              <img class="w-50" :src="_imageUrlList[3]" />
              <img class="w-50" :src="_imageUrlList[4]" />
            </div>
          </div>
        </div>
        <button
          v-show="RoomDetail.imageUrlList.length >= 5"
          @click="updateImageUrlList"
          class="position-absolute btn btn-primary-10 px-8 py-4 me-3 text-primary-100 border-primary-100 fw-bold rounded-3"
          style="bottom: 40px; right: 60px; z-index: 2"
          type="button"
        >
          看更多
        </button>
      </div>
      <div class="d-md-none position-relative" style="height: 35vh">
        <img
          v-show="!imageLoading"
          class="w-100 h-100 object-fit-cover"
          :src="_imageUrlList[0]"
          alt="room-a-1"
        />
        <div v-if="imageLoading" class="Skeleton w-100 h-100"></div>
        <button
          v-show="RoomDetail.imageUrlList.length >= 5"
          @click="updateImageUrlList"
          class="position-absolute btn btn-primary-10 px-8 py-4 text-primary-100 border-primary-100 fw-bold rounded-3"
          style="bottom: 23px; right: 12px; z-index: 2"
          type="button"
        >
          看更多
        </button>
      </div>
    </section>

    <section ref="introDom" class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-7 d-flex flex-column gap-6 gap-md-20">
            <div>
              <h1 class="mb-4 text-neutral-100 fw-bold">
                {{ RoomDetail.name }}
              </h1>
              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                {{ RoomDetail.description }}
              </p>
            </div>

            <section>
              <h3
                class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
              >
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
                    {{ RoomDetail.areaInfo }}
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
                    {{ RoomDetail.bedInfo }}
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
                    2-{{ RoomDetail.maxPeople }} 人
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
                class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4 p-6 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled mt-2"
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
                  <p class="mb-0 text-neutral-80 fw-bold">{{ list.title }}</p>
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
                  <p class="mb-0 text-neutral-80 fw-bold">{{ list.title }}</p>
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
                  <p class="mb-0 text-neutral-80 fw-bold">{{ list.title }}</p>
                </li>
              </ul>
            </section>

            <section>
              <h3
                class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
              >
                訂房須知
              </h3>
              <ol class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                <li>入住時間為下午3點，退房時間為上午12點。</li>
                <li>
                  如需延遲退房，請提前與櫃檯人員聯繫，視當日房況可能會產生額外費用。
                </li>
                <li>
                  請勿在房間內抽煙，若有抽煙需求，可以使用設在酒店各樓層的專用吸煙區。
                </li>
                <li>
                  若發現房間內的設施有損壞或遺失，將會按照價值收取賠償金。
                </li>
                <li>請愛惜我們的房間與公共空間，並保持整潔。</li>
                <li>如需額外的毛巾、盥洗用品或其他物品，請聯繫櫃檯。</li>
                <li>
                  我們提供免費的Wi-Fi，密碼可以在櫃檯或是房間內的資訊卡上找到。
                </li>
                <li>
                  請勿帶走酒店房內的物品，如有需要購買，請與我們的櫃檯人員聯繫。
                </li>
                <li>
                  我們提供24小時櫃檯服務，若有任何需求或疑問，歡迎隨時詢問。
                </li>
                <li>
                  為了確保所有客人的安全，請勿在走廊或公共區域大聲喧嘩，並遵守酒店的其他規定。
                </li>
              </ol>
            </section>
          </div>
          <div class="d-none d-md-block col-md-5">
            <div
              class="rounded-3xl position-sticky d-flex flex-column gap-10 p-10 ms-auto bg-neutral-0"
              style="top: 160px; max-width: 478px"
            >
              <h5
                class="pb-4 mb-0 text-neutral-100 fw-bold border-bottom border-neutral-40"
              >
                預訂房型
              </h5>

              <div class="text-neutral-80">
                <h2 class="fw-bold">{{ RoomDetail.name }}</h2>
                <p class="mb-0 fw-medium">
                  {{ RoomDetail.description }}
                </p>
              </div>

              <div>
                <div class="d-flex flex-wrap gap-2 mb-4">
                  <div class="form-floating flex-grow-1 flex-shrink-1">
                    <input
                      id="checkinInput"
                      readonly
                      type="date"
                      :value="bookingDate.date.start"
                      class="form-control p-4 pt-9 text-neutral-100 fw-medium border-neutral-100 rounded-3"
                      style="min-height: 74px"
                      placeholder="yyyy-mm-dd"
                      @click="openModal"
                    />
                    <label
                      class="text-neutral-80 fw-medium"
                      style="top: 8px; left: 8px"
                      for="checkinInput"
                      >入住
                    </label>
                  </div>

                  <div class="form-floating flex-grow-1 flex-shrink-1">
                    <input
                      id="checkoutInput"
                      readonly
                      type="date"
                      :value="bookingDate.date.end"
                      class="form-control p-4 pt-9 text-neutral-100 fw-medium border-neutral-100 rounded-3"
                      style="min-height: 74px"
                      placeholder="yyyy-mm-dd"
                      @click="openModal"
                    />
                    <label
                      class="text-neutral-80 fw-medium"
                      style="top: 8px; left: 8px"
                      for="checkoutInput"
                      >退房
                    </label>
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <p class="mb-0">人數</p>
                  <div class="d-flex align-items-center gap-4">
                    <button
                      :class="{ 'disabled bg-neutral-40': bookingPeople === 1 }"
                      class="btn btn-neutral-0 p-4 border border-neutral-40 rounded-circle myCircle"
                      type="button"
                      @click="bookingPeople--"
                    >
                      <Icon
                        class="fs-5 text-neutral-100"
                        name="ic:baseline-minus"
                      />
                    </button>

                    <h6
                      id="people"
                      class="d-flex justify-content-center align-items-center fw-bold text-neutral-100"
                      style="width: 24px"
                      name="people"
                    >
                      {{ bookingPeople }}
                    </h6>

                    <button
                      :class="{
                        'disabled bg-neutral-40':
                          bookingPeople === MAX_BOOKING_PEOPLE,
                      }"
                      class="btn btn-neutral-0 p-4 border border-neutral-40 rounded-circle myCircle"
                      type="button"
                      @click="bookingPeople++"
                    >
                      <Icon
                        class="fs-5 text-neutral-100"
                        name="ic:baseline-plus"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <h5 class="mb-0 text-primary-100 fw-bold">
                {{ formatMoney(RoomDetail.price * daysCount) }}
              </h5>
              <a
                @click.prevent="ToRoomBooking"
                href="#"
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
              >
                立即預訂
              </a>
              <span
                v-if="bookingError"
                style="font-weight: 600; margin-left: 0.25rem; color: #f00"
                >{{ bookingError }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div
        class="d-flex d-md-none justify-content-between align-items-center position-fixed bottom-0 w-100 p-3 bg-neutral-0"
      >
        <template v-if="bookingDate.date.end === null">
          <small class="text-neutral-80 fw-medium"
            >{{ formatMoney(RoomDetail.price) }} / 晚</small
          >
          <button
            class="btn btn-primary-100 px-12 py-4 text-neutral-0 fw-bold rounded-3"
            type="button"
            @click="openModal"
          >
            查看可訂日期
          </button>
        </template>

        <template v-else>
          <div class="d-flex flex-column gap-1">
            <small class="text-neutral-80 fw-medium"
              >{{ formatMoney(RoomDetail.price * daysCount) }} ({{
                daysCount
              }}晚 {{ bookingPeople }} 人)
            </small>
            <span class="text-neutral fs-9 fw-medium text-decoration-underline"
              >{{ daysFormatOnMobile(bookingDate.date?.start) }} -
              {{ daysFormatOnMobile(bookingDate.date?.end) }}</span
            >
          </div>
          <a
            @click.prevent="ToRoomBooking"
            href="#"
            class="btn btn-primary-100 px-12 py-4 text-neutral-0 fw-bold rounded-3"
          >
            立即預訂
          </a>
        </template>
      </div>
    </section>
    <DatePickerModal
      ref="datePickerModal"
      @handleDateChange="handleDateChange"
      :date-time="bookingDate"
      :maxPeople="MAX_BOOKING_PEOPLE"
    />
  </main>
  <NuxtPage @back="scrollToDetail" :query="bookingQuery" />
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
.myCircle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}
.rounded-3xl {
  border-radius: 1.25rem;
}

.card-info {
  width: 97px;
  height: 97px;
}

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

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

input[type="date"] {
  cursor: pointer;
}
.Skeleton {
  background: linear-gradient(-45deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  position: relative;
  z-index: 2;
}
@keyframes loading {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
