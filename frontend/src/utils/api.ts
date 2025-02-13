// src/utils/api.ts
import axios from "axios";

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", 
  // or your real backend URL
});

// (Optional) Attach interceptors for auth tokens or error handling
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // e.g., attach token from localStorage if needed
//     const token = localStorage.getItem("token");
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// (Optional) Response error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // e.g., handle 401 or show a notification
    return Promise.reject(error);
  }
);

export default axiosInstance;
