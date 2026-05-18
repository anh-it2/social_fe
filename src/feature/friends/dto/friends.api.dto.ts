/**
 * Friends REST wire shapes. Match social-platform-be friend.model.ts /
 * friend.service.ts 1:1. The proxy unwraps the BE `{ success, data }`
 * envelope; these types describe the *clean* body the browser receives
 * from our same-origin /api/friends route handlers.
 */

import type { FriendStatus } from "./friends.dto";

/** One person in a friend/request list (BE FriendPerson). */
export interface FriendPersonDTO {
  id: string;
  name: string;
  email: string;
  /** ISO string over the wire (BE Date is JSON-serialized). */
  createdAt: string;
  avatarUrl: string;
}

/** BE friend.service.ts FriendsSnapshot. */
export interface FriendsSnapshotDTO {
  friends: FriendPersonDTO[];
  incoming: FriendPersonDTO[];
  outgoing: FriendPersonDTO[];
}

/** GET /api/friends → unwrapped body. */
export interface FriendsSnapshotResponseDTO {
  snapshot: FriendsSnapshotDTO;
}

/** GET /api/friends/status/:userId → unwrapped body. */
export interface FriendStatusResponseDTO {
  status: FriendStatus;
}
