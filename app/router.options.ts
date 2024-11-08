import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ top: 0 });
        }, 0);
      });
    }
  },
};
