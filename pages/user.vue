<script setup>
const userStore = useUserStore();
const { userData } = storeToRefs(userStore);
const route = useRoute();
const linkActive = computed(() => route.path.split("/"));
onMounted(() => {
  if (route.params.userId !== userData.value._id) userStore.logout(route);
});
</script>

<template>
  <Myheader />

  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="position-relative">
      <picture>
        <source
          srcset="@/assets/images/profile-hero.png"
          media="(min-width: 576px)"
        />
        <img
          class="w-100 object-fit-cover"
          style="height: 384px"
          src="@/assets/images/profile-hero-sm.png"
          alt="profile-hero"
        />
      </picture>
      <div class="container">
        <div
          class="hero-content d-flex flex-column flex-md-row justify-content-center justify-content-md-start align-items-md-center gap-4 gap-md-6 mx-5 my-10 mx-md-0 my-md-0"
        >
          <!-- <img
              class="avatar"
              src="@/assets/images/avatar-6.png"
              alt="avatar"
            /> -->
          <ClientOnly>
            <h1 class="text-neutral-0 fw-bold">Hello，{{ userData.name }}</h1>
          </ClientOnly>
        </div>
      </div>
    </section>

    <section class="py-10 pt-md-20 pb-md-30">
      <div class="container">
        <ul class="nav mb-10 mb-md-20 fw-bold">
          <li class="nav-item position-relative">
            <a
              href="#"
              @click.prevent="userStore.ToProfile"
              :class="{ 'text-primary-100': linkActive.includes('profile') }"
              class="nav-link px-6 py-4 text-white"
            >
              個人資料
            </a>
          </li>
          <li class="nav-item position-relative">
            <a
              href="#"
              :class="{ 'text-primary-100': linkActive.includes('order') }"
              @click.prevent="userStore.ToOrder"
              class="nav-link px-6 py-4 text-white"
            >
              我的訂單
            </a>
          </li>
        </ul>

        <NuxtPage />
      </div>
    </section>

    <picture>
      <source
        srcset="@/assets/images/deco-line-group-horizontal-full.svg"
        media="(min-width:576px)"
      />
      <img
        class="w-100"
        src="@/assets/images/deco-line-group-horizontal-sm.svg"
        alt="deco-line-group"
      />
    </picture>
  </main>
  <Myfooter />
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

.hero-content {
  position: absolute;
  top: 0;
  bottom: 0;

  @include media-breakpoint-down(md) {
    inset: 0;
  }
}

.avatar {
  width: 144px;
  height: 144px;

  @include media-breakpoint-down(md) {
    width: 72px;
    height: 72px;
  }
}

.nav-link.text-primary-100::after {
  position: absolute;
  content: "";
  left: 0;
  right: 0;
  display: block;
  width: 2rem;
  margin: 0 auto;
  margin-top: 0.5rem;
  border-color: currentColor;
  border-bottom: 4px solid;
  border-radius: 10px;
}
</style>
