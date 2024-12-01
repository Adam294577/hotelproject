// plugins/api.ts
// 客製化 $fetch
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const api = $fetch.create({
    onResponse({ request, response, options }) {
      // 響應攔截器
      // 例如，處理響應數據
      // console.log("Response received:", response._data);
    },
    onResponseError({ request, response, options }) {
      // 處理響應錯誤
      // console.error("Response error:", response.status, response._data);
    },
  });

  const wrappedFetch = async (url, options) => {
    try {
      const data = await api(url, options);
      return { success: true, data, error: null };
    } catch (err) {
      // 統一處理錯誤並返回
      const error = {
        status: err.response?.status || 500,
        message: err.response?._data?.message || err.message || "Unknown error",
      };
      return { success: false, data: null, error };
    }
  };

  return {
    provide: {
      api: wrappedFetch,
    },
  };
});
