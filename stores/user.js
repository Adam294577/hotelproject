import { defineStore } from "pinia";
import { useRouter } from "vue-router";
export const useUserStore = defineStore(
  "UserStore",
  () => {
    const userData = ref(null);
    const successLoginPath = ref("");
    const IsLogin = computed(() => (!userData.value ? false : true));

    const ToProfile = async () => {
      if (userData.value?.userId) {
        await navigateTo(`/user/${userData.value.userId}/profile`);
      }
    };

    const ToOrder = async () => {
      if (userData.value?.userId) {
        await navigateTo(`/user/${userData.value.userId}/order`);
      }
    };
    return {
      userData,
      IsLogin,
      successLoginPath,
      ToProfile,
      ToOrder,
    };
  },
  {
    persist: true,
  }
);
