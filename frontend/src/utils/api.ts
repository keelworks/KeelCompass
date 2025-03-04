import axios from "axios";
import {useAuthStore} from "./store"

const API_BASE_URL = "https://localhost:8080/api"; // Replace with actual API URL

// Create Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // Allows HTTP-only cookies
  headers: {"Content-Type": "application/json",}
});

// Attach JWT token to every request if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login function
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data; // { user, token }
};

// Logout function
export const logoutUser = async () => {
  await axiosInstance.post("/auth/logout");
};

// Token refresh function
export const refreshToken = async () => {
  const response = await axiosInstance.get("/auth/refresh");
  return response.data; // { user, newToken }
};

// Function to register a user and store the token automatically
export const registerUser = async (userData: { username: string; email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    
    if (response.data.token) { // If token is received, store it in Zustand
      useAuthStore.getState().setToken(response.data.token);
      console.log("Token stored in Zustand:", response.data.token);
    }

    return response.data; // Return full response (message + token)
  } catch (error) {
    console.error("Registration failed:");
    throw error;
  }
};
