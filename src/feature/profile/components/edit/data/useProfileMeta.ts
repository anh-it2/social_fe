"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { publishPresenceProfile } from "@/feature/presence/socket";
import { getProfileService } from "@/feature/profile/services/getProfile.service";
import { updateProfileService } from "@/feature/profile/services/updateProfile.service";
import { EDIT_PROFILE_DEFAULTS } from "./edit-profile.constants";
import type { EditProfileValues } from "./edit-profile.schema";

// Unscoped key the presence socket reads on connect (readSelfAvatar) to
// announce this user's avatar before the edit page is ever opened. The DB
// is the source of truth; this is only a cache so presence has something
// to publish at handshake time. Refreshed on every successful load/save.
const PRESENCE_AVATAR_MIRROR_KEY = "profile.meta.v1";

function mirrorAvatarForPresence(avatarUrl: string | undefined) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PRESENCE_AVATAR_MIRROR_KEY,
      JSON.stringify({ avatarUrl: avatarUrl ?? "" }),
    );
  } catch {
    /* ignore quota errors */
  }
}

/**
 * Server-backed profile state (social-platform-be via /api/profile). The
 * edit form reads `meta` once `hydrated`, and `save` PATCHes the BE — the
 * realtime fan-out to other users is a *separate* concern handled by the
 * caller after this resolves (variant 1a: persist first, then announce).
 */
export function useProfileMeta() {
  const userId = useAuthStore((s) => s.userId);
  const userName = useAuthStore((s) => s.userName);
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const queryClient = useQueryClient();
  const publishedProfileRef = useRef("");
  const profileQueryKey = useMemo(
    () => ["profile", "me", userId] as const,
    [userId],
  );

  const query = useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfileService,
    enabled: isLoggined && !!userId,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // On a clean load, keep the presence avatar mirror in sync so a later
  // socket (re)connect publishes the right image.
  const loadedAvatar = query.data?.avatarUrl;
  useEffect(() => {
    if (!query.isSuccess) return;
    mirrorAvatarForPresence(loadedAvatar);

    const signature = `${query.data?.name ?? userName}\n${loadedAvatar ?? ""}`;
    if (publishedProfileRef.current === signature) return;
    publishedProfileRef.current = signature;
    publishPresenceProfile(loadedAvatar, query.data?.name || userName);
  }, [query.isSuccess, query.data?.name, loadedAvatar, userName]);

  // BE returns a complete profile; merge over defaults defensively and seed
  // the name from the auth store if the BE ever sends it empty.
  const meta: EditProfileValues = useMemo(() => {
    const base = { ...EDIT_PROFILE_DEFAULTS, name: userName };
    if (!query.data) return base;
    const merged = { ...EDIT_PROFILE_DEFAULTS, ...query.data };
    return { ...merged, name: merged.name || userName };
  }, [query.data, userName]);

  // Settled (success OR error) — on error the form still opens with
  // defaults+name instead of hanging on a blank screen.
  const hydrated = query.isFetched;

  const mutation = useMutation({
    mutationFn: updateProfileService,
    onSuccess: (saved) => {
      queryClient.setQueryData(profileQueryKey, saved);
      mirrorAvatarForPresence(saved.avatarUrl);
    },
  });

  // Async on purpose: the caller awaits this and only emits the presence
  // event after the DB write succeeds. Throws on failure so the caller can
  // surface an error and skip navigation/broadcast. The optional URL fields
  // are normalized to "" so the wire shape is always a complete ProfileDTO.
  const save = useCallback(
    (next: EditProfileValues) =>
      mutation.mutateAsync({
        ...next,
        avatarUrl: next.avatarUrl ?? "",
        coverUrl: next.coverUrl ?? "",
      }),
    [mutation],
  );

  return { meta, hydrated, save };
}
