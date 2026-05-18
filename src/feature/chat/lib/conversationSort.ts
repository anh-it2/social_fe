import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import type { GroupInfo } from "@/feature/chat/stores/chat.store.type";

/**
 * Shared conversation list model + ordering — used by the topnav chat dropdown
 * and the chat-page sidebar list so both stay in sync.
 *
 * Tiers:
 *  0. unread / new        -> recency (lastActivity desc), then name
 *  1. 1:1 user online
 *  2. group with a member (other than me) online
 *  3. everything else     -> alphabetical
 *
 * Friend priority: inside EVERY tier, a friend DM sorts above a stranger
 * (or group) before that tier's own tiebreak runs. "Friend" is decided by
 * the backend Friend table (single source of truth), surfaced here as the
 * `friendIds` set — this module does not re-derive the relationship.
 * Ties within tiers 1-3 then break alphabetically by name.
 */
export type ChatListEntry =
  | {
      type: "dm";
      id: string;
      name: string;
      online: boolean;
      isGroup: false;
      user: OnlineUserDto;
    }
  | {
      type: "group";
      id: string;
      name: string;
      online: boolean;
      isGroup: true;
      group: GroupInfo;
    };

interface SortContext {
  unread: Record<string, boolean>;
  lastActivity: Record<string, number>;
  /**
   * User ids that are my accepted friends (from the BE /friends snapshot).
   * Only DM entries can match; groups are never "friends".
   */
  friendIds: Set<string>;
}

/** Friend DM = 0 (sorts first), everything else = 1. */
function friendRank(e: ChatListEntry, friendIds: Set<string>): number {
  return !e.isGroup && friendIds.has(e.id) ? 0 : 1;
}

/**
 * Build the unified entry stream from raw users + groups.
 * `id` is the unread / lastActivity key: DM = other user id, group = conversationId.
 */
export function buildChatEntries(
  users: { user: OnlineUserDto; online: boolean }[],
  groups: GroupInfo[],
  ctx: { onlineUserIds: Set<string>; myId: string },
): ChatListEntry[] {
  return [
    ...users.map<ChatListEntry>((u) => ({
      type: "dm",
      id: u.user.id,
      name: u.user.name,
      online: u.online,
      isGroup: false,
      user: u.user,
    })),
    ...groups.map<ChatListEntry>((g) => ({
      type: "group",
      id: g.conversationId,
      name: g.name,
      online: g.memberIds.some(
        (mid) => mid !== ctx.myId && ctx.onlineUserIds.has(mid),
      ),
      isGroup: true,
      group: g,
    })),
  ];
}

function tier(e: ChatListEntry, unread: Record<string, boolean>): number {
  if (unread[e.id]) return 0;
  if (!e.isGroup && e.online) return 1;
  if (e.isGroup && e.online) return 2;
  return 3;
}

/** Returns a new array sorted by the shared tier rules (does not mutate input). */
export function sortChatEntries(
  entries: ChatListEntry[],
  { unread, lastActivity, friendIds }: SortContext,
): ChatListEntry[] {
  return [...entries].sort((a, b) => {
    const ta = tier(a, unread);
    const tb = tier(b, unread);
    if (ta !== tb) return ta - tb;
    // Same tier: friends outrank strangers before the tier's own tiebreak.
    const fa = friendRank(a, friendIds);
    const fb = friendRank(b, friendIds);
    if (fa !== fb) return fa - fb;
    if (ta === 0) {
      return (
        (lastActivity[b.id] ?? 0) - (lastActivity[a.id] ?? 0) ||
        a.name.localeCompare(b.name)
      );
    }
    return a.name.localeCompare(b.name);
  });
}
