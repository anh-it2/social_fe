"use client";

import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useProfileMeta } from "@/feature/profile/components/edit/data/useProfileMeta";
import { CURRENT_USER } from "../data/constants";

export function useCurrentUserIdentity() {
  const userId = useAuthStore((state) => state.userId);
  const userName = useAuthStore((state) => state.userName);
  const { meta, hydrated } = useProfileMeta();
  const name = (hydrated && meta.name) || userName || CURRENT_USER.name;

  return {
    id: userId || CURRENT_USER.id,
    name,
    initial: (name.trim()[0] ?? CURRENT_USER.initial).toUpperCase(),
    avatarUrl: hydrated ? meta.avatarUrl || undefined : undefined,
    gradient: CURRENT_USER.gradient,
  };
}
