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
      if (userData.value?._id) {
        await navigateTo(`/user/${userData.value._id}/profile`);
      }
    };

    const ToOrder = async () => {
      if (userData.value?._id) {
        await navigateTo(`/user/${userData.value._id}/order`);
      }
    };
    const logout = async (route) => {
      const userToken = useCookie("userToken");
      userData.value = null;
      userToken.value = null;
      const noNavigate = [
        "rooms-roomId-booking",
        "user-userId-profile",
        "user-userId-order",
      ];
      if (!noNavigate.includes(route.name)) {
        successLoginPath.value = route.fullPath;
      } else {
        successLoginPath.value = "/";
      }
      setAuthorization("");
      await navigateTo("/account/login");
    };
    return {
      RememberedAccount,
      isRemembered,
      userData,
      IsLogin,
      successLoginPath,
      ToProfile,
      ToOrder,
      logout,
    };
  },
  {
    persist: {
      pick: ["RememberedAccount", "isRemembered"],
    },
  }
);
