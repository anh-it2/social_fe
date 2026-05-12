"use client";

import { useCallback, useEffect, useState } from "react";

export interface SavedReelEntry {
  kind: "user" | "recommend";
  id: string;
  savedAt: number;
}

const STORAGE_KEY = "feed.savedReels";

function load(): SavedReelEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedReelEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(entries: SavedReelEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // quota exceeded
  }
}

function compositeKey(kind: SavedReelEntry["kind"], id: string) {
  return `${kind}:${id}`;
}

export function useSavedReels() {
  const [entries, setEntries] = useState<SavedReelEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(entries);
  }, [entries, hydrated]);

  const isSaved = useCallback(
    (kind: SavedReelEntry["kind"], id: string) =>
      entries.some((e) => e.kind === kind && e.id === id),
    [entries]
  );

  const toggleSaved = useCallback(
    (kind: SavedReelEntry["kind"], id: string) => {
      setEntries((prev) => {
        const key = compositeKey(kind, id);
        const exists = prev.some((e) => compositeKey(e.kind, e.id) === key);
        if (exists) {
          return prev.filter((e) => compositeKey(e.kind, e.id) !== key);
        }
        return [{ kind, id, savedAt: Date.now() }, ...prev];
      });
    },
    []
  );

  const removeSaved = useCallback(
    (kind: SavedReelEntry["kind"], id: string) => {
      setEntries((prev) =>
        prev.filter((e) => !(e.kind === kind && e.id === id))
      );
    },
    []
  );

  return { entries, hydrated, isSaved, toggleSaved, removeSaved };
}
