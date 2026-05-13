import { create } from "zustand";

interface PendingSelectionState {
  pendingGroupId: string | null;
  setPendingGroup: (id: string | null) => void;
}

export const usePendingChatSelectionStore = create<PendingSelectionState>(
  (set) => ({
    pendingGroupId: null,
    setPendingGroup: (id) => set({ pendingGroupId: id }),
  }),
);
