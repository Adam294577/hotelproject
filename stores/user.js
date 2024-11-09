import { defineStore } from "pinia";
export const useUserStore = defineStore(
  "UserStore",
  () => {
    const userData = ref(null);
    return {
      userData,
    };
  },
  {
    persist: true,
  }
);
