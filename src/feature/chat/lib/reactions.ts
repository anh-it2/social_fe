import type { MessageReaction, ReactionKey } from "../types";

export interface ReactionMeta {
  key: ReactionKey;
  emoji: string;
  /** i18n key under Chat.message.reactions */
  labelKey: string;
}

// Orbit-style set, in picker order.
export const REACTIONS: ReactionMeta[] = [
  { key: "like", emoji: "👍", labelKey: "like" },
  { key: "love", emoji: "❤️", labelKey: "love" },
  { key: "haha", emoji: "😆", labelKey: "haha" },
  { key: "wow", emoji: "😮", labelKey: "wow" },
  { key: "sad", emoji: "😢", labelKey: "sad" },
  { key: "angry", emoji: "😡", labelKey: "angry" },
];

const EMOJI_BY_KEY: Record<ReactionKey, string> = REACTIONS.reduce(
  (acc, r) => {
    acc[r.key] = r.emoji;
    return acc;
  },
  {} as Record<ReactionKey, string>,
);

export function reactionEmoji(key: ReactionKey): string {
  return EMOJI_BY_KEY[key] ?? "👍";
}

/**
 * Pure: apply one user's reaction change to a reactions list.
 * One reaction per user — sending a key replaces theirs; null removes it.
 */
export function applyReaction(
  current: MessageReaction[] | undefined,
  userId: string,
  userName: string,
  emoji: ReactionKey | null,
): MessageReaction[] {
  const without = (current ?? []).filter((r) => r.userId !== userId);
  if (emoji === null) return without;
  return [...without, { userId, userName, emoji }];
}

export interface ReactionGroup {
  emoji: ReactionKey;
  count: number;
  /** does the current user's reaction equal this emoji */
  mine: boolean;
}

/** Aggregate a reactions list into per-emoji counts, picker-ordered. */
export function groupReactions(
  reactions: MessageReaction[] | undefined,
  myId: string,
): { groups: ReactionGroup[]; total: number; mine: ReactionKey | null } {
  if (!reactions || reactions.length === 0) {
    return { groups: [], total: 0, mine: null };
  }
  const counts = new Map<ReactionKey, number>();
  let mine: ReactionKey | null = null;
  for (const r of reactions) {
    counts.set(r.emoji, (counts.get(r.emoji) ?? 0) + 1);
    if (r.userId === myId) mine = r.emoji;
  }
  const groups: ReactionGroup[] = REACTIONS.filter((meta) =>
    counts.has(meta.key),
  ).map((meta) => ({
    emoji: meta.key,
    count: counts.get(meta.key) ?? 0,
    mine: mine === meta.key,
  }));
  return { groups, total: reactions.length, mine };
}
