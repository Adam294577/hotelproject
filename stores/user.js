import { defineStore } from "pinia";
import { useRouter } from "vue-router";
export const useUserStore = defineStore(
  "UserStore",
  () => {
    const userData = ref(null);
    const IsLogin = computed(() => (!userData.value ? false : true));

    const router = useRouter();
    const ToProfile = () => {
      if (userData.value?.userId) {
        router.push(`/user/${userData.value.userId}/profile`);
      }
    };

    const ToOrder = () => {
      if (userData.value?.userId) {
        router.push(`/user/${userData.value.userId}/order`);
      }
    };
    return {
      userData,
      IsLogin,
      ToProfile,
      ToOrder,
    };
  },
  {
    persist: true,
  }
);
