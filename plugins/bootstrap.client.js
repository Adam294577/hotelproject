import * as bootstrap from "bootstrap";
const { Modal, Collapse } = bootstrap;
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      bootstrap: {
        modal: (element) => new Modal(element),
        collapse: (element) => new Collapse(element),
      },
    },
  };
});
