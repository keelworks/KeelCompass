// src/utils/store.ts
import {create} from "zustand";
import axiosInstance from "./api";

interface User {
  id: number;
  username: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  created_at: string;
  user: User;
  likeCount: number;
  reportCount: number;
}

export interface Interest {
  id: number;
  name: string;
}

interface FetchQuestionsResponse {
  message: string;
  questions: Question[];
  offset: number;
  total: number;
}

interface AppState {
  // For "posts"
  questions: Question[];
  offset: number;
  total: number;
  fetchQuestions: (count: number, offset: number) => Promise<void>;

  // For "interests"
  interests: Interest[];
  fetchInterests: () => Promise<void>;

  // Loading & error states (optional)
  isLoading: boolean;
  error: string | null;
}

export const useStore = create<AppState>((set) => ({
  questions: [],
  offset: 0,
  total: 0,
  interests: [],
  isLoading: false,
  error: null,

  fetchQuestions: async (count, offset) => {
    try {
      set({ isLoading: true, error: null });
      // GET /questions?count={count}&offset={offset}
      const response = await axiosInstance.get<FetchQuestionsResponse>("/questions", {
        params: { count, offset },
      });

    //   set({
    //     questions: response.data.questions,
    //     offset: response.data.offset,
    //     total: response.data.total,
    //     isLoading: false,
    //   });

    set((state) => ({
        questions: offset === 0 
          ? response.data.questions 
          : [...state.questions, ...response.data.questions],
        offset: response.data.offset,
        total: response.data.total,
        isLoading: false,
      }));
      
    } catch (err: any) {
      console.error("Error fetching questions:", err);
      set({ error: err.message ?? "Failed to fetch posts", isLoading: false });
    }
  },

  fetchInterests: async () => {
    // For now, you can stub this out or do a real request if/when your API is ready
    try {
      set({ isLoading: true, error: null });
      // e.g., const response = await axiosInstance.get<Interest[]>("/interests");
      // set({ interests: response.data, isLoading: false });
      set({ interests: [], isLoading: false });
    } catch (err: any) {
      console.error("Error fetching interests:", err);
      set({ error: err.message ?? "Failed to fetch interests", isLoading: false });
    }
  },
}));
