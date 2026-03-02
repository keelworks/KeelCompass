import axios from "axios";

const rawApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const baseURL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
