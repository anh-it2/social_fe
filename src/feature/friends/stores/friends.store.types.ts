import type { FriendStatus, PersonDTO } from "../dto/friends.dto";

export interface FriendsState {
  /** id -> person catalog (name, mutuals, etc.) */
  people: Record<string, PersonDTO>;
  /** id -> my relationship to them */
  status: Record<string, FriendStatus>;
  /** notification ids of friend-requests already materialized (dedupe) */
  processedRequests: Record<string, true>;

  /** Internal mutators — call these from the service adapter only. */
  _upsertPerson: (person: PersonDTO) => void;
  _setStatus: (id: string, status: FriendStatus) => void;
  /**
   * Replace the relationship graph with an authoritative server snapshot
   * (friends.api init). `status` is rebuilt wholesale so a friendship the
   * other side removed disappears; `people` is merged (keeps presence-known
   * names); `processedRequests` is untouched (notification-bridge dedupe).
   */
  _hydrateFromSnapshot: (snap: {
    friends: PersonDTO[];
    incoming: PersonDTO[];
    outgoing: PersonDTO[];
  }) => void;
  /**
   * Materialize an incoming friend request that arrived as a
   * `friend_request` notification. Idempotent per notification id (so the
   * notification:list replay on every reconnect can't resurrect a request
   * the user already accepted/rejected). Only creates the edge when there
   * is no existing relationship.
   */
  _ingestFriendRequest: (
    notificationId: string,
    actorId: string,
    actorName: string,
  ) => void;
  /**
   * Reconcile the sender side when the recipient resolves the request the
   * other way: a `friend_accept`/`friend_reject` notification arrives back.
   * "accepted" -> the edge becomes "friends"; "rejected" -> a still-pending
   * "requested" edge is cleared to "none". Idempotent per notification id.
   */
  _ingestFriendResolution: (
    notificationId: string,
    actorId: string,
    actorName: string,
    outcome: "accepted" | "rejected",
  ) => void;
}
