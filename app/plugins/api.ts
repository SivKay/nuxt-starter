import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBase + "/v1",
    headers: {
      Accept: "application/json",
    },
  });

  return {
    provide: {
      api,
    },
  };
});
