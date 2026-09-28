import axios from "axios";

const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const cleanUrl = rawUrl.replace(/\/+$/, "");

export const API_URL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach JWT token to all outbound requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;