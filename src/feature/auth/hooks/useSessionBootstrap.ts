import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { meService } from "../services/me.service";
import { useAuthStore } from "../stores/auth.store";

/**
 * Bridges the httpOnly auth cookie to the client store. When the persisted
 * store is empty (fresh browser, cleared storage, post-deploy) but the
 * cookie is still valid, `GET /api/auth/me` rehydrates the session so a
 * direct visit to a protected route renders the feed instead of a blank
 * bounce. A rejected cookie surfaces as `failed` so the caller can redirect
 * to /login.
 *
 * @param enabled gate the lookup until the persisted store has hydrated.
 */
export function useSessionBootstrap(enabled: boolean) {
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const saveLoginnedUser = useAuthStore((s) => s.saveLoginnedUser);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: meService,
    enabled: enabled && !isLoggined,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const user = query.data?.user;
  useEffect(() => {
    if (user && !isLoggined) {
      saveLoginnedUser({
        userId: user.id,
        userName: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user, isLoggined, saveLoginnedUser]);

  return {
    /** Cookie missing/invalid — no usable session. */
    failed: enabled && !isLoggined && query.isError,
    /** Lookup in flight — neither confirmed nor denied yet. */
    checking: enabled && !isLoggined && query.isLoading,
  };
}
