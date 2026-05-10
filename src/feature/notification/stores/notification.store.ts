import { create } from "zustand";
import { Notification } from "../types";

interface NotificationState {
  notifications: Notification[];
  setAll: (list: Notification[]) => void;
  addOne: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],

  setAll: (list) => set({ notifications: list }),

  addOne: (n) =>
    set((state) => {
      if (state.notifications.some((x) => x.id === n.id)) return state;
      return { notifications: [n, ...state.notifications] };
    }),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
