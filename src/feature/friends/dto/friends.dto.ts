/**
 * Friend-relationship DTOs. Shape kept backend-agnostic so the mock adapter
 * and a future real API/socket adapter exchange the same objects.
 */

export type FriendStatus =
  | "none" // no relationship
  | "requested" // I sent a request, awaiting their response
  | "incoming" // they sent me a request, awaiting my response
  | "friends"; // mutually connected

export interface PersonDTO {
  id: string;
  name: string;
  avatarUrl?: string;
  mutualFriends: number;
  /** suggestion reason e.g. "Works at Meta" */
  reason?: string;
  location?: string;
  /** relative time the incoming request arrived, e.g. "2d" */
  requestedAt?: string;
}

/** A person plus my current relationship to them. */
export interface FriendEdge {
  person: PersonDTO;
  status: FriendStatus;
}

/** Full snapshot returned by FriendsService.list(). */
export interface FriendsSnapshot {
  friends: PersonDTO[];
  incoming: PersonDTO[];
  suggestions: PersonDTO[];
  /** ids I have sent a request to (still pending) */
  sentIds: string[];
}
