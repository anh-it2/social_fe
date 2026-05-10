import { create } from "zustand";
import type { OnlineUserDto } from "../dto/presence.dto";

interface PresenceState {
  onlineUsers: OnlineUserDto[];
  setOnlineUsers: (users: OnlineUserDto[]) => void;
  addOnlineUser: (user: OnlineUserDto) => void;
  removeOnlineUser: (userId: string) => void;
  reset: () => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addOnlineUser: (user) =>
    set((s) =>
      s.onlineUsers.some((u) => u.id === user.id)
        ? s
        : { onlineUsers: [...s.onlineUsers, user] },
    ),
  removeOnlineUser: (userId) =>
    set((s) => ({
      onlineUsers: s.onlineUsers.filter((u) => u.id !== userId),
    })),
  reset: () => set({ onlineUsers: [] }),
}));
