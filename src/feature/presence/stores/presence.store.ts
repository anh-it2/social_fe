import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnlineUserDto } from "../dto/presence.dto";

interface PresenceState {
  onlineUsers: OnlineUserDto[];
  knownUsers: OnlineUserDto[];
  setOnlineUsers: (users: OnlineUserDto[]) => void;
  addOnlineUser: (user: OnlineUserDto) => void;
  removeOnlineUser: (userId: string) => void;
  reset: () => void;
}

function mergeKnown(prev: OnlineUserDto[], next: OnlineUserDto[]): OnlineUserDto[] {
  const byId = new Map(prev.map((u) => [u.id, u]));
  for (const u of next) byId.set(u.id, u);
  return Array.from(byId.values());
}

export const usePresenceStore = create<PresenceState>()(
  persist(
    (set) => ({
      onlineUsers: [],
      knownUsers: [],
      setOnlineUsers: (users) =>
        set((s) => ({
          onlineUsers: users,
          knownUsers: mergeKnown(s.knownUsers, users),
        })),
      addOnlineUser: (user) =>
        set((s) => ({
          onlineUsers: s.onlineUsers.some((u) => u.id === user.id)
            ? s.onlineUsers
            : [...s.onlineUsers, user],
          knownUsers: mergeKnown(s.knownUsers, [user]),
        })),
      removeOnlineUser: (userId) =>
        set((s) => ({
          onlineUsers: s.onlineUsers.filter((u) => u.id !== userId),
        })),
      reset: () => set({ onlineUsers: [] }),
    }),
    {
      name: "presence-state",
      partialize: (s) => ({ knownUsers: s.knownUsers }),
    },
  ),
);
