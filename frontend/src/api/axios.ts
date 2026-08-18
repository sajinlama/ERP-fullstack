import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    config.headers["x-user-id"] = userId;
  }
  return config;
});

export default api;