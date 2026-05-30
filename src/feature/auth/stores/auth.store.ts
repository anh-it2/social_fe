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
      role: "USER",
      isLoggined: false,

      saveLoginnedUser: ({ userId, userName, email, role }): void => {
        set({ userId, userName, email, role: role ?? "USER", isLoggined: true });
      },

      removeLogginedUser: (): void => {
        set({
          userId: "",
          userName: "",
          email: "",
          role: "USER",
          isLoggined: false,
        });
      },
    }),
    {
      name: "auth-state",
      // v1 added `role`. Drop any pre-role persisted blob → useSessionBootstrap
      // re-fetches /me and hydrates role (else an old session would stay
      // role:"USER" forever). migrate must return a value, so reset to logged-out.
      version: 1,
      migrate: () => ({
        userId: "",
        userName: "",
        email: "",
        role: "USER" as const,
        isLoggined: false,
      }),
    },
  ),
);
