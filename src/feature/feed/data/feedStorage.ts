"use client";

import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { scopedKey } from "@/feature/auth/lib/scopedKey";
import type { FeedPostData, ReelData, StoryCardData } from "./types";

// Per-account: a user's posts/reels/stories must not show on another
// account. Read the current auth id at call time (non-React access).
function feedStorageKey(): string {
  return scopedKey("feed", useAuthStore.getState().userId);
}

interface FeedStorageShape {
  reels?: ReelData[];
  userPosts?: FeedPostData[];
  userStories?: StoryCardData[];
}

function readAll(): FeedStorageShape {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(feedStorageKey());
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as FeedStorageShape) : {};
  } catch {
    return {};
  }
}

function writeAll(next: FeedStorageShape): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(feedStorageKey(), JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

function isPersistableMediaUrl(url?: string): boolean {
  return !url || (!url.startsWith("data:") && !url.startsWith("blob:"));
}

function compactLegacyMedia(all: FeedStorageShape): FeedStorageShape {
  return {
    ...all,
    reels: all.reels?.filter((item) => isPersistableMediaUrl(item.mediaUrl)),
    userStories: all.userStories?.filter((item) =>
      isPersistableMediaUrl(item.mediaUrl),
    ),
  };
}

export function readFeedSlice<K extends keyof FeedStorageShape>(
  key: K,
): NonNullable<FeedStorageShape[K]> | [] {
  const all = readAll();
  return (all[key] ?? []) as NonNullable<FeedStorageShape[K]> | [];
}

export function writeFeedSlice<K extends keyof FeedStorageShape>(
  key: K,
  value: NonNullable<FeedStorageShape[K]>,
): boolean {
  const all = readAll();
  return writeAll(compactLegacyMedia({ ...all, [key]: value }));
}
