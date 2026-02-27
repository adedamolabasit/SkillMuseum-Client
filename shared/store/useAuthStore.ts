import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: string | null;
  isAppSession: boolean;
  setSession: (id: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isAppSession: false,

      setSession: (id: string) =>
        set({
          userId: id,
          isAppSession: true,
        }),

      clearSession: () =>
        set({
          userId: null,
          isAppSession: false,
        }),
    }),
    {
      name: "app-session",
    },
  ),
);
