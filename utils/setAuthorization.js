import { useRuntimeConfig } from "#app";

export const setAuthorization = (token) => {
  const config = useRuntimeConfig();
  config.public.backendOptions.headers.Authorization = token
    ? `Bearer ${token}`
    : "";
};
