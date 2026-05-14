import { create } from "zustand";

export const SIDEBAR_FILTER_KEYS = [
  "filterAll",
  "filterUnread",
  "filterGroups",
  "filterRequests",
] as const;

export type SidebarFilterKey = (typeof SIDEBAR_FILTER_KEYS)[number];

interface SidebarFilterState {
  active: SidebarFilterKey;
  setActive: (key: SidebarFilterKey) => void;
}

export const useSidebarFilterStore = create<SidebarFilterState>((set) => ({
  active: "filterAll",
  setActive: (active) => set({ active }),
}));
