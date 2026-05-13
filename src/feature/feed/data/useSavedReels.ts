"use client";

import { useCallback, useEffect, useState } from "react";
import type { FeedPostData } from "./types";

export interface SavedReelEntry {
  kind: "user" | "recommend";
  id: string;
  savedAt: number;
}

export interface SavedPostEntry {
  post: FeedPostData;
  savedAt: number;
}

interface SavedStore {
  reels: SavedReelEntry[];
  posts: SavedPostEntry[];
}

const STORAGE_KEY = "feed.saved";

function readStore(): SavedStore {
  if (typeof window === "undefined") return { reels: [], posts: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { reels: [], posts: [] };
    const parsed = JSON.parse(raw) as Partial<SavedStore>;
    return {
      reels: Array.isArray(parsed.reels) ? parsed.reels : [],
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
    };
  } catch {
    return { reels: [], posts: [] };
  }
}

function writeStore(store: SavedStore) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // quota exceeded
  }
}

type Listener = (store: SavedStore) => void;

let memoryStore: SavedStore = { reels: [], posts: [] };
let initialized = false;
const listeners = new Set<Listener>();

function ensureInit() {
  if (initialized) return;
  initialized = true;
  memoryStore = readStore();
}

function setStore(next: SavedStore) {
  memoryStore = next;
  writeStore(next);
  listeners.forEach((fn) => fn(next));
}

function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function compositeKey(kind: SavedReelEntry["kind"], id: string) {
  return `${kind}:${id}`;
}

export function useSavedReels() {
  const [store, setLocalStore] = useState<SavedStore>(() => memoryStore);
  const [hydrated, setHydrated] = useState(initialized);

  useEffect(() => {
    ensureInit();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalStore(memoryStore);
    setHydrated(true);
    return subscribe(setLocalStore);
  }, []);

  const isSaved = useCallback(
    (kind: SavedReelEntry["kind"], id: string) =>
      store.reels.some((e) => e.kind === kind && e.id === id),
    [store.reels]
  );

  const toggleSaved = useCallback(
    (kind: SavedReelEntry["kind"], id: string) => {
      const key = compositeKey(kind, id);
      const exists = memoryStore.reels.some(
        (e) => compositeKey(e.kind, e.id) === key
      );
      const reels = exists
        ? memoryStore.reels.filter((e) => compositeKey(e.kind, e.id) !== key)
        : [{ kind, id, savedAt: Date.now() }, ...memoryStore.reels];
      setStore({ ...memoryStore, reels });
    },
    []
  );

  const removeSaved = useCallback(
    (kind: SavedReelEntry["kind"], id: string) => {
      setStore({
        ...memoryStore,
        reels: memoryStore.reels.filter(
          (e) => !(e.kind === kind && e.id === id)
        ),
      });
    },
    []
  );

  return {
    entries: store.reels,
    hydrated,
    isSaved,
    toggleSaved,
    removeSaved,
  };
}

export function useSavedPosts() {
  const [store, setLocalStore] = useState<SavedStore>(() => memoryStore);
  const [hydrated, setHydrated] = useState(initialized);

  useEffect(() => {
    ensureInit();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalStore(memoryStore);
    setHydrated(true);
    return subscribe(setLocalStore);
  }, []);

  const isSaved = useCallback(
    (id: string) => store.posts.some((e) => e.post.id === id),
    [store.posts]
  );

  const savePost = useCallback((post: FeedPostData) => {
    if (memoryStore.posts.some((e) => e.post.id === post.id)) return;
    setStore({
      ...memoryStore,
      posts: [{ post, savedAt: Date.now() }, ...memoryStore.posts],
    });
  }, []);

  const removeSaved = useCallback((id: string) => {
    setStore({
      ...memoryStore,
      posts: memoryStore.posts.filter((e) => e.post.id !== id),
    });
  }, []);

  const toggleSaved = useCallback((post: FeedPostData) => {
    const exists = memoryStore.posts.some((e) => e.post.id === post.id);
    const posts = exists
      ? memoryStore.posts.filter((e) => e.post.id !== post.id)
      : [{ post, savedAt: Date.now() }, ...memoryStore.posts];
    setStore({ ...memoryStore, posts });
  }, []);

  return {
    entries: store.posts,
    hydrated,
    isSaved,
    savePost,
    removeSaved,
    toggleSaved,
  };
}
