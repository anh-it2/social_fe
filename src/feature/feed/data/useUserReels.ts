"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReelData } from "./types";

const REELS_STORAGE_KEY = "feed.reels";

function load(): ReelData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REELS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ReelData[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(reels: ReelData[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(reels));
  } catch {
    // quota exceeded — large media won't persist
  }
}

export function useUserReels() {
  const [reels, setReels] = useState<ReelData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReels(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(reels);
  }, [reels, hydrated]);

  const addReel = useCallback((reel: ReelData) => {
    setReels((prev) => [reel, ...prev]);
  }, []);

  const removeReel = useCallback((id: string) => {
    setReels((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { reels, hydrated, addReel, removeReel };
}
