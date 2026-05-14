import { create } from "zustand";

interface ChatSearchState {
  openFor: string | null;
  query: string;
  open: (conversationId: string) => void;
  close: () => void;
  setQuery: (query: string) => void;
  toggle: (conversationId: string) => void;
}

export const useChatSearchStore = create<ChatSearchState>((set, get) => ({
  openFor: null,
  query: "",
  open: (conversationId) => set({ openFor: conversationId, query: "" }),
  close: () => set({ openFor: null, query: "" }),
  setQuery: (query) => set({ query }),
  toggle: (conversationId) => {
    const { openFor } = get();
    if (openFor === conversationId) set({ openFor: null, query: "" });
    else set({ openFor: conversationId, query: "" });
  },
}));
