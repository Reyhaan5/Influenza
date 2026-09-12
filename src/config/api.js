const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const cleanUrl = rawUrl.replace(/\/+$/, "");
export const API_URL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");