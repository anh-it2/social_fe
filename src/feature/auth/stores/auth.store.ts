import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types";

// Persisted to localStorage on purpose: userId still keys per-account local
// data (see scopedKey — feed/profile caches). The JWT is NOT here; it lives
// in an httpOnly cookie the browser cannot read.
//
// FUTURE: once all per-user data is server-backed, drop `persist` and derive
// the session from the cookie (e.g. a /api/auth/me bootstrap) instead.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: "",
      userName: "",
      email: "",
      isLoggined: false,

      saveLoginnedUser: ({ userId, userName, email }): void => {
        set({ userId, userName, email, isLoggined: true });
      },

      removeLogginedUser: (): void => {
        set({ userId: "", userName: "", email: "", isLoggined: false });
      },
    }),
    {
      name: "auth-state",
    },
  ),
);
