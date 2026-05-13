"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ReelData } from "./types";
import { readFeedSlice, writeFeedSlice } from "./feedStorage";

let state: ReelData[] | null = null;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (state !== null) return;
  if (typeof window === "undefined") {
    state = [];
    return;
  }
  state = readFeedSlice("reels") as ReelData[];
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): ReelData[] {
  ensureLoaded();
  return state as ReelData[];
}

function getServerSnapshot(): ReelData[] {
  return [];
}

export function useUserReels() {
  const reels = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addReel = useCallback((reel: ReelData) => {
    ensureLoaded();
    state = [reel, ...(state as ReelData[])];
    writeFeedSlice("reels", state);
    emit();
  }, []);

  const removeReel = useCallback((id: string) => {
    ensureLoaded();
    state = (state as ReelData[]).filter((r) => r.id !== id);
    writeFeedSlice("reels", state);
    emit();
  }, []);

  return { reels, hydrated: true, addReel, removeReel };
}
