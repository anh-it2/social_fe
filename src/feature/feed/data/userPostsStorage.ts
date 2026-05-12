"use client";

import type { FeedPostData } from "./types";

export const USER_POSTS_STORAGE_KEY = "feed.userPosts.v1";

export function loadUserPostsFromStorage(): FeedPostData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_POSTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FeedPostData[]) : [];
  } catch {
    return [];
  }
}

export function saveUserPostsToStorage(posts: FeedPostData[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* ignore quota errors */
  }
}
