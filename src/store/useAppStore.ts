import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser, AuthUser } from "@/types";

export type AppUser = AdminUser | AuthUser;

interface AppState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  searchQuery: string;

  // Actions
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      sidebarOpen: true,
      searchQuery: "",

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "acadexis-admin-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);