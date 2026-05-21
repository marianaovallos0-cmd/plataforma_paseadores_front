import { httpClient } from "../httpClient";

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isPublicRoute =
    config.url?.startsWith('/auth');


  if (token && !isPublicRoute)
    config.headers.Authorization = `Bearer ${token}`;

  return config
})