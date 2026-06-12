import { create } from "zustand";
import type { ChatPreview } from "@/shared/data/chats";

const MAX_OPEN = 3;

interface ChatBoxesState {
  openChats: ChatPreview[];
  minimized: Record<string, boolean>;
  unread: Record<string, boolean>;
  openChat: (chat: ChatPreview) => void;
  closeChat: (id: string) => void;
  closeAll: () => void;
  toggleMinimize: (id: string) => void;
  markUnread: (id: string) => void;
  markRead: (id: string) => void;
}

export const useChatBoxesStore = create<ChatBoxesState>((set) => ({
  openChats: [],
  minimized: {},
  unread: {},
  openChat: (chat) =>
    set((state) => {
      const restUnread = { ...state.unread };
      delete restUnread[chat.id];
      if (state.openChats.some((c) => c.id === chat.id)) {
        return {
          openChats: state.openChats.map((c) =>
            c.id === chat.id ? { ...c, ...chat } : c,
          ),
          minimized: { ...state.minimized, [chat.id]: false },
          unread: restUnread,
        };
      }
      const next = [chat, ...state.openChats].slice(0, MAX_OPEN);
      return {
        openChats: next,
        minimized: { ...state.minimized, [chat.id]: false },
        unread: restUnread,
      };
    }),
  closeChat: (id) =>
    set((state) => {
      const restMin = { ...state.minimized };
      const restUnread = { ...state.unread };
      delete restMin[id];
      delete restUnread[id];
      return {
        openChats: state.openChats.filter((c) => c.id !== id),
        minimized: restMin,
        unread: restUnread,
      };
    }),
  closeAll: () => set({ openChats: [], minimized: {}, unread: {} }),
  toggleMinimize: (id) =>
    set((state) => {
      const next = !state.minimized[id];
      const unread = { ...state.unread };
      if (!next) delete unread[id];
      return {
        minimized: { ...state.minimized, [id]: next },
        unread,
      };
    }),
  markUnread: (id) =>
    set((state) =>
      state.unread[id]
        ? state
        : { unread: { ...state.unread, [id]: true } },
    ),
  markRead: (id) =>
    set((state) => {
      if (!state.unread[id]) return state;
      const rest = { ...state.unread };
      delete rest[id];
      return { unread: rest };
    }),
}));
