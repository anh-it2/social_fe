import { Socket } from "socket.io-client";
import { getNamespaceSocket } from "@/socket/client/manager";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import {
  FeedClientToServerEvents,
  FeedServerToClientEvents,
} from "./dto/feed.socket.dto";

export type FeedSocket = Socket<
  FeedServerToClientEvents,
  FeedClientToServerEvents
>;

export function getFeedSocket(): FeedSocket {
  const { userId, userName } = useAuthStore.getState();
  return getNamespaceSocket<FeedSocket>("/feed", { userId, userName });
}

let initialized = false;

export function initFeed() {
  if (initialized) return;
  initialized = true;
  getFeedSocket();
}

export function disposeFeed() {
  initialized = false;
}
