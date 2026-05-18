"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { CURRENT_USER } from "@/feature/feed/data/constants";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useFriendsStore } from "../stores/friends.store";
import type { FriendStatus, PersonDTO } from "../dto/friends.dto";
import { friendsService } from "../service";

/** One-time client init hook (no-op for the mock; real API may hydrate). */
export function useFriendsBootstrap() {
  useEffect(() => {
    friendsService.init();
  }, []);
}

function selectByStatus(
  people: Record<string, PersonDTO>,
  status: Record<string, FriendStatus>,
  want: FriendStatus,
): PersonDTO[] {
  return Object.values(people).filter((p) => (status[p.id] ?? "none") === want);
}

/** All accepted friends. */
export function useFriendsList(): PersonDTO[] {
  useFriendsBootstrap();
  const people = useFriendsStore((s) => s.people);
  const status = useFriendsStore((s) => s.status);
  return useMemo(
    () => selectByStatus(people, status, "friends"),
    [people, status],
  );
}

/**
 * Ids of my accepted friends as a Set, for O(1) membership in hot paths
 * (chat list sort). Bootstrapped from the BE /friends snapshot like the
 * other selectors, so it is populated app-wide, not just on the friends page.
 */
export function useFriendIdSet(): Set<string> {
  useFriendsBootstrap();
  const status = useFriendsStore((s) => s.status);
  return useMemo(
    () =>
      new Set(
        Object.keys(status).filter((id) => status[id] === "friends"),
      ),
    [status],
  );
}

/** Incoming requests awaiting my response. */
export function useIncomingRequests(): PersonDTO[] {
  useFriendsBootstrap();
  const people = useFriendsStore((s) => s.people);
  const status = useFriendsStore((s) => s.status);
  return useMemo(
    () => selectByStatus(people, status, "incoming"),
    [people, status],
  );
}

/**
 * Suggestion pool sourced purely from presence — no mock data. The set is
 * `knownUsers` (everyone seen this session); currently-online users sort
 * first, then alphabetical. Excludes self and anyone already
 * friends/incoming. Keeps "none" and "requested" (card shows the
 * "Requested" state).
 */
export function useSuggestions(): PersonDTO[] {
  useFriendsBootstrap();
  const status = useFriendsStore((s) => s.status);
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const authUserId = useAuthStore((s) => s.userId);

  return useMemo(() => {
    const selfId = authUserId || CURRENT_USER.id;
    const onlineIds = new Set(onlineUsers.map((u) => u.id));
    const isCandidate = (id: string) => {
      const s = status[id] ?? "none";
      return s === "none" || s === "requested";
    };

    // Deduped presence users — online entries take precedence so their
    // (richer) data wins, self excluded.
    const seen = new Map<string, { id: string; name: string }>();
    for (const u of [...onlineUsers, ...knownUsers]) {
      if (u.id === selfId || seen.has(u.id)) continue;
      seen.set(u.id, u);
    }

    return [...seen.values()]
      .filter((u) => isCandidate(u.id))
      .map((u) => ({ id: u.id, name: u.name, mutualFriends: 0 }))
      .sort(
        (a, b) =>
          Number(onlineIds.has(b.id)) - Number(onlineIds.has(a.id)) ||
          a.name.localeCompare(b.name),
      );
  }, [status, knownUsers, onlineUsers, authUserId]);
}

/** Live status for one user. */
export function useFriendStatus(userId: string): FriendStatus {
  useFriendsBootstrap();
  return useFriendsStore((s) => s.status[userId] ?? "none");
}

/**
 * Action wrappers. Each tracks an in-flight flag so buttons can disable
 * during the simulated/real round-trip.
 */
export function useFriendActions() {
  const [busy, setBusy] = useState(false);

  const run = useCallback(
    async (fn: () => Promise<void>) => {
      setBusy(true);
      try {
        await fn();
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  return useMemo(
    () => ({
      busy,
      sendRequest: (id: string) =>
        run(() => friendsService.sendRequest(id)),
      cancelRequest: (id: string) =>
        run(() => friendsService.cancelRequest(id)),
      acceptRequest: (id: string) =>
        run(() => friendsService.acceptRequest(id)),
      rejectRequest: (id: string) =>
        run(() => friendsService.rejectRequest(id)),
      unfriend: (id: string) => run(() => friendsService.unfriend(id)),
    }),
    [busy, run],
  );
}
