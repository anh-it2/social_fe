import { getFeedSocket } from "../socket";
import { useAuthStore } from "@/feature/auth/stores/auth.store";

/**
 * Fire-and-forget feed announces. Called *after* the REST write resolves
 * (persist-then-announce) so the DB is already authoritative; this only asks
 * other clients to refetch. No-ops when logged out / disconnected.
 */
function canEmit(): boolean {
  return useAuthStore.getState().isLoggined;
}

export function emitFeedPublish(id: string): void {
  if (!canEmit()) return;
  const socket = getFeedSocket();
  if (socket?.connected) socket.emit("feed:publish", { id });
}

export function emitFeedUpdate(id: string): void {
  if (!canEmit()) return;
  const socket = getFeedSocket();
  if (socket?.connected) socket.emit("feed:update", { id });
}

export function emitFeedRemove(id: string): void {
  if (!canEmit()) return;
  const socket = getFeedSocket();
  if (socket?.connected) socket.emit("feed:remove", { id });
}
