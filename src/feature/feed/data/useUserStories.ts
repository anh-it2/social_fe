"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { StoryCardData } from "./types";
import { readFeedSlice, writeFeedSlice } from "./feedStorage";

let state: StoryCardData[] | null = null;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (state !== null) return;
  if (typeof window === "undefined") {
    state = [];
    return;
  }
  state = readFeedSlice("userStories") as StoryCardData[];
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

function getSnapshot(): StoryCardData[] {
  ensureLoaded();
  return state as StoryCardData[];
}

function getServerSnapshot(): StoryCardData[] {
  return [];
}

export function useUserStories() {
  const stories = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addStory = useCallback((story: StoryCardData): boolean => {
    ensureLoaded();
    const next = [story, ...(state as StoryCardData[])];
    if (!writeFeedSlice("userStories", next)) return false;
    state = next;
    emit();
    return true;
  }, []);

  const removeStory = useCallback((id: string) => {
    ensureLoaded();
    const next = (state as StoryCardData[]).filter((s) => s.id !== id);
    if (!writeFeedSlice("userStories", next)) return;
    state = next;
    emit();
  }, []);

  return { stories, hydrated: true, addStory, removeStory };
}
