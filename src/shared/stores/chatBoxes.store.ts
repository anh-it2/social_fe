import { create } from "zustand";
import type { ChatPreview } from "@/shared/data/chats";

const MAX_OPEN = 3;

interface ChatBoxesState {
  openChats: ChatPreview[];
  minimized: Record<string, boolean>;
  openChat: (chat: ChatPreview) => void;
  closeChat: (id: string) => void;
  closeAll: () => void;
  toggleMinimize: (id: string) => void;
}

export const useChatBoxesStore = create<ChatBoxesState>((set) => ({
  openChats: [],
  minimized: {},
  openChat: (chat) =>
    set((state) => {
      if (state.openChats.some((c) => c.id === chat.id)) {
        return { minimized: { ...state.minimized, [chat.id]: false } };
      }
      const next = [chat, ...state.openChats].slice(0, MAX_OPEN);
      return {
        openChats: next,
        minimized: { ...state.minimized, [chat.id]: false },
      };
    }),
  closeChat: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.minimized;
      return {
        openChats: state.openChats.filter((c) => c.id !== id),
        minimized: rest,
      };
    }),
  closeAll: () => set({ openChats: [], minimized: {} }),
  toggleMinimize: (id) =>
    set((state) => ({
      minimized: { ...state.minimized, [id]: !state.minimized[id] },
    })),
}));
