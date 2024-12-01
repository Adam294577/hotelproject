import type { UseFetchOptions } from "nuxt/app";
// 將客製化 $fetch 封裝到 usefetch
// 目的: 攔截器去catch 後端錯誤訊息
export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
  });
}
