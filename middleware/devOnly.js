export default defineNuxtRouteMiddleware(() => {
  // 使用 import.meta.env.DEV 檢查是否為開發模式
  if (!import.meta.env.DEV) {
    return showError({
      statusCode: 403,
      statusMessage: "此頁面僅限於開發者訪問。",
    });
  }
});
