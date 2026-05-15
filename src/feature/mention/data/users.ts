import { useMemo } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { useChatStore } from "@/feature/chat/stores/chat.store";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { nameToHandle } from "../lib/parse";

export interface MentionUser {
  id: string;
  handle: string;
  name: string;
  avatar?: string;
  gradient: [string, string];
  online?: boolean;
}

interface SourceUser {
  id: string;
  name: string;
  avatar?: string;
}

function buildList(
  knownUsers: SourceUser[],
  onlineIds: Set<string>,
  groupMemberIds: Set<string>,
  excludeId?: string | null,
): MentionUser[] {
  const byHandle = new Map<string, MentionUser>();
  for (const u of knownUsers) {
    if (excludeId && u.id === excludeId) continue;
    const handle = nameToHandle(u.name);
    if (!handle) continue;
    if (byHandle.has(handle)) continue;
    byHandle.set(handle, {
      id: u.id,
      handle,
      name: u.name,
      avatar: u.avatar,
      gradient: pickGradient(u.id),
      online: onlineIds.has(u.id),
    });
  }
  return [...byHandle.values()].sort((a, b) => {
    const aMember = groupMemberIds.has(a.id) ? 0 : 1;
    const bMember = groupMemberIds.has(b.id) ? 0 : 1;
    if (aMember !== bMember) return aMember - bMember;
    if (a.online !== b.online) return a.online ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/** Snapshot read — safe to call from non-React code (RichText render, notify) */
export function getMentionUsers(): MentionUser[] {
  const presence = usePresenceStore.getState();
  const onlineIds = new Set(presence.onlineUsers.map((u) => u.id));
  const auth = useAuthStore.getState();
  const groups = Object.values(useChatStore.getState().groups);
  const groupMemberIds = new Set<string>();
  for (const g of groups) for (const id of g.memberIds) groupMemberIds.add(id);
  return buildList(presence.knownUsers, onlineIds, groupMemberIds, auth.userId);
}

export function findUserByHandle(handle: string): MentionUser | undefined {
  const lowered = handle.toLowerCase();
  return getMentionUsers().find((u) => u.handle === lowered);
}

export function searchMentionUsers(
  query: string,
  limit = 6,
  restrictToIds?: readonly string[] | null,
): MentionUser[] {
  const q = query.trim().toLowerCase();
  const all = getMentionUsers();
  const allowed = restrictToIds ? new Set(restrictToIds) : null;
  const scoped = allowed ? all.filter((u) => allowed.has(u.id)) : all;
  const filtered = q
    ? scoped.filter(
        (u) =>
          u.handle.includes(q) || u.name.toLowerCase().includes(q),
      )
    : scoped;
  return filtered.slice(0, limit);
}

/** Reactive hook for components that need to re-render on store change */
export function useMentionUsers(): MentionUser[] {
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const groupsMap = useChatStore((s) => s.groups);
  const userId = useAuthStore((s) => s.userId);
  return useMemo(() => {
    const onlineIds = new Set(onlineUsers.map((u) => u.id));
    const groupMemberIds = new Set<string>();
    for (const g of Object.values(groupsMap))
      for (const id of g.memberIds) groupMemberIds.add(id);
    return buildList(knownUsers, onlineIds, groupMemberIds, userId);
  }, [knownUsers, onlineUsers, groupsMap, userId]);
}

export function useSearchMentionUsers(
  query: string,
  limit = 6,
  restrictToIds?: readonly string[] | null,
): MentionUser[] {
  const all = useMentionUsers();
  const restrictKey = restrictToIds ? restrictToIds.join(",") : "";
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    const allowed = restrictKey
      ? new Set(restrictKey.split(","))
      : null;
    const scoped = allowed ? all.filter((u) => allowed.has(u.id)) : all;
    const filtered = q
      ? scoped.filter(
          (u) =>
            u.handle.includes(q) || u.name.toLowerCase().includes(q),
        )
      : scoped;
    return filtered.slice(0, limit);
  }, [all, query, limit, restrictKey]);
}
