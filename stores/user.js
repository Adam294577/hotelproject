import { defineStore } from "pinia";
import { useRouter } from "vue-router";
export const useUserStore = defineStore(
  "UserStore",
  () => {
    const RememberedAccount = ref(null);
    const isRemembered = ref(false);

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
      RememberedAccount,
      isRemembered,
      userData,
      IsLogin,
      successLoginPath,
      ToProfile,
      ToOrder,
    };
  },
  {
    persist: {
      pick: ["RememberedAccount", "isRemembered"],
    },
  }
);
