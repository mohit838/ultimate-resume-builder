import useAuthStore from "@/store/auth-store";
import axios from "axios";

const api = axios.create({
  //   baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "http://localhost:1234/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      try {
        const { data } = await axios.post(
          "/api/auth/refresh",
          {},
          {
            headers: {
              "x-refresh-token": refreshToken,
            },
          }
        );

        useAuthStore.getState().login(data.model.accessToken, data.model.user);
        localStorage.setItem("refresh_token", data.model.refreshToken);

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.model.accessToken}`;
        return api(originalRequest);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err?.message);
        } else {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
