"use client";

import type { FeedPostData, ReelData, StoryCardData } from "./types";

const FEED_STORAGE_KEY = "feed";

interface FeedStorageShape {
  reels?: ReelData[];
  userPosts?: FeedPostData[];
  userStories?: StoryCardData[];
}

function readAll(): FeedStorageShape {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(FEED_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as FeedStorageShape) : {};
  } catch {
    return {};
  }
}

function writeAll(next: FeedStorageShape) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota errors ignored */
  }
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
) {
  const all = readAll();
  writeAll({ ...all, [key]: value });
}
