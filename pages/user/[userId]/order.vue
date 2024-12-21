<script setup>
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
dayjs.locale("zh-tw");
const discount = 1000;
const config = useRuntimeConfig();
const orderData = defineModel("orderData");
console.log("orderData", orderData.value);
// 近期訂單
const CommingData = ref({});
const hasCommingOrder = ref(false);
// 近期訂單 - 取消
const cancelModalBtn = ref(null);
const currentCanceled = ref(false);
const CancelCommingOrder = async (id = "675dc3a7a1d0f190d371d163") => {
  await $fetch(`/orders/${id}`, {
    ...config.public.backendOptions,
    method: "Delete",
  });
  cancelModalBtn.value.click();
  currentCanceled.value = true;
};
// 歷史清單
const HistoryData = computed(() => {
  return orderData.value.filter(
    (i) => new Date().getTime() > new Date(i.checkInDate).getTime()
  );
});
const hasHistoryOrder = computed(() => HistoryData.value !== 0);
// 歷史清單 - 查看更多
const HistoryOrderList = ref([]);
const addTimer = ref(0);
const NoMoreHistoryRender = computed(
  () => HistoryOrderList.value.length === HistoryData.value.length
);
const AddHistoryOrderList = () => {
  if (NoMoreHistoryRender.value) return;
  addTimer.value++;
  const pushItem = HistoryData.value.slice(
    (addTimer.value - 1) * 3,
    addTimer.value * 3
  );
  HistoryOrderList.value = [...HistoryOrderList.value, ...pushItem];
  console.log("HistoryOrderList", HistoryOrderList.value);
};
onMounted(() => {
  AddHistoryOrderList();
});
</script>
<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-7">
      <div
        v-if="hasCommingOrder"
        class="rounded-3xl d-flex flex-column gap-6 p-4 p-md-10 bg-neutral-0"
        style="max-width: 730px"
      >
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">即將來的行程</h2>
        <div>
          <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">
            <!-- {{ orderData }} -->
            預訂參考編號： HH2302183151222
          </p>
        </div>

        <img
          class="img-fluid rounded-3"
          src="@/assets/images/room-a-1.png"
          alt="room-a"
        />

        <section class="d-flex flex-column gap-6">
          <h3
            class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
          >
            <p class="mb-0">尊爵雙人房，1 晚</p>
            <span
              class="d-inline-block mx-4 bg-neutral-80"
              style="width: 1px; height: 18px"
            />
            <p class="mb-0">住宿人數：2 位</p>
          </h3>

          <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
            <p class="title-deco mb-2">入住：6 月 10 日星期二，15:00 可入住</p>
            <p class="title-deco mb-0">退房：6 月 11 日星期三，12:00 前退房</p>
          </div>

          <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">NT$ 10,000</p>
        </section>

        <hr class="my-0 opacity-100 text-neutral-40" />

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            房內設備
          </h3>
          <ul
            class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
          >
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">電視</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">吹風機</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">冰箱</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">熱水壺</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">檯燈</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">衣櫃</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">除濕機</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">浴缸</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">書桌</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">音響</p>
            </li>
          </ul>
        </section>

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            備品提供
          </h3>
          <ul
            class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
          >
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">衛生紙</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">拖鞋</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">沐浴用品</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">清潔用品</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">刮鬍刀</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">吊衣架</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">浴巾</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">刷牙用品</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">罐裝水</p>
            </li>
            <li class="flex-item d-flex gap-2">
              <Icon
                class="fs-5 text-primary-100"
                name="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">梳子</p>
            </li>
          </ul>
        </section>

        <div class="d-flex gap-4">
          <button
            ref="cancelModalBtn"
            v-if="!currentCanceled"
            data-bs-toggle="modal"
            data-bs-target="#cancelModal"
            class="btn btn-outline-primary-100 w-100 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
          >
            取消預訂
          </button>
          <button
            v-else
            data-bs-toggle="modal"
            data-bs-target="#cancelModal"
            class="btn btn-outline-primary-100 w-100 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
            disabled
          >
            已取消
          </button>
          <!-- <a
            href="#"
            @click.prevent="ToRoomDetail('a')"
            class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
            type="button"
          >
            查看詳情
          </a> -->
        </div>
      </div>
      <div
        v-else
        class="rounded-3xl d-flex flex-column gap-6 p-4 p-md-10 bg-neutral-0"
        style="max-width: 730px"
      >
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">即將來的行程</h2>

        <section class="d-flex flex-column gap-6">
          <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">無資料</p>
        </section>

        <hr class="my-0 opacity-100 text-neutral-40" />

        <div class="d-flex gap-4">
          <!-- <button
            data-bs-toggle="modal"
            data-bs-target="#cancelModal"
            class="btn btn-outline-primary-100 w-100 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
          >
            取消預訂
          </button> -->
          <a
            href="#"
            @click.prevent="navigateTo('/rooms')"
            class="btn btn-primary-100 text-neutral-0 w-100 py-4 fw-bold"
            type="button"
          >
            立即訂房
          </a>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-5">
      <div
        v-if="hasHistoryOrder"
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
      >
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">歷史訂單</h2>

        <div
          class="d-flex flex-column flex-lg-row gap-6"
          v-for="list in HistoryOrderList"
          :key="list._id"
        >
          <img
            class="img-fluid object-fit-cover rounded-3"
            style="max-width: 120px; height: 80px"
            :src="list.roomId.imageUrl"
            :alt="list.roomId.name"
          />
          <section class="d-flex flex-column gap-4">
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
              預訂參考編號： {{ list._id }}
            </p>

            <h3
              class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
            >
              {{ list.roomId.name }}
            </h3>

            <div class="text-neutral-80 fw-medium">
              <p class="mb-2">
                住宿天數：
                {{ CalcDayCount(list.checkOutDate, list.checkInDate) }} 晚
              </p>
              <p class="mb-0">住宿人數：{{ list.peopleNum }} 位</p>
            </div>

            <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
              <p class="title-deco mb-2">
                入住：{{ dayjs(list.checkInDate).format("MM月DD日 dddd") }}
              </p>
              <p class="title-deco mb-0">
                退房：{{ dayjs(list.checkOutDate).format("MM月DD日 dddd") }}
              </p>
            </div>
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
              {{
                formatMoney(
                  list.roomId.price *
                    CalcDayCount(list.checkOutDate, list.checkInDate) -
                    discount
                )
              }}
            </p>
          </section>
        </div>

        <hr class="my-0 opacity-100 text-neutral-40" />

        <button
          v-if="!NoMoreHistoryRender"
          class="btn btn-outline-primary-100 py-4 fw-bold"
          style="--bs-btn-hover-color: #fff"
          type="button"
          @click="AddHistoryOrderList"
        >
          查看更多
        </button>
      </div>
      <div
        v-else
        class="rounded-3xl d-flex flex-column gap-6 gap-md-6 p-4 p-md-10 bg-neutral-0"
      >
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">歷史訂單</h2>
        <section class="d-flex flex-column gap-6">
          <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">無資料</p>
        </section>
      </div>
    </div>
  </div>

  <div id="cancelModal" class="modal fade" tabindex="-1">
    <div
      class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100"
    >
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div
          class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold"
        >
          確定要取消此房型的預訂嗎？
        </div>
        <div class="modal-footer d-flex gap-4">
          <button
            type="button"
            class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            data-bs-dismiss="modal"
          >
            關閉視窗
          </button>
          <button
            type="button"
            class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold"
            @click="CancelCommingOrder()"
          >
            確定取消
          </button>
        </div>
      </div>
    </div>
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

.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #bf9d7d;
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}

.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>
