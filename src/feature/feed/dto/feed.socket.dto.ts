// Mirrors social-socket-server/src/feature/feed/dto/feed.dto.ts 1:1.
// social-platform-be (REST) is the source of truth for a post; the socket
// only fans out a change signal, so the payload is intentionally minimal
// (just the id) — receivers refetch the server-ordered feed.

export interface FeedPostPayload {
  id: string;
}

export interface FeedRemovePayload {
  id: string;
}

export interface FeedClientToServerEvents {
  "feed:publish": (post: FeedPostPayload) => void;
  "feed:update": (post: FeedPostPayload) => void;
  "feed:remove": (data: FeedRemovePayload) => void;
}

export interface FeedServerToClientEvents {
  "feed:new": (post: FeedPostPayload) => void;
  "feed:update": (post: FeedPostPayload) => void;
  "feed:remove": (data: FeedRemovePayload) => void;
}
