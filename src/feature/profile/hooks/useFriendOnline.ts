"use client";

import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import type { Friend } from "../data/mock";

function norm(name: string) {
  return name.trim().toLowerCase();
}

export function useOnlineNameSet(): Set<string> {
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  return new Set(onlineUsers.map((u) => norm(u.name)));
}

export function useIsFriendOnline(friend: Friend): boolean {
  const onlineNames = useOnlineNameSet();
  return Boolean(friend.mockOnline) || onlineNames.has(norm(friend.name));
}

export function useOnlineFriends(friends: Friend[]): Friend[] {
  const onlineNames = useOnlineNameSet();
  return friends.filter((f) => f.mockOnline || onlineNames.has(norm(f.name)));
}
