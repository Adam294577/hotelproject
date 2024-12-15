import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (
      ["user-userId-order", "user-userId-profile"].includes(
        to.name as string
      ) &&
      ["user-userId-order", "user-userId-profile"].includes(from.name as string)
    ) {
      return;
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ top: 0 });
        }, 0);
      });
    }
  },
};
