import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, logoutUser, refreshToken } from "./api";

// Define the authentication state interface
interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  restoreAuth: () => Promise<void>;
}

// Zustand store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setToken: (token) => {
        set({ token })
        localStorage.setItem("token", token)
      }, // function to store token after registration

      // Login action
      login: async (credentials) => {
        try {
          const response = await loginUser(credentials);
          set({ user: response.user, token: response.token, isAuthenticated: true });
          localStorage.setItem("token", response.token);
        } catch (error) {
          console.error("Login failed:", error);
        }
      },

      // Logout action
      logout: async () => {
        try {
          await logoutUser();
          set({ user: null, token: null, isAuthenticated: false });
          localStorage.removeItem("token");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },

      // Restore auth state on page refresh
      restoreAuth: async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const response = await refreshToken();
            set({ user: response.user, token: response.newToken, isAuthenticated: true });
            localStorage.setItem("token", response.newToken);
          }
        } catch (error) {
          console.error("Session restore failed:", error);
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
      getToken: () => get().token,
    }),
    { name: "auth-store" } // Saves token in localStorage
  )
);

